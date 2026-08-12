import React from 'react';

export const Card: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({ children, className = '', onClick }) => (
  <div
    onClick={onClick}
    className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-xl p-4 sm:p-5 shadow-xs transition-all ${onClick ? 'cursor-pointer hover:border-slate-300 dark:hover:border-slate-700' : ''} ${className}`}
  >
    {children}
  </div>
);

export const Badge: React.FC<{ children: React.ReactNode; variant?: 'emerald' | 'amber' | 'blue' | 'slate' | 'red'; className?: string }> = ({
  children,
  variant = 'slate',
  className = ''
}) => {
  const styles = {
    emerald: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50',
    amber: 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/50',
    blue: 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800/50',
    slate: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    red: 'bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800/50',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
};

export const Avatar: React.FC<{ src?: string; name: string; size?: 'sm' | 'md' | 'lg' | 'xl'; className?: string }> = ({
  src,
  name,
  size = 'md',
  className = ''
}) => {
  const sizeMap = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return src ? (
    <img
      src={src}
      alt={name}
      className={`rounded-full object-cover border border-slate-200 dark:border-slate-700 ${sizeMap[size]} ${className}`}
    />
  ) : (
    <div className={`rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center border border-emerald-600 ${sizeMap[size]} ${className}`}>
      {initials}
    </div>
  );
};
