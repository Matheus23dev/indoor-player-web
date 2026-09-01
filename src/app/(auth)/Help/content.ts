import type { UserRole } from "../../../contexts/auth-context";

export type HelpModuleId =
  | "dashboard"
  | "devices"
  | "medias"
  | "playlists"
  | "overlay-bars"
  | "schedules"
  | "users"
  | "audit-logs";

export interface HelpModule {
  id: HelpModuleId;
  title: string;
  eyebrow: string;
  description: string;
  url: string;
  actions: string[];
  tip: string;
  allowedRoles?: UserRole[];
}

export interface WorkflowStep {
  number: number;
  title: string;
  description: string;
  url: string;
}

export interface HelpQuestion {
  question: string;
  answer: string;
  keywords: string;
}

export interface OnboardingStep {
  id: string;
  route?: string;
  target?: string;
  menuTarget?: HelpModuleId | "help";
  activateTarget?: string;
  dismissTargets?: string[];
  eyebrow: string;
  title: string;
  description: string;
  bullets?: string[];
  allowedRoles?: UserRole[];
}

export const workflowSteps: WorkflowStep[] = [
  {
    number: 1,
    title: "Organize as mídias",
    description: "Envie imagens e vídeos e use pastas para manter o acervo organizado.",
    url: "/home/medias",
  },
  {
    number: 2,
    title: "Monte a playlist",
    description: "Defina a orientação, a ordem, o tempo das imagens e o áudio dos vídeos.",
    url: "/home/playlists",
  },
  {
    number: 3,
    title: "Adicione barras opcionais",
    description: "Crie faixas reutilizáveis com textos, imagens, relógio, data e clima.",
    url: "/home/overlay-bars",
  },
  {
    number: 4,
    title: "Vincule o Player",
    description: "Use o código exibido na TV Box para identificar e acompanhar o dispositivo.",
    url: "/home/devices",
  },
  {
    number: 5,
    title: "Programe a exibição",
    description: "Associe a playlist ao Player e escolha datas, horários e dias da semana.",
    url: "/home/schedules",
  },
  {
    number: 6,
    title: "Acompanhe a operação",
    description: "Confira status, prévia ao vivo, reprodução e histórico de atividades.",
    url: "/home/dashboard",
  },
];

