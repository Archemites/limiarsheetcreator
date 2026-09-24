# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

LIMIAR — character sheet creator ("Criador de Fichas") for the Brazilian tabletop RPG *LIMIAR* (Livro do Jogador, 1ª Edição Revisada) plus the expansion *Em um Passado Distante*. UI text, code identifiers and comments are in **Portuguese**; keep it that way. Retro IBM/EGA look with a CRT filter (never add a vignette/darkened edges).

Fully static site (no build, classic `<script>` tags, no modules/bundler), meant for GitHub Pages. Accounts and sheets live in **Supabase**, called directly from the browser.

## Commands

- Serve locally: `python -m http.server 8000` → http://localhost:8000 (needed for fetch of fonts in PDF export; `file://` falls back to Courier/Helvetica).
- Syntax check: `node --check js/<file>.js` (no linter, no test suite, no package.json at the root).
- Quick logic checks without a browser work by loading scripts in Node: `global.window = global; require('./js/data.js'); require('./js/rules.js'); ...` (data → dice → rules → ui/pdf). `ui.js` renders HTML strings, so `L.UI.view(app)` can be asserted on in Node. jsPDF can be loaded with `window.jspdf = require('./vendor/jspdf.umd.min.js')` to generate PDFs from Node.

## Pages

- `index.html` — login ("Lembrar de mim" → session in localStorage, else sessionStorage); auto-redirects to `app.html` if a session exists.
- `registrar.html` — signup with a fake captcha. Logins become fake emails `<login>@limiar.app` for Supabase Auth ("Confirm email" must be OFF in the Supabase project).
- `app.html` — the sheet editor; an inline script redirects to `index.html` when there is no `limiar.auth` session key.
- `supabase.sql` — schema to run once in the Supabase SQL Editor: `usuarios` (4-digit `numero` assigned by trigger on `auth.users` insert), `fichas` (JSON `ficha` + owner), RLS so each user only sees their own rows.

## Architecture (`js/`, global namespace `window.LIMIAR` a.k.a. `L`)

Script order in `app.html` matters: `data.js`, `dice.js`, `rules.js`, `ui.js`, `pdf.js`, `retrato.js`, `mapa.js`, `vendor/supabase.js`, `api.js`, `app.js`.

- `data.js` (`L.DATA`) — **all book content**: attributes, limbs, difficulty table, sanity bands, disorders, status, professions/classes (`bonus`, `equip`, `habilidades`), 5 Caminhos × 4 Trilhas × 8 Nós (`NOS` index), item catalog, rest/sleep, hunger (`FOME`, Passado only), rules compendium `REGRAS`/`REGRAS_PASSADO` (blocks typed `p|h|h3|ul|note|data…`), `LOGO.barras()` for the striped logo. Rule-text changes from new book PDFs go here.
- `dice.js` (`L.Dice`) — `roll("2d6+3", {max})`, `d20(mod, modo, alvo)`, `pct(chance)`.
- `rules.js` (`L.Rules`) — sheet model and pure rules: `novoPerito(modulo)`, `normalizar(raw)` (sanitizes any imported/remote JSON — add defaults/validation for new fields here), `derive(c)` → all computed values (`d.attr`, `d.sub`, `d.membros`, `d.sanidade`, penalties `d.pen`/`d.modTeste`, `d.avisos`, checklist), `aplicarOrigem`, `locaisPermitidos(item)` (armor only equipped; weapons only hands or bagagem), sanity damage / Corda da Loucura / level-up.
- `ui.js` (`L.UI`) — pure string templates: `T.<tab>` per tab (perito, atributos, origem, corpo, mente, equipamento, caminhos, revelacoes, regras), modals, HUD.
- `app.js` (`L.App`) — controller: state `App.c` (active sheet), `App.d` (derived), `App.ui` (non-persisted UI state), `App.store` (all sheets + prefs, cached in localStorage key `limiar.fichas.v1.u<id>`). Full re-render on each change with focus restoration. Event delegation via data attributes:
  - `data-act` (+ `data-a`/`data-b`) → functions in the `A` object;
  - `data-bind="path"` edits the sheet (`itens#<id>.nome` addresses array items by id; `data-t="int|intn|bool"`);
  - `data-ui` → `App.ui`; `data-pref` → prefs; `data-chg` → select handlers in `CHG`.
  - Any sheet change calls `mudou()` → debounced local save → `sincronizar()` pushes changed sheets (tracked by `atualizadoEm`) to Supabase and deletes removed ones.
- `api.js` (`L.API`) — Supabase client (URL + publishable key are intentionally public; security is RLS). Same interface the app uses: `login/registrar/logout/me/listar/salvar/excluir/sessao/limpar`; errors carry `.status` (0 offline, 401 session).
- `pdf.js` (`L.PDF`) — jsPDF export drawn in mm with a flow engine (`ensure(h)` opens a new page with background+header). Themes `escuro`/`claro`, A4/Letter, blank sheet (`branco`). Only Latin-1 text (use `S()`); fonts VT323 + IBM Plex Mono loaded from `assets/fonts`. `embutir(pdf, json)` appends a ZIP containing `ficha.json` after the PDF bytes (PDF stays readable); `extrair()` reads it back for "Importar PDF".
- `retrato.js` (`L.Retrato`) — portrait stored tiny: 64×80, ANSI32 palette, Bayer dither, hand-built indexed PNG (~1–4 KB). Optional EGA filter (32×40, 16 colors) is display-only. Displayed/exported upscaled without smoothing.
- `mapa.js` (`L.Mapa`) — 10th tab (Alt+0): infinite pixel grid, 16 EGA colors, pencil/eraser/bucket/eyedropper/pan, undo/redo, zoom/pan by mouse and touch. Kept in 64×64 chunks; on each stroke it serializes to `c.mapa = { x, y, m: [[0,3,3], …] }` (0 = empty, 1–16 = colors; x/y = top-left of the drawn area, drawn area capped at 512×512) and calls `App.mudou()`. `app.js` calls `L.Mapa.montar(#mapa-root, App)` after every render; the same `<canvas>` is re-parented, and it reloads only when `App.c` or `App.c.mapa` identity changed.
- `auth.js` — login/register page logic.

## Conventions / gotchas

- `modulo` field: `'base'` or `'passado'`; the sheet keeps `profissao` and `classe` separately. Choosing one is mandatory (no "nenhuma").
- `null` in `c.vida[m]`, `c.sanidade`, `c.folego` means "full / follows the max".
- Initial rolls (money, starting sanity, per-level vida/san) can be rolled only once; buttons hide and actions guard on non-null.
- The item catalog shown in Equipamento is per-sheet (`c.catalogo`), starting empty; `D.CATALOGO` is still used for starting equipment rules.
- Adopted rule interpretations (ambiguous in the book): level/rest HP gains apply to every limb; magic/ritual/Corte Z sanity costs don't count toward Conhecimento; Defesa = 2d4 × creation VIGOR (min 0).
- `CONTINUAR.md` is an older hand-off log from earlier sessions.
