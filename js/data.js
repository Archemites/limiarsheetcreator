/* LIMIAR — conteúdo do Livro do Jogador (1ª Edição) e da extensão "Em um Passado Distante".
   Todo o texto de regras vive aqui; o resto do app só lê estes dados. */
(function () {
  'use strict';
  const L = (window.LIMIAR = window.LIMIAR || {});

  /* ------------------------------------------------------------------ */
  /* ATRIBUTOS                                                          */
  /* ------------------------------------------------------------------ */
  const ATRIBUTOS = [
    {
      id: 'VIG', nome: 'VIGOR', cor: 'vig', caminho: 'eidolon',
      resumo: 'Atributo que determina desempenho físico',
      usos: 'Vida por membro, Defesa, Fôlego, força, locomoção em combate e +VIGOR de dano com armas cegas ou desarmado.'
    },
    {
      id: 'ACU', nome: 'ACUIDADE', cor: 'acu', caminho: 'profetico',
      resumo: 'Atributo que determina minuciosidade',
      usos: 'Arrombar fechaduras, procurar algo específico, encontrar objetos perdidos/ocultos, consertar objetos, armas de fogo, iniciativa e testes de acerto.'
    },
    {
      id: 'PSI', nome: 'PSICOMETRIA', cor: 'psi', caminho: 'real',
      resumo: 'Atributo que determina fatores cognitivos e sociais',
      usos: 'Intelecto e desenvoltura social. Dividido nos sub-atributos Inteligência e Sapiência.'
    },
    {
      id: 'ESO', nome: 'ESOTERISMO', cor: 'eso', caminho: 'anciao',
      resumo: 'Atributo que determina afinidade com o Indizível',
      usos: 'Compreender os Seres Indizíveis, realizar rituais, encantar objetos e falar com o LIMIAR. Cada ponto é um nível de Afinidade.'
    },
    {
      id: 'RAZ', nome: 'RAZÃO', cor: 'raz', caminho: 'loucura',
      resumo: 'Atributo que determina resistência contra o Indizível e Sanidade',
      usos: 'Cada ponto é um turno de combate sustentado sem perder sanidade. Define a Sanidade: [RAZÃO] + 1d6 (mínimo 2).'
    }
  ];

  const SUBATRIBUTOS = {
    INT: {
      id: 'INT', nome: 'Inteligência',
      desc: 'Determina a capacidade do Perito de interagir com tecnologia, seja computadores, rede elétrica, leitura, identificar padrões, decifrar criptografias e afins.'
    },
    SAP: {
      id: 'SAP', nome: 'Sapiência',
      desc: 'Determina a qualidade do "Jogo de Cintura" do Perito, seja lidar com pessoas, persuadir, influenciar, perceber mentiras, dedução e afins.'
    }
  };

  const CRIACAO = { pontos: 5, max: 10, min: -5 };

  /* ------------------------------------------------------------------ */
  /* CORPO                                                              */
  /* ------------------------------------------------------------------ */
  const MEMBROS = [
    { id: 'cabeca', nome: 'Cabeça', curto: 'CAB', base: 5, formula: 'VIGOR + 5' },
    { id: 'tronco', nome: 'Tronco', curto: 'TRO', base: 15, formula: 'VIGOR + 15' },
    { id: 'bracoE', nome: 'Braço esquerdo', curto: 'B.E', base: 8, formula: 'VIGOR + 8' },
    { id: 'bracoD', nome: 'Braço direito', curto: 'B.D', base: 8, formula: 'VIGOR + 8' },
    { id: 'pernaE', nome: 'Perna esquerda', curto: 'P.E', base: 10, formula: 'VIGOR + 10' },
    { id: 'pernaD', nome: 'Perna direita', curto: 'P.D', base: 10, formula: 'VIGOR + 10' }
  ];

  /* ------------------------------------------------------------------ */
  /* TESTES                                                             */
  /* ------------------------------------------------------------------ */
  const DIFICULDADES = [
    { df: 1, min: 10 }, { df: 2, min: 12 }, { df: 3, min: 14 }, { df: 4, min: 16 }, { df: 5, min: 18 },
    { df: 6, min: 19 }, { df: 7, min: 20 }, { df: 8, min: 24 }, { df: 9, min: 26 }, { df: 10, min: 30 }
  ];

  /* ------------------------------------------------------------------ */
  /* SANIDADE                                                           */
  /* ------------------------------------------------------------------ */
  const FAIXAS_SANIDADE = [
    { min: -10, max: -1, efeito: 'Casos de Paranoia Severa e Alucinações' },
    { min: -20, max: -11, efeito: 'Casos de Psicose Grave e Agressividade' },
    { min: -30, max: -21, efeito: 'Perda de Memória, Dificuldade Motora (-1 de ACUIDADE)' },
    { min: -40, max: -31, efeito: 'Toques Fantasmas, Episódios de Devaneios e Incapacidade de Fala' },
    { min: -50, max: -41, efeito: 'Dano Cerebral Permanente (-5 em todos os testes)' },
    { min: -60, max: -51, efeito: 'Dano Cerebral Grave Permanente (-8 em todos os testes)' },
    { min: -70, max: -61, efeito: 'Irrecuperável' },
    { min: -100, max: -71, efeito: 'Morte Cerebral' }
  ];

  const DISTURBIOS = {
    depressao: {
      nome: 'Depressão', indicador: 'Deprimido (leve) · Suicida (moderada/grave)', tratamento: 'Prozac · Zoloft (grave)',
      graus: [
        { id: 'leve', nome: 'Leve', desc: 'O Perito apresenta certo desânimo nas interações sociais e profissionais, tendo dificuldade de se comunicar, muitas vezes preferindo ficar para trás ou se separar do grupo. Eventualmente o Espectador vai pedir um teste de PSICOMETRIA para os Peritos Depressivos antes de decisões em grupo, caso o Perito falhe, não conseguirá seguir o combinado, por qualquer motivo narrativo.' },
        { id: 'moderada', nome: 'Moderada', desc: 'O Teste de PSICOMETRIA se torna consideravelmente mais difícil e o Perito perde a habilidade de interagir com estranhos.' },
        { id: 'grave', nome: 'Grave', desc: 'O Perito tem dificuldade máxima no teste de PSICOMETRIA, perde a habilidade de interagir com estranhos e necessita de um teste adicional de RAZÃO para resistir à vontade de atentar contra a própria vida.' }
      ]
    },
    esquizofrenia: {
      nome: 'Esquizofrenia', indicador: 'Estressado', tratamento: 'Ziprasidona',
      tipos: [
        { id: 'paranoide', nome: 'Paranoide', desc: 'O Perito passa a ouvir sussurros em sua mente e alucinar com pessoas/criaturas.' },
        { id: 'hebefrenica', nome: 'Hebefrênica', desc: 'O Perito passa a ter uma incoerência em seus sentimentos além de ter extrema dificuldade (DESVANTAGEM) em seus testes de PSICOMETRIA ao utilizar itens medicinais.' },
        { id: 'catatonica', nome: 'Catatônica', desc: 'O Perito pode ter perturbações psicomotoras onde pode ficar imóvel, passando seu turno em combate ou alternando em picos de hiperatividade, agindo duas vezes por turno, sempre realizando um teste de RAZÃO para definir.' }
      ]
    },
    ansiedade: {
      nome: 'Ansiedade', indicador: 'Ansioso', tratamento: 'Clonazepam · Adesivo de Nicotina (alivia sintomas)',
      graus: [
        { id: 'leve', nome: 'Leve', desc: 'O Perito tem reações de alerta fora do normal. Não afeta gravemente sua rotina.' },
        { id: 'moderada', nome: 'Moderada', desc: 'Preocupações constantes, irritabilidade, insônia, esta que impede o Perito de receber os benefícios de um descanso longo por completo, ocasionando em apenas 50% de recuperação.' },
        { id: 'grave', nome: 'Grave', desc: 'O Perito pode ter crises intensas (30% de chance EM COMBATE), sensação de perigo iminente.' }
      ]
    }
  };

  /* Status do Perito (p. 18). `auto` = indicador calculado pelos distúrbios. */
  const STATUS = [
    { id: 'exaustao', nome: 'Exaustão', cor: 'vig', desc: 'Cansaço que causa -[VIGOR] em todos os testes.' },
    { id: 'insano', nome: 'Insano', cor: 'psi', desc: 'Toma 2x de dano em Sanidade.' },
    { id: 'ansioso', nome: 'Ansioso', cor: 'psi', desc: 'Indicador de Ansiedade.', auto: true },
    { id: 'estressado', nome: 'Estressado', cor: 'raz', desc: 'Indicador de Esquizofrenia.', auto: true },
    { id: 'deprimido', nome: 'Deprimido', cor: 'psi', desc: 'Indicador de Depressão Leve.', auto: true },
    { id: 'suicida', nome: 'Suicida', cor: 'mute', desc: 'Indicador de Depressão Moderada ou Grave.', auto: true },
    { id: 'cancer', nome: 'Câncer', cor: 'vig', desc: 'Desenvolvido ao consumir em excesso cigarros, -2 do atributo de VIGOR.' },
    { id: 'embriagado', nome: 'Embriagado', cor: 'raz', desc: 'O Perito bebeu demais, -2 no teste de ACUIDADE.' },
    { id: 'infeccao', nome: 'Infecção', cor: 'acu', desc: 'O Perito está com uma infecção em algum dos membros, caso passe mais de 1 hora sem tratar, o personagem tem uma gangrena e perde o membro infeccionado.' },
    { id: 'envenenado', nome: 'Envenenado', cor: 'acu', desc: 'O Perito recebe 1d4 de dano a cada 10 minutos.' },
    { id: 'sangrando', nome: 'Sangrando', cor: 'vig', desc: 'O Perito perde 1d4 de dano a cada 5 minutos.' },
    { id: 'parasitado', nome: 'Parasitado', cor: 'acu', desc: 'O Perito tem vermes embaixo da pele que causam 1d4 de dano a cada 10 minutos.' },
    { id: 'amaldicoado', nome: 'Amaldiçoado', cor: 'eso', desc: 'Aplicado apenas em combate, caso passe 3 turnos amaldiçoado fica com 1 de Vida e 1 de Sanidade caso o Perito tenha mais que zero nas duas barras. Pode interagir com seres espectrais.' },
    { id: 'chamas', nome: 'Em chamas', cor: 'raz', desc: 'O Perito pega fogo tomando 1d8 de dano por turno.' },
    { id: 'atordoado', nome: 'Atordoado', cor: 'psi', desc: 'O Perito perde seu próximo turno, pode ser aplicado até 3 vezes.' },
    { id: 'paralizado', nome: 'Paralizado', cor: 'mute', desc: 'O Perito perde o movimento permanentemente até o final do combate.' },
    { id: 'critico', nome: 'Estado Crítico', cor: 'vig', desc: 'O Perito fica extremamente exposto e vulnerável, ao tomar um dano tem 25% de chance de receber um ataque quase-fatal que reduz a vida do Perito a 1 ponto.' }
  ];

  /* ------------------------------------------------------------------ */
  /* HABILIDADES (profissões e classes)                                 */
  /* ------------------------------------------------------------------ */
  const HABILIDADES = {
    sermao: {
      id: 'sermao', nome: 'Sermão', tipo: 'Habilidade',
      desc: 'O Sacerdote conduz sermões. Pelas regras de RAZÃO, ouvir sermões é uma das formas de recuperar Sanidade; a quantidade recuperada é definida pelo Espectador.'
    },
    terapia: {
      id: 'terapia', nome: 'Sessão de Terapia', tipo: 'Habilidade',
      desc: 'O Psicólogo pode realizar Sessões de Terapia: somente ao final de uma sessão de jogo, uma por sessão, restaurando 1d6 de Pontos de Sanidade por Perito. Com o bônus da profissão (+1 de Recuperação em Terapia) a sessão restaura 1d6+1.',
      rolagem: 'terapia'
    },
    'postura-guarda': {
      id: 'postura-guarda', nome: 'Postura de Guarda', tipo: 'Habilidade',
      desc: 'Diminui a DF do próximo teste de Bloqueio para 2 e garante +5 no mesmo teste.',
      rolagem: 'postura'
    },
    'bater-carteira': {
      id: 'bater-carteira', nome: 'Bater Carteira', tipo: 'Habilidade',
      desc: 'Com um teste de ACUIDADE DF 5, o Perito pode simplesmente roubar algo do inimigo, caso tenha, não podendo escolher o que roubar.',
      rolagem: 'carteira'
    },
    ferir: {
      id: 'ferir', nome: 'Ferir', tipo: 'Habilidade/Magia',
      desc: "Uma magia poderosa, feita por Maha'tat que tem 100% de chance de acerto, dano de 1d6, mas 50% de chance de remover um membro instantaneamente.",
      rolagem: 'ferir'
    },
    'furia-implacavel': {
      id: 'furia-implacavel', nome: 'Fúria Implacável', tipo: 'Habilidade',
      desc: 'O Berserker berra numa fúria descontrolada, passa a atacar o inimigo com maior vida, não podendo escolher mais, entretanto ataca duas vezes.',
      rolagem: 'furia'
    },
    'corte-z': {
      id: 'corte-z', nome: 'Corte Z', tipo: 'Habilidade',
      desc: 'O Youxia utilizando sua Jian faz um corte em formato de Z que golpeia 3 vezes consecutivas cada uma causando 1d8 de dano com chance de 33% por golpe de cortar um membro fora. Gasta 1d4 de Sanidade.',
      rolagem: 'cortez'
    }
  };

  /* ------------------------------------------------------------------ */
  /* PROFISSÕES (Livro do Jogador, cap. 3)                              */
  /* bonus: VIG/ACU/PSI/ESO/RAZ = atributo · INT/SAP = sub-atributo     */
  /*        sanMax = Sanidade máxima · folego = Pontos de Fôlego        */
  /* equip: nomes do livro; `ref` aponta p/ o catálogo quando há regra  */
  /* ------------------------------------------------------------------ */
  const PROFISSOES = [
    { id: 'policial', nome: 'Policial', bonusTexto: '+2 em ACUIDADE, +1 em RAZÃO', bonus: { ACU: 2, RAZ: 1 },
      equip: [{ nome: 'Revólver .38', ref: 'revolver-38' }, { nome: 'Distintivo' }], dinheiro: '1d20' },
    { id: 'medico', nome: 'Médico', bonusTexto: '+2 em PSICOMETRIA (Inteligência), +1 em Sanidade máxima', bonus: { INT: 2, sanMax: 1 },
      equip: [{ nome: 'Kit Médico' }], dinheiro: '1d30' },
    { id: 'jornalista', nome: 'Jornalista', bonusTexto: '+2 em PSICOMETRIA (Sapiência), +1 em ACUIDADE', bonus: { SAP: 2, ACU: 1 },
      equip: [{ nome: 'Câmera Fotográfica' }], dinheiro: '1d12' },
    { id: 'professor', nome: 'Professor', bonusTexto: '+3 em PSICOMETRIA (Inteligência), -1 em VIGOR', bonus: { INT: 3, VIG: -1 },
      equip: [], equipTexto: 'Não começa com nada', dinheiro: '1d10' },
    { id: 'mecanico', nome: 'Mecânico', bonusTexto: '+2 em ACUIDADE, +1 em VIGOR', bonus: { ACU: 2, VIG: 1 },
      equip: [{ nome: 'Grifo', ref: 'ferramentas-grandes' }], dinheiro: '1d15' },
    { id: 'bombeiro', nome: 'Bombeiro', bonusTexto: '+2 em VIGOR, +1 em ACUIDADE', bonus: { VIG: 2, ACU: 1 },
      equip: [{ nome: 'Machado', ref: 'machados' }], dinheiro: '1d10' },
    { id: 'artista', nome: 'Artista', bonusTexto: '+3 em PSICOMETRIA (Sapiência), -1 em RAZÃO', bonus: { SAP: 3, RAZ: -1 },
      equip: [], equipTexto: 'Não começa com nada extra', dinheiro: '1d8' },
    { id: 'sacerdote', nome: 'Sacerdote', bonusTexto: '+2 em RAZÃO, +1 em ESOTERISMO, (HABILIDADE) Sermão', bonus: { RAZ: 2, ESO: 1 },
      habilidades: ['sermao'], equip: [], equipTexto: 'Nenhum', dinheiro: '1d6' },
    { id: 'carpinteiro', nome: 'Carpinteiro', bonusTexto: '+2 em VIGOR, +1 em ACUIDADE, -1 em PSICOMETRIA', bonus: { VIG: 2, ACU: 1, PSI: -1 },
      equip: [{ nome: 'Martelo', ref: 'martelos' }], dinheiro: '1d12' },
    { id: 'psicologo', nome: 'Psicólogo', bonusTexto: '+2 em PSICOMETRIA (Sapiência), +1 de Recuperação em Terapia, (HABILIDADE) Sessão de Terapia', bonus: { SAP: 2, terapia: 1 },
      habilidades: ['terapia'], equip: [], equipTexto: 'Nenhum', dinheiro: '1d20' },
    { id: 'comerciante', nome: 'Comerciante', bonusTexto: '+2 em PSICOMETRIA (Sapiência)', bonus: { SAP: 2 },
      equip: [{ escolha: 'psicoativo', qtd: 5, nome: 'Item Psicoativo (à escolha)' }], equipTexto: '5x Itens Psicoativos', dinheiro: '2d20' },
    { id: 'coveiro', nome: 'Coveiro', bonusTexto: '+1 em RAZÃO, +1 em ESOTERISMO', bonus: { RAZ: 1, ESO: 1 },
      equip: [{ nome: 'Pá', ref: 'ferramentas-grandes' }, { nome: 'Velas' }], dinheiro: '1d6' },
    { id: 'eletricista', nome: 'Eletricista', bonusTexto: '+2 em ACUIDADE, +1 em PSICOMETRIA (Inteligência), -1 em ESOTERISMO', bonus: { ACU: 2, INT: 1, ESO: -1 },
      equip: [{ nome: 'Chave Inglesa', ref: 'ferramentas-grandes' }], dinheiro: '1d15' },
    { id: 'advogado', nome: 'Advogado', bonusTexto: '+2 em PSICOMETRIA (Sapiência), +1 em Testes Sociais', bonus: { SAP: 2 },
      situacional: [{ txt: '+1 em Testes Sociais', v: 1, attrs: ['SAP', 'PSI'] }], equip: [{ nome: 'Pasta' }], dinheiro: '1d25' },
    { id: 'cacador', nome: 'Caçador', bonusTexto: '+2 em VIGOR, +1 em ACUIDADE', bonus: { VIG: 2, ACU: 1 },
      equip: [{ nome: 'Rifle .30-30', ref: 'winchester-3030' }, { nome: 'Faca de Caça', ref: 'facas' }], dinheiro: '1d8' },
    { id: 'musico', nome: 'Músico', bonusTexto: '+2 em PSICOMETRIA (Sapiência), -1 em RAZÃO', bonus: { SAP: 2, RAZ: -1 },
      equip: [{ nome: 'Instrumento Musical' }], dinheiro: '1d6' },
    { id: 'enfermeiro', nome: 'Enfermeiro', bonusTexto: '+2 em PSICOMETRIA (Inteligência), +1 em Sanidade máxima', bonus: { INT: 2, sanMax: 1 },
      equip: [{ nome: 'Kit Médico' }, { nome: 'Seringas' }], dinheiro: '1d12' },
    { id: 'apostador', nome: 'Apostador', bonusTexto: '+3 em PSICOMETRIA (Sapiência), -1 em VIGOR', bonus: { SAP: 3, VIG: -1 },
      equip: [{ nome: 'Canivete Stiletto', ref: 'facas' }], dinheiro: '2d15' },
    { id: 'bibliotecario', nome: 'Bibliotecário', bonusTexto: '+3 em PSICOMETRIA (Inteligência), -1 em VIGOR', bonus: { INT: 3, VIG: -1 },
      equip: [{ nome: 'Livro Raro' }], dinheiro: '1d8' },
    { id: 'veterano', nome: 'Veterano', bonusTexto: 'Vantagem em RAZÃO e ACUIDADE, +2 Armas de Fogo', bonus: {},
      vantagem: ['RAZ', 'ACU'], situacional: [{ txt: '+2 com Armas de Fogo', v: 2, attrs: ['ACU'], armaFogo: true }],
      equip: [{ escolha: 'arma', nome: 'Arma à escolha' }], dinheiro: '1d16' },
    { id: 'pesquisador', nome: 'Pesquisador', bonusTexto: '+3 em PSICOMETRIA (Inteligência), -1 em VIGOR', bonus: { INT: 3, VIG: -1 },
      equip: [], equipTexto: 'Não começa com nada', dinheiro: '1d18' },
    { id: 'detetive', nome: 'Detetive', bonusTexto: '+2 em ACUIDADE, +1 em PSICOMETRIA (Sapiência)', bonus: { ACU: 2, SAP: 1 },
      equip: [{ nome: 'Revólver', ref: 'revolver-38' }, { nome: 'Distintivo Falso' }], dinheiro: '1d20' },
    { id: 'motorista', nome: 'Motorista', bonusTexto: '+2 em ACUIDADE, +1 em VIGOR', bonus: { ACU: 2, VIG: 1 },
      equip: [{ nome: 'Carro', local: 'patrimonio' }, { nome: 'Chaves' }], dinheiro: '1d10' },
    { id: 'fotografo', nome: 'Fotógrafo', bonusTexto: '+2 em ACUIDADE, +1 em PSICOMETRIA (Inteligência)', bonus: { ACU: 2, INT: 1 },
      equip: [{ nome: 'Câmera Profissional com Flash de 8000 J' }], dinheiro: '1d12' },
    { id: 'fazendeiro', nome: 'Fazendeiro', bonusTexto: '+2 em VIGOR, +2 em RAZÃO', bonus: { VIG: 2, RAZ: 2 },
      equip: [{ nome: 'Winchester .22', ref: 'winchester-22' }], dinheiro: '1d10' },
    { id: 'farmaceutico', nome: 'Farmacêutico', bonusTexto: '+2 em PSICOMETRIA (Inteligência), +1 em Itens Psicoativos', bonus: { INT: 2, psicoativos: 1 },
      equip: [{ nome: 'Conjunto de Tratamento Mental' }], dinheiro: '1d16' },
    { id: 'historiador', nome: 'Historiador', bonusTexto: '+2 em PSICOMETRIA (Inteligência), +1 em ESOTERISMO', bonus: { INT: 2, ESO: 1 },
      equip: [{ nome: 'Atlas' }, { nome: 'Bússola' }], dinheiro: '1d10' },
    { id: 'criminoso', nome: 'Criminoso Reformado', bonusTexto: '+2 em VIGOR, +1 em Esquiva', bonus: { VIG: 2 },
      situacional: [{ txt: '+1 em Esquiva', v: 1, attrs: ['ACU'] }],
      equip: [{ nome: 'Arma Improvisada', ref: 'objeto-cenario' }, { nome: 'Gazuas' }], dinheiro: '1d6' },
    { id: 'ocultista', nome: 'Ocultista', bonusTexto: '+3 em ESOTERISMO, -1 em RAZÃO', bonus: { ESO: 3, RAZ: -1 },
      equip: [{ nome: 'Carta de Prece' }], dinheiro: '1d8' },
    { id: 'consultor', nome: 'Consultor', bonusTexto: '+2 em PSICOMETRIA (Sapiência)', bonus: { SAP: 2 },
      equip: [], equipTexto: 'Não começa com nada', dinheiro: '2d20' },
    { id: 'atleta', nome: 'Atleta', bonusTexto: '+2 em VIGOR, +1d4 de Fôlego na criação', bonus: { VIG: 2 }, folegoDado: '1d4',
      equip: [], equipTexto: 'Não começa com nada', dinheiro: '2d20' },
    { id: 'bom-pra-nada', nome: 'Bom-pra-nada', bonusTexto: '+4 em ESOTERISMO', bonus: { ESO: 4 },
      equip: [], equipTexto: 'Não começa com nada', dinheiro: '0' }
  ];

  /* ------------------------------------------------------------------ */
  /* EXTENSÃO — EM UM PASSADO DISTANTE                                  */
  /* ------------------------------------------------------------------ */
  const CLASSES = [
    { id: 'cavaleiro', nome: 'Cavaleiro de Themmia',
      desc: 'Um Cavaleiro da Corte Real de Themmia, ou somente Cavaleiro de Themmia é um Soldado treinado que responde e zela pelo império, podendo ser enviado em qualquer tipo de missão, desde execução até resgate.',
      bonusTexto: '+2 em VIGOR, +1 em ACUIDADE', bonus: { VIG: 2, ACU: 1 },
      equip: [{ nome: 'Armadura de Placas', tipo: 'armadura', parte: 'tronco' }, { nome: 'Espada Longa', tipo: 'cac' }],
      equipTexto: 'Armadura de Placas, Espada Longa, + Postura de Guarda (Habilidade)',
      habilidades: ['postura-guarda'], dinheiro: '1d20' },
    { id: 'mercenario', nome: 'Mercenário Errante',
      desc: 'Um indivíduo sem pátria, sem rumo e sem objetivo, vive de cidade em cidade, fazendo serviços que ninguém mais faz, como executar ou recuperar homens, vivos ou mortos, por apenas alguns trocados.',
      bonusTexto: '+1 em VIGOR, +1 em ACUIDADE', bonus: { VIG: 1, ACU: 1 },
      equip: [{ nome: 'Colete de Couro', tipo: 'armadura', parte: 'tronco' }, { nome: 'Cimitarra', tipo: 'cac' }],
      equipTexto: 'Colete de Couro, Cimitarra, + Bater Carteira (Habilidade)',
      habilidades: ['bater-carteira'], dinheiro: '1d12' },
    { id: 'padre', nome: 'Padre Sombrio',
      desc: "Um Padre Sombrio é um daqueles indivíduos que se voluntaria para tornar-se um dos sacerdotes da Igreja dos Antigos Deuses, para preservar o contato com os Deuses Maha'tat, Sha'rrat, Khalid, Beheltar e Vanari.",
      bonusTexto: '+2 em ESOTERISMO, -1 em VIGOR', bonus: { ESO: 2, VIG: -1 },
      equip: [{ nome: 'Livro de feitiço (aleatório)' }], conjuntoPalavras: 1,
      equipTexto: '+1x Conjunto de Palavras, +1 livro de feitiço aleatório, + Ferir (Habilidade/Magia)',
      habilidades: ['ferir'], dinheiro: '1d6' },
    { id: 'berserker', nome: 'Berserker Enfurecido',
      desc: 'Um guerreiro repleto de fúria, cujo perdeu algo que não tinha preço, perdeu algo e sente que deve encontrar um culpado, um amante da morte e carnificina.',
      bonusTexto: '+2 Pontos de Fôlego, -2 em RAZÃO', bonus: { folego: 2, RAZ: -2 },
      equip: [{ nome: 'Machado de Guerra', ref: 'machados' }, { nome: 'Armadura de Pele', tipo: 'armadura', parte: 'tronco' }],
      equipTexto: 'Machado de Guerra, Armadura de Pele, + Fúria Implacável (Habilidade)',
      habilidades: ['furia-implacavel'], dinheiro: '0' },
    { id: 'youxia', nome: 'Youxia',
      desc: 'Um artista marcial errante, sem rumo, vindo do oriente caminha pelo mundo buscando viver em harmonia com o mundo, um treinador guerreiro chinês, a figura das lendas do folclore.',
      bonusTexto: '+3 em ACUIDADE, -2 em VIGOR', bonus: { ACU: 3, VIG: -2 },
      equip: [{ nome: 'Jian', tipo: 'cac' }, { nome: 'Pergaminho Vazio' }],
      equipTexto: 'Jian, Pergaminho Vazio, + Corte Z (Habilidade)',
      habilidades: ['corte-z'], dinheiro: '1d10' }
  ];

  const PASSADO = {
    titulo: 'Em um Passado Distante',
    contexto: [
      'Há mais de mil anos atrás, as pessoas viviam em situações precárias, uma civilização ainda emergente, reinos e reis vivam sobre a terra, dentre os reis que haviam, o maior e mais poderoso deles era Adramelech de Nefertat, Rei-Imperador do grande Império de Themmia.',
      'Entretanto, depois de uma série de eventos (os quais cabem aos Peritos desvendarem o que ocorre), Adramelech foi preso e exilado na antiga Masmorra de Behel, um lugar conhecido por levar todos os seus prisioneiros à loucura extrema.',
      'Os mais estranhos casos acontecem dentro da dita masmorra, seres estranhos são avistados, mas as autoridades das redondezas alertaram viajantes e comerciantes para que passassem longe dali, pois os guardas estavam passando por alguns problemas relacionados à contenção dos presos.',
      'Alguns relataram ter visto alguma alteração corporal nos guardas e os responsáveis relatam ter visto um estranho ser empunhando um grande cutelo, os responsáveis pela masmorra dizem que "é apenas um dos guardas, um grande e forte soldado recruta."'
    ],
    classesIntro: 'Em meio a uma Europa medieval, alguns dos trabalhos que haviam para serem executados eram:'
  };

  const MODULOS = [
    { id: 'base', nome: 'Nenhuma — 1ª Edição', curto: '1ª EDIÇÃO', subtitulo: 'LIVRO DO JOGADOR · 1ª EDIÇÃO', termo: 'Profissão', termoPlural: 'Profissões' },
    { id: 'passado', nome: 'Em um Passado Distante', curto: 'PASSADO DISTANTE', subtitulo: 'EM UM PASSADO DISTANTE', termo: 'Classe', termoPlural: 'Classes' }
  ];

  /* ------------------------------------------------------------------ */
  /* OS 5 CAMINHOS DO INDIZÍVEL                                         */
  /* r = dicas situacionais para o rolador (attr, texto, vantagem)      */
  /* ------------------------------------------------------------------ */
  const NIVEIS_NO = [1, 2, 3, 5, 7, 9, 12, 15];
  const REQ_ATRIBUTO_NO = [0, 0, 0, 0, 3, 3, 5, 5];

  const n = (id, nome, desc, r) => ({ id, nome, desc, r: r || null });

  const CAMINHOS = [
    {
      id: 'eidolon', nome: 'Caminho Eidolon', num: 1, attr: 'VIG', cor: 'vig',
      trilhas: [
        { id: 'resiliencia', nome: 'Trilha da Resiliência', nos: [
          n('casca-grossa', 'Casca Grossa', 'Vantagem no teste de VIGOR para não perder 1 Ponto de Vida por turno ao chegar a 0 de Vida.', [{ a: 'VIG', x: 'Vantagem para não perder 1 Ponto de Vida por turno a 0 de Vida', v: true }]),
          n('bloqueio-perfeito', 'Bloqueio Perfeito', 'Ao defender, o teste de VIGOR DF6 para receber metade do dano ganha +2 no resultado.'),
          n('couro-endurecido', 'Couro Endurecido', 'Adiciona permanentemente +3 à fórmula base de Vida (VIGOR + 10).'),
          n('sangue-frio', 'Sangue Frio', 'Ignora a penalidade de -2 no atributo VIGOR causada pelo status Câncer.'),
          n('defesa-absoluta', 'Defesa Absoluta', 'Um sucesso normal no teste de VIGOR DF6 da Defesa anula todo o dano inimigo, sem exigir 20 natural.'),
          n('muralha-de-carne', 'Muralha de Carne', 'Ganha vantagem no teste de Contra-ação DF5 quando usa VIGOR para escapar.', [{ a: 'VIG', x: 'Vantagem na Contra-ação DF5 com VIGOR', v: true }]),
          n('imortalidade-brutal', 'Imortalidade Brutal', 'Se passar de -5 de Vida, um acerto crítico (20) no teste de VIGOR estabiliza a Vida em -4.'),
          n('carcaca-indiferente', 'Carcaça Indiferente', 'Ignora todas as penalidades de dano passivo (sangramento, queimadura, veneno e afins).')
        ] },
        { id: 'folego', nome: 'Trilha do Fôlego', nos: [
          n('folego-de-ferro', 'Fôlego de Ferro', 'Recupera 2 Pontos de Fôlego a cada 15 minutos, ao invés de apenas 1.'),
          n('salto-espectral', 'Salto Espectral', 'Pular ou escalar passa a custar apenas 1 Ponto de Fôlego, ao invés de 2.'),
          n('explosao-adrenalinica', 'Explosão Adrenalínica', '1 Ponto de Fôlego permite correr 10m sem teste, dobrando a distância base de 5m.'),
          n('passada-inumana', 'Passada Inumana', 'O turno de Movimentação permite caminhar 20m sem gastar Fôlego ou realizar testes.'),
          n('forca-descomunal', 'Força Descomunal', 'Ao gastar Fôlego para pagar a Dificuldade de um teste de força, o custo é cortado pela metade.'),
          n('segundo-pulmao', 'Segundo Pulmão', 'Uma vez por cena, ao zerar o fôlego, anula a penalidade de -[VIGOR] da Exaustão por 3 turnos.'),
          n('metabolismo-infinito', 'Metabolismo Infinito', 'O limite máximo de Pontos de Fôlego do Perito recebe +3.'),
          n('maquina-sem-descanso', 'Máquina sem Descanso', 'Zera a necessidade de 1 hora ou mais de descanso para sair do estado de exaustão.')
        ] },
        { id: 'ultraviolencia', nome: 'Trilha da Ultraviolência', nos: [
          n('punho-de-chumbo', 'Punho de Chumbo', 'Adiciona um teste de dano novamente como dano extra em ataques desarmados.'),
          n('esmagamento-critico', 'Esmagamento Crítico', 'Acertos críticos em combate desarmado ou com armas cegas dobram o bônus de VIGOR no dano.'),
          n('primeiro-golpe', 'Primeiro Golpe', 'Vantagem no teste de acerto do primeiro turno de qualquer combate.', [{ a: 'ACU', x: 'Vantagem no acerto do primeiro turno do combate', v: true }]),
          n('furia-reativa', 'Fúria Reativa', 'Ganha +1 Ação de ataque no turno seguinte, caso tenha sofrido dano no turno anterior.'),
          n('impacto-sismico', 'Impacto Sísmico', 'Um ataque crítico empurra o alvo 5 metros para trás, derrubando-o se colidir.'),
          n('teimosia-bruta', 'Teimosia Bruta', 'Todo resultado 1 na rolagem de dano físico é automaticamente convertido em 5.'),
          n('quebra-guarda', 'Quebra-Guarda', 'Ataques do Perito ignoram completamente bloqueios e defesas passivas do alvo.'),
          n('sentenca-de-carne', 'Sentença de Carne', 'Pode trocar suas 2 ações do turno por um único acerto automático, sem teste.')
        ] },
        { id: 'carne', nome: 'Trilha da Carne Adaptável', nos: [
          n('limiar-rompido', 'Limiar Rompido', 'A Vida Máxima do Perito pode ultrapassar o teto definido na criação de ficha.'),
          n('crescimento-anomalo', 'Crescimento Anômalo', 'Recebe +1d4 extra de Vida a cada nível de Conhecimento completado.'),
          n('coagulo-instantaneo', 'Coágulo Instantâneo', 'Imunidade total a sangramento e a perda contínua de Vida por ferimentos abertos.'),
          n('pele-de-osso', 'Pele de Osso', 'Reduz em 1 o dano de todo e qualquer ataque recebido.'),
          n('marcha-infinita', 'Marcha Infinita', 'Ignora a dificuldade adicional gerada por distância extra na locomoção em combate.'),
          n('predador-voraz', 'Predador Voraz', 'Ganha +1 Ponto de Fôlego cada vez que abate um inimigo.'),
          n('transfusao-profana', 'Transfusão Profana', 'Pode converter qualquer cura de Sanidade recebida em cura de Vida, ponto a ponto.'),
          n('escudo-de-carne', 'Escudo de Carne', 'Pode assumir o dano destinado a um aliado adjacente, recebendo-o integralmente.')
        ] }
      ]
    },
    {
      id: 'profetico', nome: 'Caminho Profético', num: 2, attr: 'ACU', cor: 'acu',
      trilhas: [
        { id: 'iniciativa', nome: 'Trilha da Iniciativa', nos: [
          n('reflexos-afiados', 'Reflexos Afiados', 'Ganha +2 de bônus na rolagem de ACUIDADE que define a ordem de Iniciativa.'),
          n('premonicao', 'Premonição', 'Em caso de empate na Iniciativa, o Perito é sempre o primeiro a agir, ignorando a decisão do grupo.'),
          n('contra-acao-precisa', 'Contra-ação Precisa', 'Rola o teste de Contra-ação DF5 com Vantagem sempre que usar ACUIDADE.', [{ a: 'ACU', x: 'Vantagem na Contra-ação DF5 com ACUIDADE', v: true }]),
          n('janela-aberta', 'Janela Aberta', 'Um acerto crítico na Contra-ação concede +2 Ações Bônus, ao invés de apenas 1.'),
          n('abertura-profetica', 'Abertura Profética', 'Todos os inimigos rolam o primeiro teste de acerto do combate com desvantagem.'),
          n('leitura-de-movimento', 'Leitura de Movimento', 'Pode substituir VIGOR por ACUIDADE no teste DF6 de redução de dano da Defesa.'),
          n('nunca-surpreso', 'Nunca Surpreso', 'Age normalmente no primeiro turno mesmo em emboscadas ou situações de surpresa.'),
          n('interrupcao', 'Interrupção', 'Gaste 1 Ação Bônus para interromper e cancelar um ataque inimigo declarado contra você.')
        ] },
        { id: 'percepcao', nome: 'Trilha da Percepção', nos: [
          n('olhos-de-aguia', 'Olhos de Águia', 'Vantagem em testes de ACUIDADE para encontrar objetos ocultos, perdidos ou investigar cenas.', [{ a: 'ACU', x: 'Vantagem para encontrar objetos ocultos/perdidos ou investigar', v: true }]),
          n('maos-leves', 'Mãos Leves', 'Arrombar fechaduras e consertar objetos pequenos passa a consumir apenas 1 Ação Bônus.'),
          n('rastreio-obcecado', 'Rastreio Obcecado', 'Não sofre penalidades em testes de ACUIDADE de procura, mesmo em estado de Exaustão.'),
          n('socorrista-rapido', 'Socorrista Rápido', 'Vantagem no teste de ACUIDADE para impedir a morte de um aliado com a Vida zerada.', [{ a: 'ACU', x: 'Vantagem para impedir a morte de um aliado', v: true }]),
          n('foco-etilico', 'Foco Etílico', 'Anula a penalidade de -2 em ACUIDADE causada pelo status Embriagado.'),
          n('vista-noturna', 'Vista Noturna', 'Enxerga normalmente em escuridão parcial e não sofre penalidade por pouca iluminação.'),
          n('calculo-frio', 'Cálculo Frio', 'O Espectador deve revelar a Dificuldade exata de um teste antes que o Perito role o dado.'),
          n('quase-certo', 'Quase Certo', 'Falhas normais (não críticas) em testes de ACUIDADE contam como sucesso parcial, a critério do Espectador.')
        ] },
        { id: 'atirador', nome: 'Trilha do Atirador', nos: [
          n('gatilho-firme', 'Gatilho Firme', 'Numa Falha Crítica (1) com armas de longa distância, gaste 2 de Fôlego para rerrolar e aceitar o novo resultado.'),
          n('calibre-pesado', 'Calibre Pesado', 'Todo ataque bem sucedido com armas de longa distância causa +1d6 de dano.'),
          n('recarga-subita', 'Recarga Súbita', 'Recarregar armas de longa distância exige apenas 1 Ação Bônus, ao invés de 1 Ação completa.'),
          n('tiro-de-sorte', 'Tiro de Sorte', 'Uma vez por sessão, pode forçar um acerto normal de arma a se tornar Acerto Crítico (dano máximo).'),
          n('disparo-de-cobertura', 'Disparo de Cobertura', 'Gaste 1 Ação Bônus: o próximo inimigo a atacar rola com Desvantagem.'),
          n('angulo-impossivel', 'Ângulo Impossível', 'Ignora completamente meia-cobertura inimiga no cálculo da Dificuldade do disparo.'),
          n('critico-sanguinario', 'Crítico Sanguinário', 'Acertos críticos com armas de longa distância causam o dano máximo + 1d6 extra cumulativo.'),
          n('reflexo-ofensivo', 'Reflexo Ofensivo', 'Um 20 natural na Contra-ação DF5 concede uma Ação Bônus que pode ser gasta num disparo imediato.')
        ] },
        { id: 'evasao', nome: 'Trilha da Evasão', nos: [
          n('passo-silencioso', 'Passo Silencioso', 'Todos os testes de furtividade são rolados com Vantagem.', [{ a: 'ACU', x: 'Vantagem em testes de furtividade', v: true }]),
          n('alvo-escorregadio', 'Alvo Escorregadio', 'A Dificuldade da Contra-ação do inimigo contra suas ações sobe de DF6 para DF8.'),
          n('reposicionamento', 'Reposicionamento', 'Pode se mover 5m gratuitamente por turno sem provocar ataques de oportunidade.'),
          n('memoria-muscular', 'Memória Muscular', 'Ignora a penalidade de -1 em ACUIDADE causada por Perda de Memória (-21 a -30 de Sanidade).'),
          n('queda-controlada', 'Queda Controlada', 'Todo dano de queda sofrido é reduzido à metade, arredondando para baixo.'),
          n('esquiva-instintiva', 'Esquiva Instintiva', 'Esquivar deixa de consumir Ação ou Ação Bônus do turno.'),
          n('isca-falsa', 'Isca Falsa', 'Gaste 1 Ação Bônus para criar uma distração: um inimigo perde o alvo até o próximo turno.'),
          n('ponto-cego', 'Ponto Cego', 'Se permanecer imóvel por um turno completo, torna-se efetivamente invisível por 1 turno.')
        ] }
      ]
    },
    {
      id: 'real', nome: 'Caminho Real', num: 3, attr: 'PSI', cor: 'yel',
      trilhas: [
        { id: 'sapiencia', nome: 'Trilha da Sapiência', nos: [
          n('sinergia-cognitiva', 'Sinergia Cognitiva', 'A penalidade do sub-atributo secundário de PSICOMETRIA é reduzida de -3 para -1.'),
          n('labia-inabalavel', 'Lábia Inabalável', 'Vantagem em persuadir ou perceber mentiras. Falhar custa 1d4 de Sanidade pela frustração.', [{ a: 'SAP', x: 'Vantagem para persuadir ou perceber mentiras (falha: -1d4 SAN)', v: true }]),
          n('comando-social', 'Comando Social', 'Pode anular a falha de um aliado no teste de ficar para trás causado pela Depressão Leve.'),
          n('oratoria-de-batalha', 'Oratória de Batalha', 'Gaste 1 Ação Bônus para conceder +1 no teste de Acerto de um aliado próximo.'),
          n('replica-afiada', 'Réplica Afiada', 'Vantagem em toda Contra-ação de natureza social, verbal ou de intimidação.', [{ a: 'SAP', x: 'Vantagem em Contra-ação social, verbal ou de intimidação', v: true }]),
          n('consenso-forcado', 'Consenso Forçado', 'Anula testes obrigatórios em grupo impostos por distúrbios mentais dos aliados.'),
          n('diplomacia-blasfema', 'Diplomacia Blasfema', 'Pode convencer Indizíveis de nível menor que o seu a recuar sem combate.'),
          n('voz-de-comando', 'Voz de Comando', 'Uma vez por sessão, dita uma ordem absoluta: um alvo obedece por 1 turno completo.')
        ] },
        { id: 'inteligencia', nome: 'Trilha da Inteligência', nos: [
          n('mente-analitica', 'Mente Analítica', 'Gaste 1 Ponto de Fôlego para reduzir a Dificuldade ao decifrar criptografias e padrões.'),
          n('alquimista-pratico', 'Alquimista Prático', 'Anula a extrema dificuldade de usar itens medicinais sob Esquizofrenia Hebefrênica.'),
          n('invasao-silenciosa', 'Invasão Silenciosa', 'Invadir sistemas, redes elétricas e computadores passa a consumir apenas 1 Ação Bônus.'),
          n('memoria-fotografica', 'Memória Fotográfica', 'Lembra com perfeição de qualquer detalhe de cenário já descrito pelo Espectador.'),
          n('leitura-de-fraqueza', 'Leitura de Fraqueza', 'Gaste 1 Ação para que o Espectador revele uma fraqueza concreta de um inimigo.'),
          n('segunda-deducao', 'Segunda Dedução', 'Pode rerrolar qualquer teste de dedução ou identificação de padrões, uma vez por cena.'),
          n('erudicao-absoluta', 'Erudição Absoluta', 'O reforço total do sub-atributo Inteligência recebe +2 permanentes.'),
          n('improviso-tecnico', 'Improviso Técnico', 'Ignora enguiços, falhas e limitações tecnológicas de qualquer equipamento em uso.')
        ] },
        { id: 'terapia', nome: 'Trilha da Terapia', nos: [
          n('escuta-ativa', 'Escuta Ativa', 'Uma sessão de Terapia passa a restaurar 1d6+2 Pontos de Sanidade, ao invés de 1d6.'),
          n('empatia-terapeutica', 'Empatia Terapêutica', 'Rolagens 1 e 2 no 1d6 de uma sessão de Terapia viram automaticamente 3.'),
          n('terapia-de-grupo', 'Terapia de Grupo', 'Uma única sessão de Terapia passa a afetar 2 aliados ao mesmo tempo.'),
          n('ancoragem', 'Ancoragem', 'Aliados que sofram de qualquer grau de ansiedade recuperam +2 de Sanidade extra na Terapia.'),
          n('autoanalise', 'Autoanálise', 'O Perito pode aplicar uma sessão de Terapia em si mesmo, com efeito integral.'),
          n('alta-medica', 'Alta Médica', 'Um acerto crítico no 1d6 da Terapia remove permanentemente 1 Distúrbio do paciente.'),
          n('respiro-coletivo', 'Respiro Coletivo', 'Toda sessão de Terapia também restaura 2 Pontos de Fôlego a quem a recebe.'),
          n('plantao-eterno', 'Plantão Eterno', 'Deixa de existir o limite de uma sessão de Terapia por sessão de jogo.')
        ] },
        { id: 'foco-mental', nome: 'Trilha do Foco Mental', nos: [
          n('foco-na-crise', 'Foco na Crise', 'Contorna a insônia da Ansiedade Moderada, recebendo 100% do descanso longo ao invés de 50%.'),
          n('mascara-social', 'Máscara Social', 'Não sofre a penalidade de interação social imposta pela Ansiedade Grave.'),
          n('ancora-racional', 'Âncora Racional', 'Aumenta permanentemente a Sanidade Máxima do Perito em +1.'),
          n('nunca-em-branco', 'Nunca em Branco', 'Anula o efeito de Falha Crítica (1) em qualquer teste de PSICOMETRIA.'),
          n('meditacao-ativa', 'Meditação Ativa', 'Uma meditação de 5 minutos recupera 2 Pontos de Fôlego, sem necessidade de descanso.'),
          n('muro-mental', 'Muro Mental', 'Bloqueia leitura mental, sugestão e influência psíquica de Indizíveis e Peritos.'),
          n('fardo-compartilhado', 'Fardo Compartilhado', 'Pode dividir igualmente qualquer dano de Sanidade recebido com um aliado voluntário.'),
          n('descrenca-treinada', 'Descrença Treinada', 'Imunidade total a ilusões e alucinações induzidas de baixo nível.')
        ] }
      ]
    },
    {
      id: 'anciao', nome: 'Caminho Ancião', num: 4, attr: 'ESO', cor: 'vio',
      trilhas: [
        { id: 'conjurador', nome: 'Trilha do Conjurador', nos: [
          n('emprestimo-profano', 'Empréstimo Profano', 'Permite manter a Sanidade abaixo de 0 ao conjurar, recuperando ao final do combate. O Perito ainda sofre os efeitos da insanidade no processo.'),
          n('amplificacao-verbal', 'Amplificação Verbal', 'Cada conjunto extra de palavras na magia garante +1d6 no efeito, ao invés de +1d4.'),
          n('conhecimento-alem', 'Conhecimento Além', 'Pode conjurar rituais de nível superior ao seu ESOTERISMO atual, sofrendo o dobro do dano base de Sanidade.'),
          n('verbo-truncado', 'Verbo Truncado', 'Dispensa a Palavra de Impulso na estrutura da conjuração, exigindo apenas Verbal e Poder.'),
          n('poder-sobre-verbo', 'Poder sobre Verbo', 'Pode substituir uma Palavra Verbal ausente por uma Palavra de Poder do seu repertório.'),
          n('eco-persistente', 'Eco Persistente', 'Dobra a duração de efeito de todas as magias conjuradas pelo Perito.'),
          n('barganha-eficiente', 'Barganha Eficiente', 'Reduz em 1 o custo de Sanidade de toda magia de Classe 3 ou superior.'),
          n('conjuracao-dupla', 'Conjuração Dupla', 'Pode conjurar 2 magias de conjunto único num mesmo turno, pagando ambos os custos.')
        ] },
        { id: 'ritualista', nome: 'Trilha do Ritualista', nos: [
          n('canalizacao-rapida', 'Canalização Rápida', 'Reduz pela metade o tempo de preparo de Rituais (desenhos, símbolos e relíquias).'),
          n('catalisador-mental', 'Catalisador Mental', 'Ignora a necessidade física do objeto de gatilho pagando +2 pontos de Sanidade.'),
          n('ordem-corrompida', 'Ordem Corrompida', 'O Ritual funciona normalmente mesmo com 1 erro na ordem das etapas de preparo.'),
          n('circulo-expandido', 'Círculo Expandido', 'Todo Ritual com área de efeito tem seu alcance dobrado.'),
          n('ritual-vazio', 'Ritual Vazio', 'Anula completamente o custo material e de componentes de qualquer Ritual.'),
          n('bencao-enferrujada', 'Bênção Enferrujada', 'Rituais bem sucedidos também restauram 1d6 de Vida a todos os participantes.'),
          n('assinatura-oculta', 'Assinatura Oculta', 'Esconde o rastro esotérico do Ritual, impedindo que Indizíveis o rastreiem.'),
          n('ritual-imediato', 'Ritual Imediato', 'Uma vez por arco narrativo, executa um Ritual completo sem tempo de preparo algum.')
        ] },
        { id: 'veu', nome: 'Trilha do Véu', nos: [
          n('sussurros-familiares', 'Sussurros Familiares', 'Ignora a perda passiva de 1 ponto de Sanidade a cada 15 minutos em ambientes com Indizíveis.'),
          n('iluminacao-traumatica', 'Iluminação Traumática', 'Ao acessar uma imagem do LIMIAR (2d20 de dano mental), role 3d20 e descarte o maior dado.'),
          n('andarilho-do-veu', 'Andarilho do Véu', 'Passa a perder Sanidade periodicamente apenas quando engajado diretamente em combate com o Indizível.'),
          n('olhar-aferidor', 'Olhar Aferidor', 'Identifica o nível exato de qualquer criatura do LIMIAR apenas encarando-a.'),
          n('verbo-de-repulsa', 'Verbo de Repulsa', 'Gaste 1 Ação e role ESOTERISMO contra DF5 para repelir fisicamente um Indizível.', [{ a: 'ESO', x: 'Verbo de Repulsa: ESOTERISMO contra DF5 repele um Indizível' }]),
          n('sangue-anatema', 'Sangue Anátema', 'O sangue do Perito queima Indizíveis: quem o atacar corpo a corpo sofre 1d6 de dano.'),
          n('passo-fora-do-veu', 'Passo Fora do Véu', 'Torna-se imperceptível para criaturas do LIMIAR por 1 cena, uma vez por sessão.'),
          n('contra-conjuracao', 'Contra-Conjuração', 'Absorve integralmente 1 magia inimiga por combate, anulando seu efeito.')
        ] },
        { id: 'sacrificio', nome: 'Trilha do Sacrifício', nos: [
          n('dizimo-de-sangue', 'Dízimo de Sangue', 'Pode pagar custos de sanidade com Pontos de Vida, na proporção de 2 de Vida para 1 de Sanidade.'),
          n('graca-critica', 'Graça Crítica', 'Um acerto crítico na conjuração zera completamente o custo de Sanidade da magia.'),
          n('queima-vital', 'Queima Vital', 'Pode queimar Pontos de Fôlego no lugar de Sanidade, na proporção de 1 para 1.'),
          n('cordeiro', 'Cordeiro', 'Pode sacrificar a Vida de um aliado consciente e voluntário para conjurar sem custo algum.'),
          n('agonia-amplificada', 'Agonia Amplificada', 'O dano mágico do Perito aumenta em +1 para cada 5 Pontos de Vida que lhe faltam.'),
          n('retorno-espelhado', 'Retorno Espelhado', 'Todo dano de Sanidade sofrido em combate é convertido em dano mágico na próxima magia.'),
          n('segunda-vinda', 'Segunda Vinda', 'Ao morrer, uma magia ativa se rompe e devolve o Perito à vida com 1 Ponto de Vida. Uma vez por arco.'),
          n('ultima-palavra', 'Última Palavra', 'Conjuração final: o Perito morre permanentemente, mas destrói por completo um único alvo.')
        ] }
      ]
    },
    {
      id: 'loucura', nome: 'Caminho da Loucura', num: 5, attr: 'RAZ', cor: 'raz',
      trilhas: [
        { id: 'epifania', nome: 'Trilha da Epifania', nos: [
          n('epifania', 'Epifania', 'Ao chegar em 100% de Conhecimento, ganha 50% de chance de curar a Sanidade Total.'),
          n('catarse', 'Catarse', 'A chance do teste de porcentagem da Epifania sobe de 50% para 100%.'),
          n('mente-ancorada', 'Mente Ancorada', 'Se falhar no d100 da Epifania, recupera automaticamente metade da Sanidade Máxima.'),
          n('equilibrista-nato', 'Equilibrista Nato', 'Ao chegar a 0 de Sanidade, rola o teste de RAZÃO para não ficar Insano com Vantagem.', [{ a: 'RAZ', x: 'Vantagem no teste de RAZÃO para não ficar Insano (0 de Sanidade)', v: true }]),
          n('cicatriz-lucida', 'Cicatriz Lúcida', 'Ignora a penalidade de -5 em todos os testes do Dano Cerebral Permanente (-41 a -50).'),
          n('alma-teimosa', 'Alma Teimosa', 'O dado de sanidade ao subir de nível passa a ser 1d6.'),
          n('clareza-crescente', 'Clareza Crescente', 'Recebe +1d4 extra de Sanidade a cada nível de Conhecimento completo.'),
          n('fio-da-consciencia', 'Fio da Consciência', 'Ignora a Morte Cerebral ao passar de -71, estabilizando permanentemente em -70.')
        ] },
        { id: 'paranoia', nome: 'Trilha da Paranoia e Psicose', nos: [
          n('blindagem-paranoica', 'Blindagem Paranóica', 'Na Paranoia Severa (-1 a -10), perde Sanidade a cada 25 minutos, não mais a cada 15.'),
          n('furia-psicotica', 'Fúria Psicótica', 'Sob Psicose Grave (-11 a -20), recebe +2 em todos os testes de Acerto em combate.'),
          n('toque-fantasma', 'Toque Fantasma', 'Sob Toques Fantasmas (-31 a -40), pode anular 1 ataque inimigo por combate.'),
          n('raiva-convertida', 'Raiva Convertida', 'A Agressividade converte metade do dano recebido em bônus de dano no próximo ataque.'),
          n('vazio-concentrado', 'Vazio Concentrado', 'A Perda de Memória deixa de atrapalhar e concede +2 em VIGOR pela ausência de medo.'),
          n('primeiro-choque', 'Primeiro Choque', 'Ignora completamente o primeiro dano de Sanidade sofrido em cada combate.'),
          n('boca-fechada', 'Boca Fechada', 'Aliados deixam de perder Sanidade por causa das falas e surtos do Perito fora de combate.'),
          n('loucura-restauradora', 'Loucura Restauradora', 'O status Insano passa a curar 1d6 de Vida por golpe mental, ao invés de dobrar o dano.')
        ] },
        { id: 'medo', nome: 'Trilha do Medo', nos: [
          n('motor-do-caos', 'Motor do Caos', 'Com Esquizofrenia Catatônica, ganha Vantagem no teste para agir duas vezes ao invés de travar.'),
          n('panico-contagioso', 'Pânico Contagioso', 'A crise de 30% da Ansiedade Grave passa a ser repassada ao inimigo mais próximo.'),
          n('peso-suportavel', 'Peso Suportável', 'A Depressão Grave deixa de exigir o teste adicional de RAZÃO contra a própria vida.'),
          n('conselheiro-invisivel', 'Conselheiro Invisível', 'Com Esquizofrenia Paranoide, os sussurros passam a conter uma dica real do Espectador por cena.'),
          n('organismo-adaptado', 'Organismo Adaptado', 'Os Distúrbios do Perito deixam de exigir medicação diária para não se agravarem.'),
          n('sinfonia-de-sintomas', 'Sinfonia de Sintomas', 'Ganha +1 de dano em todos os ataques para cada Distúrbio ativo que possuir.'),
          n('contagio-mental', 'Contágio Mental', 'Uma vez por combate, transmite um Distúrbio temporário a um alvo por 3 turnos.'),
          n('remissao-subita', 'Remissão Súbita', 'Uma vez por arco narrativo, cura instantaneamente 1 Distúrbio à sua escolha.')
        ] },
        { id: 'caos', nome: 'Trilha do Caos', nos: [
          n('lucidez-corrompida', 'Lucidez Corrompida', 'Ao atingir o status Insano, ignora o multiplicador de 2x dano de Sanidade no próximo golpe mental.'),
          n('psiquiatra-de-si', 'Psiquiatra de Si', 'Anula narrativamente todos os efeitos de Desânimo Social da Depressão Leve.'),
          n('substituicao-insana', 'Substituição Insana', 'Enquanto Insano, pode usar RAZÃO no lugar de qualquer outro atributo em testes.'),
          n('logica-quebrada', 'Lógica Quebrada', 'Sua Contra-ação com RAZÃO passa a ser DF4, ao invés da DF5 padrão.'),
          n('combustao-mental', 'Combustão Mental', 'Cada ponto de dano mental recebido gera 1 Ponto de Fôlego imediatamente.'),
          n('grito-interno', 'Grito Interno', 'Pode zerar todo o Fôlego atual para curar 2d6 Pontos de Sanidade.'),
          n('iniciativa-delirante', 'Iniciativa Delirante', 'Com Sanidade negativa, pode rolar a Iniciativa usando RAZÃO no lugar de ACUIDADE.'),
          n('suicidio-tatico', 'Suicídio Tático', 'Ao chegar em -71 de Sanidade, o Perito colapsa e mata tudo que estiver ao seu redor.')
        ] }
      ]
    }
  ];

  /* Índice rápido id -> {no, caminho, trilha, idx} */
  const NOS = {};
  CAMINHOS.forEach(c => c.trilhas.forEach(t => t.nos.forEach((no, idx) => {
    NOS[no.id] = { no, caminho: c, trilha: t, idx, nv: NIVEIS_NO[idx], req: REQ_ATRIBUTO_NO[idx] };
  })));

  /* ------------------------------------------------------------------ */
  /* ITENS (cap. 8 — Listas)                                            */
  /* cat: medicinal | psicoativo | cac | dist | armadura | item         */
  /* ------------------------------------------------------------------ */
  const CATALOGO = [
    // Itens medicinais
    { id: 'gaze', nome: 'Gaze', cat: 'medicinal', efeito: 'Recupera 1d4 de Vida.', cura: { dado: '1d4', alvo: 'vida' } },
    { id: 'esparadrapos', nome: 'Esparadrapos', cat: 'medicinal', efeito: 'Remove Tick de Sangramento.', remove: 'sangrando' },
    { id: 'antisseptico', nome: 'Antisséptico', cat: 'medicinal', efeito: 'Remove Tick de Infecção.', remove: 'infeccao' },
    { id: 'agua-oxigenada', nome: 'Água Oxigenada', cat: 'medicinal', efeito: 'Remove todos os Ticks de Infecção; causa -1d4 de Vida.', remove: 'infeccao', dano: '1d4' },
    { id: 'kit-sutura', nome: 'Kit de Sutura', cat: 'medicinal', efeito: 'Fecha feridas abertas.' },
    { id: 'alicate', nome: 'Alicate', cat: 'medicinal', efeito: 'Remove estilhaços cravados na carne.' },
    { id: 'prozac', nome: 'Prozac', cat: 'medicinal', efeito: 'Utilizado para tratamento da depressão.' },
    { id: 'zoloft', nome: 'Zoloft', cat: 'medicinal', efeito: 'Utilizado para tratamento de depressão grave.' },
    { id: 'ziprasidona', nome: 'Ziprasidona', cat: 'medicinal', efeito: 'Utilizado para controle da esquizofrenia.' },
    { id: 'clonazepam', nome: 'Clonazepam', cat: 'medicinal', efeito: 'Utilizado para controle da ansiedade.' },
    // Itens psicoativos
    { id: 'cigarros-baratos', nome: 'Cigarros Baratos', cat: 'psicoativo', efeito: 'Recupera 1d4 de Sanidade (1% de chance de Câncer de Pulmão).', cura: { dado: '1d4', alvo: 'sanidade' }, risco: { nome: 'Câncer de Pulmão', chance: 1, status: 'cancer' } },
    { id: 'cigarros-marca', nome: 'Cigarros de Marca', cat: 'psicoativo', efeito: 'Recupera 1d8 de Sanidade (2% de chance de Câncer de Pulmão).', cura: { dado: '1d8', alvo: 'sanidade' }, risco: { nome: 'Câncer de Pulmão', chance: 2, status: 'cancer' } },
    { id: 'charuto', nome: 'Charuto', cat: 'psicoativo', efeito: 'Recupera 1d12 de Sanidade (3% de chance de Câncer de Pulmão).', cura: { dado: '1d12', alvo: 'sanidade' }, risco: { nome: 'Câncer de Pulmão', chance: 3, status: 'cancer' } },
    { id: 'narguile', nome: 'Narguilé', cat: 'psicoativo', efeito: 'Recupera 3d12 de Sanidade (10% de chance de Câncer de Pulmão).', cura: { dado: '3d12', alvo: 'sanidade' }, risco: { nome: 'Câncer de Pulmão', chance: 10, status: 'cancer' } },
    { id: 'lsd', nome: 'Balinha de LSD', cat: 'psicoativo', efeito: 'Recupera 2d8 de Sanidade; causa 5 minutos de alucinações.', cura: { dado: '2d8', alvo: 'sanidade' } },
    { id: 'cocaina', nome: 'Pino de Cocaína', cat: 'psicoativo', efeito: 'Recupera 1d8 de Sanidade; causa 5 minutos de irritabilidade.', cura: { dado: '1d8', alvo: 'sanidade' } },
    { id: 'fentanila', nome: 'Seringa de Fentanila', cat: 'psicoativo', efeito: 'Recupera 3d12 de Sanidade; 30% de chance de Blackout por 1 minuto.', cura: { dado: '3d12', alvo: 'sanidade' }, risco: { nome: 'Blackout por 1 minuto', chance: 30 } },
    { id: 'crack', nome: 'Pedra de Crack', cat: 'psicoativo', efeito: 'Recupera a sanidade inteira; causa alucinação severa por 10 minutos.', cura: { total: true, alvo: 'sanidade' } },
    { id: 'md', nome: 'Pílula de MD', cat: 'psicoativo', efeito: 'Anula perda de sanidade por exposição.' },
    { id: 'adesivo-nicotina', nome: 'Adesivo de Nicotina', cat: 'psicoativo', efeito: 'Recupera 1d6 de Sanidade, alivia sintomas de ansiedade, demora 1 minuto para fazer efeito.', cura: { dado: '1d6', alvo: 'sanidade' } },
    { id: 'bebidas', nome: 'Bebidas Alcoólicas', cat: 'psicoativo', efeito: 'Recuperam 1d12 de Sanidade; ao consumir 3 seguidas, aplica o status Embriagado.', cura: { dado: '1d12', alvo: 'sanidade' } },
    // Armas de corpo-a-corpo
    { id: 'facas', nome: 'Facas', cat: 'cac', dano: '1d4', efeito: '+1 Tick de Sangramento.' },
    { id: 'martelos', nome: 'Martelos', cat: 'cac', dano: '1d6', efeito: 'Chance de Stun por 1 turno.', cega: true },
    { id: 'ferramentas-grandes', nome: 'Ferramentas grandes', cat: 'cac', dano: '2d6' },
    { id: 'machados', nome: 'Machados', cat: 'cac', dano: '3d6' },
    { id: 'canos', nome: 'Canos de Metal', cat: 'cac', dano: '3d4', cega: true },
    { id: 'cadeiras', nome: 'Cadeiras/Mesas', cat: 'cac', dano: '4d4', efeito: 'Uso único.', cega: true },
    { id: 'objeto-cenario', nome: 'Objeto do Cenário', cat: 'cac', dano: '1d6', efeito: '1d4 para objetos pequenos, 1d6 para médios e 1d8 para grandes + Teste de Integridade.', cega: true,
      tamanhos: [{ id: 'pequeno', nome: 'Pequeno', dano: '1d4' }, { id: 'medio', nome: 'Médio', dano: '1d6' }, { id: 'grande', nome: 'Grande', dano: '1d8' }] },
    // Armas a distância
    { id: 'estilingue', nome: 'Estilingue', cat: 'dist', dano: '1d6', tiros: 'até 4 tiros por turno' },
    { id: 'revolver-38', nome: 'Revólver .38', cat: 'dist', dano: '1d8', tiros: 'até 6 tiros por turno', fogo: true },
    { id: 'revolver-44', nome: 'Revólver .44', cat: 'dist', dano: '1d12', tiros: 'até 6 tiros por turno', fogo: true },
    { id: 'revolver-45', nome: 'Revólver .45', cat: 'dist', dano: '2d8', tiros: 'até 6 tiros por turno', fogo: true },
    { id: 'revolver-357', nome: 'Revólver .357', cat: 'dist', dano: '2d12', tiros: 'até 5 tiros por turno', fogo: true },
    { id: 'espingarda', nome: 'Espingarda', cat: 'dist', dano: '5d4', tiros: 'apenas dois por turno', fogo: true },
    { id: 'espingarda-ex', nome: 'Espingarda (EX)', cat: 'dist', dano: '3d8', tiros: 'apenas dois por turno', fogo: true },
    { id: 'espingarda-bl', nome: 'Espingarda (BL)', cat: 'dist', dano: '3d12', tiros: 'apenas um por turno', fogo: true },
    { id: 'mini-metralhadora', nome: 'Mini-Metralhadora', cat: 'dist', dano: '1d4', tiros: 'até 16 tiros por turno', fogo: true },
    { id: 'submetralhadora', nome: 'Submetralhadora', cat: 'dist', dano: '1d8', tiros: 'até 16 tiros por turno', fogo: true },
    { id: 'metralhadora-pesada', nome: 'Metralhadora Pesada', cat: 'dist', dano: '2d8', tiros: 'até 32 tiros por turno', fogo: true },
    { id: 'winchester-22', nome: 'Winchester .22', cat: 'dist', dano: '3d10', tiros: 'até 5 tiros por turno', fogo: true },
    { id: 'winchester-3030', nome: 'Winchester .30-30', cat: 'dist', dano: '3d12', tiros: 'apenas 1 tiro por turno', fogo: true },
    { id: 'remington-3006', nome: 'Remington .30-06', cat: 'dist', dano: '4d12', tiros: 'apenas 1 tiro por turno', fogo: true },
    { id: 'remington-222', nome: '.222 Remington', cat: 'dist', dano: '2d20', tiros: 'apenas 1 tiro por turno', fogo: true },
    { id: 'winchester-270', nome: '.270 Winchester', cat: 'dist', dano: '3d20', tiros: 'apenas 1 tiro por turno', fogo: true },
    { id: 'springfield-3006', nome: 'Springfield .30-06', cat: 'dist', dano: '4d20', tiros: '1 tiro a cada 2 turnos', fogo: true },
    { id: 'fuzil-caca', nome: 'Fuzil de Caça', cat: 'dist', dano: '2d6', tiros: 'até 12 tiros por turno', fogo: true },
    { id: 'fuzil-assalto', nome: 'Fuzil de Assalto', cat: 'dist', dano: '3d8', tiros: 'até 12 tiros por turno', fogo: true },
    { id: 'arcos', nome: 'Arcos', cat: 'dist', dano: '1d12', tiros: 'até 3 disparos por turno' },
    // Armadura (exemplo citado no livro)
    { id: 'capacete-couro', nome: 'Capacete de Couro', cat: 'armadura', parte: 'cabeca', defesa: 1, rd: 0, efeito: 'Exemplo do livro: 1 de Defesa (30% de chance sobe para 31%).' }
  ];
  const CATALOGO_MAP = {};
  CATALOGO.forEach(i => { CATALOGO_MAP[i.id] = i; });

  const CATEGORIAS_ITEM = [
    { id: 'medicinal', nome: 'Itens Medicinais', curto: 'MED', cor: 'cyan', consumivel: true },
    { id: 'psicoativo', nome: 'Itens Psicoativos', curto: 'PSI', cor: 'eso', consumivel: true },
    { id: 'cac', nome: 'Armas de Corpo-a-corpo', curto: 'CAC', cor: 'vig', arma: true },
    { id: 'dist', nome: 'Armas a Distância', curto: 'DIST', cor: 'raz', arma: true },
    { id: 'armadura', nome: 'Armaduras', curto: 'ARM', cor: 'psi' },
    { id: 'acessorio', nome: 'Acessórios', curto: 'ACS', cor: 'yel' },
    { id: 'consumivel', nome: 'Outros consumíveis', curto: 'CON', cor: 'acu', consumivel: true },
    { id: 'item', nome: 'Itens diversos', curto: 'ITEM', cor: 'dim' }
  ];

  /* Locais do inventário (cap. 1 — Equipamentos em combate). */
  const LOCAIS = [
    { id: 'maoE', nome: 'Mão esquerda', grupo: 'pertences', limite: 1 },
    { id: 'maoD', nome: 'Mão direita', grupo: 'pertences', limite: 1 },
    { id: 'armadura', nome: 'Armadura equipada', grupo: 'pertences' },
    { id: 'rapido', nome: 'Consumível de fácil acesso', grupo: 'pertences', limite: 2 },
    { id: 'acessorio', nome: 'Acessório equipado', grupo: 'pertences', limite: 3 },
    { id: 'bagagem', nome: 'Bagagem', grupo: 'bagagem' },
    { id: 'patrimonio', nome: 'Patrimônio', grupo: 'patrimonio' }
  ];
  const LIMITES_BAGAGEM = { armas: 3, armaduraPorParte: 2, consumiveis: 10 };

  /* ------------------------------------------------------------------ */
  /* REGRAS — compêndio do Livro do Jogador                             */
  /* t: p | h | h3 | ul | table | quote | note | big | data             */
  /* ------------------------------------------------------------------ */
  /* Dormir e descansar (1ª Edição Revisada) — sem modificadores de atributo */
  const DESCANSOS = [
    { id: 'curto', nome: 'Descanso Curto', vida: '1d4' },
    { id: 'medio', nome: 'Descanso Médio', vida: '1d8' },
    { id: 'longo', nome: 'Descanso Longo', vida: '1d10' }
  ];
  const SONOS = [
    { id: 'ruim', nome: 'Sono Ruim', vida: '1d4', san: '1d4' },
    { id: 'tranquilo', nome: 'Sono Tranquilo', vida: '1d4', san: '1d8' },
    { id: 'confortavel', nome: 'Sono Confortável', vida: '1d6', san: '1d10' }
  ];

  /* Fome (Em um Passado Distante): barra universal da Party, de 100 a 0 */
  const FOME = [
    { min: 85, max: 100, nome: 'Pouca Fome', pen: 0 },
    { min: 65, max: 84, nome: 'Fome Mediana', pen: -1 },
    { min: 45, max: 64, nome: 'Fome Grande', pen: -2 },
    { min: 25, max: 44, nome: 'Muita Fome', pen: -4 },
    { min: 5, max: 24, nome: 'Desnutrido', pen: -8 },
    { min: 0, max: 4, nome: 'Inanição', pen: -10, morte: true }
  ];
  const faixaFome = v => FOME.find(f => v >= f.min && v <= f.max) || FOME[FOME.length - 1];

  const REGRAS = [
    { id: 'limiar', titulo: 'LIMIAR', blocos: [
      { t: 'p', x: 'Em um mundo de deuses antigos esquecidos pelo tempo, religiosidade e crenças são tão comuns, a maioria desconhece o perigo que ronda essa realidade. As criaturas vindas do LIMIAR usam de crenças populares para furar o Véu e vir para a nossa realidade.' },
      { t: 'p', x: 'As coisas que vêm do LIMIAR são conhecidas como Indizíveis, ou seja, criaturas tão grotescas ou tão superiores que um Ser Humano comum, como eu e você, enlouqueceria apenas de tentar compreender sua natureza por completo.' },
      { t: 'p', x: 'Não são muitos aqueles que interagem com o Indizível e sobrevivem para contar a história, mas aqueles que o fazem ficam marcados para sempre, alguns lidam melhor que outros, alguns preferem se calar e levar as informações do LIMIAR consigo para a cova, mas a maior parte dos sobreviventes é reconhecida como Insanos.' },
      { t: 'p', x: 'Aqueles que decidem combater o Indizível, para preservar as vidas daqueles que são inocentes são conhecidos como Peritos, os Peritos, o termo não representa uma aptidão em entender o Indizível, apenas que o indivíduo já teve contato.' },
      { t: 'p', x: 'Alguns daqueles que interagem com o Indizível podem se corromper aos poucos, talvez cedendo sua humanidade, talvez almejando saber mais, talvez perdendo sua sanidade, talvez desejando ir além do véu. Quando um Perito passa tempo demais interagindo com o Indizível, é praticamente impossível saber o que ele pode querer fazer.' },
      { t: 'big', x: 'OS DEUSES ANTIGOS JÁ NÃO PODEM MAIS NOS AJUDAR, DEIXANDO A HUMANIDADE À MERCÊ DE TUDO AQUILO QUE É ESTRANHO E PARANORMAL, RESTANDO APENAS A FÉ NOS NOVOS DEUSES.' },
      { t: 'p', x: 'Ambientado na década de 80, ainda saindo da guerra do Vietnã, os jogadores podem se sentir em um verdadeiro Thriller desse tempo, com várias referências à cultura Pop e um toque de horror cósmico.' },
      { t: 'quote', x: 'As melhores invenções surgem do tédio, e é exatamente isso que eu vou fazer...', a: 'Archemites Lyssa' }
    ] },
    { id: 'familiarizacao', titulo: '1. Familiarização', blocos: [
      { t: 'p', x: 'Para começarmos com a criação do seu personagem, é mais que necessário que você se acostume com os atributos e testes de LIMIAR, onde cada Perito tem sua especialização definida através do seu primeiro contato com o Indizível.' },
      { t: 'p', x: 'Todo Perito possui uma gama de aptidões, sejam físicas ou técnicas, sempre sendo melhores ou piores em determinados atributos, entretanto sendo prodígios ou casos espetaculares na sociedade, se destacando do restante, sendo esses atributos:' },
      { t: 'ul', i: ['VIGOR > Atributo que determina desempenho físico', 'ACUIDADE > Atributo que determina minuciosidade', 'PSICOMETRIA > Atributo que determina fatores cognitivos e sociais', 'ESOTERISMO > Atributo que determina Afinidade com o Indizível', 'RAZÃO > Atributo que determina resistência contra o Indizível e Sanidade'] },
      { t: 'p', x: 'Ao iniciar uma ficha de Perito, o mesmo recebe cinco (5) pontos para distribuir entre os cinco atributos, podendo atribuir no máximo dez (10) pontos em um atributo na criação e no mínimo cinco negativo (-5), podendo retirar pontos para realocar, permitindo números negativos.' },
      { t: 'p', x: 'Ao subir de nível, o perito ganha mais pontos para melhorar seus atributos e consequentemente aprimorar suas habilidades em certas atividades, facilitando seus testes de d20.' },
      { t: 'h', x: 'Testes' },
      { t: 'p', x: 'Os testes em LIMIAR seguem um sistema simples de D20, onde o resultado do D20 recebe o valor da habilidade usada para o mesmo teste.' },
      { t: 'p', x: 'Para realizar uma ação, exige um teste de acerto, que dita se a ação foi bem sucedida, sempre referente ao atributo do teste, ou seja, caso seja um teste de VIGOR, o teste de acerto será com valor de VIGOR, sempre sendo 1d20 + [VIGOR].' },
      { t: 'p', x: 'Após rolar o teste, caso o jogador tire o valor máximo no dado, naturalmente, isto é, um 20 em um teste de d20, configura um acerto crítico onde obtém sucesso pleno na ação em que deseja realizar e caso seja um ataque, obtém o dano máximo daquele mesmo ataque.' },
      { t: 'p', x: 'Caso tire um valor mínimo, isto é, 1 em um teste de d20, configura falha crítica, obtendo além da falha, se houver, o pior resultado da ação.' },
      { t: 'p', x: 'Quando for mencionado "Rodar um teste com vantagem" o Espectador se refere a rolar dois dados e pegar o melhor resultado, já "Rodar um teste com desvantagem" se refere a rolar dois dados e pegar o pior resultado.' },
      { t: 'h', x: 'Tipos de testes' },
      { t: 'p', x: 'Em LIMIAR, o Espectador pode pedir tipos diferentes de teste, dentre eles estão os seguintes.' },
      { t: 'h3', x: 'Testes de porcentagem (%)' },
      { t: 'p', x: 'Existem alguns cenários que exigem um teste de porcentagem, como ao subir de nível, a chance de 50% de recuperar a sanidade completamente, para realizar um teste de porcentagem, o perito deve rolar 1d100, onde caso tire abaixo da chance, sucede no teste e caso tire acima do teste, falha.' },
      { t: 'note', x: 'Exemplo: 50% de chance de recuperar > Perito tirou 33 no dado = Sucesso!' },
      { t: 'p', x: 'Caso tire 1, considera-se acerto crítico, caso tire 100, falha crítica.' },
      { t: 'h3', x: 'Combate e iniciativa' },
      { t: 'p', x: 'Ao iniciar um combate, todos os membros da party rolam um teste de ACUIDADE, para definir ordem de turno, sendo sempre do maior (primeiro) para o menor (último).' },
      { t: 'p', x: 'Os testes possuem dificuldades diferentes:' },
      { t: 'data', k: 'dificuldades' },
      { t: 'p', x: 'Em caso de empates, os Peritos decidem entre si quem sai primeiro.' },
      { t: 'p', x: 'Num combate, o Perito possui 1 Ação, 1 Ação Bônus OU pode trocar as duas ações por um turno de Movimentação que permite caminhar mais de 10m sem gastar fôlego ou testes.' },
      { t: 'p', x: 'Para realizar uma ação, como combater, defender ou esquivar, o jogador sempre realiza um teste de acerto antes, usando o atributo de ACUIDADE e seu modificador. Após isso, realiza o teste de dano caso acerte.' },
      { t: 'p', x: 'Em combate também, caso um Perito esteja sujeito a uma ação adversária, o mesmo tem uma chance de contra-ação, um teste de DF5 para escapar dos efeitos da ação do oponente, assim como o oponente também tem, entretanto, o teste dele sendo de DF6. Caso o perito escape com um 20 natural, o mesmo recebe +1 ação bônus, antes da mudança de turnos.' },
      { t: 'p', x: 'Para defender, o Perito realiza um teste de ACUIDADE, sendo para testar seus reflexos e bloquear um ataque iminente, logo em seguida rodando um teste de VIGOR de DF6 onde pode receber apenas metade do dano inimigo, caso obtenha um sucesso crítico, anula completamente o dano do ataque. Tenha em mente que o oponente também tem essa vantagem.' },
      { t: 'h', x: 'Equipamentos em combate' },
      { t: 'p', x: 'Em combate, os peritos podem usufruir de diversos itens que encontrarem no caminho, entretanto não conseguem usar vários ao mesmo tempo.' },
      { t: 'p', x: 'Os itens são separados em: Pertences, Bagagem e Patrimônio. Pertences são os itens que o perito pode carregar nos bolsos, Bagagem são os itens que o perito tem guardado em uma mochila e Patrimônio são itens que o perito não carrega a todos os momentos, mas que tem acesso.' },
      { t: 'p', x: 'Um perito pode ter em seus Pertences:' },
      { t: 'ul', i: ['1x - Arma/item equipados em cada mão', '1x - Peça de armadura por parte do corpo', '2x - Itens consumíveis de fácil acesso'] },
      { t: 'p', x: 'Sendo que armaduras contam como Pertences somente quando equipadas, caso o perito remova, volta a contar como Bagagem.' },
      { t: 'p', x: 'Um perito pode ter em sua Bagagem:' },
      { t: 'ul', i: ['3x - Armas', '2x - Peças de armadura pra cada parte', '10x - Itens consumíveis'] },
      { t: 'p', x: 'O perito gasta um turno para desequipar e equipar itens.' },
      { t: 'h3', x: 'Armaduras' },
      { t: 'p', x: 'As armaduras funcionam com RD, ou Redução de Dano, onde cada armadura tem uma classe de RD que reduz o valor de dano que é recebido pelo jogador.' },
      { t: 'p', x: 'As RDs de peças diferentes no corpo não somam, mas aplicam redução apenas em sua própria parte corporal.' },
      { t: 'h3', x: 'Acessórios' },
      { t: 'p', x: 'Os peritos podem ter até 3 acessórios equipados, que são itens extras que aplicam vantagens para os mesmos, sendo impossível desequipar um acessório durante um combate.' }
    ] },
    { id: 'atributos', titulo: 'Aprofundando atributos', blocos: [
      { t: 'h', x: 'VIGOR', c: 'vig' },
      { t: 'p', x: 'O atributo de vigor define diversas características envolvendo o corpo do Perito.' },
      { t: 'h3', x: 'Partes do corpo' },
      { t: 'p', x: 'O perito possui um total de cinco membros: cabeça, torso, braços esquerdo e direito, pernas esquerda e direita.' },
      { t: 'p', x: 'Vida por membro: Quantos Pontos de vida um Perito tem, cada membro do corpo possui sua vida e morte ocorre em dois casos:' },
      { t: 'ul', i: ['1 - Caso a cabeça do perito seja arrancada', '2 - Caso a vida do tronco seja completamente removida.'] },
      { t: 'p', x: 'Definição:' },
      { t: 'ul', i: ['Cabeça: VIGOR + 5', 'Braços: VIGOR + 8', 'Pernas: VIGOR + 10', 'Tronco: VIGOR + 15'] },
      { t: 'h3', x: 'Defesas' },
      { t: 'p', x: 'A defesa do perito é definida com 2d4 * valor de VIGOR do perito na criação.' },
      { t: 'p', x: 'Usando um teste de porcentagem com a chance sendo o valor de defesa, ao receber um ataque caso tenha sucesso no teste recebe apenas metade do dano, caso seja um sucesso crítico, apenas um quarto (¼).' },
      { t: 'p', x: 'Armaduras equipadas aumentam o valor de chance referente a parte que recebe o golpe, por exemplo:' },
      { t: 'note', x: 'Capacete de couro - 1 de defesa > logo de 30 de chance, sobe para 31' },
      { t: 'p', x: 'Um Perito pode realizar um teste de ACUIDADE para impedir a perda de um aliado, sempre descrevendo como o fará se possível.' },
      { t: 'h3', x: 'Fôlego' },
      { t: 'p', x: 'Quanto um Perito aguenta se esforçar, sendo utilizado para correr longas distâncias sem se cansar ou numa explosão para percorrer curtas distâncias em pouquíssimo tempo.' },
      { t: 'p', x: 'Medido em Pontos de Fôlego, definido pelos pontos de VIGOR, pode ser gasto para se esforçar mais sem precisar rodar um teste.' },
      { t: 'p', x: 'Ao correr, 1 Ponto de Fôlego é utilizado para percorrer 5 Metros sem recorrer a um teste. Ao pular/escalar, deve-se utilizar 2 Pontos de Fôlego.' },
      { t: 'p', x: 'Caso o Perito precise realizar algum teste de força, o mesmo pode gastar a dificuldade de acerto do teste em pontos de fôlego.' },
      { t: 'note', x: 'Exemplo: Teste DF 4 = 4 Pontos de Fôlego' },
      { t: 'p', x: 'Pontos de Fôlego são recuperados com o passar do tempo, a cada 15 minutos um Ponto de Fôlego é recuperado, sem necessidade de um descanso.' },
      { t: 'p', x: 'Ao zerar os Pontos de Fôlego, o Perito entra em Exaustão, recebendo -[VIGOR] em todos os testes e precisa ter um descanso de 1 ou mais horas.' },
      { t: 'p', x: 'Seus pontos de VIGOR acrescentam um reforço significativo em testes dentro e fora de combate, sendo o Valor de VIGOR.' },
      { t: 'note', x: 'Exemplo: VIGOR: 5 = +5 em testes de VIGOR.' },
      { t: 'p', x: 'Caso seja um combate, +5 de Dano em ataques físicos com armas cegas ou desarmado.' },
      { t: 'p', x: 'Em combate, o Perito pode se locomover através de testes de VIGOR, podendo andar até 5 metros sem um teste e após isso deve rolar um teste com dificuldade relativa à distância extra que quer andar, exemplo: 5m + 2m adicionais é um teste DF1 + 2 ou seja Dificuldade 1 com +2 no resultado necessário.' },
      { t: 'h', x: 'ACUIDADE', c: 'acu' },
      { t: 'p', x: 'O Atributo de ACUIDADE existe para tarefas mais minuciosas e delicadas, como arrombar fechaduras, procurar por algo específico, encontrar objetos perdidos/ocultos, consertar objetos, utilizar armas de fogo e afins.' },
      { t: 'h', x: 'PSICOMETRIA', c: 'psi' },
      { t: 'p', x: 'PSICOMETRIA é utilizada para determinar as capacidades cognitivas do Perito, como intelecto e desenvoltura social.' },
      { t: 'p', x: 'Este atributo se diferencia dos outros por possuir dois sub-atributos, que definem Inteligência e Sapiência do Perito.' },
      { t: 'ul', i: ['Inteligência: Determina a capacidade do Perito de interagir com tecnologia, seja computadores, rede elétrica, leitura, identificar padrões, decifrar criptografias e afins.', 'Sapiência: Determina a qualidade do "Jogo de Cintura" do Perito, seja lidar com pessoas, persuadir, influenciar, perceber mentiras, dedução e afins.'] },
      { t: 'p', x: 'Com pontos em PSICOMETRIA, o jogador deve escolher apenas um dos dois Sub-Atributos para receber o valor completo e o outro por sua vez, receberá o valor do reforço -3, ou seja:' },
      { t: 'note', x: 'Exemplo: PSICOMETRIA: 4 > Reforço de +4 em testes. Inteligência: +4 LOGO Sapiência: +1' },
      { t: 'h', x: 'ESOTERISMO', c: 'eso' },
      { t: 'p', x: 'ESOTERISMO define a afinidade do Perito com o Indizível, ou seja, o quão bem o mesmo é capaz de compreender e explicar o mesmo.' },
      { t: 'p', x: 'Sendo utilizado geralmente para compreender os Seres INDIZÍVEIS, realizar rituais, encantar objetos e falar com o LIMIAR.' },
      { t: 'p', x: 'Cada ponto em ESOTERISMO representa o nível de Afinidade, existindo variados rituais e magias para cada nível.' },
      { t: 'note', x: 'Exemplo: COROAÇÃO > Ritual de nível 8. Um Perito de nível 7 não é capaz de sobreviver a esse ritual, entretanto um de nível 9 ou maior, é.' },
      { t: 'h', x: 'RAZÃO', c: 'raz' },
      { t: 'p', x: 'Sendo o atributo que define a sua resistência contra o Indizível, cada ponto investido representa a quantidade de turnos em combate que o Perito sustenta sem perder sanidade.' },
      { t: 'p', x: 'Também definindo seus Pontos de Sanidade na montagem da ficha, seguindo a fórmula: [RAZÃO] + 1d6 > Sanidade Total' },
      { t: 'note', x: 'Exemplo: RAZÃO: 4 > 4 + 1D6 = Sanidade Total do Perito.' },
      { t: 'p', x: 'Caso o Perito tenha pouca razão, o valor mínimo para Sanidade é 2.' },
      { t: 'p', x: 'Para recuperar Sanidade, o Perito deve passar por sessões de terapia, ouvir sermões ou consumir itens que recuperem seu estado mental.' },
      { t: 'h3', x: 'Sessões de terapia' },
      { t: 'p', x: 'Uma sessão de terapia só pode ser realizada ao final de uma sessão de jogo, resultando em uma por sessão, também só pode ser realizada caso um membro da party seja um profissional em psicologia.' },
      { t: 'p', x: 'Uma sessão de terapia sempre vai restaurar 1d6 de Pontos de Sanidade por Perito.' },
      { t: 'h3', x: 'Sanidade como recurso' },
      { t: 'p', x: 'Um Perito muitas vezes vai entrar em contato direto com o Indizível, perdendo Sanidade conforme interage com o mesmo, por isso é importante gerenciar bem sua Sanidade, para que não fique no negativo.' },
      { t: 'p', x: 'Ao chegar em 0 de sanidade, o Perito realiza um teste de RAZÃO para saber se consegue "Se Equilibrar na Corda da Loucura", ao falhar, passa a tomar 2x danos de Sanidade e recebe o status Insano. Caso consiga passar no teste fica em 0, realizando novamente no próximo dano de Sanidade.' },
      { t: 'p', x: 'Quando chegar a -1 de Sanidade, os seguintes efeitos podem se manifestar.' },
      { t: 'p', x: 'Caso o Espectador esteja narrando, ou seja, o Grupo está fora de combate mas exposto ao Indizível, a cada 15 minutos o grupo recebe -1 Ponto de Sanidade.' },
      { t: 'p', x: 'Já em combate, o grupo inteiro recebe -1 Ponto de Sanidade a cada golpe de um Indizível, ou seja, humanos, animais não contribuem para a perda de Sanidade.' },
      { t: 'p', x: 'Caso o Perito fique com sanidade total entre -5 e 1 por muito tempo (3 dias de jogo) o mesmo corre o risco de desenvolver distúrbios mentais, como: Depressão leve, moderada e grave; Esquizofrenia Paranóide, Hebefrênica e Catatônica; Ansiedade leve, moderada e grave.' },
      { t: 'data', k: 'faixas' },
      { t: 'p', x: 'Os distúrbios podem ser tratados e ter seus efeitos reduzidos ao máximo, alguns podendo ser completamente curados caso medicados corretamente e tratados em terapia.' },
      { t: 'p', x: 'Um Perito pode ter mais de um distúrbio, precisando tratar os mesmos com frequência.' },
      { t: 'data', k: 'disturbios' },
      { t: 'h', x: 'Status do Perito' },
      { t: 'p', x: 'Ao longo da jornada do Perito, o mesmo pode desenvolver diversos efeitos, que podem beneficiar ou prejudicar seu desempenho.' },
      { t: 'data', k: 'status' }
    ] },
    { id: 'descanso', titulo: 'Dormir e descansar', blocos: [
      { t: 'p', x: 'Os Peritos precisam descansar e dormir para prosseguir viagens. Para descansos, existem 3 tipos:' },
      { t: 'ul', i: ['Descanso Curto - Recupera 1d4 de Vida', 'Descanso Médio - Recupera 1d8 de Vida', 'Descanso Longo - Recupera 1d10 de Vida'] },
      { t: 'p', x: 'Já dormir faz com que os dias passem e, além disso, o Perito recupera Sanidade, com 3 qualidades de sono:' },
      { t: 'ul', i: ['Sono Ruim - Recupera 1d4 de Vida e 1d4 de Sanidade', 'Sono Tranquilo - Recupera 1d4 de Vida e 1d8 de Sanidade', 'Sono Confortável - Recupera 1d6 de Vida e 1d10 de Sanidade'] },
      { t: 'note', x: 'Os testes de Descanso e Sono não são influenciados por quaisquer modificadores de atributo.' }
    ] },
    { id: 'montando', titulo: '2. Montando um Perito', blocos: [
      { t: 'p', x: 'Para montar seu primeiro perito, deve seguir as seguintes etapas:' },
      { t: 'ul', i: [
        'A. Nome do Perito',
        'B. História -> Isto é, seu plano de fundo, de onde veio, quais suas motivações para estar na história e como foi seu primeiro contato se requisitado pelo Espectador.',
        'C. Atributos -> Explicados anteriormente, é necessário marcar tudo corretamente na ficha.',
        'D. Profissão -> Cada Perito pode ter uma profissão, incluindo nenhuma, coisas que auxiliam nos testes do personagem.',
        'E. Aparência -> Definir a aparência do Perito, com seus traços físicos e mentais, como manias, tiques e peculiaridades.'
      ] },
      { t: 'p', x: 'Os Peritos não são pessoas comuns como as outras, são casos excepcionais, com habilidades muito superiores às de outros humanos, pessoas que são prodígios.' }
    ] },
    { id: 'profissoes', titulo: '3. Profissões', blocos: [
      { t: 'p', x: 'Um Perito, assim como qualquer pessoa em nossa sociedade precisa contribuir de algum modo, ou não! Segue uma lista de Profissões para o Perito que modificam seus testes:' },
      { t: 'data', k: 'profissoes' }
    ] },
    { id: 'interagindo', titulo: '4. Interagindo com o LIMIAR', blocos: [
      { t: 'p', x: 'Caso um Perito tenha acesso direto a uma imagem do outro lado, ou seja, o LIMIAR, o mesmo recebe uma alta descarga de conhecimento proibido, onde passa a questionar a própria Natureza das coisas ao seu redor, recebendo 2d20 de dano de sanidade.' },
      { t: 'p', x: 'Caso permaneça no mesmo ambiente que seres do LIMIAR por mais tempo do que deve, o mesmo passa a perder 1 ponto de sanidade periodicamente, podendo ter a mesma reduzida por fatores externos como feitiços.' }
    ] },
    { id: 'nivel', titulo: '5. Subindo de nível', blocos: [
      { t: 'p', x: 'Em LIMIAR o Perito recebe mais níveis de Conhecimento de acordo com o tempo em que fica exposto ao Indizível, podendo chegar até 100% de Conhecimento, onde ao chegar em 100% ganha um Traço de Revelação que permite o Perito investir em um Nó de Conhecimento.' },
      { t: 'p', x: 'Ao receber seu primeiro nível de Conhecimento, o Perito recebe uma iluminação de conhecimento, seja através da visita de um Indizível ou uma revelação em sonho, podendo ser apenas uma visão ou aprendizado.' },
      { t: 'h', x: 'Ganhando Conhecimento' },
      { t: 'p', x: 'Para receber mais Porcentagem de Conhecimento o jogador deve sofrer danos de sanidade ao longo da aventura.' },
      { t: 'p', x: 'O Conhecimento depende da Sanidade atual do Perito, onde todo dano de sanidade contribui para a porcentagem subir, um jeito de acompanhar é anotar todos os danos de Sanidade que o Perito sofreu, já que a quantidade é de 1:1, ou seja, 1 de dano é igual a 1% do Conhecimento. RITUAIS NÃO INTERFEREM NA BARRA DE CONHECIMENTO.' },
      { t: 'note', x: 'Exemplo: Um Perito perde 18 Pontos de Sanidade. Logo seu conhecimento é igual a 18%.' },
      { t: 'p', x: 'Ao atingir 100% de Conhecimento, o contador zera e o Perito recebe um Traço de Revelação e +1 ponto de atributo para colocar onde quiser.' },
      { t: 'p', x: 'POR NÍVEL o Perito recebe: +1d4 de Vida / +1d4 de Sanidade.' }
    ] },
    { id: 'caminhos', titulo: '6. Os 5 Caminhos do Indizível', blocos: [
      { t: 'quote', x: 'Todo conhecimento tem um preço. Alguns pagam com sanidade, outros pagam com aquilo que costumavam ser.' },
      { t: 'p', x: 'Ao atingir 100% de Conhecimento, o contador zera e o Perito recebe 1 Traço de Revelação e +1 ponto de atributo. Cada Traço compra 1 Nó e seu efeito passa a valer imediatamente.' },
      { t: 'p', x: 'Cada Caminho está ligado a um atributo e possui 4 Trilhas de 8 Nós. O Perito pode comprar Nós de Caminhos diferentes livremente, mas dentro de uma mesma Trilha a ordem é obrigatória: para comprar o Nó 4, é necessário possuir os Nós 1, 2 e 3 daquela Trilha.' },
      { t: 'h', x: 'Pré-requisito de nível' },
      { t: 'p', x: 'Cada Nó exige um Nível mínimo de Perito, independente de quantos Traços estejam guardados. Traços excedentes ficam acumulados até que o Nível necessário seja alcançado.' },
      { t: 'h', x: 'Requisito de atributo' },
      { t: 'p', x: 'Além do Nível, os Nós 5 a 8 de qualquer Trilha exigem que o Perito possua no mínimo 3 pontos no atributo daquele Caminho, e os Nós 7 e 8 exigem no mínimo 5 pontos. Um Perito com VIGOR 0 jamais alcança o topo do Caminho Eidolon: a carne dele simplesmente não aguenta.' },
      { t: 'h', x: 'Os cinco Caminhos' },
      { t: 'ul', i: ['Caminho Eidolon > Atributo: VIGOR', 'Caminho Profético > Atributo: ACUIDADE', 'Caminho Real > Atributo: PSICOMETRIA', 'Caminho Ancião > Atributo: ESOTERISMO', 'Caminho da Loucura > Atributo: RAZÃO'] },
      { t: 'data', k: 'caminhos' }
    ] },
    { id: 'revelacoes', titulo: '7. Revelações', blocos: [
      { t: 'p', x: 'Ao receber uma iluminação, o Perito pode aprender uma Magia ou Ritual, os quais sempre custam alguma Sanidade, a quantidade sempre vai ser descrita pelo Espectador, sendo a chance de obter apenas 25%, sendo que esse valor pode aumentar dependendo de quantos Traços de Revelação foram investidos na Árvore de Conhecimento, podendo chegar até 65% de chance, sendo que cada Traço acrescenta 5% de chance.' },
      { t: 'p', x: 'Ao dormir, dependendo do nível de conhecimento do Perito, o Espectador pode conceder uma Revelação ao mesmo, geralmente quando o Nível de Conhecimento é >75%, sendo que a chance é de apenas 5%, diferentemente de quando a barra atinge os 100%.' },
      { t: 'h', x: 'Rituais e magias' },
      { t: 'p', x: 'O Perito jamais escolhe as magias e rituais que lhe são revelados através das Iluminações, entretanto, independente do efeito do Ritual/Magia, o mesmo será explicado pelo Espectador ao receber o mesmo.' },
      { t: 'p', x: 'Rituais, diferentemente de magias, possuem preparativos, como desenhos, relíquias, símbolos ou palavras, que devem ser realizados em uma certa ordem para que o ritual possua seu efeito.' },
      { t: 'p', x: 'Uma magia pode também ter algum requisito como um ritual, entretanto, não é necessário já que a magia pode pedir algo apenas como gatilho psicológico, como um livro ou objeto qualquer.' },
      { t: 'p', x: 'Todos os detalhes referentes a duração de efeito, efeito, tempo de preparo, itens e etc, serão revelados pelo Espectador e devem ser anotados pelo jogador.' },
      { t: 'h', x: 'Magias' },
      { t: 'p', x: 'Geralmente magias envolvem gatilhos psicológicos para serem utilizadas, normalmente reveladas em sonhos, mas podendo também serem encontradas em livros e registros ocultistas.' },
      { t: 'p', x: 'Magias são compostas narrativamente, precisando recitar palavras de conjuração de forças do LIMIAR, toda magia é estruturada com no mínimo 3 palavras, seguindo a estrutura de:' },
      { t: 'ul', i: ['1x - Palavra Verbal;', '1x - Palavra de Poder;', '1x - Palavra de Impulso;'] },
      { t: 'p', x: 'Sendo que a quantidade de cada tipo de palavra deve ser a mesma entre elas, se o perito conhecer 3 palavras verbais, o mesmo, para conjurar uma magia, deve saber 3 palavras de Poder e 3 palavras de Impulso.' },
      { t: 'p', x: 'Quanto mais palavras utilizadas, mais turnos requer para conjurar a magia e quanto mais palavras, maior o custo em sanidade.' },
      { t: 'p', x: 'Cada conjunto custa em sanidade, sempre o valor da palavra mais cara, cada palavra tem por sua vez uma classe atribuída que vai de 1 a 5, sendo a classe, o seu preço em sanidade.' },
      { t: 'note', x: "Exemplificando: Gof'nnn gn'th'bthnk mg'nglui > Spawn Blood Barrier\n> Gof'nnn - Palavra Verbal de Classe 1\n> Gn'th'bthnk - Palavra de Poder de Classe 3\n> Mg'nglui - Palavra de Impulso de Classe 2" },
      { t: 'p', x: 'Como a magia em questão possui uma palavra de classe 3, logo, a magia custa 3 pontos de sanidade para conjurar, entretanto: Pontos de Sanidade perdidos ao conjurar magias são restaurados ao final do combate, somente se o conjurador permanecer acima de 0 até o final do mesmo.' },
      { t: 'p', x: 'Também é importante esclarecer que, uma magia tem um preço em conjuntos de palavras, onde grande parte possui apenas 1 em preço, ou seja, o perito precisa ter um repertório de apenas 1 palavra de cada para realizar a magia, usando apenas um turno para conjurar a mesma, entretanto, caso o mesmo possua, por exemplo, 3 conjuntos, pode utilizar 2 desses para conjurar a magia com 2 turnos de preparação.' },
      { t: 'p', x: 'A cada conjunto extra utilizado na conjuração de uma magia, atribui 1d4 no efeito (caso tenha) e amplifica mais e mais o efeito.' },
      { t: 'note', x: "Exemplo: Uln Mgleth mgn'ghftephai - Conjurar Visão Verdadeira: Magia que fornece ao conjurador visão no escuro, entretanto quanto mais conjuntos utilizados, maior o efeito, podendo até mesmo enxergar através de paredes ou até mesmo no futuro." },
      { t: 'p', x: 'Os efeitos nunca são fixos, onde o Espectador sempre deve fornecer o efeito mais conveniente para o conjurador na situação em que ele conjura.' },
      { t: 'p', x: 'Magias podem ter gatilhos psicológicos que não são as palavras, como livros e mantras os quais apenas substituem as palavras, sendo uma magia baseada em mantra ou livro isenta da necessidade de um repertório.' },
      { t: 'h', x: 'Rituais' },
      { t: 'p', x: 'Diferentemente de Magias, os rituais são feitos seguindo uma série de etapas, quanto mais etapas, MAIS COMPLEXO.' },
      { t: 'p', x: 'Um ritual exige preparo e a execução precisa de etapas. O sucesso não depende de um teste de atributo, mas da execução correta de cada etapa.' },
      { t: 'h3', x: 'Como funcionam' },
      { t: 'ul', i: [
        'Etapas: São os componentes do ritual (desenhos, símbolos, glifos, incensos ou relíquias). Quanto mais complexo o efeito, maior a quantidade de etapas necessárias.',
        'Tempo de Execução: Diferente das magias que gastam turnos, rituais levam minutos reais para serem concluídos.',
        'Componentes: O Perito deve possuir os materiais descritos (ex: giz ritualístico, sangue, objetos de valor sentimental). A ausência de um item torna o ritual impossível.'
      ] },
      { t: 'h3', x: 'Custo e efeito' },
      { t: 'ul', i: [
        'Sanidade Fixa: Diferente das magias onde o custo escala com o número de palavras, todo ritual tem um custo de Sanidade fixo para ser iniciado. Este custo representa o preço de "rasgar o véu" para realizar a alteração.',
        'Efeito Duradouro: Rituais criam efeitos persistentes. Enquanto uma magia pode causar um dano instantâneo, um ritual pode criar uma barreira de proteção por horas, curar um grupo inteiro ou selar um portal.'
      ] },
      { t: 'h3', x: 'Níveis e complexidade' },
      { t: 'ul', i: [
        'Ritual de Nível 1-3: Exige poucos materiais e 5 minutos de preparo. Efeitos simples como purificação de um objeto.',
        'Ritual de Nível 4-6: Exige símbolos complexos no ambiente, componentes específicos e exige 8 minutos de preparo. Efeitos como curas em área ou detecção de entidades.',
        'Ritual de Nível 7+: Exige preparativos grandiosos, sacrifícios significativos e 12 minutos de preparo. Efeitos que alteram a realidade local ou interagem diretamente com Indizíveis superiores.'
      ] }
    ] },
    { id: 'listas', titulo: '8. Listas', blocos: [
      { t: 'data', k: 'itens' }
    ] }
  ];

  const REGRAS_PASSADO = { id: 'passado', titulo: 'Extensão: Em um Passado Distante', passado: true, blocos: [
    { t: 'h', x: 'Contextualização' },
    ...PASSADO.contexto.map(x => ({ t: 'p', x })),
    { t: 'h', x: 'Classes' },
    { t: 'p', x: PASSADO.classesIntro },
    { t: 'data', k: 'classes' },
    { t: 'h', x: 'Fome' },
    { t: 'p', x: 'A fome é uma barra universal para toda a Party, que é preenchida somente quando todo o grupo faz uma pausa para se alimentar.' },
    { t: 'p', x: 'O medidor de Fome vai de 100, que é o máximo, até 0, que é o mínimo.' },
    { t: 'ul', i: ['Pouca Fome (100 a 85): nenhum efeito', 'Fome Mediana (85 a 65): -1 em todos os testes', 'Fome Grande (65 a 45): -2 em todos os testes', 'Muita Fome (45 a 25): -4 em todos os testes', 'Desnutrido (25 a 5): -8 em todos os testes', 'Inanição: -10 em todos os testes + Morte quando chega a 0'] },
    { t: 'note', x: 'Nesta extensão as Classes substituem as Profissões do Livro do Jogador. Todo o resto das regras da 1ª Edição continua valendo.' }
  ] };

  /* Rituais: níveis e tempo de preparo */
  function tempoRitual(nivel) {
    const nv = Number(nivel) || 1;
    if (nv >= 7) return { min: 12, faixa: '7+', desc: 'Preparativos grandiosos e sacrifícios significativos.' };
    if (nv >= 4) return { min: 8, faixa: '4-6', desc: 'Símbolos complexos no ambiente e componentes específicos.' };
    return { min: 5, faixa: '1-3', desc: 'Poucos materiais.' };
  }

  /* Logo "LIMIAR" em barras horizontais (estilo logotipo IBM), 7 linhas por letra. */
  const LOGO = {
    GLIFOS: {
      L: ['XX....', 'XX....', 'XX....', 'XX....', 'XX....', 'XXXXXX', 'XXXXXX'],
      I: ['XXXXXX', '..XX..', '..XX..', '..XX..', '..XX..', '..XX..', 'XXXXXX'],
      M: ['XXX...XXX', 'XXXX.XXXX', 'XX.XXX.XX', 'XX..X..XX', 'XX.....XX', 'XX.....XX', 'XX.....XX'],
      A: ['..XXX..', '.XXXXX.', 'XX...XX', 'XX...XX', 'XXXXXXX', 'XX...XX', 'XX...XX'],
      R: ['XXXXXX.', 'XX...XX', 'XX...XX', 'XXXXXX.', 'XX.XX..', 'XX..XX.', 'XX...XX']
    },
    CORES: ['#ff4f64', '#ffae3b', '#ffe45e', '#36e08a', '#3fe0ff', '#5c8dff', '#e35cff'],
    /* Retângulos (em unidades de grade) de cada barra horizontal. */
    barras(texto) {
      const out = [];
      let x0 = 0;
      for (const ch of String(texto || 'LIMIAR').toUpperCase()) {
        const g = LOGO.GLIFOS[ch];
        if (!g) { x0 += 4; continue; }
        g.forEach((linha, row) => {
          let ini = -1;
          for (let col = 0; col <= linha.length; col++) {
            const on = linha[col] === 'X';
            if (on && ini < 0) ini = col;
            if (!on && ini >= 0) { out.push({ x: x0 + ini, y: row, w: col - ini, row }); ini = -1; }
          }
        });
        x0 += g[0].length + 2;
      }
      return { barras: out, colunas: Math.max(0, x0 - 2), linhas: 7 };
    }
  };

  L.DATA = {
    ATRIBUTOS, SUBATRIBUTOS, CRIACAO, MEMBROS, DIFICULDADES, FAIXAS_SANIDADE, DISTURBIOS, STATUS, DESCANSOS, SONOS, FOME, faixaFome,
    HABILIDADES, PROFISSOES, CLASSES, PASSADO, MODULOS, CAMINHOS, NIVEIS_NO, REQ_ATRIBUTO_NO, NOS,
    CATALOGO, CATALOGO_MAP, CATEGORIAS_ITEM, LOCAIS, LIMITES_BAGAGEM, REGRAS, REGRAS_PASSADO, tempoRitual, LOGO,
    ATTR: Object.fromEntries(ATRIBUTOS.map(a => [a.id, a])),
    PROF: Object.fromEntries(PROFISSOES.map(p => [p.id, p])),
    CLASSE: Object.fromEntries(CLASSES.map(c => [c.id, c])),
    CAMINHO: Object.fromEntries(CAMINHOS.map(c => [c.id, c])),
    MEMBRO: Object.fromEntries(MEMBROS.map(m => [m.id, m])),
    STATUS_MAP: Object.fromEntries(STATUS.map(s => [s.id, s]))
  };
})();
