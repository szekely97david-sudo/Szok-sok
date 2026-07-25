# Edzésnapló 3. kör + elmaradt változásnapló — 2026-07-25

`sw.js v58 → v59` · `APP_VERSION v20 → v21`

## 0. Az elmaradt „Mi újult meg?" — a fő panasz

A változásnapló (`CHANGELOG`) **v7-nél megállt**: az Edzésnapló modul 1. és 2. köre
kimaradt belőle. Ezért nem ugrott fel semmi a két utolsó frissítésnél, és a Fiókban
sem volt mit mutatni — a funkció végig működött, csak **nem került bele az új tartalom**.

Amit tettem:

- **v8** = az Edzésnapló modul indulása (1+2. kör visszamenőleg, 8 pontban).
- **v9** = a mostani kör (lásd lent).
- A **„✨ Mi újult meg?"** kikerült az „Alkalmazás" kártya sarkából a **saját
  „Újdonságok" szekciójába** a Fiókban, magyarázó szöveggel — eddig két apró
  gomb közé volt beszorítva a lap alján.
- A `FELTOLTES_checklist.md` első pontja mostantól a CHANGELOG-bejegyzés. Ez a
  strukturális védelem az ellen, hogy megint kimaradjon: a kiadás nem kész,
  amíg a felhasználónak szóló bejegyzés nincs meg.

## 1. Edzés közben — összecsukható gyakorlatok

| Kérés | Megoldás |
|---|---|
| A gyakorlat nevére kattintva csak kijelöli a szöveget | A fejléc `user-select:none`, és **koppintásra nyit/csuk** (`data-wbh` → `woToggleBlk`). |
| Mindig csak az legyen nyitva, amit épp csinálok | `woCurBlk()`: `null` = magától az első befejezetlen · `-1` = mindent összecsuktál · szám = amit kinyitottál. Az összecsukott blokk mutatja a **n/m szettet** és a már elvégzett sorozatokat („60×8 · 60×8"). |
| Pipa után csukódjon be és ugorjon a következőre | `woAdvance(bi)` a `woToggleDone` végén: ha a gyakorlat kész, a **következő befejezetlen** nyílik ki, és oda is görget. |
| Szuperszettnél a párjára ugorjon | Ha a blokknak van `ss` csoportja, **minden pipa után a párja** nyílik ki (körbe, ha kettőnél több van) — akkor is, ha ennek a gyakorlatnak van még hátra szettje. |
| A szuperszett-összekötés legyen egyértelműbb | Bal oldali **kapocs-sáv**, **A / B betűjel** minden tagon (halványan, ha épp nem az aktív), és a fejlécben „A ⇄ B — felváltva, pihenő nélkül". |

## 2. Vetkőző sorozat (drop set)

- **Bármelyik szetthez** tehető, nem csak az utolsóhoz: a ⋮ menü „Vetkőző sorozat
  (lépcsők)…" pontja **felkínálja az összes szettet** (súllyal, és hogy hány
  lépcső van már rajta). Egyszettes gyakorlatnál kérdezés nélkül az egyetlenre teszi.
- **Több lépcső**: a lépcsők alatt megjelent a **„+ következő lépcső"** gomb, így
  a 60 → 40 → 20 → 10 sor egy-egy koppintás. Minden új lépcső az előző **80%-át**
  ajánlja kiindulásnak (a tárolt formátum eddig is bírt 8 lépcsőt, csak nem volt
  hozzá kényelmes út).

## 3. Edzés indítása és elnevezése

- Az indítómenü három tiszta útra bomlott: **Üres edzés · Rutin indítása… ·
  Korábbi edzés megismétlése…** (bármelyik korábbi, nem csak a legutóbbi; a
  legutóbbi 12-ből választhatsz, dátummal és szettszámmal). Ha még nincs rutinod,
  a helyén **„Rutin összeállítása…"** áll, ami egyből a szerkesztőbe visz.
- **Elnevezés**: `woAutoTitle()` = **dátum + fókusz** („júl. 25. · Mell/Tricepsz").
  A fókuszt az elsődleges izmok szettszámából számolja; ha négy vagy több testtáj
  is legalább 20%-ot kap, **„Teljes test"**. Rutinból indítva „júl. 25. · <rutin neve>".
- Amíg **te nem írod át**, a név követi a tartalmat (`ttlAuto`); az első saját
  átírás után soha többé nem nyúl hozzá. Befejezéskor a név a **ténylegesen
  elvégzett** gyakorlatokból áll össze.
- **Egyszeri átnevezés**: a pontosan „Reggeli/Délutáni/Esti edzés" (és „Edzés")
  nevű **régi** edzések — az importált előzményed nagy része ilyen — megkapják az
  új nevet. Amit te neveztél el, ahhoz nem nyúl (`woMigrateTitles`).
- A napló- és ismétlés-listákban a dátum nem jelenik meg kétszer, ha a név már tartalmazza.

## 4. Regeneráció — a láb is látszik

Eddig a **hat legfáradtabb izom** került a kártyára, ezért a kipihent testtájak
(tipikusan a láb) egyszerűen eltűntek. Mostantól **testtájanként** megy: Mell ·
Hát · Váll · Kar · Törzs · Láb, mindegyik **mindig látszik** (ha edzetted már).
Egy testtáj értéke a benne lévő **legfáradtabb izomé** — az szab határt a
következő edzésnek. Az izmonkénti bontás egy koppintással lenyitható alatta.

## 5. Vissza-gesztus — ne lépjen ki az appból

A gyökérszinten eddig nem volt mit visszalépni, így a rendszer gesztusa kivitt az
appból (edzés közben is). Új lépcső: **nyitott alnézet → a modul alapfüle →
Kezdőlap → és csak a MÁSODIK, 2,6 mp-en belüli vissza** zár be, előtte szól is.

A trükk a `pushRoot()`: az app **fenntart egy „ütköző" history-bejegyzést**, és
minden gyökér-szintű visszalépés után újratölti. Enélkül a gesztus el se jutna a
kódig — a rendszer egyszerűen bezárná az ablakot. A **megkezdett edzés a helyén
marad** (`S.workout.live`), csak a Kezdőlapra lépsz.

## 6. Menük rendbetétele

- Az `openMenu` mostantól ismer **csoportcímkét** (`{head:true}`).
- A gyakorlat ⋮ menüje háromfelé bomlott: **A sorozatról** (szuperszett, vetkőző,
  pihenő — a pihenő mostantól a menüben mutatja az aktuális értékét) ·
  **Ehhez a gyakorlathoz** (gépbeállítás, kép, jegyzet, előzmény) ·
  **Az edzésben** (csere, feljebb/lejjebb, eltávolítás).
- A tarka emodzsik helyett **egységes, visszafogott jelek**: ⇄ ↓ ⏱ ⚙ ▣ ✎ ▦ ⟳ ▲ ▼ ✕
  (az indítómenüben ◇ ≡ ⟲). A jegyzet-ablak végre **be is tölti** a meglévő jegyzetet.
- A teljes app **ikonrendszerének** egységesítése továbbra is külön kör — ahogy kérted.

## Ellenőrzés

Böngészős füstteszt (python http.server + preview, éles Firebase-config
kicserélve placeholderre a teszt idejére, utána visszaállítva):
0 konzolhiba; mind a 8 fül renderel; a szuperszett-váltás, az összecsukás, a
lépcsők, a menük, a névadás, a régi nevek átírása és a vissza-lépcső
mind a várt eredményt adta.
