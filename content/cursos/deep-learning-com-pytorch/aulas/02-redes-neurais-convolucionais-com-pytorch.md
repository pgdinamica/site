---
title: "Redes neurais convolucionais com PyTorch"
video: https://www.youtube.com/watch?v=doT7koXt9vw
module: "Redes neurais com PyTorch"
duration: "2:50:41"
---
## Sobre esta aula

As **redes neurais convolucionais** são as arquiteturas mais usadas para trabalhar com imagens. Em teoria, uma rede perceptron multicamada (MLP) consegue aproximar qualquer função; na prática, com memória, dados e poder computacional limitados, precisamos incorporar à rede o que sabemos sobre o problema.

As redes convolucionais usam os **filtros de convolução** do processamento de imagens: a convolução torna a rede capaz de reconhecer um objeto em qualquer posição da imagem, e as camadas de *pooling* trazem a análise em múltiplas escalas. Nesta aula, você vai treinar um classificador de imagens com o conjunto de dados **CIFAR-10** (aviões, automóveis, pássaros, cavalos…), comparando uma MLP com uma rede convolucional.

## O que você vai aprender

- O problema de classificação de imagens
- Como preparar o CIFAR-10 com o Torchvision e criar os `DataLoaders`
- Como treinar uma MLP com entropia cruzada (`CrossEntropyLoss`) usando a GPU
- Como avaliar o desempenho de um classificador
- Como funciona uma rede convolucional e como criá-la no PyTorch
- Como classificar suas próprias imagens com o modelo treinado

## Material de apoio

- [Código do curso (notebooks)](https://github.com/pgdinamica/deeplearning/tree/main/notebooks)
- [Curso: Processamento de Imagens](/cursos/processamento-de-imagens/) — para entender os filtros de convolução
