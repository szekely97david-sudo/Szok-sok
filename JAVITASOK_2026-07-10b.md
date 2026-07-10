# Trellis — javító kör (2026-07-10 / 2.)

## Splash — az „ikon a videó előtt" és a barna villanás
- **Megszűnt a sötétbarna villanás** a videó megjelenése előtt: a splash háttere és a videó
  háttere is a videó első kockájának **cream** színe (`#D5CFC8`), plusz `poster="splash-poster.jpg"`,
  így az első festés azonnal a videó kezdőképe.
- A telefon státuszsáv-színe (theme-color) is cream-re vált a splash alatt.
- **A videó előtt látott rózsaszín ikon** az **Android/Chrome saját PWA-indítóképe** (a telepített
  app „beégetett" indítóképe), nem a mi HTML-ünk. A `manifest.webmanifest` `background_color`/`theme_color`
  értékét cream-re állítottam, hogy ez is passzoljon — **de ez csak újratelepítés után frissül**
  a már telepített appban. Ha teljesen egységes indítást akarsz: **távolítsd el és telepítsd újra**
  az appot (a natív indítókép csak így veszi fel az új színt).

## Teendők — átalakított kezelés
- **Kijelölés → gomb:** a sorra koppintva már **csak kijelölsz** (nem lesz rögtön kész). Ha van
  kijelölt elem, megjelenik egy **„✓ Elvégezve"** gomb (+ „Mégse"), és azzal teszed át a kijelölteket
  az elvégzettek közé. (Az össz-haladás pont a kijelölt darabszám × 3.)
- **Elvégzettek megnyithatók** (ez korábban nem működött — hiányzott a gomb bekötése).
- **Vissza az elvégzettek közül:** minden kész elemnél „↩︎ Vissza" gomb — egy koppintással
  visszakerül a nyitott teendők közé.
- **Mappára szűrve:** egy mappát választva az **elvégzettek is csak az adott mappáéi** (nem
  látszik minden mappában az összes).

## Célok — miértek almércénként + látható haladás
- **Per-almérce „miértek" kapcsoló:** minden pontozott almércénél külön beállítható „Igen/Nem",
  hogy bukáskor/sikernél rákérdezzen-e. (A cél-szintű kapcsoló megmarad mesterkapcsolóként.)
- **Cél-szintű haladás visszakerült a Célok fülre:** minden cél-kártyán szint-pill (Lv) + haladássáv
  + „következő szintig" — az össz-haladás (Össz-haladás fejléc) emellett a nagyobb, plusz metrika.

## Kiadás
- `sw.js` cache: **v21 → v22**; app-shellbe került a `splash-poster.jpg`.
- Böngészős teszt **0 hibával**: kijelölés (nem old meg) → Elvégezve gomb (meta +6) → elvégzettek
  nyithatók → Vissza → mappa-szűrt elvégzettek; almérce Igen/Nem kapcsoló; Célok-kártya haladássáv.
- A fájl `</html>`-lel zár, mérete nőtt (144,6 → 148,4 KB); a Firebase-modul ép.

## Feltöltés után
Indítsd újra az appot **kétszer** (vagy zárd be–nyisd újra), hogy a **v22** SW aktiválódjon.
A rózsaszín natív indítóképhez: **töröld és telepítsd újra** az appot.

## Még nyitott (következő kör) — nagyobb átalakítás
Kérted, hogy a **gyors napi/heti célt** vegyük ki, és a **Teendők** kapjanak ütemezést
(ismétlődő teendő, dátum, sőt időkeret pl. „hétvégén"). Ez nagyobb, adat- és pontozás-érintő
átalakítás — külön körben, egyeztetett terv szerint építem meg (lásd a chat-üzenetet).
