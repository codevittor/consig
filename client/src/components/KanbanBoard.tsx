import React, { useState } from 'react';
import { 
  Plus, 
  Calendar, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  ArrowLeft,
  Flame,
} from 'lucide-react';
import { Task, KanbanColumnId, TaskPriority } from '../types';

interface KanbanBoardProps {
  tasks: Task[];
  onAddTask: (column: KanbanColumnId, title: string, priority: TaskPriority) => void;
  onUpdateTaskColumn: (taskId: string, newColumn: KanbanColumnId) => void;
  onToggleTaskComplete: (taskId: string, currentStatus: boolean) => void;
  onDeleteTask: (taskId: string) => void;
}

const COLUMNS: { id: KanbanColumnId; title: string; color: string }[] = [
  { id: 'todo', title: 'A Fazer', color: '#71717a' },
  { id: 'in_progress', title: 'Em Andamento', color: '#3b82f6' },
  { id: 'review', title: 'Em Revisão', color: '#f59e0b' },
  { id: 'done', title: 'Concluído', color: '#10b981' },
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  onAddTask,
  onUpdateTaskColumn,
  onToggleTaskComplete,
  onDeleteTask,
}) => {
  const [quickAddColumn, setQuickAddColumn] = useState<KanbanColumnId | null>(null);
  const [quickAddTitle, setQuickAddTitle] = useState('');
  const [quickAddPriority, setQuickAddPriority] = useState<TaskPriority>('medium');

  const handleCreateTask = (colId: KanbanColumnId) => {
    if (!quickAddTitle.trim()) return;
    onAddTask(colId, quickAddTitle.trim(), quickAddPriority);
    setQuickAddTitle('');
    setQuickAddColumn(null);
  };

  const getPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case 'urgent':
        return (
          <span className="flex items-center gap-1 text-[10px] font-medium text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
            <Flame size={11} className="text-rose-400 animate-pulse" />
            Urgente
          </span>
        );
      case 'high':
        return (
          <span className="text-[10px] font-medium text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
            Alta
          </span>
        );
      case 'medium':
        return (
          <span className="text-[10px] font-medium text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
            Média
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-medium text-neutral-400 bg-neutral-500/10 px-2 py-0.5 rounded border border-neutral-500/20">
            Baixa
          </span>
        );
    }
  };

  const getNextColumn = (col: KanbanColumnId): KanbanColumnId | null => {
    if (col === 'todo') return 'in_progress';
    if (col === 'in_progress') return 'review';
    if (col === 'review') return 'done';
    return null;
  };

  const getPrevColumn = (col: KanbanColumnId): KanbanColumnId | null => {
    if (col === 'done') return 'review';
    if (col === 'review') return 'in_progress';
    if (col === 'in_progress') return 'todo';
    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 w-full">
      {COLUMNS.map((col) => {
        const colTasks = tasks.filter((t) => t.column === col.id);

        return (
          <div
            key={col.id}
            className="flex flex-col rounded-2xl bg-[#121216] border border-white/[0.05] p-3.5 shadow-md min-h-[460px]"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#1f1f26] mb-3">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: col.color }}
                />
                <h4 className="text-[13px] font-medium text-white">{col.title}</h4>
                <span className="px-1.5 py-0.5 text-[11px] font-mono rounded-full bg-[#1e1e24] text-[#8e8e99]">
                  {colTasks.length}
                </span>
              </div>

              <button
                onClick={() => setQuickAddColumn(col.id)}
                className="w-6 h-6 rounded-md flex items-center justify-center text-[#71717a] hover:text-white hover:bg-white/[0.08] transition-colors"
                title="Adicionar Tarefa"
              >
                <Plus size={15} />
              </button>
            </div>

            {/* Quick Add Input Field */}
            {quickAddColumn === col.id && (
              <div className="p-3 mb-3 bg-[#18181f] border border-white/10 rounded-xl flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="Nome da tarefa..."
                  value={quickAddTitle}
                  onChange={(e) => setQuickAddTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateTask(col.id)}
                  autoFocus
                  className="w-full bg-[#111114] border border-white/10 rounded-lg px-2.5 py-1.5 text-[12px] text-white focus:outline-none focus:border-white/30"
                />

                <div className="flex items-center justify-between">
                  <select
                    value={quickAddPriority}
                    onChange={(e) => setQuickAddPriority(e.target.value as TaskPriority)}
                    className="bg-[#111114] text-[11px] text-[#a1a1aa] border border-white/10 rounded px-2 py-1 focus:outline-none"
                  >
                    <option value="low">Baixa</option>
                    <option value="medium">Média</option>
                    <option value="high">Alta</option>
                    <option value="urgent">Urgente</option>
                  </select>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setQuickAddColumn(null)}
                      className="text-[11px] text-[#71717a] hover:text-white px-2 py-1"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => handleCreateTask(col.id)}
                      className="text-[11px] bg-white text-black font-medium px-2.5 py-1 rounded hover:bg-neutral-200 transition-colors"
                    >
                      Salvar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Task Cards List */}
            <div className="flex flex-col gap-2.5 overflow-y-auto flex-1">
              {colTasks.length === 0 && quickAddColumn !== col.id && (
                <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed border-white/[0.05] rounded-xl flex-1">
                  <span className="text-[12px] text-[#52525b]">Vazio</span>
                </div>
              )}

              {colTasks.map((task) => (
                <div
                  key={task.id}
                  className="group relative flex flex-col p-3 rounded-xl bg-[#17171c] hover:bg-[#1b1b22] border border-white/[0.05] hover:border-white/[0.12] transition-all shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-start gap-2 flex-1">
                      <button
                        onClick={() => onToggleTaskComplete(task.id, task.completed)}
                        className="mt-0.5 text-[#71717a] hover:text-emerald-400 transition-colors"
                        title={task.completed ? 'Marcar como pendente' : 'Marcar como concluído'}
                      >
                        {task.completed ? (
                          <CheckCircle2 size={15} className="text-emerald-400" />
                        ) : (
                          <Circle size={15} />
                        )}
                      </button>
                      <span
                        className={`text-[13px] font-medium leading-snug break-words ${
                          task.completed ? 'line-through text-[#71717a]' : 'text-[#f4f4f5]'
                        }`}
                      >
                        {task.title}
                      </span>
                    </div>

                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="opacity-0 group-hover:opacity-100 text-[#71717a] hover:text-red-400 p-1 transition-all"
                      title="Excluir Tarefa"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                  {task.description && (
                    <p className="text-[11px] text-[#8e8e99] mb-2 line-clamp-2">
                      {task.description}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                    {getPriorityBadge(task.priority)}

                    {(task.tags || []).map((tag: string, i: number) => (
                      <span
                        key={i}
                        className="text-[10px] text-[#a1a1aa] bg-white/[0.04] px-1.5 py-0.5 rounded border border-white/[0.04]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/[0.04] text-[11px] text-[#71717a]">
                    <div className="flex items-center gap-1">
                      {task.dueDate && (
                        <span className="flex items-center gap-1 font-mono text-[10px]">
                          <Calendar size={11} />
                          {task.dueDate}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      {getPrevColumn(col.id) && (
                        <button
                          onClick={() => onUpdateTaskColumn(task.id, getPrevColumn(col.id)!)}
                          className="p-1 rounded bg-[#202028] hover:bg-[#2a2a35] text-[#a1a1aa] hover:text-white transition-colors"
                          title="Mover para coluna anterior"
                        >
                          <ArrowLeft size={11} />
                        </button>
                      )}
                      {getNextColumn(col.id) && (
                        <button
                          onClick={() => onUpdateTaskColumn(task.id, getNextColumn(col.id)!)}
                          className="p-1 rounded bg-[#202028] hover:bg-[#2a2a35] text-[#a1a1aa] hover:text-white transition-colors"
                          title="Mover para próxima coluna"
                        >
                          <ArrowRight size={11} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
