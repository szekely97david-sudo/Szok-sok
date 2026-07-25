# Edzésnapló modul — 2. kör (2026-07-25)

`sw.js v57 → v58` · `APP_VERSION v19 → v20`

Az 1. kör használat közbeni visszajelzései alapján. Minden pont a te listádról.

## Amit kértél, és bekerült

| # | Kérés | Megoldás |
|---|---|---|
| 1 | Utazás helyszín felesleges | Törölve. Ha korábban mentve volt, a normalizálás kidobja — nem jön vissza. |
| 2 | A pihenőidőt gyakorlathoz, ne globálisan | A pihenő elsődlegesen **gyakorlatonként** áll: az edzésben a ⏱ gombbal, a blokk-menüből, vagy a gyakorlat részleteinél. A globális alapérték a Beállításokban a **Haladó** alá került, és csak ÚJ gyakorlatokat érint. |
| 3 | A pihenő-választó túl kevés opció | Fix lista helyett **görgős perc:mp kerék** (0–15 perc, 5 mp-es lépcső), snap-görgetéssel. |
| 4 | „Lyfta" ne szerepeljen a szövegekben | Minden felhasználói szövegből ki. Az import neve: *Edzés-előzmény importálása (CSV)*. A márkanév csak két kód-kommentben maradt, ami nem látszik. |
| 5 | Az izomcsoport-választón a piros pötty nem látszik | Az ábra kikerült a sávból, **csak a felirat** maradt (Mell · Hát · Váll…). A gyakorlatoknál viszont marad az ábra, mert ott jó. |
| 6 | Túl kicsik az ikonok, hosszú téglalapok | **Négyzetrács, 2 oszlop**, 78×64-es ábrával (a korábbi 40×33 helyett) és tördelt névvel. A Napló → Gyakorlatok lista is ugyanez. |
| 7 | A vissza-gesztus kilép az appból | Lépésenként lép vissza: **részletnézet → lista → választó bezárul**; a Napló/Statisztika fülről a **Ma fülre**. Ráadásul találtam egy meglévő szivárgást is: a „miért" ablak `closeModal()`-lal zárt, ami elnyelt egy vissza-gesztust — javítva. |
| 8 | Koppintásra ne kerüljön rögtön az edzésbe | Koppintás = **részletnézet**: nagy ábra/kép, leírás, célizmok, csúcsok, utolsó 3 alkalom. Onnan külön **„➕ Hozzáadás az edzéshez"** gomb. |
| 9 | Több gyakorlat kijelölése egyszerre | A csempe sarkában **jelölőnégyzet**, benne a sorszám. A **kijelölés sorrendjében** kerülnek be. |
| 10 | A gépbeállításnál ne jöjjön fel a domain-es ablak | A modul összes natív `prompt`/`confirm` ablaka lecserélve appon belüli párbeszédre. |
| 11 | A gépbeállítás adjon opciókat, ne kelljen gépelni | Nevesített sorok **számmezővel**: ülésmagasság · háttámla dőlése · csiga magassága · párna/tekercs · lábtámasz · ütköző · fogásszélesség, plusz egy „egyéb". Egyszerre töltöd ki. |
| 12 | Szuperszettnél csak a következővel kötött össze | Most **felkínálja az edzés összes többi gyakorlatát**, plusz azt, hogy mindjárt hozzáadsz egy újat. A párt egymás mellé is rendezi, hogy egy keretbe essenek. |
| 13 | Középről a végére vinni sok nyomogatás | **Hosszan nyomd a gyakorlat fejlécét** (~0,5 mp, rezgéssel jelez), és húzd a helyére. A ▲▼ marad. |
| 14 | Nem találtam a szuperszettet és a vetkőző sorozatot | Mindkettő felkerült a **gyakorlat ⋮ menüjébe** (eddig a vetkőző csak a szett sorszámára koppintva volt elérhető). |
| 15 | A fotó túl kicsi | A képre koppintva **teljes méretben** megnyílik — az edzésben, a listában és a részletnézetben is. Onnan cserélhető és törölhető. |
| 16 | Galériából is lehessen képet | A `capture` attribútum kikerült, így **galéria és kamera** is választható. Felbontás 320 → 560 px. |
| 17 | A saját gyakorlat űrlapja túl bonyolult | Első körben csak **név** + **ismétlés vagy idő**. Minden más (izom, felszerelés, jelleg, saját testsúly) a **Haladó beállítások** alatt. Kép is adható rögtön. |
| 18 | Rutint előre is lehessen összeállítani | **➕ Új rutin összeállítása** a Napló → Rutinok fülön: név, helyszín, gyakorlatok sorrendben, ▲▼ és törlés. A meglévő rutinok is szerkeszthetők. |

## Ami menet közben még bekerült

- **Gyakorlat-leírás** minden gyakorlathoz, a katalógus szerkezetéből képezve
  (jelleg, felszerelés, elsődleges/másodlagos izmok, mérési mód) — nem kitalált
  technikai tanács. Alá a **saját megjegyzésed**, amit te írsz.
- A **Kedvencek** most tényleg a lista tetején vannak (korábban kiszorultak).
- A blokk-menüből közvetlenül elérhető a **pihenőidő** is.

## Nem triviális döntések

**A vissza-gesztus javítása a `goBack()`-be került, nem a modulba.** A modul-fül
visszalépés `pushScreen()`-nel pótolja az elhasznált history-bejegyzést — enélkül
a gesztus a böngésző szintjén kilépne. Ugyanez a minta, amit a Biblia-kvíz
kontextusnézete használ.

**A drag-átrendezés `touchmove`-ot fog el `passive:false`-szal**, de csak akkor,
ha a hosszú nyomás már elindult — így a normál görgetés nem akad meg. 10 px-nél
nagyobb függőleges elmozdulás megszakítja a hosszú nyomás időzítőjét.
