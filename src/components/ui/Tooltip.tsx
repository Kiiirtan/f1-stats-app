import { type ReactNode } from 'react';

interface Props {
  text: string;
  children: ReactNode;
  position?: 'top' | 'bottom';
}

export default function Tooltip({ text, children, position = 'top' }: Props) {
  const positionClasses = position === 'top'
    ? 'bottom-full left-1/2 -translate-x-1/2 mb-2'
    : 'top-full left-1/2 -translate-x-1/2 mt-2';

  const arrowClasses = position === 'top'
    ? 'top-full left-1/2 -translate-x-1/2 border-t-c-30'
    : 'bottom-full left-1/2 -translate-x-1/2 border-b-c-30';

  return (
    <div className="relative group/tooltip inline-flex">
      {children}
      <div
        className={`absolute ${positionClasses} px-3 py-1.5 bg-c-30 text-t-main text-xs font-label tracking-wider uppercase rounded-sm whitespace-nowrap opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 pointer-events-none z-50 shadow-lg border border-c-10/10`}
      >
        {text}
        <div
          className={`absolute ${arrowClasses} w-0 h-0 border-4 border-transparent`}
        />
      </div>
    </div>
  );
}
