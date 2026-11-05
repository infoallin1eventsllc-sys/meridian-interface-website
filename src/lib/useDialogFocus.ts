import { useEffect, type RefObject } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * What a dialog owes a keyboard user, the same way the Lightbox does it: focus moves in when it
 * opens (unless a field already took it with autoFocus), Tab and Shift+Tab stay inside, and focus
 * goes back to whatever opened it when it closes. A dialog opened on top of this one (the
 * Lightbox over a project panel) handles its own keys.
 */
export function useDialogFocus(ref: RefObject<HTMLElement | null>, open: boolean) {
  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    const node = ref.current;
    if (node && !node.contains(document.activeElement)) {
      (node.querySelector<HTMLElement>(FOCUSABLE) ?? node).focus();
    }
    const onKey = (e: KeyboardEvent) => {
      const dialog = ref.current;
      if (e.key !== 'Tab' || !dialog) return;
      const active = document.activeElement;
      if (active && !dialog.contains(active) && active.closest('[role="dialog"]')) return;
      const items = [...dialog.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => el.getClientRects().length > 0);
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && (active === first || !dialog.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !dialog.contains(active))) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      if (opener && document.contains(opener)) opener.focus();
    };
  }, [open, ref]);
}
