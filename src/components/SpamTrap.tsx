/**
 * A form field people never see and spam bots fill in.
 *
 * Form-filling bots complete every input they find. A booking that arrives with this one filled
 * is not sent (see `caughtBySpamTrap`), and the bot is shown the usual confirmation so it has no
 * reason to try again. It sits off-screen rather than `display: none`, which some bots know to
 * skip, and it is out of the tab order and hidden from screen readers so no person lands in it.
 */
export const SpamTrap = () => (
  <div aria-hidden="true" className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden">
    <label>
      Leave this field empty
      <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
    </label>
  </div>
);

/** True when the hidden field was filled in, which a person never does. */
export const caughtBySpamTrap = (form: HTMLFormElement) =>
  String(new FormData(form).get('website') ?? '').trim() !== '';
