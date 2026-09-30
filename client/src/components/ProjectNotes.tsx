import React, { useState, useEffect } from 'react';
import { 
  Edit3, 
  Eye, 
  Save, 
  CheckSquare, 
  Code, 
  Heading, 
  Check, 
} from 'lucide-react';

interface ProjectNotesProps {
  initialNotes: string;
  onSaveNotes: (notes: string) => Promise<void> | void;
}

export const ProjectNotes: React.FC<ProjectNotesProps> = ({ initialNotes, onSaveNotes }) => {
  const [content, setContent] = useState(initialNotes || '');
  const [viewMode, setViewMode] = useState<'preview' | 'edit'>('preview');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'dirty'>('saved');

  useEffect(() => {
    setContent(initialNotes || '');
    setSaveStatus('saved');
  }, [initialNotes]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setSaveStatus('dirty');
  };

  const handleManualSave = async () => {
    setIsSaving(true);
    setSaveStatus('saving');
    try {
      await onSaveNotes(content);
      setSaveStatus('saved');
    } catch {
      setSaveStatus('dirty');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleChecklist = (lineIndex: number, currentChecked: boolean) => {
    const lines = content.split('\n');
    if (lines[lineIndex]) {
      if (currentChecked) {
        lines[lineIndex] = lines[lineIndex].replace('- [x]', '- [ ]');
      } else {
        lines[lineIndex] = lines[lineIndex].replace('- [ ]', '- [x]');
      }
      const newContent = lines.join('\n');
      setContent(newContent);
      onSaveNotes(newContent);
    }
  };

  const insertSnippet = (snippet: string) => {
    setContent(prev => prev + '\n' + snippet);
    setSaveStatus('dirty');
  };

  const renderFormattedMarkdown = (text: string) => {
    const lines = text.split('\n');
    let inCodeBlock = false;
    let codeBlockContent: string[] = [];

    const elements: React.ReactNode[] = [];

    lines.forEach((line, index) => {
      if (line.trim().startsWith('```')) {
        if (inCodeBlock) {
          elements.push(
            <pre
              key={`code-${index}`}
              className="p-3 my-2 rounded-xl bg-[#09090c] border border-white/10 font-mono text-[12px] text-emerald-400 overflow-x-auto"
            >
              <code>{codeBlockContent.join('\n')}</code>
            </pre>
          );
          codeBlockContent = [];
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        codeBlockContent.push(line);
        return;
      }

      if (line.startsWith('# ')) {
        elements.push(
          <h1 key={index} className="text-xl font-bold text-white mt-4 mb-2 pb-1 border-b border-white/10">
            {line.replace('# ', '')}
          </h1>
        );
        return;
      }
      if (line.startsWith('## ')) {
        elements.push(
          <h2 key={index} className="text-lg font-semibold text-white mt-3 mb-1.5">
            {line.replace('## ', '')}
          </h2>
        );
        return;
      }
      if (line.startsWith('### ')) {
        elements.push(
          <h3 key={index} className="text-[14px] font-semibold text-[#e4e4e7] mt-3 mb-1">
            {line.replace('### ', '')}
          </h3>
        );
        return;
      }

      if (line.trim().startsWith('- [ ]') || line.trim().startsWith('- [x]')) {
        const isChecked = line.trim().startsWith('- [x]');
        const label = line.replace(/- \[[ x]\] /, '');

        elements.push(
          <div
            key={index}
            onClick={() => handleToggleChecklist(index, isChecked)}
            className="flex items-center gap-2.5 py-1 text-[13px] cursor-pointer group select-none"
          >
            <span
              className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                isChecked
                  ? 'bg-emerald-500 border-emerald-500 text-black'
                  : 'border-white/20 group-hover:border-white/40 bg-white/[0.02]'
              }`}
            >
              {isChecked && <Check size={12} strokeWidth={3} />}
            </span>
            <span className={isChecked ? 'line-through text-[#71717a]' : 'text-[#f4f4f5]'}>
              {label}
            </span>
          </div>
        );
        return;
      }

      if (line.startsWith('> ')) {
        elements.push(
          <blockquote
            key={index}
            className="my-2 pl-3 border-l-2 border-amber-500/80 text-[13px] italic text-[#d4d4d8] bg-amber-500/[0.04] py-1 rounded-r-lg"
          >
            {line.replace('> ', '')}
          </blockquote>
        );
        return;
      }

      if (line.startsWith('- ')) {
        elements.push(
          <li key={index} className="ml-4 list-disc text-[13px] text-[#d4d4d8] my-0.5">
            {line.replace('- ', '')}
          </li>
        );
        return;
      }

      if (!line.trim()) {
        elements.push(<div key={index} className="h-2" />);
        return;
      }

      elements.push(
        <p key={index} className="text-[13px] text-[#a1a1aa] leading-relaxed my-0.5">
          {line}
        </p>
      );
    });

    return elements;
  };

  return (
    <div className="flex flex-col rounded-2xl bg-[#121216] border border-white/[0.06] overflow-hidden shadow-lg">
      <div className="h-12 px-4 bg-[#16161c] border-b border-[#22222a] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-0.5 bg-[#0e0e11] rounded-lg border border-white/5 flex items-center">
            <button
              onClick={() => setViewMode('preview')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[12px] font-medium transition-all ${
                viewMode === 'preview'
                  ? 'bg-[#22222a] text-white shadow-xs'
                  : 'text-[#71717a] hover:text-[#d4d4d8]'
              }`}
            >
              <Eye size={13} />
              Visualização
            </button>
            <button
              onClick={() => setViewMode('edit')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[12px] font-medium transition-all ${
                viewMode === 'edit'
                  ? 'bg-[#22222a] text-white shadow-xs'
                  : 'text-[#71717a] hover:text-[#d4d4d8]'
              }`}
            >
              <Edit3 size={13} />
              Markdown
            </button>
          </div>

          {viewMode === 'edit' && (
            <div className="hidden sm:flex items-center gap-1 ml-2">
              <button
                onClick={() => insertSnippet('### Novo Tópico\n- Detalhe')}
                className="p-1.5 rounded hover:bg-white/5 text-[#71717a] hover:text-white text-[11px]"
                title="Inserir Título"
              >
                <Heading size={14} />
              </button>
              <button
                onClick={() => insertSnippet('- [ ] Nova tarefa no checklist')}
                className="p-1.5 rounded hover:bg-white/5 text-[#71717a] hover:text-white text-[11px]"
                title="Inserir Checklist"
              >
                <CheckSquare size={14} />
              </button>
              <button
                onClick={() => insertSnippet('```typescript\n// código\n```')}
                className="p-1.5 rounded hover:bg-white/5 text-[#71717a] hover:text-white text-[11px]"
                title="Inserir Código"
              >
                <Code size={14} />
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] text-[#71717a] font-mono">
            {saveStatus === 'saved' && 'Salvo localmente ✓'}
            {saveStatus === 'saving' && 'Salvando...'}
            {saveStatus === 'dirty' && 'Alterações pendentes'}
          </span>

          <button
            onClick={handleManualSave}
            disabled={isSaving || saveStatus === 'saved'}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium bg-white text-black hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <Save size={13} />
            Salvar
          </button>
        </div>
      </div>

      <div className="p-5 min-h-[380px] max-h-[600px] overflow-y-auto">
        {viewMode === 'edit' ? (
          <textarea
            value={content}
            onChange={handleChange}
            placeholder="Escreva anotações em Markdown, checklists (- [ ]), ou blocos de código..."
            className="w-full h-[360px] bg-transparent font-mono text-[13px] text-[#e4e4e7] focus:outline-none resize-none leading-relaxed placeholder:text-[#52525b]"
          />
        ) : (
          <div className="prose prose-invert max-w-none">
            {content.trim() ? (
              renderFormattedMarkdown(content)
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-center text-[#52525b]">
                <Edit3 size={32} className="mb-2 opacity-40" />
                <p className="text-[13px]">Nenhuma anotação neste projeto ainda.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
