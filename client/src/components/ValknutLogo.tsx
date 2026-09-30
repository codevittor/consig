import React from 'react';

interface ValknutLogoProps {
  className?: string;
  size?: number;
}

export const ValknutLogo: React.FC<ValknutLogoProps> = ({ className = "text-white", size = 28 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Precision geometric interlocking triangles (Valknut / InStudy symbol) */}
      <polygon
        points="50,5 95,85 5,85"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
        strokeLinejoin="round"
        opacity="0.9"
      />
      <polygon
        points="30,40 70,40 50,75"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
        strokeLinejoin="round"
        opacity="0.75"
      />
      <polygon
        points="50,22 78,72 22,72"
        stroke="currentColor"
        strokeWidth="3.5"
        fill="none"
        strokeLinejoin="round"
        opacity="0.6"
      />
    </svg>
  );
};
