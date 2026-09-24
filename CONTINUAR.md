# LIMIAR — Criador de Fichas · instruções para continuar

## Pedido original (do usuário)
> Cria um app js html para github pages, com base nos dois pdfs, sendo que o "passado distante" é uma extensão, ou seja tem um criador de fichas com tudo, literalmente tudo, do pdf primeira edição e num drop aperta pra selecionar a extensão, onde nessa em específico as classes substituem as profissões, faça com que eu possa exportar para pdf e que todo o site tenha um visual meio retrô ibm antigo mas colorido e bonito com filtro de crt e sem Vignette

PDFs na pasta: `LIMIAR - PRIMEIRA EDIÇÃO.pdf` (59 págs) e `LIMIAR - Passado Distante (2).pdf` (4 págs).
**Todo o conteúdo dos PDFs já foi transcrito para `js/data.js`** — não precisa reler os PDFs.

## Decisões já tomadas
- Site estático, sem build, scripts clássicos (funciona em GitHub Pages; `file://` também, exceto fontes do PDF).
- Namespace global `window.LIMIAR` (`L.DATA`, `L.Dice`, `L.Rules`, `L.UI`, `L.App`, `L.PDF`).
- Fontes locais: VT323 (UI/pixel) + IBM Plex Mono (texto). jsPDF 4.2.1 vendorizado. Testado: jsPDF embute VT323/Plex com acentos OK.
- Extensão = campo `modulo` da ficha (`'base'` | `'passado'`). Ficha guarda `profissao` e `classe` separados; seletor `#modulo` no topo troca.
- Cores: VIGOR vermelho, ACUIDADE verde, PSICOMETRIA azul, ESOTERISMO magenta, RAZÃO âmbar (iguais ao livro). Caminho Real = amarelo, Ancião = violeta.
- CRT: scanlines + máscara RGB + ruído + flicker + barra rolando. **Sem vignette** (nunca usar radial-gradient escurecendo bordas). Toggle no rodapé/menu. Respeita `prefers-reduced-motion`.
- Logo "LIMIAR" em barras horizontais estilo logotipo IBM, arco-íris EGA (`D.LOGO.barras()` serve para SVG e PDF).
- Regras ambíguas (interpretações adotadas):
  - Bônus "PSICOMETRIA(Inteligência)" vai só no sub-atributo (`bonus.INT/SAP`).
  - Couro Endurecido +3 e ganhos de Vida por nível somam em **todos** os membros.
  - Ganho de nível tem modo por linha: "+ Máximo" (padrão) ou "Recupera".
  - Nível começa em 0; Traços = nível; Revelação = min(65, 25 + 5×nós).
  - Custos de magia não contam para Conhecimento (rituais também não, pelo livro).
  - Defesa = 2d4 × VIGOR de criação (base+profissão), mínimo 0.

## Arquivos PRONTOS
| Arquivo | Conteúdo |
|---|---|
| `js/data.js` | Tudo do livro: atributos, sub-atributos, membros, tabela DF, faixas de sanidade, distúrbios, 17 status, 32 profissões, 5 classes + habilidades, contexto do Passado Distante, 5 Caminhos × 4 Trilhas × 8 Nós (160, texto conferido nas imagens), catálogo de itens (medicinais, psicoativos, armas CaC/distância, capacete exemplo), locais/limites do inventário, compêndio `REGRAS` + `REGRAS_PASSADO`, `tempoRitual`, `LOGO` |
| `js/dice.js` | `roll("2d6+3", {max, onesTo})`, suporta `kh/kl`, `d%`; `d20(mod, modo, alvo)`; `pct(chance)`; `maxOf/minOf` |
| `js/rules.js` | `novoPerito`, `normalizar`, `aplicarOrigem` (troca equipamento inicial), `itemDoCatalogo`, `avaliarInventario`, `derive(c)` (todos os derivados + avisos + checklist A–E), `statusNo`, `registrarNivel/removerNivel`, `sofrerDanoSanidade` (Insano 2x, Corda da Loucura em 0, Conhecimento→nível), `recuperarSanidade`, `fimDeCombate`, `custoMagia`, `ritualInfo` |
| `css/style.css` | Tema completo + CRT + responsivo |
| `js/ui.js` | Render (strings HTML): HUD, abas, 10 abas (perito, atributos, origem, corpo, mente, equipamento, caminhos, revelacoes, dados, regras), modais (fichas, nova, pdf, avisos, menu, confirm, corda, nivel, usarVida, conjurar), `logoSVG`, `bootText` |
| `js/app.js` | Controlador: localStorage (`limiar.fichas.v1`, várias fichas + prefs), render com restauração de foco, delegação de eventos (`data-act`, `data-bind`, `data-ui`, `data-pref`, `data-chg`), todas as ações, toasts com "Desfazer", fila de modais, import/export JSON, retrato 4:5 com filtro EGA (dither Bayer), boot estilo BIOS, atalhos (Alt+1..0, Ctrl+S, Ctrl+P, Esc) |
| `vendor/jspdf.umd.min.js` | jsPDF 4.2.1 (MIT) |
| `assets/fonts/` | VT323-Regular.ttf, IBMPlexMono-Regular/Bold/Italic.ttf + licenças OFL |

