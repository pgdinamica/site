# Programação Dinâmica — Site

Site do **Programação Dinâmica** (@pgdinamica): educação em programação, ciência de dados e
inteligência artificial — com blog, páginas de autores, páginas de venda dos cursos, sala de
estudo para os cursos abertos, palestras, vitrine de publicidade e imprensa.

O conteúdo é escrito em **Markdown** e o site é gerado por um script Python (`build.py`).
O resultado é um site estático em `_site/`, que pode ser hospedado em qualquer lugar.

**Para editar conteúdo, veja [`content/README.md`](content/README.md).**

## Começando

Requer Python 3.10+.

```bash
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
```

### Rodar localmente

```bash
.venv/bin/python build.py --serve
```

Abra <http://localhost:8000>. A cada arquivo salvo em `content/`, `data/`, `templates/` ou
`assets/`, o site é gerado de novo (basta recarregar a página). Alterações no próprio
`build.py` exigem reiniciar o comando.

### Só gerar o site

```bash
.venv/bin/python build.py
```

## Estrutura

```
content/       Conteúdo em Markdown: blog, autores, cursos (e aulas), publicidade
data/          Dados em YAML: menu e contato, imprensa, palestras, marcas
templates/     Layout das páginas (Jinja2) — header e footer são compartilhados
assets/        CSS, JavaScript, imagens (assets/blog/ guarda as imagens dos posts)
build.py       Gerador do site
_site/         Site gerado (não versionado)
```

### Páginas geradas

| Endereço                         | Origem                                      |
|----------------------------------|---------------------------------------------|
| `/`                              | `templates/home.html`                       |
| `/blog/` e `/blog/<texto>/`      | `content/blog/*.md`                         |
| `/autores/<nome>/`               | `content/autores/*.md`                      |
| `/cursos/<curso>/`               | `content/cursos/*.md` ou `*/curso.md`       |
| `/cursos/<curso>/aulas/<aula>/`  | `content/cursos/<curso>/aulas/*.md`         |
| `/palestras/`                    | `data/palestras.yml`                        |
| `/publicidade/`                  | `content/publicidade.md`                    |
| `/imprensa/`                     | `data/imprensa.yml`                         |
| `/blog/feed.xml`, `/sitemap.xml` | gerados automaticamente                     |

## Publicar

Qualquer hospedagem de site estático que rode um comando de build serve — por exemplo
**Netlify**, **Cloudflare Pages** ou **GitHub Pages** (este último exige repositório público
no plano gratuito). Configuração:

- **Comando de build:** `pip install -r requirements.txt && python build.py`
- **Pasta publicada:** `_site`

## Design system (resumo)

- **Cores:** ink navy `#0a1120` · emerald `#10b981` (marca) · gold `#f5c518` (destaque)
- **Tipografia:** Space Grotesk (títulos) · Inter (texto) · JetBrains Mono (código)
  · no blog e nos perfis, Newsreader (texto editorial) e Barlow Condensed (chapéus e datas)
- **Acessibilidade:** HTML semântico, skip link, foco visível, `prefers-reduced-motion`,
  contraste AA, navegação por teclado, `alt` em todas as imagens.
