# Javítások — 2026-07-11 — Alcélok teljes függetlenítése

## Mi változott

A cél-adatmodell eddig egyetlen, cél-szintű `cadence` + `startDate` párt hordozott, és a mércék közül csak
egy lehetett `role:"primary"` (a pontozott "Fő cél"), a többi `role:"secondary"` almérce csak követte a fő
mérce ütemezését, pont nélkül. Ez a javítás megszünteti a primary/secondary megkülönböztetést: **minden
mérce ("alcél") mostantól teljesen önálló mini-cél** — saját ütemezéssel (napi / hét napjai / rugalmas /
streak / eseményalapú számláló / kivétel-alapú), saját kezdő dátummal, saját mérési móddal, saját iránnyal
(építeni/elhagyni) és saját progresszióval, és mindegyik önállóan pontozódik és szintezik.

Egy célnak lehet:
- **egyetlen alcélja** — ez pontosan úgy néz ki és viselkedik, mint a korábbi egyszerű cél (nincs vizuális
  többlet, nincs "N alcél" felirat, a kártya fejléce ugyanazt mutatja, mint eddig);
- vagy **több, egymástól teljesen független alcélja** — ekkor a cél egyetlen kártyaként fogja össze őket a
  Ma fülön, mindegyik saját 🔥 szériával, Lv jelzéssel és a saját ütemezésének megfelelő vezérlővel
  (streak-nagy szám / rugalmas sáv / számláló +1-−1 / normál input) — pl.:

```
[Cél kártya: „Egészség”]
  Reggeli futás  🔥5 · Lv2
  Zöldség adag   🔥3 · Lv1
  Alvás 7h+      🔥1 · Lv1
```

## Módosított/új függvények (index.html)

**Adatmodell + migráció** (transzparens, minden betöltéskor lefut, verziószámtól függetlenül):
- `normMetric(m,sm,gCad,gStart)` — új; minden mérce saját `cadence`/`startDate` mezőjét normalizálja, a
  régi (cél-szintű) `cadence`/`startDate`-et örökölve le, ha a mércének még nincs sajátja.
- `normGoal(g,settings)` — átalakítva; a goal-objektum már nem hordoz `cadence`/`startDate`/`polarity`
  mezőt, ezek mércénkéntiek.
- `normalize(s)` — kiegészítve egy önjavító átalakítással: a régi tally-cél a bejegyzést a
  `entries[gid].__tally` kulcs alatt tárolta (cél-szinten); mostantól a mérce saját id-je alatt
  (`entries[gid][mid]`), hogy egy célon belül több független számláló is elférjen.

**Pontozó motor** (mind mérce-szintűre állítva):
- `metricDayPoints(gid,mid,dayObj)` — új, egy mérce napi pontja.
- `goalDayPoints(gid,dayObj)` — most az összes mérce `metricDayPoints`-jának átlaga (korábban csak a
  primary mércéké).
- `goalStartOk(m,k)`, `cadenceActiveOn(m,k)` — jelentésük nem változott, de mostantól mércét kapnak
  paraméterül (a mérce hordozza a `cadence`/`startDate`-et), nem célt.
- `flexProgress(gid,mid,refKey)` — mérce-szintű (korábban `flexProgress(g,refKey)`).
- `isWeeklyMetric(m)`/`isDailyMetric(m)` — az `isWeeklyGoal`/`isDailyGoal` mérce-szintű utódai.
- `dailyGoalPointsOn(k)`, `hetiPointsFor(refKey)` — mostantól mércénként vödröznek: egyetlen cél
  hozzáadhat pontot a napi ÉS a heti összesítőhöz is, ha van benne napi és heti alcél is.
- `metricStreak`, `metricStreakAvoid` (korábban `goalStreakAvoid`), `avoidSlipped(g,m,k)`, `tallyCount`,
  `tallyLifetime` — mind `(gid,mid,...)` szignatúrára állítva.
- `metricNarrative(g,m)` (korábban `narrative(g)`), `metricLongestStreak(gid,mid)` (korábban
  `longestStreak(gid)`) — mérce-szintűek.
- Törölve: `primaryMetrics`, `isDailyGoal`/`isWeeklyGoal` (cél-szintű), `goalStreak`/`goalStreakAvoid`
  (cél-szintű), `streakClean` (holt kód volt, sehol nem hívták).

