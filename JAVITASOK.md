# Szintlépő — 1. RÉTEG (v4) javítások

Egyfájlos PWA, egységes cél-modell. A `szintlepo3` localStorage-kulcs és a domain változatlan — nincs adatvesztés.

## Mi változott

**Egységes cél-entitás, három független tengellyel** (a régi napi/heti/tartós típusok helyett):
- **Mérési mód:** igen/nem · skála (1–3 / 1–5 / 1–10) · mennyiség (érték + egység + reláció: legalább/pontosan/legfeljebb) · idő (perc).
- **Ütemezés:** napi · hét kijelölt napjai · rugalmas (hetente/havonta N alkalom, opcionális gördülő 7 napos ablak) · streak (napok az utolsó megcsúszás óta).
- **Irány (polaritás):** építeni / elhagyni.
- Bármelyik mérési mód bármelyik ütemezéssel párosítható.

**Metrikák:** egy fő, pontozott mérce + tetszőleges számú csak-követett (nem pontozott) almérce — a kiértékelés így egyértelmű marad.

**Rugalmas kiértékelés:** részleges kredit (teljesített/N, 100%-on maxolva) — pl. heti 4-ből 3 = 75%, nem bukás. Gördülő 7 napos ablak opció. Szünet/vakáció nap, ami nem töri meg a szériát.

**Jövőbeli dátumok:** a Ma-nézet dátumválasztója előre is enged; cél megadható jövőbeli kezdéssel. A napi célok a saját ütemezésük szerint értékelődnek, nincs globális napi nullázás.

**Ma fül:** Napi / Heti szegmens (külön pontszámítással), balra-jobbra húzás (swipe) a napváltáshoz, ‹ › gombok, „Ma" gomb. A gyors 1-tap napi/heti listák megmaradtak.

**Kézi cél-megadás:** teljesen AI nélkül (cím, mérési mód, ütemezés, almércék). Az AI-generálás opcionális.

**Gemini stabilitás:** soros queue (kérésenként ~4,5 mp szünet), 429-nél exponenciális backoff (1→2→4 mp), majd barátságos üzenet („Amit beírtál, elmentve marad — próbáld újra kb. X perc múlva."). Automatikus tartalék: választott modell → flash → flash-lite. Az AI-rubrika (✨ Segédlet) most napi ÉS heti gyors célokra is megy, a már kitöltött fokozatokat nem írja felül.

**Migráció:** `version 3 → 4`, `normalize()`-ban. A régi tartós célok → napi ütemezésű, skálás mércéjű egységes célok; a napi/heti gyors elemek megmaradnak; a `days.tartos` → `days.entries`. Minden addigi pont/szint/előzmény megőrizve.

**sw.js:** cache `v5 → v6`.

## Cserélhető fájlok
- `index.html` (teljes)
- `sw.js` (teljes)
- `firebase-config.js`, `firestore.rules`, `manifest.webmanifest`, ikonok: változatlanok.

## Feltöltés után
Frissíts az appban **kétszer** (vagy indítsd újra), hogy a service worker a v6 shellt töltse be. iPhone-on a kezdőképernyős ikonból is zárd be/nyisd újra.

## Teszt
`node --check` + két headless (jsdom) füstteszt: migráció, pontozó motor (minden mérési mód), cadence (streak, rugalmas részleges kredit), teljes DOM-folyamat (onboarding → cél létrehozás az űrlapon → pontozás → nap zárása → szegmensváltás → AI-rubrika queue). **50/50 assertion zöld.**

## Következik — 2. RÉTEG (külön kiadás)
Design-témák, in-app info-buborékok, Gemini-kulcs útmutató, barátságos szövegezés + ünneplő visszajelzés, „miért sikerült/bukott" indok-gyűjtés (skálás küszöbökkel), narratív haladás, fejlesztői visszajelzés-űrlap (Firestore `feedback` + ingyenes email-továbbítás), swipe-os áttekintő finomítás.
