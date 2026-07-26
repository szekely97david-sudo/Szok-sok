# Edzésnapló 4. kör — 2026-07-26

`sw.js v59 → v60` · `APP_VERSION v21 → v22` · `CHANGELOG v10`

A te listád mind a hét pontja elkészült, plusz négy tétel a „kimaradt" listáról.

---

## 1. Kép: három forrás (fotó · galéria · net)

A 2. körben a `capture` attribútum kivétele mellékhatásaként **eltűnt a
„fénykép készítése"** külön útja. Most mindkettő megvan, és jött egy harmadik:

| Forrás | Mit csinál |
|---|---|
| 📷 **Fénykép készítése** | `capture="environment"` → a telefon rögtön a kamerát nyitja |
| 🖼 **Kép a galériából** | a rendszer választója (galéria, Drive, bármi) |
| 🔍 **Keresés a neten…** | appon belüli képkereső — ez az új |

A keresőnek **nincs saját szerverünk és nincs API-kulcs**: a böngésző közvetlenül
hív két nyílt, CORS-barát gyűjteményt — **Openverse** (Flickr + Wikimedia,
szabad licencű képek), és ha az nem válaszol, **Wikimedia Commons**. A
kiválasztott kép **letöltődik** (fetch → blob → data URL), lekicsinyítjük 560 px-re,
és ugyanoda kerül, ahova a fénykép: `sl_woPhotos`, **eszközön**, offline is
megvan, idegen szerverre nem hivatkozunk.

Amit tudni érdemes:
- A gyűjtemények **angolul indexelnek** — „bulgarian split squat" sokkal
  jobb találatokat ad, mint magyarul. A hibaüzenet ezt meg is mondja.
- Ha egy kép forrása nem enged letöltést (nincs CORS-fejléce), szólunk, hogy
  válassz másikat. Végső mentsvár: **kép-URL beillesztése** kézzel (lenyíló
  „Kép beillesztése URL-ből").
- A saját gyakorlat felvételénél is működik: a félkész űrlapot elmentjük, a
  keresés után ugyanoda térsz vissza a képpel.

**Böngészős teszt:** „bulgarian split squat" → 24 találat, az első kép letöltve
és lekicsinyítve (68 KB-os data URL). ✔

---

## 2. Egyoldalas gyakorlat (bal / jobb külön)

A kérés: a bolgár kitörésnél a 4 sorozat kétértelmű — négyszer mindkét láb, vagy
kétszer? Megoldás: a gyakorlathoz tartozó kapcsoló, ami **a hozzáadás ELŐTT**
állítható, ott, ahol kérted — a **gyakorlat részletnézetében**, a
„➕ Hozzáadás" gomb fölött, magyarázó szöveggel. (Ugyanez elérhető a
gyakorlat ⋮ menüjéből és a Napló → Gyakorlatok részleteinél is.)

Amit bekapcsolva megváltozik:

- **Minden szettsor = egy oldal.** A számozás `1 B · 1 J · 2 B · 2 J` — a
  fejlécben pedig ott a `⇋ B/J` jelzés, hogy összecsukva is látszódjon.
