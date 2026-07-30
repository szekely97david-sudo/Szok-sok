# Átadó — Trellis: váltás Flutterre

**Dátum:** 2026-07-30
**Állapot:** döntés megszületett, kód még nem indult
**Cél:** ez a fájl önmagában elég ahhoz, hogy egy új chat hidegen folytassa

---

## 0. Miért váltunk

A jelenlegi Trellis egyfájlos PWA (`index.html`, ~14 700 sor, 1,13 MB), GitHub Pages-en.
Három dolog nem oldható meg benne, és ez indokolja a váltást:

1. **Kezdőképernyős widget** — weben nem létezik, natív kód kell hozzá.
2. **Időzített helyi emlékeztető** — a web nem tud megbízhatóan időzített értesítést.
3. **Fizetőssé tétel** — Play Billing csak valódi alkalmazásban.

Emellett a felhasználó tapasztalja: kijelölődik a szöveg, az 1 MB-os Firestore-korlát
falba fut, képet nem lehet felhőbe menteni, és az ötletek rendszeresen webes korlátokba
ütköznek.

**Megvizsgált alternatívák és miért estek ki:**

- *Capacitor-burok* — leggyorsabb (napok), de a webnézet marad, tehát a panaszok fele
  megmarad. Halasztás, nem megoldás.
- *Natív Kotlin + Compose* — a plafon ugyanaz, mint Flutterben (ami hiányzik, azt
  platform channellel Kotlinban pótolod). Cserébe: iOS örökre kizárva, lassabb
  iteráció (a felhasználó 60 verziót csinált egy hónap alatt — az iterációs sebesség
  nála kritikus), több kód, és a Google 3-5 évente úgyis lecseréli a saját ajánlott
  építkezési módját. Nem tartósabb, csak nehezebb.
- **Flutter — ez a döntés.** Dart közel áll a JS-hez (a felhasználó olvassa a kódot),
  hot reload megtartja a jelenlegi ritmust, iOS opció nyitva marad, a szükséges
  csomagok többsége Google-karbantartású.

---

## 1. AZ ADATVESZTÉS OKA — kód-szinten azonosítva

**Ez az átadó legfontosabb része. Az új adatréteget ennek ismeretében kell megtervezni.**

### Tünet

2026-07-30 délután rögzített étel két óra múlva még megvolt, este eltűnt.
Egy eszköz, nincs másik belépés, nincs kézi szinkron.

### Ok: *lost update* — hiányzó verzióellenőrzés

Három rész együtt:

**(a)** `save()` (index.html:8009) minden mentésnél `S.updatedAt = Date.now()`-t üt az
állapotra — **akkor is, ha a memóriabeli állapot elavult**.

**(b)** `cloudResolve` (index.html:12140-12151) ezt az időbélyeget használja
döntéshozatalra, és `applyRemote()`-tal **teljesen felülír**, nem fésül. A védőkorlát
(12148. sor) csak akkor lép be, ha a nyertes >10%-kal kisebb a vesztesnél — **egyetlen
étel ennél sokkal kisebb**, ezért soha nem szólal meg.

**(c)** Nincs semmilyen többpéldány-védelem: nincs `BroadcastChannel`, nincs `storage`
eseményfigyelő. Ellenőrizve, nulla találat.

### A forgatókönyv (egy eszköz is elég)