**Ma-fül renderelés**:
- `goalCard(g)` — új, egyetlen kártya-renderelő minden célhoz (a régi `goalCardMa`/`goalCardHeti` helyett;
  a napi/heti kártyák és a napi/heti szekciók megszűntek, mindent egy "Mért célok" lista fog össze).
- `metricBlock(g,m,dobj,e)` — új, egy alcél saját vezérlő blokkját rendereli a mérce cadence-típusa
  alapján (streak-nagy szám, rugalmas sáv, számláló, vagy normál input).
- Törölve: `renderNapiSeg`, `renderHetiSeg` (holt kód volt, a `renderMa` már korábban sem hívta őket).
- `onTally(data)` — `"gid|delta"` helyett `"gid|mid|delta"` formátumot vár, és a `entries[gid][mid]` alatt
  tárol (lásd fent a migrációnál).

**Cél-szerkesztő űrlap**:
- A "2. Időzítés és ütemezés" cél-szintű accordion megszűnt — minden `metricEditor(m,i)` blokk saját
  ütemezés-választót (`CAD_LIST`), heti/havi alkalom-számot, kezdő dátumot kapott.
- A "Fő cél"/"Pontozott vs. csak-követett" rádiógomb-sor (`data-mrole`) és a `mb-badge` "Fő cél" jelölés
  megszűnt — minden blokk "Alcél N" címkét kap.
- A tally-cadence-re váltó teljes-form-összecsukó speciális ág megszűnt — a számláló mostantól csak egy a
  mércénkénti ütemezés-választások közül; a többi alcélt nem érinti.
- `bindGoalForm`/`syncForm`/`saveGoal` — a `data-mrole` kezelő törölve, új mérce-szintű kezelők:
  `data-mcad`, `data-mstart`, `data-mtimes`, `data-mrolling`, `data-wd`/`data-per` immár `"i|érték"`
  formátumban (mérce-index).

**Haladás fül**:
- `metricHaladasBlock(g,m)` — új, mércénkénti statisztika-blokk (Lv, pont, 🔥 streak, leghosszabb streak,
  narratíva, boolHistory vagy grafikon) — minden aktív cél kártyája ennyi blokkot rak egymás alá, ahány
  alcélja van.
- A korábbi kártyán-belüli "Cél (össz.) / mérce" chart-tab váltó (`chartSel`, `data-series`) megszűnt, mert
  minden mércének mostantól saját, mindig látható grafikonja van — ez feleslegessé tette a váltogatást.
- `boolHistory(gid,mid)`, `tallySeriesData(gid,mid)`, `metricSeriesData(gid,mid)` — mérce-szintűre állítva;
  új `metricPointSeriesData(gid,mid)` a nem-skála (mennyiség/idő) alcélok napi-pont grafikonjához.

**Cél-lista sor** (`renderCelok`): 1 alcélos célnál pontosan a régi `ütemezés · mérési mód` feliratot mutatja;
több alcélnál `"N alcél"`.

## Szöveges változtatások (magyar UI)

