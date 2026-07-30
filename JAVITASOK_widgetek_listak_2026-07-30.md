# Trellis — Widgetek/gyorsindítók + testre szabható listák (2026-07-30)

**app v37 · sw v75 · CHANGELOG v23**

## 1. Fiók → 🚀 Widgetek és gyorsindítók (új panel, `wgt*`)

Előzmény: a v35-ben bekerült modul-parancsikon (manifest `shortcuts`) a
felhasználónak **nem volt kipróbálható** — nem derült ki, hol keresse.

- **Gyorsindítók**: minden bekapcsolt modul egy sorban, a saját mélylinkjével
  (`./?m=<modul>`). Két gomb:
  - **📌 Kitesz** → vezetett lap: a link vágólapra, „🌐 Megnyitom a
    böngészőben", megosztás (ha van `navigator.share`), és **lépésenkénti**
    útmutató Androidra és iPhone-ra külön (platform-felismerés:
    `wgtIsIOS()`, `wgtStandalone()`).
  - **▶ Kipróbálom** → pontosan azt teszi, amit a kitett ikon fog
    (`openModule(id)`), így előre látszik, működik-e.
- Kimondva: **weben futó app nem tehet ki ikont magától** (nincs rá API), és
  **valódi rendszer-widget sem lehetséges** — ahhoz natív alkalmazás kell.
  Ez tudatos döntés: a hamis ígéret rosszabb, mint egy plusz koppintás.
- **Kezdőlap-widgetek**: melyik modul-kártya látszik a 🏠 Kezdőlapon, és
  látszik-e az Össz-haladás kártya. Tárolás: `S.ui.homeCards` (csak a
  KIKAPCSOLTAKAT tároljuk → új modul magától megjelenik) és `S.ui.homeMeta`.
  `normUi()` bővítve, hogy a szinkron/mentés ne dobja el.
- `renderHome()` figyeli mindkettőt, és kiírja, ha van elrejtett kártya.

## 2. Közös listák — testre szabható mezők (`lst*`, 2. kör)

Részletes indoklás: `LISTAK_irany_2026-07-30.md`.

- `LST_KINDS` (shop/todo/pack/gen) + `LST_FIELDS` (q, price, note, due, who,
  prio). `lstFields(meta)` = típus-alap ∪ `meta.fields` felülírás;
  `lstUseCats()` = bolti kategóriák kell-e.
- `lstFieldsDlg()` — „⚙️ Mit kérdezzen ez a lista?": típusváltás visszaállítja
  a kapcsolókat, mentés `listMetaSet({kind,fields,cats})`.
- `lstParseLine()` bővítve: `!`/`!!`/`!!!` → prio, `@Név` → who,
  `lstCutDue()` → due. A `08. 15.` mintánál a **záró pont kötelező**, hogy az
  `1.5 l tej` ne dátumnak nézzen ki. `lstExtraFrom()` csak **bekapcsolt**
  mezőbe ír.
- Megjelenítés: `lstDueLabel()` (lejárt/ma/holnap/N nap), `LST_DUEG` blokkok,
  `lstSortItems()` (auto/due/prio/abc/new), `lstViewMenu()` (⇅ Nézet +
  „csak amit én vállaltam"), `lstItemRow()` jelvények (❗, 📅, 👤).
- A 🛒 „A boltban vagyok" gomb **csak bevásárlás-típusnál** látszik; a
  „megvette:" felirat nem-bevásárlásnál „kész:".
- Sablonok: Utazás/Kemping → `pack`, új **✅ Projekt — teendők** sablon
  (megmutatja a felismerést: `ajánlatot kérni !!`, `anyagot megrendelni holnap`,
  `festék kiválasztása @Dóra`, `szerelőt hívni hétfőn`).
- CSV export + szöveges másolás kiegészítve (hatarido, felelos, prioritas).

## 3. Közös fejlesztési lista — tömeges kipipálás (`nl*`)

Egy fejlesztési kör végén 8-10 tétel készül el egyszerre. Új **✓✓ Több
kipipálása** mód: kijelölés (vagy **Mind**) → `nlSelDone()` egy gombbal
lezárja az összeset (`Promise.all` + optimista átrajzolás).

## Füstteszt (python http.server + böngésző)

- Nincs JS-hiba; `APP_VERSION=v37`.
- `lstParseLine` 11 minta: `2 kg paradicsom`, `tej 2 l`, `számla holnap`,
  `szerelőt hívni hétfőn` (csüt → aug. 3.), `festék @Dóra`, `ajánlat 08. 15.`,
  `fogorvos !!!`, `1.5 l tej` (helyesen NEM dátum), `már megvan a kenyér`
  (helyesen NEM „ma"), `számla 15-én @Dávid !!`, `holnapután…` — mind jó.
- Todo-lista render: blokkok + jelvények jók, 🛒 gomb nincs.
- Shop-lista render: kategóriák + összeg + 🛒 gomb megvan.
- Mező-panel: 6 kapcsoló, típusváltás átállítja őket.
- Widget-panel: 6 gyorsindító, „Kitesz" lap + ‹ Vissza, kártya-kapcsolók
  mentődnek, `?m=calories` mélylink a Kalóriát nyitja, `S.ui` túléli a
  normalize+load kört. Mobil (375 px) szélességen nincs túlcsordulás.

## Hátralévő a közös fejlesztési listáról

1. **Edzés: naptár + izomcsoport-színek + kategóriák** (Dóra kérése) — ez a
   következő kör legjobb jelöltje.
2. **Szokáskövetés: pontozás/szintlépés kivétele + újradesign** — külön kör,
   előzetes terv és jóváhagyás kell hozzá (adat- és élmény-szinten is nagy
   vágás; a szintek több körön át épültek).
3. **Yazio-szerű recept-ajánló** (napszak + maradék kalória alapján) — a
   Gemini-motor megvan, de saját kulcsot igényel, ezért opcionális funkció.