Ugyanaz a telefon két példányban: a telepített PWA **és** egy Chrome-fül ugyanazon a
címen (a „Widgetek és gyorsindítók" panel maga is megnyitja böngészőben).
Mindkettőnek saját memóriabeli `S` állapota van.

1. Reggel megnyílik az „A" példány → memóriájában a reggeli adat, háttérben él.
2. Délután a „B" példányban rögzül az étel → helyi tár + felhő frissül. ✅
3. Este visszaváltás az „A"-ra → `visibilitychange` → `dayRollover()` → `save()`.
4. Az „A" a **reggeli** adatra üti a mostani időbélyeget, és felülírja a helyi tárat
   ÉS a felhőt.
5. Az ebéd eltűnt.

### Amit ki lehetett zárni

- **Nem a localStorage megtelése.** `persist()` (index.html:7999) kezeli: ha tele van,
  eldobja a legrégebbi mentéseket és újrapróbálja.
- **Nem a `kcCollapse()`.** Az csak `KCKEEP=180` napnál régebbi napokat ürít.
- **Nem az 1 MB-os Firestore-korlát** (bár az külön, valós veszély — a `kcSizeCheck`
  780 KB-nál figyelmeztet).

### Tanulság az új appra — KÖTELEZŐ

1. **Soha ne írj vissza teljes állapotot.** Csak azt a mezőt/dokumentumot, ami változott.
2. **Verzióellenőrzés írás előtt** (Firestore tranzakció vagy `updatedAt` összevetése
   a betöltéskori értékkel). Ha közben más írt: fésülj, ne írj felül.
3. **Egy igazságforrás.** A Firestore beépített offline gyorsítótára legyen az egyetlen
   tároló — ne legyen külön „helyi" és „felhős" állapot, ami szétcsúszhat.
4. **Élő figyelők (`snapshot listener`)**, hogy minden példány mindig a friss adatot lássa.

### Ideiglenes tűzoltás a régi PWA-ban — MEGTÖRTÉNT (app v38, sw v76)

A PWA befagyasztása előtt ez a javítás bement, hogy az átállás hetei alatt ne vesszen
több adat:

1. **`_baseUpdatedAt` + `szintlepo3_at` jelölőkulcs.** A példány megjegyzi, melyik
   állapotot töltötte be / írta ki utoljára. A jelölő külön, pici kulcs, így nem kell
   minden mentésnél a teljes állapotot elemezni (mért: 200 mentés = 7 ms).
2. **`reconcileBeforeWrite()`** a `persist()` elején: ha a tárban más időbélyeg van,
   mint amit mi írtunk, akkor `mergeStates`-szel **fésül**, nem ír felül. A saját
   oldal a BETÖLTÉSKORI időbélyeggel megy a fésülésbe — különben az elavult példány
   tűnne frissebbnek.
3. **`mgFoodDays()`** — új, tétel szintű fésülés a kalória-naplónapokra. A tételeknek
   nincs azonosítójuk, ezért a nap nem cserélhető le egészben; unió + pontos egyezés
   szerinti duplikátum-szűrés + idő szerinti rendezés.
4. **`kcResyncMergedTot()`** — fésülés után a napi összeg-cache újraszámolása az
   érintett napokra (különben rossz kalóriaösszeg látszana).
5. **`storage` eseményfigyelő** — a másik példány írását azonnal átvesszük.
   Szándékosan nem írunk vissza (végtelen kör). Ez csak kényelmi réteg; a tényleges
   adatvédelmet a 2. pont adja, mert a storage-esemény nem minden böngészőben jut át
   telepített app és böngészőfül között.
6. **`cloudResolve`**: `applyRemote(remote)` helyett `applyRemote(mergeStates(S,remote))`.
   Eddig a felhő frissebb állapota teljesen felülírta a helyit, és a még fel nem
   töltött tételek elvesztek. A 10%-os védőkorlát ezt nem fogta meg, mert egy étel a
   napi adat töredéke.

**Böngésző-teszt (localhost, zöld):** a lost-update forgatókönyv szimulálva —
mindhárom tétel (másik példányé + sajátunk + a közös) megmarad, nincs duplikátum,
a napi összeg helyesen 1500 kcal. Nincs konzolhiba.

**Amit a javítás NEM old meg:** ha ugyanazt a tételt ugyanabban a percben, ugyanabba
az étkezésbe kétszer viszed fel KÉT KÜLÖNBÖZŐ példányban, a duplikátum-szűrés eggyé
vonja. Elhanyagolható, és sokkal jobb, mint adatot veszíteni.

**Ajánlott kerülőút továbbra is:** ne legyen egyszerre két példány nyitva — csak a
telepített app, a Chrome-fülek legyenek bezárva.

---

## 2. Meghozott döntések

| # | téma | döntés |
|---|---|---|
| 1 | **Adatszerkezet** | Vége az „egy dokumentum = az egész app" modellnek. Modulonként és időszakonként bontott algyűjtemények; a kalória-napló **naponta egy dokumentum**. Képek a Firebase Storage-ba, a dokumentumban csak hivatkozás. |
| 2 | **Helyi tárolás** | Nincs külön helyi adatbázis. A **Firestore beépített offline gyorsítótára** az egyetlen tároló. Ez szünteti meg az 1. pontban leírt hibaosztályt. |
| 3 | **Állapotkezelés** | **Riverpod.** Egy megközelítés, következetesen. |
| 4 | **Átállás** | A PWA **befagy** (csak kritikus hibajavítás). Az adatot egyszer átalakítjuk, onnantól a Flutter az igazság. Átmenetileg a PWA még használható, de csak olvasásra. |
| 5 | **Csomagnév** | **ELDÖNTENDŐ** — `hu.trellis.app` vagy `com.szekelydavid.trellis`. Play-feltöltés után SOHA nem módosítható. |
| 6 | **minSdk** | **26 (Android 8).** Megerősítve: semmiben nem korlátoz. |
| 7 | **Modul-sorrend** | 1. kör: **Kalória + Szokáskövetés**. Utána: Edzés, Biblia, Ciklus, Közös lista. |
| 8 | **Témák** | A 9 téma + egyéni szerkesztő átjön, de **az első kör után**. Kezdés egy témával. |
| 9 | **Fizetőssé tétel** | Lesz. A felhasználói modellt erre készítjük fel. A tényleges Play Billing a végére marad. **A Play Console regisztrációt korán el kell indítani** (25 USD + új személyes fiókoknál 12 tesztelő × 14 nap zárt teszt). |

### Hatókör-változás — FONTOS

**A szokáskövető modulból KIMARAD a pontrendszer és a szintlépés.**
Nem portoljuk: pontozó motor, szintek, jutalmak, levonások, joker, streak-pontok,
`missFrom`, skálázódó levonás. A modul marad: célok, ütemezés, teljesítés-jelölés,
bepótlás, haladás-áttekintés — **pontszám nélkül**.

Ez jelentősen egyszerűsíti a modult; a régi `goal*`/`metric*`/`meta*` kód pontozási
részét **nem kell megérteni és nem kell átvinni**.

---

## 3. Token-gazdálkodás az új projektben

A jelenlegi CLAUDE.md első fejezete teljes egészében **egyetlen probléma** köré épül:
14 700 sor egy fájlban. Flutterben ez a probléma megszűnik.

Szabályok az új projektre:

1. **Fájlfegyelem.** Egy fájl 100-300 sor. 400 fölött kettévágjuk. Egy képernyő,
   egy modell, egy szolgáltatás = egy fájl.
2. **Új CLAUDE.md a projektbe**, benne modul-térkép és fájlszerkezet. Egyszer íródik,
   minden session elején spórol.
3. **`flutter analyze` fájlolvasás helyett.** A fordító megmondja a fájlt és a sort —
   nem kell keresgélni. Ez a legnagyobb megtakarítás a mostanihoz képest.
4. **Adatfájlok tabu**: `karoli.json` (4,3 MB), `quiz-bank.json`, `bible-meta.json`,
   `bible-orders.json`, `food-db.json`, `exercises.json`, `text/*.json`.
   Ha adat kell belőlük: script dolgozza fel, ne kontextusba töltsük.
5. **Git kötelező.** A `git diff` olcsóbb, mint fájlokat újraolvasni.
6. **Kód-indexelő MCP egyelőre NEM.** Van beállítási költsége, és a fenti pontok után
   valószínűleg felesleges. Fél év múlva újraértékelendő.

---

## 4. Amit a régi appból tudni kell

- Fő fájl: `C:\Users\szeke\Desktop\Claude\App\index.html`
- **Soha ne olvasd be egyben** (~250 000 token). Grep → `Read` offset/limit ±60 sor.
- `_bak/` és `_doc/` mappákban ne keress (régi másolatok, lezárt naplók).
- Nincs `node.exe` a gépen. Ez **változni fog** — a Flutterhez Android Studio + JDK kell.
- Modul-prefixek a régi kódban: `wo*` edzés, `kc*` kalória, `bible*`/`quiz*` Biblia,
  `cyc*` ciklus, `nl*`/`lst*` listák, `goal*`/`metric*`/`meta*` szokáskövető,
  `drive*`/`cloud*`/`mg*` szinkron, `bak*` helyi mentések, `wgt*` widget-panel.
- Firestore szerkezet MA: `users/{uid}` **egyetlen dokumentum = a teljes állapot**
  (ez a baj), `users/{uid}/backups/{dátum}`, `quizbank/*`, `sharedlists/*`, `households/*`.
- Firebase kulcsok: `firebase-config.js`. Google-belépés + Firestore.
- Kiadási checklist a régi apphoz: `sw.js` → `VERSION`++, `index.html` → `APP_VERSION`++,
  `whatsNewHtml` → új bejegyzés. Feltöltés git clone + push.

---

## 5. Következő lépések

1. **Csomagnév eldöntése** (2. táblázat 5. sor) — ez blokkoló a projekt létrehozásához.
2. **Adatmentés az átállás előtt.** A régi állapotot exportálni kell, mielőtt bármi
   történik — az 1. pontban leírt hiba miatt most is veszhet adat.
3. **Play Console regisztráció elindítása** (a 12 tesztelős szabály miatt hetekbe telik).
4. Környezet: Android Studio + JDK + Android SDK + Flutter SDK + PATH, majd
   `flutter doctor` zöldre.
5. `flutter create` → az új adatmodell megtervezése (Kalória + Szokások) → első kör.
6. Új CLAUDE.md írása a Flutter-projektbe.

---

## 6. Amit a felhasználó tudjon, mielőtt belevág

- **Az Android megeszi az értesítéseket.** A gyártói akkukímélők (Xiaomi, Samsung,
  Huawei, OnePlus) dokumentálatlanul ölik a háttérfolyamatokat. Ez **natívban is így
  van** — nem a technológia javítja, hanem a felhasználó kézi kivétele a beállításokban.
  A natív burok sokkal jobb lesz a mostani semminél, de nem 100%-os.
- **Az iOS nem ingyen van.** A kód ingyen jön, a kiadás nem: Mac kell, és **évi 99 USD**
  Apple fejlesztői fiók (a Google 25 USD-je egyszeri). Az iOS **opció**, nem ajándék.
- **Google-elköteleződési kockázat.** A Flutter nyílt forráskódú és széles körben
  használt, nem tűnik el — de a hosszú távú befektetési szint valódi ismeretlen.
- **Frissítési adó.** Évente 1-2 nap tiszta karbantartás (Flutter/Gradle/Android
  verzióváltás). Ha két évig kimarad, fájdalmasabb.
- **A Play Áruház kapuőrré válik.** Vége az azonnali kiadásnak. Átvizsgálás,
  adatbiztonsági nyilatkozat, adatvédelmi tájékoztató. **A ciklusmodul egészségügyi
  adat** → külön Play-szabályok és GDPR. Fizetőssé tételnél kereskedői + adóstátusz.
- **A hibák a build-láncból jönnek, nem a Dartból.** Gradle/AGP/JDK verzióütközések
  50-100 soros érthetetlen hibákat dobnak, teljesen függetlenül attól, jó-e a kód.