Frissítve azok a szövegek, amelyek a "Fő cél"/"almérce mint másodrangú" keretezést sugallták (onboarding
banner, a "Pontozott vs. csak-követett" info-buborék → "Alcélok", a Súgó "Cél létrehozása" és "Almércék és
szerepük" szakasza, az első-cél tutorial-banner). Az olyan szövegek, amelyek egyszerűen csak az
"almérce"/"mérce" szót használják anélkül, hogy hierarchiát sugallnának, változatlanok maradtak.

## Fontos: a legkritikusabb visszafelé-kompatibilitási garancia

Ha egy cél a mentésben még a régi (cél-szintű `cadence`/`startDate`) alakban van, a `normGoal` minden
betöltéskor automatikusan lemásolja azt minden olyan mércére, aminek még nincs sajátja. Egyetlen mércés
cél esetén ez pontosan ugyanazt az ütemezést/kezdő dátumot adja a mércének, mint amivel a cél korábban
rendelkezett — a Ma-fül kártya, a Haladás-fül statisztika és a cél-szerkesztő űrlap emiatt **pixel- és
viselkedés-azonos** marad egyetlen mércés célok esetén. A régi számláló-tárolás (`entries[gid].__tally`) is
automatikusan átkerül a mérce saját kulcsa alá az első betöltéskor.

## Tudatosan vállalt, kis eltérés (konzervatív döntés, nem hiba)

Több alcélos célnál a Haladás fülön a kártya fejléce most `"össz: N pont · <ütemezés vagy N alcél>"`
formátumú, a mércénkénti blokkok pedig saját maguk is kiírják a saját ütemezésüket a címkéjük mellett. Ez
egyetlen mércés célnál redundancia nélküli (ugyanaz, mint eddig), több mércénél viszont a fejléc és az
első alcél-blokk elvileg egyszer-egyszer megismételheti az "N alcél" / ütemezés szöveget — ez szándékos,
alacsony kockázatú egyszerűsítés a két renderelési út (1 vs. N mérce) minimális szétválasztásáért cserébe.

## Kézi tesztelési terv (a fejlesztőnek, telepítés után)

1. Töltsd be az appot, hozz létre egy célt **2+ alcéllal**, mindegyiknek eltérő ütemezéssel (pl. egyik napi
   igen/nem, másik heti 4× rugalmas mennyiség) — mentsd el, és nézd meg, hogy a Ma fülön egyetlen kártyán,
   egymás alatt, saját Lv/🔥 jelzéssel jelennek-e meg.
2. Naplózz be mindkét alcélhoz egy-egy értéket, ellenőrizd, hogy a pontok/szintek külön-külön frissülnek.
3. Nyisd meg a célt szerkesztésre, ellenőrizd, hogy mindkét alcél ütemezése/kezdő dátuma helyesen töltődött
   vissza.
4. Hozz létre egy **egyetlen alcélos** célt (vagy nézd meg egy már meglévő, régi mentésből származó célt),
   és győződj meg róla, hogy a Ma-fül kártya, a Haladás-fül és a cél-szerkesztő pontosan úgy néz ki és
   viselkedik, mint a frissítés előtt.
5. Próbálj ki egy eseményalapú (tally) alcélt egy másik alcél mellett ugyanabban a célban — a számláló
   +1/−1 gombja csak azt az alcélt módosítsa, a többit ne érintse.

## Utólagos kiegészítés (ugyanaznap): "is számítson" kapcsoló + egyszerű-cél UX javítás

Felhasználói visszajelzés alapján az eredeti verzió túl erősen "alcél"-ként kezelt egyetlen mércét is
(kötelező "Alcél 1 neve" mező, "Alcélok" accordion-cím), és nem volt mód arra, hogy több alcél esetén
bármelyiket (pl. az elsőt, ami korábban "a fő cél" volt) kikapcsolják, hogy a cél tisztán "tároló" szerepet
töltsön be.

- Új `metric.active` mező (alapértelmezett `true`, `normMetric`-ben normalizálva). Kikapcsolt (`active:false`)
  alcél nem jelenik meg a Ma-fülön, nem kap kártyát a Haladás-fülön, és a pontozó motor (`goalDayPoints`,
  `dailyGoalPointsOn`, `hetiPointsFor`) kihagyja — de az adatai megmaradnak, bármikor visszakapcsolható.
- A cél-szerkesztő űrlapon **csak akkor** jelenik meg alcélonként egy "Ez az alcél is számítson…" jelölőnégyzet,
  ha a célnak **2 vagy több** alcélja van; 1 mércés célnál nincs jelölő (nem is kell, mindig aktív).
- Validáció (`bindGoalForm`, `data-mactive` kezelő + `saveGoal` tartalék-ág): nem lehet minden alcélt
  kikapcsolni — az utolsó aktív jelölőjének kikapcsolását toast-tal blokkoljuk.
- Egyetlen mércés célnál a 2. accordion címe és súgószövege visszaváltozott klasszikus "Mérés és ütemezés"
  keretezésre (nem "Alcélok"), az alcél-név mező pedig opcionális, placeholder "(a cél nevét használjuk, ha
  üresen hagyod)" — így egyszerű, egy-mérésű cél létrehozásakor nem kell semmilyen "alcél"-fogalommal
  találkozni, pontosan úgy működik, mint a funkció előtt.
