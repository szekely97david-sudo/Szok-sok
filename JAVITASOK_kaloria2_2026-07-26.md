# Kalóriaszámláló — 2. kör: kompakt Ma-fül + táblázat-olvasás (2026-07-26)

`APP_VERSION v24` · `sw.js v62` · `CHANGELOG v12`

Négy dolog volt a kifogás, mind a négy meg van csinálva.

---

## 1) A Ma fül elrendezése (MyNetDiary-szerű, de a mi adatainkkal)

**Előtte:** középre igazított gyűrű, két nagy üres folt mellette; alatta négy
étkezés-kártya (köztük üresek is), mindegyiken külön „+" gomb; alatta hét
gyorsművelet-gomb. Nagyon szét volt szórva, és görgetni kellett.

**Utána:**

```
┌──────────────────────────────────────────┐
│  ┌────────┐   🌅 Reggeli          686 kcal│
│  │ gyűrű  │   42 g F · 88 g Sz · 29%      │
│  │  1176  │   ☀️ Ebéd            1688 kcal│
│  │ maradt │   129 g F · 127 g Sz · 71%    │
│  └────────┘   🏋️ Edzés            +250   │
│  F 29% Sz 37% Zs 34%  Felsőtest A · 62 p  │
│  2374 elfogy. │ 3550 keret │ 9 g fehérje  │
└──────────────────────────────────────────┘
```

- **A gyűrű balra csúszott**, mellette jobbra az étkezés-oszlop.
- **Csak azok az étkezések jelennek meg, amikbe már rögzítettél**, mindig a
  beállított sorrendben. Az üres étkezések nem foglalnak helyet.
- Minden sor alatt: **fehérje g · szénhidrát g · a napi bevitt kalória hány
  százaléka**. (A zsírt/rostot szándékosan nem írjuk ki — nem fért volna el
  olvashatóan, és a kérés is ez a kettő volt.)
- **🏋️ Edzés sor**: ha aznap van edzés az Edzésnaplóban, megjelenik az edzés
  nevével és hosszával, mellette az edzésnapi plusz keret. Koppintásra átvált az
  Edzésnapló modulra. (Ez hiányzott a MyNetDiary-hez képest.)
- **A gyűrű makrónként színezett**: a kitöltött ív fehérje (arany) → szénhidrát
  (kék) → zsír (lila) sorrendben van szeletelve, alatta a százalékos bontás.
  A szeletek `stroke-dashoffset`-tel kerülnek egymás után, `butt` véggel, hogy ne
  fedjék egymást. Ha a három makró kcal-összege nem egyezik a naplózott kcal-lal
  (kerekítés, alkohol, csak-kcal gyors bevitel), **arányosan a naplózott összegre
  skálázzuk** — így a gyűrű mindig annyi, amennyi tényleg be van írva.
- A gyűrű alatti sáv (**elfogyasztva / napi keret / fehérje hátra**) és a
  makró-sávok kártyája változatlan — ezekkel elégedett voltál.
- Az étkezés-sorra koppintva a **lenti naplórészhez görget** és felvillantja azt.

**Eredmény mérve** (375×812-es telefon-ablak): dátumsáv `71→117`,
gyűrű-kártya `121→414`, makró-sávok `426→618`, Bevitel gomb `686→738`.
**A teljes napi állás elfér egy képernyőn, görgetés nélkül.**

## 2) Egyetlen „＋ Bevitel" gomb

- Eltűnt a hét gyorsművelet-gomb és az étkezésenkénti „+".
- Helyettük **egy nagy gomb a lap alján**, `position:sticky; bottom:74px` —
  görgetés közben is a helyén marad, és a visszavonás-sáv megjelenésekor
  feljebb csúszik (`#tab-kaloria.has-undo .kc-inbar{bottom:118px}`).
- A lenti napló-kártyák csak akkor jelennek meg, ha van bennük tétel.

## 3) A Bevitel lap

