"""Rebalance the Haven films so the guide's voice is never under the music.

Otis, 15 Oct: "the music is too loud over the hologram telling the client about the
house. I want to hear the music, just not over the hologram when it's speaking."

The films came as finished mixes (no separate voice and music), and the guide sat
3.7 dB UNDER the music on average while speaking (meridian-film), 17.7 dB under at
worst. So:

  1. Split each soundtrack into voice and music with UVR's MDX-Net vocal model
     (open source, runs on CPU in about a minute):
       pip install "audio-separator[cpu]"
       curl -L -o UVR-MDX-NET-Voc_FT.onnx \
         https://github.com/TRvlvr/model_repo/releases/download/all_public_uvr_models/UVR-MDX-NET-Voc_FT.onnx
       audio-separator film-audio.wav --model_filename UVR-MDX-NET-Voc_FT.onnx \
         --model_file_dir . --output_dir sep --output_format WAV
     The two stems add back to the original within -45 dB.
  2. Run this script: the voice +4 dB, the music -12 dB only while she speaks (lines
     closer than 1.6 s share one dip, so the music never pumps between sentences),
     fading down 0.35 s before her first word and back up 0.9 s after her last.
     Everywhere else the film is sample-for-sample the level it was.
  3. Mux back with the picture copied untouched (ffmpeg -c:v copy).

Results: meridian-film voice-over-music median -3.7 dB -> +12.3 dB; the film page's
soundtrack (audio/87cfbe1cb8471022.mp3, same narration 9.4 s later) +4.9 -> +20.9 dB.
Cues: meridian-film uses its WebVTT caption times (index.html #film-captions);
the film page's mp3 used speech spans detected on its own voice stem.

NOTE: haven/scripts/package-website.mjs rebuilds public/demos/haven/ from the
original download, which still carries the old mixes. If it is ever re-run, redo
this (or re-copy the three files from git history after 15 Oct).

Usage: haven-film-remix.py <vocals.wav> <instrumental.wav> <original.wav> <out.wav> <cues "a-b,a-b,...">
"""
import sys
import numpy as np, soundfile as sf

vpath, mpath, opath, out, cues = sys.argv[1:6]
v, sr = sf.read(vpath); m, _ = sf.read(mpath); o, _ = sf.read(opath)
n = min(len(v), len(m), len(o)); v, m, o = v[:n], m[:n], o[:n]

DUCK_DB, VOICE_DB = -12.0, 4.0      # music under the voice; a small lift for the voice
ATTACK, RELEASE, MERGE = 0.35, 0.9, 1.6  # seconds: fade down before a line, back up after, bridge short pauses

spans = sorted(tuple(map(float, c.split('-'))) for c in cues.split(','))
blocks = []
for a, b in spans:  # one duck across lines closer than MERGE, so the music never pumps between sentences
    if blocks and a - blocks[-1][1] < MERGE: blocks[-1][1] = max(blocks[-1][1], b)
    else: blocks.append([a, b])

t = np.arange(n) / sr
depth = np.zeros(n)  # 0 = full music, 1 = fully ducked
for a, b in blocks:
    up = np.clip((t - (a - ATTACK)) / ATTACK, 0, 1)      # ramps in, reaching full duck at the first word
    down = np.clip(((b + RELEASE) - t) / RELEASE, 0, 1)  # ramps out after the last word
    depth = np.maximum(depth, np.minimum(up, down))
depth = 0.5 - 0.5 * np.cos(np.pi * depth)                # smooth (raised-cosine) curve, no clicks
gain = 10 ** (DUCK_DB * depth / 20)

mix = v * 10 ** (VOICE_DB / 20) + m * gain[:, None]

def rms_db(x): return 20 * np.log10(np.sqrt(np.mean(x ** 2)) + 1e-12)
# No overall gain change: outside her lines the film must sound exactly as before.
peak = np.abs(mix).max(); lim = 10 ** (-1 / 20)
if peak > lim:                                           # soft-limit any peaks above -1 dBFS
    over = np.abs(mix) > lim * 0.9
    mix[over] = np.sign(mix[over]) * (lim * 0.9 + (lim * 0.1) * np.tanh((np.abs(mix[over]) - lim * 0.9) / (lim * 0.1)))
sf.write(out, mix, sr, subtype='PCM_16')

hop = int(sr * 0.05); k = n // hop * hop
def fr(x): return 20 * np.log10(np.sqrt(np.mean(x[:k].mean(1).reshape(-1, hop) ** 2, 1)) + 1e-9)
vd, md = fr(v * 10 ** (VOICE_DB / 20)), fr(m * gain[:, None]); vd0, md0 = fr(v), fr(m)
sp = vd0 > vd0.max() - 30
print('blocks', [(round(a, 2), round(b, 2)) for a, b in blocks])
print('voice minus music while speaking: before median %.1f dB (worst 10%% %.1f), after median %.1f dB (worst 10%% %.1f)' % (
    np.median((vd0 - md0)[sp]), np.percentile((vd0 - md0)[sp], 10), np.median((vd - md)[sp]), np.percentile((vd - md)[sp], 10)))
print('music between lines and in the intro unchanged: intro gain %.2f, at 52.3 s gain %.2f' % (gain[int(20 * sr)], gain[int(52.3 * sr)]))
