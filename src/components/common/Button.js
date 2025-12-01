/**
 * Button Component
 * Reusable button with consistent styling
 */

import React from 'react';

const buttonVariants = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
  secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
  success: 'bg-green-600 text-white hover:bg-green-700',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  warning: 'bg-yellow-600 text-white hover:bg-yellow-700',
  outline: 'border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50',
};

const buttonSizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2',
  lg: 'px-6 py-3 text-lg',
  xl: 'px-8 py-4 text-xl',
};

/**
 * Button Component
 * @param {Object} props
 * @param {string} props.variant - Button variant (default: 'primary')
 * @param {string} props.size - Button size (default: 'md')
 * @param {boolean} props.fullWidth - Full width button
 * @param {boolean} props.disabled - Disabled state
 * @param {React.ReactNode} props.children - Button content
 * @param {Function} props.onClick - Click handler
 * @param {string} props.className - Additional classes
 * @param {string} props.type - Button type (default: 'button')
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
  ...props
}) {
  const variantClass = buttonVariants[variant] || buttonVariants.primary;
  const sizeClass = buttonSizes[size] || buttonSizes.md;
  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variantClass}
        ${sizeClass}
        ${widthClass}
        ${disabledClass}
        ${className}
        rounded-lg font-semibold transition-colors
        flex items-center justify-center gap-2
      `.trim()}
      {...props}
    >
      {children}
    </button>
  );
}
