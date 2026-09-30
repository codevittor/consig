import React, { useState } from 'react';
import { 
  ExternalLink, 
  Plus, 
  Trash2, 
  Figma, 
  Github, 
  FileText, 
  Globe, 
  Link as LinkIcon 
} from 'lucide-react';
import { Resource } from '../types';

interface ProjectResourcesProps {
  resources: Resource[];
  onAddResource: (resource: Omit<Resource, 'id'>) => void;
  onDeleteResource: (resourceId: string) => void;
}

export const ProjectResources: React.FC<ProjectResourcesProps> = ({
  resources,
  onAddResource,
  onDeleteResource,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [type, setType] = useState<Resource['type']>('github');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;

    onAddResource({
      title: title.trim(),
      url: url.trim().startsWith('http') ? url.trim() : `https://${url.trim()}`,
      type,
    });

    setTitle('');
    setUrl('');
    setShowAddForm(false);
  };

  const getResourceIcon = (type: Resource['type']) => {
    switch (type) {
      case 'figma':
        return <Figma size={16} className="text-purple-400" />;
      case 'github':
        return <Github size={16} className="text-white" />;
      case 'docs':
        return <FileText size={16} className="text-blue-400" />;
      case 'live':
        return <Globe size={16} className="text-emerald-400" />;
      default:
        return <LinkIcon size={16} className="text-amber-400" />;
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h4 className="text-[13px] font-medium text-white flex items-center gap-2">
          Recursos & Links Úteis
          <span className="text-[11px] font-mono text-[#71717a]">({resources.length})</span>
        </h4>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 text-[12px] text-[#a1a1aa] hover:text-white px-2.5 py-1 rounded-lg bg-[#18181f] hover:bg-[#202028] border border-white/5 transition-colors"
        >
          <Plus size={13} />
          Adicionar Link
        </button>
      </div>

      {showAddForm && (
        <form
          onSubmit={handleSubmit}
          className="p-3.5 rounded-xl bg-[#16161c] border border-white/10 flex flex-col gap-3"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input
              type="text"
              placeholder="Nome do link (ex: Figma Protótipo)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-[#101014] text-[12px] text-white border border-white/10 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-white/30"
              required
            />
            <input
              type="text"
              placeholder="URL (ex: https://...)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="bg-[#101014] text-[12px] text-white border border-white/10 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-white/30"
              required
            />
            <select
              value={type}
              onChange={(e) => setType(e.target.value as Resource['type'])}
              className="bg-[#101014] text-[12px] text-white border border-white/10 rounded-lg px-2 py-1.5 focus:outline-none"
            >
              <option value="figma">Figma</option>
              <option value="github">GitHub</option>
              <option value="docs">Documentação</option>
              <option value="live">Produção / Live</option>
              <option value="other">Outro</option>
            </select>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-[11px] text-[#71717a] hover:text-white px-3 py-1"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="text-[11px] bg-white text-black font-medium px-3 py-1 rounded-lg hover:bg-neutral-200 transition-colors"
            >
              Salvar
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {resources.map((res) => (
          <div
            key={res.id}
            className="group relative flex items-center justify-between p-3 rounded-xl bg-[#141418] hover:bg-[#18181f] border border-white/[0.05] hover:border-white/[0.12] transition-all"
          >
            <a
              href={res.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 min-w-0 flex-1"
            >
              <div className="w-8 h-8 rounded-lg bg-[#1c1c24] flex items-center justify-center flex-shrink-0">
                {getResourceIcon(res.type)}
              </div>
              <div className="min-w-0">
                <span className="text-[13px] font-medium text-white group-hover:text-cyan-400 transition-colors truncate block">
                  {res.title}
                </span>
                <span className="text-[11px] text-[#71717a] font-mono truncate block">
                  {res.url.replace(/^https?:\/\//, '')}
                </span>
              </div>
            </a>

            <div className="flex items-center gap-1 ml-2">
              <a
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 text-[#71717a] hover:text-white rounded-md hover:bg-white/5 transition-colors"
              >
                <ExternalLink size={13} />
              </a>
              <button
                onClick={() => onDeleteResource(res.id)}
                className="p-1.5 text-[#71717a] hover:text-rose-400 rounded-md hover:bg-white/5 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