### Convenções de binding (ui.js ↔ app.js)
- `data-bind="caminho.no.objeto"`; item de array por id: `itens#<id>.nome`; índice: `niveis.0.vida`.
- `data-t="int"` / `"intn"` (nulo quando vazio) / `"bool"`. Inputs numéricos são `type="text" inputmode="numeric"` (para restaurar cursor).
- `data-ui="chave"` = estado de UI (não salvo). `data-pref` = preferências. `data-chg` = ação em `change` de select.
- `data-act` + `data-a`/`data-b` = ações em `A` (app.js). `data-fk` = chave para restaurar foco.
- `null` em `c.vida[m]`, `c.sanidade`, `c.folego` = "cheio / acompanha o máximo".

## ATUALIZAÇÃO (sessão 2)
- ✅ `index.html` CRIADO (estrutura abaixo já implementada — item 1 concluído).
- ✅ Correções de segurança do item 3 APLICADAS (validação do retrato em `normalizar` e `esc()` no `<img src>`).
- `node --check` passou em todos os js.
- **Próximo passo: criar `js/pdf.js` (item 2)**, depois item 4 (README + .nojekyll) e item 5 (testes). O site ainda não abre sem erro porque `index.html` carrega `js/pdf.js`, que ainda não existe.

## ATUALIZAÇÃO (sessão 3)
- ✅ `js/pdf.js` CRIADO e testado via harness Node (escuro/claro, A4/Carta, em branco, com e sem fontes). Partes: ficha (identidade+retrato, atributos, recursos, corpo com boneco, mente, progressão), equipamento+habilidades, mapa dos 5 Caminhos + nós adquiridos, revelações, história, referência rápida (sempre em página nova).
- ✅ `README.md` e `.nojekyll` CRIADOS.
- ✅ Item 5 (testes) FEITO: `node --check` ok; teste ponta a ponta em Chrome headless via DevTools Protocol (a extensão claude-in-chrome não estava conectada) — 43/43 passos, zero erros de console: todas as abas, extensão Profissão→Classe e volta, rolagens, nível, Conhecimento 100%, Corda da Loucura, Nós, inventário/uso/dano/desfazer, magias/rituais, modais (fichas/nova/duplicar/excluir), atalhos (Alt+2, Ctrl+P, Esc, Ctrl+S), CRT, retrato EGA, export/import JSON (inclusive inválido e com HTML malicioso), PDF escuro/claro/branco pelos botões (fontes retrô OK), mobile 375px sem rolagem horizontal, persistência após recarregar.
- **Falta só o item 6** (opcional: `git init` + commit, sem push) e decidir com o usuário se os PDFs do livro entram no repositório.

## FALTA FAZER (em ordem)
1. ~~**`index.html`**~~ (FEITO) — estrutura esperada pelo app.js:
   - `<html lang="pt-BR">` (classes `crt-on/crt-off` e `data-mod` vão no `<html>`), meta viewport, `<title>`, favicon SVG data-URI, `<link rel="stylesheet" href="css/style.css">`.
   - `<div id="boot" hidden><pre></pre></div>`
   - `<div class="screen" id="screen">` com: `<header class="topbar">` → `.brand` (`<h1 class="logo"><span id="logo"></span></h1>` e `<p class="brand-sub" id="brand-sub">`), `.top-controls` com `<label class="ext"><span class="ext-l">EXTENSÃO</span><select id="modulo"></select></label>` e botões `.btn` com `data-act="fichas" | "nova" | "pdf-modal" (btn-pri) | "menu"`; depois `<section class="hud" id="hud">`, `<nav class="tabs" id="tabs" role="tablist">`, `<main id="view" tabindex="-1">`.
   - `<footer class="statusbar">`: `<span class="fk"><b>ALT+1..0</b>ABAS</span>`, `<span class="fk hide-s"><b>CTRL+S</b>SALVAR</span>`, `<span class="fk hide-s"><b>CTRL+P</b>PDF</span>`, `<span class="sp"></span>`, `<span id="st-save">`, `<button type="button" id="st-crt" data-act="toggle-crt">`, `<span id="st-clock">`.
   - Fora do screen: `<div class="crt-overlay" aria-hidden="true"><div class="crt-roll"></div></div>`, `<div id="modal-root"></div>`, `<div id="toast-root" class="toasts" aria-live="polite"></div>`, `<input type="file" id="file-import" accept=".json,application/json" hidden>`, `<input type="file" id="file-retrato" accept="image/*" hidden>`.
   - Scripts nesta ordem: data.js, dice.js, rules.js, ui.js, pdf.js, app.js.