export const helpModules: HelpModule[] = [
  {
    id: "dashboard",
    title: "Visão geral",
    eyebrow: "Acompanhamento",
    description: "Mostra os principais números da operação e destaca o que precisa de atenção.",
    url: "/home/dashboard",
    actions: [
      "Ver Players online e offline",
      "Acompanhar playlists e agendamentos ativos",
      "Acessar atalhos para as tarefas mais comuns",
    ],
    tip: "Comece o dia por esta tela para identificar rapidamente dispositivos desconectados.",
  },
  {
    id: "devices",
    title: "Dispositivos",
    eyebrow: "TV Boxes e Players",
    description: "Centraliza o vínculo, o estado atual e a inspeção de cada Player instalado.",
    url: "/home/devices",
    actions: [
      "Vincular o código exibido na TV Box",
      "Ver status online, conteúdo atual e prévia ao vivo",
      "Abrir detalhes, desvincular ou excluir um dispositivo",
    ],
    tip: "Um Player é considerado offline quando deixa de enviar atividade por mais de um minuto.",
  },
  {
    id: "medias",
    title: "Mídias",
    eyebrow: "Acervo",
    description: "Guarda as imagens e os vídeos que poderão ser usados nas playlists.",
    url: "/home/medias",
    actions: [
      "Enviar imagens e vídeos",
      "Criar pastas e organizar o acervo",
      "Consultar duração e presença de áudio dos vídeos",
    ],
    tip: "Use nomes claros e pastas por campanha, unidade ou período para facilitar a manutenção.",
  },
  {
    id: "playlists",
    title: "Playlists",
    eyebrow: "Sequência de exibição",
    description: "Define quais conteúdos serão reproduzidos, em qual ordem e orientação.",
    url: "/home/playlists",
    actions: [
      "Criar playlists horizontais ou verticais",
      "Adicionar e reordenar mídias",
      "Alterar o tempo das imagens e controlar o áudio disponível",
      "Associar barras fixas reutilizáveis",
    ],
    tip: "A duração manual é aplicada somente às imagens; vídeos usam a duração do próprio arquivo.",
  },
  {
    id: "overlay-bars",
    title: "Barras fixas",
    eyebrow: "Conteúdo sobreposto",
    description:
      "Cria faixas de topo, rodapé ou laterais que podem ser usadas em várias playlists.",
    url: "/home/overlay-bars",
    actions: [
      "Editar posição, espessura, cor e opacidade",
      "Combinar textos, imagens, espaçadores, data, hora e clima",
      "Pré-visualizar nas orientações horizontal e vertical",
    ],
    tip: "Edite uma barra reutilizada com cuidado: a alteração chega a todas as playlists vinculadas.",
  },
  {
    id: "schedules",
    title: "Agendamentos",
    eyebrow: "Grade de programação",
    description: "Determina em qual Player e em quais períodos uma playlist será exibida.",
    url: "/home/schedules",
    actions: [
      "Escolher Player e playlist",
      "Definir intervalo de datas, horário e dias da semana",
      "Ativar, editar ou remover uma programação",
    ],
    tip: "Revise o período e os dias selecionados antes de ativar uma programação recorrente.",
  },
  {
    id: "users",
    title: "Usuários",
    eyebrow: "Acessos",
    description:
      "Gerencia quem pode acessar a empresa e qual nível de permissão cada pessoa possui.",
    url: "/home/users",
    actions: [
      "Criar e editar acessos",
      "Definir perfis de proprietário, administrador ou operador",
      "Remover usuários conforme a hierarquia de segurança",
    ],
    tip: "Conceda apenas o menor nível de permissão necessário para cada função.",
    allowedRoles: ["OWNER", "ADMIN"],
  },
  {
    id: "audit-logs",
    title: "Auditoria",
    eyebrow: "Histórico administrativo",
    description: "Reúne atividades administrativas e eventos operacionais de todos os Players.",
    url: "/home/audit-logs",
    actions: [
      "Filtrar por Player, origem, evento e período",
      "Pesquisar playlist, dispositivo ou mensagem",
      "Investigar conexões, alterações e reproduções",
    ],
    tip: "Use a auditoria para reconstruir a sequência de eventos durante uma investigação.",
    allowedRoles: ["OWNER", "ADMIN"],
  },
];

export const helpQuestions: HelpQuestion[] = [
  {
    question: "Qual é o fluxo recomendado para publicar conteúdo?",
    answer:
      "Envie as mídias, monte a playlist, associe barras se necessário, vincule o Player e crie um agendamento. Depois acompanhe o resultado em Dispositivos.",
    keywords: "fluxo publicar conteúdo playlist agendamento",
  },
  {
    question: "Por que um Player aparece offline?",
    answer:
      "O status muda para offline quando o dispositivo fica mais de um minuto sem atividade. Verifique energia, internet, acesso à API e se o aplicativo está aberto.",
    keywords: "player dispositivo offline conexão internet",
  },
  {
    question: "Como escolher entre playlist horizontal e vertical?",
    answer:
      "Use horizontal para TVs instaladas normalmente e vertical para telas em modo retrato. A orientação deve corresponder à instalação física do monitor.",
    keywords: "orientação horizontal vertical retrato paisagem",
  },
  {
    question: "Posso usar a mesma barra em várias playlists?",
    answer:
      "Sim. As barras são reutilizáveis. Ao editar uma barra, todas as playlists vinculadas passam a usar a nova configuração.",
    keywords: "barra reutilizar playlists editar",
  },
  {
    question: "Por que não consigo ativar o áudio de um vídeo?",
    answer:
      "Quando o arquivo não possui faixa de áudio, o sistema mantém o vídeo silenciado e bloqueia a alteração. Vídeos com áudio permitem escolher o comportamento.",
    keywords: "vídeo audio mudo silenciado",
  },
  {
    question: "Onde consulto o histórico de funcionamento?",
    answer:
      "Administradores podem usar Auditoria para uma visão geral ou abrir os logs de um Player específico em Dispositivos.",
    keywords: "logs auditoria histórico eventos",
  },
  {
    question: "A prévia pode ficar diferente da TV?",
    answer:
      "Pequenas diferenças podem ocorrer por resolução, proporção e overscan da TV. Confirme a orientação, atualize o APK e teste a programação no equipamento final.",
    keywords: "prévia tv diferente barra corte overscan",
  },
];

