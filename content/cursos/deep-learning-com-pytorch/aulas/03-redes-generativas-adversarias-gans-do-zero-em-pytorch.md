---
title: "Redes generativas adversárias (GANs) do zero em PyTorch"
video: https://www.youtube.com/watch?v=BIEBJZ_Db7Y
module: "Redes neurais com PyTorch"
duration: "2:22:29"
---
## Sobre esta aula

Você provavelmente já ouviu falar em *deepfakes*: imagens, áudios e vídeos produzidos por inteligência artificial. Boa parte desses resultados vem do modelo que estudamos nesta aula — as **redes generativas adversárias (GANs)**.

Numa GAN, duas redes neurais são treinadas ao mesmo tempo: o **gerador** aprende a criar dados, e o **discriminador** aprende a distinguir os dados reais dos gerados. Desse embate — um jogo de soma zero otimizado via *minimax* —, o gerador aprende a produzir amostras parecidas com os dados reais sem conhecer explicitamente a sua distribuição. Você vai implementar uma GAN do zero em PyTorch.

## O que você vai aprender

- O que são modelos generativos
- Como funcionam o gerador e o discriminador
- O treinamento adversário (*minimax*)
- Como implementar e treinar uma GAN em PyTorch

## Material de apoio

- [Código do curso (notebooks)](https://github.com/pgdinamica/deeplearning/tree/main/notebooks)
- [Site oficial do PyTorch](https://pytorch.org/)
