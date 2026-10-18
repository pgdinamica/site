---
title: "Uma capa da invisibilidade com visão computacional"
video: https://www.youtube.com/watch?v=x78FpxMF-eY
module: "Projetos criativos"
duration: "8:53"
---
## Sobre esta aula

A capa da invisibilidade existe? Com tecnologia, sim. Nesta aula, você vai ver como transformar um lençol colorido numa "capa mágica": o programa abre um vídeo, identifica a região coberta pela capa em cada quadro e mostra os pixels do fundo no lugar, deixando visível só a silhueta.

O problema é resolvido com **segmentação por cor** no espaço HSV, que gera uma máscara binária da capa. Depois, a máscara é tratada com **morfologia matemática** — erosão, dilatação, abertura e fechamento — para fechar buracos e remover ruídos. Por fim, ela decide, pixel a pixel, entre o quadro atual e o fundo.

## O que você vai aprender

- Como funciona o efeito da capa da invisibilidade
- Segmentação de imagens por cor
- Filtros morfológicos para limpar uma máscara
- Como processar um vídeo quadro a quadro em Julia

## Material de apoio

- [Código da aula (Julia)](https://github.com/pgdinamica/magia)
- [Curso de Processamento de Imagens do IMPA, aula 10 (morfologia matemática)](https://youtu.be/mzxh-tnIaG0?t=2595)
- [Vídeo: como começar na visão computacional](https://youtu.be/HW7oJVqqQxU)
