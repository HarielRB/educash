# EduCash

Site institucional da EduCash, ONG fictícia de educação financeira, implementado como uma Single Page Application (SPA) em HTML5, CSS3 e JavaScript puro (ES Modules) — sem frameworks, sem build tools, sem dependências de terceiros.

## Sobre o projeto

O EduCash apresenta a organização, seus projetos (em andamento e em planejamento) e um formulário de cadastro de voluntários, com validação de campos, modal de confirmação, notificações e histórico de envios persistido localmente. A navegação entre as três telas (Início, Projetos, Cadastro) acontece sem recarregar a página, via roteamento por hash.

## Tecnologias utilizadas

- **HTML5 semântico** — sem `class`/`id` como âncora de estilo; seletores de elemento, atributo e `:has()` no CSS.
- **CSS3** — variáveis nativas (Design System), Grid de 12 colunas, Flexbox, `@media` (mobile-first).
- **JavaScript (ES Modules)** — `import`/`export` nativos do navegador, sem bundler:
  - `js/app.js` — roteador SPA baseado em hash.
  - `js/dados.js` — fonte de dados dos projetos.
  - `js/templates.js` — geração de cartões via Template Literals.
  - `js/validacao.js` — verificação de consistência do formulário (Constraint Validation API).
  - `js/armazenamento.js` — persistência do histórico de cadastros via `localStorage`.
  - `js/feedback.js` — orquestração de modal, toast e contador de caracteres.
  - `js/mascaras.js` — máscaras de CPF, telefone e CEP.

Nenhuma biblioteca externa (nem CDN, nem NPM) é usada — decisão consciente para manter o projeto 100% Vanilla JS.

## Pré-requisitos

- Um navegador atualizado (Chrome, Firefox ou Edge recentes).
- Um servidor local qualquer. **Obrigatório**: o roteador usa `fetch()` para buscar os fragmentos HTML e os scripts são ES Modules — nenhum dos dois funciona abrindo o `index.html` direto pelo navegador (`file://`).
  - Extensão "Live Server" do VS Code, **ou**
  - `python -m http.server`, **ou**
  - `npx serve`.

Não há dependências para instalar — não existe `package.json` nem `npm install` neste projeto.

## Como executar localmente

```bash
git clone <url-do-repositorio>
cd educash
# com a extensão Live Server: botão direito em index.html → "Open with Live Server"
# ou, sem VS Code:
python -m http.server 8080
# depois abra http://localhost:8080 no navegador
```

## Build

Não há etapa de build. Os arquivos são servidos como estão — não há transpilação, minificação ou empacotamento.

## Testes

Não há suíte de testes automatizados neste projeto. A validação foi feita manualmente, com o DevTools do navegador (Console, Network com *throttling*, e o painel de Acessibilidade), documentada na seção de bugs abaixo.

## Estrutura de pastas

```
index.html          shell da SPA (cabeçalho, nav, rodapé fixos)
css/estilo.css       Design System, grid, componentes
html/                fragmentos injetados dinamicamente (inicio, projetos, cadastro)
imagens/             fotos e logo
js/                  módulos ES6 (ver lista acima)
```

## Changelog

- **v1.0.0** — primeira versão publicável: SPA modular, templates dinâmicos, validação de formulário, persistência em `localStorage`.
- **v1.0.1** — corrige condição de corrida entre requisições `fetch()` na navegação rápida entre rotas, `aria-expanded` do menu não sincronizado no fechamento programático, e posicionamento da mensagem de erro do grupo de rádio.
