import React from 'react';
import { LucideIcon } from 'lucide-react';
import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  className,
  ...props
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-colors rounded-lg";
  
  const variants = {
    primary: "bg-primary hover:bg-primary-light text-white",
    secondary: "bg-secondary hover:bg-secondary-light text-primary",
    ghost: "bg-transparent hover:bg-gray-100 text-primary",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={clsx(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon className="mr-2" size={size === 'sm' ? 16 : size === 'md' ? 18 : 20} />}
      {children}
      {Icon && iconPosition === 'right' && <Icon className="ml-2" size={size === 'sm' ? 16 : size === 'md' ? 18 : 20} />}
    </button>
  );
}