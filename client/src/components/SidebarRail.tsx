import React from 'react';
import { Home, Layers, PieChart, Sliders, RotateCcw } from 'lucide-react';
import { ValknutLogo } from './ValknutLogo';
import { ActiveNavTab } from '../types';

interface SidebarRailProps {
  activeTab: ActiveNavTab;
  onTabChange: (tab: ActiveNavTab) => void;
  onResetDemo?: () => void;
}

export const SidebarRail: React.FC<SidebarRailProps> = ({ activeTab, onTabChange, onResetDemo }) => {
  return (
    <aside className="w-[64px] min-w-[64px] h-screen bg-[#090909] border-r border-[#1a1a1a] flex flex-col items-center py-4 justify-between z-30 select-none">
      {/* Top Logo */}
      <div className="flex flex-col items-center gap-6">
        <button
          onClick={() => onTabChange('projects')}
          className="group relative flex items-center justify-center p-2 rounded-xl hover:bg-white/[0.06] transition-colors focus:outline-none"
          title="Consig Studio"
        >
          <ValknutLogo size={28} className="text-white group-hover:scale-105 transition-transform" />
          <div className="absolute left-full ml-3 px-2 py-1 bg-[#1a1a1a] border border-white/10 rounded text-[11px] font-medium text-white shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
            Consig Studio
          </div>
        </button>

        {/* Primary Navigation Rail */}
        <nav className="flex flex-col items-center gap-3 w-full px-2 mt-2">
          {/* Dashboard Executivo */}
          <button
            onClick={() => onTabChange('dashboard')}
            className={`group relative flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-200 ${
              activeTab === 'dashboard'
                ? 'bg-[#1c1c1c] text-white shadow-[0_4px_14px_rgba(0,0,0,0.7)] nav-active-pill'
                : 'text-[#737373] hover:text-[#e5e5e5] hover:bg-white/[0.04]'
            }`}
            title="Dashboard Executivo"
          >
            <Home size={19} strokeWidth={activeTab === 'dashboard' ? 2.2 : 1.8} />
            <div className="absolute left-full ml-3 px-2.5 py-1 bg-[#1a1a1a] border border-white/10 rounded-md text-[11px] font-medium text-white shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
              Dashboard
            </div>
          </button>

          {/* Pastas & Trabalhos */}
          <button
            onClick={() => onTabChange('projects')}
            className={`group relative flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-200 ${
              activeTab === 'projects'
                ? 'bg-[#1c1c1c] text-white shadow-[0_4px_14px_rgba(0,0,0,0.7)] nav-active-pill'
                : 'text-[#737373] hover:text-[#e5e5e5] hover:bg-white/[0.04]'
            }`}
            title="Pastas & Trabalhos"
          >
            <Layers size={19} strokeWidth={activeTab === 'projects' ? 2.2 : 1.8} />
            <div className="absolute left-full ml-3 px-2.5 py-1 bg-[#1a1a1a] border border-white/10 rounded-md text-[11px] font-medium text-white shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
              Pastas & Projetos
            </div>
          </button>

          {/* Métricas & Produtividade */}
          <button
            onClick={() => onTabChange('analytics')}
            className={`group relative flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-200 ${
              activeTab === 'analytics'
                ? 'bg-[#1c1c1c] text-white shadow-[0_4px_14px_rgba(0,0,0,0.7)] nav-active-pill'
                : 'text-[#737373] hover:text-[#e5e5e5] hover:bg-white/[0.04]'
            }`}
            title="Métricas & Desempenho"
          >
            <PieChart size={19} strokeWidth={activeTab === 'analytics' ? 2.2 : 1.8} />
            <div className="absolute left-full ml-3 px-2.5 py-1 bg-[#1a1a1a] border border-white/10 rounded-md text-[11px] font-medium text-white shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
              Métricas & Análise
            </div>
          </button>

          {/* Configurações */}
          <button
            onClick={() => onTabChange('settings')}
            className={`group relative flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-200 ${
              activeTab === 'settings'
                ? 'bg-[#1c1c1c] text-white shadow-[0_4px_14px_rgba(0,0,0,0.7)] nav-active-pill'
                : 'text-[#737373] hover:text-[#e5e5e5] hover:bg-white/[0.04]'
            }`}
            title="Configurações"
          >
            <Sliders size={18} strokeWidth={activeTab === 'settings' ? 2.2 : 1.8} />
            <div className="absolute left-full ml-3 px-2.5 py-1 bg-[#1a1a1a] border border-white/10 rounded-md text-[11px] font-medium text-white shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
              Configurações
            </div>
          </button>
        </nav>
      </div>

      {/* Profile & Reset */}
      <div className="flex flex-col items-center gap-3">
        {onResetDemo && (
          <button
            onClick={onResetDemo}
            className="group relative p-2 text-[#737373] hover:text-white transition-colors"
            title="Restaurar dados iniciais"
          >
            <RotateCcw size={15} />
            <div className="absolute left-full ml-3 px-2 py-1 bg-[#1a1a1a] border border-white/10 rounded text-[11px] text-white shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
              Restaurar Dados
            </div>
          </button>
        )}

        <div className="relative group cursor-pointer" title="Gabriel Silva (Consig)">
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
            alt="Usuário"
            className="w-9 h-9 rounded-full object-cover ring-1 ring-white/20 group-hover:ring-white/50 transition-all grayscale contrast-125"
          />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-neutral-200 border-2 border-[#090909] rounded-full" />
        </div>
      </div>
    </aside>
  );
};
