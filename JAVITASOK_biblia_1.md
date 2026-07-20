# Trellis — Bibliaolvasás modul, 1. fázis (setup kész)

Kikapcsolt állapotban **semmi nem változik** az appban. Bekapcsolva megjelenik egy új
**Biblia** fül: tervező, napi olvasmány, olvasó, haladás, heatmap, statisztika — plusz a
kért **olvasási idő kalibrálás**.

## Mi épült be

**Bekapcsolás:** Fiók fül → „Bibliaolvasás" → egy gomb. Bekapcsolva megjelenik a Biblia
fül az alsó sávban; kikapcsolva a fül nem is renderelődik.

**Tervező** (először ez jön fel): hatókör (Teljes / ÓSZ / ÚSZ) + két összekötött csúszka
(„Napi olvasás" perc, „Hány hónap alatt?") –/+ finomhangoló gombokkal. Amelyiket húzod, az
rögzül, a másik élőben derivál. A kiírás mutatja a napi percet, az átlagos fejezetszámot és
a várható időtartamot.

**Szószám-alapú osztás** (nem fejezetszámra) — ezt a füstteszt bizonyítja: azonos 12 hónapos
tervnél a Zsoltároknál **9 fejezet/nap**, Lukácsnál **2 fejezet/nap**. Zsolt 119 (1998 szó)
egyedül kitölt egy napot.

**Mai olvasmány:** a fejezetlista + becsült perc, egyetlen „Befejeztem" gombbal. A kurzor a
következő olvasatlanra ugrik; az előreolvasás megengedett.

**Olvasó:** `‹ [1Mózes 11] ›` navigáció, a teljes Károli-szöveg versenként. A címre koppintva
könyvválasztó (66 könyv, `olvasott/összes` jelzéssel), onnan fejezet-rács: koppintás =
odaugrás, **hosszan nyomás = olvasottnak jelölés** (ha máshonnan olvastad). Egész könyv
jelölése/törlése is megvan. „Ugrás N fejezettel" — előre ugrásnál a közben átlépettek
olvasottnak számítanak.

**Haladás:** sáv a tényleges %-kal, rajta jelölő a tervezettnél, alatta „X nappal előrébb /
lemaradva" és a várható befejezés dátuma.

**Statisztika:** olvasott fejezet/szó, becsült olvasási idő, olvasónapok, jelenlegi és
leghosszabb sorozat, kimaradt napok, fejezet/olvasónap + 26 hetes heatmap (a meglévő
téma-színekkel).

## ⏱ Olvasási idő kalibrálása (az új kérés)

A Biblia fülön két helyen elérhető (Terv-kártya és Statisztika → Olvasási sebesség), és
bármikor **megismételhető**. Elindít egy stoppert és megmutatja az **1. zsoltárt** (96 szó);
végigolvasod a saját tempódban, majd „Kész, leállítom" → ebből jön a szó/perc értéked, és
onnantól **ezzel** számol a terv (hány hónap, napi perc, becsült befejezés).

- Az **utolsó 3 mérés átlagát** használjuk, így egy elkapkodott mérés nem torzít.
- 8 másodperc alatti mérésnél rákérdez, hogy tényleg végigolvastad-e.
- Kézzel is felülírható (szó/perc mező a tervezőben).
- Példa a tesztből: 96 szó / 40 mp → **144 szó/perc**; ettől a 12 hónapos terv napi
  8,2 percről 11,4 percre nőtt — vagyis a becslés valóban rád szabott lett.

## Adat és migráció

- `S.bible = {enabled, plan, calib:{wpm,runs}, updatedAt}` — az `S` része, tehát a meglévő
  úton **szinkronizál** Firebase-szel. A `plan.read` map (fejezet → dátum) az egyetlen
  igazságforrás; minden statisztika ebből derivál.
- Verzió **v8 → v9**, `normalize()` kiegészítve. A localStorage-kulcs (`szintlepo3`)
  változatlan → **nincs adatvesztés**, a meglévő adatokhoz nem nyúltunk.
- A modul **nem** folyik bele a globális pont-/szintrendszerbe.

## Fájlok (mind a repo gyökerébe)

- `index.html` — teljes, cserélhető (253 → 298 KB)
- `sw.js` — cache-verzió **v40 → v41**, `bible-meta.json` + `bible-books.json` precache-elve
- `bible-meta.json`, `bible-books.json` — súlytábla és könyvtábla
- `text/` — 66 fájl, 4,4 MB (Károli 1908, közkincs). **Nincs** precache-elve: lustán,
  cache-first módon töltődik, amikor tényleg megnyitsz egy könyvet → a telepítés gyors marad,
  utána offline is megy.

Backup készült: `index.html.bak-bible-20260720_062020`.

## Feltöltés után

1. Töltsd fel a fenti fájlokat **a `text/` mappával együtt**.
2. Az appban **frissíts kétszer** (az új service worker így aktiválódik).
3. Fiók → Bibliaolvasás bekapcsolása → Biblia fül → tervező.
4. Első dolog: **⏱ Olvasási idő kalibrálása**, utána állítsd be a csúszkákat.

## Tesztelve (füstteszt, 0 hiba)

Migráció v8→v9 adatvesztés nélkül · `computePlan()` oda-vissza konzisztens (idő↔hónap↔fejezet,
15,000 perc mindhárom irányból) · szószám-arányosítás (Zsolt 9 vs. Luk 2 fejezet/nap) ·
`buildDailyReading()` nem ismétel, óriás fejezet egyedül is egy nap · „Befejeztem" → kurzor és
%-ok · ugrás N-nel · streak/heatmap · kalibráló stopper végig (indul, ketyeg, ment, átlagol,
leáll, a terv újraszámol) · mind a négy nézet renderel · Fiók-kapcsoló.

## Ami még hátra van (a prompt szerint)

- **2. fázis:** kvíz a beépített kérdésbankból (`quiz-bank.json` — ez külön tartalmi
  gyártás: ÚSZ + Zsoltárok + 1Mózes az 1. köteg).
- **3. fázis:** kiegyenlítés/újratervezés, túlteljesítés-bank, kronologikus olvasási sorrend
  (a `Bibilia modul/kronologikus bibilia/` PDF-ek ehhez lesznek forrás).
- Súgó-szekció + „i" infó-buborékok a Biblia fülön.
