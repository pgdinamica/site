---
title: "Como provar que uma IA treinou com os seus dados?"
subtitle: "Diário de Pesquisa"
description: "A mesma matemática que permite envenenar os dados de uma IA pode ajudar a provar que alguém treinou um modelo com o seu conteúdo sem autorização."
author: hallison-paz
date: 2026-11-12
cover: img-1.jpeg
youtube_id: tNxmKfDCSts
tags: [inteligência artificial, aprendizado de máquina, envenenamento de dados, pesquisa, youtube]
---

A mesma **matemática** que permite envenenar os dados de uma IA para causar um dano *pode ajudar a provar* que alguém treinou um modelo com o seu conteúdo sem autorização.

Imagine um sistema de reconhecimento facial que confunde uma pessoa comum com um fugitivo da justiça, não por acaso, mas porque alguém *manipulou* os dados com que ele foi treinado. Agora, imagine que o algoritmo de uma rede social faça recomendações aleatórias a milhares ou até milhões de pessoas, porque um grupo de usuários *inseriu informações maliciosas* no processo de treinamento deste sistema de recomendações.

Os dois casos exploram **fragilidades matemáticas na forma como modelos de aprendizado de máquina aprendem e tomam decisões**. E é exatamente esse o tema da minha nova área de pesquisa no pós-doutorado no Centro de Matemática Aplicada (CMAP) da *École Polytechnique*, aqui na França: aprendizado adversarial e aprendizado robusto. Se você quiser saber como uma conversa em um bar de açaí me trouxe para cá, contei essa história [neste vídeo da Saga de um Cientista](https://youtu.be/BpkxU-x3VNk).

## Tudo passa pelo gradiente

Treinar uma rede neural é ajustar milhões (às vezes bilhões) de parâmetros para que as respostas do modelo fiquem próximas das respostas certas. Quem mede essa distância é a **função de perda**, e o nosso objetivo durante o treinamento é minimizá-la.

Do *Cálculo Diferencial*, sabemos que o **gradiente** é o vetor que aponta para a direção em que uma função cresce mais rápido. Por isso, no treinamento de um modelo de aprendizado de máquina, calculamos o gradiente da função de perda em relação aos parâmetros do modelo e andamos no **sentido contrário** ao que este vetor aponta. Assim, ajustamos os parâmetros no sentido de diminuir a função de perda. 

Uma consequência direta da dependência do treinamento de modelos do vetor gradiente é:

> Quem consegue manipular a direção do gradiente consegue manipular o que a rede neural aprende.

Se esses conceitos forem novos para você, recomendo que assista ao vídeo [O que é uma rede neural](https://youtu.be/i6l3R7j95x8) que faz uma introdução ao assunto compreensível até para leigos. Caso deseje colocar a mão no código, a [live de treinamento de redes neurais com PyTorch](https://www.youtube.com/live/cGxv8tOaA7I) pode te ajudar.

https://www.youtube-nocookie.com/embed/i6l3R7j95x8?rel=0&modestbranding=1

## Envenenar sem que ninguém perceba

No artigo [*Witches' Brew: Industrial Scale Data Poisoning via Gradient Matching*](https://arxiv.org/abs/2009.02276) (Geiping et al., ICLR 2021), os autores mostram como manipular o gradiente no treinamento de uma rede neural sem acesso ao modelo. Eles adicionam a algumas imagens de cachorro uma perturbação imperceptível, calculada para que o gradiente dessas imagens se **alinhe** ao de uma imagem-alvo. Daí vem o nome da técnica *gradient matching* (alinhamento de gradiente). Quem olha o conjunto de dados continua vendo os mesmos cachorros; o modelo treinado nele, porém, passa a classificar algum alvo de forma errada.

Há ataques ainda mais discretos. Em sistemas treinados de forma distribuída, como algoritmos de recomendação que agregam sinais vindos dos celulares de milhões de usuários, **comprometer uma fração mínima dos dados, algo como 0,01%, pode bastar para comprometer o modelo** e negar um serviço. Uma das linhas em que trabalho hoje é justamente a de *agregadores robustos*: formas de combinar gradientes de várias origens que não se deixem levar por contribuições maliciosas ou defeituosas, ao contrário de uma média simples.

## Usar o veneno a nosso favor

A parte que mais me empolga é ver essa matemática servindo à defesa dos modelos e proteção dos usuários. No artigo [*Data Taggants: Dataset Ownership Verification via Harmless Targeted Data Poisoning*](https://arxiv.org/abs/2410.09101) (Bouaziz, Usunier & El Mhamdi, ICLR 2025), publicado pelo nosso laboratório, a ideia é usar a técnica de envenenamento de dados para **assinar** um conjunto de dados de maneira inofensiva.

1. O dono dos dados escolhe algumas **chaves**: entradas aleatórias, fora da distribuição dos dados, que só ele conhece.
2. Com *gradient matching*, ele aplica uma perturbação imperceptível a parte das imagens, de modo que qualquer modelo treinado nelas aprenda uma associação específica com essas chaves.
3. Se suspeitar que um modelo usou seus dados, ele apresenta as chaves ao modelo e observa as respostas.

Um modelo que nunca viu os dados assinados quase nunca acertaria a resposta esperada para uma chave. Se ele acerta a maioria delas, **um teste estatístico mostra que a coincidência é praticamente impossível**, e temos uma evidência matemática de que o modelo foi treinado com aqueles dados.

## Por que isso importa agora

Artistas, jornalistas e produtores de conteúdo em geral veem seu trabalho alimentar modelos de IA sem consentimento nem compensação. Quando questionadas, empresas costumam negar ou relativizar o uso. Ferramentas como essa mudam a conversa: em vez de uma suspeita, podemos apresentar **uma prova verificável**, que pode sustentar uma reclamação na justiça e, principalmente, cobrar das autoridades uma regulação mais justa para quem produz os dados. Este é um ótimo exemplo de como a matemática pode contribuir com as nossas estruturas de **governança**.

No vídeo abaixo, conto em mais detalhes o que estudo nesta nova fase e explico, do zero, como o gradiente conecta ataques e defesas. Assista ao vídeo aqui:

https://www.youtube-nocookie.com/embed/tNxmKfDCSts?rel=0&modestbranding=1

🥰 Se você gosta do nosso trabalho e acha relevante a nossa atuação no Youtube, [considere nos apoiar se tornando membro do canal](https://www.youtube.com/programacaodinamica/join).


[[produto: livro-bigtech-morozov]]