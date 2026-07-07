# Trellis (korábban Szintlépő) — kiadási jegyzet

Egyfájlos PWA. A `szintlepo3` localStorage-kulcs és a domain **változatlan** — nincs adatvesztés. Az átnevezés csak megjelenés. sw cache: **v8**.

## Átnevezés
Az app neve mostantól **Trellis** (cím, fejléc, onboarding, manifest). Az adat-kulcs és a repo/URL nem változott, így a meglévő adatok megmaradnak.

## 2. RÉTEG — mi új
- **5 téma** (Arany éj, Erdő, Óceán, Naplemente, Papír) — Fiók → Megjelenés, azonnal vált, eltárolódik.
- **Részletes, kereshető súgó** — Fiók → „📖 Súgó megnyitása": tartalomjegyzék + kereső + ~17 részletes szekció (kezdéstől a Gemini-kulcsig, telepítésig, adatvédelemig).
- **Infó-buborékok** — „i" ikonok a lényeges helyeken (irány, ütemezés, mérési mód, szerep, rubrika, küszöb, streak, vakáció, Gemini-kulcs…); kattintásra rövid magyarázat + „Részletes súgó".
- **Első-cél tutorial** — az onboarding után lépésről lépésre végigvezet, és az első cél űrlapján bátorító sáv segít.
- **Miértek (indok-gyűjtés)** — pontozott mércén **bukáskor** rákérdez „mi akadályozott?", **győzelemkor** „mi segített?"; gyűjti és visszamutatja a korábbi okokat. Mindig kihagyható.
- **Skálás bukás/győzelem küszöb** — a cél szerkesztésénél állítható (pl. 4 alatt bukás, 7 felett győzelem); ez vezérli a miért-kérdéseket.
- **Barátságosabb érzet** — ünneplő visszajelzés teljesítéskor és **szintlépéskor** (⭐), megbocsátó szövegezés, 1-tap naplózás megmarad.
- **Narratív haladás + leghosszabb streak** — „Az elmúlt N releváns napból M-szer teljesítetted", és 🏆 leghosszabb streak minden célnál.
- **Fejlesztői visszajelzés** — Fiók → Visszajelzés: hosszú üzenet + opcionális elérhetőség → Firestore `feedback` kollekció (+ opcionális ingyenes e-mail webhook).

## Cserélhető fájlok
`index.html`, `sw.js`, `firestore.rules`, `firebase-config.js`, `manifest.webmanifest` (teljes). Ikonok változatlanok.

## Beállítás a visszajelzéshez (egyszeri, ingyenes)
1. **Firestore szabály:** Firebase konzol → Firestore → Rules → másold be a `firestore.rules` tartalmát → **Publish**. (Ez engedélyezi a `feedback` létrehozását, az olvasást tiltja.)
2. **E-mail értesítés (opcionális, billing nélkül) — Google Apps Script:**
   - Nyisd meg: script.google.com → Új projekt.
   - Illeszd be:
     ```
     function doPost(e){
       var d = JSON.parse(e.postData.contents || "{}");
       MailApp.sendEmail("szekely.97.david@gmail.com",
         "Trellis visszajelzés",
         "Üzenet:\n" + (d.text||"") + "\n\nKontakt: " + (d.contact||"-") +
         "\nApp: " + (d.app||"") + "\nUID: " + (d.uid||"") +
         "\nIdő: " + new Date(d.ts||Date.now()));
       return ContentService.createTextOutput("ok");
     }
     ```
   - Deploy → New deployment → **Web app** → Execute as: **Me**, Who has access: **Anyone** → Deploy → másold ki a Web app URL-t.
   - Illeszd be a `firebase-config.js` alján: `window.FEEDBACK_WEBHOOK = "…az URL…";` → töltsd fel.
   - Ezután a visszajelzés e-mailben is megérkezik (a Firestore mellett).

## Feltöltés után
Frissíts az appban **kétszer** (vagy indítsd újra), hogy a service worker a **v8** shellt töltse be.

## Teszt
`node --check` + négy headless (jsdom) füstteszt: migráció, pontozó motor, cadence, teljes DOM-folyamat, 1.1 funkciók, valamint a 2. réteg (témák, súgó+kereső, infó-modál, küszöb+indok-gyűjtés, visszajelzés, leghosszabb streak/narratíva, tutorial). **100/100 assertion zöld.**

## Következő ötletek (ha kell)
Saját Trellis-logó/ikon (a Figma connectorból), heti/havi összegző e-mail, emlékeztető értesítések, több nyelv.
