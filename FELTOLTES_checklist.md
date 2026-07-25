# Trellis — mit kell feltölteni (2026-07-07)

## ⚠️ MINDEN KIADÁS KÖTELEZŐ 3 LÉPÉSE (2026-07-25 óta)
Ez a lista azért van itt legelöl, mert az Edzésnapló 1. és 2. köre **kimaradt a
változásnaplóból** — a felhasználó két frissítésen át nem látta, mi újult meg.

1. [ ] **`CHANGELOG` bejegyzés az `index.html`-ben** (a `CHANGELOG=[` tömb elejére,
       eggyel nagyobb `v:` számmal). Felhasználói nyelven, nem fejlesztőiül.
       Enélkül a frissítés NEM kész — a „✨ Mi újult meg?" ebből él.
2. [ ] **`sw.js` → `VERSION` léptetése** (különben a régi app-shell ragad be).
3. [ ] **`APP_VERSION` léptetése** az `index.html`-ben (a Fiók fülön látszik).

Plusz: a kör végén nézd át az előző `JAVITASOK_*.md` „hátralévő" pontjait, hogy
egy korábban megbeszélt, de el nem készült dolog se csússzon ki csendben.

## Miért látszott régi az ikon
Legutóbb **csak** az `index.html` és `sw.js` ment fel. Az **ikonok és faviconok soha
nem lettek feltöltve** — a szerveren a régi, kicsi ikonok voltak, a faviconok pedig
hiányoztak (404). Ezért maradt a régi logó. A kód végig helyesen hivatkozik a logóra.

## Új ebben a körben
- **Új „Üvegház" téma** (fehér + élénk erdőzöld `#2D6A4F`, a mockup alapján) →
  ez az **alapértelmezett**. A régi „Letisztult" (papír) téma **megmaradt**.
- `sw.js` cache-verzió **v12 → v13** (hogy a Frissítés gomb kiváltódjon).

## FEL KELL TÖLTENI a `main` ág gyökerébe (11 fájl)
Kódfájlok (módosultak):
- [ ] `index.html`
- [ ] `sw.js`

Képfájlok (ezek hiányoztak / régiek voltak a szerveren — EZ a lényeg az ikonhoz):
- [ ] `icon-192.png`
- [ ] `icon-512.png`
- [ ] `icon-maskable-512.png`
- [ ] `icon-180.png`
- [ ] `favicon.ico`
- [ ] `favicon-16.png`
- [ ] `favicon-32.png`
- [ ] `favicon-48.png`
- [ ] `favicon-64.png`

## Feltöltés után a telefonon
1. Koppints a **Frissítés** gombra (vagy nyisd meg `?v=4`-gyel, vagy zárd be és nyisd
   meg kétszer) → betölt az új verzió az Üvegház témával és a friss logóval.
2. Ha az app a **kezdőképernyőn** van, a launcher-ikon csak akkor frissül, ha
   **leveszed és újra kiteszed** (az OS külön cache-eli).

## Következő kiadásnál
Léptesd a `sw.js`-ben: `VERSION = "v13"` → `"v14"`.
