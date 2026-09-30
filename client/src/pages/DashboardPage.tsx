import React from 'react';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Flame, 
  Star, 
  ExternalLink,
} from 'lucide-react';
import { Project, WorkspaceData } from '../types';

interface DashboardPageProps {
  workspaceData: WorkspaceData | null;
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onNavigateToProjects: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  workspaceData,
  projects,
  onSelectProject,
  onNavigateToProjects,
}) => {
  const stats = workspaceData?.stats || {
    totalProjects: projects.length,
    totalFolders: 10,
    totalTasks: 24,
    completedTasks: 18,
    inProgressTasks: 6,
    productivityRate: 75,
  };

  const urgentTasks: { task: any; project: Project }[] = [];
  projects.forEach((p) => {
    (p.tasks || []).forEach((t) => {
      if ((t.priority === 'urgent' || t.priority === 'high') && t.column !== 'done') {
        urgentTasks.push({ task: t, project: p });
      }
    });
  });

  const starredProjects = projects.filter((p) => p.starred);

  const heatmapDays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
  const heatmapHours = ['09h', '11h', '14h', '16h', '18h'];

  return (
    <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-[#080808]">
      {/* Top Header */}
      <header className="h-16 px-8 border-b border-[#1a1a1a] bg-[#0a0a0a]/85 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-[17px] font-semibold text-white tracking-tight">
            Dashboard Executivo & Telemetria
          </h1>
          <span className="px-2 py-0.5 text-[11px] font-mono rounded-full bg-white/10 text-white border border-white/20">
            Tempo Real
          </span>
        </div>

        <div className="flex items-center gap-3 text-[12px] text-[#737373]">
          <span className="font-mono">
            {new Date().toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}
          </span>
          <button
            onClick={onNavigateToProjects}
            className="px-3.5 py-1.5 rounded-xl bg-white text-black font-medium hover:bg-neutral-200 transition-colors shadow-sm"
          >
            Ver Pastas
          </button>
        </div>
      </header>

      {/* Content Container */}
      <div className="p-8 max-w-7xl mx-auto w-full flex flex-col gap-8">
        {/* KPI Cards Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#111111] border border-white/[0.06] hover:border-white/[0.14] transition-all shadow-sm">
            <div className="flex items-center justify-between text-[#858585] text-[12px] mb-2">
              <span>Total de Trabalhos</span>
              <span className="flex items-center gap-0.5 text-white font-mono text-[11px] bg-white/10 px-1.5 py-0.5 rounded">
                <ArrowUpRight size={12} /> +12.5%
              </span>
            </div>
            <div className="text-2xl font-bold text-white tracking-tight font-mono">
              {stats.totalProjects}
            </div>
            <span className="text-[11px] text-[#737373] mt-1 block font-normal">
              distribuídos em {stats.totalFolders || 10} pastas ativas
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-[#111111] border border-white/[0.06] hover:border-white/[0.14] transition-all shadow-sm">
            <div className="flex items-center justify-between text-[#858585] text-[12px] mb-2">
              <span>Tarefas Concluídas</span>
              <span className="flex items-center gap-0.5 text-white font-mono text-[11px] bg-white/10 px-1.5 py-0.5 rounded">
                <ArrowUpRight size={12} /> +8.2%
              </span>
            </div>
            <div className="text-2xl font-bold text-white tracking-tight font-mono">
              {stats.completedTasks}
            </div>
            <span className="text-[11px] text-[#737373] mt-1 block font-normal">
              de {stats.totalTasks} tarefas registradas
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-[#111111] border border-white/[0.06] hover:border-white/[0.14] transition-all shadow-sm">
            <div className="flex items-center justify-between text-[#858585] text-[12px] mb-2">
              <span>Em Andamento</span>
              <span className="flex items-center gap-0.5 text-[#a3a3a3] font-mono text-[11px] bg-white/5 px-1.5 py-0.5 rounded">
                <ArrowDownRight size={12} /> -4.3%
              </span>
            </div>
            <div className="text-2xl font-bold text-white tracking-tight font-mono">
              {stats.inProgressTasks}
            </div>
            <span className="text-[11px] text-[#737373] mt-1 block font-normal">
              requerem acompanhamento ativo
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-[#111111] border border-white/[0.06] hover:border-white/[0.14] transition-all shadow-sm">
            <div className="flex items-center justify-between text-[#858585] text-[12px] mb-2">
              <span>Taxa de Produtividade</span>
              <span className="flex items-center gap-0.5 text-white font-mono text-[11px] bg-white/10 px-1.5 py-0.5 rounded">
                <ArrowUpRight size={12} /> +2.1%
              </span>
            </div>
            <div className="text-2xl font-bold text-white tracking-tight font-mono flex items-center gap-2">
              {stats.productivityRate}%
              <span className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#ffffff]" />
            </div>
            <span className="text-[11px] text-[#737373] mt-1 block font-normal">
              taxa de fechamento por sprint
            </span>
          </div>
        </section>

        {/* Mostradores Circulares em Estilo Monocromático Puro */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-[#111111] border border-white/[0.06] flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-[12px] text-[#858585] font-medium">Meta da Sprint</span>
              <h4 className="text-white font-semibold text-[15px]">Entrega Portfólio 3D</h4>
              <span className="text-[11px] text-[#737373]">Prazo: 05 de Outubro</span>
            </div>

            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15" fill="none" stroke="#222222" strokeWidth="3" />
                <circle
                  cx="18"
                  cy="18"
                  r="15"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="3"
                  strokeDasharray="94.2"
                  strokeDashoffset="25"
                  strokeLinecap="round"
                  className="filter drop-shadow-[0_0_6px_rgba(255,255,255,0.7)]"
                />
              </svg>
              <span className="absolute font-mono text-[12px] font-bold text-white">73%</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#111111] border border-white/[0.06] flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-[12px] text-[#858585] font-medium">Qualidade de Código</span>
              <h4 className="text-white font-semibold text-[15px]">Testes Automatizados</h4>
              <span className="text-[11px] text-[#737373]">Zero falhas detectadas</span>
            </div>

            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15" fill="none" stroke="#222222" strokeWidth="3" />
                <circle
                  cx="18"
                  cy="18"
                  r="15"
                  fill="none"
                  stroke="#d4d4d4"
                  strokeWidth="3"
                  strokeDasharray="94.2"
                  strokeDashoffset="12"
                  strokeLinecap="round"
                  className="filter drop-shadow-[0_0_5px_rgba(255,255,255,0.4)]"
                />
              </svg>
              <span className="absolute font-mono text-[12px] font-bold text-white">88%</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#111111] border border-white/[0.06] flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-[12px] text-[#858585] font-medium">Armazenamento Local</span>
              <h4 className="text-white font-semibold text-[15px]">database.json</h4>
              <span className="text-[11px] text-[#737373]">142.8 MB sincronizados</span>
            </div>

            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15" fill="none" stroke="#222222" strokeWidth="3" />
                <circle
                  cx="18"
                  cy="18"
                  r="15"
                  fill="none"
                  stroke="#858585"
                  strokeWidth="3"
                  strokeDasharray="94.2"
                  strokeDashoffset="45"
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute font-mono text-[12px] font-bold text-white">52%</span>
            </div>
          </div>
        </section>

        {/* Heatmap & Line Performance in Monochrome */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="p-6 rounded-2xl bg-[#101010] border border-white/[0.06] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-[15px] font-semibold text-white">
                    Intensidade de Commits & Modificações
                  </h3>
                  <p className="text-[12px] text-[#737373]">Horários de maior foco semanal</p>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-[#858585]">
                  <span className="w-2.5 h-2.5 rounded bg-[#1c1c1c]" /> Baixa
                  <span className="w-2.5 h-2.5 rounded bg-[#404040]" /> Média
                  <span className="w-2.5 h-2.5 rounded bg-white shadow-[0_0_6px_#ffffff]" /> Alta
                </div>
              </div>

              <div className="grid grid-cols-8 gap-2 items-center text-center font-mono text-[11px] text-[#737373] pt-2">
                <span />
                {heatmapDays.map((d) => (
                  <span key={d}>{d}</span>
                ))}

                {heatmapHours.map((hour, hIdx) => (
                  <React.Fragment key={hour}>
                    <span className="text-right pr-2 text-[10px]">{hour}</span>
                    {heatmapDays.map((day, dIdx) => {
                      const active = (hIdx === 2 && (dIdx >= 1 && dIdx <= 4)) || (hIdx === 3 && dIdx === 2);
                      const medium = (hIdx >= 1 && hIdx <= 3 && dIdx < 5) && !active;

                      return (
                        <div
                          key={`${hour}-${day}`}
                          className={`h-7 rounded-lg transition-all ${
                            active
                              ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.7)]'
                              : medium
                              ? 'bg-[#333333] border border-white/20'
                              : 'bg-[#181818] border border-white/[0.03]'
                          }`}
                        />
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#101010] border border-white/[0.06] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-[15px] font-semibold text-white">
                    Produtividade & Entregas Mensais
                  </h3>
                  <p className="text-[12px] text-[#737373]">Velocidade de fechamento de tarefas</p>
                </div>
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="flex items-center gap-1.5 text-white">
                    <span className="w-2 h-2 rounded-full bg-white shadow-[0_0_6px_#ffffff]" /> Realizado
                  </span>
                  <span className="flex items-center gap-1.5 text-[#737373]">
                    <span className="w-2 h-2 rounded-full bg-[#525252]" /> Meta
                  </span>
                </div>
              </div>

              <div className="w-full h-44 mt-4 relative">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 400 150">
                  <line x1="0" y1="30" x2="400" y2="30" stroke="#1c1c1c" strokeDasharray="3 3" />
                  <line x1="0" y1="75" x2="400" y2="75" stroke="#1c1c1c" strokeDasharray="3 3" />
                  <line x1="0" y1="120" x2="400" y2="120" stroke="#1c1c1c" strokeDasharray="3 3" />

                  {/* Target Line (Muted Gray Dashed) */}
                  <path
                    d="M 10 110 C 80 100, 140 60, 200 65 C 260 70, 320 40, 390 35"
                    fill="none"
                    stroke="#525252"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    opacity="0.8"
                  />

                  {/* Realized Line (Bright White Glow) */}
                  <path
                    d="M 10 130 C 70 120, 130 90, 200 50 C 270 20, 330 60, 390 20"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="2.5"
                    className="filter drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]"
                  />

                  <circle cx="200" cy="50" r="3.5" fill="#ffffff" stroke="#000" strokeWidth="1.5" />
                  <circle cx="390" cy="20" r="3.5" fill="#ffffff" stroke="#000" strokeWidth="1.5" />
                </svg>

                <div className="flex justify-between text-[11px] font-mono text-[#737373] mt-2">
                  <span>Jan</span>
                  <span>Fev</span>
                  <span>Mar</span>
                  <span>Abr</span>
                  <span>Mai</span>
                  <span>Jun</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Urgent Tasks & Starred Projects in Monochrome */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="p-6 rounded-2xl bg-[#101010] border border-white/[0.06]">
            <h3 className="text-[15px] font-semibold text-white mb-3 flex items-center gap-2">
              <Flame size={16} className="text-white" />
              Tarefas Urgentes Pendentes ({urgentTasks.length})
            </h3>

            <div className="flex flex-col gap-2.5">
              {urgentTasks.slice(0, 4).map(({ task, project }) => (
                <div
                  key={task.id}
                  onClick={() => onSelectProject(project)}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#151515] hover:bg-[#1a1a1a] border border-white/[0.05] cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-2 h-2 rounded-full bg-white shadow-[0_0_6px_#ffffff] animate-pulse flex-shrink-0" />
                    <div className="min-w-0">
                      <span className="text-[13px] font-medium text-white truncate block">
                        {task.title}
                      </span>
                      <span className="text-[11px] text-[#737373] truncate block">
                        {project.title} • {task.dueDate || 'Sem prazo'}
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-white/10 text-white border border-white/15 font-mono flex-shrink-0">
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#101010] border border-white/[0.06]">
            <h3 className="text-[15px] font-semibold text-white mb-3 flex items-center gap-2">
              <Star size={16} className="text-white" fill="currentColor" />
              Projetos Favoritados ({starredProjects.length})
            </h3>

            <div className="flex flex-col gap-2.5">
              {starredProjects.map((p) => (
                <div
                  key={p.id}
                  onClick={() => onSelectProject(p)}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#151515] hover:bg-[#1a1a1a] border border-white/[0.05] cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="min-w-0">
                      <span className="text-[13px] font-medium text-white truncate block">
                        {p.title}
                      </span>
                      <span className="text-[11px] text-[#737373] truncate block">
                        {p.category} • {p.client}
                      </span>
                    </div>
                  </div>
                  <ExternalLink size={14} className="text-[#737373] flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
