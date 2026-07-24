# Trellis — adatbiztonsági átvilágítás és megerősítés (2026-07-24)

Cél: átnézni **minden** adatvesztési rést, mindegyiket lezárni, és olyan automatikus,
vészhelyzetre elérhető mentést építeni, amiből mindig van visszaút.

## A megtalált rések és a megoldásuk

| # | Rés | Következmény | Megoldás | Állapot |
|---|-----|--------------|----------|---------|
| 1 | Szinkron csak `updatedAt`-et nézett | üres eszköz felülírta a felhőt | tartalom-súly (`contentWeight`) dönt; üres SOHA nem ír felül | ✅ |
| 2 | `onSnapshot` ugyanígy visszaírta az eszközre | telefon is kiürült | az `onSnapshot` is a `cloudResolve`-on megy át | ✅ |
| 3 | Onboarding `save()` friss időbélyeget adott az üresnek | ez tette „frissebbé" az üreset | onboarding már csak `persist()`, nem `save()` | ✅ |
| 4 | Nem volt SEMMILYEN biztonsági mentés | nem volt visszaút | helyi + felhő auto-pillanatképek (lásd lent) | ✅ |
| 5 | „Minden adat törlése" szó nélkül a felhőt is törölte | másik eszköz adata is elveszett | külön rákérdez a felhőre | ✅ |
| 6 | `persist()` némán elnyelte a kvóta-hibát | mentettnek hitt, nem mentett adat | kvóta-biztos `persist()`: helyet szabadít + figyelmeztet | ✅ |
| 7 | Nagy, de nem-üres zsugorodás (pl. 100→3 cél) | csendes részleges vesztés | felülíráskor a régi állapot a felhőbe is mentődik; belépéskor jelentős eltérésnél **kérdez** | ✅ |
| 8 | `sw.js` bármely HTML-t app-shellként cache-elt | offline rossz oldal jött be | csak `/` és `/index.html` cache-elődik | ✅ |
| 9 | Egyszerű felülíró mentés több eszközről | last-write-wins ütközés | jelentős eltérésnél felhasználói döntés + minden verzió mentve | ✅ |

## Az automatikus mentés felépítése (3 réteg)

### 1. Helyi pillanatképek — `sl_bak_<idő>_<ok>`
- **Mikor:** naponta egyszer indításkor, és minden kockázatos lépés ELŐTT
  (felhő-szinkron, importálás, törlés, ütközés, visszaállítás).
- **Mennyi:** a 6 legfrissebb, max ~1,5 MB. A valódi adat mindig előbbre való:
  ha megtelik a tár, a `persist()` a régi pillanatképeket dobja, hogy a fő adat mentődjön.
- **Hol:** Fiók fül → 🛟 Biztonsági mentések, egy koppintással visszaállítható.

### 2. Felhő pillanatképek — `users/{uid}/backups/{kulcs}`
- **Napi:** a mai dátum a kulcs. **Üres állapotból nem indul**, és **soha nem ír felül
  nagyobb tartalmú aznapi mentést kisebbel** (az üres nem törölheti a jót).
- **Kritikus pillanat előtt:** mielőtt egy távoli állapot felülírná a helyit, a helyi
  a felhőbe is elmentődik időbélyeges kulccsal (`eszkoz-elott-…`).
- **Mennyi:** a 30 legfrissebb marad (idő szerint), a régebbieket takarítja.
- **Hol:** ugyanaz a 🛟 panel, „Felhőben" szakasz — bármely eszközről visszahozható.

### 3. Vészkijárat — `mento.html`
Önálló oldal, ami **semmit nem ír felül magától**: kilistázza az eszköz összes
Trellis-kulcsát (a régi `szintlepo`/`szintlepo2`-t és minden pillanatképet is),
letölti fájlba, belépés után megmutatja és letölti a felhő nyers tartalmát és a
felhő-pillanatképeket, és bármelyiket egy gombbal visszateszi az appba.

## Kézi mentés
Fiók → Mentés → **Exportálás (fájl)**: teljes állapot letöltése JSON-ként. Ez a
végső biztosíték — semmilyen szinkron nem tudja felülírni. Ajánlott időnként megtenni.

## Ami a felhasználón múlik (ezért fontos)
- **Minden eszközön frissíteni kell** (2× megnyitás / Frissítés gomb), hogy mindegyik
  az új, védett kódot fussa. Amíg egy eszköz a régi kódot futtatja, elméletileg még
  tud régi módon felülírni — a frissítés után ez megszűnik.
- A **Firestore-szabályt publikálni kell**, különben a felhő-pillanatképek nem íródnak
  ki (az app működik, csak ez a réteg marad ki, némán).

## Auth-oldali megjegyzés (nem adatvesztés, de érdemes tudni)
- A `firebase-config.js` `apiKey`-e nyilvános — ez normál a webes Firebase-nél, a
  védelmet a Firestore-szabályok adják (mindenki csak a saját `users/{uid}` fáját éri el).
- Érdemes a Firebase konzolban az **Authorized domains** listát a saját GitHub Pages
  domainre szűkíteni, és a Google-bejelentkezésen kívül mást nem engedélyezni.

## Verziók
`sw.js` **v50 → v52**, app **v12 → v14**. Firestore-szabály: `users/{uid}/backups/{bakId}` blokk.
