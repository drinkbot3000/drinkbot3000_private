/**
 * RobotMessage Component
 * Displays temporary robot personality messages
 */

import React from 'react';

/**
 * @param {Object} props
 * @param {string} props.message - Message to display
 * @param {boolean} props.show - Whether to show the message
 */
const RobotMessage = ({ message, show }) => {
  if (!show || !message) return null;

  return (
    <div
      className="fixed top-20 left-0 right-0 px-6 z-40 pointer-events-none"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="max-w-md mx-auto">
        <div className="bg-gradient-to-r from-slate-700 to-slate-800 text-white p-4 rounded-xl border-2 border-slate-600 shadow-2xl animate-pulse">
          <p className="text-center font-medium">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default React.memo(RobotMessage);
