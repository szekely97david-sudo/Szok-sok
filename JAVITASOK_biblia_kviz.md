# Trellis — Bibliaolvasás modul: KVÍZ (2. fázis) — átadás

**Dátum:** 2026-07-20 · **sw:** v42 → **v43** · **adatverzió:** S.version marad **9**
(csak a hiányzó kvíz-almezők pótlódnak, meglévő adathoz nem nyúlunk).

## Mi épült

Közösségi, AI-épített kvíz a Biblia fül **Ma** nézetében (📖 **Mai kvíz** kártya).

- **Kérdésforrás – elsődlegesen a user SAJÁT Gemini-kulcsa** (a meglévő `gemini_key`
  localStorage-kulcs, `gemini-2.5-flash` + automatikus flash/flash-lite tartalék).
  A frissen olvasott fejezet(ek)re **mohón, de kímélve** generál: napi legfeljebb
  **8 generáló hívás** (`QUIZ_DAILY_GEN_BUDGET`), a meglévő 429-backoffal.
  Csak **hard / veryhard** (a séma-enum fizikailag levágja az easy/medium-ot),
  temperature **0.25**, kényszerített JSON `responseSchema`.
- **Közös bank (Firestore `quizbank/{chapterId}/questions/{qid}`):** amit bárki
  generál, az **azonnal mindenki elé kerül**. `qid = kérdés-hash` → azonos kérdés
  ugyanoda írna → természetes **dedup**. Olvasni bárki (belépés nélkül is) tud,
  írni csak belépve, séma-validációval (rules).
- **Hidegindítás / tartalék:** a reviewelt offline bank (`quiz-bank.json`, 33 fejezet,
  330 kérdés) az app gyökerében **statikus assetként** utazik. Ez a **fallback**
  (kulcs nélkül / offline / hiba esetén), és belépett usernél a hiányzó reviewelt
  kérdések **fel is töltődnek a közös Firestore-bankba** (önmagát seedeli).
- **Merítés (`quizBuildSet`):** review-szelet (előbb az **elrontott** kérdések SR-sora,
  majd korábbi olvasmányok) + mai szelet a mai fejezet(ek)ből. Ha kevés a kérdés
  (pl. rövid zsoltár), **előre/hátra** bővít a szomszédos fejezetekre — **ismétlés nélkül**.
- **Minőségi háló:** minden kérdésnél **⚑ Hibás kérdés** (→ `quizreports`, create-only,
  konzolos moderálás), és válasz után a **helyes megoldás + pontos igehely**, plusz
  **📖 Mutasd a kontextust** (ugrás az Olvasóban az adott fejezetre).
- **Ismétlés-tiltás + spaced repetition:** helyes válasz → `seen` (nem tér vissza);
  rossz válasz → `wrong` (a kérdés-snapshottal), és addig visszakerül, amíg meg nem
  tanulod. Minden per-user, a `users/{uid}` doksziban szinkronizál.
- **Beállítás a kvíz-kártyán:** hossz (5·10·15·20) és „ebből korábbi olvasmányból"
  (0·3·5); `review ≥ total` esetén `review` automatikusan `total-1`.

**Megjegyzés (offline bank Igaz/Hamis kérdései):** a bundle 2-opciós Igaz/Hamis kérdéseket
is tartalmaz. Ezeket megtartjuk (2 **vagy** 4 opció engedélyezett; a rules is), az
**újonnan generált** kérdés viszont mindig **4 opciós**.

## Átadott / módosított fájlok
- `index.html` — teljes (kvíz-modul, Ma-kártya, CSS, INFO+Súgó, Firebase-híd bővítés).
- `sw.js` — cache-verzió **v43**.
- `firestore.rules` — új `quizbank` (opts 2 vagy 4) + `quizreports` szabályok.
- `quiz-bank.json` — **ÚJ** statikus asset az app gyökerében (a reviewelt seed-bank).

## Élesítés (Dávid)
1. **`firestore.rules` Publish** a Firebase konzolban (Firestore → Rules → Publish).
   Enélkül a közös bank olvasása/írása tiltott (a kvíz ilyenkor csak a bundle-ből megy).
2. Töltsd fel a fenti fájlokat (a `quiz-bank.json`-t is a gyökérbe).
3. Az appban **frissíts kétszer** (vagy indítsd újra) — új sw-verzió (v43).
4. Belépve, Gemini-kulccsal: olvass egy fejezetet → **Mai kvíz** → generál + bankol →
   riport + felfedés. Másik eszközön / kijelentkezve ugyanaz a fejezet a közös bankból ad kvízt.

## Firestore-forgalom
Kis userbázisnál a Spark ingyenkeret bőven elég (napi 50k olvasás / 20k írás). A behúzott
fejezet-bankot a session memóriában cache-eljük (`_quizBank`), így nem olvas újra feleslegesen.

## Amit érdemes később (nyitott pontok)
- **Auto-elrejtés riportnál** (küszöb feletti riportszámnál kiesik a merítésből) — most
  konzolos moderálás.
- **Pótgenerálás offline** (`gen_quiz.py`) továbbra is bővítheti a `quiz-bank.json`-t;
  a bundle-ből belépéskor a közös bankba is átmegy.
