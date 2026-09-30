import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Star, 
  Calendar, 
  User, 
  Tag, 
  Trash2, 
  Flame, 
} from 'lucide-react';
import { Project, ProjectStatus, KanbanColumnId, TaskPriority, Resource } from '../types';
import { KanbanBoard } from '../components/KanbanBoard';
import { ProjectNotes } from '../components/ProjectNotes';
import { ProjectResources } from '../components/ProjectResources';
import { ProjectTimeline } from '../components/ProjectTimeline';

interface ProjectDetailPageProps {
  project: Project;
  onBack: () => void;
  onUpdateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  onDeleteProject: (id: string) => Promise<void>;
  onAddTask: (projectId: string, task: { title: string; column: KanbanColumnId; priority: TaskPriority }) => Promise<void>;
  onUpdateTask: (projectId: string, taskId: string, updates: any) => Promise<void>;
  onDeleteTask: (projectId: string, taskId: string) => Promise<void>;
}

export const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({
  project,
  onBack,
  onUpdateProject,
  onDeleteProject,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'kanban' | 'timeline'>('overview');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleStatusChange = (status: ProjectStatus) => {
    onUpdateProject(project.id, { status });
  };

  const handleNotesSave = (notes: string) => {
    return onUpdateProject(project.id, { notes });
  };

  const handleAddResource = (newRes: Omit<Resource, 'id'>) => {
    const updatedResources = [
      ...(project.resources || []),
      { ...newRes, id: 'r-' + Date.now() },
    ];
    onUpdateProject(project.id, { resources: updatedResources });
  };

  const handleDeleteResource = (resourceId: string) => {
    const updatedResources = (project.resources || []).filter((r) => r.id !== resourceId);
    onUpdateProject(project.id, { resources: updatedResources });
  };

  const handleDeleteSelf = async () => {
    if (confirm(`Tem certeza que deseja excluir "${project.title}"?`)) {
      setIsDeleting(true);
      await onDeleteProject(project.id);
      onBack();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-[#09090b]">
      {/* Top Header */}
      <header className="h-16 px-8 border-b border-[#1c1c22] bg-[#0c0c0f]/80 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[13px] text-[#a1a1aa] hover:text-white transition-colors px-2.5 py-1.5 rounded-lg hover:bg-white/5"
          >
            <ArrowLeft size={16} />
            <span>Voltar aos Trabalhos</span>
          </button>

          <div className="h-4 w-[1px] bg-white/10" />

          <div className="flex items-center gap-2">
            <h1 className="text-[17px] font-semibold text-white tracking-tight">
              {project.title}
            </h1>
            <span className="px-2 py-0.5 text-[11px] font-mono rounded bg-white/5 text-[#8e8e99] border border-white/5 uppercase">
              {project.fileExtension}
            </span>
          </div>
        </div>

        {/* Top Right Actions */}
        <div className="flex items-center gap-3">
          <select
            value={project.status}
            onChange={(e) => handleStatusChange(e.target.value as ProjectStatus)}
            className="bg-[#141419] border border-white/10 text-[12px] font-medium text-white rounded-xl px-3 py-1.5 focus:outline-none cursor-pointer"
          >
            <option value="Em Andamento">Em Andamento</option>
            <option value="Em Revisão">Em Revisão</option>
            <option value="Concluído">Concluído</option>
            <option value="Planejado">Planejado</option>
            <option value="Pausado">Pausado</option>
          </select>

          <button
            onClick={() => onUpdateProject(project.id, { starred: !project.starred })}
            className={`p-2 rounded-xl border border-white/5 transition-colors ${
              project.starred ? 'bg-amber-500/10 text-amber-400' : 'text-[#71717a] hover:text-white bg-[#141419]'
            }`}
            title="Favoritar Projeto"
          >
            <Star size={15} fill={project.starred ? 'currentColor' : 'none'} />
          </button>

          <button
            onClick={handleDeleteSelf}
            disabled={isDeleting}
            className="p-2 rounded-xl text-[#71717a] hover:text-rose-400 bg-[#141419] border border-white/5 hover:bg-rose-500/10 transition-colors"
            title="Excluir Projeto"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </header>

      {/* Project Metadata Banner */}
      <div className="px-8 py-5 border-b border-[#18181e] bg-[#0e0e12]/60 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-6 text-[13px] text-[#a1a1aa]">
          <div className="flex items-center gap-2">
            <User size={14} className="text-[#71717a]" />
            <span>Cliente / Finalidade:</span>
            <span className="text-white font-medium">{project.client}</span>
          </div>

          <div className="flex items-center gap-2">
            <Tag size={14} className="text-[#71717a]" />
            <span>Categoria:</span>
            <span className="text-emerald-400 font-medium">{project.category}</span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-[#71717a]" />
            <span>Prazo:</span>
            <span className="font-mono text-white">{project.dueDate}</span>
          </div>

          <div className="flex items-center gap-2">
            <Flame size={14} className="text-rose-400" />
            <span>Prioridade:</span>
            <span className="text-white font-medium">{project.priority}</span>
          </div>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="p-0.5 bg-[#141419] border border-white/5 rounded-xl flex items-center">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-1.5 text-[12px] font-medium rounded-lg transition-all ${
              activeTab === 'overview'
                ? 'bg-[#22222a] text-white shadow-xs'
                : 'text-[#71717a] hover:text-[#d4d4d8]'
            }`}
          >
            Quadro Geral & Notas
          </button>
          <button
            onClick={() => setActiveTab('kanban')}
            className={`px-4 py-1.5 text-[12px] font-medium rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'kanban'
                ? 'bg-[#22222a] text-white shadow-xs'
                : 'text-[#71717a] hover:text-[#d4d4d8]'
            }`}
          >
            Kanban de Tarefas
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/10 font-mono">
              {(project.tasks || []).length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-4 py-1.5 text-[12px] font-medium rounded-lg transition-all ${
              activeTab === 'timeline'
                ? 'bg-[#22222a] text-white shadow-xs'
                : 'text-[#71717a] hover:text-[#d4d4d8]'
            }`}
          >
            Histórico & Atividade
          </button>
        </div>
      </div>

      {/* Main Tab Content Area */}
      <div className="p-8 max-w-7xl mx-auto w-full flex-1">
        {activeTab === 'overview' && (
          <div className="flex flex-col gap-6">
            {project.description && (
              <div className="p-4 rounded-xl bg-[#121216] border border-white/[0.05] text-[13px] text-[#a1a1aa] leading-relaxed">
                <span className="text-white font-medium mr-2">Resumo Executivo:</span>
                {project.description}
              </div>
            )}

            <section className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <h3 className="text-[15px] font-semibold text-white tracking-tight">
                  Bloco de Notas & Diretrizes do Projeto (Markdown)
                </h3>
                <span className="text-[11px] text-[#71717a]">
                  Checklists clicáveis • Títulos • Códigos
                </span>
              </div>
              <ProjectNotes
                initialNotes={project.notes}
                onSaveNotes={handleNotesSave}
              />
            </section>

            <section className="mt-2">
              <ProjectResources
                resources={project.resources || []}
                onAddResource={handleAddResource}
                onDeleteResource={handleDeleteResource}
              />
            </section>
          </div>
        )}

        {activeTab === 'kanban' && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[16px] font-semibold text-white tracking-tight">
                  Quadro de Tarefas & Entregáveis
                </h3>
                <p className="text-[12px] text-[#71717a] mt-0.5">
                  Arraste e avance tarefas entre os estágios do fluxo de trabalho.
                </p>
              </div>
            </div>

            <KanbanBoard
              tasks={project.tasks || []}
              onAddTask={(column, title, priority) =>
                onAddTask(project.id, { column, title, priority })
              }
              onUpdateTaskColumn={(taskId, newColumn) =>
                onUpdateTask(project.id, taskId, { column: newColumn })
              }
              onToggleTaskComplete={(taskId, current) =>
                onUpdateTask(project.id, taskId, { completed: !current, column: !current ? 'done' : 'todo' })
              }
              onDeleteTask={(taskId) => onDeleteTask(project.id, taskId)}
            />
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="flex flex-col gap-4 max-w-2xl">
            <ProjectTimeline timeline={project.timeline || []} />
          </div>
        )}
      </div>
    </div>
  );
};
