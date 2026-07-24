# Trellis — adatvesztés: ok, javítás, mentőeszköz (2026-07-24)

## Mi történt (a hiba pontos menete)

A felhő-szinkron **kizárólag az `updatedAt` időbélyeget** nézte: "az újabb nyer".

```js
// RÉGI kód (index.html, Firebase modul)
if((remote.updatedAt||0)>(local.updatedAt||0)) applyRemote(remote);
else setDoc(ref, local);        // <-- ITT veszett el minden
```

A lépések:

1. A gépeden **először** nyitottad meg az appot → ott üres a `localStorage`, jött az
   üdvözlő képernyő.
2. Az üdvözlő képernyő „Kezdés" gombja `save()`-et hívott → `S.updatedAt = most`.
   Így az **üres** állapot lett a **legfrissebb** a rendszer szemében.
3. Beléptél a Google-fiókkal → a modul összehasonlította: a helyi (üres, mai) állapot
   `updatedAt`-je **nagyobb** volt, mint a felhőben lévő (valódi, tegnapi) adaté →
   az `else` ág lefutott: **`setDoc(ref, local)`** — az üres állapot felülírta a felhőt.
4. A telefonodon az `onSnapshot` figyelő azonnal észlelte, hogy a felhő „frissebb",
   és `applyRemote()`-tal **a telefon localStorage-át is felülírta** ugyanazzal az
   üres állapottal.

Egyetlen extra kattintás sem kellett hozzá — a belépés önmagában elég volt.
Biztonsági mentés sehol nem készült, ezért nem volt mihez visszanyúlni.

## A javítás (4 rétegben)

### 1. Tartalom dönt, nem csak az idő
Új `contentWeight(state)`: célok × 3 + napok + bejegyzések + teendők + Biblia-jelölések
+ ciklus-bejegyzések. Az új belépési logika (`window.SL.cloudResolve`):

| helyi | felhő | mi történik |
|---|---|---|
| üres | tele | **mindig a felhő nyer** (időbélyegtől függetlenül) |
| tele | üres | **mindig a helyi nyer**, feltöltés |
| üres | üres | semmi |
| tele | tele, hasonló méret | az újabb nyer (mint eddig) |
| tele | tele, az újabb **érdemben kevesebb** | **megkérdezi a felhasználót** |

### 2. Ütközés-párbeszéd
Ha az „újabb" oldal jelentősen kevesebbet tartalmaz (`súly(nyertes)+2 < súly(vesztes)*0.9`),
felugrik egy panel mindkét oldal összefoglalójával (hány cél / nap / bejegyzés, mikori),
három választással: *felhő* / *ezen az eszközön lévő* / *most nem döntök*.
Amíg nincs döntés, `cloudLock = true` → **egyik irányba sem megy adat**.

### 3. Írás-fékek
- `Cloud.push()` nem ír, ha az állapot súlya 0 és a felhőben van tartalom.
- `Cloud.push()` nem ír, amíg ütközés-kérdés áll.
- Az üdvözlő képernyő már **`persist()`**-et hív, nem `save()`-et → üres állapot
  soha nem kap friss időbélyeget.
- A „Minden adat törlése" külön rákérdez, hogy a **felhőből** is töröljön-e
  (eddig szó nélkül törölte onnan is, tehát a másik eszközödről is).

### 4. Biztonsági mentések (ez eddig teljesen hiányzott)
- **Helyi** (`sl_bak_<idő>_<ok>` kulcsok, max 6 db / ~1,5 MB): naponta egyszer indításkor,
  és minden kockázatos lépés előtt — felhő-szinkron, importálás, törlés, ütközés,
  visszaállítás.
- **Felhő** (`users/{uid}/backups/{ÉÉÉÉ-HH-NN}`): naponta egy pillanatkép, 14 nap
  körforgóval. Új Firestore-szabály kell hozzá (lásd lent).
- **Fiók fül → 🛟 Biztonsági mentések**: mindkét lista, tételes tartalommal, egy
  koppintással visszaállítható. Visszaállítás előtt a mostani állapotról is mentés készül.

## Mentőeszköz: `mento.html`

Külön, önálló oldal (`.../Szok-sok/mento.html`), ami **semmit nem ír felül magától**:
- kilistázza az eszköz **összes** Trellis-kulcsát, tételesen (hány cél, nap, bejegyzés,
  mikori) — a régi `szintlepo` / `szintlepo2` kulcsokat és a pillanatképeket is,
- **letölti egy fájlba** az egészet,
- Google-belépés után megmutatja és letölti a **felhőben** lévő nyers adatot,
- bármelyik megtalált állapotot **visszateheti** az appba (előtte mentést készít),
- fájlból is tud visszaállítani.

Ugyanarról a címről kell megnyitni, ahol az app fut (a `localStorage` cím-kötött).

## Egyéb javítás

`sw.js`: a HTML network-first ág **minden** HTML-választ `./index.html` néven tett a
cache-be — így pl. a `mento.html` megnyitása offline felülírta volna az app-shellt.
Mostantól csak a `/` és a `/index.html` kerül oda. Verzió: **v50 → v51**, app: **v12 → v13**.

## Feltöltés

1. `index.html`, `sw.js`, **`mento.html`** fel a repo gyökerébe (git push → GitHub Pages).
2. **Firestore-szabályok publikálása** (Firebase konzol → Firestore → Rules → Publish) —
   e nélkül a felhő-pillanatképek nem íródnak ki (`permission-denied`, az app némán
   továbbmegy, minden más működik):
   ```
   match /users/{uid}/backups/{bakId} {
     allow read, write, delete: if request.auth != null && request.auth.uid == uid;
   }
   ```
3. A telefonon **2× frissítés** (service worker cache).

## Ellenőrzés (böngészőben lefuttatva)

| eset | eredmény |
|---|---|
| üres eszköz + tele felhő | 2 cél megérkezett, **0 feltöltés** (a régi kódban ez törölt) |
| tele eszköz + üres felhő | adat megmaradt, 1 feltöltés |
| újabb, de sokkal kisebb felhő | **nem változott semmi**, párbeszéd nyílt, szinkron zárolva |
| „az eszközön lévőt tartsuk meg" | zár feloldva, feltöltés megtörtént |
| napi pillanatkép | indításkor elkészült, a Fiók fülön listázódik és visszaállítható |
| `mento.html` | felsorolja a pillanatképeket, tartalmukkal, visszaállító gombbal |

Konzol-hiba egyik ágon sem.
