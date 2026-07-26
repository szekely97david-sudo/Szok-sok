# Kalóriaszámláló modul — 1. kör (2026-07-26)

`APP_VERSION v23` · `sw.js v61` · `CHANGELOG v11` · új fájl: **`food-db.json`**

A `🍎 Kalóriaszámláló` a „fejlesztés alatt" jelölésből **valódi modul** lett
(`MODULES` → `flag:"food"`, fülek: **Ma / Ételek / Statisztika**).
Bekapcsolás: ☰ → Fiók → 🧩 Aktiválható modulok.

---

## Miért így — a három sarokpont

**1) Méret.** A teljes állapot EGY Firestore-doc, kemény 1 MB-os limittel, és az
edzés-adat már ~144 KB. Ezért:

- egy naplósor a lehető legrövidebb: `{i,q,u,m,hm}` ≈ **49 bájt**
  (a makrókat nem tároljuk, az ételből számoljuk),
- az időpont **perc éjféltől** (`hm`, 0–1439), nem epoch-ms — soronként 20 bájt,
- minden napról készül **napi összeg-gyorsítótár** (`tot`, 5 szám),
- a **180 napnál régebbi** napok tételei kiürülnek (`kcCollapse`), az összeg marad.

Mért érték: napi 10 tétellel egy év részletes napló ~175 KB, a zsugorítás utáni
**állandósult méret ~95 KB**. `kcSizeCheck()` 780 KB fölött szól.

**2) Védőkorlátok a kalkulátorban.** Nem kényelmi funkciók:

- a javasolt keret **sose megy a BMR alá** (ha az ütem odavinné, ott megáll + indoklás),
- a zsír **sose megy a napi energia 20%-a alá** (hormonális padló),
- 1500 kcal (nőknél 1200) alatt külön figyelmeztetés,
- ha a fehérje+zsír megeszi a keretet, a fehérje enged 1,6 g/kg-ig, hogy maradjon szénhidrát.

**3) Független a pontrendszertől** — mint a Biblia és az Edzésnapló. A diéta rossz
napja nem rombolja a szokás-statisztikát.

---

## Ami elkészült

### Ma fül
- Gyűrű + **a legnagyobb szám a hátralévő kalória**, mellette a **hátralévő fehérje**.
  Túllépésnél külső piros ív.
- Makró-sávok: fehérje (kiemelt), szénhidrát, zsír, **rost** — mindegyiknél „hátra" érték.
- **Szabadon szerkeszthető étkezések** (átnevezés emojival, sorrend, törlés, új).
  Törléskor a sorok az első étkezéshez kerülnek, adat nem vész el.
- Naplósor-menü: mennyiség/érték módosítása, áthelyezés, kedvenc, mentés saját ételként, törlés.
- **40 mp-es visszavonás-sáv** minden törlésnél.
- Gyors műveletek: ⚡ gyors bevitel · 📋 másolás tegnapról · 🍽 sablon · 🎯 mi fér még bele
  · 🔎 vonalkód · 🏷 címke · 🍛 tányér.
- Testsúly rögzítése a naphoz.
- Dátum-léptetés + dátumválasztó.

### Célok
- Kalkulátor: Mifflin-St Jeor, **testzsír% esetén Katch-McArdle**; aktivitás-szorzó;
  fogyás/tartás/tömegelés + ütem (kg/hét, 7700 kcal/kg).
- Fehérje g/kg a **referencia-súlyra**: célsúly, ha megadtad; magas testzsírnál
  a zsírmentes massza ×1,2 (különben túlbecsülne).
- Zsír g/kg, maradék = szénhidrát, rost = 14 g / 1000 kcal.
- **Kézi mód**: minden érték felülírható; a makrók kcal-összegét kiírja.
- **Heti kalória-bank** (±500 kcal, hétfőtől) és **edzésnapi plusz** — utóbbihoz nem kell
  jelölni semmit: `kcTrainDay()` az Edzésnapló `sessions[].d` mezőjéből tudja.

### Ételek fül
- Keresés (ékezet-független) az alapbázisban + saját ételek + receptek.
- **Saját étel szerkesztő**: 100 g-ra VAGY 1 adagra megadott értékek (átszámol),
  folyadék (ml) kapcsoló, saját mértékegységek (db/szelet/adag/ek…), vonalkód,
  „kalória számítása a makrókból". Alapbázis-tétel szerkesztése saját másolatot készít.
- **Receptek**: hozzávalók + adagszám + opcionális lemért kész súly (párolgás!).
  A recept ugyanúgy viselkedik, mint egy étel (`kcRecipeFood`), egysége az „adag".
