# Trellis — Biblia modul: napi ige + átlátható terv (2026-07-23)

**Verziók:** `sw.js` v49 → **v50**, `APP_VERSION` v11 → **v12**, CHANGELOG **v3**.
Adatszerkezet **nem** változott (nincs migráció, `S.bible` érintetlen).

Feltöltendő fájlok: **`index.html`**, **`sw.js`**.

---

## 1. Napi ige a Biblia fül tetején

- A **Ma / Olvasó / Statisztika** fülsor **fölött** jelenik meg egy díszes kártya:
  csak az **ige szövege** + az **igehely**, semmi más.
- **51 igevers** váltakozik, mind arról szól, hogy **nem mindegy, hogyan** olvassuk /
  hallgatjuk / fogadjuk be az Igét (Luk 8:18, Jak 1:22, ApCsel 17:11, Zsid 4:2,
  2Tim 2:15, Zsolt 119:18, Józs 1:8, Péld 4:20–22, Mrk 4:24, Mt 7:24, Ezsd 7:10,
  1Thessz 2:13, Ézs 66:2, 1Pt 2:2, Kol 3:16, Zsolt 1:2, Zsolt 119:11/103/105/130/
  133/162/97/15–16, Jn 8:31–32, Jn 5:39, Jn 6:63, Jn 15:7, Mt 4:4, Mt 13:9/16/23,
  5Móz 6:6–7, 5Móz 32:47, Zsid 4:12, Jak 1:21/23–24/25, Luk 11:28, Luk 24:32,
  Jer 15:16, Neh 8:8, 2Tim 3:16–17, 1Tim 4:13, Zsolt 19:8, Ézs 55:11, Ezék 3:10,
  Péld 2:4–5, Péld 3:1–2, ApCsel 8:30, Jel 1:3 …).
- **Károli** szöveg — a saját `text/*.json`-odból kimásolva, **beépítve az
  index.html-be**: nincs hálózati kérés, offline is működik, közkincs (nincs
  szerzői jogi kérdés, mint a modern fordításoknál).
- A rotáció **dátumból derivált**, nincs véletlen: **2026. 07. 23. = Luk 8:18**
  (a te választásod), utána sorban; 51 nap alatt mind pontosan egyszer jön elő.
- Betűtípus: **EB Garamond** (Google Fonts, dőlt) — offline tartalék: rendszer-antikva
  (Iowan Old Style / Georgia / Palatino / Times). Hosszú igénél automatikusan kisebb
  fokozat, hogy ne nyúljon el a kártya.

## 2. „Mai olvasmány" — az ÖSSZES mai igehely

Eddig is az összes fejezet ott volt a listában, de nem volt látszik egy pillantásra.
Mostantól a kártya tetején:

- **összefoglaló fejléc**: `1Mózes 1–7` (könyvenként összevont tartomány),
- alatta: `7 fejezet · 3 401 szó · ≈ 21,3 perc`,
- alatta a **tételes, pipálható lista**, mindegyiknél a becsült perc (`1Mózes 1 · 4p`),
- ha a következő fejezet holnapra csúszott: *„A következő fejezet (1Mózes 4) már a
  **holnapi** adag: mára csak a 27%-a férne bele, a felénél kevesebb."*

## 3. Fél-fejezet szabály + önkorrekció (a lényeg)

Eddig: a napi adag addig nőtt, amíg **el nem érte** a keretet — vagyis **mindig
átlépte**, és a különbség sosem került vissza sehova.

Mostantól két szabály:

1. **Fél-egység szabály** — ha egy fejezet **átlógna** a napi kereten, akkor kerül
   **mára**, ha még legalább a **fele** belefér; ha kevesebb, **holnapra** csúszik.
2. **Korrekció** — a mai keret = *napi adag ± a tegnapig felgyűlt különbség*
   (legfeljebb egynapi adaggal). Ha tegnap átlógott 200 szó, ma 200-zal kevesebb a
   keret; ha lemaradtál, ma legfeljebb egy nappal többet kapsz (nem zúdul rád az
   egész hátralék). Ha sokat olvastál előre, kaphatsz **pihenőnapot** is — a Ma-lap
   ezt külön ki is írja.

