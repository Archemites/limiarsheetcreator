# LIMIAR — Criador de Fichas

Criador de fichas de Perito para **LIMIAR — Livro do Jogador (1ª Edição)**, com a extensão
**Em um Passado Distante** (nela, as Classes substituem as Profissões).

- Ficha completa: atributos, sub-atributos, corpo por membro, Defesa, Fôlego, Sanidade e faixas,
  distúrbios, status, níveis, os 5 Caminhos (160 Nós), palavras, magias, rituais, inventário e catálogo de itens.
- Rolador de dados com os modificadores da ficha, Corda da Loucura, ganho de nível e Conhecimento automáticos.
- Várias fichas salvas no navegador, importação e exportação em JSON.
- Exportação em PDF (tema escuro ou claro, A4 ou Carta, ou ficha em branco para imprimir).
- Visual retrô IBM/EGA com filtro CRT (liga e desliga no rodapé; respeita "reduzir movimento").

As fichas ficam na sua conta (Supabase), com uma cópia no navegador para uso offline.

## Contas e fichas na nuvem (Supabase)

O site começa numa tela de login (`index.html`, cadastro em `registrar.html`) e guarda as fichas
de cada usuário no Supabase, direto do navegador. Tudo continua estático (GitHub Pages).

- Configuração em `js/api.js` (URL do projeto + chave *publishable*, que é pública por design).
- Tabelas e regras: rode `supabase.sql` uma vez no **SQL Editor** do Supabase.
- Em **Authentication → Email**, deixe **"Confirm email" desligado** (o login vira um e-mail fictício `login@limiar.app`).
- Cada usuário recebe um número de 4 dígitos; as regras (RLS) garantem que cada um só vê as próprias fichas.

## Rodar localmente
É um site estático, sem build. Abra `index.html` direto no navegador ou, para o PDF sair com as
fontes retrô (VT323 e IBM Plex Mono), sirva a pasta:

```sh
python -m http.server 8000
```

e acesse <http://localhost:8000>. Aberto via `file://`, o PDF usa as fontes padrão (Courier/Helvetica).

## Publicar no GitHub Pages

1. Crie um repositório e envie os arquivos desta pasta (o arquivo vazio `.nojekyll` precisa ir junto).
2. No GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch**,
   branch `main`, pasta `/ (root)`.
3. Em alguns minutos o site fica em `https://<usuário>.github.io/<repositório>/`.

> **Atenção:** os PDFs do livro (`LIMIAR - PRIMEIRA EDIÇÃO.pdf` e `LIMIAR - Passado Distante (2).pdf`)
> estão nesta pasta só como referência. Se forem enviados ao repositório, **ficam públicos** junto
> com o site. Se não quiser isso, deixe-os de fora (por exemplo, com um `.gitignore` contendo `*.pdf`).

## Atalhos

| Tecla | Ação |
|---|---|
| `Alt + 1…9` | Troca de aba |
| `Ctrl + S` | Salva (também salva sozinho) |
| `Ctrl + P` | Exportar PDF |
| `Esc` | Fecha janelas |

## Estrutura

| Arquivo | Conteúdo |
|---|---|
| `index.html` | Página única |
| `css/style.css` | Tema, filtro CRT e layout responsivo |
| `js/data.js` | Todo o conteúdo do livro e da extensão |
| `js/dice.js` | Rolagens (`2d6+3`, vantagem, `d%`) |
| `js/rules.js` | Modelo da ficha e regras calculadas |
| `js/ui.js` | Renderização das abas e janelas |
| `js/pdf.js` | Geração do PDF |
| `js/app.js` | Controlador: estado, eventos, salvamento |
| `vendor/jspdf.umd.min.js` | [jsPDF](https://github.com/parallax/jsPDF) 4.2.1 (MIT) |
| `assets/fonts/` | VT323 e IBM Plex Mono (SIL Open Font License) |

## Créditos

LIMIAR é de seus respectivos autores; este criador de fichas é um projeto de fã, sem fins lucrativos.
Fontes: VT323 (Peter Hull) e IBM Plex Mono (IBM), ambas sob a SIL Open Font License 1.1.
