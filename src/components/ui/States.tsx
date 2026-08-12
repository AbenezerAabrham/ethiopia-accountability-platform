import React from 'react';
import { AlertTriangle, Inbox, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export const Skeleton: React.FC<{ className?: string }> = ({ className = 'h-4 w-full' }) => (
  <div className={`bg-slate-200 dark:bg-slate-800 rounded animate-pulse ${className}`} />
);

export const EmptyState: React.FC<{
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}> = ({ title, description, actionLabel, onAction, icon }) => (
  <div className="flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-xl my-4">
    <div className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-full mb-3">
      {icon || <Inbox className="w-8 h-8" />}
    </div>
    <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1">{title}</h3>
    <p className="text-sm text-slate-500 max-w-md mb-4">{description}</p>
    {actionLabel && onAction && (
      <Button variant="primary" onClick={onAction}>
        {actionLabel}
      </Button>
    )}
  </div>
);

export const ErrorState: React.FC<{ title?: string; message: string; onRetry?: () => void }> = ({
  title = 'Something went wrong',
  message,
  onRetry
}) => (
  <div className="p-6 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-xl text-center my-4">
    <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400 mx-auto mb-2" />
    <h4 className="text-base font-semibold text-red-900 dark:text-red-200 mb-1">{title}</h4>
    <p className="text-xs text-red-700 dark:text-red-300 mb-4">{message}</p>
    {onRetry && (
      <Button variant="outline" size="sm" onClick={onRetry} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
        Try again
      </Button>
    )}
  </div>
);