const onboardingSteps: OnboardingStep[] = [
  {
    id: "welcome",
    eyebrow: "Primeiro acesso",
    title: "Conheça o fluxo do Indoor Player",
    description:
      "Uma apresentação rápida das funções essenciais para organizar o conteúdo, preparar as playlists e publicar nas telas.",
    bullets: [
      "Você pode avançar e voltar quando quiser.",
      "O tour não altera nenhum dado do sistema.",
      "Depois, ele continuará disponível na área Ajuda.",
    ],
  },
  {
    id: "dashboard",
    route: "/home/dashboard",
    target: "dashboard-actions",
    menuTarget: "dashboard",
    eyebrow: "Acompanhamento",
    title: "Comece pela Visão geral",
    description:
      "Aqui você acompanha Players, mídias, playlists e agendamentos, além de identificar rapidamente itens que exigem atenção.",
  },
  {
    id: "dashboard-overview",
    route: "/home/dashboard",
    target: "dashboard-overview",
    menuTarget: "dashboard",
    eyebrow: "Visão geral",
    title: "Veja a situação da operação",
    description:
      "Acompanhe os principais números e identifique rapidamente Players offline, conteúdos cadastrados e agendamentos ativos.",
  },
  {
    id: "medias",
    route: "/home/medias",
    target: "media-actions",
    menuTarget: "medias",
    dismissTargets: ["media-upload-close", "media-folder-close"],
    eyebrow: "Acervo de mídias",
    title: "Organize imagens e vídeos",
    description:
      "Envie os arquivos que serão exibidos e use pastas para separar campanhas, unidades ou períodos.",
  },
  {
    id: "media-library",
    route: "/home/medias",
    target: "media-library",
    menuTarget: "medias",
    eyebrow: "Acervo",
    title: "Localize e organize os arquivos cadastrados",
    description:
      "Use as pastas, a busca e a listagem para encontrar imagens e vídeos. Aqui também é possível revisar informações e remover arquivos que não serão mais usados.",
  },
  {
    id: "media-folder-modal",
    route: "/home/medias",
    target: "media-folder-form",
    menuTarget: "medias",
    activateTarget: "media-folder-button",
    dismissTargets: ["media-upload-close"],
    eyebrow: "Nova pasta",
    title: "Organize o acervo antes de enviar",
    description:
      "Informe um nome como “Campanha de agosto” ou “Unidade Centro”. A pasta é apenas organizacional e poderá receber várias imagens e vídeos.",
  },
  {
    id: "media-folder-actions",
    route: "/home/medias",
    target: "media-folder-actions",
    menuTarget: "medias",
    activateTarget: "media-folder-button",
    eyebrow: "Nova pasta",
    title: "Cancele ou confirme a criação",
    description:
      "Cancelar descarta o nome digitado. Criar pasta salva somente a estrutura de organização; nenhuma mídia é movida automaticamente.",
  },
  {
    id: "media-upload-rules",
    route: "/home/medias",
    target: "media-upload-rules",
    menuTarget: "medias",
    activateTarget: "media-upload-button",
    dismissTargets: ["media-folder-close"],
    eyebrow: "Enviar mídia",
    title: "Envie arquivos compatíveis",
    description:
      "Use imagens PNG ou JPG e vídeos MP4. Confira os limites indicados para preservar a qualidade e garantir a reprodução na TV Box.",
  },
  {
    id: "media-upload-folder",
    route: "/home/medias",
    target: "media-upload-folder",
    menuTarget: "medias",
    activateTarget: "media-upload-button",
    eyebrow: "Enviar mídia",
    title: "Escolha onde os arquivos serão organizados",
    description:
      "Selecione uma pasta existente ou mantenha “Sem pasta”. Essa escolha não altera a reprodução; serve para facilitar a localização no acervo.",
  },
  {
    id: "media-upload-files",
    route: "/home/medias",
    target: "media-upload-files",
    menuTarget: "medias",
    activateTarget: "media-upload-button",
    eyebrow: "Enviar mídia",
    title: "Selecione um ou vários arquivos",
    description:
      "Clique na área indicada para escolher até 20 arquivos. Antes de enviar, o sistema lista os itens e permite remover seleções incorretas.",
  },
  {
    id: "media-upload-actions",
    route: "/home/medias",
    target: "media-upload-actions",
    menuTarget: "medias",
    activateTarget: "media-upload-button",
    eyebrow: "Enviar mídia",
    title: "Revise a seleção antes de enviar",
    description:
      "O botão mostra quantos arquivos serão enviados e permanece desativado sem seleção. Cancelar fecha o modal e descarta a lista local.",
  },
  {
    id: "playlists",
    route: "/home/playlists",
    target: "playlist-create",
    menuTarget: "playlists",
    dismissTargets: ["playlist-create-close"],
    eyebrow: "Playlists",
    title: "Crie a sequência de exibição",
    description:
      "Defina a orientação da tela e depois organize mídias, durações, áudio e barras fixas na composição.",
  },
  {
    id: "playlist-library",
    route: "/home/playlists",
    target: "playlist-library",
    menuTarget: "playlists",
    eyebrow: "Playlists",
    title: "Gerencie as sequências cadastradas",
    description:
      "A listagem mostra orientação, quantidade de mídias e duração estimada. Abra uma playlist para editar sua composição ou use as ações para removê-la.",
  },
  {
    id: "playlist-modal-name",
    route: "/home/playlists",
    target: "playlist-modal-name",
    menuTarget: "playlists",
    activateTarget: "playlist-create-button",
    eyebrow: "Nova playlist",
    title: "Dê um nome fácil de identificar",
    description:
      "Use um nome relacionado à campanha, unidade ou objetivo, por exemplo “Ofertas da recepção”. Isso facilita agendamentos e auditorias.",
  },
  {
    id: "playlist-modal-orientation",
    route: "/home/playlists",
    target: "playlist-modal-orientation",
    menuTarget: "playlists",
    activateTarget: "playlist-create-button",
    eyebrow: "Nova playlist",
    title: "Escolha a orientação da tela",
    description:
      "Use horizontal para TVs em paisagem e vertical para instalações em retrato. Essa escolha controla como o Player apresenta todo o conteúdo.",
  },
  {
    id: "playlist-modal-actions",
    route: "/home/playlists",
    target: "playlist-modal-actions",
    menuTarget: "playlists",
    activateTarget: "playlist-create-button",
    eyebrow: "Nova playlist",
    title: "Crie somente quando os dados estiverem corretos",
    description:
      "Cancelar fecha o modal sem salvar. Criar playlist registra o nome e a orientação e depois libera a tela de composição.",
  },
  {
    id: "composition-actions",
    route: "/home/playlist-guide",
    target: "composition-actions",
    menuTarget: "playlists",
    eyebrow: "Exemplo de composição",
    title: "Monte a composição da playlist",
    description:
      "Use o cabeçalho para revisar a orientação, associar barras fixas e adicionar novas mídias à sequência.",
  },
  {
    id: "composition-image-settings",
    route: "/home/playlist-guide",
    target: "composition-image-settings",
    menuTarget: "playlists",
    eyebrow: "Composição · imagem",
    title: "Defina a ordem e o tempo das imagens",
    description:
      "Arraste os itens para reorganizar a sequência, duplique uma mídia quando precisar repeti-la e informe por quantos segundos cada imagem permanecerá na tela.",
  },
  {
    id: "composition-video-settings",
    route: "/home/playlist-guide",
    target: "composition-video-settings",
    menuTarget: "playlists",
    eyebrow: "Composição · vídeo",
    title: "Controle a reprodução dos vídeos",
    description:
      "A duração vem do próprio arquivo. Se houver faixa de áudio, você decide se ela será reproduzida; caso contrário, o controle permanece bloqueado.",
  },
  {
    id: "composition-bars",
    route: "/home/playlist-guide",
    target: "composition-bars",
    menuTarget: "playlists",
    eyebrow: "Composição · barras",
    title: "Vincule barras fixas à playlist",
    description:
      "Barras ficam sobre ou ao redor do conteúdo durante a reprodução. A mesma barra pode ser reaproveitada em várias playlists.",
  },
  {
    id: "overlay-bars",
    route: "/home/overlay-bars",
    target: "bar-create",
    menuTarget: "overlay-bars",
    dismissTargets: ["bar-modal-close"],
    eyebrow: "Barras fixas",
    title: "Crie elementos reutilizáveis",
    description:
      "Monte faixas com textos, imagens, hora, data ou clima e reutilize a mesma barra em diferentes playlists.",
  },
  {
    id: "bar-library",
    route: "/home/overlay-bars",
    target: "bar-library",
    menuTarget: "overlay-bars",
    eyebrow: "Barras fixas",
    title: "Reaproveite e edite barras existentes",
    description:
      "A listagem permite visualizar, editar e excluir as barras cadastradas. Uma alteração afeta todas as playlists que utilizam o mesmo elemento reutilizável.",
  },
  {
    id: "bar-modal-name",
    route: "/home/overlay-bars",
    target: "bar-modal-name",
    menuTarget: "overlay-bars",
    activateTarget: "bar-create-button",
    eyebrow: "Nova barra",
    title: "Identifique o elemento reutilizável",
    description:
      "O nome serve para localizar a barra ao montar playlists. Use algo descritivo, como “Rodapé institucional”.",
  },
  {
    id: "bar-modal-position",
    route: "/home/overlay-bars",
    target: "bar-modal-position",
    menuTarget: "overlay-bars",
    activateTarget: "bar-create-button",
    eyebrow: "Nova barra",
    title: "Defina onde a barra aparece",
    description:
      "Topo e rodapé criam faixas horizontais. Esquerda e direita criam faixas laterais mantendo textos e imagens na orientação correta.",
  },
  {
    id: "bar-modal-size",
    route: "/home/overlay-bars",
    target: "bar-modal-size",
    menuTarget: "overlay-bars",
    activateTarget: "bar-create-button",
    eyebrow: "Nova barra",
    title: "Ajuste espessura e transparência",
    description:
      "Espessura define quanto da tela a barra ocupa. Opacidade controla quanto do conteúdo permanece visível através da cor escolhida.",
  },
  {
    id: "bar-modal-alignment",
    route: "/home/overlay-bars",
    target: "bar-modal-alignment",
    menuTarget: "overlay-bars",
    activateTarget: "bar-create-button",
    eyebrow: "Nova barra",
    title: "Posicione o conteúdo na barra",
    description:
      "Combine posição e alinhamento para colocar os elementos no início, centro ou fim da barra, tanto horizontal quanto verticalmente.",
  },
  {
    id: "bar-modal-content",
    route: "/home/overlay-bars",
    target: "bar-modal-content",
    menuTarget: "overlay-bars",
    activateTarget: "bar-create-button",
    eyebrow: "Nova barra",
    title: "Combine conteúdos independentes",
    description:
      "Adicione frases, imagens, logos, espaçadores, relógio, data ou clima. Cada item pode ter fonte, cor, tamanho, fundo, espaçamento e posição próprios.",
  },
  {
    id: "bar-modal-preview",
    route: "/home/overlay-bars",
    target: "bar-modal-preview",
    menuTarget: "overlay-bars",
    activateTarget: "bar-create-button",
    eyebrow: "Nova barra",
    title: "Confira o resultado nas duas orientações",
    description:
      "Troque a orientação da prévia para conferir proporção, alinhamento e cortes antes de salvar e vincular a barra às playlists.",
  },
  {
    id: "bar-modal-actions",
    route: "/home/overlay-bars",
    target: "bar-modal-actions",
    menuTarget: "overlay-bars",
    activateTarget: "bar-create-button",
    eyebrow: "Nova barra",
    title: "Salve apenas depois de conferir a prévia",
    description:
      "O botão permanece desativado enquanto houver campos obrigatórios incompletos. Cancelar fecha a edição sem criar a barra.",
  },
  {
    id: "devices",
    route: "/home/devices",
    target: "device-pair",
    menuTarget: "devices",
    dismissTargets: ["device-pair-close"],
    eyebrow: "Dispositivos",
    title: "Vincule e acompanhe seus Players",
    description:
      "Ao abrir o aplicativo do Player, um código será exibido na tela da TV. Informe esse código no painel para vincular e acompanhar o dispositivo.",
  },
  {
    id: "device-overview",
    route: "/home/devices",
    target: "device-overview",
    menuTarget: "devices",
    eyebrow: "Dispositivos",
    title: "Monitore cada Player",
    description:
      "Os cards mostram conexão, conteúdo atual e prévia da tela. Abra os detalhes quando precisar consultar o histórico do dispositivo.",
  },
  {
    id: "device-pair-code",
    route: "/home/devices",
    target: "device-pair-code",
    menuTarget: "devices",
    activateTarget: "device-pair-button",
    eyebrow: "Vincular dispositivo",
    title: "Digite o código exibido na TV",
    description:
      "O aplicativo mostra um código de seis caracteres diretamente na TV. Digite-o exatamente como aparece para identificar e vincular o Player correto.",
  },
  {
    id: "device-pair-name",
    route: "/home/devices",
    target: "device-pair-name",
    menuTarget: "devices",
    activateTarget: "device-pair-button",
    eyebrow: "Vincular dispositivo",
    title: "Use um nome relacionado ao local",
    description:
      "Nomes como “TV Recepção” ou “Painel Loja Centro” facilitam filtros, agendamentos e investigações na auditoria.",
  },
  {
    id: "device-pair-actions",
    route: "/home/devices",
    target: "device-pair-actions",
    menuTarget: "devices",
    activateTarget: "device-pair-button",
    eyebrow: "Vincular dispositivo",
    title: "Confirme para concluir o vínculo",
    description:
      "Vincular dispositivo valida o código na API e associa a TV à empresa. Durante o guia, esse botão não é acionado e nenhum vínculo é criado.",
  },
  {
    id: "schedules",
    route: "/home/schedules",
    target: "schedule-create",
    menuTarget: "schedules",
    dismissTargets: ["schedule-modal-close"],
    eyebrow: "Agendamentos",
    title: "Programe quando o conteúdo será exibido",
    description:
      "Associe uma playlist a um Player e defina datas, horários e dias da semana. Essa etapa coloca o conteúdo no ar.",
  },
  {
    id: "schedule-planning",
    route: "/home/schedules",
    target: "schedule-planning",
    menuTarget: "schedules",
    eyebrow: "Programação",
    title: "Consulte e administre os agendamentos",
    description:
      "A listagem apresenta Player, playlist, período, prioridade e status. Use as ações para editar, ativar, desativar ou remover uma programação.",
  },
  {
    id: "schedule-modal-association",
    route: "/home/schedules",
    target: "schedule-modal-association",
    menuTarget: "schedules",
    activateTarget: "schedule-create-button",
    eyebrow: "Novo agendamento",
    title: "Associe a playlist ao Player correto",
    description:
      "Selecione o dispositivo e a playlist que ele deve reproduzir. O guia usa referências de exemplo quando ainda não existem dados cadastrados.",
  },
  {
    id: "schedule-modal-period",
    route: "/home/schedules",
    target: "schedule-modal-period",
    menuTarget: "schedules",
    activateTarget: "schedule-create-button",
    eyebrow: "Novo agendamento",
    title: "Defina o período de exibição",
    description:
      "As datas limitam a validade da programação. Os horários determinam em qual intervalo diário a playlist poderá ser executada.",
  },
  {
    id: "schedule-modal-days",
    route: "/home/schedules",
    target: "schedule-modal-days",
    menuTarget: "schedules",
    activateTarget: "schedule-create-button",
    eyebrow: "Novo agendamento",
    title: "Escolha os dias de repetição",
    description:
      "Use os atalhos para dias úteis ou todos os dias, ou marque cada dia individualmente conforme a rotina do local.",
  },
  {
    id: "schedule-modal-priority",
    route: "/home/schedules",
    target: "schedule-modal-priority",
    menuTarget: "schedules",
    activateTarget: "schedule-create-button",
    eyebrow: "Novo agendamento",
    title: "Use a prioridade para resolver conflitos",
    description:
      "Quando dois agendamentos disputam o mesmo horário, o maior número tem preferência. Desativar pausa a programação sem excluí-la.",
  },
  {
    id: "schedule-modal-actions",
    route: "/home/schedules",
    target: "schedule-modal-actions",
    menuTarget: "schedules",
    activateTarget: "schedule-create-button",
    eyebrow: "Novo agendamento",
    title: "Revise tudo antes de criar",
    description:
      "Criar agendamento envia a programação para a API. O guia apenas explica os campos e nunca aciona o envio do formulário.",
  },
  {
    id: "users",
    route: "/home/users",
    target: "user-create",
    menuTarget: "users",
    dismissTargets: ["user-modal-close"],
    eyebrow: "Administração",
    title: "Gerencie o acesso da equipe",
    description:
      "Proprietários e administradores podem criar usuários e definir as permissões adequadas para cada pessoa.",
    allowedRoles: ["OWNER", "ADMIN"],
  },
  {
    id: "user-management",
    route: "/home/users",
    target: "user-management",
    menuTarget: "users",
    eyebrow: "Acessos",
    title: "Revise perfis e permissões",
    description:
      "A tabela identifica cada usuário e seu perfil. Conforme sua permissão, você pode editar dados, alterar o nível de acesso ou remover uma conta.",
    allowedRoles: ["OWNER", "ADMIN"],
  },
  {
    id: "user-modal-identity",
    route: "/home/users",
    target: "user-modal-identity",
    menuTarget: "users",
    activateTarget: "user-create-button",
    eyebrow: "Novo usuário",
    title: "Informe quem receberá o acesso",
    description: "Use o nome completo para facilitar a identificação nos registros de auditoria.",
    allowedRoles: ["OWNER", "ADMIN"],
  },
  {
    id: "user-modal-email",
    route: "/home/users",
    target: "user-modal-email",
    menuTarget: "users",
    activateTarget: "user-create-button",
    eyebrow: "Novo usuário",
    title: "O e-mail será usado no login",
    description:
      "Cadastre um endereço corporativo válido e exclusivo para a pessoa acessar o painel.",
    allowedRoles: ["OWNER", "ADMIN"],
  },
  {
    id: "user-modal-password",
    route: "/home/users",
    target: "user-modal-password",
    menuTarget: "users",
    activateTarget: "user-create-button",
    eyebrow: "Novo usuário",
    title: "Defina uma senha inicial segura",
    description:
      "A senha precisa ter pelo menos seis caracteres. O botão ao lado permite conferir temporariamente o que foi digitado.",
    allowedRoles: ["OWNER", "ADMIN"],
  },
  {
    id: "user-modal-role",
    route: "/home/users",
    target: "user-modal-role",
    menuTarget: "users",
    activateTarget: "user-create-button",
    eyebrow: "Novo usuário",
    title: "Escolha a permissão adequada",
    description:
      "Operadores cuidam da rotina de conteúdo e Players. Administradores também gerenciam usuários e consultam a auditoria geral da empresa.",
    allowedRoles: ["OWNER", "ADMIN"],
  },
  {
    id: "user-modal-actions",
    route: "/home/users",
    target: "user-modal-actions",
    menuTarget: "users",
    activateTarget: "user-create-button",
    eyebrow: "Novo usuário",
    title: "Confirme somente após revisar o perfil",
    description:
      "Criar usuário libera um novo acesso à empresa. Durante a apresentação, nenhum dado é preenchido ou enviado.",
    allowedRoles: ["OWNER", "ADMIN"],
  },
  {
    id: "audit-logs",
    route: "/home/audit-logs",
    target: "audit-summary",
    menuTarget: "audit-logs",
    eyebrow: "Administração",
    title: "Investigue o histórico da empresa",
    description:
      "A Auditoria reúne eventos de Players, reproduções e alterações administrativas. Use a pesquisa, os filtros e a tabela quando precisar investigar uma ocorrência.",
    allowedRoles: ["OWNER", "ADMIN"],
  },
  {
    id: "audit-filters",
    route: "/home/audit-logs",
    target: "audit-filters",
    menuTarget: "audit-logs",
    eyebrow: "Auditoria",
    title: "Encontre os eventos relevantes",
    description:
      "Pesquise textos e combine origem, Player e período. Os filtros trabalham juntos para reduzir rapidamente o histórico ao conjunto de eventos relevante.",
    allowedRoles: ["OWNER", "ADMIN"],
  },
  {
    id: "audit-table",
    route: "/home/audit-logs",
    target: "audit-table",
    menuTarget: "audit-logs",
    eyebrow: "Auditoria",
    title: "Analise a sequência dos eventos",
    description:
      "A tabela relaciona data, evento, origem, usuário e dispositivo. Expanda registros extensos e use a paginação para consultar períodos anteriores.",
    allowedRoles: ["OWNER", "ADMIN"],
  },
  {
    id: "help",
    route: "/home/help",
    target: "help-summary",
    menuTarget: "help",
    eyebrow: "Sempre disponível",
    title: "Consulte a Ajuda quando precisar",
    description:
      "Pesquise uma dúvida, consulte as orientações de cada módulo ou reinicie esta apresentação a qualquer momento.",
  },
  {
    id: "help-search",
    route: "/home/help",
    target: "help-search-area",
    menuTarget: "help",
    eyebrow: "Ajuda",
    title: "Pesquise pelo assunto da sua dúvida",
    description:
      "Digite uma função, tela ou problema para localizar rapidamente os módulos e perguntas relacionadas.",
  },
  {
    id: "help-manual",
    route: "/home/help",
    target: "help-manual",
    menuTarget: "help",
    eyebrow: "Ajuda",
    title: "Consulte o manual sempre que precisar",
    description:
      "Cada módulo possui um resumo de uso, ações principais e dicas. Você também pode reiniciar esta apresentação pelo cabeçalho da página.",
  },
];

const primaryOnboardingStepIds = new Set([
  "welcome",
  "dashboard-overview",
  "medias",
  "media-upload-rules",
  "playlists",
  "playlist-modal-orientation",
  "composition-actions",
  "composition-image-settings",
  "composition-video-settings",
  "composition-bars",
  "overlay-bars",
  "bar-modal-position",
  "bar-modal-size",
  "bar-modal-alignment",
  "bar-modal-content",
  "bar-modal-preview",
  "devices",
  "device-overview",
  "device-pair-code",
  "schedules",
  "schedule-modal-association",
  "schedule-modal-period",
  "schedule-modal-days",
  "schedule-modal-priority",
  "users",
  "user-modal-role",
  "audit-logs",
  "audit-filters",
  "audit-table",
  "help",
]);

export function getVisibleHelpModules(role: UserRole | undefined) {
  return helpModules.filter(
    (module) => !module.allowedRoles || (role ? module.allowedRoles.includes(role) : false),
  );
}

export function getOnboardingSteps(role: UserRole | undefined) {
  return onboardingSteps.filter(
    (step) =>
      primaryOnboardingStepIds.has(step.id) &&
      (!step.allowedRoles || (role ? step.allowedRoles.includes(role) : false)),
  );
}
