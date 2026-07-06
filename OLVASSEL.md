# Szintlépő — megosztható kiadás (v3)

Telefonos webapp (PWA). Helyi-először: minden működik felhő nélkül is, az adatok
a felhasználó eszközén maradnak. A felhő-szinkron és az AI-gomb opcionális.

## Fájlszerkezet (az oldalra ez megy)
```
szintlepo/
├─ index.html
├─ firebase-config.js     ← ide másolod a saját Firebase configod (vagy hagyd sablonként)
├─ manifest.webmanifest
├─ sw.js
└─ icons/ (4 png)
```
(A `firestore.rules` és ez az `OLVASSEL.md` NEM kell az oldalra — csak segédlet.)

## 1) Feltöltés és megosztás (GitHub Pages)
1. Új repó (pl. `szintlepo`), töltsd fel a fenti fájlokat.
2. Settings → Pages → Source: `main`, mappa `/root`. Mentés.
3. A kapott URL-t (`https://<felhasznalonev>.github.io/szintlepo/`) bárkinek elküldheted.
   Mindenki a saját eszközén, saját adataival használja.

## 2) Telepítés telefonra
- iPhone (Safari): Megosztás → „Kezdőképernyőhöz adás".
- Android (Chrome): ⋮ → „Alkalmazás telepítése". (Az appban is van „Telepítés" gomb.)

## 3) AI rubrika — ingyenes, mindenki a SAJÁT kulcsával
Nincs szerver, és neked nem kerül pénzbe. Minden felhasználó megadhatja a saját
ingyenes Gemini-kulcsát, ami csak az ő eszközén tárolódik.
1. aistudio.google.com → „Get API key" → új kulcs (ingyenes).
2. Az appban: Célok → AI rubrika → illeszd be a kulcsot → Kulcs mentése.
3. A cél-szerkesztőben minden almércénél: ✨ Generáld AI-val.
Kulcs nélkül is működik minden, csak a rubrikát kézzel írod.

## 4) Felhő-szinkron (opcionális, ingyenes) — ezt EGYSZER te állítod be
Egy Firebase-projektet hozol létre, és mindenki a saját Google-fiókjával lép be;
mindenki csak a saját adatait látja. Kb. 10 perc, kód nélkül:
1. console.firebase.google.com → Add project (ingyenes „Spark" terv elég).
2. Build → Firestore Database → Create (Production mode).
3. Build → Authentication → Get started → Google → Enable.
4. Authentication → Settings → Authorized domains → add hozzá:
   `<felhasznalonev>.github.io`
5. Project settings → General → Your apps → Web (</>) → másold a configot a
   `firebase-config.js`-be (a `PASTE_...` helyekre).
6. Firestore → Rules → másold be a `firestore.rules` tartalmát → Publish.
7. Töltsd fel újra a `firebase-config.js`-t a repóba.

Ezután: az appban Célok → Fiók & szinkron → Bejelentkezés Google-fiókkal.

> Megjegyzés: a felhő-részt éles Firebase-projekt nélkül nem lehetett letesztelni,
> ezért ha elsőre valami elakad (pl. „unauthorized domain" vagy szabály-hiba),
> küldd el a böngésző konzol hibáját, és egyből javítjuk.

## Adatvédelem
Minden adat a felhasználó eszközén él (localStorage). Bejelentkezés esetén a saját
Firestore-dokumentumába szinkronizál, amit csak ő ér el. A Gemini-kulcs sosem
szinkronizál és nem kerül a felhőbe — csak az adott eszközön tárolódik.

## Biztonsági mentés
Célok → Mentés → Exportálás: letölt egy JSON fájlt. Importálással visszatöltöd
vagy átviszed másik eszközre — felhő nélkül is.