- Fent **valódi legördülő** (`<select>`) az étkezéshez, a napszak alapján előre
  kitöltve (`kcGuessMeal()`: 10:30 előtt az 1., 15:00-ig a 2., 17:00-ig a 3.,
  utána az utolsó étkezés). Csak javaslat, egy koppintással átállítható.
- Alatta a kereső, alatta **rögtön a találatok** — sokkal több fér ki.
- A gyors bevitel, saját étel, vonalkód, címke, **táblázat**, tányér, másolás
  tegnapról, sablon és „mi fér még bele" egy **összecsukott `⋯ Egyéb bevitel`**
  blokkba került (`<details>`), ami megjegyzi, ha kinyitottad.
- **A billentyűzet nem ugrik fel magától** — kivettük a `q.focus()`-t a
  `kcAddWire()`-ből. Csak akkor jön, ha tényleg a keresőmezőre koppintasz.

## 4) 📊 Táblázat fotó — a legnagyobb fájdalom

**Miért nem ment eddig:** két hiba volt egyszerre.

1. **A kép fele akkora volt, mint hitted.** A `woImgFile()` már lekicsinyítette
   560 px-re, aztán a `kcLabelShot()` **még egyszer** ráhívta a `woShrink()`-et.
   Egy sűrű, több oszlopos tápérték-táblázat ezen a felbontáson egyszerűen
   olvashatatlan. → A `woShrink`/`woImgFile` mostantól kap `maxPx` és `quality`
   paramétert, a címke és a táblázat **1280 px @ 0.85** felbontással megy fel
   (a dupla kicsinyítés megszűnt). A tányér-fotó 860 px-en marad, ott nem
   szövegolvasás a feladat.
2. **Az AI-nak egyszerre kellett olvasnia ÉS értelmeznie.** A régi címke-prompt
   egy kész `{kcal, protein, carbs…}` objektumot kért — ha a képen három oszlop
   volt (100 g / adag / RM%), gyakran összekeverte őket, és nem lehetett
   észrevenni, hogy melyik oszlopból dolgozott.

**A megoldás: kettéválasztjuk a munkát.**

- Az AI **csak a rácsot olvassa ki**, értelmezés nélkül: `columns` (fejlécek +
  hogy 100 g-ra vagy adagra szólnak) és `rows` (soronként a felirat szó szerint,
  a mértékegység, és a számok oszlop-sorrendben). `temperature: 0.05`.
- Utána **te értelmezel egy legördülővel**. Minden sornál ott a képről kiolvasott
  felirat, mellette egy `select` (Energia kcal / Energia kJ / Fehérje /
  Szénhidrát / ebből cukor / Zsír / ebből telített / Rost / Só / — nem kell) és
  a **szerkeszthető szám**. A szerepet megtippeljük a feliratból
  (`kcTGuessRole`), de bármit felül tudsz írni.
- Több oszlopnál **chipekkel választod ki, melyik kell**; ha adagra szól, megadod
  az adag grammját, és 100 g-ra váltunk.
- Élő előnézet: mennyi jön ki 100 grammra.
- Amerikai címkéhez egy pipa: **„a szénhidrát tartalmazza a rostot" → kivonjuk**.
- **Mentés:** ha megadod a nevét → saját ételként (átnézhető szerkesztőbe kerül,
  az adag-egységgel együtt); ha üresen hagyod → csak a kalóriát és a makrókat
  naplózza a gyors bevitelen keresztül.

Ez azért jobb, mint egy „okosabb prompt": **akkor is használható, ha a felismerés
csak félig sikerül.** A számok ott vannak, a rossz szerepet átállítod, a rossz
számot átírod — nem kell mindent kézzel bepötyögni.

Mellékesen javítva: a `kcQueuePush()` eddig **eldobta a `Store.setSafe()`
visszatérési értékét**, tehát ha a kép nem fért ki a localStorage-ba, azt mondta,
hogy „várólistára tettem" — pedig nem. Most szól, ha nem sikerült.

