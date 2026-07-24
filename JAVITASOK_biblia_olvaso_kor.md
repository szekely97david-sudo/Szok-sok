# Biblia modul — olvasó/kvíz javító kör (2026-07-24)

**Verziók:** `sw.js` v53 → **v54**, `APP_VERSION` v15 → **v16**, changelog **v5**.
**Adatszerkezet:** nincs törő változás, nincs migráció.
Új, opcionális mezők: `S.bible.reader.mark = {id, v}` (vers-könyvjelző) és a terv
`order` harmadik értéke: `"free"`.

---

## 1. Kvíz — „📖 Mutasd a kontextust” nem dob ki az olvasóba

**Volt:** a gomb bezárta a kvízt, átváltott az Olvasó fülre — a kvízhez nem lehetett visszalépni.

**Lett:** a kontextus a kvíz-ablakon **belül** nyílik (`quizS.view="ctx"`):
- görgethető fejezet-szöveg (`.quiz-ctx`, max 52vh),
- a kérdés igehelye (`ref`) **kiemelve** (`quizCtxRange()` a „1Móz 1,16-19” alakot is érti),
  és automatikusan odagörget,
- `‹ / ›` nyilakkal a **szomszédos fejezetekbe** is át lehet olvasni (kiemelés csak a
  saját fejezetben),
- „‹ Vissza a kvízhez”, a ✕ **és a telefonos vissza-gesztus** is a kérdéshez tér vissza
  (a `goBack()` külön ágat kapott, a history-mélység pótolva).

## 2. Kvíz — „⚑ Hibás kérdés” indoklással

**Volt:** egy koppintás, „Jelentve” felirat, kész.

**Lett:** külön nézet (`quizS.view="report"`) a kvízen belül:
- mutatja a kifogásolt kérdést és az igehelyet,
- **szabadszöveges indoklás** (max 1000 karakter, nem kötelező),
- „Elküldöm és folytatom” / „Mégsem” — mindkettő **vissza a kérdéshez**,
- belépés nélkül nem toast-tal fejeli le, hanem elmagyarázza, hogy be kell lépni,
- elküldés után a gomb „⚑ Jelentve” (kvíz-menetre jegyezve).

A Firestore-ba küldött doksi bővült: `note`, `ref`, `qtext` (a `qid` marad a kulcs).
**A `firestore.rules` nem változott** — a szabály csak a `qid`-t validálja, az extra
mezőket engedi, tehát *nem kell újra publikálni*.

## 3. Olvasó — vers-könyvjelző („itt hagytam abba”)

- Bármelyik **versre koppintva** halvány kiemelést kap (`.bv.marked`), és elmentődik
  (`S.bible.reader.mark`). Ugyanarra a versre újra koppintva törlődik.
- A fejezet fölött sáv jelzi: „🔖 Itt hagytad abba: 12. vers” + Törlés.
- Az **Olvasó megnyitásakor** (fül vagy „Megnyitom az olvasóban”) az app **oda ugrik**,
  és a jelölt vershez görget (`bibleOpenReader()`).
- Ha az adott szakaszt olvasottnak jelölöd, a könyvjelző magától eltűnik.

## 4. Olvasó — „Ugrás N fejezettel” törölve

A gomb és a `prompt()`-os logika kikerült (a nyilak + könyv-választó marad).

## 5. „Ma” — nem ugrik át fejezeteket (1Mózes 3 → 5 hiba)

**Ok:** `bibleNextUnreadIdx()` a **kurzortól** kereste az első olvasatlant. Ha a kurzor
előreugrott (olvasóbeli `›`, könyv-választó, vagy a régi „mutasd a kontextust”), a köztes
fejezetek kiestek a napi listából.

**Javítás:** a terv haladása mindig a **legelső olvasatlan** egységtől megy (a kurzor
mostantól csak az olvasó pozíciója). Új `bibleSyncCursor()`: a kurzort csak akkor mozdítjuk,
ha a helye már olvasott — így nem rántja vissza a felhasználót olvasás közben.

## 6. Máshonnan olvasott fejezet beszámít, és lefaragja a mai adagot

- A „Ma” lista **minden rendereléskor újraszámolódik** (`bibleMaTargets`), és tartalmazza
  azt is, amit ma **soron kívül** jelöltél be.
- Amit máshol olvastál, elfogyasztja a napi keretet → a lista **végéről** annyival kevesebb
  marad (`buildDailyReading` a `bibleWordsToday`-jel számol).
- **Nullánál kevesebb nem lehet:** a sor eleje sosem ugrik át semmit, tehát végig tudni,
  hol tartasz.
- Külön magyarázó sor: „Ma 2 fejezet a soron kívül is megvan (≈ 4 perc) — …”.
- A „+ Következő fejezet” gombbal felvett tételek külön listában (`bibleMa.extra`) élnek,
  így az újraszámolás nem dobja el őket.

## 7. Új terv-típus: **Szabad sorrend** (`order:"free"`)

A Hagyományos / Kronologikus mellé harmadik gomb a tervezőben.

- **Nincs kötött napi lista** — csak napi **keret** (idő/szó) és céldátum; a korrekció
  (±1 napnyi) itt is működik, tehát az „egy év alatt végig” cél tartható.
- „Ma” lap: mai keret, teljesítettségi sáv, a ma bejelölt fejezetek (visszavonhatók),
  „📖 Megnyitom az olvasóban” + „📚 Könyv választása”.
- Új kártya: **„Mi van még hátra?”**
  - összes hiányzó fejezet + becsült idő,
  - 💡 tipp: melyik elkezdett könyvet lehet leghamarabb befejezni,
  - **Elkezdett könyvek** listája a legkevesebb hátralévővel elöl, „már csak 2!” kiemeléssel,
  - lenyitva: „Még el sem kezdted” és „Kész könyvek”,
  - könyvre koppintva az olvasó fejezet-rácsa nyílik meg.
- Szabad módban a párhuzamos ÓSZ+ÚSZ kapcsoló rejtve (nincs értelme), a „Következő napok”
  előrejelzés nem jelenik meg.

---

## Ellenőrzés (böngészős füstteszt, izolált másolat, placeholder firebase-config)

0 konzolhiba. Ellenőrizve: fejezet-kihagyás javítva (kurzor GEN.10, lista mégis GEN.4-től),
soron kívüli olvasás lefaragja a lista végét, vers-könyvjelző mentése/kiemelése/visszatérése,
olvasottnak jelölésnél a könyvjelző törlése, kvíz kontextus (kiemelés + lapozás + vissza),
jelentés indoklással (belépve és belépés nélkül is), vissza-gesztus a kvíz alnézeteiből,
szabad sorrendű terv létrehozása és „Mi van még hátra?” lista, kronologikus terv változatlanul jó.

## Feltöltés

`index.html` + `sw.js` (a többi fájl változatlan). A `firestore.rules` **nem** igényel újrapublikálást.
