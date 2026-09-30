import React, { useState, useEffect, useRef } from 'react';
import { Search, Folder as FolderIcon, FileText, ArrowRight, Plus } from 'lucide-react';
import { Folder, Project } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  folders: Folder[];
  onSelectProject: (project: Project) => void;
  onSelectFolder: (folderId: string) => void;
  onNewProject: () => void;
  onNewFolder: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  projects,
  folders,
  onSelectProject,
  onSelectFolder,
  onNewProject,
  onNewFolder,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredProjects = projects.filter((p) =>
    p.title.toLowerCase().includes(query.toLowerCase()) ||
    p.category.toLowerCase().includes(query.toLowerCase()) ||
    (p.client && p.client.toLowerCase().includes(query.toLowerCase()))
  );

  const filteredFolders = folders.filter((f) =>
    f.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-[#141419] border border-white/10 rounded-2xl shadow-[0_30px_70px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col"
      >
        <div className="h-14 px-4 border-b border-[#22222a] flex items-center gap-3 bg-[#16161c]">
          <Search size={18} className="text-[#71717a]" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Digite para buscar projetos, pastas ou comandos..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-[14px] text-white focus:outline-none placeholder:text-[#52525b]"
          />
          <kbd className="px-2 py-0.5 text-[11px] font-mono bg-[#22222a] text-[#8e8e99] rounded border border-white/5">
            ESC
          </kbd>
        </div>

        <div className="max-h-[380px] overflow-y-auto p-2 flex flex-col gap-1">
          <div className="px-3 py-1.5 text-[11px] uppercase tracking-wider text-[#63636e] font-semibold">
            Ações Rápidas
          </div>
          <button
            onClick={() => {
              onClose();
              onNewProject();
            }}
            className="flex items-center justify-between px-3 py-2 rounded-xl text-[13px] text-[#a1a1aa] hover:text-white hover:bg-white/[0.06] transition-colors group text-left"
          >
            <div className="flex items-center gap-2.5">
              <Plus size={15} className="text-emerald-400" />
              <span>Criar Novo Projeto</span>
            </div>
            <ArrowRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>

          <button
            onClick={() => {
              onClose();
              onNewFolder();
            }}
            className="flex items-center justify-between px-3 py-2 rounded-xl text-[13px] text-[#a1a1aa] hover:text-white hover:bg-white/[0.06] transition-colors group text-left"
          >
            <div className="flex items-center gap-2.5">
              <Plus size={15} className="text-rose-400" />
              <span>Criar Nova Pasta</span>
            </div>
            <ArrowRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>

          {filteredFolders.length > 0 && (
            <>
              <div className="px-3 pt-3 pb-1 text-[11px] uppercase tracking-wider text-[#63636e] font-semibold">
                Pastas ({filteredFolders.length})
              </div>
              {filteredFolders.map((f) => (
                <button
                  key={f.id}
                  onClick={() => {
                    onSelectFolder(f.id);
                    onClose();
                  }}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-[13px] text-[#a1a1aa] hover:text-white hover:bg-white/[0.06] transition-colors text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <FolderIcon size={15} style={{ color: f.color || '#fff' }} />
                    <span>{f.name}</span>
                  </div>
                  <span className="text-[11px] font-mono text-[#71717a]">
                    {f.itemCount || 0} itens
                  </span>
                </button>
              ))}
            </>
          )}

          {filteredProjects.length > 0 && (
            <>
              <div className="px-3 pt-3 pb-1 text-[11px] uppercase tracking-wider text-[#63636e] font-semibold">
                Projetos & Arquivos ({filteredProjects.length})
              </div>
              {filteredProjects.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    onSelectProject(p);
                    onClose();
                  }}
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-[13px] text-[#a1a1aa] hover:text-white hover:bg-white/[0.06] transition-colors text-left group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText size={15} className="text-white/60 flex-shrink-0" />
                    <span className="truncate group-hover:text-white">{p.title}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 border border-white/5 text-[#8e8e99] flex-shrink-0">
                      {p.category}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#71717a] font-mono flex-shrink-0">
                    {p.status}
                  </span>
                </button>
              ))}
            </>
          )}

          {filteredProjects.length === 0 && filteredFolders.length === 0 && (
            <div className="p-8 text-center text-[#71717a] text-[13px]">
              Nenhum resultado para "{query}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
