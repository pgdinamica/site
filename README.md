# Programação Dinâmica — Site

Site institucional do canal **Programação Dinâmica** (@pgdinamica): educação em
programação, ciência de dados e inteligência artificial.

Site estático, sem build. HTML + CSS + JS puro, sem dependências externas além das
fontes do Google Fonts (Space Grotesk / Inter).

## Estrutura

```
index.html            Página única com todas as seções
assets/
  css/styles.css      Design system completo (cores, tipografia, componentes)
  js/main.js          Menu mobile, header fixo, reveal ao rolar, contadores, nav ativa
  img/                Fotos, capas de curso, thumbnails de vídeo
    logo.svg          Marca oficial (monograma teal + sombra navy)
    videos/           Thumbnails dos vídeos do YouTube
```

## Rodar localmente

```bash
python3 -m http.server 8000
```

Depois abra <http://localhost:8000>.

## Publicar

É um site estático — basta subir a pasta inteira para qualquer hospedagem
(Netlify, Vercel, GitHub Pages, Cloudflare Pages, ou o próprio HostGator).

## Design system (resumo)

- **Cores:** ink navy `#0a1120` · emerald `#10b981` (marca) · gold `#f5c518` (destaque)
- **Tipografia:** Space Grotesk (títulos) · Inter (texto)
- **Acessibilidade:** HTML semântico, skip link, foco visível, `prefers-reduced-motion`,
  contraste AA, navegação por teclado, `alt` em todas as imagens.

## Manutenção rápida

- **Números do canal:** editar `data-count` nas `.stat` do hero em `index.html`.
- **Novos vídeos:** trocar as thumbs em `assets/img/videos/` e os links `youtu.be/...`.
- **Cursos:** editar os `<article class="course-card">` na seção `#cursos`.
- **Marcas/clientes:** o carrossel é textual — editar os `<span class="brand-chip">` na
  seção `.brands`. Cada linha tem duas faixas idênticas (a segunda com `aria-hidden`);
  ao adicionar/remover uma marca, atualize **as duas** para o loop continuar perfeito.