**Ellenőrizve (böngészőben, szimulációval):** 1 hónapos ÚSZ-terv (napi 4 680 szó) —
tervezett 31 nap, **ténylegesen 31 nap alatt** olvasható végig, mind a 142 448 szó.
14 napos teljes-bibliás futásnál a halmozott eltérés 44 864 vs. 44 800 szó = **0,14%**.

## 4. Terv + Haladás — lenyitható részletek

A **Terv** kártyán:

- **🧮 Hogyan jön ki a napi adag?** — tételes levezetés:
  `20 perc × 160 szó/perc = 3 200 szó/nap`, `598 565 szó ÷ 3 200 ≈ 188 nap (6,1 hónap)`,
  a **könyvenkénti tempó-tábla** (lásd 6. pont) — plusz a **mai keret** bontása
  (`napi 3 200 − 201 korrekció`).
- **📅 Következő napok** — a következő **14 nap** fejezetei dátummal, darabszámmal és
  becsült idővel (ugyanazzal az algoritmussal előre szimulálva, tehát nem „elméleti"
  átlag, hanem a tényleges adagok).

A **Haladás** kártyán:

- **📊 Részletes haladás** — eltelt napok, tervezett vs. elolvasott szó, a különbség
  szóban **és** napban, hátralévő fejezet/szó, **eredeti céldátum**, „ehhez mostantól
  napi ennyit kellene", és a jelenlegi tempóddal várható befejezés.

## 5. „Mi újult meg?" — minden ki nem olvasott kör

- A panel **eddig is** az összes, még nem látott kört mutatta (`sl_changelog_seen`
  alapján) — ez most **ellenőrizve**: aki csak az 1. kört látta, az a 2.-at és a
  3.-at is megkapja egyszerre, egy panelben.
- **Új:** a „láttam" jelölés csak akkor íródik ki, ha tényleg **bezártad** a panelt
  (Értem, köszönöm / ✕). Ha közben kilépsz az appból, legközelebb újra előjön —
  eddig már a megjelenéskor „elhasználódott".
- Új CHANGELOG-bejegyzés (**v3**) készült erről a körről.

---

## Feltöltés

1. `index.html` és `sw.js` fel a repóba (git push → GitHub Pages).
2. Az appban **kétszer** frissíts (a service worker az elsőnél tölti le az újat),
   vagy zárd be és nyisd újra a telepített appot.
3. Ellenőrzés: Biblia fül tetején az ige, a Terv kártyán a két új lenyitható fül.

## 6. Utólagos pontosítás — a napi adag SZÓRA megy, nem fejezetszámra

Felmerült, hogy a terv fejezetszámra átlagol (pl. „mindig ~6 fejezet"). **Nem az** —
a napi keret `napi perc × szó/perc` szó, és annyi fejezet kerül bele, amennyi kiadja.
Mért példa 10 perc / 200 szó/perc = 2 000 szó mellett:

| Hol jár | Napi adag | Idő |
|---|---|---|
| Zsoltárok 1–14 | 14 fejezet | 9,9 perc |
| Zsoltárok 120–136 | 17 fejezet | 8,1 perc |
| Lukács 1–2 | 2 fejezet | 10,4 perc |
| Lukács 8–9 | 2 fejezet | 11,5 perc |
| Ézsaiás 44–48 | 5 fejezet | 10,4 perc |

A **kijelzés** volt félrevezető: a Terv kártyán „napi ≈ 20 perc **(6,4 fejezet)**"
szerepelt, ami egy globális átlag. Javítva:

- Terv kártya fejléce: `napi ≈ 20 perc = 3 200 szó` + magyarázó sor, hogy a
  fejezetszám változik, az idő nem.
- A levezetésből kikerült az „átlagosan X fejezet" sor, helyette a **könyvenkénti
  tempó-tábla**: ugyanaz a napi keret Zsoltárok ≈ 9,8 fejezet, Példabeszédek ≈ 5,1,
  1Mózes ≈ 3,4, Máté ≈ 3, **Lukács ≈ 2,4** fejezet/nap.
- A tervezőben ugyanez a példa jelenik meg a csúszkák alatt.
- A „Következő napok" listában az **idő** a hangsúlyos, a fejezetszám alatta kisebben.
