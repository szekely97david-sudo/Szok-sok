# Szinkron-javítás + Közös listák modul — 2026-07-29 (app v36, sw v74, CHANGELOG v22)

Ugyanaznap, a [kis javítások kör](JAVITASOK_kislista_2026-07-29.md) (v35 / sw v73) után.

## 1. A szinkron-hiba: „letöltés: invalid-argument"

**Tünet:** Fiók fülön mindkettőjüknél „Hiba: letöltés: invalid-argument", és a
Szinkronizálás panel gombjai látszólag nem csináltak semmit.

**Ok:** a Firestore **nem támogatja a tömbben lévő tömböt** („Nested arrays are not
supported"), és a `setDoc()` ezt **szinkron kivétellel** jelzi, nem elutasított
ígérettel. Az állapotban viszont pontosan ilyen van:

```js
S.food.custom[].u = [["adag",500],["szelet",25]]
```

Amint valaki felvitt egy saját mértékegységet, a teljes állapot-feltöltés eldobott
egy kivételt. Ez két helyen okozott zavart:

1. az auth-ág `try{…}catch(e){onCloudErr("pull",e)}` blokkjában futott az
   `api.upload()` → a **feltöltési** hiba **„letöltés"**-ként jelent meg;
2. `pushNow()` szinkron dobott, így a panel gombjának kezelője a `toast` előtt
   meghalt → „rákattintok, nem történik semmi".

Ugyanez ölte meg némán a közös háztartás `hhPut`-jait is (az ételek `u` mezője
miatt) — ezért nem frissült a már megosztott étel.

**Bizonyíték (böngésző-konzol, valódi Firebase SDK, hálózat nélkül is dob):**

```
setDoc(ref,{food:{custom:[{u:[["adag",500]]}]}})
→ invalid-argument | Function setDoc() called with invalid data.
  Nested arrays are not supported
```

**Javítás:** kódolás a Firestore-határon (`clEnc` / `clDec` a modul-scriptben).
Minden beágyazott tömb `{__a:[…]}`-ba kerül, olvasáskor kibomlik; a `NaN`/`Infinity`
null lesz, az `undefined` kimarad. Régi, kódolatlan dokumentumokra nézve **visszafelé
kompatibilis** (nincs bennük `__a`). Alkalmazva: `push`, `pushNow`, auth-ági
feltöltés, `cloudBackup`, `listAdd/listSet`, `hhPut` — és a párja olvasáskor:
`pullNow`, kezdeti `getDoc`, `onSnapshot`, `listBackups`, `hhWatch`.
A `mento.html` is kapott dekódolót (különben sérült mentést állítana vissza).

**Ráadás javítások:**
- a feltöltés saját `try/catch`-et kapott az auth-ágban → a hiba a helyes néven jelenik meg;
- `syPush()`: a kézi feltöltés sikert **és** hibát is kimond (eddig a „Feltöltve ✓" akkor is kiírta magát, ha semmi nem ment fel);
- `applyRemote` néma `catch`-je megszólalt.

## 2. Közös listák modul (`lst*`)

A közös fejlesztési lista motorja bevált, ezért nem bevásárlólistát építettem,
hanem **általános közös listát** — a bevásárlás csak az egyik használati mód.

**Felhő-séma**

```
sharedlists/{listId}            {name, em, kind, emails:[…], owner, at, shop}
sharedlists/{listId}/items/{id} {text, q, cat, note, price, done, by, byName,
                                 doneName, at, upd}
```

Tagság **e-mail címmel**, mint a közös háztartásnál: a meghívott appja a következő
indításkor magától megtalálja a listát (`listsFind` → `where emails array-contains`).

**Ami benne van:** több lista; sablonok (bevásárlás, utazás, kemping, nagytakarítás);
több tétel egyszerre (soronként, mennyiség-felismeréssel: „2 kg paradicsom", „tej 2 l");
automatikus kategória bolti sorrendben (kikapcsolható, felülbírálható); gyakori
tételek javaslata a saját előzményből; ki írta fel / ki vette meg; mennyiség, jegyzet,
ár + összeg; törlés visszavonással; „🛒 boltban vagyok" jelzés; szöveges másolás és
CSV-export; **receptből bevásárlólista** (Kalória → recept-szerkesztő 🛒 gombja).

**Ami szándékosan NEM:** élő jelenlét / avatár-sor (percenkénti írás mindenkitől,
elégeti az ingyenes keretet két-három felhasználóért), fotó a tételhez (Firebase
Storage kellene, base64-ben az 1 MB-os dokumentum-limitbe futnánk), valódi push
(FCM — külön kör), kézi drag&drop sorrend (a kategória-csoportosítás ugyanazt a
bolti-útvonal problémát oldja meg), pontrendszer-integráció (a pontozás épp
átalakítás előtt áll, kár rákötni).

**Beépítés:** `<section id="tab-listak">`, `MODULES` + `modOn` + `modToggle`
(`flag:"lists"`), `TAB_IDS`, `switchTab`/`rerenderCurTab`/`goBack`/`anyScreenOpen`,
`homeSummary`, `normLists`/`listsBlank`, manifest-parancsikon (`?m=lists`).

## 3. Firestore-szabályok — **PUBLIKÁLNI KELL**

A `firestore.rules` bővült a `sharedlists/{listId}` meta-dokumentummal és a
tagsági feltétellel. **Amíg ezt a Firebase Console-ban nem teszed közzé
(Firestore → Rules → Publish), az új listák `permission-denied`-et kapnak** — az
app ezt ki is írja emberi nyelven. A `dev` lista (közös fejlesztési lista) külön
kivétel: továbbra is nyilvánosan olvasható, belépve írható, tehát a REST-lekérdezésem
és a Fiók fül változatlanul működik.

## Füstteszt (localhost:8765)

- szintaxis: a fő script Blob-scriptként betöltve hibátlan (a `„Bevásárlás"` idézőjel-hiba menet közben javítva)
- `clEnc/clDec`: kódolt írás **nem dob**, a kör-utazás veszteségmentes (mély tömbök is), régi dokumentum érintetlen
- sor-értelmezés: „2 kg paradicsom" → 2 kg / paradicsom; „tej 2 l" → 2 l / tej; „6 tojás" → 6 / tojás; „[ ] mosogatószer" → mosogatószer
- kategória-tipp: tejföl→tejtermék, csirkemell→hús, wc papír→háztartás, ismeretlen→egyéb
- teljes UI hamis felhővel: lista megnyitás, 5 tétel egyszerre, csoportosítás, kipipálás, szerkesztés (mennyiség/ár/jegyzet/kategória), összeg, törlés+visszavonás, boltban-vagyok (saját és másé), sablonból új lista (11 tétel), tag hozzáadása, lista-menü, CSV-fájlnév + Blob, szöveges másolás
- receptből lista: 250 g Rizs + 400 g Csirkemell felkerült
- Kezdőlap-összefoglaló, Aktiválható modulok, alsó nav, `?m=lists`
- mind a 10 fül rendereltetve, konzol tiszta
