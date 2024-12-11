import React from 'react';
import { Check } from 'lucide-react';
import clsx from 'clsx';

interface ExactMatchToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function ExactMatchToggle({ checked, onChange }: ExactMatchToggleProps) {
  return (
    <label className="flex items-center gap-2 cursor-pointer group">
      <span className="text-sm text-gray-600 group-hover:text-gray-800">
        Exact Match
      </span>
      <div 
        className={clsx(
          "w-5 h-5 rounded border transition-all duration-200 flex items-center justify-center",
          checked ? "bg-secondary border-secondary" : "border-gray-300 group-hover:border-secondary/50"
        )}
        onClick={() => onChange(!checked)}
      >
        {checked && <Check size={14} className="text-white" />}
      </div>
    </label>
  );
}