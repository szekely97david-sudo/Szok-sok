# Trellis — Ciklus modul (1. fázis) + „Mi újult meg?" — 2026-07-22

## Mi épült meg

### 1. „Mi újult meg?" — közérthető változásnapló
- Frissítés után az **első futáskor** (a nyitó-animáció után) egy modal jön fel,
  ami **hétköznapi nyelven** elmondja, mi változott — nem fejlesztőknek.
- Mechanizmus: `CHANGELOG` tömb (verziószámozott bejegyzések), a `sl_changelog_seen`
  localStorage-kulcs jegyzi, meddig látta a felhasználó. Új telepítőnek NEM ugrik fel
  (csak meglévő felhasználónak, aki frissít). Minden jövőbeli kiadásnál: adj egy új
  `{v:2, title, items:[…]}` bejegyzést a `CHANGELOG`-hoz.
- Bármikor újranézhető: **Fiók → Alkalmazás → „✨ Mi újult meg?"**.

### 2. Ciklus (menstruációs naptár) modul — 1. fázis
- **Bekapcsolható a Fiók fülről** („🌸 Ciklusnaptár bekapcsolása"), pontosan mint a
  Biblia-modul. Kikapcsolva nincs Ciklus fül, semmi más nem változik.
- Bekapcsolva megjelenik a **Ciklus** alsó fül. Tartalma (fentről le):
  - **Áttekintő kártya:** aktuális fázis + ciklusnap, következő menstruáció becslése
    (sávval, ha a ciklus változékony). Fő gomb: **„🩸 Most kezdődött a menstruációm"**
    (folyamatban lévő menstruációnál: **„A menstruációm véget ért (ma)"**).
  - **Naptár:** havi nézet. A rögzített menstruáció **tömör piros**, a becsült
    következő **szaggatott**, a termékeny ablak **halvány** (elrejthető). Nap-koppintás
    → **nap-belépés** ablak.
  - **Statisztika:** átlagos ciklushossz (mediánból), átlagos menstruáció-hossz,
    rögzített ciklusok száma, ingadozás + a legutóbbi ciklusok listája.
  - **Tudnivalók a ciklusról:** rövid, curált, tendencia-nyelvű alapozó.
  - **Jogi/egészségügyi keret** a fül alján: nem orvostechnikai eszköz, nem
    diagnosztizál, a termékeny-ablak becslés nem fogamzásgátló.
- **Nap-belépés ablak** (napra koppintva): „Menstruációs nap" ki/be kapcsoló,
  vérzés-erősség, tünetek, sóvárgás, súly, jegyzet. **Hangulat SZÁNDÉKOSAN nincs**
  benne (külön modul lesz).
- **Rögzítés kézzel:** a menstruáció kezdetét/végét a felhasználó jelöli; a naptárban
  bármelyik nap egyenként is menstruációs napnak jelölhető/visszavonható (szükség
  esetén szét is vág egy tartományt).
- **Előrejelzés a SAJÁT adatból:** medián ciklushossz, ovulációt **visszafelé**
  becsüli (következő menstruáció − 14 nap, állítható luteális hossz). <2 rögzített
  ciklusnál nincs dátum-jóslat („még tanuljuk"). Nagy szórásnál sáv + „rendszertelen"
  jelzés. Fogamzásgátló-mód esetén nincs természetes becslés.
- **Szinkron/export:** az `S.cycle` az `S` része → a meglévő egygombos export/import
  és a Firebase-szinkron **automatikusan** viszi. (Füstteszttel ellenőrizve.)

## Technikai
- `S.version` 9 → **10**, új `S.cycle` séma (`normCycle`, migráció); régi adat érintetlen,
  a `szintlepo3` kulcs változatlan → nincs adatvesztés.
- `sw.js` cache-verzió **v47 → v48**; `APP_VERSION` v9 → **v10**.
- Böngésző-füstteszt zöld: syntax OK, computeCycle (medián/fázis/ovuláció), period
  start/end/split, import-roundtrip, minden fül renderel, 0 konzolhiba.

## Feltöltés (GitHub Pages, git push)
1. `index.html`, `sw.js`, `JAVITASOK_ciklus.md` felmegy.
2. Az appban **frissíts kétszer** (Frissítés gomb → új SW aktiválás → újratöltés).
3. Ellenőrzés: felugrik-e a „Mi újult meg?"; Fiók → Ciklusnaptár bekapcsolása →
   Ciklus fül → „Most kezdődött" → naptár/nap-belépés/statisztika.

## Hátralévő (a felhasználó kérése alapján)
- **App-szintű jelszó/PIN** — a felhasználó kérte, de KÉSŐBBRE. Nem a ciklus-modulra,
  hanem az **egész alkalmazásra** kell (indításkor kérje). Külön kör.
- 2. fázis: diétás/egészség réteg + ciklus-tudatos súlynézet.
- Külön **hangulatkövető modul** (a ciklusból szándékosan kihagyva).
