import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  ChevronRight, 
  ChevronDown, 
  Folder as FolderIcon, 
  FolderOpen, 
  Layers,
  Trash2,
  FolderPlus
} from 'lucide-react';
import { Folder } from '../types';

interface FolderTreeSidebarProps {
  folders: Folder[];
  selectedFolderId: string | null;
  onSelectFolder: (folderId: string | null) => void;
  onNewFolderClick: () => void;
  onDeleteFolder?: (folderId: string, e: React.MouseEvent) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const FolderTreeSidebar: React.FC<FolderTreeSidebarProps> = ({
  folders,
  selectedFolderId,
  onSelectFolder,
  onNewFolderClick,
  onDeleteFolder,
  searchQuery,
  onSearchChange,
}) => {
  const [activeTab, setActiveTab] = useState<'folders' | 'categories'>('folders');
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    portfolio: true,
    software: true,
  });

  const toggleExpand = (folderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };

  const rootFolders = folders.filter(f => !f.parentId);
  const getChildren = (parentId: string) => folders.filter(f => f.parentId === parentId);

  const renderFolderNode = (folder: Folder, depth = 0) => {
    const children = getChildren(folder.id);
    const hasChildren = children.length > 0;
    const isExpanded = !!expandedFolders[folder.id];
    const isSelected = selectedFolderId === folder.id;

    return (
      <div key={folder.id} className="flex flex-col">
        <div
          onClick={() => onSelectFolder(folder.id)}
          className={`group flex items-center justify-between px-2.5 py-1.5 rounded-lg cursor-pointer text-[13px] transition-all duration-150 select-none ${
            isSelected
              ? 'bg-[#222222] text-white font-medium shadow-xs border border-white/[0.08]'
              : 'text-[#a3a3a3] hover:text-[#ffffff] hover:bg-white/[0.04]'
          }`}
          style={{ paddingLeft: `${depth * 14 + 10}px` }}
        >
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {hasChildren ? (
              <button
                onClick={(e) => toggleExpand(folder.id, e)}
                className="w-4 h-4 flex items-center justify-center text-[#737373] hover:text-white transition-colors"
              >
                {isExpanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
              </button>
            ) : (
              <span className="w-4 h-4 flex items-center justify-center opacity-40">
                <span className="w-1 h-1 rounded-full bg-neutral-600" />
              </span>
            )}

            {isExpanded && hasChildren ? (
              <FolderOpen size={15} className={isSelected ? 'text-white' : 'text-[#858585]'} />
            ) : (
              <FolderIcon size={15} className={isSelected ? 'text-white' : 'text-[#858585]'} />
            )}

            <span className="truncate">{folder.name}</span>
          </div>

          <div className="flex items-center gap-1.5">
            {onDeleteFolder && depth > 0 && (
              <button
                onClick={(e) => onDeleteFolder(folder.id, e)}
                className="opacity-0 group-hover:opacity-100 p-1 text-[#737373] hover:text-white transition-opacity"
                title="Excluir Pasta"
              >
                <Trash2 size={12} />
              </button>
            )}

            {(folder.itemCount !== undefined && folder.itemCount > 0) && (
              <span
                className={`px-1.5 py-0.5 min-w-[20px] text-center text-[11px] font-mono rounded-full ${
                  isSelected
                    ? 'bg-white/20 text-white'
                    : 'bg-[#1c1c1c] text-[#858585] group-hover:bg-[#262626] group-hover:text-[#d4d4d4]'
                }`}
              >
                {folder.itemCount}
              </span>
            )}
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="flex flex-col relative">
            <div
              className="absolute left-[18px] top-1 bottom-1 w-[1px] bg-white/[0.06] pointer-events-none"
              style={{ left: `${depth * 14 + 17}px` }}
            />
            {children.map(child => renderFolderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const categories = [
    { name: 'Software', count: 3 },
    { name: 'Design', count: 2 },
    { name: 'E-Commerce', count: 1 },
    { name: 'Pesquisa', count: 1 },
  ];

  return (
    <aside className="w-[272px] min-w-[272px] h-screen bg-[#0d0d0d] border-r border-[#1a1a1a] flex flex-col justify-between select-none">
      <div className="flex flex-col">
        {/* Workspace Title & Add Folder */}
        <div className="h-16 px-4 border-b border-[#1a1a1a] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-medium text-[14px] text-white tracking-tight flex items-center gap-2">
              Consig Studio
              <span className="px-1.5 py-0.2 text-[9.5px] bg-white/10 text-white border border-white/20 rounded font-mono font-medium">
                PRO
              </span>
            </span>
          </div>

          <button
            onClick={onNewFolderClick}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[12px] text-[#a3a3a3] hover:text-white bg-[#141414] hover:bg-[#1f1f1f] border border-white/5 transition-all"
            title="Criar Nova Pasta"
          >
            <FolderPlus size={14} />
            <span className="text-[11px] font-medium">Pasta</span>
          </button>
        </div>

        {/* Search Input Bar */}
        <div className="px-3 pt-3.5">
          <div className="flex items-center gap-2 w-full px-3 py-1.5 bg-[#141414] border border-white/[0.06] rounded-xl text-[13px] text-[#737373] focus-within:text-white focus-within:border-white/20 transition-all shadow-inner">
            <Search size={13} className="text-[#737373] flex-shrink-0" />
            <input
              type="text"
              placeholder="Buscar pastas ou arquivos..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="bg-transparent text-[12px] text-white focus:outline-none w-full placeholder:text-[#525252]"
            />
            <kbd className="px-1.5 py-0.5 text-[9.5px] font-mono bg-[#1c1c1c] text-[#737373] rounded border border-white/5 flex-shrink-0">
              Ctrl+K
            </kbd>
          </div>
        </div>

        {/* Segmented Pill Switcher */}
        <div className="px-3 pt-3">
          <div className="p-0.5 bg-[#141414] border border-white/[0.04] rounded-lg flex items-center">
            <button
              onClick={() => setActiveTab('folders')}
              className={`flex-1 py-1 text-[11.5px] font-medium rounded-md transition-all text-center ${
                activeTab === 'folders'
                  ? 'bg-[#222222] text-white shadow-xs'
                  : 'text-[#737373] hover:text-[#d4d4d4]'
              }`}
            >
              Pastas
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`flex-1 py-1 text-[11.5px] font-medium rounded-md transition-all text-center ${
                activeTab === 'categories'
                  ? 'bg-[#222222] text-white shadow-xs'
                  : 'text-[#737373] hover:text-[#d4d4d4]'
              }`}
            >
              Categorias
            </button>
          </div>
        </div>

        {/* Hierarchical Folder Tree */}
        <div className="px-2 pt-3 pb-4 overflow-y-auto max-h-[calc(100vh-220px)] flex flex-col gap-0.5">
          {activeTab === 'folders' ? (
            <>
              <div
                onClick={() => onSelectFolder(null)}
                className={`flex items-center justify-between px-3 py-1.5 rounded-lg cursor-pointer text-[13px] transition-all select-none ${
                  selectedFolderId === null
                    ? 'bg-[#222222] text-white font-medium border border-white/[0.08]'
                    : 'text-[#a3a3a3] hover:text-[#ffffff] hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Layers size={15} className={selectedFolderId === null ? 'text-white' : 'text-[#858585]'} />
                  <span>Todos os Projetos</span>
                </div>
                <span className="px-1.5 py-0.5 text-[11px] font-mono rounded-full bg-[#1c1c1c] text-[#858585]">
                  {folders.reduce((acc, f) => acc + (f.directCount || 0), 0) || 6}
                </span>
              </div>

              {rootFolders.map(folder => renderFolderNode(folder, 0))}
            </>
          ) : (
            <div className="flex flex-col gap-1 px-1">
              <span className="text-[10.5px] uppercase tracking-wider text-[#525252] px-2 py-1 font-semibold">
                Categorias Principais
              </span>
              {categories.map(cat => (
                <div
                  key={cat.name}
                  onClick={() => onSelectFolder(null)}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-white/[0.05] cursor-pointer text-[13px] text-[#a3a3a3] hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-neutral-400" />
                    <span>{cat.name}</span>
                  </div>
                  <span className="px-1.5 py-0.5 text-[11px] font-mono rounded-full bg-[#1c1c1c] text-[#858585]">
                    {cat.count}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Status */}
      <div className="p-3 border-t border-[#1a1a1a] bg-[#080808] flex items-center justify-between text-[11px] text-[#737373]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-neutral-300 animate-pulse" />
          <span>Localhost Sincronizado</span>
        </div>
        <span className="font-mono text-[10px] text-[#525252]">v1.4</span>
      </div>
    </aside>
  );
};