- Böngészős smoke teszt (helyi `python -m http.server` + service worker cache törlése után): egyszerű
  1-mércés cél létrehozása ✓, 2. alcél hozzáadása ✓, első alcél kikapcsolása ✓ (Ma/Haladás fülön csak a
  másik jelenik meg, pontszámítás csak az aktívra megy) ✓, mindkettő kikapcsolásának blokkolása ✓, meglévő
  (korábbi mentésből származó) célok továbbra is hibátlanul működnek ✓, 0 konzolhiba.
- **Figyelem service worker gyorsítótárra teszteléskor**: a helyi teszt során kiderült, hogy a böngésző a
  navigációt is a service worker "network-first" ága elé sorolt HTTP-cache-ből szolgálhatja ki, ha a
  fejlesztő ugyanazt a portot/URL-t használja több egymást követő munkamenetben — érdemes cache-busting
  query paramétert használni (`?nocache=...`) vagy explicit `caches.keys()`/`unregister()` törlést futtatni
  a böngészőben, mielőtt a friss kódot ellenőriznénk.

## Harmadik kör (ugyanaznap): a kapcsoló helye megfordítva — a főcélra, nem az alcélra

Felhasználói visszajelzés: az előző kör tévesen **minden** alcélra rátette az "is számítson" kapcsolót, és
lehetővé tette bármelyik (akár egy valódi alcél) kikapcsolását. A helyes elvárás: **az alcélok mindig
számítanak** (nincs rajtuk kapcsoló), és a ki/bekapcsolható elem kizárólag **a fő cél saját mérése**
(a `metrics[0]` szlot) — pontosan úgy, ahogy eredetileg kérve volt.

- `metricEditor(m,i)`: a törlés-gomb (`×`) mostantól csak `i>0` (valódi alcélok) esetén jelenik meg — a fő
  cél szlotja nem törölhető, csak ki/bekapcsolható. A `data-mactive` jelölőnégyzet mostantól **kizárólag
  `i===0`**-nál (és csak ha van legalább 1 alcél) jelenik meg, szövege "A fő cél saját mérése is
  számítson…". Az alcélokon (`i>0`) nincs többé jelölőnégyzet — mindig aktívak.
- `i===0` esetén, ha van legalább 1 alcél, egy "Fő cél" jelvény (`mb-badge`) jelöli meg vizuálisan a szlotot
  (a régi, funkció-előtti stílus visszahozva); 1 mércés célnál nincs jelvény (nincs rá szükség).
- Alcélok számozása mostantól `i` (nem `i+1`), mert a 0. index a főcél, az 1. index az első valódi alcél.
- `data-mdel` kezelő: ha egy alcél törlése után csak a főcél-szlot marad (`metrics.length===1`), a főcél
  mérése automatikusan újra aktívvá válik (nincs értelme kikapcsolva hagyni, ha nincs alcél, ami helyette
  számítana).
- A pontozó motor és a Ma/Haladás renderelés (`m.active!==false` szűrés mindenhol) **nem változott** — ez
  már eleve index-független volt, csak azt kellett megváltoztatni, hogy a szerkesztő űrlap *melyik* mércéhez
  rendeli hozzá a kapcsolót.
- Böngészős smoke teszt (JS-vezérelt, mivel a helyi teszt-munkamenetben a valós kattintások nem mindig
  találták el a fület 1280×720 desktop nézetben — ez böngésző-automatizálási észlelési probléma volt, nem
  alkalmazáshiba): 1 mércés cél → nincs jelvény/kapcsoló ✓; alcél hozzáadása → jelvény megjelenik, 1 db
  kapcsoló (csak a főcélnál), 1 db törlés-gomb (csak az alcélnál), helyes "Alcél 1" címke ✓; főcél
  kikapcsolása → csak az alcél számít/látszik a Ma és Haladás fülön, a Célok listában "1 kikapcsolva" ✓;
  szerkesztésre visszanyitva a kikapcsolt állapot helyesen töltődik vissza, majd visszakapcsolható ✓; régi
  (migrálandó) adatformátumú cél is hibátlanul betöltődik ✓; 0 konzolhiba.

## Telepítés után

A `sw.js` cache-verziója `v24` → `v26` — az app-shell frissüléséhez **frissítsd az oldalt (esetleg
kétszer)** telepítés után, hogy a service worker lecserélje a régi cache-t.

Ez a javítás **csak az `index.html`-t és a `sw.js`-t** módosítja; a `firebase-config.js` és a
`firestore.rules` érintetlen.
