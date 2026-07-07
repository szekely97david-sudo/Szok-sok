# Szintlépő — 1. RÉTEG (v4)

Egyfájlos PWA, egységes cél-modell. A `szintlepo3` localStorage-kulcs és a domain változatlan — nincs adatvesztés. sw cache: **v7**.

## Egységes cél-modell (v3 → v4 migrációval)
- **Mérési mód:** igen/nem · skála (1–3 / 1–5 / 1–10) · mennyiség (érték + egység + reláció: legalább/pontosan/legfeljebb) · idő.
- **Ütemezés:** napi · hét kijelölt napjai · rugalmas (hetente/havonta N×, opc. gördülő 7 napos ablak) · streak.
- **Irány:** építeni / elhagyni. Bármelyik mérési mód bármelyik ütemezéssel párosítható.
- **Metrikák:** a cél maga + tetszőleges almércék; mércénként pontozott/csak-követett szerep, legalább egy pontozott.
- Rugalmas kiértékelés részleges kredittel; jövőbeli dátumok; kézi és AI-s cél-megadás; Gemini queue+backoff barátságos üzenettel.

## 1.1 finomítások
- **Almércénkénti irány** (építeni/elhagyni) — egy célon belül vegyesen is; az „Alap irány" a cél magáé.
- **Almércénkénti szerep** (pontozott / csak-követett).
- **Csak a célt is lehet követni** — az első blokk maga a cél, üresen hagyható; „+ Mérce" → „+ Almérce".
- **Idő-cél kezdő/vég időponttal:** perc VAGY óra; kezdés+vég → automatikus időtartam, vagy közvetlen érték; mindhárom megadva ellenőrzi az egyezést.
- **Streak minden célhoz ÉS almércéhez külön** (🔥, Ma + Haladás); a fejléc láng- és „ma pont"-chipjei eltűntek.
- **Per-cél szünet/vakáció** a napszintű mellett — nem töri a streaket.
- **Robusztus „Összes adat törlése"** — a napok, lezárások, streak és (belépve) a felhő-másolat is nullázódik.
- **Haladás:** a félreérthető globális „széria" helyett „aktív cél".

*(A 10-es skálán a „mi bukás / mi győzelem" küszöb a 2. körbe kerül, megbeszélés szerint.)*

## Cserélhető fájlok
`index.html`, `sw.js` (teljes). A `firebase-config.js`, `firestore.rules`, `manifest.webmanifest`, ikonok változatlanok.

## Feltöltés után
Frissíts az appban **kétszer** (vagy indítsd újra), hogy a service worker a v7 shellt töltse be.

## Teszt
`node --check` + három headless (jsdom) füstteszt: migráció, pontozó motor (minden mérési mód), cadence (streak, rugalmas), teljes DOM-folyamat, valamint az 1.1 funkciók (almércénkénti polaritás/szerep, timer perc/óra + kezdő/vég számítás, streak+vakáció, robusztus reset). **70/70 assertion zöld.**

## Következik — 2. RÉTEG
Design-témák, in-app info-buborékok, Gemini-kulcs útmutató, barátságos szövegezés + ünneplő visszajelzés, „miért sikerült/bukott" indok-gyűjtés (skálás bukás/győzelem-küszöbökkel), narratív haladás, fejlesztői visszajelzés-űrlap (Firestore + ingyenes email-továbbítás).
