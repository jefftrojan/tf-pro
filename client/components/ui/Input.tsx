// components/ui/Input.tsx
import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, icon, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium text-white">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60">
              {icon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              "w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg",
              "focus:outline-none focus:ring-2 focus:ring-white/40",
              "text-white placeholder-white/50",
              "transition-all duration-200",
              icon && "pl-10",
              error && "border-red-500/50 focus:ring-red-500/40",
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;