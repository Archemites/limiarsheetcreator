// ============================================================================
// LIMIAR - 1ª EDIÇÃO REVISADA (LIVRO DO JOGADOR)
// Base de Dados Completa e Fiel ao PDF Original (Páginas 1 a 60)
// ============================================================================

window.LIMIAR_DATA = {
  meta: {
    title: "LIMIAR",
    edition: "1ª Edição Revisada",
    subtitle: "Livro do Jogador — Wiki & Compêndio Oficial",
    setting: "Década de 1980 (Pós-Guerra do Vietnã) • Thriller Pop & Horror Cósmico",
    quote: {
      text: "As melhores invenções surgem do tédio, e é exatamente isso que eu vou fazer...",
      author: "Archemites Lyssa"
    },
    pathsQuote: {
      text: "Todo conhecimento tem um preço. Alguns pagam com sanidade, outros pagam com aquilo que costumavam ser.",
      author: "Os 5 Caminhos do Indizível"
    }
  },

  lore: {
    paragraphs: [
      "Em um mundo de deuses antigos esquecidos pelo tempo, religiosidade e crenças são tão comuns, a maioria desconhece o perigo que ronda essa realidade. As criaturas vindas do LIMIAR usam de crenças populares para furar o Véu e vir para a nossa realidade.",
      "As coisas que vêm do LIMIAR são conhecidas como Indizíveis, ou seja, criaturas tão grotescas ou tão superiores que um Ser Humano comum, como eu e você, enlouqueceria apenas de tentar compreender sua natureza por completo.",
      "Não são muitos aqueles que interagem com o Indizível e sobrevivem para contar a história, mas aqueles que o fazem ficam marcados para sempre, alguns lidam melhor que outros, alguns preferem se calar e levar as informações do LIMIAR consigo para a cova, mas a maior parte dos sobreviventes é reconhecida como Insanos.",
      "Aqueles que decidem combater o Indizível, para preservar as vidas daqueles que são inocentes são conhecidos como Peritos. O termo não representa uma aptidão em entender o Indizível, apenas que o indivíduo já teve contato.",
      "Alguns daqueles que interagem com o Indizível podem se corromper aos poucos, talvez cedendo sua humanidade, talvez almejando saber mais, talvez perdendo sua sanidade, talvez desejando ir além do véu. Quando um Perito passa tempo demais interagindo com o Indizível, é praticamente impossível saber o que ele pode querer fazer.",
      "OS DEUSES ANTIGOS JÁ NÃO PODEM MAIS NOS AJUDAR, DEIXANDO A HUMANIDADE À MERCÊ DE TUDO AQUILO QUE É ESTRANHO E PARANORMAL, RESTANDO APENAS A FÉ NOS NOVOS DEUSES.",
      "Ambientado na década de 80, ainda saindo da guerra do Vietnã, os jogadores podem se sentir em um verdadeiro Thriller desse tempo, com várias referências à cultura Pop e um toque de horror cósmico."
    ],
    glossary: [
      {
        term: "O LIMIAR",
        category: "Cosmologia",
        desc: "O 'outro lado' da realidade. Dimensão de onde provêm as criaturas Indizíveis e o conhecimento proibido. Ter acesso direto a uma imagem do Limiar causa 2d20 de dano de Sanidade."
      },
      {
        term: "O Véu",
        category: "Cosmologia",
        desc: "A fronteira entre a nossa realidade e o Limiar. Criaturas do Limiar utilizam crenças populares humanas para furar o Véu, e rituais pagam Sanidade fixa como preço para 'rasgar o véu'."
      },
      {
        term: "Indizíveis",
        category: "Entidades",
        desc: "Criaturas vindas do Limiar tão grotescas ou superiores que um ser humano comum enlouqueceria apenas de tentar compreender sua natureza por completo. Em combate, cada golpe de um Indizível causa -1 de Sanidade ao grupo inteiro."
      },
      {
        term: "Peritos",
        category: "Personagens",
        desc: "Sobreviventes que já tiveram contato com o Indizível e decidiram combatê-lo para preservar vidas inocentes. Não são pessoas comuns: são prodígios ou casos espetaculares na sociedade."
      },
      {
        term: "Insanos",
        category: "Condição",
        desc: "Como a maior parte dos sobreviventes do contato com o Indizível é reconhecida pela sociedade. Mecanicamente, também é o status adquirido ao falhar no teste de RAZÃO ao chegar em 0 de Sanidade (passando a sofrer 2x dano de Sanidade)."
      },
      {
        term: "Espectador",
        category: "Sistema",
        desc: "O narrador/mestre do jogo em LIMIAR, responsável por conduzir a história, arbitrar dificuldades, revelar magias/rituais e interpretar o mundo e os Indizíveis."
      }
    ]
  },

  attributes: [
    {
      id: "vigor",
      name: "VIGOR",
      color: "#e63946",
      badgeClass: "attr-vigor",
      caminho: "Caminho Eidolon",
      shortDesc: "Atributo que determina desempenho físico.",
      fullDesc: "O atributo de VIGOR define diversas características envolvendo o corpo do Perito: a Vida de cada um dos cinco membros corporais, a porcentagem de Defesa passiva na criação (2d4 × VIGOR), os Pontos de Fôlego, o bônus de dano em ataques físicos com armas cegas ou desarmado (+VIGOR) e os testes de força, bloqueio (DF6) e locomoção extra em combate.",
      mechanics: [
        "Pontos de Vida por Membro: Cabeça (VIGOR + 5), Braços (VIGOR + 8), Pernas (VIGOR + 10), Tronco (VIGOR + 15).",
        "Defesa na Criação: 2d4 × valor de VIGOR (usado como chance em teste de porcentagem 1d100).",
        "Pontos de Fôlego: Igual aos pontos de VIGOR (recupera 1 a cada 15 minutos).",
        "Reforço em Testes e Dano: Soma +[VIGOR] em testes de VIGOR e +[VIGOR] de dano em ataques físicos com armas cegas ou desarmado.",
        "Locomoção em Combate: Anda até 5m sem teste; acima disso exige teste de VIGOR com DF relativa à distância extra (ex: 5m + 2m = DF1 + 2)."
      ]
    },
    {
      id: "acuidade",
      name: "ACUIDADE",
      color: "#2ecc71",
      badgeClass: "attr-acuidade",
      caminho: "Caminho Profético",
      shortDesc: "Atributo que determina minuciosidade.",
      fullDesc: "O atributo de ACUIDADE existe para tarefas mais minuciosas e delicadas, como arrombar fechaduras, procurar por algo específico, encontrar objetos perdidos/ocultos, consertar objetos, utilizar armas de fogo e afins. Também governa a Iniciativa e os testes de acerto em combate.",
      mechanics: [
        "Iniciativa em Combate: Todos os membros da party rolam teste de ACUIDADE (do maior para o menor).",
        "Testes de Acerto em Combate: Para combater, defender ou esquivar, o jogador sempre realiza um teste de acerto antes usando ACUIDADE e seu modificador.",
        "Defesa Ativa: Rola teste de ACUIDADE para testar reflexos e bloquear ataque iminente (seguido de teste de VIGOR DF6).",
        "Salvar Aliado: Pode realizar teste de ACUIDADE para impedir a perda de um aliado, sempre descrevendo como o fará se possível.",
        "Tarefas Minuciosas: Arrombar fechaduras, investigar cenas, consertar objetos e disparar armas de fogo."
      ]
    },
    {
      id: "psicometria",
      name: "PSICOMETRIA",
      color: "#3b82f6",
      badgeClass: "attr-psicometria",
      caminho: "Caminho Real",
      shortDesc: "Atributo que determina fatores cognitivos e sociais.",
      fullDesc: "PSICOMETRIA é utilizada para determinar as capacidades cognitivas do Perito, como intelecto e desenvoltura social. Este atributo se diferencia dos outros por possuir dois Sub-Atributos que definem Inteligência e Sapiência do Perito.",
      subAttributes: [
        {
          name: "Inteligência",
          desc: "Determina a capacidade do Perito de interagir com tecnologia, seja computadores, rede elétrica, leitura, identificar padrões, decifrar criptografias e afins."
        },
        {
          name: "Sapiência",
          desc: "Determina a qualidade do 'Jogo de Cintura' do Perito, seja lidar com pessoas, persuadir, influenciar, perceber mentiras, dedução e afins."
        }
      ],
      mechanics: [
        "Regra de Sub-Atributos: O jogador deve escolher apenas UM dos dois Sub-Atributos para receber o valor completo de PSICOMETRIA, e o outro receberá o valor do reforço -3.",
        "Exemplo Oficial: PSICOMETRIA: 4 → Reforço de +4 em testes. Inteligência: +4, logo Sapiência: +1 (ou vice-versa).",
        "Com o Nó 1 da Trilha da Sapiência (Sinergia Cognitiva), a penalidade do sub-atributo secundário é reduzida de -3 para -1."
      ]
    },
    {
      id: "esoterismo",
      name: "ESOTERISMO",
      color: "#ff00ff",
      badgeClass: "attr-esoterismo",
      caminho: "Caminho Ancião",
      shortDesc: "Atributo que determina Afinidade com o Indizível.",
      fullDesc: "ESOTERISMO define a afinidade do Perito com o Indizível, ou seja, o quão bem o mesmo é capaz de compreender e explicar o mesmo. Sendo utilizado geralmente para compreender os Seres INDIZÍVEIS, realizar rituais, encantar objetos e falar com o LIMIAR.",
      mechanics: [
        "Nível de Afinidade: Cada ponto em ESOTERISMO representa o nível de Afinidade do Perito, existindo variados rituais e magias para cada nível.",
        "Sobrevivência a Rituais: Um Perito precisa ter nível de Afinidade compatível para sobreviver a rituais elevados.",
        "Exemplo Oficial: COROAÇÃO → Ritual de nível 8. Um Perito de nível 7 não é capaz de sobreviver a esse ritual, entretanto um de nível 9 ou maior, é."
      ]
    },
    {
      id: "razao",
      name: "RAZÃO",
      color: "#d4af37",
      badgeClass: "attr-razao",
      caminho: "Caminho da Loucura",
      shortDesc: "Atributo que determina resistência contra o Indizível e Sanidade.",
      fullDesc: "Sendo o atributo que define a sua resistência contra o Indizível, cada ponto investido representa a quantidade de turnos em combate que o Perito sustenta sem perder Sanidade. Também define os Pontos de Sanidade na montagem da ficha e os testes para resistir à loucura.",
      mechanics: [
        "Fórmula de Sanidade Inicial: [RAZÃO] + 1d6 = Sanidade Total do Perito (Exemplo: RAZÃO 4 → 4 + 1d6). Caso o Perito tenha pouca razão, o valor mínimo para Sanidade é 2.",
        "Sustentação em Combate: Cada ponto investido representa a quantidade de turnos em combate que o Perito sustenta sem perder Sanidade.",
        "Se Equilibrar na Corda da Loucura: Ao chegar em 0 de Sanidade, realiza um teste de RAZÃO para evitar o status Insano e o multiplicador de 2x dano de Sanidade."
      ]
    }
  ],

  rules: {
    pointBuy: {
      initialPoints: 5,
      maxAtCreation: 10,
      minAtCreation: -5,
      description: "Ao iniciar uma ficha de Perito, o mesmo recebe cinco (5) pontos para distribuir entre os cinco atributos, podendo atribuir no máximo dez (10) pontos em um atributo na criação e no mínimo cinco negativo (-5), podendo retirar pontos para realocar, permitindo números negativos. Ao subir de nível, o Perito ganha mais pontos (+1 por nível de Conhecimento) para melhorar seus atributos."
    },
    diceSystem: {
      d20: "Os testes em LIMIAR seguem um sistema simples de D20: 1d20 + [ATRIBUTO].",
      critSuccess: "20 Natural no d20: Configura um Acerto Crítico onde obtém sucesso pleno na ação em que deseja realizar e, caso seja um ataque, obtém o dano máximo daquele mesmo ataque.",
      critFail: "1 Natural no d20: Configura Falha Crítica, obtendo além da falha, se houver, o pior resultado da ação.",
      advantage: "Rodar um teste com Vantagem: Rolar dois dados (2d20) e pegar o melhor resultado.",
      disadvantage: "Rodar um teste com Desvantagem: Rolar dois dados (2d20) e pegar o pior resultado.",
      percentage: "Testes de Porcentagem (%): Rolar 1d100. Caso tire abaixo (ou igual) da chance, sucede no teste; caso tire acima, falha. Exemplo: 50% de chance de recuperar → Perito tirou 33 no dado = Sucesso! Caso tire 1, considera-se Acerto Crítico; caso tire 100, Falha Crítica."
    },
    difficultyTable: [
      { df: 1, min: 10, label: "DF 1 — Muito Fácil" },
      { df: 2, min: 12, label: "DF 2 — Fácil" },
      { df: 3, min: 14, label: "DF 3 — Moderado" },
      { df: 4, min: 16, label: "DF 4 — Desafiador" },
      { df: 5, min: 18, label: "DF 5 — Difícil (Contra-Ação do Perito)" },
      { df: 6, min: 19, label: "DF 6 — Muito Difícil (Defesa VIGOR / Contra-Ação Inimiga)" },
      { df: 7, min: 20, label: "DF 7 — Formidável" },
      { df: 8, min: 24, label: "DF 8 — Heroico" },
      { df: 9, min: 26, label: "DF 9 — Quase Impossível" },
      { df: 10, min: 30, label: "DF 10 — Sobrenatural / Limiar" }
    ],
    bodyParts: [
      { part: "Cabeça", formula: "VIGOR + 5", baseAdd: 5, fatal: true, fatalNote: "Morte ocorre caso a cabeça do Perito seja arrancada." },
      { part: "Tronco (Torso)", formula: "VIGOR + 15", baseAdd: 15, fatal: true, fatalNote: "Morte ocorre caso a vida do tronco seja completamente removida." },
      { part: "Braço Esquerdo", formula: "VIGOR + 8", baseAdd: 8, fatal: false, fatalNote: "Perda do membro se infeccionado por >1h sem tratar ou destruído." },
      { part: "Braço Direito", formula: "VIGOR + 8", baseAdd: 8, fatal: false, fatalNote: "Perda do membro se infeccionado por >1h sem tratar ou destruído." },
      { part: "Perna Esquerda", formula: "VIGOR + 10", baseAdd: 10, fatal: false, fatalNote: "Afeta locomoção; perda do membro se gangrenar." },
      { part: "Perna Direita", formula: "VIGOR + 10", baseAdd: 10, fatal: false, fatalNote: "Afeta locomoção; perda do membro se gangrenar." }
    ],
    combat: {
      initiative: "Ao iniciar um combate, todos os membros da party rolam um teste de ACUIDADE para definir a ordem de turno, sendo sempre do maior (primeiro) para o menor (último). Em caso de empates, os Peritos decidem entre si quem sai primeiro.",
      actionsPerTurn: "Num combate, o Perito possui 1 Ação e 1 Ação Bônus OU pode trocar as duas ações por um turno de Movimentação que permite caminhar mais de 10m sem gastar fôlego ou testes.",
      attackAndDodge: "Para realizar uma ação como combater, defender ou esquivar, o jogador sempre realiza um teste de acerto antes, usando o atributo de ACUIDADE e seu modificador. Após isso, realiza o teste de dano caso acerte.",
      counterAction: "Caso um Perito esteja sujeito a uma ação adversária, o mesmo tem uma chance de Contra-Ação: um teste de DF 5 (18) para escapar dos efeitos da ação do oponente, assim como o oponente também tem, entretanto o teste dele sendo de DF 6 (19). Caso o Perito escape com um 20 natural, o mesmo recebe +1 Ação Bônus antes da mudança de turnos.",
      activeDefense: "Para defender, o Perito realiza um teste de ACUIDADE (para testar seus reflexos e bloquear um ataque iminente), logo em seguida rodando um teste de VIGOR de DF 6 (19) onde pode receber apenas metade (1/2) do dano inimigo. Caso obtenha um sucesso crítico (20), anula completamente o dano do ataque. O oponente também tem essa vantagem.",
      passiveDefense: "A Defesa passiva do Perito é definida com 2d4 × valor de VIGOR na criação. Usando um teste de porcentagem (1d100) com a chance sendo o valor de Defesa, ao receber um ataque: caso tenha sucesso no teste recebe apenas metade (1/2) do dano; caso seja um sucesso crítico (1 no d100), recebe apenas um quarto (1/4). Armaduras equipadas aumentam o valor de chance referente à parte que recebe o golpe (Ex: Capacete de Couro - 1 de Defesa → de 30% sobe para 31%).",
      movementInCombat: "Em combate, o Perito pode se locomover através de testes de VIGOR, podendo andar até 5 metros sem um teste e após isso deve rolar um teste com dificuldade relativa à distância extra que quer andar (Exemplo: 5m + 2m adicionais é um teste DF1 + 2, ou seja, Dificuldade 1 com +2 no resultado necessário = 12)."
    },
    stamina: {
      definition: "Medido em Pontos de Fôlego, definido pelos pontos de VIGOR, pode ser gasto para se esforçar mais sem precisar rodar um teste.",
      costs: [
        { action: "Correr", cost: "1 Ponto de Fôlego", effect: "Percorre 5 metros sem recorrer a um teste." },
        { action: "Pular / Escalar", cost: "2 Pontos de Fôlego", effect: "Supera o obstáculo sem teste." },
        { action: "Teste de Força", cost: "Igual à DF do teste", effect: "Sucesso sem rolar (Exemplo: Teste DF 4 = 4 Pontos de Fôlego)." }
      ],
      recovery: "A cada 15 minutos, 1 Ponto de Fôlego é recuperado automaticamente, sem necessidade de um descanso.",
      exhaustion: "Ao zerar os Pontos de Fôlego, o Perito entra em Exaustão, recebendo -[VIGOR] em todos os testes e precisa ter um descanso de 1 ou mais horas."
    },
    inventory: {
      categories: [
        {
          name: "Pertences (Bolsos / Equipado)",
          desc: "Itens que o Perito carrega nos bolsos ou em mãos para uso imediato.",
          limits: [
            "1x Arma/item equipado em cada mão",
            "1x Peça de armadura por parte do corpo (contam como Pertences somente quando equipadas; se remover, volta para Bagagem)",
            "2x Itens consumíveis de fácil acesso"
          ]
        },
        {
          name: "Bagagem (Mochila)",
          desc: "Itens que o Perito tem guardado em uma mochila. O Perito gasta 1 turno para desequipar e equipar itens.",
          limits: [
            "3x Armas",
            "2x Peças de armadura para cada parte do corpo",
            "10x Itens consumíveis"
          ]
        },
        {
          name: "Patrimônio",
          desc: "Itens, veículos, imóveis ou recursos que o Perito não carrega a todos os momentos, mas aos quais tem acesso fora de combate.",
          limits: ["Sem limite fixo de slots corporais"]
        }
      ],
      armors: "As armaduras funcionam com RD (Redução de Dano), onde cada armadura tem uma classe de RD que reduz o valor de dano que é recebido pelo jogador, além de somar na % de Defesa daquela parte. As RDs de peças diferentes no corpo NÃO somam entre si, mas aplicam redução apenas em sua própria parte corporal.",
      accessories: "Os Peritos podem ter até 3 Acessórios equipados, que são itens extras que aplicam vantagens para os mesmos, sendo impossível desequipar um acessório durante um combate."
    },
    restAndSleep: {
      note: "Os testes de Descanso e Sono não são influenciados por quaisquer modificadores de atributo.",
      rests: [
        { type: "Descanso Curto", vida: "1d4 de Vida", sanidade: "—", desc: "Pausa rápida durante a jornada." },
        { type: "Descanso Médio", vida: "1d8 de Vida", sanidade: "—", desc: "Recuperação moderada de fôlego e ferimentos." },
        { type: "Descanso Longo", vida: "1d10 de Vida", sanidade: "—", desc: "Descanso prolongado (reduzido em 50% sob Ansiedade Moderada)." }
      ],
      sleep: [
        { type: "Sono Ruim", vida: "1d4 de Vida", sanidade: "1d4 de Sanidade", desc: "Faz o dia passar em condições precárias." },
        { type: "Sono Tranquilo", vida: "1d4 de Vida", sanidade: "1d8 de Sanidade", desc: "Noite de sono regular e restauradora." },
        { type: "Sono Confortável", vida: "1d6 de Vida", sanidade: "1d10 de Sanidade", desc: "Sono seguro e plenamente reparador." }
      ]
    },
    leveling: {
       thresholdDamage: "2d20 de dano de Sanidade ao ter acesso direto a uma imagem do outro lado (o LIMIAR).",
      knowledgeRatio: "1 ponto de dano de Sanidade sofrido = 1% de Conhecimento (proporção 1:1). Rituais NÃO interferem na barra de Conhecimento.",
      at100Percent: [
        "O contador de Conhecimento zera (volta para 0%).",
        "Recebe 1 Traço de Revelação (compra 1 Nó em qualquer Caminho, respeitando a ordem da trilha e requisitos).",
        "Recebe +1 Ponto de Atributo para colocar onde quiser.",
        "Recebe +1d2 de Vida em todas as partes do corpo.",
        "Recebe +1d4 de Sanidade (passa a ser 1d6 com o nó 'Alma Teimosa').",
        "Recebe uma Iluminação (visita de um Indizível, revelação em sonho, visão ou aprendizado)."
      ]
    }
  },

  sanity: {
    formula: "[RAZÃO] + 1d6 (Mínimo de 2 pontos na criação)",
    combatTurns: "Cada ponto investido em RAZÃO representa a quantidade de turnos em combate que o Perito sustenta sem perder Sanidade.",
    exposureOutCombat: "Fora de combate, mas exposto ao Indizível (Espectador narrando): a cada 15 minutos o grupo recebe -1 Ponto de Sanidade.",
    exposureInCombat: "Em combate: o grupo inteiro recebe -1 Ponto de Sanidade a cada golpe de um Indizível (humanos e animais não contribuem para a perda de Sanidade).",
    zeroSanityRule: "Ao chegar em 0 de Sanidade, o Perito realiza um teste de RAZÃO para saber se consegue 'Se Equilibrar na Corda da Loucura'. Ao falhar, passa a tomar 2x danos de Sanidade e recebe o status Insano. Caso consiga passar no teste, fica em 0, realizando novamente no próximo dano de Sanidade.",
    therapy: "Uma Sessão de Terapia só pode ser realizada ao final de uma sessão de jogo (resultando em 1 por sessão) e só pode ser realizada caso um membro da party seja um profissional em Psicologia. Sempre restaura 1d6 de Pontos de Sanidade por Perito.",
    negativeTable: [
      { range: "-1 a -10", effect: "Casos de Paranoia Severa e Alucinações", severity: "low" },
      { range: "-11 a -20", effect: "Casos de Psicose Grave e Agressividade", severity: "medium" },
      { range: "-21 a -30", effect: "Perda de Memória, Dificuldade Motora (-1 de ACUIDADE)", severity: "medium" },
      { range: "-31 a -40", effect: "Toques Fantasmas, Episódios de Devaneios e Incapacidade de Fala", severity: "high" },
      { range: "-41 a -50", effect: "Dano Cerebral Permanente (-5 em todos os testes)", severity: "high" },
      { range: "-51 a -60", effect: "Dano Cerebral Grave Permanente (-8 em todos os testes)", severity: "critical" },
      { range: "-61 a -70", effect: "Irrecuperável", severity: "critical" },
      { range: "-71 a -100", effect: "Morte Cerebral", severity: "fatal" }
    ],
    disordersTrigger: "Caso o Perito fique com Sanidade total entre -5 e 1 por muito tempo (3 dias de jogo), corre o risco de desenvolver distúrbios mentais. Os distúrbios podem ser tratados e ter seus efeitos reduzidos ao máximo, alguns podendo ser completamente curados caso medicados corretamente e tratados em terapia. Um Perito pode ter mais de um distúrbio, precisando tratar os mesmos com frequência.",
    disorders: [
      {
        id: "depressao",
        name: "Depressão",
        medications: ["Prozac (Depressão)", "Zoloft (Depressão Grave)"],
        statusIndicators: ["Deprimido (Leve)", "Suicida (Moderada ou Grave)"],
        levels: [
          {
            grade: "Leve",
            effect: "O Perito apresenta certo desânimo nas interações sociais e profissionais, tendo dificuldade de se comunicar, muitas vezes preferindo ficar para trás ou se separar do grupo. Eventualmente o Espectador vai pedir um teste de PSICOMETRIA para os Peritos Depressivos antes de decisões em grupo; caso o Perito falhe, não conseguirá seguir o combinado, por qualquer motivo narrativo."
          },
          {
            grade: "Moderada",
            effect: "O Teste de PSICOMETRIA se torna consideravelmente mais difícil e o Perito perde a habilidade de interagir com estranhos."
          },
          {
            grade: "Grave",
            effect: "O Perito tem dificuldade máxima no teste de PSICOMETRIA, perde a habilidade de interagir com estranhos e necessita de um teste adicional de RAZÃO para resistir à vontade de atentar contra a própria vida."
          }
        ]
      },
      {
        id: "esquizofrenia",
        name: "Esquizofrenia",
        medications: ["Ziprasidona"],
        statusIndicators: ["Estressado"],
        levels: [
          {
            grade: "Paranoide",
            effect: "O Perito passa a ouvir sussurros em sua mente e alucinar com pessoas/criaturas."
          },
          {
            grade: "Hebefrênica",
            effect: "O Perito passa a ter uma incoerência em seus sentimentos além de ter extrema dificuldade (DESVANTAGEM) em seus testes de PSICOMETRIA ao utilizar itens medicinais."
          },
          {
            grade: "Catatônica",
            effect: "O Perito pode ter perturbações psicomotoras onde pode ficar imóvel, passando seu turno em combate ou alternando em picos de hiperatividade, agindo duas vezes por turno, sempre realizando um teste de RAZÃO para definir."
          }
        ]
      },
      {
        id: "ansiedade",
        name: "Ansiedade",
        medications: ["Clonazepam", "Adesivo de Nicotina (alivia sintomas)"],
        statusIndicators: ["Ansioso"],
        levels: [
          {
            grade: "Leve",
            effect: "O Perito tem reações de alerta fora do normal. Não afeta gravemente sua rotina."
          },
          {
            grade: "Moderada",
            effect: "Preocupações constantes, irritabilidade, insônia — esta que impede o Perito de receber os benefícios de um descanso longo por completo, ocasionando em apenas 50% de recuperação."
          },
          {
            grade: "Grave",
            effect: "O Perito pode ter crises intensas (30% de chance EM COMBATE), sensação de perigo iminente."
          }
        ]
      }
    ]
  },

  statuses: [
    {
      name: "Exaustão",
      color: "#e63946",
      category: "Físico",
      effect: "Cansaço que causa -[VIGOR] em todos os testes. Ocorre ao zerar os Pontos de Fôlego e exige descanso de 1 ou mais horas."
    },
    {
      name: "Insano",
      color: "#a855f7",
      category: "Mental",
      effect: "Toma 2x de Dano em Sanidade. Adquirido ao falhar no teste de RAZÃO ao chegar em 0 de Sanidade."
    },
    {
      name: "Ansioso",
      color: "#38bdf8",
      category: "Mental",
      effect: "Indicador de Ansiedade."
    },
    {
      name: "Estressado",
      color: "#f59e0b",
      category: "Mental",
      effect: "Indicador de Esquizofrenia."
    },
    {
      name: "Deprimido",
      color: "#818cf8",
      category: "Mental",
      effect: "Indicador de Depressão Leve."
    },
    {
      name: "Suicida",
      color: "#64748b",
      category: "Mental",
      effect: "Indicador de Depressão Moderada ou Grave."
    },
    {
      name: "Câncer",
      color: "#e63946",
      category: "Físico / Crônico",
      effect: "Desenvolvido ao consumir em excesso cigarros/tabaco (1% cigarros baratos, 2% cigarros de marca, 3% charuto, 10% narguilé). Causa -2 do atributo de VIGOR."
    },
    {
      name: "Embriagado",
      color: "#eab308",
      category: "Físico / Químico",
      effect: "O Perito bebeu demais (ao consumir 3 bebidas alcoólicas seguidas), sofrendo -2 no teste de ACUIDADE."
    },
    {
      name: "Infecção",
      color: "#2ecc71",
      category: "Físico / Dano Passivo",
      effect: "O Perito está com uma infecção em algum dos membros; caso passe mais de 1 hora sem tratar, o personagem tem uma gangrena e perde o membro infeccionado."
    },
    {
      name: "Envenenado",
      color: "#10b981",
      category: "Físico / Dano Passivo",
      effect: "O Perito recebe 1d4 de dano a cada 10 minutos."
    },
    {
      name: "Sangrando",
      color: "#ef4444",
      category: "Físico / Dano Passivo",
      effect: "O Perito perde 1d4 de dano a cada 5 minutos."
    },
    {
      name: "Parasitado",
      color: "#84cc16",
      category: "Físico / Dano Passivo",
      effect: "O Perito tem vermes embaixo da pele que causam 1d4 de dano a cada 10 minutos."
    },
    {
      name: "Amaldiçoado",
      color: "#9333ea",
      category: "Esotérico / Combate",
      effect: "Aplicado apenas em combate. Caso passe 3 turnos Amaldiçoado, fica com 1 de Vida e 1 de Sanidade (caso o Perito tenha mais que zero nas duas barras). Pode interagir com seres espectrais."
    },
    {
      name: "Em Chamas",
      color: "#f97316",
      category: "Físico / Combate",
      effect: "O Perito pega fogo, tomando 1d8 de dano por turno."
    },
    {
      name: "Atordoado",
      color: "#06b6d4",
      category: "Controle / Combate",
      effect: "O Perito perde seu próximo turno. Pode ser aplicado até 3 vezes."
    },
    {
      name: "Paralisado",
      color: "#94a3b8",
      category: "Controle / Combate",
      effect: "O Perito perde o movimento permanentemente até o final do combate."
    },
    {
      name: "Estado Crítico",
      color: "#dc2626",
      category: "Físico / Letal",
      effect: "O Perito fica extremamente exposto e vulnerável; ao tomar um dano tem 25% de chance de receber um ataque quase-fatal que reduz a Vida do Perito a 1 ponto."
    }
  ],

  professions: [
    {
      id: "policial",
      name: "Policial",
      bonusText: "+2 em ACUIDADE, +1 em RAZÃO",
      mods: { vigor: 0, acuidade: 2, psicometria: 0, esoterismo: 0, razao: 1 },
      subPref: null,
      special: null,
      equipment: "Revólver .38, Distintivo",
      money: "1d20",
      tags: ["acuidade", "razao", "combate"]
    },
    {
      id: "medico",
      name: "Médico",
      bonusText: "+2 em PSICOMETRIA (Inteligência), +1 em Sanidade Máxima",
      mods: { vigor: 0, acuidade: 0, psicometria: 2, esoterismo: 0, razao: 0 },
      extraSanity: 1,
      subPref: "Inteligência",
      special: "+1 em Sanidade Máxima",
      equipment: "Kit Médico",
      money: "1d30",
      tags: ["psicometria", "inteligencia", "suporte", "cura"]
    },
    {
      id: "jornalista",
      name: "Jornalista",
      bonusText: "+2 em PSICOMETRIA (Sapiência), +1 em ACUIDADE",
      mods: { vigor: 0, acuidade: 1, psicometria: 2, esoterismo: 0, razao: 0 },
      subPref: "Sapiência",
      special: null,
      equipment: "Câmera Fotográfica",
      money: "1d12",
      tags: ["psicometria", "sapiencia", "acuidade", "investigacao"]
    },
    {
      id: "professor",
      name: "Professor",
      bonusText: "+3 em PSICOMETRIA (Inteligência), -1 em VIGOR",
      mods: { vigor: -1, acuidade: 0, psicometria: 3, esoterismo: 0, razao: 0 },
      subPref: "Inteligência",
      special: null,
      equipment: "Não começa com nada",
      money: "1d10",
      tags: ["psicometria", "inteligencia"]
    },
    {
      id: "mecanico",
      name: "Mecânico",
      bonusText: "+2 em ACUIDADE, +1 em VIGOR",
      mods: { vigor: 1, acuidade: 2, psicometria: 0, esoterismo: 0, razao: 0 },
      subPref: null,
      special: null,
      equipment: "Grifo",
      money: "1d15",
      tags: ["acuidade", "vigor", "tecnico"]
    },
    {
      id: "bombeiro",
      name: "Bombeiro",
      bonusText: "+2 em VIGOR, +1 em ACUIDADE",
      mods: { vigor: 2, acuidade: 1, psicometria: 0, esoterismo: 0, razao: 0 },
      subPref: null,
      special: null,
      equipment: "Machado",
      money: "1d10",
      tags: ["vigor", "acuidade", "combate"]
    },
    {
      id: "artista",
      name: "Artista",
      bonusText: "+3 em PSICOMETRIA (Sapiência), -1 em RAZÃO",
      mods: { vigor: 0, acuidade: 0, psicometria: 3, esoterismo: 0, razao: -1 },
      subPref: "Sapiência",
      special: null,
      equipment: "Não começa com nada extra",
      money: "1d8",
      tags: ["psicometria", "sapiencia"]
    },
    {
      id: "sacerdote",
      name: "Sacerdote",
      bonusText: "+2 em RAZÃO, +1 em ESOTERISMO, (HABILIDADE) Sermão",
      mods: { vigor: 0, acuidade: 0, psicometria: 0, esoterismo: 1, razao: 2 },
      subPref: null,
      special: "(HABILIDADE) Sermão",
      equipment: "Nenhum",
      money: "1d6",
      tags: ["razao", "esoterismo", "suporte"]
    },
    {
      id: "carpinteiro",
      name: "Carpinteiro",
      bonusText: "+2 em VIGOR, +1 em ACUIDADE, -1 em PSICOMETRIA",
      mods: { vigor: 2, acuidade: 1, psicometria: -1, esoterismo: 0, razao: 0 },
      subPref: null,
      special: null,
      equipment: "Martelo",
      money: "1d12",
      tags: ["vigor", "acuidade"]
    },
    {
      id: "psicologo",
      name: "Psicólogo",
      bonusText: "+2 em PSICOMETRIA (Sapiência), +1 de Recuperação em Terapia, (HABILIDADE) Sessão de Terapia",
      mods: { vigor: 0, acuidade: 0, psicometria: 2, esoterismo: 0, razao: 0 },
      subPref: "Sapiência",
      special: "+1 de Recuperação em Terapia, (HABILIDADE) Sessão de Terapia",
      equipment: "Nenhum",
      money: "1d20",
      tags: ["psicometria", "sapiencia", "suporte", "terapia"]
    },
    {
      id: "comerciante",
      name: "Comerciante",
      bonusText: "+2 em PSICOMETRIA (Sapiência)",
      mods: { vigor: 0, acuidade: 0, psicometria: 2, esoterismo: 0, razao: 0 },
      subPref: "Sapiência",
      special: null,
      equipment: "5x Itens Psicoativos",
      money: "2d20",
      tags: ["psicometria", "sapiencia", "itens"]
    },
    {
      id: "coveiro",
      name: "Coveiro",
      bonusText: "+1 em RAZÃO, +1 em ESOTERISMO",
      mods: { vigor: 0, acuidade: 0, psicometria: 0, esoterismo: 1, razao: 1 },
      subPref: null,
      special: null,
      equipment: "Pá, Velas",
      money: "1d6",
      tags: ["razao", "esoterismo"]
    },
    {
      id: "eletricista",
      name: "Eletricista",
      bonusText: "+2 em ACUIDADE, +1 em PSICOMETRIA (Inteligência), -1 em ESOTERISMO",
      mods: { vigor: 0, acuidade: 2, psicometria: 1, esoterismo: -1, razao: 0 },
      subPref: "Inteligência",
      special: null,
      equipment: "Chave Inglesa",
      money: "1d15",
      tags: ["acuidade", "psicometria", "inteligencia", "tecnico"]
    },
    {
      id: "advogado",
      name: "Advogado",
      bonusText: "+2 em PSICOMETRIA (Sapiência), +1 em Testes Sociais",
      mods: { vigor: 0, acuidade: 0, psicometria: 2, esoterismo: 0, razao: 0 },
      subPref: "Sapiência",
      special: "+1 em Testes Sociais",
      equipment: "Pasta",
      money: "1d25",
      tags: ["psicometria", "sapiencia", "social"]
    },
    {
      id: "cacador",
      name: "Caçador",
      bonusText: "+2 em VIGOR, +1 em ACUIDADE",
      mods: { vigor: 2, acuidade: 1, psicometria: 0, esoterismo: 0, razao: 0 },
      subPref: null,
      special: null,
      equipment: "Rifle .30-30, Faca de Caça",
      money: "1d8",
      tags: ["vigor", "acuidade", "combate"]
    },
    {
      id: "musico",
      name: "Músico",
      bonusText: "+2 em PSICOMETRIA (Sapiência), -1 em RAZÃO",
      mods: { vigor: 0, acuidade: 0, psicometria: 2, esoterismo: 0, razao: -1 },
      subPref: "Sapiência",
      special: null,
      equipment: "Instrumento Musical",
      money: "1d6",
      tags: ["psicometria", "sapiencia"]
    },
    {
      id: "enfermeiro",
      name: "Enfermeiro",
      bonusText: "+2 em PSICOMETRIA (Inteligência), +1 em Sanidade Máxima",
      mods: { vigor: 0, acuidade: 0, psicometria: 2, esoterismo: 0, razao: 0 },
      extraSanity: 1,
      subPref: "Inteligência",
      special: "+1 em Sanidade Máxima",
      equipment: "Kit Médico, Seringas",
      money: "1d12",
      tags: ["psicometria", "inteligencia", "suporte", "cura"]
    },
    {
      id: "apostador",
      name: "Apostador",
      bonusText: "+3 em PSICOMETRIA (Sapiência), -1 em VIGOR",
      mods: { vigor: -1, acuidade: 0, psicometria: 3, esoterismo: 0, razao: 0 },
      subPref: "Sapiência",
      special: null,
      equipment: "Canivete Stiletto",
      money: "2d15",
      tags: ["psicometria", "sapiencia"]
    },
    {
      id: "bibliotecario",
      name: "Bibliotecário",
      bonusText: "+3 em PSICOMETRIA (Inteligência), -1 em VIGOR",
      mods: { vigor: -1, acuidade: 0, psicometria: 3, esoterismo: 0, razao: 0 },
      subPref: "Inteligência",
      special: null,
      equipment: "Livro Raro",
      money: "1d8",
      tags: ["psicometria", "inteligencia", "oculto"]
    },
    {
      id: "veterano",
      name: "Veterano",
      bonusText: "Vantagem em RAZÃO e ACUIDADE, +2 Armas de Fogo",
      mods: { vigor: 0, acuidade: 0, psicometria: 0, esoterismo: 0, razao: 0 },
      subPref: null,
      special: "Vantagem em RAZÃO e ACUIDADE, +2 em Armas de Fogo",
      equipment: "Arma à escolha",
      money: "1d16",
      tags: ["acuidade", "razao", "combate"]
    },
    {
      id: "pesquisador",
      name: "Pesquisador",
      bonusText: "+3 em PSICOMETRIA (Inteligência), -1 em VIGOR",
      mods: { vigor: -1, acuidade: 0, psicometria: 3, esoterismo: 0, razao: 0 },
      subPref: "Inteligência",
      special: null,
      equipment: "Não começa com nada",
      money: "1d18",
      tags: ["psicometria", "inteligencia", "investigacao"]
    },
    {
      id: "detetive",
      name: "Detetive",
      bonusText: "+2 em ACUIDADE, +1 em PSICOMETRIA (Sapiência)",
      mods: { vigor: 0, acuidade: 2, psicometria: 1, esoterismo: 0, razao: 0 },
      subPref: "Sapiência",
      special: null,
      equipment: "Revólver, Distintivo Falso",
      money: "1d20",
      tags: ["acuidade", "psicometria", "sapiencia", "investigacao"]
    },
    {
      id: "motorista",
      name: "Motorista",
      bonusText: "+2 em ACUIDADE, +1 em VIGOR",
      mods: { vigor: 1, acuidade: 2, psicometria: 0, esoterismo: 0, razao: 0 },
      subPref: null,
      special: null,
      equipment: "Carro, Chaves",
      money: "1d10",
      tags: ["acuidade", "vigor"]
    },
    {
      id: "fotografo",
      name: "Fotógrafo",
      bonusText: "+2 em ACUIDADE, +1 em PSICOMETRIA (Inteligência)",
      mods: { vigor: 0, acuidade: 2, psicometria: 1, esoterismo: 0, razao: 0 },
      subPref: "Inteligência",
      special: null,
      equipment: "Câmera Profissional com Flash de 8000 J",
      money: "1d12",
      tags: ["acuidade", "psicometria", "inteligencia", "investigacao"]
    },
    {
      id: "fazendeiro",
      name: "Fazendeiro",
      bonusText: "+2 em VIGOR, +2 em RAZÃO",
      mods: { vigor: 2, acuidade: 0, psicometria: 0, esoterismo: 0, razao: 2 },
      subPref: null,
      special: null,
      equipment: "Winchester .22",
      money: "1d10",
      tags: ["vigor", "razao", "combate"]
    },
    {
      id: "farmaceutico",
      name: "Farmacêutico",
      bonusText: "+2 em PSICOMETRIA (Inteligência), +1 em Itens Psicoativos",
      mods: { vigor: 0, acuidade: 0, psicometria: 2, esoterismo: 0, razao: 0 },
      subPref: "Inteligência",
      special: "+1 em Itens Psicoativos",
      equipment: "Conjunto de Tratamento Mental",
      money: "1d16",
      tags: ["psicometria", "inteligencia", "suporte", "cura"]
    },
    {
      id: "historiador",
      name: "Historiador",
      bonusText: "+2 em PSICOMETRIA (Inteligência), +1 em ESOTERISMO",
      mods: { vigor: 0, acuidade: 0, psicometria: 2, esoterismo: 1, razao: 0 },
      subPref: "Inteligência",
      special: null,
      equipment: "Atlas, Bússola",
      money: "1d10",
      tags: ["psicometria", "inteligencia", "esoterismo", "investigacao"]
    },
    {
      id: "criminoso-reformado",
      name: "Criminoso Reformado",
      bonusText: "+2 em VIGOR, +1 em Esquiva",
      mods: { vigor: 2, acuidade: 0, psicometria: 0, esoterismo: 0, razao: 0 },
      subPref: null,
      special: "+1 em Esquiva",
      equipment: "Arma Improvisada, Gazuas",
      money: "1d6",
      tags: ["vigor", "combate"]
    },
    {
      id: "ocultista",
      name: "Ocultista",
      bonusText: "+3 em ESOTERISMO, -1 em RAZÃO",
      mods: { vigor: 0, acuidade: 0, psicometria: 0, esoterismo: 3, razao: -1 },
      subPref: null,
      special: null,
      equipment: "Carta de Prece",
      money: "1d8",
      tags: ["esoterismo", "oculto"]
    },
    {
      id: "consultor",
      name: "Consultor",
      bonusText: "+2 em PSICOMETRIA (Sapiência)",
      mods: { vigor: 0, acuidade: 0, psicometria: 2, esoterismo: 0, razao: 0 },
      subPref: "Sapiência",
      special: null,
      equipment: "Não começa com nada",
      money: "2d20",
      tags: ["psicometria", "sapiencia", "social"]
    },
    {
      id: "atleta",
      name: "Atleta",
      bonusText: "+2 em VIGOR, +1d4 de Fôlego na criação",
      mods: { vigor: 2, acuidade: 0, psicometria: 0, esoterismo: 0, razao: 0 },
      subPref: null,
      special: "+1d4 de Fôlego na criação",
      equipment: "Não começa com nada",
      money: "2d20",
      tags: ["vigor"]
    },
    {
      id: "programador",
      name: "Programador",
      bonusText: "+2 em PSICOMETRIA (Inteligência)",
      mods: { vigor: 0, acuidade: 0, psicometria: 2, esoterismo: 0, razao: 0 },
      subPref: "Inteligência",
      special: null,
      equipment: "Cyberdeck",
      money: "2d20",
      tags: ["psicometria", "inteligencia", "tecnico"]
    },
    {
      id: "bom-pra-nada",
      name: "Bom-Pra-Nada",
      bonusText: "+4 em ESOTERISMO",
      mods: { vigor: 0, acuidade: 0, psicometria: 0, esoterismo: 4, razao: 0 },
      subPref: null,
      special: null,
      equipment: "Não começa com nada",
      money: "0",
      tags: ["esoterismo", "oculto"]
    }
  ],

  pathsRules: {
    overview: "Ao atingir 100% de Conhecimento, o contador zera e o Perito recebe 1 Traço de Revelação e +1 ponto de atributo. Cada Traço compra 1 Nó e seu efeito passa a valer imediatamente.",
    structure: "Cada Caminho está ligado a um atributo e possui 4 Trilhas de 8 Nós (totalizando 20 Trilhas e 160 Nós). O Perito pode comprar Nós de Caminhos diferentes livremente, mas dentro de uma mesma Trilha a ordem é obrigatória: para comprar o Nó 4, é necessário possuir os Nós 1, 2 e 3 daquela Trilha.",
    levelReq: "Cada Nó exige um Nível mínimo de Perito (Nv. 1, 2, 3, 5, 7, 9, 12 e 15), independente de quantos Traços estejam guardados. Traços excedentes ficam acumulados até que o Nível necessário seja alcançado.",
    attrReq: "Além do Nível, os Nós 5 a 8 (Nv. 7, 9, 12 e 15) de qualquer Trilha exigem que o Perito possua no mínimo 3 pontos no atributo daquele Caminho, e os Nós 7 e 8 (Nv. 12 e 15) exigem no mínimo 5 pontos. Um Perito com VIGOR 0 jamais alcança o topo do Caminho Eidolon: a carne dele simplesmente não aguenta."
  },

  paths: [
    {
      id: "eidolon",
      number: 1,
      name: "Caminho Eidolon",
      attribute: "VIGOR",
      attrKey: "vigor",
      color: "#e63946",
      tracks: [
        {
          id: "resiliencia",
          name: "Trilha da Resiliência",
          nodes: [
            { pos: 1, name: "Casca Grossa", level: 1, minAttr: 0, desc: "Vantagem no teste de VIGOR para não perder 1 Ponto de Vida por turno ao chegar a 0 de Vida." },
            { pos: 2, name: "Bloqueio Perfeito", level: 2, minAttr: 0, desc: "Ao defender, o teste de VIGOR DF6 para receber metade do dano ganha +2 no resultado." },
            { pos: 3, name: "Couro Endurecido", level: 3, minAttr: 0, desc: "Adiciona permanentemente +3 à fórmula base de Vida (VIGOR + 10)." },
            { pos: 4, name: "Sangue Frio", level: 5, minAttr: 0, desc: "Ignora a penalidade de -2 no atributo VIGOR causada pelo status Câncer." },
            { pos: 5, name: "Defesa Absoluta", level: 7, minAttr: 3, desc: "Um sucesso normal no teste de VIGOR DF6 da Defesa anula todo o dano inimigo, sem exigir 20 natural." },
            { pos: 6, name: "Muralha de Carne", level: 9, minAttr: 3, desc: "Ganha vantagem no teste de Contra-ação DF5 quando usa VIGOR para escapar." },
            { pos: 7, name: "Imortalidade Brutal", level: 12, minAttr: 5, desc: "Se passar de -5 de Vida, um acerto crítico (20) no teste de VIGOR estabiliza a Vida em -4." },
            { pos: 8, name: "Carcaça Indiferente", level: 15, minAttr: 5, desc: "Ignora todas as penalidades de dano passivo (sangramento, queimadura, veneno e afins)." }
          ]
        },
        {
          id: "folego",
          name: "Trilha do Fôlego",
          nodes: [
            { pos: 1, name: "Fôlego de Ferro", level: 1, minAttr: 0, desc: "Recupera 2 Pontos de Fôlego a cada 15 minutos, ao invés de apenas 1." },
            { pos: 2, name: "Salto Espectral", level: 2, minAttr: 0, desc: "Pular ou escalar passa a custar apenas 1 Ponto de Fôlego, ao invés de 2." },
            { pos: 3, name: "Explosão Adrenalínica", level: 3, minAttr: 0, desc: "1 Ponto de Fôlego permite correr 10m sem teste, dobrando a distância base de 5m." },
            { pos: 4, name: "Passada Inumana", level: 5, minAttr: 0, desc: "O turno de Movimentação permite caminhar 20m sem gastar Fôlego ou realizar testes." },
            { pos: 5, name: "Força Descomunal", level: 7, minAttr: 3, desc: "Ao gastar Fôlego para pagar a Dificuldade de um teste de força, o custo é cortado pela metade." },
            { pos: 6, name: "Segundo Pulmão", level: 9, minAttr: 3, desc: "Uma vez por cena, ao zerar o Fôlego, anula a penalidade de -[VIGOR] da Exaustão por 3 turnos." },
            { pos: 7, name: "Metabolismo Infinito", level: 12, minAttr: 5, desc: "O limite máximo de Pontos de Fôlego do Perito recebe +3." },
            { pos: 8, name: "Máquina Sem Descanso", level: 15, minAttr: 5, desc: "Zera a necessidade de 1 hora ou mais de descanso para sair do estado de Exaustão." }
          ]
        },
        {
          id: "ultraviolencia",
          name: "Trilha da Ultraviolência",
          nodes: [
            { pos: 1, name: "Punho de Chumbo", level: 1, minAttr: 0, desc: "Adiciona um teste de dano novamente como dano extra em ataques desarmados." },
            { pos: 2, name: "Esmagamento Crítico", level: 2, minAttr: 0, desc: "Acertos críticos em combate desarmado ou com armas cegas dobram o bônus de VIGOR no dano." },
            { pos: 3, name: "Primeiro Golpe", level: 3, minAttr: 0, desc: "Vantagem no teste de acerto do primeiro turno de qualquer combate." },
            { pos: 4, name: "Fúria Reativa", level: 5, minAttr: 0, desc: "Ganha +1 Ação de ataque no turno seguinte, caso tenha sofrido dano no turno anterior." },
            { pos: 5, name: "Impacto Sísmico", level: 7, minAttr: 3, desc: "Um ataque crítico empurra o alvo 5 metros para trás, derrubando-o se colidir." },
            { pos: 6, name: "Teimosia Bruta", level: 9, minAttr: 3, desc: "Todo resultado 1 na rolagem de dano físico é automaticamente convertido em 5." },
            { pos: 7, name: "Quebra-Guarda", level: 12, minAttr: 5, desc: "Ataques do Perito ignoram completamente bloqueios e defesas passivas do alvo." },
            { pos: 8, name: "Sentença de Carne", level: 15, minAttr: 5, desc: "Pode trocar suas 2 ações do turno por um único acerto automático, sem teste." }
          ]
        },
        {
          id: "carne-adaptavel",
          name: "Trilha da Carne Adaptável",
          nodes: [
            { pos: 1, name: "Limiar Rompido", level: 1, minAttr: 0, desc: "A Vida Máxima do Perito pode ultrapassar o teto definido na criação de ficha." },
            { pos: 2, name: "Crescimento Anômalo", level: 2, minAttr: 0, desc: "Recebe +1d4 extra de Vida a cada nível de Conhecimento completado." },
            { pos: 3, name: "Coágulo Instantâneo", level: 3, minAttr: 0, desc: "Imunidade total a sangramento e à perda contínua de Vida por ferimentos abertos." },
            { pos: 4, name: "Pele de Osso", level: 5, minAttr: 0, desc: "Reduz em 1 o dano de todo e qualquer ataque recebido." },
            { pos: 5, name: "Marcha Infinita", level: 7, minAttr: 3, desc: "Ignora a dificuldade adicional gerada por distância extra na locomoção em combate." },
            { pos: 6, name: "Predador Voraz", level: 9, minAttr: 3, desc: "Ganha +1 Ponto de Fôlego cada vez que abate um inimigo." },
            { pos: 7, name: "Transfusão Profana", level: 12, minAttr: 5, desc: "Pode converter qualquer cura de Sanidade recebida em cura de Vida, ponto a ponto." },
            { pos: 8, name: "Escudo de Carne", level: 15, minAttr: 5, desc: "Pode assumir o dano destinado a um aliado adjacente, recebendo-o integralmente." }
          ]
        }
      ]
    },
    {
      id: "profetico",
      number: 2,
      name: "Caminho Profético",
      attribute: "ACUIDADE",
      attrKey: "acuidade",
      color: "#2ecc71",
      tracks: [
        {
          id: "iniciativa",
          name: "Trilha da Iniciativa",
          nodes: [
            { pos: 1, name: "Reflexos Afiados", level: 1, minAttr: 0, desc: "Ganha +2 de bônus na rolagem de ACUIDADE que define a ordem de Iniciativa." },
            { pos: 2, name: "Premonição", level: 2, minAttr: 0, desc: "Em caso de empate na Iniciativa, o Perito é sempre o primeiro a agir, ignorando a decisão do grupo." },
            { pos: 3, name: "Contra-Ação Precisa", level: 3, minAttr: 0, desc: "Rola o teste de Contra-ação DF5 com Vantagem sempre que usar ACUIDADE." },
            { pos: 4, name: "Janela Aberta", level: 5, minAttr: 0, desc: "Um acerto crítico na Contra-ação concede +2 Ações Bônus, ao invés de apenas 1." },
            { pos: 5, name: "Abertura Profética", level: 7, minAttr: 3, desc: "Todos os inimigos rolam o primeiro teste de acerto do combate com desvantagem." },
            { pos: 6, name: "Leitura de Movimento", level: 9, minAttr: 3, desc: "Pode substituir VIGOR por ACUIDADE no teste DF6 de redução de dano da Defesa." },
            { pos: 7, name: "Nunca Surpreso", level: 12, minAttr: 5, desc: "Age normalmente no primeiro turno mesmo em emboscadas ou situações de surpresa." },
            { pos: 8, name: "Interrupção", level: 15, minAttr: 5, desc: "Gaste 1 Ação Bônus para interromper e cancelar um ataque inimigo declarado contra você." }
          ]
        },
        {
          id: "percepcao",
          name: "Trilha da Percepção",
          nodes: [
            { pos: 1, name: "Olhos de Águia", level: 1, minAttr: 0, desc: "Vantagem em testes de ACUIDADE para encontrar objetos ocultos, perdidos ou investigar cenas." },
            { pos: 2, name: "Mãos Leves", level: 2, minAttr: 0, desc: "Arrombar fechaduras e consertar objetos pequenos passa a consumir apenas 1 Ação Bônus." },
            { pos: 3, name: "Rastreio Obcecado", level: 3, minAttr: 0, desc: "Não sofre penalidades em testes de ACUIDADE de procura, mesmo em estado de Exaustão." },
            { pos: 4, name: "Socorrista Rápido", level: 5, minAttr: 0, desc: "Vantagem no teste de ACUIDADE para impedir a morte de um aliado com a Vida zerada." },
            { pos: 5, name: "Foco Etílico", level: 7, minAttr: 3, desc: "Anula a penalidade de -2 em ACUIDADE causada pelo status Embriagado." },
            { pos: 6, name: "Vista Noturna", level: 9, minAttr: 3, desc: "Enxerga normalmente em escuridão parcial e não sofre penalidade por pouca iluminação." },
            { pos: 7, name: "Cálculo Frio", level: 12, minAttr: 5, desc: "O Espectador deve revelar a Dificuldade exata de um teste antes que o Perito role o dado." },
            { pos: 8, name: "Quase Certo", level: 15, minAttr: 5, desc: "Falhas normais (não críticas) em testes de ACUIDADE contam como sucesso parcial, a critério do Espectador." }
          ]
        },
        {
          id: "atirador",
          name: "Trilha do Atirador",
          nodes: [
            { pos: 1, name: "Gatilho Firme", level: 1, minAttr: 0, desc: "Numa Falha Crítica (1) com armas de longa distância, gaste 2 de Fôlego para rerrolar e aceitar o novo resultado." },
            { pos: 2, name: "Calibre Pesado", level: 2, minAttr: 0, desc: "Todo ataque bem sucedido com armas de longa distância causa +1d6 de dano." },
            { pos: 3, name: "Recarga Súbita", level: 3, minAttr: 0, desc: "Recarregar armas de longa distância exige apenas 1 Ação Bônus, ao invés de 1 Ação completa." },
            { pos: 4, name: "Tiro de Sorte", level: 5, minAttr: 0, desc: "Uma vez por sessão, pode forçar um acerto normal de arma a se tornar Acerto Crítico (dano máximo)." },
            { pos: 5, name: "Disparo de Cobertura", level: 7, minAttr: 3, desc: "Gaste 1 Ação Bônus: o próximo inimigo a atacar rola com Desvantagem." },
            { pos: 6, name: "Ângulo Impossível", level: 9, minAttr: 3, desc: "Ignora completamente meia-cobertura inimiga no cálculo da Dificuldade do disparo." },
            { pos: 7, name: "Crítico Sanguinário", level: 12, minAttr: 5, desc: "Acertos críticos com armas de longa distância causam o dano máximo + 1d6 extra cumulativo." },
            { pos: 8, name: "Reflexo Ofensivo", level: 15, minAttr: 5, desc: "Um 20 natural na Contra-ação DF5 concede uma Ação Bônus que pode ser gasta num disparo imediato." }
          ]
        },
        {
          id: "evasao",
          name: "Trilha da Evasão",
          nodes: [
            { pos: 1, name: "Passo Silencioso", level: 1, minAttr: 0, desc: "Todos os testes de furtividade são rolados com Vantagem." },
            { pos: 2, name: "Alvo Escorregadio", level: 2, minAttr: 0, desc: "A Dificuldade da Contra-ação do inimigo contra suas ações sobe de DF6 para DF8." },
            { pos: 3, name: "Reposicionamento", level: 3, minAttr: 0, desc: "Pode se mover 5m gratuitamente por turno sem provocar ataques de oportunidade." },
            { pos: 4, name: "Memória Muscular", level: 5, minAttr: 0, desc: "Ignora a penalidade de -1 em ACUIDADE causada por Perda de Memória (-21 a -30 de Sanidade)." },
            { pos: 5, name: "Queda Controlada", level: 7, minAttr: 3, desc: "Todo dano de queda sofrido é reduzido à metade, arredondando para baixo." },
            { pos: 6, name: "Esquiva Instintiva", level: 9, minAttr: 3, desc: "Esquivar deixa de consumir Ação ou Ação Bônus do turno." },
            { pos: 7, name: "Isca Falsa", level: 12, minAttr: 5, desc: "Gaste 1 Ação Bônus para criar uma distração: um inimigo perde o alvo até o próximo turno." },
            { pos: 8, name: "Ponto Cego", level: 15, minAttr: 5, desc: "Se permanecer imóvel por um turno completo, torna-se efetivamente invisível por 1 turno." }
          ]
        }
      ]
    },
    {
      id: "real",
      number: 3,
      name: "Caminho Real",
      attribute: "PSICOMETRIA",
      attrKey: "psicometria",
      color: "#facc15",
      secondaryColor: "#3b82f6",
      tracks: [
        {
          id: "sapiencia",
          name: "Trilha da Sapiência",
          nodes: [
            { pos: 1, name: "Sinergia Cognitiva", level: 1, minAttr: 0, desc: "A penalidade do sub-atributo secundário de PSICOMETRIA é reduzida de -3 para -1." },
            { pos: 2, name: "Lábia Inabalável", level: 2, minAttr: 0, desc: "Vantagem em persuadir ou perceber mentiras. Falhar custa 1d4 de Sanidade pela frustração." },
            { pos: 3, name: "Comando Social", level: 3, minAttr: 0, desc: "Pode anular a falha de um aliado no teste de ficar para trás causado pela Depressão Leve." },
            { pos: 4, name: "Oratória de Batalha", level: 5, minAttr: 0, desc: "Gaste 1 Ação Bônus para conceder +1 no teste de Acerto de um aliado próximo." },
            { pos: 5, name: "Réplica Afiada", level: 7, minAttr: 3, desc: "Vantagem em toda Contra-ação de natureza social, verbal ou de intimidação." },
            { pos: 6, name: "Consenso Forçado", level: 9, minAttr: 3, desc: "Anula testes obrigatórios em grupo impostos por distúrbios mentais dos aliados." },
            { pos: 7, name: "Diplomacia Blasfema", level: 12, minAttr: 5, desc: "Pode convencer Indizíveis de nível menor que o seu a recuar sem combate." },
            { pos: 8, name: "Voz de Comando", level: 15, minAttr: 5, desc: "Uma vez por sessão, dita uma ordem absoluta: um alvo obedece por 1 turno completo." }
          ]
        },
        {
          id: "inteligencia",
          name: "Trilha da Inteligência",
          nodes: [
            { pos: 1, name: "Mente Analítica", level: 1, minAttr: 0, desc: "Gaste 1 Ponto de Fôlego para reduzir a Dificuldade ao decifrar criptografias e padrões." },
            { pos: 2, name: "Alquimista Prático", level: 2, minAttr: 0, desc: "Anula a extrema dificuldade de usar itens medicinais sob Esquizofrenia Hebefrênica." },
            { pos: 3, name: "Invasão Silenciosa", level: 3, minAttr: 0, desc: "Invadir sistemas, redes elétricas e computadores passa a consumir apenas 1 Ação Bônus." },
            { pos: 4, name: "Memória Fotográfica", level: 5, minAttr: 0, desc: "Lembra com perfeição de qualquer detalhe de cenário já descrito pelo Espectador." },
            { pos: 5, name: "Leitura de Fraqueza", level: 7, minAttr: 3, desc: "Gaste 1 Ação para que o Espectador revele uma fraqueza concreta de um inimigo." },
            { pos: 6, name: "Segunda Dedução", level: 9, minAttr: 3, desc: "Pode rerrolar qualquer teste de dedução ou identificação de padrões, uma vez por cena." },
            { pos: 7, name: "Erudição Absoluta", level: 12, minAttr: 5, desc: "O reforço total do sub-atributo Inteligência recebe +2 permanentes." },
            { pos: 8, name: "Improviso Técnico", level: 15, minAttr: 5, desc: "Ignora enguiços, falhas e limitações tecnológicas de qualquer equipamento em uso." }
          ]
        },
        {
          id: "terapia",
          name: "Trilha da Terapia",
          nodes: [
            { pos: 1, name: "Escuta Ativa", level: 1, minAttr: 0, desc: "Uma sessão de Terapia passa a restaurar 1d6+2 Pontos de Sanidade, ao invés de 1d6." },
            { pos: 2, name: "Empatia Terapêutica", level: 2, minAttr: 0, desc: "Rolagens 1 e 2 no 1d6 de uma sessão de Terapia viram automaticamente 3." },
            { pos: 3, name: "Terapia de Grupo", level: 3, minAttr: 0, desc: "Uma única sessão de Terapia passa a afetar 2 aliados ao mesmo tempo." },
            { pos: 4, name: "Ancoragem", level: 5, minAttr: 0, desc: "Aliados que sofram de qualquer grau de ansiedade recuperam +2 de Sanidade extra na Terapia." },
            { pos: 5, name: "Autoanálise", level: 7, minAttr: 3, desc: "O Perito pode aplicar uma sessão de Terapia em si mesmo, com efeito integral." },
            { pos: 6, name: "Alta Médica", level: 9, minAttr: 3, desc: "Um acerto crítico no 1d6 da Terapia remove permanentemente 1 Distúrbio do paciente." },
            { pos: 7, name: "Respiro Coletivo", level: 12, minAttr: 5, desc: "Toda sessão de Terapia também restaura 2 Pontos de Fôlego a quem a recebe." },
            { pos: 8, name: "Plantão Eterno", level: 15, minAttr: 5, desc: "Deixa de existir o limite de uma sessão de Terapia por sessão de jogo." }
          ]
        },
        {
          id: "foco-mental",
          name: "Trilha do Foco Mental",
          nodes: [
            { pos: 1, name: "Foco na Crise", level: 1, minAttr: 0, desc: "Contorna a insônia da Ansiedade Moderada, recebendo 100% do descanso longo ao invés de 50%." },
            { pos: 2, name: "Máscara Social", level: 2, minAttr: 0, desc: "Não sofre a penalidade de interação social imposta pela Ansiedade Grave." },
            { pos: 3, name: "Âncora Racional", level: 3, minAttr: 0, desc: "Aumenta permanentemente a Sanidade Máxima do Perito em +1." },
            { pos: 4, name: "Nunca em Branco", level: 5, minAttr: 0, desc: "Anula o efeito de Falha Crítica (1) em qualquer teste de PSICOMETRIA." },
            { pos: 5, name: "Meditação Ativa", level: 7, minAttr: 3, desc: "Uma meditação de 5 minutos recupera 2 Pontos de Fôlego, sem necessidade de descanso." },
            { pos: 6, name: "Muro Mental", level: 9, minAttr: 3, desc: "Bloqueia leitura mental, sugestão e influência psíquica de Indizíveis e Peritos." },
            { pos: 7, name: "Fardo Compartilhado", level: 12, minAttr: 5, desc: "Pode dividir igualmente qualquer dano de Sanidade recebido com um aliado voluntário." },
            { pos: 8, name: "Descrença Treinada", level: 15, minAttr: 5, desc: "Imunidade total a ilusões e alucinações induzidas de baixo nível." }
          ]
        }
      ]
    },
    {
      id: "anciao",
      number: 4,
      name: "Caminho Ancião",
      attribute: "ESOTERISMO",
      attrKey: "esoterismo",
      color: "#a855f7",
      tracks: [
        {
          id: "conjurador",
          name: "Trilha do Conjurador",
          nodes: [
            { pos: 1, name: "Empréstimo Profano", level: 1, minAttr: 0, desc: "Permite manter a Sanidade abaixo de 0 ao conjurar, recuperando ao final do combate. O Perito ainda sofre os efeitos da insanidade no processo." },
            { pos: 2, name: "Amplificação Verbal", level: 2, minAttr: 0, desc: "Cada conjunto extra de palavras na magia garante +1d6 no efeito, ao invés de +1d4." },
            { pos: 3, name: "Conhecimento Além", level: 3, minAttr: 0, desc: "Pode conjurar rituais de nível superior ao seu ESOTERISMO atual, sofrendo o dobro do dano base de Sanidade." },
            { pos: 4, name: "Verbo Truncado", level: 5, minAttr: 0, desc: "Dispensa a Palavra de Impulso na estrutura da conjuração, exigindo apenas Verbal e Poder." },
            { pos: 5, name: "Poder Sobre Verbo", level: 7, minAttr: 3, desc: "Pode substituir uma Palavra Verbal ausente por uma Palavra de Poder do seu repertório." },
            { pos: 6, name: "Eco Persistente", level: 9, minAttr: 3, desc: "Dobra a duração de efeito de todas as magias conjuradas pelo Perito." },
            { pos: 7, name: "Barganha Eficiente", level: 12, minAttr: 5, desc: "Reduz em 1 o custo de Sanidade de toda magia de Classe 3 ou superior." },
            { pos: 8, name: "Conjuração Dupla", level: 15, minAttr: 5, desc: "Pode conjurar 2 magias de conjunto único num mesmo turno, pagando ambos os custos." }
          ]
        },
        {
          id: "ritualista",
          name: "Trilha do Ritualista",
          nodes: [
            { pos: 1, name: "Canalização Rápida", level: 1, minAttr: 0, desc: "Reduz pela metade o tempo de preparo de Rituais (desenhos, símbolos e relíquias)." },
            { pos: 2, name: "Catalisador Mental", level: 2, minAttr: 0, desc: "Ignora a necessidade física do objeto de gatilho pagando +2 pontos de Sanidade." },
            { pos: 3, name: "Ordem Corrompida", level: 3, minAttr: 0, desc: "O Ritual funciona normalmente mesmo com 1 erro na ordem das etapas de preparo." },
            { pos: 4, name: "Círculo Expandido", level: 5, minAttr: 0, desc: "Todo Ritual com área de efeito tem seu alcance dobrado." },
            { pos: 5, name: "Ritual Vazio", level: 7, minAttr: 3, desc: "Anula completamente o custo material e de componentes de qualquer Ritual." },
            { pos: 6, name: "Bênção Enferrujada", level: 9, minAttr: 3, desc: "Rituais bem sucedidos também restauram 1d6 de Vida a todos os participantes." },
            { pos: 7, name: "Assinatura Oculta", level: 12, minAttr: 5, desc: "Esconde o rastro esotérico do Ritual, impedindo que Indizíveis o rastreiem." },
            { pos: 8, name: "Ritual Imediato", level: 15, minAttr: 5, desc: "Uma vez por arco narrativo, executa um Ritual completo sem tempo de preparo algum." }
          ]
        },
        {
          id: "veu",
          name: "Trilha do Véu",
          nodes: [
            { pos: 1, name: "Sussurros Familiares", level: 1, minAttr: 0, desc: "Ignora a perda passiva de 1 ponto de Sanidade a cada 15 minutos em ambientes com Indizíveis." },
            { pos: 2, name: "Iluminação Traumática", level: 2, minAttr: 0, desc: "Ao acessar uma imagem do LIMIAR (2d20 de dano mental), role 3d20 e descarte o maior dado." },
            { pos: 3, name: "Andarilho do Véu", level: 3, minAttr: 0, desc: "Passa a perder Sanidade periodicamente apenas quando engajado diretamente em combate com o Indizível." },
            { pos: 4, name: "Olhar Aferidor", level: 5, minAttr: 0, desc: "Identifica o nível exato de qualquer criatura do LIMIAR apenas encarando-a." },
            { pos: 5, name: "Verbo de Repulsa", level: 7, minAttr: 3, desc: "Gaste 1 Ação e role ESOTERISMO contra DF5 para repelir fisicamente um Indizível." },
            { pos: 6, name: "Sangue Anátema", level: 9, minAttr: 3, desc: "O sangue do Perito queima Indizíveis: quem o atacar corpo a corpo sofre 1d6 de dano." },
            { pos: 7, name: "Passo Fora do Véu", level: 12, minAttr: 5, desc: "Torna-se imperceptível para criaturas do LIMIAR por 1 cena, uma vez por sessão." },
            { pos: 8, name: "Contra-Conjuração", level: 15, minAttr: 5, desc: "Absorve integralmente 1 magia inimiga por combate, anulando seu efeito." }
          ]
        },
        {
          id: "sacrificio",
          name: "Trilha do Sacrifício",
          nodes: [
            { pos: 1, name: "Dízimo de Sangue", level: 1, minAttr: 0, desc: "Pode pagar custos de Sanidade com Pontos de Vida, na proporção de 2 de Vida para 1 de Sanidade." },
            { pos: 2, name: "Graça Crítica", level: 2, minAttr: 0, desc: "Um acerto crítico na conjuração zera completamente o custo de Sanidade da magia." },
            { pos: 3, name: "Queima Vital", level: 3, minAttr: 0, desc: "Pode queimar Pontos de Fôlego no lugar de Sanidade, na proporção de 1 para 1." },
            { pos: 4, name: "Cordeiro", level: 5, minAttr: 0, desc: "Pode sacrificar a Vida de um aliado consciente e voluntário para conjurar sem custo algum." },
            { pos: 5, name: "Agonia Amplificada", level: 7, minAttr: 3, desc: "O dano mágico do Perito aumenta em +1 para cada 5 Pontos de Vida que lhe faltam." },
            { pos: 6, name: "Retorno Espelhado", level: 9, minAttr: 3, desc: "Todo dano de Sanidade sofrido em combate é convertido em dano mágico na próxima magia." },
            { pos: 7, name: "Segunda Vinda", level: 12, minAttr: 5, desc: "Ao morrer, uma magia ativa se rompe e devolve o Perito à vida com 1 Ponto de Vida. Uma vez por arco." },
            { pos: 8, name: "Última Palavra", level: 15, minAttr: 5, desc: "Conjuração final: o Perito morre permanentemente, mas destrói por completo um único alvo." }
          ]
        }
      ]
    },
    {
      id: "loucura",
      number: 5,
      name: "Caminho da Loucura",
      attribute: "RAZÃO",
      attrKey: "razao",
      color: "#d4af37",
      tracks: [
        {
          id: "epifania",
          name: "Trilha da Epifania",
          nodes: [
            { pos: 1, name: "Epifania", level: 1, minAttr: 0, desc: "Ao chegar em 100% de Conhecimento, ganha 50% de chance de curar a Sanidade Total." },
            { pos: 2, name: "Catarse", level: 2, minAttr: 0, desc: "A chance do teste de porcentagem da Epifania sobe de 50% para 100%." },
            { pos: 3, name: "Mente Ancorada", level: 3, minAttr: 0, desc: "Se falhar no d100 da Epifania, recupera automaticamente metade da Sanidade Máxima." },
            { pos: 4, name: "Equilibrista Nato", level: 5, minAttr: 0, desc: "Ao chegar a 0 de Sanidade, rola o teste de RAZÃO para não ficar Insano com Vantagem." },
            { pos: 5, name: "Cicatriz Lúcida", level: 7, minAttr: 3, desc: "Ignora a penalidade de -5 em todos os testes do Dano Cerebral Permanente (-41 a -50)." },
            { pos: 6, name: "Alma Teimosa", level: 9, minAttr: 3, desc: "O dado de Sanidade ao subir de nível passa a ser 1d6 (ao invés de 1d4)." },
            { pos: 7, name: "Clareza Crescente", level: 12, minAttr: 5, desc: "Recebe +1d4 extra de Sanidade a cada nível de Conhecimento completo." },
            { pos: 8, name: "Fio da Consciência", level: 15, minAttr: 5, desc: "Ignora a Morte Cerebral ao passar de -71, estabilizando permanentemente em -70." }
          ]
        },
        {
          id: "paranoia-psicose",
          name: "Trilha da Paranoia e Psicose",
          nodes: [
            { pos: 1, name: "Blindagem Paranóica", level: 1, minAttr: 0, desc: "Na Paranoia Severa (-1 a -10), perde Sanidade a cada 25 minutos, não mais a cada 15." },
            { pos: 2, name: "Fúria Psicótica", level: 2, minAttr: 0, desc: "Sob Psicose Grave (-11 a -20), recebe +2 em todos os testes de Acerto em combate." },
            { pos: 3, name: "Toque Fantasma", level: 3, minAttr: 0, desc: "Sob Toques Fantasmas (-31 a -40), pode anular 1 ataque inimigo por combate." },
            { pos: 4, name: "Raiva Convertida", level: 5, minAttr: 0, desc: "A Agressividade converte metade do dano recebido em bônus de dano no próximo ataque." },
            { pos: 5, name: "Vazio Concentrado", level: 7, minAttr: 3, desc: "A Perda de Memória deixa de atrapalhar e concede +2 em VIGOR pela ausência de medo." },
            { pos: 6, name: "Primeiro Choque", level: 9, minAttr: 3, desc: "Ignora completamente o primeiro dano de Sanidade sofrido em cada combate." },
            { pos: 7, name: "Boca Fechada", level: 12, minAttr: 5, desc: "Aliados deixam de perder Sanidade por causa das falas e surtos do Perito fora de combate." },
            { pos: 8, name: "Loucura Restauradora", level: 15, minAttr: 5, desc: "O status Insano passa a curar 1d6 de Vida por golpe mental, ao invés de dobrar o dano." }
          ]
        },
        {
          id: "medo",
          name: "Trilha do Medo",
          nodes: [
            { pos: 1, name: "Motor do Caos", level: 1, minAttr: 0, desc: "Com Esquizofrenia Catatônica, ganha Vantagem no teste para agir duas vezes ao invés de travar." },
            { pos: 2, name: "Pânico Contagioso", level: 2, minAttr: 0, desc: "A crise de 30% da Ansiedade Grave passa a ser repassada ao inimigo mais próximo." },
            { pos: 3, name: "Peso Suportável", level: 3, minAttr: 0, desc: "A Depressão Grave deixa de exigir o teste adicional de RAZÃO contra a própria vida." },
            { pos: 4, name: "Conselheiro Invisível", level: 5, minAttr: 0, desc: "Com Esquizofrenia Paranoide, os sussurros passam a conter uma dica real do Espectador por cena." },
            { pos: 5, name: "Organismo Adaptado", level: 7, minAttr: 3, desc: "Os Distúrbios do Perito deixam de exigir medicação diária para não se agravarem." },
            { pos: 6, name: "Sinfonia de Sintomas", level: 9, minAttr: 3, desc: "Ganha +1 de dano em todos os ataques para cada Distúrbio ativo que possuir." },
            { pos: 7, name: "Contágio Mental", level: 12, minAttr: 5, desc: "Uma vez por combate, transmite um Distúrbio temporário a um alvo por 3 turnos." },
            { pos: 8, name: "Remissão Súbita", level: 15, minAttr: 5, desc: "Uma vez por arco narrativo, cura instantaneamente 1 Distúrbio à sua escolha." }
          ]
        },
        {
          id: "caos",
          name: "Trilha do Caos",
          nodes: [
            { pos: 1, name: "Lucidez Corrompida", level: 1, minAttr: 0, desc: "Ao atingir o status Insano, ignora o multiplicador de 2x dano de Sanidade no próximo golpe mental." },
            { pos: 2, name: "Psiquiatra de Si", level: 2, minAttr: 0, desc: "Anula narrativamente todos os efeitos de Desânimo Social da Depressão Leve." },
            { pos: 3, name: "Substituição Insana", level: 3, minAttr: 0, desc: "Enquanto Insano, pode usar RAZÃO no lugar de qualquer outro atributo em testes." },
            { pos: 4, name: "Lógica Quebrada", level: 5, minAttr: 0, desc: "Sua Contra-ação com RAZÃO passa a ser DF4, ao invés da DF5 padrão." },
            { pos: 5, name: "Combustão Mental", level: 7, minAttr: 3, desc: "Cada ponto de dano mental recebido gera 1 Ponto de Fôlego imediatamente." },
            { pos: 6, name: "Grito Interno", level: 9, minAttr: 3, desc: "Pode zerar todo o Fôlego atual para curar 2d6 Pontos de Sanidade." },
            { pos: 7, name: "Iniciativa Delirante", level: 12, minAttr: 5, desc: "Com Sanidade negativa, pode rolar a Iniciativa usando RAZÃO no lugar de ACUIDADE." },
            { pos: 8, name: "Suicídio Tático", level: 15, minAttr: 5, desc: "Ao chegar em -71 de Sanidade, o Perito colapsa e mata tudo que estiver ao seu redor." }
          ]
        }
      ]
    }
  ],

  magicAndRituals: {
    revelations: {
      illuminationChance: "Ao receber uma Iluminação (100% de Conhecimento), o Perito pode aprender uma Magia ou Ritual. A chance base de obter é de 25%, aumentando em +5% para cada Traço de Revelação investido na Árvore de Conhecimento, podendo chegar até 65% de chance.",
      dreamChance: "Ao dormir, dependendo do nível de Conhecimento do Perito, o Espectador pode conceder uma Revelação, geralmente quando o Nível de Conhecimento é >75%, sendo que a chance é de apenas 5% (diferentemente de quando a barra atinge os 100%).",
      uncontrolledChoice: "O Perito jamais escolhe as magias e rituais que lhe são revelados através das Iluminações; entretanto, independente do efeito do Ritual/Magia, o mesmo será explicado pelo Espectador ao recebê-lo e todos os detalhes (duração, efeito, tempo de preparo, itens) devem ser anotados pelo jogador."
    },
    spells: {
      overview: "Geralmente magias envolvem gatilhos psicológicos para serem utilizadas, normalmente reveladas em sonhos, mas podendo também ser encontradas em livros e registros ocultistas. Magias baseadas em mantra ou livro ficam isentas da necessidade de um repertório de palavras.",
      structure: [
        { type: "1x Palavra Verbal", color: "#ff0000", desc: "Primeira palavra do conjunto de conjuração." },
        { type: "1x Palavra de Poder", color: "#ffff00", desc: "Segunda palavra do conjunto de conjuração." },
        { type: "1x Palavra de Impulso", color: "#9900ff", desc: "Terceira palavra do conjunto de conjuração." }
      ],
      rules: [
        "Proporção de Repertório: A quantidade de cada tipo de palavra deve ser a mesma entre elas (se conhecer 3 palavras Verbais, deve saber 3 de Poder e 3 de Impulso).",
        "Custo em Sanidade (Classes 1 a 5): Cada palavra tem uma Classe de 1 a 5. Cada conjunto custa em Sanidade sempre o valor da palavra mais cara do conjunto.",
        "Recuperação ao Fim do Combate: Pontos de Sanidade perdidos ao conjurar magias são restaurados ao final do combate, SOMENTE se o conjurador permanecer acima de 0 de Sanidade até o final do mesmo.",
        "Conjuntos Extras e Turnos: Grande parte das magias exige apenas 1 conjunto (1 turno). Usar conjuntos extras exige mais turnos de preparação (ex: 2 conjuntos = 2 turnos), adiciona +1d4 no efeito por conjunto extra (ou +1d6 com 'Amplificação Verbal') e amplifica o efeito narrativo.",
        "Efeitos Adaptativos: Os efeitos nunca são fixos; o Espectador sempre deve fornecer o efeito mais conveniente para o conjurador na situação em que ele conjura."
      ],
      examples: [
        {
          incantation: "Gof'nnn gn'th'bthnk mg'nglui",
          name: "Spawn Blood Barrier",
          breakdown: [
            { word: "Gof'nnn", type: "Palavra Verbal", classLevel: 1, color: "#ff0000" },
            { word: "Gn'th'bthnk", type: "Palavra de Poder", classLevel: 3, color: "#ffff00" },
            { word: "Mg'nglui", type: "Palavra de Impulso", classLevel: 2, color: "#9900ff" }
          ],
          cost: "3 Pontos de Sanidade (pela palavra de Classe 3)",
          effect: "Cria uma barreira de sangue protetora."
        },
        {
          incantation: "Uln Mgleth mgn'ghftephai",
          name: "Conjurar Visão Verdadeira",
          breakdown: [
            { word: "Uln", type: "Palavra Verbal", classLevel: "—", color: "#ff0000" },
            { word: "Mgleth", type: "Palavra de Poder", classLevel: "—", color: "#ffff00" },
            { word: "mgn'ghftephai", type: "Palavra de Impulso", classLevel: "—", color: "#9900ff" }
          ],
          cost: "Variável conforme classe do conjunto",
          effect: "Fornece ao conjurador visão no escuro; entretanto, quanto mais conjuntos utilizados, maior o efeito, podendo até mesmo enxergar através de paredes ou até mesmo no futuro."
        }
      ]
    },
    rituals: {
      overview: "Diferentemente de Magias, os Rituais são feitos seguindo uma série de etapas — quanto mais etapas, mais complexo. O sucesso não depende de um teste de atributo, mas da execução correta de cada etapa na ordem certa.",
      mechanics: [
        { title: "Etapas", desc: "Componentes do ritual (desenhos, símbolos, glifos, incensos ou relíquias) realizados em ordem." },
        { title: "Tempo de Execução", desc: "Diferente das magias que gastam turnos, rituais levam minutos reais para serem concluídos." },
        { title: "Componentes", desc: "O Perito deve possuir os materiais descritos (ex: giz ritualístico, sangue, objetos de valor sentimental). A ausência de um item torna o ritual impossível." },
        { title: "Sanidade Fixa", desc: "Todo ritual tem um custo de Sanidade fixo para ser iniciado, representando o preço de 'rasgar o véu' para realizar a alteração (não conta para a barra de Conhecimento)." },
        { title: "Efeito Duradouro", desc: "Criam efeitos persistentes: barreiras de proteção por horas, curar um grupo inteiro ou selar um portal." }
      ],
      tiers: [
        {
          level: "Nível 1–3",
          prepTime: "5 minutos de preparo",
          requirements: "Exige poucos materiais.",
          effects: "Efeitos simples como purificação de um objeto."
        },
        {
          level: "Nível 4–6",
          prepTime: "8 minutos de preparo",
          requirements: "Exige símbolos complexos no ambiente e componentes específicos.",
          effects: "Efeitos como curas em área ou detecção de entidades."
        },
        {
          level: "Nível 7+",
          prepTime: "12 minutos de preparo",
          requirements: "Exige preparativos grandiosos e sacrifícios significativos.",
          effects: "Efeitos que alteram a realidade local ou interagem diretamente com Indizíveis superiores (Ex: COROAÇÃO — Ritual de Nível 8)."
        }
      ]
    }
  },

  items: {
    medical: [
      { name: "Gaze", category: "Medicinal", color: "#38bdf8", roll: "1d4", rollType: "Cura de Vida", effect: "Recupera 1d4 de Vida." },
      { name: "Esparadrapos", category: "Medicinal", color: "#f59e0b", roll: null, effect: "Remove Tick de Sangramento." },
      { name: "Antisséptico", category: "Medicinal", color: "#a855f7", roll: null, effect: "Remove Tick de Infecção." },
      { name: "Água Oxigenada", category: "Medicinal", color: "#06b6d4", roll: "1d4", rollType: "Dano colateral de Vida", effect: "Remove todos os Ticks de Infecção; causa -1d4 de Vida." },
      { name: "Kit de Sutura", category: "Medicinal", color: "#ef4444", roll: null, effect: "Fecha feridas abertas." },
      { name: "Alicate", category: "Medicinal", color: "#f97316", roll: null, effect: "Remove estilhaços cravados na carne." },
      { name: "Prozac", category: "Medicinal", color: "#ff69b4", roll: null, effect: "Utilizado para tratamento da Depressão." },
      { name: "Zoloft", category: "Medicinal", color: "#00ff29", roll: null, effect: "Utilizado para tratamento de Depressão Grave." },
      { name: "Ziprasidona", category: "Medicinal", color: "#eab308", roll: null, effect: "Utilizado para controle da Esquizofrenia." },
      { name: "Clonazepam", category: "Medicinal", color: "#a78bfa", roll: null, effect: "Utilizado para controle da Ansiedade." }
    ],
    psychoactive: [
      { name: "Cigarros Baratos", category: "Psicoativo", color: "#b45309", roll: "1d4", rollType: "Sanidade", effect: "Recupera 1d4 de Sanidade (1% de chance de Câncer de Pulmão)." },
      { name: "Cigarros de Marca", category: "Psicoativo", color: "#d97706", roll: "1d8", rollType: "Sanidade", effect: "Recupera 1d8 de Sanidade (2% de chance de Câncer de Pulmão)." },
      { name: "Charuto", category: "Psicoativo", color: "#854d0e", roll: "1d12", rollType: "Sanidade", effect: "Recupera 1d12 de Sanidade (3% de chance de Câncer de Pulmão)." },
      { name: "Narguilé", category: "Psicoativo", color: "#0d9488", roll: "3d12", rollType: "Sanidade", effect: "Recupera 3d12 de Sanidade (10% de chance de Câncer de Pulmão)." },
      { name: "Balinha de LSD", category: "Psicoativo", color: "#f43f5e", roll: "2d8", rollType: "Sanidade", effect: "Recupera 2d8 de Sanidade; causa 5 minutos de alucinações." },
      { name: "Pino de Cocaína", category: "Psicoativo", color: "#38bdf8", roll: "1d8", rollType: "Sanidade", effect: "Recupera 1d8 de Sanidade; causa 5 minutos de irritabilidade." },
      { name: "Seringa de Fentanila", category: "Psicoativo", color: "#dc2626", roll: "3d12", rollType: "Sanidade", effect: "Recupera 3d12 de Sanidade; 30% de chance de Blackout por 1 minuto." },
      { name: "Pedra de Crack", category: "Psicoativo", color: "#9333ea", roll: null, effect: "Recupera a Sanidade inteira; causa alucinação severa por 10 minutos." },
      { name: "Pílula de MD", category: "Psicoativo", color: "#ec4899", roll: null, effect: "Anula perda de Sanidade por exposição." },
      { name: "Adesivo de Nicotina", category: "Psicoativo", color: "#10b981", roll: "1d6", rollType: "Sanidade", effect: "Recupera 1d6 de Sanidade, alivia sintomas de ansiedade, demora 1 minuto para fazer efeito." },
      { name: "Bebidas Alcoólicas", category: "Psicoativo", color: "#eab308", roll: "1d12", rollType: "Sanidade", effect: "Recuperam 1d12 de Sanidade; ao consumir 3 seguidas, aplica o status Embriagado (-2 em ACUIDADE)." }
    ],
    melee: [
      { name: "Facas", category: "Corpo-a-Corpo", color: "#ef4444", roll: "1d4", effect: "1d4 de dano + 1 Tick de Sangramento." },
      { name: "Martelos", category: "Corpo-a-Corpo", color: "#f59e0b", roll: "1d6", effect: "1d6 de dano + Chance de Stun por 1 Turno. (+VIGOR se arma cega)" },
      { name: "Ferramentas Grandes", category: "Corpo-a-Corpo", color: "#10b981", roll: "2d6", effect: "2d6 de dano." },
      { name: "Machados", category: "Corpo-a-Corpo", color: "#dc2626", roll: "3d6", effect: "3d6 de dano." },
      { name: "Canos de Metal", category: "Corpo-a-Corpo", color: "#38bdf8", roll: "3d4", effect: "3d4 de dano. (+VIGOR por arma cega)" },
      { name: "Cadeiras / Mesas", category: "Corpo-a-Corpo", color: "#a855f7", roll: "4d4", effect: "4d4 de dano (Uso único)." },
      { name: "Objeto do Cenário", category: "Corpo-a-Corpo", color: "#f97316", roll: "1d8", effect: "1d4 para objetos pequenos, 1d6 para médios e 1d8 para grandes + Teste de Integridade." }
    ],
    ranged: [
      { name: "Estilingue", category: "À Distância", color: "#84cc16", roll: "1d6", fireRate: "Até 4 tiros por turno", effect: "1d6 por tiro, até 4 tiros por turno." },
      { name: "Revólver .38", category: "À Distância", color: "#38bdf8", roll: "1d8", fireRate: "Até 6 tiros por turno", effect: "1d8 por tiro, até 6 tiros por turno." },
      { name: "Revólver .44", category: "À Distância", color: "#06b6d4", roll: "1d12", fireRate: "Até 6 tiros por turno", effect: "1d12 por tiro, até 6 tiros por turno." },
      { name: "Revólver .45", category: "À Distância", color: "#3b82f6", roll: "2d8", fireRate: "Até 6 tiros por turno", effect: "2d8 por tiro, até 6 tiros por turno." },
      { name: "Revólver .357", category: "À Distância", color: "#6366f1", roll: "2d12", fireRate: "Até 5 tiros por turno", effect: "2d12 por tiro, até 5 tiros por turno." },
      { name: "Espingarda", category: "À Distância", color: "#a855f7", roll: "5d4", fireRate: "Apenas 2 tiros por turno", effect: "5d4 por tiro, apenas dois por turno." },
      { name: "Espingarda (EX)", category: "À Distância", color: "#f43f5e", roll: "3d8", fireRate: "Apenas 2 tiros por turno", effect: "3d8 por tiro, apenas dois por turno." },
      { name: "Espingarda (BL)", category: "À Distância", color: "#ec4899", roll: "3d12", fireRate: "Apenas 1 tiro por turno", effect: "3d12 por tiro, apenas um por turno." },
      { name: "Mini-Metralhadora", category: "À Distância", color: "#f97316", roll: "1d4", fireRate: "Até 16 tiros por turno", effect: "1d4 por tiro, até 16 tiros por turno." },
      { name: "Submetralhadora", category: "À Distância", color: "#f59e0b", roll: "1d8", fireRate: "Até 16 tiros por turno", effect: "1d8 por tiro, até 16 tiros por turno." },
      { name: "Metralhadora Pesada", category: "À Distância", color: "#ef4444", roll: "2d8", fireRate: "Até 32 tiros por turno", effect: "2d8 por tiro, até 32 tiros por turno." },
      { name: "Winchester .22", category: "À Distância", color: "#eab308", roll: "3d10", fireRate: "Até 5 tiros por turno", effect: "3d10 por tiro, até 5 tiros por turno." },
      { name: "Winchester .30-30", category: "À Distância", color: "#10b981", roll: "3d12", fireRate: "Apenas 1 tiro por turno", effect: "3d12 por tiro, apenas 1 tiro por turno." },
      { name: "Remington .30-06", category: "À Distância", color: "#14b8a6", roll: "4d12", fireRate: "Apenas 1 tiro por turno", effect: "4d12 por tiro, apenas 1 tiro por turno." },
      { name: ".222 Remington", category: "À Distância", color: "#8b5cf6", roll: "2d20", fireRate: "Apenas 1 tiro por turno", effect: "2d20 por tiro, apenas 1 tiro por turno." },
      { name: ".270 Winchester", category: "À Distância", color: "#d946ef", roll: "3d20", fireRate: "Apenas 1 tiro por turno", effect: "3d20 por tiro, apenas 1 tiro por turno." },
      { name: "Springfield .30-06", category: "À Distância", color: "#f43f5e", roll: "4d20", fireRate: "1 tiro a cada 2 turnos", effect: "4d20 por tiro, 1 tiro a cada 2 turnos." },
      { name: "Fuzil de Caça", category: "À Distância", color: "#00d2ff", roll: "2d6", fireRate: "Até 12 tiros por turno", effect: "2d6 por tiro, até 12 tiros por turno." },
      { name: "Fuzil de Assalto", category: "À Distância", color: "#38bdf8", roll: "3d8", fireRate: "Até 12 tiros por turno", effect: "3d8 por tiro, até 12 tiros por turno." },
      { name: "Arcos", category: "À Distância", color: "#818cf8", roll: "1d12", fireRate: "Até 3 disparos por turno", effect: "1d12 por disparo, até 3 disparos por turno." }
    ],
    misc: [
      { name: "Câmeras Fotográficas", category: "Miscelâneo", color: "#ff9900", roll: "1d100", rollType: "Flash Stun (50%)", effect: "Servem para registrar fotos de lugares e objetos, aplicando 1 turno de Stun com o Flash (50% de chance)." },
      { name: "Cyberdeck", category: "Miscelâneo", color: "#3b82f6", roll: null, effect: "Pode ser usado para acessar a internet além de ser o companheiro oficial do Programador." }
    ]
  }
};


