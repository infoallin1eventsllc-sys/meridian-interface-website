// True on the copy hosted at meridianinterface.com/demos/frame-shop/.
//
// That copy has no server, so a booking or a message goes nowhere. The Frame
// Shop is a real shop, so a real customer can land on it: every screen that
// would otherwise say "Paul has received your request" says plainly that
// nothing was sent and gives the shop's phone number instead.
export const IS_DEMO_COPY = import.meta.env.BASE_URL.startsWith('/demos/');
