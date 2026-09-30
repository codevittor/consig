export const initialData = {
  workspace: {
    name: "Consig Studio",
    owner: "Gabriel Silva",
    email: "gabriel@consig.com.br",
    tagline: "Workspace Pessoal & Gerenciamento de Projetos"
  },
  folders: [
    {
      id: "portfolio",
      name: "Portfólio",
      parentId: null,
      icon: "folder",
      color: "#f43f5e",
      description: "Trabalhos de destaque, apresentações e entregas finais"
    },
    {
      id: "portfolio-curriculos",
      name: "Currículos & Resumos",
      parentId: "portfolio",
      icon: "file-text",
      color: "#ec4899",
      description: "Modelos e versões de currículos profissionais"
    },
    {
      id: "portfolio-apresentacoes",
      name: "Apresentações",
      parentId: "portfolio",
      icon: "award",
      color: "#eab308",
      description: "Pitches e decks de apresentação institucional"
    },
    {
      id: "portfolio-certificados",
      name: "Certificados Técnicos",
      parentId: "portfolio",
      icon: "shield-check",
      color: "#3b82f6",
      description: "Certificações Cloud, DevOps e Engenharia"
    },
    {
      id: "software",
      name: "Software & Web Apps",
      parentId: null,
      icon: "code",
      color: "#10b981",
      description: "Sistemas completos, APIs e arquiteturas"
    },
    {
      id: "software-frontend",
      name: "Aplicações Frontend",
      parentId: "software",
      icon: "layout",
      color: "#06b6d4",
      description: "Projetos em React, Vite, Tailwind e Next.js"
    },
    {
      id: "software-backend",
      name: "APIs & Microsserviços",
      parentId: "software",
      icon: "server",
      color: "#8b5cf6",
      description: "APIs Node.js, Express e Bancos de Dados"
    },
    {
      id: "design-system",
      name: "Design System & UI",
      parentId: null,
      icon: "palette",
      color: "#a855f7",
      description: "Kits de UI, tokens e protótipos interativos"
    },
    {
      id: "ecommerce",
      name: "E-Commerce & Lojas",
      parentId: null,
      icon: "shopping-bag",
      color: "#f97316",
      description: "Plataformas de venda, checkouts e catálogos"
    },
    {
      id: "cronogramas",
      name: "Cronogramas & Rotinas",
      parentId: null,
      icon: "calendar",
      color: "#6366f1",
      description: "Prazos de sprint e entregas pontuais"
    }
  ],
  projects: [
    {
      id: "proj-identidade-visual",
      title: "identidade-visual-studio.pdf",
      folderId: "portfolio-curriculos",
      category: "Design",
      status: "Em Andamento",
      priority: "Urgente",
      author: {
        name: "Gabriel Silva",
        email: "gabriel@consig.com.br",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
      },
      fileExtension: "pdf",
      fileSize: "8.4 MB",
      updatedAt: "2026-09-29T16:45:00Z",
      createdAt: "2026-09-20T10:00:00Z",
      dueDate: "2026-10-05",
      client: "Consig Studio Alpha",
      description: "Brand book e identidade visual com especificações de tipografia, cores e layout 3D.",
      starred: true,
      resources: [
        { id: "r1", title: "Protótipo Figma", url: "https://figma.com/@consig-identity", type: "figma" },
        { id: "r2", title: "Repositório de Assets", url: "https://github.com/consig/assets", type: "github" }
      ],
      notes: `# Identidade Visual & Diretrizes da Marca

## Visão Geral
Conceito estético voltado para interfaces modernas, com paleta monocromática escura, alto contraste e elementos com profundidade sutil.

### Checklist de Entregáveis
- [x] Definição da tipografia titular (Inter & Geist Sans)
- [x] Mockups de cartões e pastas foscos
- [ ] Exportação do PDF de apresentação final (24 páginas)
- [ ] Criação de templates para mídias sociais

\`\`\`css
/* Tokens de Cores */
--bg-principal: #09090b;
--cartao-superficie: #16161a;
--destaque-coral: #f43f5e;
--texto-claro: #fafafa;
\`\`\`

> **Importante:** Revisar os espaçamentos com o time antes do fechamento de sprint.`,
      tasks: [
        {
          id: "t-101",
          title: "Finalizar grid de proporções do logo",
          description: "Ajustar curvas e espaçamento entre vértices",
          column: "done",
          priority: "high",
          dueDate: "2026-09-25",
          tags: ["Design", "Branding"],
          completed: true,
          assignee: { name: "Gabriel Silva", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" }
        },
        {
          id: "t-102",
          title: "Renderizar visualização 3D das pastas",
          description: "Camadas translúcidas com textura fosca",
          column: "in_progress",
          priority: "urgent",
          dueDate: "2026-10-02",
          tags: ["3D", "UI"],
          completed: false,
          assignee: { name: "Gabriel Silva", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" }
        },
        {
          id: "t-103",
          title: "Diagramar capítulo de tipografia no PDF",
          description: "Hierarquia H1-H4 e regras de legibilidade",
          column: "todo",
          priority: "medium",
          dueDate: "2026-10-04",
          tags: ["Editorial"],
          completed: false
        },
        {
          id: "t-104",
          title: "Revisão ortográfica dos textos",
          description: "Conferir pontuação e nomenclatura técnica",
          column: "review",
          priority: "low",
          dueDate: "2026-10-05",
          tags: ["Revisão"],
          completed: false
        }
      ],
      timeline: [
        { id: "tl-1", action: "Criou o projeto e fez upload do briefing", timestamp: "2026-09-20 10:15", user: "Gabriel Silva" },
        { id: "tl-2", action: "Concluiu a tarefa de proporções do logo", timestamp: "2026-09-25 18:30", user: "Gabriel Silva" },
        { id: "tl-3", action: "Atualizou notas com tokens de cores CSS", timestamp: "2026-09-29 16:45", user: "Gabriel Silva" }
      ]
    },
    {
      id: "proj-design-system",
      title: "interface-design-system.fig",
      folderId: "design-system",
      category: "Software",
      status: "Em Andamento",
      priority: "Alta",
      author: {
        name: "Gabriel Silva",
        email: "gabriel@consig.com.br",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
      },
      fileExtension: "fig",
      fileSize: "42.1 MB",
      updatedAt: "2026-09-29T15:20:00Z",
      createdAt: "2026-09-18T14:30:00Z",
      dueDate: "2026-10-10",
      client: "Consig Plataforma",
      description: "Interface operacional escura com cartões 3D foscos, barras laterais triplas e tokens.",
      starred: true,
      resources: [
        { id: "r3", title: "Arquivo Mestre Figma", url: "https://figma.com/@consig-master", type: "figma" },
        { id: "r4", title: "Repositório do Frontend", url: "https://github.com/consig/client", type: "github" }
      ],
      notes: `# Consig Design System & Componentes

Interface inspirada em minimalismo dark escandinavo e ferramentas de alta produtividade.

## Diretrizes
1. Superfícies em gradiente carbônico (#09090b para #111114).
2. Vidro fosco fumê com desfoque de 16px.
3. Indicadores de status sutis e navegação fluida.`,
      tasks: [
        {
          id: "t-201",
          title: "Criar tokens de sombra das pastas 3D",
          description: "Profundidade com iluminação superior",
          column: "done",
          priority: "urgent",
          dueDate: "2026-09-22",
          tags: ["Design System"],
          completed: true
        },
        {
          id: "t-202",
          title: "Implementar componente FolderCard3D",
          description: "Abas translúcidas e badges numéricos",
          column: "in_progress",
          priority: "high",
          dueDate: "2026-09-30",
          tags: ["React"],
          completed: false
        }
      ],
      timeline: [
        { id: "tl-4", action: "Criou estrutura de componentes no Figma", timestamp: "2026-09-18 14:35", user: "Gabriel Silva" }
      ]
    },
    {
      id: "proj-painel-financeiro",
      title: "painel-financeiro-metricas.tsx",
      folderId: "software-frontend",
      category: "Software",
      status: "Concluído",
      priority: "Alta",
      author: {
        name: "Gabriel Silva",
        email: "gabriel@consig.com.br",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
      },
      fileExtension: "tsx",
      fileSize: "16.8 MB",
      updatedAt: "2026-09-28T19:10:00Z",
      createdAt: "2026-09-10T09:00:00Z",
      dueDate: "2026-09-28",
      client: "Consig Analytics",
      description: "Dashboard executivo em dark mode com cartões KPI, anéis luminosos e mapa de calor semanal.",
      starred: true,
      resources: [
        { id: "r5", title: "GitHub Analytics", url: "https://github.com/consig/analytics", type: "github" }
      ],
      notes: `# Painel Financeiro & Métricas
Telemetria de produtividade e análise de desempenho semanal.`,
      tasks: [
        {
          id: "t-301",
          title: "Gráfico de velocidade em curva SVG",
          description: "Renderização suave sem dependências externas",
          column: "done",
          priority: "high",
          dueDate: "2026-09-26",
          tags: ["Frontend"],
          completed: true
        }
      ],
      timeline: [
        { id: "tl-5", action: "Publicado em produção", timestamp: "2026-09-28 19:15", user: "Gabriel Silva" }
      ]
    },
    {
      id: "proj-loja-minimalista",
      title: "loja-minimalista-venda.zip",
      folderId: "ecommerce",
      category: "E-Commerce",
      status: "Em Revisão",
      priority: "Média",
      author: {
        name: "Ana Souza",
        email: "ana.souza@consig.com.br",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
      },
      fileExtension: "zip",
      fileSize: "64.0 MB",
      updatedAt: "2026-09-27T11:00:00Z",
      createdAt: "2026-09-12T08:15:00Z",
      dueDate: "2026-10-08",
      client: "Aura Living Móveis",
      description: "Loja virtual headless com checkout transparente e micro-animações de catálogo.",
      starred: false,
      resources: [],
      notes: `# Aura Móveis E-Commerce
Checkout otimizado com foco em velocidade de conversão.`,
      tasks: [],
      timeline: []
    },
    {
      id: "proj-api-autenticacao",
      title: "api-servico-autenticacao.ts",
      folderId: "software-backend",
      category: "Software",
      status: "Em Andamento",
      priority: "Alta",
      author: {
        name: "Gabriel Silva",
        email: "gabriel@consig.com.br",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
      },
      fileExtension: "ts",
      fileSize: "2.3 MB",
      updatedAt: "2026-09-29T11:40:00Z",
      createdAt: "2026-09-22T13:00:00Z",
      dueDate: "2026-10-15",
      client: "Consig Infra",
      description: "Serviço de autenticação JWT sem estado e cache Redis em memória.",
      starred: false,
      resources: [],
      notes: `# API de Autenticação & Gateway
Controle de requisições por IP e rate limit.`,
      tasks: [],
      timeline: []
    },
    {
      id: "proj-certificacao-cloud",
      title: "certificacao-cloud-arquiteto.pdf",
      folderId: "portfolio-certificados",
      category: "Pesquisa",
      status: "Concluído",
      priority: "Baixa",
      author: {
        name: "Gabriel Silva",
        email: "gabriel@consig.com.br",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
      },
      fileExtension: "pdf",
      fileSize: "3.1 MB",
      updatedAt: "2026-09-15T09:00:00Z",
      createdAt: "2026-09-01T10:00:00Z",
      dueDate: "2026-09-15",
      client: "Qualificação Profissional",
      description: "Certificado de arquiteto de soluções e revisão de sistemas distribuídos.",
      starred: false,
      resources: [],
      notes: `# Certificação Cloud
Aprovado com 92% de pontuação.`,
      tasks: [],
      timeline: []
    }
  ]
};
