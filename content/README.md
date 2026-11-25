# Como editar o conteúdo do site

Todo o conteúdo do site fica nesta pasta, em arquivos **Markdown (`.md`)**. Cada arquivo tem
um **cabeçalho** entre duas linhas `---` (os dados: título, data, autor…) e, abaixo dele, o
**texto** em Markdown.

Depois de salvar, gere o site com `python build.py` — ou deixe `python build.py --serve`
rodando: ele atualiza o site sozinho a cada arquivo salvo (veja o `README.md` na raiz).

> Se algo estiver errado (um campo obrigatório faltando, um autor que não existe, um link do
> YouTube irreconhecível), o build para e diz **qual arquivo** e **o que corrigir**.

```
content/
├── blog/            ← uma pasta por ano e, dentro dela, uma pasta por publicação
│   └── 2026/
│       └── titulo-curto/
│           ├── index.md    ← o texto
│           └── capa.jpg    ← imagens do texto, na mesma pasta
├── autores/         ← um arquivo por autor (vira a página de perfil)
├── cursos/          ← um arquivo por curso pago; uma pasta por curso aberto
│   └── analise-de-dados-em-python/
│       ├── curso.md
│       └── aulas/   ← um arquivo por aula
└── publicidade.md   ← vitrine de publicidade
```

---

## 1. Publicar no blog

Crie a pasta `content/blog/AAAA/titulo-curto/` e, dentro dela, o arquivo `index.md`. O nome da
pasta vira o endereço da página: `/blog/titulo-curto/` (o ano é só organização e **não** entra no
endereço). Coloque as imagens do texto na mesma pasta.

```markdown
---
title: "Título do texto"
date: 2026-10-20
author: kizzy-terra              # nome do arquivo em content/autores/ (sem .md)
description: "Linha fina: uma ou duas frases que aparecem abaixo do título e nas listas."
chapeu: "Carreira"               # opcional — o rótulo acima do título
cover: capa.jpg                  # opcional — imagem de capa (arquivo na pasta do texto)
tags: [carreira, dados]          # opcional
draft: true                      # opcional — enquanto estiver true, o texto não é publicado
---
Primeiro parágrafo do texto.

## Um intertítulo

Texto com **negrito**, *itálico* e [um link](https://exemplo.com).

![Descrição da imagem](grafico.png)

https://www.youtube.com/watch?v=XXXXXXXXXXX
```

- **Vídeo do YouTube:** cole o link **sozinho numa linha** — ele vira um player.
- **Imagens:** coloque os arquivos na pasta do texto e use só o nome (`![…](grafico.png)`).
  Se o arquivo não existir, o build avisa. Outros arquivos (PDF, notebook…) funcionam igual.
