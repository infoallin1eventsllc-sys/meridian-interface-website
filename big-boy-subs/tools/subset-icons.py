#!/usr/bin/env python3
"""
Subset the Material Symbols icon font to the icons this app actually uses.

Why this exists: the app names icons as ligature TEXT (<span class="material-
symbols-outlined">cookie</span>), so an icon missing from the font does not
fall back to a blank — the browser prints the word "cookie" on the page. That
shipped once, on the Menu screen, because the icon names there are set by
ternaries the old regex could not see:

    {isFav ? 'favorite' : 'favorite_border'}
    const icon = ... ? 'cookie' : 'local_drink';

So this does not try to parse how an icon is chosen. It takes EVERY quoted
lowercase token in the source as a candidate, then keeps the ones the font
actually defines as a ligature. Guessing wrong costs a few KB; missing one
puts a word on the page.

    python3 tools/subset-icons.py        (needs fonttools + brotli)
"""
import glob, os, re, subprocess, sys, urllib.request
from fontTools.ttLib import TTFont

UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36'
CSS = ('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined'
       ':opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200')
HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def fetch(url, path):
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    with urllib.request.urlopen(req) as r, open(path, 'wb') as f:
        f.write(r.read())


def ligatures(path):
    """Map each icon name the font defines to the glyph that ligature produces."""
    f = TTFont(path)
    rev = {}
    for t in f['cmap'].tables:
        for cp, gn in t.cmap.items():
            rev.setdefault(gn, chr(cp))
    out = {}
    for lookup in f['GSUB'].table.LookupList.Lookup:
        for st in (getattr(s, 'ExtSubTable', s) for s in lookup.SubTable):
            for first, ligs in getattr(st, 'ligatures', {}).items():
                for lg in ligs:
                    comps = [first] + list(lg.Component)
                    if all(c in rev for c in comps):
                        # The font maps both letter cases to the same glyph, so
                        # a reconstructed name comes back uppercase. Ligatures
                        # match either way; normalise so lookups are predictable.
                        out[''.join(rev[c] for c in comps).lower()] = lg.LigGlyph
    return out


def main():
    os.chdir(HERE)
    fetch(CSS, '/tmp/ms.css')
    url = re.search(r'url\((https://[^)]+)\)', open('/tmp/ms.css').read()).group(1)
    fetch(url, '/tmp/ms-full.woff2')

    defined = ligatures('/tmp/ms-full.woff2')
    src = ''.join(open(p).read() for p in glob.glob('src/**/*.ts*', recursive=True))
    src += open('index.html').read()
    candidates = set(re.findall(r"['\"`]([a-z][a-z_0-9]{2,40})['\"`]", src))
    candidates |= set(re.findall(r'material-symbols-outlined[^>]*>\s*\{?\s*([a-z_0-9]{3,})', src))
    used = sorted(candidates & set(defined))
    if not used:
        sys.exit('no icons matched — the font or the source moved')

    os.makedirs('public/fonts', exist_ok=True)
    out = 'public/fonts/material-symbols.woff2'
    # Name the icon glyphs explicitly and switch off layout closure. Asking by
    # --text alone drags in every ligature reachable from those letters, which
    # is nearly the whole 3.5MB font; this keeps only the icons listed.
    glyphs = ','.join(sorted({defined[n] for n in used}))
    r = subprocess.run(['pyftsubset', '/tmp/ms-full.woff2', '--text=' + ' '.join(used),
                        '--glyphs=' + glyphs, '--layout-features=*', '--no-layout-closure',
                        '--flavor=woff2', '--output-file=' + out],
                       capture_output=True, text=True)
    if r.returncode:
        sys.exit('pyftsubset failed: ' + r.stderr[-400:])

    shipped = ligatures(out)
    missing = [n for n in used if n not in shipped]
    if missing:
        sys.exit('subset dropped: ' + ', '.join(missing))
    print(f'{len(used)} icons, {os.path.getsize(out) // 1024}KB, all present')


if __name__ == '__main__':
    main()