2. **`js/pdf.js`** — ainda não existe. API usada pelo app.js:
   - `L.PDF.carregar()` → Promise: carrega `vendor/jspdf.umd.min.js` se `window.jspdf` não existe; faz `fetch` dos TTF em `assets/fonts/` → base64 (em pedaços) → guarda em `L.PDF.fontes`; se falhar (file://), usa Courier/Helvetica e `L.PDF.fontesOk = false`.
   - `L.PDF.gerar(c, d, {tema:'escuro'|'claro', papel:'a4'|'letter', partes:{ficha,equip,caminhos,revel,historia,ref}, retrato: dataURL|null, branco:bool})` → retorna o `jsPDF` (app chama `.save(nome)` ou `.output('bloburl')`).
   - Registrar fontes: `doc.addFileToVFS('VT323.ttf', b64); doc.addFont('VT323.ttf','VT323','normal')` (idem Plex regular/bold/italic).
   - Layout planejado (motor de fluxo com `ensure(h)` → nova página com fundo, cabeçalho com logo em barras + "FICHA DE PERITO" + módulo, rodapé com nome/página):
     - Pág. 1: identidade (nome grande, jogador, idade, origem, profissão/classe, nível, conhecimento) + caixa do retrato; 5 caixas de atributo coloridas (valor grande + "cri/nív/prof", Int/Sap dentro da PSICOMETRIA); recursos (Sanidade atual/máx, Fôlego, Defesa, Iniciativa, Traços, Revelação %, Dinheiro); corpo (boneco com retângulos + tabela Membro/Vida/Armadura/RD/Def%); status ativos, distúrbios, faixa de sanidade.
     - Equipamento (mãos, armaduras por parte, acesso rápido, acessórios, bagagem, patrimônio, armas com dano/tiros) + habilidades da profissão/classe.
     - Nós adquiridos por Caminho/Trilha com descrição.
     - Revelações: palavras (tabela), magias, rituais.
     - História, aparência, notas.
     - Referência rápida: tabela DF, faixas de sanidade, status, ações de combate, regras de fôlego.
   - Tema escuro: fundo #07080f, texto #ebe8da, cores dos atributos. Tema claro: fundo branco, cores mais escuras (VIG #d0142c, ACU #0f9d58, PSI #1f5fe0, ESO #b01ec8, RAZ #d97b00, azul IBM #1f3fd1).
   - `branco:true` → campos vazios com linhas para escrever à mão.
   - Usar `doc.splitTextToSize` para quebrar texto; evitar caracteres fora do Latin-1 (sem ✓, ☠, box-drawing) no PDF.
   - Teste sem navegador: harness Node (`global.window = global`, `require` dos js, `require('./vendor/jspdf.umd.min.js')` devolve `{jsPDF}`), salvar PDF e renderizar páginas com pypdfium2 (instalado em `%TEMP%\claude\...\scratchpad\pylib`, usar `PYTHONPATH`) para conferir visualmente.
3. ~~**Correções pendentes já identificadas**~~ (FEITO):
   - `rules.js › normalizar`: se `c.retrato` não casar com `/^data:image\/(png|jpe?g|webp|gif);base64,/`, zerar para `null` (segurança em JSON importado).
   - `ui.js › T.perito`: usar `src="${esc(ret)}"` no `<img>`.
4. **`README.md`** (como publicar: repositório → Settings → Pages → branch main / root; tudo roda local; aviso de que os PDFs do livro na pasta seriam publicados se commitados — perguntar ao usuário) e arquivo vazio **`.nojekyll`**.
5. **Testar**: `node --check js/*.js`; servidor local `python -m http.server 8000` na pasta e abrir `http://localhost:8000` no Chrome (extensão claude-in-chrome): conferir console sem erros, todas as abas, troca de extensão (Profissão→Classe), rolagens, subir de nível, Corda da Loucura, inventário/catálogo, nós, magias/rituais, import/export JSON, exportação PDF (escuro, claro, em branco), mobile (largura ~375px sem rolagem horizontal).
6. (Opcional) oferecer `git init` + commit; **não** fazer push sem o usuário pedir.

## Como retomar com o Claude
Abra o Claude Code nesta pasta e diga: **"Leia CONTINUAR.md e continue de onde parou."**
