import React from 'react';
import { Settings } from 'lucide-react';

/**
 * HeaderBar - Application header with branding and settings button
 *
 * Modern pattern: Uses React.memo since header is static
 * and rarely needs to re-render
 *
 * @param {string} appTitle - The application title
 * @param {string} appSubtitle - The application subtitle
 * @param {function} onSettingsClick - Callback when settings button is clicked
 */
const HeaderBar = React.memo(({
  appTitle = 'DrinkBot3000',
  appSubtitle = 'Responsible tracking',
  onSettingsClick
}) => {
  return (
    <div className="bg-white shadow-sm">
      <div className="max-w-md mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
            <span className="text-2xl" role="img" aria-label="robot">🤖</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-800">{appTitle}</h1>
            <p className="text-xs text-gray-500">{appSubtitle}</p>
          </div>
        </div>
        <button
          onClick={onSettingsClick}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
          aria-label="Open settings"
        >
          <Settings className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
});

HeaderBar.displayName = 'HeaderBar';

export default HeaderBar;
