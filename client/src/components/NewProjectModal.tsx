import React, { useState } from 'react';
import { X, FilePlus } from 'lucide-react';
import { Folder, Project } from '../types';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  folders: Folder[];
  initialFolderId?: string | null;
  onCreateProject: (projectData: Partial<Project>) => Promise<void>;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({
  isOpen,
  onClose,
  folders,
  initialFolderId,
  onCreateProject,
}) => {
  const [title, setTitle] = useState('');
  const [folderId, setFolderId] = useState(initialFolderId || (folders[0]?.id || ''));
  const [category, setCategory] = useState('Software');
  const [status, setStatus] = useState<Project['status']>('Em Andamento');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      await onCreateProject({
        title: title.trim(),
        folderId: folderId || null,
        category,
        status,
        description: description.trim(),
      });
      setTitle('');
      setDescription('');
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#141419] border border-white/10 rounded-2xl shadow-[0_25px_50px_rgba(0,0,0,0.8)] overflow-hidden">
        {/* Cabeçalho */}
        <div className="h-14 px-6 border-b border-[#22222a] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FilePlus size={18} className="text-white" />
            <h3 className="font-semibold text-white text-[15px]">Novo Projeto</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#71717a] hover:text-white hover:bg-white/5 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-medium text-[#a1a1aa]">
              Nome do Arquivo / Título do Projeto *
            </label>
            <input
              type="text"
              placeholder="ex: app-dashboard.tsx ou proposta-design.pdf"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
              className="bg-[#0e0e12] border border-white/10 rounded-xl px-3.5 py-2.5 text-[13px] text-white focus:outline-none focus:border-white/30"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-medium text-[#a1a1aa]">
                Pasta Destino
              </label>
              <select
                value={folderId || ''}
                onChange={(e) => setFolderId(e.target.value)}
                className="bg-[#0e0e12] border border-white/10 rounded-xl px-3.5 py-2.5 text-[13px] text-white focus:outline-none cursor-pointer"
              >
                <option value="">(Raiz - Sem Pasta)</option>
                {folders.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-medium text-[#a1a1aa]">
                Categoria
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-[#0e0e12] border border-white/10 rounded-xl px-3.5 py-2.5 text-[13px] text-white focus:outline-none cursor-pointer"
              >
                <option value="Software">Software</option>
                <option value="Design">Design</option>
                <option value="E-Commerce">E-Commerce</option>
                <option value="Geral">Geral</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-medium text-[#a1a1aa]">
              Status Inicial
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Project['status'])}
              className="bg-[#0e0e12] border border-white/10 rounded-xl px-3.5 py-2.5 text-[13px] text-white focus:outline-none cursor-pointer"
            >
              <option value="Em Andamento">Em Andamento</option>
              <option value="Concluído">Concluído</option>
              <option value="Em Revisão">Em Revisão</option>
              <option value="Pausado">Pausado</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-medium text-[#a1a1aa]">
              Descrição Breve (Opcional)
            </label>
            <textarea
              rows={2}
              placeholder="Finalidade ou detalhes do trabalho..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-[#0e0e12] border border-white/10 rounded-xl px-3.5 py-2.5 text-[13px] text-white focus:outline-none focus:border-white/30 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 mt-2 pt-4 border-t border-[#202028]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-[13px] text-[#71717a] hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !title.trim()}
              className="px-5 py-2 rounded-xl text-[13px] font-medium bg-white text-black hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
            >
              {loading ? 'Salvando...' : 'Criar Projeto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
