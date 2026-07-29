# Kis javítások kör — 2026-07-29 (app v35, sw v73, CHANGELOG v21)

A közös fejlesztési lista (`sharedlists/dev`) nyitott tételeiből a **kicsik**.
A nagy tételek (bevásárlólista-modul, edzés-naptár színek, pontrendszer-redesign,
Yazio-szerű recept-ajánló) szándékosan kimaradtak.

## 1. Kalória — mennyiség-bevitel

| tétel | mit |
|---|---|
| egység-emlékezés | `kcQtyOpen` és `kcBaskDefQ` eddig grammra váltotta a megjegyzett „1 adag"/„1 db"-ot (`gramFirst`). Mostantól **abban az egységben nyílik, ahogy legutóbb rögzítetted**; a gramm-alap csak akkor dönt, ha nincs emlék. |
| egész darabok | új `KCWHOLEU` regex (db, szelet, tojás, gerezd, kocka, doboz, golyó, gombóc, közepes, az egész, karika, cikk) → `kcQStep` 1-es lépés. Az „adag", „pohár", kanalak maradtak tizedesek. `kcNotch` külső gyűrűje ilyenkor 5 (nem 15). |
| új egység presetje | `kcUnitAdd` mentés után `kcQtyOpen`-t **preset nélkül** hívta, ezért az imént felvitt „adag = 500 g" helyett 100 g jött vissza. Most `{q:1,u:<új egység>}` megy át, és `kcQtyOpen`-ben a **preset erősebb**, mint a szerkesztett naplósor régi értéke (a preset eddig is csak `editIdx==null` mellett érkezett, így ez visszafelé biztonságos). |
| keresősor | `kcResGroup`: a név alatt „legutóbb 150 g", pontosan az, amit a gyors ＋ hozzáad. |

## 2. Közös háztartás — a helyi módosítás nem vész el

`hhApply` eddig **mindig** a felhő verzióját írta a helyi fölé, ha eltért. Ha egy már
megosztott ételhez utólag vonalkódot írtál, és a 2,5 s-os push-késleltetés alatt
befutott egy pillanatkép, a régi felhő-változat csendben visszaírta a módosítást —
így az nemcsak fel nem ment, el is veszett.

Most **háromutas összevetés** van: a `sl_hh_m_<hid>` tükör (`mir`) a közös kiindulópont.

- helyi sig == mir → tiszta, a felhő nyer;
- helyi sig != mir → helyben módosítottuk, **a helyi marad**, és a záró `hhPushSoon()` viszi fel;
- nincs mir-bejegyzés (új eszköz, törölt tükör) → a felhő nyer (nehogy egy régi helyi másolat felülírja mindenkinél).

## 3. Szokáskövetés — lapozás a célon belül

`bindGoalDetail` eddig **kinullázta** a `#tab-ma` húzás-kezelőit. Most `bindSwipe()`-ot
hív: a cél-részletben ugyanaz a balra-jobbra mozdulat vált napot, és a `renderMa`
a megnyitott célon belül marad. A dátumválasztó alá bekerült a szokásos súgó-sor.

## 4. Közös lista — modul-címke

- `NL_MODS` (8 kosár: 5 modul + közös lista + szinkron/fiók + általános), `mod` mező a tételen.
- Az űrlapon legördülő „Melyik részhez?"; a választás megjegyződik (`Store: nlMod`).
- A **nyitott tételek modulonként, blokkokban** jelennek meg; a „Kész" listán chipként látszik a modul.
- A „📋 Egész lista másolása" markdownja is modulonként tagolt (`### 🍎 Kalória (2)`).
- Firestore-szabály nem változott (a `create` nem tiltja az extra mezőt).

## 5. Modul-parancsikonok

`manifest.webmanifest` → `shortcuts` (Szokások, Kalória, Edzés, Biblia, Ciklus),
`./?m=<modul>` URL-lel. `startupOpen()` a paramétert feldolgozza (`openModule`),
utána `history.replaceState`-tel kiszedi, hogy ne ragadjon bent. Kikapcsolt modulnál
nem ugrik oda, hanem szól, hogy a Fiók → Modulok alatt bekapcsolható.
A service worker navigációs ága a query-paraméteres URL-t is kiszolgálja
(offline `caches.match(req)` → `./index.html` tartalék).

## Füstteszt (localhost:8765, böngésző-konzol)

- `kcQStep(db)=1`, `kcQStep(adag)=0.1`, `kcQStep(g)=1`, `kcNotch(db,out)=5`
- `kcBaskDefQ` és `kcQtyOpen` emlékezés után **1 db** (nem 58 g); emlék nélkül 100 g
- keresősor tartalmazza: „legutóbb 2 db"
- `hhApply`: helyi vonalkód megmarad / tiszta helyinél a felhő nyer / tükör nélkül a felhő nyer
- cél-részlet: `ontouchstart` bekötve, szimulált húzás → +1 nap, `maGoal` marad
- közös lista: legördülő + modul-blokkok rendben
- `?m=calories` → `curMod="calories"`, az URL visszaáll `/`-ra, konzol tiszta

## Nyitva maradt

- **„Szinkronizálás hibára fut"** (v28, 2026-07-28) — konkrét hibaüzenet nélkül nem
  reprodukálható; a usertől kell a szöveg/képernyő.
