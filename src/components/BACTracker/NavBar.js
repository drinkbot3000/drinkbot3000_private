/**
 * NavBar Component
 * Bottom navigation bar for switching between app sections
 */

import React from 'react';
import { Activity, Calculator, Settings } from 'lucide-react';
import { TAB_NAMES } from '../../constants';

/**
 * @param {Object} props
 * @param {string} props.activeTab - Currently active tab
 * @param {Function} props.onTabChange - Callback when tab changes
 */
const NavBar = ({ activeTab, onTabChange }) => {
  const tabs = [
    {
      id: TAB_NAMES.TRACKER,
      label: 'Tracker',
      icon: Activity,
      ariaLabel: 'Open drink tracker',
    },
    {
      id: TAB_NAMES.CALCULATOR,
      label: 'Calculator',
      icon: Calculator,
      ariaLabel: 'Open BAC calculator',
    },
    {
      id: TAB_NAMES.SETTINGS,
      label: 'Settings',
      icon: Settings,
      ariaLabel: 'Open settings',
    },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg"
      style={{ zIndex: 9999 }}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-md mx-auto grid grid-cols-3 gap-1">
        {tabs.map(({ id, label, icon: Icon, ariaLabel }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`py-4 flex flex-col items-center justify-center transition ${
              activeTab === id
                ? 'text-indigo-600 bg-indigo-50'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            aria-label={ariaLabel}
            aria-current={activeTab === id ? 'page' : undefined}
          >
            <Icon className="w-6 h-6 mb-1" aria-hidden="true" />
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default React.memo(NavBar);