---

## Amit böngészőben ellenőriztem (python http.server + preview, 0 konzolhiba)

- Ma fül: gyűrű-szeletek matematikája (63,7+80,1+74,6 = 218,4 / 326,7 = 66,9% =
  2374/3550 ✓), jelmagyarázat (F 29% · Sz 37% · Zs 34% — **pontosan annyi, amit a
  MyNetDiary is kiír a te screenshotodon**), étkezés-sorok, Edzés-sor az
  Edzésnaplóból, sorra koppintás → görgetés, üres nap, vízszintes túlcsordulás
  nincs, a Bevitel gomb nem takarja a visszavonás-sávot.
- Bevitel lap: nincs autofocus, `select` alapból a napszak szerint, `⋯ Egyéb`
  csukva, mind a 9 gomb bekötve, keresés (`tojás` → 3 találat).
- Táblázat: valósághű magyar EU-címkével (kJ+kcal külön sor, „amelyből telített
  zsírsavak", „amelyből cukrok") **mind a 9 sor szerepét eltalálta a tipp**;
  oszlopváltás 100 g ↔ 1 szelet (30 g) → 441 vs 440 kcal/100 g (kerekítésen belül
  ✓); rost-kivonás 58 → 53 ✓; névvel → előtöltött étel-szerkesztő ✓; név nélkül →
  előtöltött gyors bevitel ✓.
- Ételek fül és Statisztika fül változatlanul renderel, az új 📊 gomb bekötve.

**Amit nem tudtam tesztelni:** a valódi Gemini-hívást (kulcs kell hozzá) és a
kamerás fotózást. A kódút, a hibaág és a várólista-ág tesztelve; a felismerés
minőségét telefonon, valódi táblázaton érdemes visszaigazolni.

## Ami maradt ötletnek

- Balra/jobbra húzás a dátum-váltáshoz (a MyNetDiary-ben így megy) — most a
  ‹ › gombok vannak. Ütközhet a vissza-gesztussal, ezért nem nyúltam hozzá.
- A táblázat-fotó vágása az appon belül (most a kamerával közelítesz rá).
- Adaptív TDEE automatikus keret-korrekció, víz-követés, app-szintű PIN.

---

# Utókör ugyanaznap — edzésnapi hullámzás + kétlépcsős bevitel

## 0) Valódi hiba, amit a user screenshotja mutatott meg

A `.kc-hnum` (a gyűrű közepén lévő szám) **CSS-szabályát véletlenül kitöröltem**,
amikor a `.kc-hero` blokkot átírtam. Emiatt elvesztette a `position:absolute`-ot,
kicsúszott a gyűrű alá, és **rácsúszott a jelmagyarázatra**. Visszatéve.

Ugyanitt derült ki egy **osztálynév-ütközés** is: a `.kc-rleg` már foglalt volt a
Statisztika fül makró-jelmagyarázatához (más betűméret, `flex-wrap:wrap`), és az a
későbbi szabály felülírta az enyémet. A gyűrű alatti sáv új neve: **`.kc-mleg`**.

## 1) Edzésnap: hogyan működik MOSTANTÓL

Eddig: az Edzésnapló `sessions[].d`-jéből tudta, hogy edzésnap van, és a
`trainBonus`-t **hozzáadta** — vagyis a heti átlagod is nőtt vele. Kézzel nem
lehetett jelölni.

Mostantól:

- **`S.food.td[dátum]`** = kézi jelölés (1/0). **Erősebb, mint az automatika**, tehát
  előre bejelölheted a hét edzésnapjait, és felül is bírálhatod. Ha a kézi érték
  egyezik azzal, amit az Edzésnapló amúgy is tudna, a bejegyzés törlődik — nem
  gyűlik felesleges adat a szinkronba.
