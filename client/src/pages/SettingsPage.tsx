import React, { useState } from 'react';
import { 
  RotateCcw, 
  Download, 
  HardDrive, 
  Keyboard, 
  User, 
  Check
} from 'lucide-react';
import { WorkspaceData, Project, Folder } from '../types';

interface SettingsPageProps {
  workspaceData: WorkspaceData | null;
  projects: Project[];
  folders: Folder[];
  onResetDatabase: () => Promise<void>;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  workspaceData,
  projects,
  folders,
  onResetDatabase,
}) => {
  const [resetting, setResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleReset = async () => {
    if (confirm('Deseja realmente restaurar os dados de demonstração originais?')) {
      setResetting(true);
      try {
        await onResetDatabase();
        setResetSuccess(true);
        setTimeout(() => setResetSuccess(false), 3000);
      } catch (err) {
        console.error(err);
      } finally {
        setResetting(false);
      }
    }
  };

  const handleExportJSON = () => {
    const backup = {
      workspace: workspaceData?.workspace,
      folders,
      projects,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `consig-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-[#09090b]">
      <header className="h-16 px-8 border-b border-[#1c1c22] bg-[#0c0c0f]/80 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-[17px] font-semibold text-white tracking-tight">
            Configurações do Workspace & Dados
          </h1>
          <span className="px-2 py-0.5 text-[11px] font-mono rounded bg-white/5 text-[#8e8e99]">
            Localhost Engine
          </span>
        </div>
      </header>

      <div className="p-8 max-w-4xl mx-auto w-full flex flex-col gap-8">
        <div className="p-6 rounded-2xl bg-[#121216] border border-white/[0.06] flex flex-col gap-4">
          <h3 className="text-[15px] font-semibold text-white flex items-center gap-2">
            <User size={16} className="text-[#a1a1aa]" />
            Perfil do Workspace
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px]">
            <div className="flex flex-col gap-1 p-3 rounded-xl bg-[#17171d] border border-white/5">
              <span className="text-[#71717a]">Nome do Workspace</span>
              <span className="text-white font-medium">{workspaceData?.workspace.name || 'Consig Studio'}</span>
            </div>

            <div className="flex flex-col gap-1 p-3 rounded-xl bg-[#17171d] border border-white/5">
              <span className="text-[#71717a]">Responsável</span>
              <span className="text-white font-medium">{workspaceData?.workspace.owner || 'Gabriel Silva'}</span>
            </div>

            <div className="flex flex-col gap-1 p-3 rounded-xl bg-[#17171d] border border-white/5">
              <span className="text-[#71717a]">E-mail</span>
              <span className="text-white font-mono">{workspaceData?.workspace.email || 'gabriel@consig.com.br'}</span>
            </div>

            <div className="flex flex-col gap-1 p-3 rounded-xl bg-[#17171d] border border-white/5">
              <span className="text-[#71717a]">Armazenamento</span>
              <span className="text-emerald-400 font-medium">Local JSON (Privado / Seguro)</span>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#121216] border border-white/[0.06] flex flex-col gap-4">
          <h3 className="text-[15px] font-semibold text-white flex items-center gap-2">
            <HardDrive size={16} className="text-[#a1a1aa]" />
            Persistência & Backup Local
          </h3>

          <p className="text-[13px] text-[#a1a1aa] leading-relaxed">
            Seus arquivos, notas em markdown, quadros Kanban e pastas ficam gravados no arquivo{' '}
            <code className="px-2 py-0.5 rounded bg-[#1e1e24] text-white font-mono text-[12px]">
              data/database.json
            </code>{' '}
            na máquina local.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={handleExportJSON}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-medium bg-[#1a1a22] hover:bg-[#22222c] border border-white/10 text-white transition-all shadow-sm"
            >
              <Download size={15} />
              Exportar Backup JSON
            </button>

            <button
              onClick={handleReset}
              disabled={resetting}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-medium bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-all shadow-sm"
            >
              <RotateCcw size={15} />
              {resetting ? 'Restaurando...' : 'Restaurar Dados Iniciais'}
            </button>

            {resetSuccess && (
              <span className="text-emerald-400 text-[12px] flex items-center gap-1 font-mono">
                <Check size={14} /> Dados restaurados com sucesso!
              </span>
            )}
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#121216] border border-white/[0.06] flex flex-col gap-4">
          <h3 className="text-[15px] font-semibold text-white flex items-center gap-2">
            <Keyboard size={16} className="text-[#a1a1aa]" />
            Atalhos do Teclado
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[13px]">
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#17171d] border border-white/5">
              <span className="text-[#a1a1aa]">Busca Rápida e Comandos</span>
              <kbd className="px-2 py-0.5 rounded bg-[#22222a] text-white font-mono text-[11px] border border-white/10">
                Ctrl + K
              </kbd>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#17171d] border border-white/5">
              <span className="text-[#a1a1aa]">Fechar Modais e Paleta</span>
              <kbd className="px-2 py-0.5 rounded bg-[#22222a] text-white font-mono text-[11px] border border-white/10">
                ESC
              </kbd>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