- **A terv sorozatszáma oldalanként értendő.** 3 tervezett sorozat → 6 sor.
  (Bekapcsoláskor ki is írja: „a terv sorozatszáma mostantól OLDALANKÉNT
  értendő" — a Terv résznél át tudod írni, ha eddig a duplát írtad be.)
- **A pihenő kettéválik**, pont ahogy kérted: a ⏱ gomb ilyenkor egy kis menüt
  nyit — **„A körök közt"** és **„A két oldal közt"** (utóbbi alapból *nincs*,
  0:00, mert általában csak átállsz). Az app tudja, melyik oldal jön: az első
  oldal pipája után az oldal-pihenő indul, a második után a rendes.
- A menük is beszédesek: „2 B oldal — Bulgarian Split Squat".

Ha a gyakorlat neve alapján valószínűleg egyoldalas (`single`, `one-arm`,
`bulgarian`, `lunge`, `pistol`, `step-up`…), a részletnézet **javasolja** a
bekapcsolást — de magától semmit nem kapcsol be.

---

## 3. A kétszer bekerülő gyakorlat

**A hiba:** ha volt kijelölés, a részletnézet „➕ Hozzáadás az edzéshez" gombja
azonnal betette a gyakorlatot — és mivel a listára visszalépve a csempéje is
kijelölt maradt, a lenti **Hozzáadás** másodszor is betette.

**A javítás pontosan az, amit kértél:** ha már van legalább egy kijelölt
gyakorlat, a részletnézet gombja átvált **„＋ Hozzáadás a kijelöléshez"**-re
(illetve „✓ Kijelölve — vissza a listához"), és **csak kijelöl + visszavisz** a
listához. Alá kiírja, miért: „Most 3 gyakorlat van kijelölve, ezért ez a gomb
csak a kijelöléshez ad hozzá." Az edzésbe továbbra is a lenti **Hozzáadás**
teszi be mindet, a kijelölés sorrendjében.

Ha nincs kijelölés, minden a régi: koppintás → részlet → Hozzáadás az edzéshez.

Ráadásként a lenti Hozzáadás **szűri a duplikátumokat** és **üríti a
kijelölést**, hogy egy második koppintás se tegye be újra ugyanazt.

---

## 4. Az edzés törlése nehezebb lett — és visszavonható

Két réteg került rá:

**a) Nyomva kell tartani.** Az „Edzés eldobása" (most: *Az egész edzés
eldobása*) és a naplóbeli „🗑 Törlés" nem egy koppintás többé, hanem egy
**1,5 másodperces nyomvatartás** (a gomb közben feltöltődik, a végén rezeg).
A szöveg is egyértelműbb:

> Nem egy gyakorlatot, hanem az **egész mai edzést** dobod el — **7 kipipált
> sorozattal** együtt. […] Ha csak egy gyakorlatot akarsz kivenni: a gyakorlat
> **⋮** menüjében az **„Eltávolítás"**.

**b) Visszavonás.** Minden törlés után **40 másodpercig** ott egy alsó sáv:
`Edzés eldobva — júl. 26. · Láb/Mell   ↩ Visszavonás   ✕`. Ez vonatkozik
az eldobott élő edzésre, a naplóból törölt edzésre **és** az edzésből kivett
gyakorlatra is (az utóbbi ezért nem is kér külön megerősítést — visszahozható).

---

## 5. „Miért a mellre kérdez, amikor lábaztam?"

Az edzés végi visszajelzés eddig **kérdés nélkül a négy legterheltebb izmot**
kérdezte — küszöb nélkül. Ha a nap 3-4 izomból állt, egy elszórt sorozat is
felfért a listára.

Mostantól egy izom akkor kerül fel, ha **legalább 3 sorozatot** kapott, vagy
legalább 2-t **és** eléri a legterheltebb izom harmadát. Mellé odaírjuk, **miből
jött**, hogy soha ne legyen rejtélyes:

> **Combhajlító** · 3 sorozat · Lever Seated Leg Curl

Ellenőrizve: láb-nap 4+4 sorozat comb, 3 sorozat combhajlító, 1 sorozat fekvő-
támasz → a **Mell kimarad**, a Combhajlító bekerül. ✔

*Megjegyzés:* a katalógusban egyetlen lábgyakorlatnak sincs `chest` elsődleges
izma, úgyhogy a mell nálad szinte biztos egy elszórt felsőtest-sorozatból jött be
— pont ezt szűri ki a küszöb.

---

## 6. „Chatfej" — lebegő ablak (kép a képben)

Widgetet egy weben futó PWA nem tud csinálni, és Messenger-féle rendszer-buborékot
sem — de van valami, ami **pontosan azt tudja, amit kértél**: a rendszer saját
**kép a képben** ablaka. Az edzés fejlécében megjelent a **⧉ Lebegő** gomb.

