import React from 'react';
import { Award } from 'lucide-react';
import { Project, WorkspaceData } from '../types';

interface AnalyticsPageProps {
  projects: Project[];
  workspaceData: WorkspaceData | null;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ projects }) => {
  const categoryCounts: Record<string, number> = {};
  projects.forEach((p) => {
    categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
  });

  const statusCounts: Record<string, number> = {
    'Concluído': 0,
    'Em Andamento': 0,
    'Em Revisão': 0,
    'Pausado': 0,
  };
  projects.forEach((p) => {
    if (statusCounts[p.status] !== undefined) {
      statusCounts[p.status]++;
    }
  });

  let totalTasks = 0;
  let doneTasks = 0;
  projects.forEach((p) => {
    (p.tasks || []).forEach((t) => {
      totalTasks++;
      if (t.completed || t.column === 'done') doneTasks++;
    });
  });

  return (
    <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-[#09090b]">
      <header className="h-16 px-8 border-b border-[#1c1c22] bg-[#0c0c0f]/80 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-[17px] font-semibold text-white tracking-tight">
            Métricas de Desempenho & Analytics
          </h1>
          <span className="px-2 py-0.5 text-[11px] font-mono rounded bg-white/5 text-[#8e8e99]">
            Consig Engine
          </span>
        </div>
      </header>

      <div className="p-8 max-w-7xl mx-auto w-full flex flex-col gap-8">
        <div className="p-6 rounded-2xl bg-gradient-to-r from-[#171720] via-[#121216] to-[#171720] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <Award size={28} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Velocidade de Execução Alta</h3>
              <p className="text-[13px] text-[#a1a1aa] mt-0.5">
                Você concluiu {doneTasks} tarefas com taxa de sucesso de {totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 75}%.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-center">
            <div className="px-4 py-2 bg-[#1b1b22] rounded-xl border border-white/5">
              <div className="text-xl font-bold font-mono text-emerald-400">98.4%</div>
              <div className="text-[10px] text-[#71717a] uppercase">Pontualidade</div>
            </div>
            <div className="px-4 py-2 bg-[#1b1b22] rounded-xl border border-white/5">
              <div className="text-xl font-bold font-mono text-cyan-400">4.8h</div>
              <div className="text-[10px] text-[#71717a] uppercase">Foco Diário</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-[#121216] border border-white/[0.06]">
            <h3 className="text-[15px] font-semibold text-white mb-4">
              Distribuição por Categoria
            </h3>

            <div className="flex flex-col gap-3">
              {Object.entries(categoryCounts).map(([cat, count]) => {
                const pct = projects.length > 0 ? Math.round((count / projects.length) * 100) : 0;
                return (
                  <div key={cat} className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-[12px]">
                      <span className="text-[#d4d4d8] font-medium">{cat}</span>
                      <span className="text-[#8e8e99] font-mono">{count} ({pct}%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#1e1e24] overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#121216] border border-white/[0.06]">
            <h3 className="text-[15px] font-semibold text-white mb-4">
              Status dos Trabalhos
            </h3>

            <div className="flex flex-col gap-3">
              {Object.entries(statusCounts).map(([st, count]) => {
                const pct = projects.length > 0 ? Math.round((count / projects.length) * 100) : 0;
                return (
                  <div key={st} className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-[12px]">
                      <span className="text-[#d4d4d8] font-medium">{st}</span>
                      <span className="text-[#8e8e99] font-mono">{count} ({pct}%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#1e1e24] overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
