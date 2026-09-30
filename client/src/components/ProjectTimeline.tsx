import React from 'react';
import { Clock, User } from 'lucide-react';
import { TimelineItem } from '../types';

interface ProjectTimelineProps {
  timeline: TimelineItem[];
}

export const ProjectTimeline: React.FC<ProjectTimelineProps> = ({ timeline }) => {
  if (!timeline || timeline.length === 0) {
    return (
      <div className="p-8 text-center bg-[#121216] border border-white/[0.04] rounded-2xl text-[#71717a] text-[13px]">
        Nenhuma atividade recente registrada neste projeto.
      </div>
    );
  }

  return (
    <div className="p-5 rounded-2xl bg-[#121216] border border-white/[0.06]">
      <h4 className="text-[14px] font-medium text-white mb-4 flex items-center gap-2">
        <Clock size={16} className="text-[#a1a1aa]" />
        Histórico de Atividades & Auditoria
      </h4>

      <div className="relative pl-6 flex flex-col gap-5">
        <div className="absolute left-[11px] top-2 bottom-2 w-[1.5px] bg-[#22222a]" />

        {timeline.map((item) => (
          <div key={item.id} className="relative flex flex-col gap-1">
            <div className="absolute -left-[19px] top-1 w-3 h-3 rounded-full bg-[#1b1b22] border-2 border-white/40 shadow-xs" />

            <div className="flex items-center justify-between">
              <span className="text-[13px] font-medium text-[#f4f4f5]">
                {item.action}
              </span>
              <span className="text-[11px] font-mono text-[#71717a]">
                {item.timestamp}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-[#8e8e99]">
              <User size={11} />
              <span>{item.user}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