Hogyan működik: egy rajzolt vászonból (canvas) élő videó-folyamot csinálunk, és
azt tesszük PiP-módba. A kis ablak **a többi app fölött lebeg** — mehet a
YouTube, és közben látod:

- **pihenő közben**: nagy visszaszámláló (`1:23`), alatta a gyakorlat neve és
  egy fogyó csík;
- **pihenő után**: tömör állapot — melyik gyakorlatnál tartasz, hány sorozat van
  meg, mióta tart az edzés.

Rákoppintva **visszaugrasz az appba teljes képernyőn**, a YouTube nem áll le.
Beállítható (⚙️ Edzés-beállítások → Ahogy dolgozol), hogy a **pihenő indulásakor
magától** nyíljon.

**Amit a rendszer nem enged, és ezért nem ígérem:** az ablak **méretét** nem mi
állítjuk, hanem te húzod — ezért a pihenő végén nem „zsugorodik", hanem a
**tartalom vált** tömör nézetre. Ha a böngésző nem tudja a PiP-et (pl. iOS
Safari), a gomb **meg sem jelenik**.

**Amit tesztelni tudtam:** a képességvizsgálat, a vászon-rajzolás és a
folyam-létrehozás hibátlanul lefut, és ha a rendszer megtagadja a megnyitást,
az app nem hasal el, csak szól. Magát a lebegő ablak megnyílását **nem tudtam
automatán kipróbálni**, mert valódi ujj-koppintás kell hozzá — ezt a telefonon
te tudod visszaigazolni.

---

## 7. Cél és tény külön (haladó mód)

⚙️ **Edzés-beállítások → Ahogy dolgozol → „Cél és tény külön"**.

Bekapcsolva a mezőkbe továbbra is a **célt** írod (pl. 20 kg × 15) — ez az, amit
kitűztél, és amit akkor is beírsz, ha a gyakorlat az edzés végére csúszott.
Pipáláskor felugrik egy rövid kérdés: **„Mi ment ténylegesen?"**, a cél
értékeivel előre kitöltve, két gombbal:

- **✓ Pont a célt hoztam** — egy koppintás, kész;
- **Ennyi ment** — átírod (pl. 12 ismétlés).

Utána a sorban ott a két szám egymás mellett: `cél 20×15 · **tény 20×12**`.
A naplóban is így látszik (`65×12 (cél 65×15)`).

Fontos, hogy mi mihez számít:
- a **csúcsaid, a volumen, az 1RM-becslés és a regeneráció** végig a
  **TÉNYLEGES** teljesítményből számol — a cél soha nem hazudik felfelé;
- a **terved nem változik** attól, hogy egy nap kevesebb ment. Ez a modul
  alapelve, és most is így van.

Az adatszerkezet bővült: `szett = [súly, ism, jelzők, RIR, lépcsők, cél]`, ahol a
cél **csak akkor** kerül el, ha eltér a ténytől — így a napló mérete alig nő.
A `[0]` és `[1]` **mindig a tényleges** érték, tehát a régi adataid és minden
eddigi számítás változatlanul jó.

---

## Amit a „kimaradt" listáról behúztunk

**9. Jegyzet az egész edzéshez** — az adatmodellben megvolt (`note`), most van
hozzá felület: edzés közben a „📝 Jegyzet az egész edzéshez" gomb (alvás,
étkezés, sérülés, hangulat), és utólag a naplóban is szerkeszthető.

**11. 1RM-trend grafikon** — a gyakorlat részleteinél új diagram: **a becsült
1RM alakulása** az utolsó 14 alkalmon, Epley-becslés a legjobb sorozatból.

