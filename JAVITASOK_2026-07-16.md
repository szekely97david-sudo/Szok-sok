# Trellis javítások — 2026-07-16

Telefonos használat közben jelzett 4 pont. sw cache: **v36 → v37**.

## 1. „Ma" fül visszaugrik a mai napra
Ha a Ma fülön balra/jobbra húzva múltba/jövőbe tekertél, majd átváltottál egy másik
fülre és vissza a Ma fülre, ott ragadt a régi dátum. Mostantól a **Ma fülre koppintva
mindig a mai napra ugrik** (`selDay=TODAY` a fül-gomb kezelőjében). A célon belüli
napléptetés és a „lezáratlan nap" ugrás továbbra sem ugrik el — csak a fülváltás resetel.

## 2. Függő alcélok — „csak ha a főcél teljesül"
Új per-alcél beállítás a cél szerkesztőben (**Mikor mérjem?**): *Mindig mérem* /
*Csak ha a főcél teljesül*. Alapból „Mindig mérem".

- Ha egy alcélt „csak ha a főcél teljesül"-re állítasz, akkor amikor a **főcél** (az
  első, aktív mérce) aznap **nem teljesült** (pl. az „Edzettem?" igen/nem mérce „nem"),
  ezt az alcélt **nem kell kitölteni**, és **másnap sem emlékeztet** rá — a nap így is
  lezárható/teljesnek számít.
- Ha a főcél **teljesült**, a függő alcél a szokásos módon kötelező.
- A **független** alcélt („Mindig mérem") a főcéltól függetlenül továbbra is számon kéri.

A ténylegesen **elfelejtett** napok (semmi nincs kitöltve) továbbra is emlékeztetőt
kapnak — ez a rész eddig is működött, teszttel visszaigazolva. A „nem dob emlékeztetőt"
élmény oka az volt, hogy a nem-teljesült főcélnél az üres alcélokat „hiányzik"-ként
nyaggatta; ez most megszűnik.

Technikai: `dependsOnMain` mező a mércén (normalizál, ment, régi célnál alapból `false`).
Új helperek: `mainMetricOf`, `mainAchievedOn`, `metricRequiredOn`; beépítve a
`goalDayComplete` és `goalRecordedToday` logikába (a gate/emlékeztető ezekre épül).

## 3. „Rákérdezés a miértekre" alapból NEM
Új cél létrehozásakor a miért-kérdezés alapból **ki van kapcsolva** (eddig be volt).
Célonként bármikor bekapcsolható a Haladó beállításoknál. Meglévő célok megtartják a
korábbi beállításukat (nem írjuk felül visszamenőleg).

## 4. Csak fordított naplózású célnál nincs pipa-négyzet
Ha egy cél **csak fordított (avoid) naplózású** mércé(ke)t tartalmaz, a Ma-csempén
**nincs pipa-négyzet** (mert az magától „tiszta", félrevezető volt a pipa). Egyetlen
avoid mércénél a másodperc-számláló látszik; több avoid mércénél üres a jobb oldal.
Ha a célban van **legalább egy igen/nem-es** (vagy más rögzítendő) mérce, a pipa-négyzet
megjelenik, mint eddig.

## Feltöltés
Git push a GitHub Pages repóba (index.html + sw.js). Frissítsd az appot kétszer /
indítsd újra, hogy a v37 service worker felváltsa a régit.
