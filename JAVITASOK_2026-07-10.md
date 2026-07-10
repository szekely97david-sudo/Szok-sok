# Trellis — fejlesztési kör (2026-07-10)

## Mi változott

### 1) Splash / indító videó — teljes képernyős, 5 mp, nem átugorható
- Az új, **teljes képernyős álló** videóból (`×_telefon_állókép__a (1).mp4`, 720×1280)
  levágtam az **első 5 másodpercet** — ott áll össze és marad ki a „Trellis · Structure
  Your Growth" márka-reveal. Webre optimalizálva, hang nélkül: **`splash.mp4` — 362 KB**.
- A videó **kitölti a képernyőt** (`object-fit:cover`), induláskor azonnal ez jelenik meg
  (nincs poszter/statikus splash, ami felvillanhatna előtte).
- **Nem lehet átugorni**: kivettem a koppintás-átugrást és a Kihagyás gombot is. Az 5 mp-es
  animáció végigfut, majd `ended` → finom fade-out → app.
- Megmaradt a **robusztus tartalék**: ha a videó nem töltene be / nem jönne az `ended`,
  ~6,2 mp után mindenképp eltűnik a splash (sose ragad be).

### 2) Per-szokás „miértek" kapcsoló
- A cél-szerkesztőben: **„Rákérdezés a miértekre"** → Igen / Nem. Kikapcsolva az adott
  szokásnál bukáskor/sikernél **nem kérdez** okot (pl. alvásnál). Alap: bekapcsolva
  (a meglévő szokások viselkedése változatlan).

### 3) Új fül: Teendők — most **mappákkal**
- Külön teendő-lista a napi/heti céloktól függetlenül: szövegmező + „+", checkbox-os sorok,
  sorra vagy checkboxra koppintva kész, **Elvégzett feladatok** összecsukható szekció legalul.
- **Mappák / mappaszerkezet** (pl. *Meló*, *Itthon*): fent görgethető mappa-csipek szűrésre,
  „+ Mappa" gomb új mappához, minden nyitott sornál egy kis legördülő a **mappába helyezéshez**.
  Az „Összes" nézet a teendőket **mappánként csoportosítva** mutatja (+ „Egyéb" a mappa nélkülieknek).
  Mappa átnevezhető / törölhető (törléskor a benne lévő teendők megmaradnak, mappa nélkül).

### 4) Össz-haladás (meta-szint) legfelül
- A „Ma" fül tetején app-szintű **Össz-haladás** kártya: minden pontozás átvitt, kisebb
  mennyiségben ide csordogál (`metaFactor` 0.3), és **minden elvégzett teendő +3** meta-pontot ad.
  Lassabb szint-küszöbökkel — „minél többet használod, annál többet nő".

### 5) Új fül: Jutalmak (Küldetések) — placeholder
- „🚧 Fejlesztés alatt" képernyő. Ide jönnek később az érmék / jelvények / kihívások (`// TODO`).

### 6) Ajánlás ismerősöknek (Fiók)
- **„🎁 Ajánld ismerősnek"** gomb: rendszer-megosztó lap (`navigator.share`), tartalék
  vágólap/`mailto`. A link az élő app + `?ref=<uid>` (belépve). `// TODO`: ajánlás-követés később.

## Adat / kompatibilitás
- `normalize()` bővítve: `S.todoFolders = [{id,name}]`, és minden teendő kap egy `folder` mezőt
  (alap: nincs mappa). Régi felhasználó adata érintetlen; a `szintlepo3` kulcs és a domain változatlan.

## Kiadás
- `sw.js` cache-verzió léptetve: **v20 → v21**; az app-shellben már benne a `splash.mp4`.
- A `type="module"` Firebase-blokk ép; a Frissítés-gomb folyamata változatlan.
- **Teszt:** a teljes app lefutott böngészőben **0 konzolhibával**; végigpróbálva: meta-fejléc,
  mappa-létrehozás + csoportosítás + szűrés + áthelyezés, teendő elvégzése → **meta 0 → 3**,
  Elvégzett szekció, Jutalmak placeholder, Fiók-megosztó gomb, per-szokás miért-kapcsoló ki/be.
- A fájl `</script></body></html>`-lel zár, mérete nőtt (140 KB → 144,6 KB).

## Feltöltés után
Nyisd meg az appot és **frissíts kétszer** (vagy zárd be és nyisd újra), hogy a **v21**-es
service worker aktiválódjon és letöltse az új `splash.mp4`-et az app-shellbe.

## Cserélt / új fájlok
- `index.html` (splash JS; Teendők mappák: CSS + render; normalize migráció)
- `sw.js` (`trellis-v21`)
- `splash.mp4` (ÚJ — 5 mp-es, teljes képernyős vágás)
- `splash-poster.jpg` (frissítve — a videó első kockája)
