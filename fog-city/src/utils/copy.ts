// Copy text, and say honestly whether it worked. The Clipboard API rejects in
// some browsers and embedded views; the textarea route covers most of those.
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard) { await navigator.clipboard.writeText(text); return true; }
  } catch { /* fall through to the older route */ }
  try {
    const ta = document.createElement('textarea');
    ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  } catch { return false; }
}

/** On a phone, hand the link to the system share sheet; elsewhere copy it. */
export async function shareLink(title: string, url: string): Promise<'shared' | 'copied' | 'failed'> {
  const touch = window.matchMedia('(pointer: coarse)').matches;
  if (touch && typeof navigator.share === 'function') {
    try { await navigator.share({ title, url }); return 'shared'; }
    catch (e) { if ((e as DOMException)?.name === 'AbortError') return 'shared'; }   // closing the sheet is a choice, not a failure
  }
  return (await copyText(url)) ? 'copied' : 'failed';
}
