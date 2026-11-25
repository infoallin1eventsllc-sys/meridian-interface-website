/* Meridian Live Cards: where the service lives. `enabled` stays false until the database part is switched on;
   until then the Studio saves on the device only and nothing is sent anywhere. The key is the public (publishable) one. */
window.LIVE_CARDS_CONFIG={enabled:false,billing:false,url:'https://glzodwhyavexpuusbqjy.supabase.co',key:'',bucket:'live-cards',
  site:'https://meridianinterface.com',maxVideoMB:25,maxVideoSeconds:30,maxImagePx:1800,
  // appOrigin: when the app gets its own address (for example 'https://cards.example.com'), put it here and in `site`.
  // The Studio and card pages then refuse to run anywhere else and send the visitor to that address, so sign-ins only ever live there.
  appOrigin:'',
  // humanCheck: a Cloudflare Turnstile site key. When set, asking for a sign-in code needs a passed check.
  // It also needs the security policy for /studio/ to allow challenges.cloudflare.com (see docs/LIVE-CARDS.md).
  humanCheck:''};