**5. Gép-foglalt csere** — új pont a gyakorlat ⋮ menüjében:
**„Gép foglalt — alternatíva ugyanerre az izomra…"**. Ugyanazt az elsődleges
izmot dolgoztató gyakorlatokat kínál, **csak amit a mai helyszínen meg tudsz
csinálni**, elöl azzal, amit a legtöbbször csináltál.
Egy nem triviális döntés: ha ebből a gyakorlatból **már van kipipált sorozatod**,
azt nem nevezzük át egy másik gyakorlat nevére (az meghamisítaná a naplót) — a
meglévő munka marad a helyén, az alternatíva **új blokként** indul alatta.

**15. `closeModal()` szivárgás** — a maradék három helyen is javítva (napi kapu
ugrása, „részletes súgó megnyitása", bemutató). Ezek eddig elnyeltek egy
vissza-gesztust.

---

## Ami továbbra is hátravan

1. **RP auto-reguláció** — MEV→MRV volumen-rámpa, mezociklus RIR-lépcsővel,
   kötelező deload, SFR-alapú gyakorlatcsere.
2. **Progresszió-motor** — dupla progresszió / lineáris / RPE, „Cél: 102,5 × 8"
   javaslat a mezőben. *(A cél/tény mód most megadta hozzá az adatot: külön
   látszik, mit tűztél ki és mi ment — ebből már lehet javaslatot építeni.)*
3. **Plateau- és deload-figyelő.**
4. **„Csak 40 percem van" mód.**
6. **Mérések (kar, comb, derék) + haladás-fotók.**
7. **Edzés-timeline.**
8. **Fájdalom-flag szettenként.**
10. **Rest-pause és cluster szett-típusok.**
12. **Proaktív heti volumen-figyelmeztetés.**
13. **Gyakorlat-képek Geminivel + tömeges kép-import.** *(A netes képkereső ezt
    részben kiváltja: gyakorlatonként egy koppintás. Tömeges importnál marad a
    döntés, hogy a képek eszköz-lokálisak maradjanak-e, vagy külön tárolóba —
    pl. Firebase Storage — kerüljenek.)*
14. **Izombesorolás ellenőrzése** — ha edzés közben rosszat látsz, szólj.
16. **App-szintű PIN/jelszó** (korábbi kör halasztott tétele).

---

## Ellenőrzés

Böngészős füstteszt (`python -m http.server` + preview, külön másolat üres
`firebase-config.js`-szel, hogy az éles adat ne kerülhessen veszélybe):

- **0 konzolhiba**;
- mind a 9 fül renderel (Ma · Célok · Haladás · Statisztika · Edzés · Kezdőlap ·
  Fiók · Biblia · Ciklus), és az Edzés mindhárom alnézete;
- minden edzés-ablak megnyílik (beállítások, helyszínek, saját gyakorlat, rutin,
  gyakorlat-választó, import);
- **egyoldalas**: 3 tervsor → 6 szettsor, `1 B / 1 J / 2 B / 2 J / 3 B / 3 J`,
  ki-be kapcsolva helyesen váltanak a címkék, a pihenő-menü kettéválik;
- **cél/tény**: cél 20×15 → tény 20×12 → tárolt szett `[20,12,2,null,null,[20,15]]`,
  a `normSet` a mentés–betöltés körben megőrzi;
- **nyomvatartás**: 0,9 mp-nél még él az edzés, 2,4 mp-nél már törölve, és a
  visszavonás hiánytalanul visszahozza (2 blokk, azonos név);
- **kijelölés**: 2 kijelölt mellett egy harmadik részletnézetéből a gomb csak
  kijelöl (`sel` = 3), az edzésbe **semmi** nem került be;
- **netes kép**: valódi keresés → 24 találat → letöltés → 68 KB-os data URL;
- **alternatíva**: kipipált sorozattal a régi gyakorlat 1 kész sorral megmarad,
  az alternatíva külön blokkban indul;
- **változásnapló**: a v10-es bejegyzés 11 ponttal megjelenik.

Nem tesztelhető automatán: a **lebegő ablak tényleges megnyílása** (valódi
koppintás kell hozzá) — lásd a 6. pontot.
