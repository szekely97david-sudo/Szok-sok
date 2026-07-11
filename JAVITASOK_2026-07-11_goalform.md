# Trellis — cél-űrlap refaktor + avoid/tally + CLAUDE_CODE Ma/meta (2026-07-11)

Bázis: a **régi, éles `index.html`** (nem a v2 — abban Sonnettel elromlottak funkciók).
A `CLAUDE_CODE_PROMPT.md`-t specifikációként használtam, a v2 kódját nem másoltam át
(csak a prompt által adott kész kódot: `metaLevelIncrement`, base64 szint-ikon, videó-overlay).
Backup: `_backup_preintegration_20260711_113946/`.

## Mi változott

### A) Adatmodell + pontozás
- `normCad`: két új ütemezés — **`tally`** (eseményalapú számláló) és **`avoid`** (fordított naplózás).
- `normGoal`: **`tags: []`** (címkék) + mércénkénti **`progression`** (dinamikus, idővel növekvő célérték) — `normProg()`.
- Teendők: új **`due`** mező (`YYYY-MM-DD` vagy `null`), migrálva `due:null`-lal.
- `version` **4 → 5**, additív migrációval (a meglévő localStorage/Firebase állapot sértetlen — nincs felülírás).
- Új **meta-szintgörbe**: `metaLevelIncrement`/`metaFloorFor`, `metaLevelBase 120 → 12`.
  Küszöbök: L2=12, L5=42, L10=122, L20=292, L30=522.

### B) Cél-űrlap refaktor (Célok fül)
- 3 natív `<details>` **harmonika**: Alapadatok / Időzítés és ütemezés / Mérés és almércék.
- **Szerep**: natív `<input type="radio">` (Pontozott ↔ Csak követett).
- **Adattípus**: natív `<select>` (Igen/Nem, Skála, Mennyiség, Idő).
- **Feltételes mező**: „Mennyiség" esetén megjelenik a **Mértékegység** szövegmező.
- **Címke-chipek** (Enterrel), **dinamikus cél** kapcsoló (+ ütem + plafon).
- **Irány mércénként** (nincs külön cél-szintű mező → nincs duplikáció); a cél iránya a fő mércéből derivált.
- Megőrizve: rubrika + AI-generálás, skála bukás/győzelem küszöbök, „miértek" rákérdezés.
- **Javítva a „bejelöléskor a tetejére ugrik" viselkedés**: az űrlap újrarajzolása már nem görget (scroll csak nyitáskor).

### C) Ma fül — az avoid/tally naplózása
- **avoid**: nagy „🔥 X napja tiszta" streak + „Tiszta ✓ / Megcsúsztam" gomb.
  A nap **alapból teljesített** (nem kell naponta jelölni) — csak a megcsúszást naplózod, az töri a szériát.
  Új avoid célnál a `startDate` automatikusan a mai nap (hogy a streak reálisan nőjön).
- **tally**: „+1 / −1" számláló a napi darabszámhoz, **pont nélkül** (csak követett). Mély statisztika a Haladás fülre szánva.

### D) CLAUDE_CODE Ma/meta rész
- **Szegmens-váltó (Napi/Heti) eltávolítva.** Egységes lista: **Mért célok** + (Rugalmas célok) + **Teendők**.
  A gyors napi/heti UI kikerült a Ma fülről; a `quickDaily/quickWeekly` adat és pontszámítás **megmaradt** (visszafelé kompat.).
  MEGJEGYZÉS: a prompt szerint a rugalmas célok „eltűntek volna" a Ma fülről — ezt **nem** így csináltam,
  a rugalmas célok inline maradnak (nincs funkcióvesztés).
- Alsó sáv: egységes **„Napi pont"** = mért napi + teendő-alapú pont.
- Össz-haladás szöveg: „…minél sikeresebben teljesíted a céljaid és teendőid, annál több pontot kapsz".
- **2. szint elérésekor**: teljes képernyős videó-overlay (`assets/meta-level2.mp4`, hanggal, kihagyással), utána a kártya
  jobb felső sarkában a beágyazott base64 ikon (≥2. szinttől).
- **Cél szintlépése**: a szint-jelvény körül **mini-konfetti** (toast helyett).
- Cél-kártya: „{pont} pont · {hátralévő} a köv. szintig" jelvény.
- Teendők: **dátum-mező** a hozzáadás-sorban és minden nyitott teendő-soron; a Ma fülön a gyors hozzáadás a böngészett napra állítja a `due`-t.

### E) Kiadás
- `sw.js` cache-verzió: **`v22` → `v23`**.
- Új mappa+fájl: **`assets/meta-level2.mp4`** (a `Downloads`-ból bemásolva).

## Feltöltés (amit fel kell tölteni)
- `index.html` (módosított)
- `sw.js` (v23)
- **`assets/meta-level2.mp4`** (ÚJ — az `index.html` mellé, `assets/` mappába)

## Telepítés után
- Frissíts **kétszer** / indítsd újra az appot (a service worker új cache-e miatt), vagy a fejlécben a **Frissítés** gomb.
- Migráció automatikus (v5). A régi célok/teendők megmaradnak; a régi célok `tags:[]`, a mércék `progression:null` értéket kapnak.

## Ellenőrzés (ezen a gépen nincs node.exe)
- Szintaxis: az app böngészőben hibátlanul betölt és fut (a klasszikus inline script parse-olható).
- Böngészős füstteszt (python http.server + DOM-teszt): adatmodell-migráció, cél-űrlap (harmonika/radio/select/feltételes mező/címke/progression/avoid/tally),
  Ma-fül (avoid streak, tally +1, todo add/pipa/törlés, „Napi pont"), tabváltások, 2. szint videó-overlay, export — **0 hiba**.

## 2. kör — emberi-logika javítások (a demó átnézése alapján)
- **Minden cél látszik a Ma fülön**: a „Mért célok" már nem szűr `cadenceActiveOn`-ra, csak `goalStartOk`-ra (a hét-napjai és rugalmas célok is megjelennek).
- **Tally cél-űrlap**: eseményalapúnál eltűnt az ellentmondásos „Pontozott/Csak követett" és az adattípus/almérce — csak a „Számláló" mező marad (nincs félrevezető „nem pontoz, de kiválasztható" állapot).
- **`cadenceLabel`**: `avoid` → „fordított napló", `tally` → „számláló" (eddig mindkettő „napi" volt).
- **Haladás fül**: `avoid` a helyes „X napja tiszta" szériát mutatja (`goalStreakAvoid`), a félrevezető „N alkalommal teljesítetted" narratíva nélkül; `tally` külön kártyát kap (össz. rögzítés + napi darabszám-grafikon, pont/szint nélkül).
- **Ma cél-kártya**: tally alcíme „eseményalapú számláló" (nem „számláló · számláló"), és a tallynál nincs értelmetlen „Lv" jelvény.

## Demó (csak lokális, NE töltsd fel)
- `_DEMO_index.html` — 10 napnyi trackelés, 10 cél mind a 10 típussal/kombinációval, beszédes nevekkel (①…⑩), külön `szintlepo_demo` localStorage-kulccsal (a valódi adatot nem érinti), SW kikapcsolva. Megnyitás: `http://localhost:<port>/_DEMO_index.html`. Feltöltéskor hagyd ki ezt a fájlt.
