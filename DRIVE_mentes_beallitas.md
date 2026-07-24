# Trellis — Google Drive mentés beállítása (2026-07-24)

Az app mostantól a felhasználó **saját Google Drive-jába** is tud menteni egy
**„Trellis mentések"** mappába, `trellis-mentes-ÉÉÉÉ-HH-NN.json` fájlokként. Ez a
Firebase-projekttől **teljesen független** másolat — akkor is megmarad, ha a Firebase
megszűnik, törlik vagy feltörik.

## Jogosultság
`https://www.googleapis.com/auth/drive.file` — **nem érzékeny** scope: az app KIZÁRÓLAG
a saját maga által létrehozott fájlokat látja, a felhasználó többi Drive-fájljához nem fér.

## Egyszeri beállítás a Google Cloud konzolban (a projekt tulajdonosának)
Projekt: **szokasok-5847c**

1. **Drive API engedélyezése:**
   https://console.cloud.google.com/apis/library/drive.googleapis.com?project=szokasok-5847c
   → *Enable*.
2. **OAuth consent screen → Scopes:** vedd fel a `.../auth/drive.file` scope-ot
   (ha nincs ott). A `drive.file` „recommended/non-sensitive", általában nem kell
   Google-verifikáció a saját/teszt-felhasználókhoz.
3. Ha az OAuth consent „Testing" módban van, add hozzá magad (és bárkit, aki használja)
   **Test users**-ként — különben a Drive-engedély kérésekor elakad.

Amíg a Drive API nincs engedélyezve, az app **hibátlanul működik**, csak a Drive-lista
helyén egy magyarázó üzenet jelenik meg — semmi nem törik el.

## Használat az appban
Fiók fül → **🛟 Biztonsági mentések → Google Drive** szakasz:
- **🟢 Google Drive mentés bekapcsolása** → egyszeri Google-engedély, majd azonnal ment egyet.
- **Mentés a Drive-ra most** → kézi mentés (és ilyenkor frissül a hozzáférés is).
- A lista minden Drive-mentést mutat, dátummal, **Visszaállítás** gombbal.
- **Kikapcsolás** → az app többé nem ment a Drive-ra (a meglévő fájlok megmaradnak).

## Automatika és cadence (őszintén)
- A Drive-hozzáférés tokene ~1 óráig él, és belépéskor újul meg. Ezért a Drive-mentés
  **belépéskor** és a **napi felhő-mentéssel együtt** fut (ha aznap már van érvényes token),
  plusz bármikor kézzel. Ha be van kapcsolva (`sl_driveOn`), a **fő belépés is** kéri a
  Drive-scope-ot, így a legtöbb munkamenetben magától frissül.
- Megtartott fájlok: a **30 legfrissebb**, a régebbieket takarítja.

## A teljes védelmi lánc (független másolatok)
1. Eszköz (helyi, offline is)
2. Firebase felhő (eszközök közti szinkron)
3. Firebase pillanatképek (időben visszamenőleg, 30 db)
4. **Google Drive** (a te fiókodban, tőlünk függetlenül) ← ez az új
5. Kézi export-fájl (a végső biztosíték)

Adatvesztéshez ezek közül többnek **egyszerre** kellene megsemmisülnie.

Verziók: `sw.js` v53, app v15.
