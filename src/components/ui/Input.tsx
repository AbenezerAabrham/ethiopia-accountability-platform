import React from 'react';
import { Search } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, error, leftIcon, className = '', ...props }) => (
  <div className="w-full space-y-1">
    {label && (
      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
        {label}
      </label>
    )}
    <div className="relative flex items-center">
      {leftIcon && <div className="absolute left-3 text-slate-400">{leftIcon}</div>}
      <input
        className={`w-full rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/40 border-slate-300 dark:border-slate-800 ${
          leftIcon ? 'pl-9' : ''
        } ${error ? 'border-red-500 dark:border-red-500' : ''} ${className}`}
        {...props}
      />
    </div>
    {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
  </div>
);

export const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; error?: string }> = ({
  label,
  error,
  className = '',
  ...props
}) => (
  <div className="w-full space-y-1">
    {label && (
      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
        {label}
      </label>
    )}
    <textarea
      className={`w-full rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-3 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/40 border-slate-300 dark:border-slate-800 ${
        error ? 'border-red-500' : ''
      } ${className}`}
      {...props}
    />
    {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
  </div>
);

export const SearchInput: React.FC<InputProps> = (props) => (
  <Input leftIcon={<Search className="w-4 h-4" />} placeholder="Search..." {...props} />
);
