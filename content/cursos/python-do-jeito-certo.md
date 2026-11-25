---
title: Python do Jeito Certo
edition: "2.0"
order: 1
type: pago
template: curso_vendas.html
badge: Mais popular
cover: /assets/img/cursos/python-do-jeito-certo-square.jpg
backdrop: /assets/img/cursos/python-do-jeito-certo-backdrop.jpg
thumb: /assets/img/cursos/python-do-jeito-certo-thumb.jpg
topics: ["Programação"]
pinned: true
level: "Do zero"
format: "Gravado · com suporte do professor"
summary: Aprenda Python entendendo cada linha, do zero à orientação a objetos.
price_label: R$ 249
instructors: [hallison-paz]
checkout: https://escola-programacao-dinamica.memberkit.com.br/checkout/x0agWQ
cta: Quero aprender do jeito certo

# ---- Campos vazios ficam escondidos ----
installments: ""             # ex.: "ou 12x de R$ XX"
payment_methods: ""
testimonials: []             # - { text: "...", name: "..." }
company: ""

headline: Aprenda Python entendendo cada linha,
headline_accent: não decorando comandos.
subheadline: Do zero à orientação a objetos, com a base de quem domina engenharia da computação. Para quem nunca programou e para quem sabe o básico, mas trava na hora de criar algo do zero.
hero_link: { href: "#conteudo", label: "Ver a trilha" }
perks: [ "Do zero, sem pré-requisitos", "2 anos de acesso", "Certificado", "7 dias de garantia" ]
social_proof: "+1.000 alunos já aprenderam Python com o Hallison Paz."
proof:
  text: "Seu professor, Hallison Paz:"
  items: [ "Doutor em Matemática pelo IMPA", "Pesquisador na École Polytechnique", "Mais de 15 anos programando" ]

pains:
  title: "Se alguma destas situações já aconteceu com você, este curso é para você:"
  items:
    - "“Tenho dificuldade de começar sozinho.”"
    - "“Não sei qual o melhor caminho a seguir.”"
    - "“Já aprendi algumas coisas, mas não me sinto confiante para criar nada do zero.”"
    - "“Copio código de tutorial e funciona, mas não sei explicar por quê.”"
  answer: "**O problema não é você.** É aprender comandos soltos sem entender a lógica por trás deles. Assim, você fica eterno iniciante: sabe repetir, mas não sabe criar."

method:
  eyebrow: O jeito certo
  title: "Primeiro o porquê. Depois o como."
  intro: "Com a IA escrevendo cada vez mais código, saber decompor um problema e pensar com lógica é o que diferencia quem programa de quem só copia."
  items:
    - { title: "Entendimento, não decoreba", text: "Você entende a lógica de cada linha que escreve. Quando algo quebra, sabe onde procurar." }
    - { title: "Fundamentos de engenharia", text: "Uma base que serve para Python e para qualquer outra linguagem que você aprender depois." }
    - { title: "Projeto de verdade", text: "Você termina construindo o Starship, um projeto com orientação a objetos, e não só exercícios soltos." }
  code:
    file: nivel_2/funcoes.py
    source: |
      def media(notas):
          """Por que dividir por len?
          Porque a média é a soma
          sobre a quantidade."""
          return sum(notas) / len(notas)

      print(media([7, 8, 10]))
    output: ">>> 8.333333333333334"

syllabus_eyebrow: A trilha
syllabus_title: 4 etapas, do primeiro print à arquitetura de sistemas
syllabus:
  - { label: "Níveis 0 e 1", title: "O despertar da lógica", text: "Instalação do Python e do VS Code, controle de fluxo, repetições, tipos agregados e algoritmos." }
  - { label: "Nível 2", title: "Boas práticas e reuso de código", text: "Funções, módulos, arquivos, ambientes virtuais (venv) e pip." }
  - { label: "Nível 3", title: "Arquitetura de sistemas (POO)", text: "Classes, atributos, métodos, herança e polimorfismo, aplicados no projeto Starship." }
  - { label: "Nível 4", title: "A fronteira: tópicos especiais e IA", tag: "Em breve, incluso", text: "Tópicos avançados e programação assistida por IA. Quem entra agora recebe sem pagar a mais." }

teacher_label: Seu professor
instructor_message: >-
  Pesquisador em IA na École Polytechnique, na França, e doutor em Matemática pelo IMPA, programa há
  mais de 15 anos em várias linguagens e paradigmas. É cofundador do Programação Dinâmica, com Kizzy Terra.

receive:
  - { title: "Curso completo, liberado na hora", text: "Aulas gravadas e editadas dos níveis 0 a 3, para assistir no seu ritmo." }
  - { title: "Nível 4 quando for lançado", text: "Tópicos especiais e programação com IA, sem custo extra." }
  - { title: "Dúvidas respondidas pelo Hallison Paz", text: "Pergunte em qualquer aula." }
  - { title: "Encontros ao vivo", text: "Para tirar dúvidas em grupo." }
  - { title: "Códigos-fonte, materiais e exercícios", text: "Tudo na área de membros, com referências extras." }
  - { title: "Certificado e 2 anos de acesso", text: "Incluindo as atualizações do curso nesse período." }

price_title: Valor de lançamento da versão 2.0
price_note: "O preço sobe quando o Nível 4 for lançado. Quem entra agora já garante o Nível 4."
guarantee_text: "Entre, assista às primeiras aulas, escreva seus primeiros programas. Se em 7 dias você achar que não é para você, peça o reembolso e receba 100% do valor de volta."

fit:
  para_voce:
    - "nunca programou e quer começar com uma base sólida;"
    - "sabe o básico, mas não tem confiança para criar do zero;"
    - "quer entender o que a IA escreve, e não só aceitar;"
    - "quer uma base que sirva para outras linguagens depois."
  nao_para_voce:
    - "quer só copiar código pronto, sem entender;"
    - "procura um atalho rápido, sem tempo para praticar;"
    - 'quer ir direto para consultas em bancos de dados (para isso, veja o <a href="/cursos/sql-para-analise-de-dados/"><u>SQL para Análise de Dados</u></a>).'

faq:
  - { q: "Nunca programei. É para mim?", a: "Sim. O curso começa do zero, com a instalação das ferramentas." }
  - { q: "Já sei o básico. Vale a pena?", a: "Sim. As aulas iniciais têm um resumo em texto: leia e decida se precisa do vídeo. Assim você avança rápido até onde está o que ainda não sabe." }
  - { q: "O curso é ao vivo?", a: "As aulas são gravadas, para você assistir no seu ritmo. Além delas, há encontros ao vivo para tirar dúvidas." }
  - { q: "Quando sai o Nível 4?", a: "Ele ainda está em construção. Quem compra agora recebe o Nível 4 sem pagar a mais." }
  - { q: "Por quanto tempo terei acesso?", a: "2 anos, incluindo as atualizações do curso nesse período." }
  - { q: "Tem certificado?", a: "Sim, emitido na área de membros ao concluir o curso." }
  - { q: "E se eu não gostar?", a: "Você tem 7 dias para pedir o reembolso de 100% do valor." }

final: { title: "Seu primeiro programa pode ser hoje.", text: "Você entra, instala o Python na primeira aula e tem 7 dias para ver se é para você. E garante o Nível 4 antes de o preço subir." }
---
