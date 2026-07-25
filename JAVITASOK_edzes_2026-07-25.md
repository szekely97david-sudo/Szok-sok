# Edzésnapló modul — 1. kör (2026-07-25)

`sw.js v56 → v57` · `APP_VERSION v18 → v19` · új fájl: `exercises.json`

## Mi ez

Új, bekapcsolható modul a Trellisben: **🏋️ Edzésnapló**. Három füle van
(**Ma · Napló · Statisztika**), és a Lyfta helyett használható edzés közben.
Bekapcsolás: **Fiók → 🧩 Aktiválható modulok → Edzésnapló**.

A pontrendszerbe **nem** számít bele — mint a Biblia modul, önálló világ.

## A központi döntés: terv ≠ tény

Három réteg, és ez a modul lelke:

| Réteg | Hol él | Mikor változik |
|---|---|---|
| **Gyakorlat-terv** | `S.workout.ex[id].plan` | csak ha te átírod |
| **Rutin** | `S.workout.routines[]` | csak ha te szerkeszted |
| **Napló** | `S.workout.sessions[]` | minden edzésnél |

A Lyfta hibája az volt, hogy a napló *volt* a terv: ha kihagytad a 3. sorozatot,
legközelebb már csak kettőt hozott fel. Itt a terv az első hozzáadáskor
**lehorgonyzódik** (`woEnsurePlan`), és onnantól önállóan él.

Igazolva: 3 tervezett szett → 2-t végzel el → a napló 2-t rögzít → a terv marad 3 →
a következő edzés 3 sort hoz fel.

## Amit tud

- **Aktív edzés**: helyszín-választás, terv-alapú szettsorok halvány ghost-értékkel.
  A ✔ üres mezővel is működik: átveszi a terv értékét, és **indítja a pihenőt**.
- **Szett-típusok**: normál · bemelegítő `[W]` · **vetkőző sorozat** (egy szettként,
  `100×8 ↓ 80×6 ↓ 60×10`) · RIR/bukás-jelölés. A bemelegítő nem számít a volumenbe
  és nem ront PR-t.
- **Szuperszett**: egymást követő blokkok közös kerettel, színnel jelölve.
- **Pihenő-stopper**: a hang **nem** `setTimeout`-tal szól, hanem a Web Audio
  motorjában előre ütemezve — így a háttér-fojtás nem csúsztatja el, és lezárt
  kijelzőn is megszólal. 5 szintetizált hang (nulla letöltött fájl), rezgés,
  értesítés, ±15 mp, gyakorlattípus szerinti alapérték.
- **Gyakorlat-választó**: Kedvencek → Legutóbbi → Gyakori (3 hó) → izomcsoport →
  keresés, a helyszín felszereléséhez szűrve.
- **Gépbeállítás-memória** (ülésmagasság, fogás) és **saját fotó a gépről**.
- **Regeneráció-becslés** izomtérképpel, **1RM/max-súly/max-ismétlés** csúcsok,
  heti volumen- és sorozatszám-diagramok.
- **Lyfta CSV import**: 147 edzés, 6 020 sorozat, szuperszettek és bemelegítő
  szettek megtartva, duplikált nevek összevonva, 0 ismeretlen gyakorlat.

## Adattárolás

A teljes állapot **egy** Firestore-dokumentum, aminek **1 MB a kemény limitje**,
ezért a napló tömör tömb-formában megy: `szett = [súly, ism, jelzők, RIR, lépcsők]`.

**Mért eredmény: a teljes 147 edzés + 6 020 sorozat = 144 KB.** A `woSizeCheck()`
780 KB fölött figyelmeztet.

A **fotók szándékosan nem** az állapotban vannak (`sl_woPhotos`, eszköz-lokális,
mint az egyéni témák) — pár tucat kép önmagában szétvinné a limitet.

## Menet közben javított hibák

1. **`escA(szám)` összeomlás** — a `esc()` `.replace`-t hív, számon nincs.
   Az ismétlésszám mezője kidobta a teljes aktív edzés képernyőt.
2. **694 KB HTML a gyakorlat-listán** — minden ikon külön beágyazott SVG volt.
   Most egy `<defs>` blokk + `<use>` hivatkozások: **87 KB** (8×), és a listaikonok
   csak a kiemelt izmokat rajzolják.
3. **Irreális regeneráció** — az első képlet szettenként összegzett, ami hetek
   alatt korlátlanul halmozódott: minden izom 0%-on ragadt, „214 óra a teljes
   regenerációig”. Most **edzésenként** számol, edzésenként legfeljebb 100%-ot
   von le, és szorzatosan telítődik. Mért érték egy kemény hát-edzés után:
   *aznap 46–57%, +24 óra 78–82%, +48 óra 91–93%, +72 óra 97%.*
4. **A terv mégis csorbult** — a terv csak lazán, a legutóbbi edzésből derivált,
   sosem lett elmentve. `woEnsurePlan()` most lehorgonyozza.
5. **Két azonos nav-felirat** — a ☰ és az első fül is „Edzés" volt; az első fül
   most „Ma", a többi modul idiómája szerint.
6. **Év nélküli dátumok** — egy éve volt hivatkozás „aug. 24."-ként jelent meg.
   `woDateTxt()` kiírja az évet, ha nem az idei.

## Mérési eltérés a Lyftához képest

A volumen nálunk **magasabb** lesz, két szándékos különbség miatt:

- a **bemelegítő szettek nem** számítanak bele (a Lyftában igen),
- a **saját testsúly beleszámít** a húzódzkodásba/tolódzkodásba, ha megadtad a
  testsúlyodat (a Lyftában nem).

Ezért a júl. 24-i edzés nálunk 28,4 t, a Lyftában 26 630 kg. Mindkettő
következetes önmagában — a trend a lényeg, nem az abszolút szám.

## Hátralévő (2. kör)

RP-stílusú auto-reguláció (MEV→MRV volumen-rámpa, mezociklus RIR-lépcsővel 3→2→1→0,
kötelező deload), progresszió-motor (dupla progresszió / lineáris / RPE),
„csak 40 percem van" mód, gép-foglalt csere-javaslat, plateau-figyelő,
mérések (kar/comb) + haladás-fotók, edzés-timeline, SFR-alapú gyakorlatcsere.
