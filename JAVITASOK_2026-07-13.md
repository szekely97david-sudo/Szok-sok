# Javítások — 2026-07-13 (sw v32)

Négy kérés, mind lokálisan kész + böngészőben ellenőrizve (python http.server + Browser pane). Deploy még hátravan (git push GitHub Pages).

## 1. Fordított naplózás — számláló kezdése perc/másodperc pontossággal
- A cél-űrlapon az `avoid` (fordított naplózás) mércénél a „Kezdés dátuma" (csak nap) helyett
  **`datetime-local` mező `step=1`-gyel** jelenik meg → nap + óra + perc + **másodperc**.
- A Ma fül cél-részletében új összecsukható blokk: **„⏱ Számláló kezdésének pontos beállítása"**
  (`datetime-local`, `step=1`) → az élő számlálót tetszőleges időpontra igazítja (`S.avoidState[key].since`).
- Új `startAt` mező a mércén (ISO helyi idő, pl. `2026-06-10T08:15:42`), amit a `normMetric`,
  a mentés és a `derivedAvoidSince` is megőriz/figyelembe vesz. A `startDate` ebből származik.
- Segéd: `localDTStr()` — helyi „YYYY-MM-DDTHH:MM:SS" string.

## 2. Alsó „Vissza" sáv ne takarja ki a Mentés/Mégse gombokat
- Új `body.has-foot` osztály: `padding-bottom: calc(150px + safe-area)`.
- `updateDayFoot()` be/ki kapcsolja a lebegő sáv láthatóságával együtt.
- Így a lap alja (cél-részlet ÉS cél-űrlap Mentés/Mégse) a lebegő sáv (≈135px) fölé görgethető.

## 3. Nap-zárás kapu — csak a kötelezően rögzítendő célokra
- Új `metricNeedsDailyRecord(m)`: `avoid` / `tally` / `flexible` cadence → **nem** kér napi lezárást.
- `goalDayComplete` és `applicableGoalsOn` már csak a kötelezően rögzítendő (daily/weekdays/streak)
  mércéket veszi figyelembe → a fordított naplózású és a rugalmas (heti Nx) célok **nem** dobják fel a kaput.
- A modal szövege: **„⏳ Van lezáratlan célod"** (nem „napod"), pontosított magyarázattal.
- Rugalmas cél (heti 4x) nem von le pontot / nem nag-ol csak azért, mert ma nem volt — a heti
  ablakban teljesül.

## 4. Statisztika — GitHub-stílusú hőtérkép
- Új `metricHeatmap(g,m,91)` + `heatStateFor` + `heatLvlOf`: 7 sor (H→V), oszloponként egy hét, 91 nap.
- Zöld intenzitás (l1–l4) a napi pont szerint, **rózsaszín** a megcsúszás/kimaradás, halvány a nem-releváns.
  Avoid: tiszta nap = zöld, megcsúszás = rózsaszín. Felirat: „Az elmúlt N releváns napból X teljesítve (Y%)".
- Megjelenik a cél-részlet **Statisztika** szekciójában (minden mérce alatt), a meglévő vonaldiagram mellett.
- CSS: `.heat`, `.heat-grid`, `.hm-c` (l1–l4/miss/void), `.heat-legend` — témafüggetlen zöld/piros ramp.

## Ellenőrzés (Browser pane)
- Gate: csak „Reggeli mozgás" (daily) hiányzik; „Cukor kerülése" (avoid) és „Edzés heti 4x" (flexible) kimarad. ✓
- Avoid számláló a `startAt`/slip szerint (40 nap …). ✓  Detail + form datetime-local step=1. ✓  Mentés megőrzi startAt-ot. ✓
- Heatmap: 91 nap, zöld/pink cellák, helyes %. ✓
- `body.has-foot` → padding 150px, daily űrlap változatlan (sima dátum). ✓  Nincs konzol-hiba.
