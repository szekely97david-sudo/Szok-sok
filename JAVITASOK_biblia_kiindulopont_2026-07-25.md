# Trellis — Biblia: kiindulópont a terv-űrlapon + kvíz-nehézség · alsó sáv · 2026-07-25

**Verzió:** app `v18`, service worker `v56` (az előző körhöz: app v17 / sw v55)

## 1. A kvíz nem mutatja a kérdés nehézségét
A kérdés fölötti „nehéz / nagyon nehéz" címke kikerült — csak a „3 / 10 kérdés" számláló maradt.
(A nehézség a generálásban és a statisztikában továbbra is létezik, csak olvasás közben nem látszik.)

## 2. „Honnan indulsz?" — a kiindulópont bekerült a terv készítésébe
Eddig a kiindulópont egy eldugott gomb volt a kész terv alatt (`📍 Hol tartok most?`), és
félrevezető számokat adott. Most:

- A **terv-űrlapon**, közvetlenül a napi/hónap csúszkák fölött ott a kérdés:
  **Honnan indulsz? — [Az elejétől] / [Onnan, ahol tartok]**.
  A második választásnál egy Könyv + Fejezet választóval megadod, hol tartasz.
- **Csak hagyományos sorrendnél** jelenik meg. Kronologikusnál és szabad sorrendnél nincs értelme,
  ezért ott nem is kínáljuk (és sorrend-váltáskor a korábbi kiindulópont törlődik).
- A megjelölt fejezet **elé** eső rész app-előtti olvasásnak számít (`read[id]="prior"`).

### Ami ettől megváltozott a matekban
A kiindulópont előtti rész mostantól **kikerül a terv számításából** (`computeBiblePlan`):

| | Régi | Új |
|---|---|---|
| Napi keret (hónap-mód) | teljes hatókör ÷ napok | **hátralévő** ÷ napok |
| Céldátum / „hány hónap alatt" | az egész Bibliára | a **hátralévő** részre |
| 100% | a teljes hatókör | a **hátralévő** rész (0%-ról indul) |
| „x / y fejezet" | az összes | a **hátralévőből** |

Konkrét példa (teljes Biblia, napi 15 perc): elejétől 598 565 szó ≈ 6,6 hónap; **Lukács 5-től**
indulva 108 496 szó ≈ 1,2 hónap. Ha 3 hónapot állítasz be, a napi keret 1188 szó ≈ 5,9 perc —
vagyis a „3 hónap" a **maradékra** vonatkozik.

## 3. Nem fogad „1 nappal lemaradva" az indulás napján
A lemaradás eddig a mai adagot is azonnal számonkérte (`planned = napi × eltelt napok`), így az
első napon rögtön −1 napot mutatott. Mostantól **csak a lezárult napokra** jár lemaradás:

- indulás napja, 0 olvasva → *terv szerint haladsz*
- 2. nap, 0 olvasva → *1 nappal lemaradva*
- 2. nap, a napi adag megvan → *terv szerint haladsz*

„Előrébb" pedig csak akkor, ha a **mai** adagon is túl vagy.

## 4. Alsó sáv: a Kezdőlap fixen a jobb szélen
`[☰ modulnév] [az adott modul fülei…] [🏠 Kezdőlap]` — a Kezdőlap minden modulból egy koppintás,
a bal szélső ☰ pedig a modul-fiókot nyitja (és mutatja, melyik modulban vagy).

## Technikai jegyzetek
- `computeBiblePlan` új mezői: `priorW` (kiindulópont előtti szavak) és `planW` (= `totalW − priorW`).
  Minden terv-matek `planW`-vel megy; `totalW` csak tájékoztató kiírásokban maradt.
- `bibleProgress` a **tracked** (app-on belüli) szavakkal dolgozik: `actualPct = tracked / planW`.
- Új segédek: `bibleClearPrior(d)`, `bibleApplyPrior(d, "LUK.5")`, `biblePriorStart(d)`.
  A kiindulópont **nem külön mező**: a terv-lista elején álló összefüggő `"prior"`-blokkból derül ki,
  így visszamenőleg is működik a régi mentéseken, és nem kell adatverziót emelni.
- Új terv mentésekor a `read={}` nullázás megőrzi a `"prior"` jelöléseket, a kurzor az első nem-prior
  szakaszra áll.
- Hatókör-váltáskor a kiindulópont törlődik (más hatókörben más lenne a jelentése).

## Feltöltés
`index.html` + `sw.js` (v56). Az appot **kétszer** frissítsd / indítsd újra.