- **Rascunhos:** além de `draft: true`, uma pasta começando com `_` (`_ideia-nova/`) fica de fora.
- **Produto com link de afiliado:** veja a seção abaixo.
- **Código:** use três crases (```` ```python ````) antes e depois do bloco.
- Os nomes **Kizzy Terra**, **Hallison Paz** e **Programação Dinâmica** são destacados
  automaticamente apenas nas notícias da imprensa, não nos textos do blog.

### Produtos indicados (links de afiliado da Amazon)

Cadastre o produto uma vez em `data/produtos.yml` (o arquivo explica cada campo):

```yaml
livro-entendendo-algoritmos:
  title: "Entendendo Algoritmos — Aditya Bhargava"
  link: https://amzn.to/XXXXXXX            # link de afiliado (SiteStripe)
  image: /assets/img/produtos/entendendo-algoritmos.jpg
  description: "O livro que a gente indica para quem quer aprender algoritmos sem sofrimento."
```

E, no texto, coloque o marcador **sozinho numa linha**, onde o card deve aparecer:

```markdown
[[produto: livro-entendendo-algoritmos]]               ← card compacto (ex.: no fim do texto)
[[produto: livro-entendendo-algoritmos | destaque]]    ← card grande, para textos sobre o produto
```

Sem foto própria? Use `kind: livro` (ou `filme`, `jogo`, `eletronico`, `produto`) e o card mostra um ícone do tipo no lugar da imagem.

O mesmo produto pode aparecer em vários textos. O build cuida das boas práticas sozinho: os links
saem com `rel="sponsored nofollow"` (o que o Google pede para links pagos/de afiliado), o card
mostra o selo **Link de afiliado · Amazon** e o fim do texto ganha o aviso *"Como Associado da
Amazon, o Programação Dinâmica recebe por compras qualificadas"*. Não coloque preço no card.

## 2. Perfil de autor (página profissional)

Cada arquivo em `content/autores/` gera `/autores/<nome-do-arquivo>/`. O texto abaixo do
cabeçalho é a biografia. Campos do cabeçalho:

| Campo        | Para quê                                                        |
|--------------|-----------------------------------------------------------------|
| `name`, `role` | Nome e cargo (obrigatórios)                                   |
| `tagline`    | Frase de apresentação no topo do perfil                         |
| `photo`      | Foto (`/assets/img/…`)                                          |
| `links`      | Lista de `{ label, url }` — LinkedIn, Instagram…                |
| `stats`      | Até 3 destaques `{ value, label }`                              |
| `expertise`  | Áreas de atuação (lista)                                        |
| `experience` | Lista de `{ role, org, period, text }` (`period` e `text` opcionais) |
| `education`  | Lista de `{ degree, school, status }`                           |
| `awards`     | Reconhecimentos (lista)                                         |

Os **textos**, **cursos**, **palestras** e **menções na imprensa** do autor aparecem no perfil
automaticamente.

## 3. Cursos

### Curso pago (página de vendas)

Um arquivo `content/cursos/<nome>.md`. Os campos mais usados:

```yaml
title: Nome do curso
order: 1                     # posição na lista de cursos
type: pago                   # pago | gratuito | membros
badge: Mais popular          # selo na capa (opcional)
cover: /assets/img/capa.jpg
summary: Frase curta do card na home.
price_label: R$ 249
instructors: [hallison-paz]
checkout: https://link-do-checkout
cta: Texto do botão de compra
headline: Título grande da página
subheadline: Frase de apoio
perks: [Garantia de 7 dias, Certificado]
```

Seções opcionais (aparecem só se existirem): `stats`, `pains`, `pillars`, `audience`,
`modules`, `includes`, `careers`, `instructor_message`, `pricing`, `faq`. Use
`content/cursos/python-do-jeito-certo.md` como modelo completo.

### Curso aberto (sala de estudo)

Uma **pasta** `content/cursos/<nome>/` com:

- `curso.md` — a página do curso (mesmos campos acima, com `type: gratuito`);
- `aulas/` — **um arquivo por aula**. A ordem segue o nome do arquivo (`01-…`, `02-…`).

```markdown
---
title: "Título da aula"
video: https://www.youtube.com/watch?v=XXXXXXXXXXX
module: "Nome do módulo"     # aulas seguidas com o mesmo módulo ficam agrupadas
duration: "12:30"            # opcional
---
## Sobre esta aula

Resumo, explicações, trechos de código…

## Material de apoio

- [Notebook da aula](https://github.com/…)
- [Dataset](https://…)
```

O corpo do arquivo vira a aba **Material da aula**, logo abaixo do vídeo.

## 4. Vitrine de publicidade

Em `content/publicidade.md`, adicione uma linha por publi em cada rede:

```yaml
youtube:
  - { url: "https://www.youtube.com/watch?v=XXXXXXXXXXX", brand: "Marca", title: "Ação" }
instagram:
  - { url: "https://www.instagram.com/reel/XXXXXXXXX/", brand: "Marca" }
linkedin:
  - { url: "https://www.linkedin.com/feed/update/urn:li:activity:0000000000000000000/", brand: "Marca" }
```

Cada rede vira um carrossel com o conteúdo incorporado. Redes sem links não aparecem.

## 5. Outros dados (`data/`)

| Arquivo              | Conteúdo                                              |
|----------------------|-------------------------------------------------------|
| `data/site.yml`      | Menu, e-mail de contato, links gerais                 |
| `data/imprensa.yml`  | Menções na imprensa (da mais recente para a mais antiga) |
| `data/palestras.yml` | Palestras oferecidas                                  |
| `data/marcas.yml`    | Marcas com que já trabalhamos                         |
