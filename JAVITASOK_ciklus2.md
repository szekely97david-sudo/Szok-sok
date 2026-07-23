# Trellis — Ciklus modul 2. kör — 2026-07-22

Menstruációs blokk fejlesztései a felhasználó kérése alapján. Minden a meglévő
`S.cycle` sémán belül, migrációval — régi adat érintetlen.

## Mi épült meg

### 1. Visszamenőleges menstruáció-rögzítés + tartomány-kitöltés
- Bármelyik **korábbi napra** ráállva a nap-belépésben: **„🩸 Itt kezdődött a
  menstruáció"** (mára: „Most kezdődött").
- Egy későbbi napon **„🩸 Eddig tartott — itt ért véget"** — a **köztes napok
  automatikusan** menstruációsak lesznek. (Pl. 5-én kezdet, 8-án vég → 6. és 7.
  is bejelölődik.) Ez a gomb csak akkor jelenik meg, ha van kiterjeszthető
  korábbi szakasz (max. 20 nap réssel).
- Egyedi napok továbbra is ki/be kapcsolhatók („Mégsem menstruációs nap"), a
  tartomány szükség esetén szét is vág.
- Új függvények: `periodStartAt`, `periodEndAt`, `extendableBefore`.

### 2. Vérzés-erősség csak menstruációs napon
- A „Vérzés erőssége" (pecsételő/gyenge/közepes/erős) **csak akkor** jelenik meg
  a nap-belépésben, ha az adott nap menstruációs nap. Nem-menstruációs napon
  nincs (nincs értelme), és mentéskor sem tárolódik.

### 3. Együttlét-napló (szexuális együttlétek követése)
- A nap-belépésben új **💞 Együttlét** szekció. Alap típus: **❤️ Együttlét**.
- **Saját típusok** hozzáadhatók (név + **emoji** az emoji-készletből), pl. a
  felhasználó maga dizájnolhatja, mit ért „együttlét" alatt. Egyszerre több
  bejegyzés is rögzíthető egy napra.
- **Védekezés:** minden bejegyzésnél „Volt védekezés? Nem / Igen". Igennél
  **mód(ok)** választhatók (alap: **🛡️ Óvszer**), **saját módok** is
  hozzáadhatók emojival, és **több is** jelölhető. A módok elmentődnek, később
  újra választhatók.
- **Naptár-vizualizáció:** a nap típus-emojija megjelenik a naptárcellában.
  **Védekezéssel → az emoji bekarikázva** (kis gyűrű); **védekezés nélkül →
  csak az emoji**. A pontos védekezési mód a nap megnyitásakor látszik.
- Adat: `S.cycle.intim = {types:[{id,label,emoji}], methods:[{id,label,emoji}]}`,
  és `logs[nap].acts = [{id, typeId, prot, methods:[]}]`.

### 4. „Tudnivalók a ciklusról" — alapból összecsukva
- Az egész blokk egy **összecsukható** szekció a fül alján („nyisd ki"). Nem
  foglal helyet, de kinyitva ott a mini-oktatóanyag.

### 5. Kiemelt visszaszámláló
- A **„következő menstruációig hátralévő napok"** most **nagyban, középre,
  külön kiemelt blokkban** (`.cyc-count`) — egyből szembeötlik. Sávos becslésnél
  a tartományt mutatja; „ma/késik" állapotot is kezel. Menstruáció alatt elrejti.

### 6. Naptár: lapozás + havi/éves nézet
- **Jobbra-balra húzással lapozható** (`bindCycSwipe`, touch): havi nézetben
  hónap, éves nézetben év lép.
- A naptár felett **„Havi / Éves" nézetváltó**. Éves nézet: 12 mini-hónap,
  menstruáció/becslés/együttlét színezéssel; egy hónapra koppintva a részletes
  havi nézetre ugrik.

## Technikai
- `S.cycle.version` 1 → **2** (`normCycle`: `intim`, `settings.calView`,
  `logs[].acts` normalizálása; hiányzó mezők alapértelmezettel). `S.version`
  marad 10 — csak opcionális mezők jöttek. A `szintlepo3` kulcs változatlan.
- `sw.js` cache **v48 → v49**; `APP_VERSION` v10 → **v11**.
- `CHANGELOG` v2 bejegyzés → „Mi újult meg?" felugrik frissítéskor.
- Szinkron/export automatikus (`S.cycle` az `S` része).

## Böngésző-füstteszt (mind zöld)
- Szintaxis OK (`new Function` a teljes inline scriptre); boot hibamentes.
- Visszamenőleges kezdet 07-15 → vég 07-18 → 15–18 kitöltve, 19 nem.
- Vérzés-erősség: nincs nem-menstruációs napon, van menstruációs napon.
- Együttlét: szerkesztő + védekezés + mód + új típus/emoji-választó → mentés →
  naptárcellában emoji **bekarikázva**.
- Éves nézet (12 hónap) ↔ hónapra-koppintás ↔ havi nav.
- Reload (normalize roundtrip): minden adat megmarad.

## FONTOS tanulság (szintaxis)
- A magyar `„…"` idézőjeleknél a **záró görbe** `"` (U+201D) kell, ha a szöveg
  **dupla idézőjeles** JS-stringben van — egy egyenes `"` lezárja a stringet és
  **az egész inline script elszáll** (néma: az app csak a statikus HTML-t mutatja,
  a splash beragad). Kiadás előtt mindig `new Function`-nel ellenőrizni.

## Feltöltés (GitHub Pages, git push)
1. `index.html`, `sw.js`, `JAVITASOK_ciklus2.md` felmegy.
2. Az appban **frissíts kétszer** (Frissítés → új SW → újratöltés).
3. Ellenőrzés: „Mi újult meg?" felugrik; Ciklus fül → nap-belépés (kezdet/vég,
   együttlét), éves nézet, visszaszámláló, összecsukott tudnivalók.

## Hátralévő (korábbról)
- App-szintű PIN/jelszó (elhalasztva).
- Hangulatkövető külön modul.
