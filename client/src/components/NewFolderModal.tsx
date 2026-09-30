import React, { useState } from 'react';
import { X, FolderPlus } from 'lucide-react';
import { Folder } from '../types';

interface NewFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  folders: Folder[];
  initialParentId?: string | null;
  onCreateFolder: (data: { name: string; parentId?: string | null; color: string; description?: string }) => Promise<void>;
}

const COLOR_SWATCHES = [
  '#f43f5e', // Rosa / Coral
  '#10b981', // Verde Esmeralda
  '#f59e0b', // Âmbar
  '#3b82f6', // Azul
  '#8b5cf6', // Roxo
  '#06b6d4', // Ciano
  '#71717a', // Grafite
];

export const NewFolderModal: React.FC<NewFolderModalProps> = ({
  isOpen,
  onClose,
  folders,
  initialParentId,
  onCreateFolder,
}) => {
  const [name, setName] = useState('');
  const [parentId, setParentId] = useState<string>(initialParentId || '');
  const [color, setColor] = useState('#f43f5e');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      await onCreateFolder({
        name: name.trim(),
        parentId: parentId || null,
        color,
        description: description.trim(),
      });
      setName('');
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
            <FolderPlus size={18} className="text-white" />
            <h3 className="font-semibold text-white text-[15px]">Criar Nova Pasta</h3>
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
              Nome da Pasta *
            </label>
            <input
              type="text"
              placeholder="ex: Design System, Aplicações..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
              className="bg-[#0e0e12] border border-white/10 rounded-xl px-3.5 py-2.5 text-[13px] text-white focus:outline-none focus:border-white/30"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-medium text-[#a1a1aa]">
              Pasta Pai (Hierarquia)
            </label>
            <select
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
              className="bg-[#0e0e12] border border-white/10 rounded-xl px-3.5 py-2.5 text-[13px] text-white focus:outline-none cursor-pointer"
            >
              <option value="">(Nenhuma - Pasta Raiz)</option>
              {folders.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          {/* Cores */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-medium text-[#a1a1aa]">
              Cor de Destaque da Pasta
            </label>
            <div className="flex items-center gap-2.5 pt-1">
              {COLOR_SWATCHES.map((swatch) => (
                <button
                  key={swatch}
                  type="button"
                  onClick={() => setColor(swatch)}
                  className={`w-6 h-6 rounded-full transition-all ${
                    color === swatch
                      ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-[#141419]'
                      : 'hover:scale-110 opacity-70 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: swatch }}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-medium text-[#a1a1aa]">
              Descrição (Opcional)
            </label>
            <textarea
              rows={2}
              placeholder="Finalidade desta pasta..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-[#0e0e12] border border-white/10 rounded-xl px-3.5 py-2.5 text-[13px] text-white focus:outline-none resize-none"
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
              disabled={loading || !name.trim()}
              className="px-5 py-2 rounded-xl text-[13px] font-medium bg-white text-black hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
            >
              {loading ? 'Salvando...' : 'Salvar Pasta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
