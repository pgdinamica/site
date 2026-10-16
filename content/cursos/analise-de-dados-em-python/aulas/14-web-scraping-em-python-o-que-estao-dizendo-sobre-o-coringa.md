---
title: "Web scraping em Python: o que estão dizendo sobre o Coringa?"
video: https://www.youtube.com/watch?v=UrglsGfHJqA
module: "Coleta de dados e grandes volumes"
duration: "19:45"
---

## Sobre esta aula

O QUE ESTÃO DIZENDO SOBRE O FILME DO CORINGA? Após a estreia do Coringa, resolvi dar uma olhada nas críticas no site Rotten Tomatos, foi então que tive a ideia de fazer uma brincadeira e compartilho aqui o resultado :)

Transforme seus dados em arte!  Neste vídeo, você vai aprender a criar uma nuvem de palavras personalizada usando o filme Coringa como exemplo. Explore conceitos como web scraping, processamento de linguagem natural e visualização de dados enquanto cria uma nuvem de palavras única e visualmente atraente.

Para os interessados e curiosos por programação, seguem os passos que utilizei para obter o resultado:

1. Fiz web scraping da página do Rotten Tomatos utilizando o pacote beautiful soup.

2. Recuperei as críticas e salvei em um arquivo csv;

3. Utilizando o pacote nltk fiz uma tokenização e removi stopwords;

4. Com a lista de palavras resultante, utilizei matplotlib e wordcloud, gerei uma nuvem de palavras(B) colorida a partir da máscara do coringa(A);

5. Na imagem obtida se repetiam termos como nome de atores, mas minha intenção era ter uma noção mais qualitativa das opiniões logo decidi fazer mais um processamento;

6. Utilizei o nltk pos tagging para filtrar apenas adjetivos;

7. Fiz uma nova imagem (C), gostei do resultado e decidi compartilhar, mas aí me surgiu uma nova ideia: utilizar um pacote de tradução para gerar uma imagem com as palavras traduzidas para o português;

8. Foi então que utilizei o pacote googletrans para cumprir esse objetivo, gerando a terceira, e última, imagem que você pode ver abaixo (D).

Tudo isso, é claro, em #Python.

▶️ Confira a playlist sobre web scraping (raspagem de dados) com Python: <https://youtube.com/playlist?list=PL5TJqBvpXQv44pdtrCWgVYv8_w8tSwkgE&si=pGPN5r1Q--mgoC-V>

## Material de apoio

- [👩🏾‍💻 Código do vídeo](https://github.com/programacaodinamica/analise-dados/blob/master/notebooks/Rotten%20Tomatoes%20Joker%20Analysis.ipynb)
