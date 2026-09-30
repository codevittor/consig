import React, { useState } from 'react';
import { 
  ChevronDown, 
  Plus, 
  FolderPlus, 
  Search, 
} from 'lucide-react';
import { Folder, Project } from '../types';
import { FolderCard3D } from '../components/FolderCard3D';
import { RecentProjectsTable } from '../components/RecentProjectsTable';

interface ProjectsPageProps {
  folders: Folder[];
  projects: Project[];
  selectedFolderId: string | null;
  onSelectFolder: (folderId: string | null) => void;
  onSelectProject: (project: Project) => void;
  onNewProjectClick: () => void;
  onNewFolderClick: () => void;
  onDeleteProject?: (id: string, e: React.MouseEvent) => void;
}

const CATEGORIES = ['Todas', 'Software', 'Design', 'E-Commerce', 'Pesquisa'];

export const ProjectsPage: React.FC<ProjectsPageProps> = ({
  folders,
  projects,
  selectedFolderId,
  onSelectFolder,
  onSelectProject,
  onNewProjectClick,
  onNewFolderClick,
  onDeleteProject,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [localSearch, setLocalSearch] = useState('');

  const activeFolder = folders.find((f) => f.id === selectedFolderId);

  const displayFolders = selectedFolderId
    ? folders.filter((f) => f.parentId === selectedFolderId)
    : folders.filter((f) => !f.parentId);

  const filteredProjects = projects.filter((p) => {
    if (selectedFolderId) {
      const childIds = folders.filter((f) => f.parentId === selectedFolderId).map((f) => f.id);
      const validFolderIds = [selectedFolderId, ...childIds];
      if (!validFolderIds.includes(p.folderId || '')) return false;
    }

    if (selectedCategory !== 'Todas' && p.category !== selectedCategory) {
      return false;
    }

    if (localSearch.trim()) {
      const q = localSearch.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        (p.author?.email && p.author.email.toLowerCase().includes(q)) ||
        (p.client && p.client.toLowerCase().includes(q))
      );
    }

    return true;
  });

  return (
    <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-[#080808]">
      {/* Top Header Bar with Glassmorphic Gradient */}
      <header className="h-16 px-8 border-b border-white/[0.06] bg-[#0a0a0a]/85 backdrop-blur-xl sticky top-0 z-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative group">
            <button className="flex items-center gap-2 text-white font-medium text-[15px] hover:text-[#d4d4d4] transition-colors focus:outline-none">
              <span className="tracking-tight">{activeFolder ? activeFolder.name : 'Todos os Projetos'}</span>
              <ChevronDown size={14} className="text-[#737373] group-hover:text-white transition-colors" />
            </button>

            {/* Dropdown Menu */}
            <div className="absolute left-0 mt-2 w-60 bg-[#141414] border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] p-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
              <button
                onClick={() => onSelectFolder(null)}
                className={`w-full text-left px-3 py-2 text-[12.5px] rounded-xl transition-colors flex items-center justify-between ${
                  selectedFolderId === null ? 'bg-[#222222] text-white font-medium shadow-xs' : 'text-[#a3a3a3] hover:text-white hover:bg-white/5'
                }`}
              >
                <span>Todos os Projetos</span>
                <span className="font-mono text-[10.5px] text-[#737373]">{projects.length}</span>
              </button>

              <div className="h-[1px] bg-white/5 my-1" />

              {folders.map((f) => (
                <button
                  key={f.id}
                  onClick={() => onSelectFolder(f.id)}
                  className={`w-full text-left px-3 py-1.5 text-[12px] rounded-xl transition-colors flex items-center justify-between ${
                    selectedFolderId === f.id ? 'bg-[#222222] text-white font-medium shadow-xs' : 'text-[#a3a3a3] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="truncate">{f.name}</span>
                  <span className="font-mono text-[10.5px] text-[#737373]">{f.itemCount || 0}</span>
                </button>
              ))}
            </div>
          </div>

          <span className="px-2 py-0.5 rounded-full text-[11px] font-mono bg-[#141414] text-[#858585] border border-white/5">
            {filteredProjects.length} {filteredProjects.length === 1 ? 'projeto' : 'projetos'}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onNewFolderClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-medium text-[#a3a3a3] hover:text-white bg-[#141414] hover:bg-[#1a1a1a] border border-white/5 hover:border-white/10 transition-all shadow-xs"
            title="Criar Pasta"
          >
            <FolderPlus size={14} />
            <span className="hidden sm:inline">Nova Pasta</span>
          </button>

          <button
            onClick={onNewProjectClick}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-[12.5px] font-medium bg-white text-black hover:bg-neutral-200 transition-all shadow-[0_4px_14px_rgba(255,255,255,0.12)]"
            title="Cadastrar Novo Projeto"
          >
            <Plus size={15} strokeWidth={2.5} />
            <span>Novo Projeto</span>
          </button>
        </div>
      </header>

      {/* Main Content Body */}
      <div className="p-8 max-w-7xl mx-auto w-full flex flex-col gap-9">
        {/* Seção 1: Pastas 3D Fosco */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <h2 className="text-[17px] font-semibold text-white tracking-tight">
                {selectedFolderId && activeFolder
                  ? `Subpastas em "${activeFolder.name}"`
                  : 'Pastas Principais'}
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-mono bg-[#141414] text-[#858585] border border-white/5">
                {displayFolders.length}
              </span>
            </div>

            {selectedFolderId && (
              <button
                onClick={() => onSelectFolder(null)}
                className="text-[12px] text-[#737373] hover:text-white transition-colors"
              >
                ← Ver todas as pastas raiz
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {displayFolders.map((folder) => (
              <FolderCard3D
                key={folder.id}
                folder={folder}
                isSelected={selectedFolderId === folder.id}
                onClick={() => onSelectFolder(folder.id)}
              />
            ))}

            <div
              onClick={onNewFolderClick}
              className="flex flex-col items-center justify-center p-4 rounded-2xl border border-dashed border-white/10 hover:border-white/20 bg-[#101010]/50 hover:bg-[#141414] cursor-pointer transition-all duration-300 group min-h-[192px]"
            >
              <div className="w-12 h-12 rounded-xl bg-[#171717] border border-white/5 flex items-center justify-center text-[#737373] group-hover:text-white group-hover:scale-110 transition-all mb-3 shadow-xs">
                <FolderPlus size={20} />
              </div>
              <span className="text-[13px] font-medium text-[#737373] group-hover:text-white transition-colors">
                Nova Pasta
              </span>
              <span className="text-[11px] text-[#525252] mt-0.5 font-normal">Criar pasta</span>
            </div>
          </div>
        </section>

        {/* Seção 2: Tabela de Trabalhos Recentes */}
        <section className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <h2 className="text-[17px] font-semibold text-white tracking-tight">
                {selectedFolderId && activeFolder
                  ? `Projetos em "${activeFolder.name}"`
                  : 'Trabalhos Recentes'}
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-mono bg-[#141414] text-[#858585] border border-white/5">
                {filteredProjects.length}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden lg:flex items-center p-0.5 bg-[#121212] border border-white/5 rounded-xl">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 text-[11.5px] font-medium rounded-lg transition-all ${
                      selectedCategory === cat
                        ? 'bg-[#222222] text-white shadow-xs'
                        : 'text-[#737373] hover:text-[#d4d4d4]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="relative">
                <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#737373]" />
                <input
                  type="text"
                  placeholder="Filtrar projetos..."
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  className="w-48 bg-[#121212] border border-white/5 rounded-xl pl-8 pr-3 py-1.5 text-[12px] text-white focus:outline-none focus:border-white/20 placeholder:text-[#525252] shadow-inner"
                />
              </div>
            </div>
          </div>

          <RecentProjectsTable
            projects={filteredProjects}
            onSelectProject={onSelectProject}
            onDeleteProject={onDeleteProject}
          />
        </section>
      </div>
    </div>
  );
};
