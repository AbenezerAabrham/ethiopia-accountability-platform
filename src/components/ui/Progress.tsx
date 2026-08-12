import React from 'react';

export const ProgressBar: React.FC<{ value: number; max?: number; label?: string; showPercentage?: boolean; className?: string }> = ({
  value,
  max = 100,
  label,
  showPercentage = true,
  className = ''
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  return (
    <div className={`w-full space-y-1.5 ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center text-xs font-medium text-slate-600 dark:text-slate-400">
          <span>{label}</span>
          {showPercentage && <span className="font-semibold text-emerald-600 dark:text-emerald-400">{percentage}%</span>}
        </div>
      )}
      <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald-600 dark:bg-emerald-500 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export const ProgressRing: React.FC<{ value: number; size?: number; strokeWidth?: number; label?: string }> = ({
  value,
  size = 64,
  strokeWidth = 6,
  label
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(100, Math.max(0, value));
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex flex-col items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-200 dark:text-slate-800 fill-none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="text-emerald-600 dark:text-emerald-500 fill-none transition-all duration-500 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{percentage}%</span>
      </div>
      {label && <span className="mt-1 text-xs text-slate-500 font-medium">{label}</span>}
    </div>
  );
};
