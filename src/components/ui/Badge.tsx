import React from 'react';
import clsx from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary-dark",
  };

  return (
    <span className={clsx(
      "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium",
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
}