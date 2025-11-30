/**
 * Card Component
 * Reusable card container
 */

import React from 'react';

/**
 * Card Component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.className - Additional classes
 * @param {boolean} props.hover - Add hover effect
 * @param {Function} props.onClick - Click handler
 */
export function Card({ children, className = '', hover = false, onClick }) {
  const hoverClass = hover ? 'hover:shadow-lg transition-shadow cursor-pointer' : '';
  const clickableClass = onClick ? 'cursor-pointer' : '';

  return (
    <div
      className={`bg-white rounded-xl shadow-md p-6 ${hoverClass} ${clickableClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
