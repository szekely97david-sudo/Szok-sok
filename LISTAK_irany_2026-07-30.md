# Listák — mit érdemes megvalósítani, mit nem (2026-07-30)

Egy AI-beszélgetés (Notion-elemzés + kritika) megszűrése és döntés. A kérdés az volt:
**csak közös lista legyen, vagy egy „profi jegyzet/adatbázis" modul is?**

## Döntés egy mondatban

**Nem építünk Notiont.** A Trellis listái maradnak *listák*, de a lista **típusa**
dönti el, mit kérdez — és a mezők egyenként ki-be kapcsolhatók. Ez a
„progresszív komplexitás" a Trellis-fordítása; minden más Notion-funkció
(relációk, rollup, képletek, nézet-galéria, saját mező-építő) **kimarad**.

## Amit az elemzésből elfogadtam

1. **Progressive disclosure.** Igaz, és nálunk már működő minta (cél-űrlap
   „Haladó beállítások", Biblia-terv részletek). A listáknál is ez a váz.
2. **A 10 másodperces alapszabály.** A beírás + Enter az elsődleges út. Ezért
   nem űrlapot bővítettünk, hanem a **beírás-felismerést**: `festék @Dóra`,
   `számla holnap`, `fogorvos !!!`, `2 kg paradicsom`.
3. **A Notion csapdája valódi.** Ott minden ugyanaz az adatbázis más mezőkkel,
   ezért semmi nem gyors, és az app soha nem „érti", mit akarok. A mi
   előnyünk pont az, hogy a listának **véleménye van**.
4. **Mobil-first, ujjbarát.** Nézet-menü lenyílóban, nem beállítás-fülön;
   blokkok, nem táblázat.

## Amiben nem értek egyet — és miért

- **„Ne akarj relációs adatbázist" → egyetértek, de nem ezért.** A gond nem a
  séma, hanem a **szinkron**. Nálunk minden lista élő, több eszközön,
  offline-tűréssel. Egy reláció két dokumentum konzisztenciáját követeli meg
  ütközés közben — ezért nincs reláció. Egy **lapos tétel** viszont bármikor
  összefésülhető. Ez a valódi ok.
- **„Legyen 10-15 előre definiált mező" → sok.** Hatot építettem be
  (mennyiség, ár, jegyzet, határidő, felelős, prioritás). Az URL, a fotó és a
  csatolmány kimaradt: a fotó Firebase Storage-ot (fizetős) igényel, az URL-t
  a jegyzet elviszi, és minden további mező **egy sorral tolja lejjebb** a
  gombot a telefonon.
- **„A típus határozza meg a funkciókat" → igen, de nem zárt.** Ha a típus
  fixen kötné a mezőket, ugyanoda jutnánk, ahonnan a Notiont kritizáljuk:
  valakinek a bevásárlólistán *is* kell határidő. Ezért a típus **csak a
  kezdőállapot**, a hat kapcsoló pedig felülírja.
- **„Inkább AI-ba fektesd az energiát" (grillezés 8 főre → kész lista).**
  Tetszik, de **később**: a felhasználó saját Gemini-kulcsával megy (nem
  mindenkinek van), tehát nem lehet rá alapfunkciót építeni. Előbb kell egy
  lista, ami kulcs nélkül is jó. Következő körben viszont ez a legjobb
  jelölt, mert a motor (kulcs, hibakezelés, prompt-minta) már megvan a
  Kalória-modulból.
- **„Ha egy funkciót <10% használna havonta, ne kerüljön be" → majdnem.**
  Nálunk 3-4 felhasználó van, nem 100 000: itt nem a százalék dönt, hanem
  hogy **te** használod-e. A szabály helyes formája nálunk: *ha egy funkció
  új adatszerkezetet vezet be, amit a szinkronnak és a mentésnek is tudnia
  kell, akkor nagyon kell hozzá az igény.*

## Amit szándékosan NEM építünk

| Notion-funkció | Miért nem |
|---|---|
| Saját mező létrehozása (dinamikus séma) | A szinkron, a mentés-visszaállítás és a CSV-export mindegyike külön kezelést kér. Haszna három felhasználónál ~0. |
| Relációk, rollup, képletek | Ütközés-kezelés több dokumentumon. Ez a Notion offline-módjának temetője is. |
| Nézetek (tábla, galéria, kanban, timeline) | Telefonon egy jó lista + blokkok + rendezés ugyanazt adja. |
| Kommentek tételenként | Írás-forgalom és értesítés kell hozzá; a jegyzet-mező 90%-ban elég. |
| Verziókövetés, jogosultságok tételenként | A tételen ott van, ki írta és ki zárta le. Ennyi elég. |
| Fotó a tételen | Firebase Storage = fizetős; base64 = 1 MB-os dokumentum-korlát. |

## Ami ebben a körben elkészült (app v37)

- **Lista-típus**: 🛒 Bevásárlás · ✅ Teendők, projekt · 🧳 Pakolás · 📝 Általános.
  A típus adja a mezőket és azt, hogy bolti kategóriákba csoportosítson-e.
- **Mezők listánként** (⋯ → ⚙️): mennyiség, ár, jegyzet, határidő, felelős,
  prioritás. Kikapcsolva rejtve, de az adat megmarad.
- **Beírás-felismerés**: mennyiség + `@Név` + `!`/`!!`/`!!!` + dátum
  (`ma`, `holnap`, `holnapután`, `hétfőn`, `15-én`, `08. 15.`, `aug 15`).
  Csak bekapcsolt mezőbe ír — rejtett adat nem keletkezik.
- **Határidő-blokkok** (Lejárt / Ma / A héten / Később / Nincs) + lejárt
  kiemelés, **⇅ Nézet** menü (rendezés + „csak amit én vállaltam").
- CSV és szöveges másolás kiegészítve az új mezőkkel.

## Következő lépcsők (ebben a sorrendben)

1. **Push-értesítés** (FCM): „valaki hozzáírt", „a boltban vagyok". Ez a
   közös lista legnagyobb hiányzó darabja — enélkül meg kell nyitni az appot.
2. **AI-lista**: „szombati grillezés 8 főre" → tételek, mennyiséggel,
   kategóriával. Saját Gemini-kulccsal, opcionálisan.
3. **Ismétlődő tétel** (hetente kenyér; havonta számla) — a szokáskövető
   cadence-motorja már tudja a logikát, csak át kell venni.
4. Kézi sorrend (drag) — csak ha a csoportosítás bizonyítottan nem elég.
