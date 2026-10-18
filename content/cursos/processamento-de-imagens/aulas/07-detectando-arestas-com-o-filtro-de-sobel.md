---
title: "Detectando arestas com o filtro de Sobel"
video: https://www.youtube.com/watch?v=uHT4qDzq1bY
module: "Filtros"
duration: "27:12"
---
## Sobre esta aula

Nesta aula, você vai implementar o **filtro de Sobel**, capaz de detectar as **arestas** de uma imagem — também chamadas de bordas ou contornos. As arestas são regiões de grande variação (ou de alta frequência), por isso esse tipo de filtro é chamado de **passa-alta**.

O filtro de Sobel é linear, invariante por translação e representado por um núcleo 3 × 3. A ideia matemática por trás dele é o cálculo do **gradiente** da imagem — o vetor formado pelas derivadas nas direções principais. Os termos parecem complicados, mas a intuição é simples. A implementação usa a biblioteca Pillow.

## O que você vai aprender

- O que são arestas e filtros passa-alta
- A intuição do gradiente de uma imagem
- Como implementar e aplicar o filtro de Sobel em Python

## Material de apoio

- [Código da aula](https://github.com/programacaodinamica/processamento-imagens/blob/master/src/filtros.py)
- [Livro: *Computer Vision: Algorithms and Applications*, de Richard Szeliski (capítulo 3, gratuito)](http://szeliski.org/Book/)