// ============================================================================
// LIMIAR — Módulo "Livro" (Wiki / Compêndio Oficial integrado à aba Livro)
// ============================================================================
(function (L) {
  "use strict";

  const DATA = window.LIMIAR_DATA;

  const state = {
    activeView: "visao-geral",
    activePathId: "eidolon",
    pathSearchQuery: "",
    profSearchQuery: "",
    profAttrFilter: "all",
    itemSearchQuery: "",
    itemCategoryFilter: "all",
    statusCategoryFilter: "all",
    pixelMode: false
  };

  const CHAPTER_TITLES = {
    "visao-geral": "00. Visão Geral & Lore",
    atributos: "01. Atributos, Corpo & Fôlego",
    combate: "02. Testes, Combate & Inventário",
    sanidade: "03. Sanidade, Distúrbios & Status",
    profissoes: "04. Criação & Profissões (33)",
    caminhos: "05. Os 5 Caminhos do Indizível",
    magias: "06. Revelações, Magias & Rituais",
    arsenal: "07. Arsenal, Drogas & Itens"
  };

  let elRaiz = null;

  function qid(id) {
    return elRaiz ? elRaiz.querySelector("#" + id) : null;
  }

  function qa(sel) {
    return elRaiz ? elRaiz.querySelectorAll(sel) : [];
  }

  // Utilitários de Formatação Colorida (Auto-Highlighter de termos do sistema)
  function highlightTerms(text) {
    if (!text) return "";
    return text
      .replace(/\bVIGOR\b/g, '<span class="attr-pill attr-vigor">VIGOR</span>')
      .replace(/\bACUIDADE\b/g, '<span class="attr-pill attr-acuidade">ACUIDADE</span>')
      .replace(/\bPSICOMETRIA\b/g, '<span class="attr-pill attr-psicometria">PSICOMETRIA</span>')
      .replace(/\bESOTERISMO\b/g, '<span class="attr-pill attr-esoterismo">ESOTERISMO</span>')
      .replace(/\bRAZÃO\b/g, '<span class="attr-pill attr-razao">RAZÃO</span>')
      .replace(/\b(Indizíveis|Indizível|INDIZÍVEIS)\b/g, '<strong class="text-vigor">$1</strong>')
      .replace(/\b(Pontos de Fôlego|Ponto de Fôlego|Fôlego)\b/g, '<strong class="text-folego">$1</strong>')
      .replace(/\b(Conhecimento)\b/g, '<strong class="text-conhecimento">$1</strong>');
  }

  // ============================================================================
  // RENDERIZADORES DE PÁGINAS DA WIKI
  // ============================================================================

  const SEARCH_ICON = `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/></svg>`;

  function renderVisaoGeral() {
    const loreParagraphs = DATA.lore.paragraphs;
    return `
      <section class="home-hero">
        <div class="home-hero-main">
          <div class="section-kicker">${DATA.meta.edition} • ${DATA.meta.setting}</div>
          <h1 class="hero-logo"><span class="logo-bars" data-logo aria-hidden="true"></span><span class="sr-only">LIMIAR</span></h1>
          <p class="section-lead">
            Bem-vindo à <strong>Wiki Oficial de LIMIAR (Livro do Jogador — 1ª Edição Revisada)</strong>. Todo o conteúdo do livro original foi convertido, organizado e interligado neste compêndio para Peritos e Espectadores.
          </p>
          <div class="hero-actions">
            <button type="button" class="btn-ui btn-primary" data-nav="atributos">Atributos & Regras</button>
            <button type="button" class="btn-ui" data-nav="caminhos">Explorar os 5 Caminhos (160 Nós)</button>
            <button type="button" class="btn-ui" data-nav="profissoes">Ver 33 Profissões</button>
            <button type="button" class="btn-ui" data-nav="arsenal">Catálogo de Armas & Itens</button>
          </div>
        </div>

        <figure class="home-hero-sigil">
          <img src="assets/limiar-symbol-transparent.png" alt="Símbolo oficial do RPG LIMIAR" width="210" height="250" fetchpriority="high">
          <figcaption>
            O Símbolo do Limiar
          </figcaption>
        </figure>

        <blockquote class="lore-quote home-hero-quote">
          "${DATA.meta.quote.text}"
          <footer>
            — ${DATA.meta.quote.author}
          </footer>
        </blockquote>
      </section>

      <h2 class="sub-heading">Índice Rápido do Sistema</h2>
      <div class="index-grid">
        <article class="wiki-card accent-card index-tile" style="--accent: var(--color-vigor);" data-nav="atributos" tabindex="0">
          <div class="wiki-card-header">
            <h3 class="wiki-card-title text-vigor">1. Atributos & Corpo</h3>
            <span class="nav-badge">Cap. 1</span>
          </div>
          <p class="text-muted">Os 5 atributos (Vigor, Acuidade, Psicometria, Esoterismo, Razão), sub-atributos Inteligência/Sapiência, Vida por membro, Defesa 2d4×VIGOR e Fôlego.</p>
        </article>
        <article class="wiki-card accent-card index-tile" style="--accent: var(--color-acuidade);" data-nav="combate" tabindex="0">
          <div class="wiki-card-header">
            <h3 class="wiki-card-title text-acuidade">2. Testes & Combate</h3>
            <span class="nav-badge">Cap. 1</span>
          </div>
          <p class="text-muted">Testes d20 e d100 (%), Tabela DF 1 a 10, Iniciativa, Contra-Ação DF5/DF6, Defesa Ativa, Pertences, Bagagem, Patrimônio, Armaduras (RD) e Acessórios.</p>
        </article>
        <article class="wiki-card accent-card index-tile" style="--accent: var(--color-razao);" data-nav="sanidade" tabindex="0">
          <div class="wiki-card-header">
            <h3 class="wiki-card-title text-razao">3. Sanidade & Status</h3>
            <span class="nav-badge">Cap. 1</span>
          </div>
          <p class="text-muted">Corda da Loucura, Tabela de Sanidade (-1 a -100), Sessões de Terapia, Depressão, Esquizofrenia, Ansiedade, 17 Status e Descanso/Sono.</p>
        </article>
        <article class="wiki-card accent-card index-tile" style="--accent: var(--color-psicometria);" data-nav="profissoes" tabindex="0">
          <div class="wiki-card-header">
            <h3 class="wiki-card-title text-psicometria">4. Criação & 33 Profissões</h3>
            <span class="nav-badge">Cap. 2 & 3</span>
          </div>
          <p class="text-muted">As 5 etapas de criação de Perito e a lista completa das 33 Profissões com bônus de atributos, habilidades exclusivas, equipamentos e dinheiro inicial.</p>
        </article>
        <article class="wiki-card accent-card index-tile" style="--accent: var(--color-conhecimento);" data-nav="caminhos" tabindex="0">
          <div class="wiki-card-header">
            <h3 class="wiki-card-title text-conhecimento">5. Conhecimento & 5 Caminhos</h3>
            <span class="nav-badge">Cap. 4, 5 & 6</span>
          </div>
          <p class="text-muted">Progressão 1:1 por dano de Sanidade, Traços de Revelação e a árvore completa dos 5 Caminhos do Indizível (20 Trilhas, 160 Nós).</p>
        </article>
        <article class="wiki-card accent-card index-tile" style="--accent: var(--color-esoterismo);" data-nav="magias" tabindex="0">
          <div class="wiki-card-header">
            <h3 class="wiki-card-title text-esoterismo">6. Magias, Rituais & Itens</h3>
            <span class="nav-badge">Cap. 7 & 8</span>
          </div>
          <p class="text-muted">Palavras Verbais, de Poder e de Impulso (Classes 1-5), Rituais por etapas e níveis, Itens Medicinais, Psicoativos e Arsenal completo.</p>
        </article>
      </div>

      <h2 class="sub-heading">O Mundo de LIMIAR & O Indizível</h2>
      <div class="lore-body">
        <div class="lore-columns">
          ${loreParagraphs.slice(0, 5).map(p => `<p>${highlightTerms(p)}</p>`).join("")}
        </div>
        ${loreParagraphs[5] ? `<p class="lore-callout">${loreParagraphs[5]}</p>` : ""}
        ${loreParagraphs.slice(6).map(p => `<p class="lore-coda">${highlightTerms(p)}</p>`).join("")}
      </div>

      <h2 class="sub-heading">Pilares & Glossário Fundamental</h2>
      <div class="grid-3">
        ${DATA.lore.glossary.map(item => `
          <article class="wiki-card glossary-card">
            <span class="nav-badge">${item.category}</span>
            <h3 class="wiki-card-title">${item.term}</h3>
            <p class="card-text">${highlightTerms(item.desc)}</p>
          </article>
        `).join("")}
      </div>
    `;
  }

  function renderAtributos() {
    return `
      <section class="section-hero">
        <div class="section-kicker">Capítulo 1 • Familiarização & Anatomia</div>
        <h1 class="section-title">Atributos, Corpo, Defesa & Fôlego</h1>
        <p class="section-lead">
          Todo Perito possui uma gama de aptidões físicas, técnicas, cognitivas e esotéricas, destacando-se como prodígios ou casos espetaculares na sociedade. Sua especialização é definida através do seu primeiro contato com o Indizível.
        </p>
      </section>

      <div class="wiki-card accent-card point-buy" style="--accent: var(--color-conhecimento);">
        <div class="point-buy-copy">
          <div class="wiki-card-header">
            <h2 class="wiki-card-title text-conhecimento">Distribuição de Pontos na Criação</h2>
            <span class="attr-pill attr-conhecimento">5 Pontos Iniciais</span>
          </div>
          <p class="card-text">
            ${highlightTerms(DATA.rules.pointBuy.description)}
          </p>
        </div>
        <div class="readout-grid">
          <div class="readout">
            <div class="readout-label">PONTOS PARA DISTRIBUIR</div>
            <div class="readout-value text-conhecimento">5 Pontos</div>
          </div>
          <div class="readout">
            <div class="readout-label">MÁXIMO NA CRIAÇÃO</div>
            <div class="readout-value text-acuidade">+10 Pontos</div>
          </div>
          <div class="readout">
            <div class="readout-label">MÍNIMO PERMITIDO (REALOCAÇÃO)</div>
            <div class="readout-value text-vigor">-5 Pontos</div>
          </div>
        </div>
      </div>

      <h2 class="sub-heading">Os 5 Atributos Fundamentais</h2>
      <div class="grid-2 attr-grid">
        ${DATA.attributes.map(attr => `
          <article class="wiki-card accent-card" style="--accent: ${attr.color};">
            <div class="wiki-card-header">
              <div>
                <span class="attr-pill ${attr.badgeClass}">${attr.name}</span>
                <h3 class="wiki-card-title mt-1">${attr.shortDesc}</h3>
              </div>
              <span class="nav-badge">${attr.caminho}</span>
            </div>
            <p style="color: var(--text-secondary); font-size: 0.95rem;">${highlightTerms(attr.fullDesc)}</p>
            ${attr.subAttributes ? `
              <div style="display: grid; gap: 0.6rem; padding: 0.85rem; background: var(--bg-surface-2); border-radius: var(--radius-md); border: 1px solid rgba(59, 130, 246, 0.35);">
                <div class="font-pixel text-psicometria" style="font-size: 0.72rem;">SUB-ATRIBUTOS DE PSICOMETRIA</div>
                ${attr.subAttributes.map(sub => `
                  <div>
                    <strong style="color: #fff;">• ${sub.name}:</strong>
                    <span style="color: var(--text-secondary); font-size: 0.9rem;"> ${sub.desc}</span>
                  </div>
                `).join("")}
              </div>
            ` : ""}
            <ul style="display: flex; flex-direction: column; gap: 0.4rem; margin-block-start: 0.25rem;">
              ${attr.mechanics.map(m => `
                <li style="font-size: 0.9rem; color: var(--text-secondary);">- ${highlightTerms(m)}</li>
              `).join("")}
            </ul>
          </article>
        `).join("")}
      </div>

      <h2 class="sub-heading">Anatomia: Partes do Corpo & Vida por Membro (VIGOR)</h2>
      <div class="grid-2" style="align-items: center;">
        <div class="wiki-card">
          <h3 class="wiki-card-title text-vigor">Sistema de 5 Membros (6 Partes)</h3>
          <p style="color: var(--text-secondary);">
            O Perito possui um total de cinco tipos de membros: <strong>Cabeça, Torso (Tronco), Braços (Esquerdo e Direito) e Pernas (Esquerda e Direita)</strong>. Cada membro possui sua própria barra de Vida.
          </p>
          <div style="padding: 1rem; background: rgba(230, 57, 70, 0.1); border: 1px solid var(--color-vigor); border-radius: var(--radius-md);">
            <div class="font-pixel text-vigor" style="font-size: 0.75rem; margin-block-end: 0.4rem;">CONDIÇÕES DE MORTE DO PERITO</div>
            <p style="font-size: 0.92rem; color: #fff;">1. Caso a <strong>Cabeça</strong> do Perito seja arrancada;</p>
            <p style="font-size: 0.92rem; color: #fff;">2. Caso a Vida do <strong>Tronco</strong> seja completamente removida.</p>
          </div>
          <p style="color: var(--text-secondary); font-size: 0.92rem;">
            <em>Salvando um Aliado:</em> Um Perito pode realizar um teste de <span class="attr-pill attr-acuidade">ACUIDADE</span> para impedir a perda de um aliado, sempre descrevendo como o fará se possível.
          </p>
        </div>

        <div class="table-wrap">
          <table class="wiki-table">
            <thead>
              <tr>
                <th>Parte do Corpo</th>
                <th>Fórmula de Vida Inicial</th>
                <th>Letalidade / Observação</th>
              </tr>
            </thead>
            <tbody>
              ${DATA.rules.bodyParts.map(bp => `
                <tr>
                  <td><strong style="color: ${bp.fatal ? 'var(--color-vigor)' : '#fff'};">${bp.part}</strong></td>
                  <td><code class="font-mono text-vigor">${bp.formula}</code></td>
                  <td>${bp.fatalNote}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>

      <h2 class="sub-heading">Defesa Passiva (%) & Pontos de Fôlego</h2>
      <div class="grid-2">
        <article class="wiki-card">
          <div class="wiki-card-header">
            <h3 class="wiki-card-title text-vigor">Defesa Passiva (2d4 × VIGOR)</h3>
            <span class="attr-pill attr-vigor">2d4 × VIGOR</span>
          </div>
          <p style="color: var(--text-secondary);">
            ${highlightTerms(DATA.rules.combat.passiveDefense)}
          </p>
          <div style="padding: 0.85rem; background: var(--bg-surface-2); border-radius: var(--radius-md); font-family: var(--font-mono); font-size: 0.88rem;">
            <div>• <strong>Sucesso Normal (1d100 &le; Defesa%):</strong> Recebe apenas <strong>metade (1/2)</strong> do dano.</div>
            <div>• <strong>Sucesso Crítico (1 no d100):</strong> Recebe apenas <strong>um quarto (1/4)</strong> do dano.</div>
            <div>• <strong>Armaduras Equipadas:</strong> Somam diretamente na % de Defesa daquela parte (Ex: Capacete de Couro +1 &rarr; 30% sobe para 31%).</div>
          </div>
        </article>

        <article class="wiki-card">
          <div class="wiki-card-header">
            <h3 class="wiki-card-title text-folego">Pontos de Fôlego & Exaustão</h3>
            <span class="attr-pill attr-folego">Fôlego = VIGOR</span>
          </div>
          <p style="color: var(--text-secondary);">
            ${highlightTerms(DATA.rules.stamina.definition)}
          </p>
          <ul style="display: flex; flex-direction: column; gap: 0.45rem;">
            ${DATA.rules.stamina.costs.map(c => `
              <li style="font-size: 0.92rem; color: var(--text-secondary);">
                - <strong class="text-folego">${c.action} (${c.cost}):</strong> ${c.effect}
              </li>
            `).join("")}
            <li style="font-size: 0.92rem; color: var(--text-secondary);">
              - <strong>Recuperação Passiva:</strong> ${DATA.rules.stamina.recovery}
            </li>
            <li style="font-size: 0.92rem; color: var(--color-vigor);">
              - <strong>Exaustão (0 de Fôlego):</strong> ${DATA.rules.stamina.exhaustion}
            </li>
          </ul>
        </article>
      </div>
    `;
  }

  function renderCombate() {
    return `
      <section class="section-hero">
        <div class="section-kicker">Capítulo 1 • Regras de Jogo & Conflito</div>
        <h1 class="section-title">Testes, Combate, Iniciativa & Equipamentos</h1>
        <p class="section-lead">
          Os testes em LIMIAR utilizam dados de 20 faces (<code class="font-mono">1d20 + Atributo</code>) contra uma Classe de Dificuldade (DF 1 a 10) e dados de porcentagem (<code class="font-mono">1d100</code>) para chances diretas e Defesa.
        </p>
      </section>

      <div class="grid-2">
        <div class="wiki-card">
          <div class="wiki-card-header">
            <h2 class="wiki-card-title">Sistema de Testes (d20 & d100)</h2>
          </div>
          <ul style="display: flex; flex-direction: column; gap: 0.65rem; color: var(--text-secondary);">
            <li>- <strong>Fórmula Base:</strong> ${highlightTerms(DATA.rules.diceSystem.d20)}</li>
            <li>- <strong class="text-conhecimento">Acerto Crítico (20 Natural):</strong> ${DATA.rules.diceSystem.critSuccess}</li>
            <li>- <strong class="text-vigor">Falha Crítica (1 Natural):</strong> ${DATA.rules.diceSystem.critFail}</li>
            <li>- <strong>Vantagem:</strong> ${DATA.rules.diceSystem.advantage}</li>
            <li>- <strong>Desvantagem:</strong> ${DATA.rules.diceSystem.disadvantage}</li>
            <li>- <strong class="text-psicometria">Testes de Porcentagem (%):</strong> ${DATA.rules.diceSystem.percentage}</li>
          </ul>
        </div>

        <div class="table-wrap">
          <table class="wiki-table">
            <thead>
              <tr>
                <th>Dificuldade (DF)</th>
                <th>Número Mínimo no Teste</th>
                <th>Referência no Sistema</th>
              </tr>
            </thead>
            <tbody>
              ${DATA.rules.difficultyTable.map(row => `
                <tr>
                  <td><strong class="font-pixel text-conhecimento">DF ${row.df}</strong></td>
                  <td><strong class="font-mono" style="font-size: 1.05rem; color: #fff;">${row.min}</strong></td>
                  <td>${row.label}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>

      <h2 class="sub-heading">Fluxo de Combate, Contra-Ação & Defesa</h2>
      <div class="grid-2">
        <article class="wiki-card accent-card" style="--accent: var(--color-acuidade);">
          <h3 class="wiki-card-title text-acuidade">1. Iniciativa & Turno do Perito</h3>
          <p style="color: var(--text-secondary);">${highlightTerms(DATA.rules.combat.initiative)}</p>
          <p style="color: var(--text-secondary);">${highlightTerms(DATA.rules.combat.actionsPerTurn)}</p>
          <p style="color: var(--text-secondary);">${highlightTerms(DATA.rules.combat.attackAndDodge)}</p>
        </article>

        <article class="wiki-card accent-card" style="--accent: var(--color-conhecimento);">
          <h3 class="wiki-card-title text-conhecimento">2. Contra-Ação (DF5 vs DF6)</h3>
          <p style="color: var(--text-secondary);">${highlightTerms(DATA.rules.combat.counterAction)}</p>
          <div style="padding: 0.75rem; background: var(--bg-surface-2); border-radius: var(--radius-md); font-size: 0.88rem;">
            <div>• <strong>Contra-Ação do Perito:</strong> Teste <span class="text-conhecimento">DF 5 (Mínimo 18)</span>. Se tirar <strong>20 natural</strong>, ganha <strong>+1 Ação Bônus</strong> imediata.</div>
            <div>• <strong>Contra-Ação do Oponente:</strong> Teste <span class="text-vigor">DF 6 (Mínimo 19)</span>.</div>
          </div>
        </article>

        <article class="wiki-card accent-card" style="--accent: var(--color-vigor);">
          <h3 class="wiki-card-title text-vigor">3. Defesa Ativa & Bloqueio</h3>
          <p style="color: var(--text-secondary);">${highlightTerms(DATA.rules.combat.activeDefense)}</p>
        </article>

        <article class="wiki-card accent-card" style="--accent: var(--color-folego);">
          <h3 class="wiki-card-title text-folego">4. Locomoção em Combate</h3>
          <p style="color: var(--text-secondary);">${highlightTerms(DATA.rules.combat.movementInCombat)}</p>
        </article>
      </div>

      <h2 class="sub-heading">Equipamentos em Combate: Pertences, Bagagem & Patrimônio</h2>
      <div class="grid-3">
        ${DATA.rules.inventory.categories.map(cat => `
          <article class="wiki-card">
            <h3 class="wiki-card-title text-conhecimento">${cat.name}</h3>
            <p style="color: var(--text-secondary); font-size: 0.92rem;">${cat.desc}</p>
            <ul style="display: flex; flex-direction: column; gap: 0.35rem; margin-block-start: auto; padding-block-start: 0.5rem; border-block-start: 1px solid var(--border-subtle);">
              ${cat.limits.map(lim => `<li style="font-family: var(--font-mono); font-size: 0.86rem; color: #fff;">• ${lim}</li>`).join("")}
            </ul>
          </article>
        `).join("")}
      </div>

      <div class="grid-2 mt-2">
        <article class="wiki-card">
          <h3 class="wiki-card-title">Armaduras (Redução de Dano — RD)</h3>
          <p style="color: var(--text-secondary);">${DATA.rules.inventory.armors}</p>
        </article>
        <article class="wiki-card">
          <h3 class="wiki-card-title">Acessórios (Máx. 3)</h3>
          <p style="color: var(--text-secondary);">${DATA.rules.inventory.accessories}</p>
        </article>
      </div>
    `;
  }

  function renderSanidade() {
    const filteredStatuses = DATA.statuses.filter(st =>
      state.statusCategoryFilter === "all" || st.category.toLowerCase().includes(state.statusCategoryFilter)
    );

    return `
      <section class="section-hero">
        <div class="section-kicker">Capítulo 1 • Mente, Traumas & Condições</div>
        <h1 class="section-title">Sanidade, Distúrbios Mentais, Status & Descanso</h1>
        <p class="section-lead">
          Um Perito muitas vezes entra em contato direto com o Indizível, perdendo Sanidade conforme interage com o mesmo. Gerenciar a própria mente é tão vital quanto proteger a própria carne.
        </p>
      </section>

      <div class="grid-2">
        <article class="wiki-card accent-card" style="--accent: var(--color-razao);">
          <div class="wiki-card-header">
            <h2 class="wiki-card-title text-razao">Regras de Sanidade & Corda da Loucura</h2>
            <span class="attr-pill attr-razao">RAZÃO + 1d6</span>
          </div>
          <ul style="display: flex; flex-direction: column; gap: 0.55rem; color: var(--text-secondary);">
            <li>- <strong>Sanidade Inicial:</strong> <code class="font-mono">${DATA.sanity.formula}</code></li>
            <li>- <strong>Sustentação em Combate:</strong> ${highlightTerms(DATA.sanity.combatTurns)}</li>
            <li>- <strong>Exposição Fora de Combate:</strong> ${highlightTerms(DATA.sanity.exposureOutCombat)}</li>
            <li>- <strong>Exposição em Combate:</strong> ${highlightTerms(DATA.sanity.exposureInCombat)}</li>
            <li>- <strong>Vislumbre Direto do LIMIAR:</strong> Recebe <strong class="text-vigor">2d20 de dano de Sanidade</strong> ao ter acesso direto a uma imagem do outro lado.</li>
            <li>- <strong class="text-conhecimento">"Se Equilibrar na Corda da Loucura" (0 de Sanidade):</strong> ${highlightTerms(DATA.sanity.zeroSanityRule)}</li>
            <li>- <strong class="text-psicometria">Sessões de Terapia:</strong> ${highlightTerms(DATA.sanity.therapy)}</li>
          </ul>
        </article>

        <div class="table-wrap">
          <table class="wiki-table">
            <thead>
              <tr>
                <th>Faixa de Sanidade</th>
                <th>Efeito Manifestado no Perito</th>
              </tr>
            </thead>
            <tbody>
              ${DATA.sanity.negativeTable.map(row => `
                <tr>
                  <td><strong class="font-mono text-vigor">${row.range}</strong></td>
                  <td>${highlightTerms(row.effect)}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>

      <h2 class="sub-heading">Distúrbios Mentais (Por Grau e Tipo)</h2>
      <p style="color: var(--text-secondary); margin-block-end: 1.25rem;">
        ${highlightTerms(DATA.sanity.disordersTrigger)}
      </p>
      <div class="grid-3">
        ${DATA.sanity.disorders.map(dis => `
          <article class="wiki-card">
            <div class="wiki-card-header">
              <h3 class="wiki-card-title text-conhecimento">Efeitos da ${dis.name}</h3>
            </div>
            <div style="font-size: 0.82rem; color: var(--text-muted);">
              <strong>Medicação:</strong> ${dis.medications.join(", ")}<br>
              <strong>Status Associado:</strong> ${dis.statusIndicators.join(", ")}
            </div>
            <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-block-start: 0.4rem;">
              ${dis.levels.map(lvl => `
                <div style="padding: 0.75rem; background: var(--bg-surface-2); border-radius: var(--radius-md); border-inline-start: 3px solid var(--color-razao);">
                  <div class="font-pixel" style="font-size: 0.75rem; color: #fff; margin-block-end: 0.25rem;">${lvl.grade.toUpperCase()}</div>
                  <p style="font-size: 0.88rem; color: var(--text-secondary);">${highlightTerms(lvl.effect)}</p>
                </div>
              `).join("")}
            </div>
          </article>
        `).join("")}
      </div>

      <h2 class="sub-heading">Todos os 17 Status do Perito</h2>
      <div class="filter-bar">
        <span class="filter-label">Filtrar Status:</span>
        <div class="chip-row">
          ${[
            { id: "all", label: "Todos (17)" },
            { id: "físico", label: "Físicos / Dano Passivo" },
            { id: "mental", label: "Mentais / Psicológicos" },
            { id: "combate", label: "Combate / Controle" }
          ].map(f => `
            <button type="button" class="btn-ui ${state.statusCategoryFilter === f.id ? 'is-active' : ''}" data-status-filter="${f.id}">
              ${f.label}
            </button>
          `).join("")}
        </div>
      </div>

      <div class="grid-3">
        ${filteredStatuses.map(st => `
          <article class="wiki-card accent-card" style="--accent: ${st.color};">
            <div class="wiki-card-header">
              <h3 class="wiki-card-title" style="color: ${st.color};">${st.name}</h3>
              <span class="nav-badge">${st.category}</span>
            </div>
            <p style="color: var(--text-secondary); font-size: 0.92rem;">${highlightTerms(st.effect)}</p>
          </article>
        `).join("")}
      </div>

      <h2 class="sub-heading">Dormir e Descansar</h2>
      <p class="text-muted mb-2">${DATA.rules.restAndSleep.note}</p>
      <div class="grid-2">
        <div class="table-wrap">
          <table class="wiki-table">
            <thead>
              <tr>
                <th>Tipo de Descanso</th>
                <th>Recuperação de Vida</th>
              </tr>
            </thead>
            <tbody>
              ${DATA.rules.restAndSleep.rests.map(r => `
                <tr>
                  <td><strong>${r.type}</strong></td>
                  <td><span class="text-acuidade font-mono">${r.vida}</span></td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>

        <div class="table-wrap">
          <table class="wiki-table">
            <thead>
              <tr>
                <th>Qualidade de Sono (Passa o Dia)</th>
                <th>Vida</th>
                <th>Sanidade</th>
              </tr>
            </thead>
            <tbody>
              ${DATA.rules.restAndSleep.sleep.map(s => `
                <tr>
                  <td><strong>${s.type}</strong></td>
                  <td><span class="text-acuidade font-mono">${s.vida}</span></td>
                  <td><span class="text-razao font-mono">${s.sanidade}</span></td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function renderProfissoes() {
    const query = state.profSearchQuery.trim().toLowerCase();
    const attrFilter = state.profAttrFilter;

    const list = DATA.professions.filter(p => {
      const matchesSearch = !query ||
        p.name.toLowerCase().includes(query) ||
        p.bonusText.toLowerCase().includes(query) ||
        p.equipment.toLowerCase().includes(query);
      const matchesAttr = attrFilter === "all" || p.tags.includes(attrFilter);
      return matchesSearch && matchesAttr;
    });

    return `
      <section class="section-hero">
        <div class="section-kicker">Capítulos 2 & 3 • Criação de Personagem</div>
        <h1 class="section-title">Montando um Perito & As 33 Profissões</h1>
        <p class="section-lead">
          Os Peritos não são pessoas comuns como as outras: são casos excepcionais, com habilidades muito superiores às de outros humanos — pessoas que são prodígios.
        </p>
      </section>

      <h2 class="sub-heading">As 5 Etapas de Criação (A–E)</h2>
      <div class="grid-3 steps-grid">
        <div class="wiki-card">
          <div class="font-pixel text-vigor" style="font-size: 0.75rem;">ETAPA A & B</div>
          <h3 class="wiki-card-title">Nome & História</h3>
          <p class="text-muted" style="font-size: 0.92rem;">Defina o Nome do Perito e sua História (plano de fundo, de onde veio, suas motivações para estar na história e como foi seu primeiro contato com o Indizível, se requisitado pelo Espectador).</p>
        </div>
        <div class="wiki-card">
          <div class="font-pixel text-acuidade" style="font-size: 0.75rem;">ETAPA C & D</div>
          <h3 class="wiki-card-title">Atributos & Profissão</h3>
          <p class="text-muted" style="font-size: 0.92rem;">Distribua os 5 pontos iniciais nos cinco atributos (entre -5 e +10) e escolha uma Profissão (incluindo nenhuma / Bom-Pra-Nada) para receber modificadores, equipamentos e dinheiro inicial.</p>
        </div>
        <div class="wiki-card">
          <div class="font-pixel text-psicometria" style="font-size: 0.75rem;">ETAPA E</div>
          <h3 class="wiki-card-title">Aparência & Manias</h3>
          <p class="text-muted" style="font-size: 0.92rem;">Defina a aparência do Perito, com seus traços físicos e mentais, como manias, tiques e peculiaridades.</p>
        </div>
      </div>

      <h2 class="sub-heading">Catálogo Completo de Profissões (${list.length} de ${DATA.professions.length})</h2>
      <div class="filter-bar">
        <label class="search-field">
          ${SEARCH_ICON}
          <input
            type="search"
            id="prof-search-input"
            class="input-field"
            placeholder="Buscar profissão, bônus ou item (ex: Cyberdeck, Kit Médico, Veterano)..."
            value="${state.profSearchQuery}"
          >
        </label>
        <div class="chip-row">
          ${[
            { id: "all", label: "Todas (33)" },
            { id: "vigor", label: "VIGOR" },
            { id: "acuidade", label: "ACUIDADE" },
            { id: "inteligencia", label: "Inteligência" },
            { id: "sapiencia", label: "Sapiência" },
            { id: "esoterismo", label: "ESOTERISMO" },
            { id: "razao", label: "RAZÃO" }
          ].map(btn => `
            <button type="button" class="btn-ui ${state.profAttrFilter === btn.id ? 'is-active' : ''}" data-prof-filter="${btn.id}">
              ${btn.label}
            </button>
          `).join("")}
        </div>
      </div>

      <div class="grid-3">
        ${list.map(prof => `
          <article class="wiki-card">
            <div class="wiki-card-header">
              <h3 class="wiki-card-title text-conhecimento">${prof.name}</h3>
            </div>
            <div style="font-size: 0.92rem; color: var(--text-secondary);">
              <div style="margin-block-end: 0.45rem;">
                <strong>• Bônus:</strong> ${highlightTerms(prof.bonusText)}
              </div>
              <div style="margin-block-end: 0.45rem;">
                <strong>• Equipamento:</strong> <span style="color: #fff;">${prof.equipment}</span>
              </div>
              <div style="margin-block-start: 0.65rem; padding-block-start: 0.55rem; border-block-start: 1px solid var(--border-subtle);">
                <strong>• Dinheiro Inicial:</strong> <code class="font-mono text-acuidade">${prof.money}</code>
              </div>
            </div>
          </article>
        `).join("")}
      </div>
    `;
  }

  function renderCaminhos() {
    const activePath = DATA.paths.find(p => p.id === state.activePathId) || DATA.paths[0];
    const q = state.pathSearchQuery.trim().toLowerCase();

    return `
      <section class="section-hero">
        <div class="section-kicker">Capítulos 4, 5 & 6 • Progressão & Árvore de Habilidades</div>
        <h1 class="section-title">Conhecimento & Os 5 Caminhos do Indizível</h1>
        <blockquote class="lore-quote" style="margin-block: 0.75rem;">
          "${DATA.meta.pathsQuote.text}"
        </blockquote>
        <p class="section-lead">
          Em LIMIAR, todo dano de Sanidade sofrido ao longo da aventura alimenta a barra de <strong class="text-conhecimento">Conhecimento</strong> na proporção de <strong>1:1</strong> (1 de dano de Sanidade = 1% de Conhecimento; rituais não interferem). Ao atingir <strong>100%</strong>, o contador zera e o Perito recebe <strong>1 Traço de Revelação</strong>, <strong>+1 Ponto de Atributo</strong>, <strong>+1d2 de Vida</strong> em todas as partes e <strong>+1d4 de Sanidade</strong>.
        </p>
      </section>

      <div class="grid-3 mb-2">
        <div class="wiki-card">
          <div class="font-pixel text-conhecimento" style="font-size: 0.72rem;">ESTRUTURA DAS TRILHAS</div>
          <p style="font-size: 0.9rem; color: var(--text-secondary);">${DATA.pathsRules.structure}</p>
        </div>
        <div class="wiki-card">
          <div class="font-pixel text-acuidade" style="font-size: 0.72rem;">PRÉ-REQUISITO DE NÍVEL</div>
          <p style="font-size: 0.9rem; color: var(--text-secondary);">${DATA.pathsRules.levelReq}</p>
        </div>
        <div class="wiki-card">
          <div class="font-pixel text-vigor" style="font-size: 0.72rem;">REQUISITO DE ATRIBUTO (NÓS 5–8)</div>
          <p style="font-size: 0.9rem; color: var(--text-secondary);">${highlightTerms(DATA.pathsRules.attrReq)}</p>
        </div>
      </div>

      <!-- Abas dos 5 Caminhos -->
      <div class="path-tabs" role="tablist">
        ${DATA.paths.map(path => `
          <button
            type="button"
            role="tab"
            aria-selected="${state.activePathId === path.id && !q ? 'true' : 'false'}"
            class="path-tab-btn ${state.activePathId === path.id && !q ? 'is-active' : ''}"
            style="--path-accent: ${path.color};"
            data-path-tab="${path.id}"
            data-fk="livro-path:${path.id}"
          >
            <span class="path-tab-attr">
              ${path.number}. ATRIBUTO: ${path.attribute}
            </span>
            <span class="path-tab-name">
              ${path.name}
            </span>
            <span class="path-tab-meta">
              4 Trilhas • 32 Nós
            </span>
          </button>
        `).join("")}
      </div>

      <!-- Barra de Busca de Nós -->
      <div class="filter-bar">
        <label class="search-field">
          ${SEARCH_ICON}
          <input
            type="search"
            id="path-node-search"
            class="input-field"
            placeholder="Pesquisar habilidade nos 5 Caminhos (ex: contra-ação, terapia, crítico, fôlego)..."
            value="${state.pathSearchQuery}"
          >
        </label>
      </div>

      ${q ? renderFilteredNodesAcrossAllPaths(q) : renderSinglePathTracks(activePath)}
    `;
  }

  function renderSinglePathTracks(path) {
    return `
      <div class="tracks-container" style="--path-accent: ${path.color};">
        ${path.tracks.map(track => `
          <section class="track-column">
            <h3 class="track-title" style="color: ${path.color};">${track.name}</h3>
            <ol class="node-list">
              ${track.nodes.map(node => `
                <li class="node-card">
                  <div class="node-header">
                    <span class="node-name">
                      ${node.pos}. ${node.name}
                    </span>
                    <span class="node-meta">
                      [Nv. ${node.level}]${node.minAttr > 0 ? ` • Min ${path.attribute} ${node.minAttr}` : ""}
                    </span>
                  </div>
                  <p class="node-desc">
                    ${highlightTerms(node.desc)}
                  </p>
                </li>
              `).join("")}
            </ol>
          </section>
        `).join("")}
      </div>
    `;
  }

  function renderFilteredNodesAcrossAllPaths(query) {
    const matches = [];
    for (const path of DATA.paths) {
      for (const track of path.tracks) {
        for (const node of track.nodes) {
          if (
            node.name.toLowerCase().includes(query) ||
            node.desc.toLowerCase().includes(query) ||
            track.name.toLowerCase().includes(query)
          ) {
            matches.push({ path, track, node });
          }
        }
      }
    }

    if (matches.length === 0) {
      return `<div class="wiki-card"><p class="text-muted">Nenhum nó encontrado para "${query}".</p></div>`;
    }

    return `
      <h3 class="sub-heading">Resultados nos 5 Caminhos (${matches.length} nós encontrados)</h3>
      <div class="grid-3">
        ${matches.map(({ path, track, node }) => `
          <article class="node-card node-card-result" style="--path-accent: ${path.color};">
            <div class="node-path" style="color: ${path.color};">
              ${path.name} &rarr; ${track.name} (Nó ${node.pos})
            </div>
            <div class="node-header">
              <span class="node-name">${node.name}</span>
              <span class="node-meta">[Nv. ${node.level}]${node.minAttr > 0 ? ` • Min ${path.attribute} ${node.minAttr}` : ""}</span>
            </div>
            <p class="node-desc">${highlightTerms(node.desc)}</p>
          </article>
        `).join("")}
      </div>
    `;
  }

  function renderMagias() {
    return `
      <section class="section-hero">
        <div class="section-kicker">Capítulo 7 • Ocultismo, Palavras de Poder & Cerimônias</div>
        <h1 class="section-title">Revelações, Magias & Rituais</h1>
        <p class="section-lead">
          O Perito jamais escolhe as magias e rituais que lhe são revelados através das Iluminações; entretanto, independente do efeito, ele sempre será explicado pelo Espectador ao ser recebido.
        </p>
      </section>

      <div class="grid-3 mb-2">
        <article class="wiki-card">
          <div class="font-pixel text-conhecimento" style="font-size: 0.72rem;">CHANCE NA ILUMINAÇÃO (100%)</div>
          <h3 class="wiki-card-title">25% até 65%</h3>
          <p style="font-size: 0.92rem; color: var(--text-secondary);">
            ${DATA.magicAndRituals.revelations.illuminationChance}
          </p>
        </article>

        <article class="wiki-card">
          <div class="font-pixel text-esoterismo" style="font-size: 0.72rem;">REVELAÇÃO EM SONHO (>75%)</div>
          <h3 class="wiki-card-title">5% ao Dormir</h3>
          <p style="font-size: 0.92rem; color: var(--text-secondary);">
            ${DATA.magicAndRituals.revelations.dreamChance}
          </p>
        </article>

        <article class="wiki-card">
          <div class="font-pixel text-psicometria" style="font-size: 0.72rem;">GATILHOS PSICOLÓGICOS</div>
          <h3 class="wiki-card-title">Livros & Mantras</h3>
          <p style="font-size: 0.92rem; color: var(--text-secondary);">
            ${DATA.magicAndRituals.spells.overview}
          </p>
        </article>
      </div>

      <h2 class="sub-heading">Estrutura de Conjuração de Magias</h2>
      <div class="grid-2">
        <article class="wiki-card">
          <h3 class="wiki-card-title text-esoterismo">As 3 Palavras do Conjunto</h3>
          <p style="color: var(--text-secondary);">
            Magias são compostas narrativamente recitando palavras de conjuração de forças do LIMIAR. Toda magia é estruturada com no mínimo <strong>3 palavras (1 Conjunto)</strong>:
          </p>
          <div style="display: flex; flex-direction: column; gap: 0.6rem; margin-block: 0.5rem;">
            ${DATA.magicAndRituals.spells.structure.map(s => `
              <div style="padding: 0.75rem 1rem; background: var(--bg-surface-2); border-radius: var(--radius-md); border-inline-start: 4px solid ${s.color};">
                <strong class="font-pixel" style="color: ${s.color}; font-size: 0.85rem;">${s.type}</strong>
                <div style="font-size: 0.88rem; color: var(--text-secondary);">${s.desc}</div>
              </div>
            `).join("")}
          </div>
          <ul style="display: flex; flex-direction: column; gap: 0.45rem; color: var(--text-secondary); font-size: 0.92rem;">
            ${DATA.magicAndRituals.spells.rules.map(r => `<li>- ${highlightTerms(r)}</li>`).join("")}
          </ul>
        </article>

        <div style="display: flex; flex-direction: column; gap: 1.25rem;">
          ${DATA.magicAndRituals.spells.examples.map(ex => `
            <article class="wiki-card accent-card" style="--accent: var(--color-anciao);">
              <div class="font-pixel text-esoterismo" style="font-size: 0.7rem;">EXEMPLO OFICIAL DO LIVRO</div>
              <h3 class="wiki-card-title">${ex.name}</h3>
              <div style="padding: 0.85rem; background: var(--bg-void); border-radius: var(--radius-md); font-family: var(--font-pixel); font-size: 0.9rem;">
                ${ex.breakdown.map(b => `<span style="color: ${b.color}; margin-inline-end: 0.45rem;">${b.word}</span>`).join("")}
              </div>
              <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                ${ex.breakdown.map(b => `
                  <span class="nav-badge" style="border: 1px solid ${b.color}; color: #fff;">
                    ${b.word}: ${b.type} (Classe ${b.classLevel})
                  </span>
                `).join("")}
              </div>
              <p style="font-size: 0.92rem; color: var(--text-secondary);">
                <strong>Custo:</strong> ${ex.cost}<br>
                <strong>Efeito:</strong> ${ex.effect}
              </p>
            </article>
          `).join("")}
        </div>
      </div>

      <h2 class="sub-heading">Rituais: Etapas, Custos & Níveis de Complexidade</h2>
      <div class="wiki-card mb-2">
        <p style="color: var(--text-secondary); margin-block-end: 0.75rem;">
          ${DATA.magicAndRituals.rituals.overview}
        </p>
        <div class="grid-3">
          ${DATA.magicAndRituals.rituals.mechanics.map(m => `
            <div style="padding: 0.85rem; background: var(--bg-surface-2); border-radius: var(--radius-md);">
              <div class="font-pixel text-conhecimento" style="font-size: 0.75rem; margin-block-end: 0.25rem;">> ${m.title.toUpperCase()}</div>
              <p style="font-size: 0.88rem; color: var(--text-secondary);">${m.desc}</p>
            </div>
          `).join("")}
        </div>
      </div>

      <div class="grid-3">
        ${DATA.magicAndRituals.rituals.tiers.map(t => `
          <article class="wiki-card accent-card" style="--accent: var(--color-esoterismo);">
            <div class="wiki-card-header">
              <h3 class="wiki-card-title text-conhecimento">Ritual de ${t.level}</h3>
              <span class="attr-pill attr-esoterismo">${t.prepTime}</span>
            </div>
            <p style="font-size: 0.92rem; color: var(--text-secondary);"><strong>Requisitos:</strong> ${t.requirements}</p>
            <p style="font-size: 0.92rem; color: var(--text-secondary);"><strong>Efeitos:</strong> ${highlightTerms(t.effects)}</p>
          </article>
        `).join("")}
      </div>
    `;
  }

  function renderArsenal() {
    const allItems = [
      ...DATA.items.medical,
      ...DATA.items.psychoactive,
      ...DATA.items.melee,
      ...DATA.items.ranged,
      ...DATA.items.misc
    ];

    const q = state.itemSearchQuery.trim().toLowerCase();
    const cat = state.itemCategoryFilter;

    const filtered = allItems.filter(item => {
      const matchesQ = !q ||
        item.name.toLowerCase().includes(q) ||
        item.effect.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      const matchesCat = cat === "all" || item.category === cat;
      return matchesQ && matchesCat;
    });

    return `
      <section class="section-hero">
        <div class="section-kicker">Capítulo 8 • Listas de Equipamentos</div>
        <h1 class="section-title">Arsenal, Medicamentos, Psicoativos & Itens</h1>
        <p class="section-lead">
          Catálogo completo com todos os itens medicinais, substâncias psicoativas, armas corpo-a-corpo, armas de fogo/distância e equipamentos especiais de LIMIAR.
        </p>
      </section>

      <div class="filter-bar">
        <label class="search-field">
          ${SEARCH_ICON}
          <input
            type="search"
            id="item-search-input"
            class="input-field"
            placeholder="Buscar item ou arma (ex: Winchester, Prozac, Fentanila, Espingarda, Sangramento)..."
            value="${state.itemSearchQuery}"
          >
        </label>
        <div class="chip-row">
          ${[
            { id: "all", label: `Todos (${allItems.length})` },
            { id: "Medicinal", label: `Medicinais (${DATA.items.medical.length})` },
            { id: "Psicoativo", label: `Psicoativos (${DATA.items.psychoactive.length})` },
            { id: "Corpo-a-Corpo", label: `Corpo-a-Corpo (${DATA.items.melee.length})` },
            { id: "À Distância", label: `Armas à Distância (${DATA.items.ranged.length})` },
            { id: "Miscelâneo", label: `Miscelâneos (${DATA.items.misc.length})` }
          ].map(btn => `
            <button type="button" class="btn-ui ${state.itemCategoryFilter === btn.id ? 'is-active' : ''}" data-item-filter="${btn.id}">
              ${btn.label}
            </button>
          `).join("")}
        </div>
      </div>

      <div class="grid-3">
        ${filtered.map(item => `
          <article class="wiki-card accent-card" style="--accent: ${item.color};">
            <div class="wiki-card-header">
              <h3 class="wiki-card-title" style="color: ${item.color};">${item.name}</h3>
              <span class="nav-badge">${item.category}</span>
            </div>
            <p style="color: var(--text-secondary); font-size: 0.94rem;">${highlightTerms(item.effect)}</p>
            ${(item.fireRate || item.roll) ? `
              <div style="display: flex; align-items: center; justify-content: space-between; margin-block-start: auto; padding-block-start: 0.5rem; border-block-start: 1px solid var(--border-subtle);">
                <span style="font-family: var(--font-mono); font-size: 0.82rem; color: var(--text-muted);">
                  ${item.fireRate ? item.fireRate : (item.rollType || item.category)}
                </span>
                ${item.roll ? `<code class="font-mono text-conhecimento">${item.roll}</code>` : ""}
              </div>
            ` : ""}
          </article>
        `).join("")}
      </div>
    `;
  }

  // ============================================================================
  // ROTEAMENTO E EVENTOS DE NAVEGAÇÃO
  // ============================================================================
  // ============================================================================
  // LOGO "LIMIAR" EM BARRAS (mesmo desenho do Criador de Fichas, estilo logotipo IBM)
  // ============================================================================
  const LOGO = {
    GLIFOS: {
      L: ["XX....", "XX....", "XX....", "XX....", "XX....", "XXXXXX", "XXXXXX"],
      I: ["XXXXXX", "..XX..", "..XX..", "..XX..", "..XX..", "..XX..", "XXXXXX"],
      M: ["XXX...XXX", "XXXX.XXXX", "XX.XXX.XX", "XX..X..XX", "XX.....XX", "XX.....XX", "XX.....XX"],
      A: ["..XXX..", ".XXXXX.", "XX...XX", "XX...XX", "XXXXXXX", "XX...XX", "XX...XX"],
      R: ["XXXXXX.", "XX...XX", "XX...XX", "XXXXXX.", "XX.XX..", "XX..XX.", "XX...XX"]
    },
    CORES: ["#ff4f64", "#ffae3b", "#ffe45e", "#36e08a", "#3fe0ff", "#5c8dff", "#e35cff"],
    barras(texto) {
      const out = [];
      let x0 = 0;
      for (const ch of String(texto || "LIMIAR").toUpperCase()) {
        const g = LOGO.GLIFOS[ch];
        if (!g) { x0 += 4; continue; }
        g.forEach((linha, row) => {
          let ini = -1;
          for (let col = 0; col <= linha.length; col++) {
            const on = linha[col] === "X";
            if (on && ini < 0) ini = col;
            if (!on && ini >= 0) { out.push({ x: x0 + ini, y: row, w: col - ini, row }); ini = -1; }
          }
        });
        x0 += g[0].length + 2;
      }
      return { barras: out, colunas: Math.max(0, x0 - 2), linhas: 7 };
    },
    svg(texto) {
      const lg = LOGO.barras(texto);
      const cw = 10, rh = 10, bh = 6.2;
      const rects = lg.barras.map(b => `<rect x="${b.x * cw}" y="${b.y * rh}" width="${b.w * cw}" height="${bh}" fill="${LOGO.CORES[b.row]}"/>`).join("");
      return `<svg viewBox="0 0 ${lg.colunas * cw} ${(lg.linhas - 1) * rh + bh}" xmlns="http://www.w3.org/2000/svg" focusable="false">${rects}</svg>`;
    }
  };

  function fillLogos(root) {
    root.querySelectorAll("[data-logo]").forEach(el => {
      if (!el.firstChild) el.innerHTML = LOGO.svg("LIMIAR");
    });
  }

  // Número de capítulo exibido como numeral gigante na capa de cada página
  const CHAPTER_INDEX = {
    "visao-geral": "00",
    atributos: "01",
    combate: "02",
    sanidade: "03",
    profissoes: "04",
    caminhos: "05",
    magias: "06",
    arsenal: "07"
  };

  function renderActiveView() {
    const mainEl = qid("wiki-main-content");
    if (!mainEl) return;

    switch (state.activeView) {
      case "visao-geral":
        mainEl.innerHTML = renderVisaoGeral();
        break;
      case "atributos":
        mainEl.innerHTML = renderAtributos();
        break;
      case "combate":
        mainEl.innerHTML = renderCombate();
        break;
      case "sanidade":
        mainEl.innerHTML = renderSanidade();
        break;
      case "profissoes":
        mainEl.innerHTML = renderProfissoes();
        break;
      case "caminhos":
        mainEl.innerHTML = renderCaminhos();
        break;
      case "magias":
        mainEl.innerHTML = renderMagias();
        break;
      case "arsenal":
        mainEl.innerHTML = renderArsenal();
        break;
      default:
        mainEl.innerHTML = renderVisaoGeral();
    }

    const hero = mainEl.querySelector(".section-hero");
    if (hero) hero.dataset.chapter = CHAPTER_INDEX[state.activeView] || "";
    fillLogos(mainEl);

    // Atualizar estado ativo dos botões da sidebar
    qa("[data-nav-item]").forEach(btn => {
      const isActive = btn.getAttribute("data-nav-item") === state.activeView;
      btn.classList.toggle("is-active", isActive);
      if (isActive) btn.setAttribute("aria-current", "page");
      else btn.removeAttribute("aria-current");
    });

    const capEl = qid("livro-cap-atual");
    if (capEl) capEl.textContent = CHAPTER_TITLES[state.activeView] || CHAPTER_TITLES["visao-geral"];
    buildPageToc(mainEl);
    bindViewEvents();
  }

  // ============================================================================
  // ÍNDICE "NESTA PÁGINA" (coluna da direita, montado a partir dos subtítulos)
  // ============================================================================
  let tocObserver = null;

  function buildPageToc(mainEl) {
    const toc = qid("page-toc");
    if (!toc) return;

    if (tocObserver) {
      tocObserver.disconnect();
      tocObserver = null;
    }
    toc.replaceChildren();

    const headings = [...mainEl.querySelectorAll("h2.sub-heading")];
    headings.forEach((h, i) => { h.id = `secao-${i + 1}`; });
    if (headings.length < 2) return;

    const list = document.createElement("ol");
    list.className = "toc-list";
    const links = new Map();

    headings.forEach((h, i) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = `#${h.id}`;
      a.className = "toc-link";
      const num = document.createElement("span");
      num.className = "toc-index";
      num.textContent = String(i + 1).padStart(2, "0");
      a.append(num, document.createTextNode(h.textContent.trim()));
      a.addEventListener("click", e => {
        e.preventDefault();
        h.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
      });      li.append(a);
      list.append(li);
      links.set(h, a);
    });

    toc.append(list);

    // Destaca a seção que está passando pela parte de cima da tela; a barra
    // (que rola na horizontal) acompanha para a aba ativa ficar visível.
    tocObserver = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const active = links.get(entry.target);
        if (!active) continue;
        links.forEach(a => a.classList.remove("is-active"));
        active.classList.add("is-active");
        const left = active.offsetLeft - 12;
        const right = active.offsetLeft + active.offsetWidth + 12 - toc.clientWidth;
        if (toc.scrollLeft > left) toc.scrollLeft = left;
        else if (toc.scrollLeft < right) toc.scrollLeft = right;
      }
    }, { rootMargin: "-120px 0px -65% 0px" });
    headings.forEach(h => tocObserver.observe(h));
    links.get(headings[0])?.classList.add("is-active");
  }

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  // Troca de página com View Transitions (varredura de tubo, ver styles.css).
  // Filtros que re-renderizam a página chamam renderActiveView direto, sem transição.
  function swapView(update) {
    update();
  }

  const MOBILE_NAV = window.matchMedia("(max-width: 980px)");

  function setNavOpen(open) {
    if (!elRaiz) return;
    const sidebar = qid("wiki-sidebar");
    const scrim = qid("nav-scrim");
    const menuBtn = qid("mobile-menu-toggle");
    if (MOBILE_NAV.matches) {
      if (sidebar) sidebar.classList.toggle("is-open", open);
      if (scrim) scrim.hidden = !open;
      document.documentElement.classList.toggle("livro-gaveta-aberta", open);
    } else {
      if (sidebar) sidebar.classList.remove("is-open");
      if (scrim) scrim.hidden = true;
      document.documentElement.classList.remove("livro-gaveta-aberta");
      elRaiz.classList.toggle("nav-collapsed", !open);
    }
    if (menuBtn) menuBtn.setAttribute("aria-expanded", String(open));
  }

  function isNavOpen() {
    if (!elRaiz) return false;
    const sidebar = qid("wiki-sidebar");
    return MOBILE_NAV.matches
      ? Boolean(sidebar && sidebar.classList.contains("is-open"))
      : !elRaiz.classList.contains("nav-collapsed");
  }

  function navigateTo(viewId, options = {}) {
    state.activeView = viewId;
    if (options.pathId) state.activePathId = options.pathId;
    if (options.profQuery !== undefined) state.profSearchQuery = options.profQuery;
    if (options.itemQuery !== undefined) state.itemSearchQuery = options.itemQuery;
    if (options.pathQuery !== undefined) state.pathSearchQuery = options.pathQuery;

    if (MOBILE_NAV.matches) setNavOpen(false);
    swapView(() => {
      renderActiveView();
      window.scrollTo({ top: 0, behavior: "instant" });
    });
  }

  function bindViewEvents() {
    qa("[data-nav]").forEach(el => {
      el.addEventListener("click", () => {
        navigateTo(el.getAttribute("data-nav"));
      });
      if (el.tagName !== "BUTTON") {
        el.addEventListener("keydown", e => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            navigateTo(el.getAttribute("data-nav"));
          }
        });
      }
    });

    qa("[data-status-filter]").forEach(btn => {
      btn.addEventListener("click", () => {
        state.statusCategoryFilter = btn.getAttribute("data-status-filter");
        renderActiveView();
      });
    });

    const profInput = qid("prof-search-input");
    if (profInput) {
      profInput.addEventListener("input", e => {
        state.profSearchQuery = e.target.value;
        const pos = profInput.selectionStart;
        renderActiveView();
        const nextInput = qid("prof-search-input");
        if (nextInput) {
          nextInput.focus();
          nextInput.setSelectionRange(pos, pos);
        }
      });
    }

    qa("[data-prof-filter]").forEach(btn => {
      btn.addEventListener("click", () => {
        state.profAttrFilter = btn.getAttribute("data-prof-filter");
        renderActiveView();
      });
    });

    qa("[data-path-tab]").forEach(btn => {
      btn.addEventListener("click", () => {
        state.activePathId = btn.getAttribute("data-path-tab");
        state.pathSearchQuery = "";
        renderActiveView();
      });
    });

    const pathSearchInput = qid("path-node-search");
    if (pathSearchInput) {
      pathSearchInput.addEventListener("input", e => {
        state.pathSearchQuery = e.target.value;
        const pos = pathSearchInput.selectionStart;
        renderActiveView();
        const nextInput = qid("path-node-search");
        if (nextInput) {
          nextInput.focus();
          nextInput.setSelectionRange(pos, pos);
        }
      });
    }

    const itemInput = qid("item-search-input");
    if (itemInput) {
      itemInput.addEventListener("input", e => {
        state.itemSearchQuery = e.target.value;
        const pos = itemInput.selectionStart;
        renderActiveView();
        const nextInput = qid("item-search-input");
        if (nextInput) {
          nextInput.focus();
          nextInput.setSelectionRange(pos, pos);
        }
      });
    }

    qa("[data-item-filter]").forEach(btn => {
      btn.addEventListener("click", () => {
        state.itemCategoryFilter = btn.getAttribute("data-item-filter");
        renderActiveView();
      });
    });
  }

  function buildGlobalSearchIndex() {
    const index = [];

    for (const a of DATA.attributes) {
      index.push({
        title: `Atributo: ${a.name}`,
        category: "Atributos & Corpo",
        desc: `${a.shortDesc} ${a.fullDesc}`,
        action: () => navigateTo("atributos")
      });
    }

    for (const st of DATA.statuses) {
      index.push({
        title: `Status: ${st.name}`,
        category: `Status (${st.category})`,
        desc: st.effect,
        action: () => navigateTo("sanidade")
      });
    }

    for (const dis of DATA.sanity.disorders) {
      for (const lvl of dis.levels) {
        index.push({
          title: `Distúrbio: ${dis.name} (${lvl.grade})`,
          category: "Sanidade & Distúrbios",
          desc: lvl.effect,
          action: () => navigateTo("sanidade")
        });
      }
    }

    for (const p of DATA.professions) {
      index.push({
        title: `Profissão: ${p.name}`,
        category: "Profissões",
        desc: `Bônus: ${p.bonusText} • Equipamento: ${p.equipment} • Dinheiro: ${p.money}`,
        action: () => navigateTo("profissoes", { profQuery: p.name })
      });
    }

    for (const path of DATA.paths) {
      for (const track of path.tracks) {
        for (const node of track.nodes) {
          index.push({
            title: `${node.name} [Nv. ${node.level}]`,
            category: `${path.name} -> ${track.name}`,
            desc: node.desc,
            action: () => navigateTo("caminhos", { pathId: path.id, pathQuery: node.name })
          });
        }
      }
    }

    const allItems = [
      ...DATA.items.medical,
      ...DATA.items.psychoactive,
      ...DATA.items.melee,
      ...DATA.items.ranged,
      ...DATA.items.misc
    ];
    for (const it of allItems) {
      index.push({
        title: `${it.name}`,
        category: `Equipamento (${it.category})`,
        desc: it.effect,
        action: () => navigateTo("arsenal", { itemQuery: it.name })
      });
    }

    index.push(
      {
        title: "Contra-Ação (DF5 vs DF6)",
        category: "Regras de Combate",
        desc: DATA.rules.combat.counterAction,
        action: () => navigateTo("combate")
      },
      {
        title: "Defesa Ativa e Passiva",
        category: "Regras de Combate",
        desc: DATA.rules.combat.activeDefense,
        action: () => navigateTo("combate")
      },
      {
        title: "Palavras de Conjuração (Verbal, Poder, Impulso)",
        category: "Magias & Rituais",
        desc: "Estrutura de magias em LIMIAR, classes 1 a 5 e exemplos Gof'nnn gn'th'bthnk mg'nglui.",
        action: () => navigateTo("magias")
      }
    );

    return index;
  }

  function initGlobalSearch() {
    const searchIndex = buildGlobalSearchIndex();
    const dialog = qid("global-search-dialog");
    const openBtn = qid("open-search-btn");
    const closeBtn = qid("close-search-btn");
    const input = qid("global-search-input");
    const resultsContainer = qid("global-search-results");

    function renderResults(query) {
      const q = query.trim().toLowerCase();
      const matches = q
        ? searchIndex.filter(entry =>
            entry.title.toLowerCase().includes(q) ||
            entry.category.toLowerCase().includes(q) ||
            entry.desc.toLowerCase().includes(q)
          ).slice(0, 25)
        : searchIndex.slice(0, 12);

      if (matches.length === 0) {
        resultsContainer.innerHTML = `<div class="search-empty">Nenhum resultado encontrado para "${query}".</div>`;
        return;
      }

      resultsContainer.innerHTML = matches.map((m, idx) => `
        <button type="button" class="search-result-item" data-search-idx="${idx}">
          <div class="search-result-head">
            <strong class="search-result-title">${m.title}</strong>
            <span class="nav-badge">${m.category}</span>
          </div>
          <div class="search-result-desc">${m.desc}</div>
        </button>
      `).join("");

      resultsContainer.querySelectorAll("[data-search-idx]").forEach(btn => {
        btn.addEventListener("click", () => {
          const item = matches[parseInt(btn.getAttribute("data-search-idx"), 10)];
          if (item) {
            dialog.close();
            item.action();
          }
        });
      });
    }

    if (openBtn && dialog) {
      openBtn.addEventListener("click", () => {
        dialog.showModal();
        renderResults(input.value);
        input.focus();
      });
    }

    if (closeBtn && dialog) {
      closeBtn.addEventListener("click", () => dialog.close());
    }

    if (input) {
      input.addEventListener("input", e => renderResults(e.target.value));
    }

    window.addEventListener("keydown", e => {
      if (!elRaiz || !elRaiz.isConnected) return;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (dialog.open) {
          dialog.close();
        } else {
          dialog.showModal();
          renderResults(input.value);
          input.focus();
        }
      }
    });
  }

  function construirRaiz() {
    const wrap = document.createElement("div");
    wrap.className = "livro-shell";
    wrap.innerHTML = `
      <header class="livro-topbar">
        <button type="button" class="livro-menu-btn" id="mobile-menu-toggle" aria-expanded="false" aria-controls="wiki-sidebar" aria-label="Alternar menu de capítulos" title="Alternar menu de capítulos">
          <span class="livro-menu-l" aria-hidden="true">L</span>
          <span class="livro-menu-label">Capítulos</span>
        </button>

        <div class="brand-lockup" id="brand-home-trigger" role="button" tabindex="0" aria-label="Voltar para a capa da Wiki">
          <span class="brand-subtitle">LIVRO DO JOGADOR • COMPÊNDIO OFICIAL</span>
          <span class="brand-cap" id="livro-cap-atual">00. Visão Geral &amp; Lore</span>
        </div>

        <div class="livro-controls">
          <search class="header-search">
            <button type="button" class="search-trigger-btn" id="open-search-btn" aria-label="Pesquisar em toda a Wiki">
              <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/></svg>
              <span class="search-trigger-label">Buscar regras, nós, profissões, armas...</span>
              <kbd class="search-kbd">Ctrl+K</kbd>
            </button>
          </search>
          <button type="button" class="st-btn" id="toggle-font-btn" title="Alternar entre fonte de leitura e fonte pixelada original do PDF">Fonte: Leitura</button>
        </div>
      </header>

      <section class="livro-hud" aria-label="Resumo Rápido de Mesa">
        <div class="hud-seg hud-id"><span class="hud-name">RESUMO RÁPIDO DE MESA</span></div>
        <div class="hud-seg"><span class="hud-l">• <strong>Acerto:</strong></span> <code class="hud-v text-acuidade">1d20 + Atrib. vs DF</code></div>
        <div class="hud-seg"><span class="hud-l">• <strong>Defesa Passiva:</strong></span> <code class="hud-v text-vigor">2d4 × VIGOR (%)</code></div>
        <div class="hud-seg"><span class="hud-l">• <strong>Contra-Ação:</strong></span> <code class="hud-v text-psicometria">DF 5 / DF 6</code></div>
        <div class="hud-seg"><span class="hud-l">• <strong>Conhecimento:</strong></span> <code class="hud-v text-conhecimento">1 Dano San. = +1%</code></div>
        <div class="hud-seg"><span class="hud-l">• <strong>Morte Imediata:</strong></span> <code class="hud-v text-vigor">Cabeça 0 ou Tronco 0</code></div>
      </section>

      <div class="layout">
        <aside class="wiki-sidebar" id="wiki-sidebar" aria-label="Capítulos do Livro">
          <div class="wiki-sidebar-head">
            <span class="wiki-sidebar-title">SUMÁRIO DO LIVRO</span>
            <button type="button" class="btn-ui" id="wiki-sidebar-close" aria-label="Fechar sumário">✕</button>
          </div>

          <nav class="nav-groups">
            <div class="nav-group">
              <div class="nav-group-title">INTRODUÇÃO &amp; AMBIENTAÇÃO</div>
              <ul class="nav-list">
                <li>
                  <button type="button" class="nav-btn is-active" data-nav-item="visao-geral" aria-current="page">
                    <span class="nav-index" aria-hidden="true">00</span>
                    <span class="nav-label">Visão Geral &amp; Lore</span>
                    <span class="nav-badge">Pág. 1-2</span>
                  </button>
                </li>
              </ul>
            </div>

            <div class="nav-group">
              <div class="nav-group-title">CAP. 1 • SISTEMA &amp; REGRAS</div>
              <ul class="nav-list">
                <li>
                  <button type="button" class="nav-btn" data-nav-item="atributos">
                    <span class="nav-index" aria-hidden="true">01</span>
                    <span class="nav-label">Atributos, Corpo &amp; Fôlego</span>
                    <span class="nav-badge">5 Atrib.</span>
                  </button>
                </li>
                <li>
                  <button type="button" class="nav-btn" data-nav-item="combate">
                    <span class="nav-index" aria-hidden="true">02</span>
                    <span class="nav-label">Testes, Combate &amp; Inventário</span>
                    <span class="nav-badge">DF 1-10</span>
                  </button>
                </li>
                <li>
                  <button type="button" class="nav-btn" data-nav-item="sanidade">
                    <span class="nav-index" aria-hidden="true">03</span>
                    <span class="nav-label">Sanidade, Distúrbios &amp; Status</span>
                    <span class="nav-badge">17 Status</span>
                  </button>
                </li>
              </ul>
            </div>

            <div class="nav-group">
              <div class="nav-group-title">CAP. 2 A 6 • PERITOS &amp; CAMINHOS</div>
              <ul class="nav-list">
                <li>
                  <button type="button" class="nav-btn" data-nav-item="profissoes">
                    <span class="nav-index" aria-hidden="true">04</span>
                    <span class="nav-label">Criação &amp; Profissões</span>
                    <span class="nav-badge">33 Prof.</span>
                  </button>
                </li>
                <li>
                  <button type="button" class="nav-btn" data-nav-item="caminhos">
                    <span class="nav-index" aria-hidden="true">05</span>
                    <span class="nav-label">Os 5 Caminhos do Indizível</span>
                    <span class="nav-badge">160 Nós</span>
                  </button>
                </li>
              </ul>
            </div>

            <div class="nav-group">
              <div class="nav-group-title">CAP. 7 &amp; 8 • OCULTISMO &amp; ARSENAL</div>
              <ul class="nav-list">
                <li>
                  <button type="button" class="nav-btn" data-nav-item="magias">
                    <span class="nav-index" aria-hidden="true">06</span>
                    <span class="nav-label">Revelações, Magias &amp; Rituais</span>
                    <span class="nav-badge">Cap. 7</span>
                  </button>
                </li>
                <li>
                  <button type="button" class="nav-btn" data-nav-item="arsenal">
                    <span class="nav-index" aria-hidden="true">07</span>
                    <span class="nav-label">Arsenal, Drogas &amp; Itens</span>
                    <span class="nav-badge">50+ Itens</span>
                  </button>
                </li>
              </ul>
            </div>
          </nav>
        </aside>

        <div class="content-col">
          <nav class="page-toc" id="page-toc" aria-label="Seções desta página"></nav>
          <main class="wiki-main" id="wiki-main-content"></main>
        </div>
      </div>

      <div class="nav-scrim" id="nav-scrim" hidden></div>

      <dialog class="search-dialog" id="global-search-dialog" closedby="any" aria-label="Busca Global na Wiki">
        <div class="search-dialog-header">
          <span class="search-dialog-label">BUSCA:</span>
          <input
            type="search"
            id="global-search-input"
            class="search-dialog-input"
            placeholder="Digite qualquer regra, atributo, nó, profissão, status ou arma..."
            autocomplete="off"
          >
          <button type="button" class="btn-ui search-esc" id="close-search-btn">ESC</button>
        </div>
        <div class="search-results-list" id="global-search-results"></div>
      </dialog>
    `;

    elRaiz = wrap;

    qa("[data-nav-item]").forEach(btn => {
      btn.addEventListener("click", () => {
        navigateTo(btn.getAttribute("data-nav-item"));
      });
    });

    const brandEl = qid("brand-home-trigger");
    if (brandEl) {
      brandEl.addEventListener("click", () => navigateTo("visao-geral"));
      brandEl.addEventListener("keydown", e => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          navigateTo("visao-geral");
        }
      });
    }

    const fontToggleBtn = qid("toggle-font-btn");
    if (fontToggleBtn) {
      fontToggleBtn.addEventListener("click", () => {
        state.pixelMode = !state.pixelMode;
        elRaiz.classList.toggle("pixel-mode", state.pixelMode);
        fontToggleBtn.classList.toggle("is-active", state.pixelMode);
        fontToggleBtn.textContent = state.pixelMode ? "Fonte: Pixel (Livro)" : "Fonte: Leitura";
      });
    }

    const mobileMenuBtn = qid("mobile-menu-toggle");
    const closeSidebarBtn = qid("wiki-sidebar-close");
    const sidebar = qid("wiki-sidebar");
    const scrim = qid("nav-scrim");
    if (mobileMenuBtn && sidebar) {
      mobileMenuBtn.addEventListener("click", () => setNavOpen(!isNavOpen()));
    }
    if (closeSidebarBtn) {
      closeSidebarBtn.addEventListener("click", () => setNavOpen(false));
    }
    if (scrim) {
      scrim.addEventListener("click", () => setNavOpen(false));
    }
    window.addEventListener("keydown", e => {
      if (!elRaiz || !elRaiz.isConnected) return;
      if (e.key === "Escape" && sidebar && sidebar.classList.contains("is-open")) {
        setNavOpen(false);
      }
    });

    setNavOpen(!MOBILE_NAV.matches);
    MOBILE_NAV.addEventListener("change", () => setNavOpen(!MOBILE_NAV.matches));

    initGlobalSearch();
    renderActiveView();
    return elRaiz;
  }

  L.Livro = {
    estado: state,
    navegar: navigateTo,
    montar(host) {
      if (!host) return;
      if (!elRaiz) construirRaiz();
      if (elRaiz.parentNode !== host) {
        host.replaceChildren(elRaiz);
      }
    }
  };
})(window.LIMIAR = window.LIMIAR || {});
