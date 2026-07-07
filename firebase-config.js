/* =========================================================================
   FIREBASE CONFIG — a felhő-szinkronhoz.
   Amíg ez sablon marad (PASTE...), a szinkron KI van kapcsolva, és az app
   teljesen működik helyben. Bekapcsolás: lásd JAVITASOK.md / Súgó.
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

/* Opcionális: e-mail értesítés a visszajelzésekről egy INGYENES Google Apps Script
   webhookon át (nem kell Firebase billing). Ha üresen hagyod, a visszajelzés csak a
   Firestore `feedback` kollekcióba kerül (a konzolból olvasható). Beállítás: JAVITASOK.md. */
window.FEEDBACK_WEBHOOK = "";
