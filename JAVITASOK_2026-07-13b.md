# Trellis — 2026-07-13 (b): csoportosítás, átrendezés, mappaszerkezet, leírás

Négy nagyobb funkció, a valós adatmodellt érintve. Séma **v7 → v8** (nem-romboló,
önjavító migráció — a régi mentések automatikusan felállnak, adat nem vész el).
Service worker cache: **v32 → v33**.

## 1. Ismételhető átstrukturálás (csoportosítás / elő- és leléptetés)
Bármikor átrendezheted a hierarchiát, és a **történet (napi pont, befagyasztott pont,
avoid-számláló) mindig vele megy** — a szintek megmaradnak. A mércét a saját id-je
azonosítja mindenütt (`entries[gid][mid]`, `frozen[gid][mid]`, `avoidState["gid|mid"]`),
ezért a mozgatáskor ezeket migráljuk.

Új primitívek (index.html):
- `moveMetric(fromGid, mid, toGid)` — alcél áthelyezése másik cél alá
- `promoteMetric(fromGid, mid, {title})` — alcél előléptetése önálló főcéllá (új cél)
- `absorbGoal(srcGid, targetGid)` — egy egész főcél alcéllá tétele másik cél alatt
- `migrateMetricHistory(...)` + `pruneEmptyGoal(...)` — történet-átvitel és üres cél törlése

UI:
- **Célok lista → ⋯ menü:** „Tedd alcéllá egy másik cél alatt", Szerkesztés, Törlés
- **Cél szerkesztő → alcél ⋯ menü:** Szerkesztés, „Előléptetés önálló főcéllá",
  „Áthelyezés másik cél alá", Törlés
- Az űrlapból indított átstrukturálás előbb **véglegesíti a draftot** (`commitDraft`),
  hogy a történet-migráció a mentett állapotra fusson.
- Így megvalósítható a kért folyamat: „dopamin" főcél → Facebook alá tolása →
  játék/egyéb alcélok hozzáadása, egymás mellett.

## 2. Sorrend átrendezés (főcélok ÉS alcélok)
- **Célok listán** ▲▼ a főcélok sorrendjéhez (`reorderGoal`).
- **Cél szerkesztőben** ▲▼ az alcélok sorrendjéhez. A legfelső alcél a „Fő cél".

## 3. Mappaszerkezetű lenyíló nézet (Ma ÉS Célok)
Nincs többé minden almérce egyszerre kinyitva.
- **Ma (naplózó):** cél megnyitása → alcélok tömör listája (címke + mai állapot/pont +
  avoid-számláló élőben) → egy alcélba belépve **csak az** látszik (rögzítés + statisztika)
  → „‹ Alcélok" vissza. Egyetlen alcélnál a köztes lista kimarad.
- **Célok (szerkesztő):** áttekintő = alapadatok + alcél-lista; egy alcélba koppintva
  külön képernyőn szerkeszted → „‹ Vissza az alcélokhoz".
- Új nav-állapotok: `maMetric`, `formMetricIdx`; a telefonos vissza-gesztus/gomb
  rétegről rétegre lép vissza.

## 4. Részletes leírás
- Új `desc` mező a célon (a rövid „Szándék — miért fontos?" mellett).
- Szerkesztőben külön „Részletes leírás" mező; a Ma cél-nézetben összecsukható
  **„📖 Leírás"** szekcióként jelenik meg.

## Action sheet (alsó menülap)
Új `openMenu`/`pickGoalMenu` komponens. A láncolt menük (pl. Áthelyezés → célválasztó)
race-mentesek: a kiválasztott művelet a menü bezárása (history-vissza) UTÁN fut
(`_pendingMenuAction`).

## Teszt (python http.server + fejlesztői böngésző, node nélkül)
- v7→v8 migráció OK.
- move/promote: a mérce élettartam-pontja változatlan marad, a napi bejegyzések és az
  avoid-állapot átkerül, az üres cél törlődik.
- Ma drill-down (lista → alcél → vissza), Célok reorder + ⋯, űrlap drill-down + Leírás,
  láncolt menü (áthelyezés → célválasztó), új cél létrehozása végig — **0 konzolhiba**.

## Feltöltés (GitHub Pages)
1. `index.html` és `sw.js` felöltése.
2. Az appban kétszer frissíts / indítsd újra (SW v33 aktiválás).
3. Régi adat automatikusan v8-ra migrálódik betöltéskor.
