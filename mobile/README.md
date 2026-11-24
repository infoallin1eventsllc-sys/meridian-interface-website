# Live Cards as a store app

The Studio at /studio/ is already an installable web app. This folder wraps the same files for the App Store and Google Play with Capacitor. Nothing here is needed for the web version.

## Build (on a Mac with Xcode, and Android Studio for Google Play)
    node tools/build-live-cards-app.mjs      # fills mobile/www
    cd mobile
    npm init -y && npm i @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android
    npx cap add ios && npx cap add android
    npx cap sync
    npx cap open ios        # then Archive and upload in Xcode
    npx cap open android

## Before submitting
- Accounts: Apple Developer Program and Google Play Console, both paid by the owner directly to Apple and Google.
- Icons and launch screen: start from public/studio/icon-512.png (the mark on a light plate; never redraw or recolor it).
- Privacy policy address: https://meridianinterface.com/live-cards/privacy/ (finish and approve the draft first).
- Store rules this app is built for:
  - People can delete their account inside the app (Share tab).
  - Cards are made by users, so there is a "Report this card" link, the owner can block a card, and the terms say what is not allowed.
  - Sign-in is by email code only. If Google or Facebook sign-in is ever added, Apple also requires Sign in with Apple.
  - If a paid plan is sold inside the iPhone app, Apple requires its own in-app purchase and takes a share. Selling only on the website avoids that, but the app then may not link to it. Decide this before submitting.
  - A store app that is only a wrapped website can be rejected. The Studio's photo and video picker, share sheet and offline start are what make it an app; mention them in the review notes.
