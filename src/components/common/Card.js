/**
 * Card Component
 * Reusable card container
 */

import React from 'react';
import PropTypes from 'prop-types';

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

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  hover: PropTypes.bool,
  onClick: PropTypes.func,
};
