/**
 * Button Component
 * Reusable button with consistent styling
 */

import React from 'react';
import PropTypes from 'prop-types';

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
 * @param {string|React.Component} props.as - Element or component to render as (default: 'button')
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
}) {
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

Button.propTypes = {
  variant: PropTypes.oneOf(['primary', 'secondary', 'success', 'danger', 'warning', 'outline']),
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
  type: PropTypes.string,
  as: PropTypes.elementType,
};