- **A Ma fülön egy koppintás**: a chip váltogat `🏋️ Edzésnap` ↔ `😴 Pihenőnap`, és
  kiírja az aznapi eltolást előjelesen (`+171` / `−229`).
- **Célok → Finomhangolás**: `Edzésnapi eltolás (kcal)` + **`Hetente hány edzésnap?`**
  + pipa: **„A heti átlag ne változzon"** (alapból BE).

**A számítás** (`kcTrainDelta`), ha a heti átlag megmarad és `n` edzésnap van:

```
edzésnap:   keret + eltolás × (7 − n) / 7
pihenőnap:  keret − eltolás × n / 7
```

Így `n × edzésnap + (7−n) × pihenőnap = 7 × keret` — a beállított napi keret
pontosan **a hét átlaga** marad. Ellenőrizve: 3300 kcal keret, 400 kcal eltolás,
4 edzésnap → **3471 / 3071**, hetente 23 097 kcal = 3299,6 kcal/nap ✓. A két nap
különbsége pontosan a beírt 400 kcal ✓.

Kikapcsolt pipával a régi viselkedés marad (a plusz rájön a hétre), és a beállítás
alatt akkor is **konkrét számokkal** kiírjuk, mi jön ki — nem magyarázattal.

Az eltolás a kiválasztott makróba megy (alapból szénhidrát), pihenőnapon negatív
előjellel, 0-ra vágva. A heti kalória-bank (`kcTargets0`) is az új eltolással
számol, tehát a kettő nem üti egymást.

## 2) 🏋️ Edzés mint étkezés

A `__wo` sor félreértés volt: nem az edzést akartad itt látni, hanem **az edzés
körüli étkezést** rögzíteni. Ezért az `🏋️ Edzés` mostantól **valódi étkezés**
(`KCMEALS_DEF`), és egy **egyszeri migráció** hozzáteszi a meglévő négyhez
(`set.mealsWo` jelző). Ha kiveszed az „étkezések szerkesztése" alatt, **nem jön
vissza** — a jelző marad true.

## 3) Bevitel lap: két lépés

- **1. lépés:** csak az étkezés-csempék egy sorban (a `⋯ Egyéb` blokkal együtt).
  Kereső még nincs. `grid-template-columns:repeat(auto-fit,minmax(50px,1fr))` —
  320 px-en mind az 5 elfér egy sorban, 8 étkezésnél két egyenletes sor lesz.
- **2. lépés:** koppintás után jön a kereső, és alatta rögtön a
  **„Ezt szoktad — Reggeli"** lista: az `kcFreqForMeal()` az elmúlt **90 nap**
  naplójából számolja, mit raktál a legtöbbször **abba** az étkezésbe. Utána a
  kedvencek / legutóbbi / saját / receptek — duplikátum nélkül.
- A legördülő `<select>` helyett csempesor, ahogy kérted. Autofocus továbbra sincs.

## 4) Gyűrű és fejléc

- A gyűrű közepén: **a keret hány százalékát etted meg** (túllépésnél pirosan).
- A sáv 4 oszlopos lett, és **a „maradt" került előre**: `maradt · elfogyasztva ·
  napi keret · fehérje hátra`.

## Ellenőrizve (320 px-es ablakon is, 0 konzolhiba)

Gyűrű-közép a helyén (a `.kc-hnum` doboza pontosan fedi a gyűrűt), jelmagyarázat
egy sorban 12 px magasan túlcsordulás nélkül, edzésnap-kapcsoló oda-vissza
(3471 ↔ 3071, és visszakapcsolásnál a felesleges `td` bejegyzés törlődik),
Célok-panel élő újraszámolása (4 → 6 edzésnap, pipa ki/be), étkezés-csempék
5 és 8 étkezéssel, kétlépcsős bevitel a „Ezt szoktad" listával, mentés/visszatöltés
kör (a `td`, a `mealsWo` és az új beállítások túlélik), a `wo` étkezés törlése után
nem támad fel, mindhárom al-fül renderel.
