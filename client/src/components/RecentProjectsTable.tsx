import React from 'react';
import { 
  FileText, 
  Figma, 
  FileCode, 
  Archive, 
  File, 
  Trash2,
  FolderOpen,
  ExternalLink
} from 'lucide-react';
import { Project, ProjectStatus } from '../types';

interface RecentProjectsTableProps {
  projects: Project[];
  onSelectProject?: (project: Project) => void;
  onDeleteProject?: (id: string, e: React.MouseEvent) => void;
  onUpdateStatus?: (id: string, newStatus: ProjectStatus) => void;
}

export const RecentProjectsTable: React.FC<RecentProjectsTableProps> = ({
  projects,
  onSelectProject,
  onDeleteProject,
  onUpdateStatus,
}) => {
  const getFileIcon = (ext: string) => {
    switch (ext.toLowerCase()) {
      case 'pdf':
        return <FileText size={16} className="text-white" />;
      case 'fig':
        return <Figma size={16} className="text-[#e5e5e5]" />;
      case 'ts':
      case 'tsx':
      case 'js':
        return <FileCode size={16} className="text-[#d4d4d4]" />;
      case 'zip':
      case 'rar':
        return <Archive size={16} className="text-[#a3a3a3]" />;
      default:
        return <File size={16} className="text-[#737373]" />;
    }
  };

  const getStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case 'Concluído':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white/[0.08] text-white border border-white/20 shadow-[0_0_8px_rgba(255,255,255,0.1)]">
            <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_#ffffff]" />
            Concluído
          </span>
        );
      case 'Em Andamento':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white/[0.04] text-[#d4d4d4] border border-white/10 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e5e5e5] animate-pulse" />
            Em Andamento
          </span>
        );
      case 'Em Revisão':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white/[0.03] text-[#a3a3a3] border border-white/10">
            <span className="w-1.5 h-1.5 rounded-full bg-[#a3a3a3]" />
            Em Revisão
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white/[0.02] text-[#737373] border border-white/5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#737373]" />
            {status}
          </span>
        );
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
    } catch {
      return 'Recente';
    }
  };

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-14 text-center bg-[#101010] border border-white/[0.05] rounded-2xl">
        <FolderOpen size={36} className="text-[#525252] mb-3 opacity-60" />
        <h3 className="text-white font-medium text-[15px]">Nenhum projeto encontrado nesta pasta</h3>
        <p className="text-[#737373] text-[13px] mt-1 max-w-sm">
          Clique no botão "+ Novo Projeto" acima para cadastrar seu primeiro trabalho nesta pasta.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0f0f0f] shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-[#1c1c1c] text-[11px] font-semibold tracking-wider text-[#737373] uppercase bg-[#121212]/90 select-none">
            <th className="py-3.5 px-4 font-medium">Arquivo / Projeto</th>
            <th className="py-3.5 px-4 font-medium">Autor</th>
            <th className="py-3.5 px-4 font-medium">Categoria</th>
            <th className="py-3.5 px-4 font-medium">Status</th>
            <th className="py-3.5 px-4 font-medium text-right">Data & Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#181818] text-[13px]">
          {projects.map((project) => (
            <tr
              key={project.id}
              onClick={() => onSelectProject && onSelectProject(project)}
              className={`group hover:bg-[#151515] transition-colors ${onSelectProject ? 'cursor-pointer' : ''}`}
            >
              {/* Arquivo / Projeto */}
              <td className="py-3.5 px-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#181818] border border-white/[0.07] flex items-center justify-center group-hover:scale-105 transition-transform flex-shrink-0 shadow-xs">
                    {getFileIcon(project.fileExtension)}
                  </div>
                  <div className="min-w-0">
                    <span className="font-medium text-[#f5f5f5] group-hover:text-white transition-colors truncate block">
                      {project.title}
                    </span>
                    <span className="text-[11px] text-[#737373] block truncate">
                      {project.fileSize} {project.client ? `• ${project.client}` : ''}
                    </span>
                  </div>
                </div>
              </td>

              {/* Autor */}
              <td className="py-3.5 px-4 whitespace-nowrap">
                <div className="flex items-center gap-2.5">
                  <img
                    src={project.author.avatar}
                    alt={project.author.name}
                    className="w-6 h-6 rounded-full object-cover ring-1 ring-white/10 grayscale contrast-125"
                  />
                  <span className="text-[#a3a3a3] font-mono text-[12px] group-hover:text-[#d4d4d4] transition-colors">
                    {project.author.email}
                  </span>
                </div>
              </td>

              {/* Categoria */}
              <td className="py-3.5 px-4 whitespace-nowrap">
                <span className="inline-block px-2.5 py-0.5 text-[11px] font-medium rounded-full bg-white/[0.05] border border-white/10 text-[#d4d4d4]">
                  {project.category}
                </span>
              </td>

              {/* Status com seletor rápido */}
              <td className="py-3.5 px-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                {onUpdateStatus ? (
                  <select
                    value={project.status}
                    onChange={(e) => onUpdateStatus(project.id, e.target.value as ProjectStatus)}
                    className="bg-[#171717] text-[11px] text-[#f5f5f5] border border-white/10 rounded-lg px-2 py-1 focus:outline-none cursor-pointer hover:border-white/20 transition-colors"
                  >
                    <option value="Em Andamento">Em Andamento</option>
                    <option value="Concluído">Concluído</option>
                    <option value="Em Revisão">Em Revisão</option>
                    <option value="Pausado">Pausado</option>
                  </select>
                ) : (
                  getStatusBadge(project.status)
                )}
              </td>

              {/* Data & Ações */}
              <td className="py-3.5 px-4 text-right whitespace-nowrap">
                <div className="inline-flex items-center gap-3">
                  <span className="text-[12px] text-[#737373] font-mono">
                    {formatDate(project.updatedAt)}
                  </span>

                  {onSelectProject && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProject(project);
                      }}
                      className="p-1.5 rounded-lg text-[#737373] hover:text-white hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100"
                      title="Abrir Detalhes"
                    >
                      <ExternalLink size={14} />
                    </button>
                  )}

                  {onDeleteProject && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteProject(project.id, e);
                      }}
                      className="p-1.5 rounded-lg text-[#737373] hover:text-white hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100"
                      title="Excluir Projeto"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
