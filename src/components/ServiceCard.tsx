// src/components/ServiceCard.tsx
import React from 'react';

type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>> | React.ComponentType<any>;

interface Props {
  icon?: IconType; // React component (svg icon)
  title: string;
  description: string;
  onClick?: () => void;
  className?: string;
}

export default function ServiceCard({
  icon: Icon,
  title,
  description,
  onClick,
  className = '',
}: Props) {
  // support keyboard activation (Enter / Space)
  const handleKeyDown: React.KeyboardEventHandler<HTMLButtonElement> = (e) => {
    if (!onClick) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={`text-left bg-gradient-to-b from-[#061226]/70 to-[#07152a]/60 backdrop-blur-sm border border-white/6 rounded-xl p-6 shadow-[0_8px_30px_-10px_rgba(2,12,45,0.6)] hover:shadow-[0_18px_50px_-20px_rgba(2,90,255,0.14)] transition transform hover:-translate-y-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-400 ${className}`}
      aria-label={title}
    >
      <div className="flex items-center gap-4 mb-2">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#06243e] to-[#03263d] border border-blue-600/8 flex items-center justify-center">
          {Icon ? <Icon className="w-6 h-6 text-cyan-300" aria-hidden="true" /> : null}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
      </div>
      <p className="text-sm text-slate-300">{description}</p>
    </button>
  );
}
