import React from 'react';
import { Folder } from '../types';

interface FolderCard3DProps {
  folder: Folder;
  isSelected?: boolean;
  onClick?: () => void;
}

export const FolderCard3D: React.FC<FolderCard3DProps> = ({ folder, isSelected, onClick }) => {
  const count = folder.itemCount ?? folder.directCount ?? 0;
  const label = count === 1 ? '1 item' : `${count} itens`;

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick && onClick()}
      className={`group relative flex flex-col items-center justify-between p-4 rounded-2xl cursor-pointer select-none transition-all duration-300 ${
        isSelected
          ? 'bg-[#181818] ring-1 ring-white/30 shadow-[0_16px_36px_rgba(0,0,0,0.9)]'
          : 'bg-[#111111] hover:bg-[#161616] border border-white/[0.06] hover:border-white/[0.16] hover:shadow-[0_16px_38px_rgba(0,0,0,0.8)]'
      }`}
      style={{ minHeight: '192px' }}
    >
      {/* 3D Realistic Neutral Dark Folder */}
      <div className="relative w-full h-28 flex items-center justify-center pt-2">
        {/* Soft neutral white/silver back-glow */}
        <div
          className="absolute inset-2 rounded-2xl opacity-0 group-hover:opacity-15 transition-opacity duration-500 blur-xl pointer-events-none bg-white"
        />

        {/* 3D Folder Body Container */}
        <div className="relative w-[148px] h-[98px] folder-3d-card">
          {/* Back folder body (Neutral charcoal) */}
          <div className="absolute inset-0 bg-[#1e1e1e] rounded-[14px] overflow-hidden shadow-inner border border-white/[0.08]">
            {/* Top-left tab shape with gentle curve */}
            <div className="absolute -top-1 left-2 w-16 h-5 bg-[#282828] rounded-t-lg transform -skew-x-6 border-t border-l border-white/[0.12]" />
          </div>

          {/* Document Sheet 1 (Pure crisp white paper peeking from inside) */}
          <div className="absolute top-1 left-4 right-4 h-14 bg-gradient-to-b from-[#ffffff] to-[#e5e5e5] rounded-t-lg shadow-md transform -rotate-1 group-hover:-translate-y-2 transition-transform duration-300 ease-out">
            <div className="w-10 h-[2px] bg-neutral-300 rounded-full mt-2.5 ml-2.5" />
            <div className="w-16 h-[2px] bg-neutral-200 rounded-full mt-1.5 ml-2.5" />
          </div>

          {/* Document Sheet 2 (Secondary angled neutral silver sheet) */}
          <div className="absolute top-2.5 left-5 right-5 h-12 bg-gradient-to-b from-[#e5e5e5] to-[#a3a3a3] rounded-t-lg shadow transform rotate-1 group-hover:-translate-y-1.5 transition-transform duration-300 ease-out opacity-95" />

          {/* Front Frosted Dark Glass Flap (Neutral smoked glass) */}
          <div className="absolute bottom-0 left-0 right-0 h-[74px] rounded-[13px] bg-gradient-to-b from-[#262626]/90 to-[#101010]/98 backdrop-blur-md border border-white/[0.14] shadow-[0_10px_24px_rgba(0,0,0,0.8)] flex flex-col justify-between p-2.5 overflow-hidden">
            {/* Top specular reflection hairline */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />

            {/* Subtle inner top shadow */}
            <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-black/25 to-transparent pointer-events-none" />

            {/* Embossed Watermark in neutral white */}
            <div className="pt-2 text-center">
              <span className="font-mono text-[11px] font-semibold tracking-[0.22em] text-white/30 group-hover:text-white/60 transition-colors uppercase pointer-events-none">
                CONSIG
              </span>
            </div>

            {/* Neutral dot indicator */}
            <div className="flex justify-center items-center pb-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-white/40 group-hover:bg-white/80 transition-colors" />
            </div>
          </div>
        </div>
      </div>

      {/* Folder Details */}
      <div className="w-full text-center mt-3 z-10">
        <h4 className="text-[13.5px] font-medium text-[#f5f5f5] tracking-tight group-hover:text-white transition-colors truncate">
          {folder.name}
        </h4>
        <p className="text-[12px] text-[#737373] group-hover:text-[#a3a3a3] transition-colors mt-0.5 font-normal">
          {label}
        </p>
      </div>
    </div>
  );
};
