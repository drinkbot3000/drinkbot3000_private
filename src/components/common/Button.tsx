/**
 * Button Component
 * Reusable button with consistent styling
 */

import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

const buttonVariants: Record<ButtonVariant, string> = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
  secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
  success: 'bg-green-600 text-white hover:bg-green-700',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  warning: 'bg-yellow-600 text-white hover:bg-yellow-700',
  outline: 'border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50',
};

const buttonSizes: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2',
  lg: 'px-6 py-3 text-lg',
  xl: 'px-8 py-4 text-xl',
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  as?: React.ElementType;
}

/**
 * Button Component
 */
export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  children,
  onClick,
  className = '',
  type = 'button',
  as: Component = 'button',
  ...props
}: ButtonProps): JSX.Element {
  const variantClass = buttonVariants[variant] || buttonVariants.primary;
  const sizeClass = buttonSizes[size] || buttonSizes.md;
  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : '';

  const buttonClasses = `
    ${variantClass}
    ${sizeClass}
    ${widthClass}
    ${disabledClass}
    ${className}
    rounded-lg font-semibold transition-colors
    flex items-center justify-center gap-2
  `.trim();

  // For button elements, include type and disabled props
  const buttonProps = Component === 'button' ? { type, disabled } : {};

  return (
    <Component onClick={onClick} className={buttonClasses} {...buttonProps} {...props}>
      {children}
    </Component>
  );
}
