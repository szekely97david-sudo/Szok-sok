/* =========================================================================
   FIREBASE CONFIG — a felhő-szinkronhoz.
   Amíg ez sablon marad (PASTE...), a szinkron KI van kapcsolva, és az app
   teljesen működik helyben. Ha be akarod kapcsolni:

   1) console.firebase.google.com → Add project (ingyenes).
   2) Bal oldalt: Build → Firestore Database → Create (Production mode).
   3) Build → Authentication → Get started → Sign-in method → Google → Enable.
   4) Authentication → Settings → Authorized domains → add hozzá a
      GitHub Pages domained: pl. felhasznalonev.github.io
   5) Project settings (fogaskerék) → General → "Your apps" → Web app (</>) →
      regisztráld, és másold ide az alábbi configot.
   6) Firestore → Rules fülre másold be a firestore.rules tartalmát, Publish.

   Ezután az appban: Célok → Fiók & szinkron → Bejelentkezés Google-fiókkal.
   ========================================================================= */
window.FIREBASE_CONFIG = {
  apiKey: "AIzaSyBz6x1EjELzfhUVjeo-UInBg21TIaoLZIg",
  authDomain: "szokasok-5847c.firebaseapp.com",
  projectId: "szokasok-5847c",
  storageBucket: "szokasok-5847c.firebasestorage.app",
  messagingSenderId: "401282754846",
  appId: "1:401282754846:web:a417fb6859bd4b6c06810f",
  measurementId: "G-VMKK0RT798"
};