- **Étkezés-sablonok** mentése/betöltése.
- **AI-várólista** kezelése.

### Szkennelés
- **Vonalkód**: natív `BarcodeDetector` + kamera, tartalék a kézi kódbeírás.
  Először a saját ételek közt keres (offline is), utána **OpenFoodFacts** v2 API
  (kulcs nélkül, CORS-barát). Találatnál előtöltött szerkesztő — át kell nézni, úgy mentődik.
- **Címke-fotó** → Gemini (a user saját kulcsával) → JSON → előtöltött szerkesztő.
  100 g-ra és adagra megadott címkét is kezel.
- **Tányér-fotó** → Gemini → összetevők + becsült gramm + alsó/felső határ →
  **csúszkás** áttekintő, kikapcsolható tételekkel, majd naplóba.
- **Nyaralás-mód**: ha nincs net vagy kulcs, a kép **eszköz-lokális várólistára** kerül
  (`sl_kcQueue`, max 12), és később egy koppintással sorban feldolgozható.
- A `geminiCall(system,user,gen,imgs)` mostantól **képet is** tud küldeni (`inline_data`).

### Statisztika
- 7/30/90 nap: átlagok a célhoz mérve, makró-arány, napi kalória-oszlopok kerettel,
  következetesség (rögzített napok, ±10%-on belüli napok, heti ütem — csak 4+ napnál).
- **Testsúly-trend** mozgóátlaggal (EMA-7) + heti változás.
- **Becsült valódi fenntartó** (`kcAdaptiveTDEE`): átlagos bevitel + a súlytrend
  energia-értéke. Csak 14+ nap és 10+ rögzített nap esetén jelenik meg.
- Legtöbb kalóriát adó ételek.

### Alap-ételbázis (`food-db.json`)
272 magyar tétel, 12 csoportban, nyers és főtt állapotban is (rizs, tészta, lencse…),
darabos egységekkel (tojás db, kenyér szelet, olaj ek). **EU-konvenció: a `c`
szénhidrát rost NÉLKÜL, a rost külön (`b`)** — ahogy a magyar címkék és az
OpenFoodFacts is számol. A service worker precache-eli, tehát offline is megvan.

---

## Amit ellenőriztem böngészőben (python http.server + preview)

0 konzolhiba. Ellenőrizve: modul be/ki, mindhárom fül renderelése, keresés,
mennyiség-lap egységváltással, gyors bevitel (kcal a makrókból: 8/12/5 → 125 ✓),
saját étel, recept (250 g rizs + 800 g csirke + 2 ek olaj → 495 kcal/adag, 268,5 g/adag ✓),
másolás tegnapról, sablon mentés, törlés + visszavonás, étkezés hozzáadás,
kalkulátor a BMR-padlóval (86 kg, 1,2 kg/hét → 1840 kcal + figyelmeztetés ✓),
heti bank, zsugorítás (200 napos nap tételei kiürültek, összeg megmaradt ✓),
**valódi OpenFoodFacts lekérés** (5449000000996 → Coca-Cola, 42 kcal/100 ml ✓),
offline AI-út (kulcs nélkül várólistára tesz ✓), Kezdőlap-kártya, alsó nav,
vissza-gesztus az al-fülekről.

A Gemini-hívás (címke/tányér) **valódi kulcsot igényel** — a kódút és a hibaág
tesztelt, a felismerés minőségét telefonon érdemes visszaigazolni.

---

## Amit szándékosan NEM tettünk bele

- **Tesseract.js / külön OCR**: 2–4 MB wasm a cache-be, rosszabb eredményért.
- **USDA-import**: 400 ezer angol tétel, rossz illeszkedés egyfájlos PWA-hoz.
- **Saját közösségi termékbank**: az OpenFoodFacts már az.
- **Pontrendszer-integráció**: külön döntés volt, hogy független marad.

## Hátralévő ötletek a következő körre

- MyNetDiary-történet import a `master_*.xlsx`-ből (a user most nem kérte).
- Adaptív TDEE **automatikus** keret-korrekció (most csak kijelzés).
- „Mi fér bele" AI-változat (vacsoraötlet a maradék makróhoz).
- Étkezési idő-eloszlás statisztika (a `hm` mező már gyűlik hozzá).
- Víz-követés, mikrotápanyagok, étterem-mód, ismétlődő étkezés ütemezve.
- App-szintű PIN (a ciklus-modulnál elhalasztva).
