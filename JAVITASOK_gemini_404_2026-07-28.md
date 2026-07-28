# Gemini 404 — diagnosztika és önjavítás (2026-07-28)

**Verziók:** app `v29`, sw `v67`, CHANGELOG `v:17`

## A bejelentés
Egy felhasználónál a Gemini-kulcs 404-re fut — új kulccsal is.

## Mit talált a kód-átnézés
`geminiCall()` (index.html) eddig **eldobta a Google hibaválaszának törzsét**, és csak a
státuszkódot mutatta: `"<modell> nem elérhető (404)"`. A 404 viszont két, teljesen más
okot takarhat, és ezek szétválasztásához pont a válasz szövege kell:

| Google válasza | Valódi ok |
|---|---|
| `models/... is not found for API version v1beta, or is not supported for generateContent` | a **modell** nem érhető el ezzel a kulccsal |
| `Requested entity was not found.` | a **kulcs** nem létezik / törölt projekthez tartozik / nem AI Studio-kulcs |

Ráadásul a 403 (kikapcsolt Generative Language API, korlátozott kulcs) ugyanabba az ágba
esett, és a 400-as „User location is not supported” (VPN/ország) is csak egy sablonos
„Hibás kulcs vagy kérés (400)” üzenetet adott.

Két néma 404-forrás a bevitel oldaláról:
- a mobilon bemásolt kulcsba beszökő **szóköz/sortörés** (a kulcs elején-végén),
- a Modell mezőbe írt **`models/gemini-2.5-flash`** → az URL `.../models/models/...` lett.

## Mi változott

1. **Beszédes hibák.** Új `gExplain(status, data, model)`: a Google `error.status` +
   `error.message` mezőit magyar, cselekvésre fordított mondattá alakítja (érvénytelen kulcs /
   kikapcsolt API / korlátozott kulcs / nem támogatott régió / limit / modell nem elérhető),
   és zárójelben ott hagyja a nyers üzenetet is. A válasz törzsét mostantól `gFetchJson()`
   olvassa ki minden ágon.
2. **Önjavítás.** Ha a próbált modellek (mentett → `gemini-2.5-flash` → `-flash-lite`)
   mind 403/404-re futnak, az app egyszer lekérdezi a **ListModels**-t
   (`GET /v1beta/models?key=…`), és a kulcs által ténylegesen látott,
   `generateContent`-et támogató modellek közül választ (`gPickModel`). A bevált modellt
   `_gModelOk` megjegyzi a munkamenetre.
3. **Bevitel-tisztítás.** `gKeyClean()` (minden whitespace ki) és `gModelClean()`
   (`models/` előtag le) — mentéskor, betöltéskor és hívás előtt is.
4. **Fiók → AI rubrika → „🔍 Kulcs tesztelése” gomb.** Formátum-ellenőrzés →
   ListModels → szükség esetén modell-átállítás (el is mentve) → **éles próbakérés**.
   Az eredmény a gomb alatt, soronként, magyarul.

## Füstteszt (böngésző, python http.server)
- betöltés konzolhiba nélkül, `APP_VERSION=v29`
- `gModelClean("models/gemini-2.5-flash") → "gemini-2.5-flash"`, `gKeyClean(" AIza abc\n") → "AIzaabc"`
- `gPickModel(["models/x","gemini-2.5-pro","gemini-2.5-flash-lite","gemini-2.5-flash"]) → "gemini-2.5-flash"`
- `gExplain` mind az 5 tipikus hibaválaszra a helyes magyar mondatot adja
- **éles klikk** szemét kulccsal: `❌ A Gemini-kulcs érvénytelen … (API key not valid. Please pass a valid API key.) / Nyers hiba: HTTP 400 INVALID_ARGUMENT …` — a gomb visszaáll

## Az érintett felhasználó teendője
Frissítés után: **Fiók → AI rubrika → 🔍 Kulcs tesztelése**, és az ott megjelenő üzenet
megmondja, mi a baj. Deploy előtti gyorsteszt ugyanarra (a kulccsal a kezünkben):

```bash
curl -s "https://generativelanguage.googleapis.com/v1beta/models?key=AIza..."
```
