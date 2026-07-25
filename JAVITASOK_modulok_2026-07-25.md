# Trellis — modul-fiók (bal oldali ☰ menü) · 2026-07-25

**Verzió:** app `v17`, service worker `v55`, adatverzió marad `10` (additív mező: `S.ui`)

## Mi változott

### 1. Bal oldali modul-fiók (☰)
- Az alsó sáv **bal szélén** ☰ gomb (a régi „Ma” helyén). Koppintásra — vagy a képernyő
  **bal szélétől behúzva** — kinyílik a modul-fiók (a képernyő ~78%-a, max 286 px).
- A modulok **alulról felfelé** sorakoznak (a lista alja a hüvelykujjhoz legközelebb),
  legalul a **Fiók** külön, elválasztva.
- Csak a **bekapcsolt** modulok élesek; a még nem kész modulok halványan,
  „fejlesztés alatt” jelöléssel — rájuk koppintva rövid leírás nyílik.
- Bezárás: kívülre koppintás, balra húzás, vagy a telefon vissza-gesztusa
  (a fiók a meglévő `pushScreen`/`goBack` rendszerbe illeszkedik, nem lép ki az appból).

### 2. Modul-alapú alsó navigáció
Az alsó sáv mindig az **éppen nyitott modul** füleit mutatja:

| Modul | Alsó fülek |
|---|---|
| 🏠 Kezdőlap | *(nincs fül — csak ☰)* |
| 🌱 Szokáskövetés | Ma · Célok · Statisztika |
| 📖 Bibliaolvasás | Ma · Olvasó · Statisztika |
| 🌸 Ciklusnaptár | Ma · Naptár · Statisztika |
| ⚙️ Fiók | *(nincs fül — csak ☰)* |

- A **Biblia** modulban a Ma/Olvasó/Statisztika váltó a lap tetejéről az alsó sávba került.
- A **Ciklus** modul három fülre bomlott (eddig egy hosszú lap volt): a Ma fülön az
  áttekintés + tudnivalók, külön a Naptár és a Statisztika. Az áttekintés
  „📅 Naptár / 📊 Statisztika” gombjai már fület váltanak, nem görgetnek.
- Minden modul **emlékszik az utoljára nézett fülére**, oda tér vissza.

### 3. Kezdőlap (modul-független „Ma”)
Egy képernyőn az összes bekapcsolt modul mai állása:
- Össz-haladás (szint, pont) — koppintásra a részletes áttekintő,
- Szokáskövetés: „x/y mai cél rögzítve · n nyitott teendő”,
- Biblia: „x/y mai szakasz kész”,
- Ciklus: fázis · ciklusnap · hány nap a következő menstruációig.
Bármelyik kártya egy koppintással beviszi az adott modulba.

### 4. Fiók → 🧩 Aktiválható modulok
- A régi külön „Bibliaolvasás” és „Ciklus” be-/kikapcsoló szekciók **kikerültek** a Fiókból;
  helyettük egy **Modulok** szekció visz a részletes panelre.
- A panelen minden modul: emoji, név, állapot-címke (alap modul / bekapcsolva /
  kikapcsolva / fejlesztés alatt), leírás, be-ki kapcsoló és **▲▼ sorrend**.
  A panel felülről lefelé ugyanazt a sorrendet mutatja, amit a fiók alulról felfelé.
- **Indításkor ez nyíljon meg**: bármelyik bekapcsolt modul vagy „az utoljára használt”.
  Alapérték: Kezdőlap.

### 5. Előkészített (fejlesztés alatt) modulok
🍎 Kalóriaszámláló · 🏋️ Edzésnapló · 🎯 Szokás-kihívások — a fiókban halványan látszanak,
koppintásra leírás + „hamarosan”.

## Technikai jegyzetek
- Új állapot: `S.ui = { modOrder:[…], start:"home"|modulId|"last" }` — `normUi()` normalizálja,
  ismeretlen/hiányzó modulokat pótol, tehát régi mentés és régebbi eszköz is elfér mellette.
  Adatverzió NEM változott (tisztán additív), a felhő-szinkron érintetlen.
- Modul-regiszter: `MODULES` (+ `MOD_ACCOUNT`) a fájl elején, a `blank()` előtt — mert a
  `blank()/normalize()` betöltéskor hivatkozik rá (TDZ elkerülése).
- Az alsó sáv mostantól **dinamikusan** épül (`renderNav()`), a gombkötés is ott történik.
- Az utoljára használt modul eszköz-lokálisan (`sl_lastMod`) tárolódik, nem szinkronizál.
- A fiók megnyitásának animációja `setTimeout`-tal indul, nem `requestAnimationFrame`-mel:
  nem rajzolt (háttérbe tett) lapon a rAF nem fut le, és a fiók „nyitva, de láthatatlan”
  maradhatna.

## Feltöltés
`index.html` + `sw.js` (v55). Az appot **kétszer** frissítsd / indítsd újra,
hogy a service worker az új app-shellt vegye elő.
