/**
 * MainLayout Component
 * Main app layout with header and tab navigation
 */

import React from 'react';
import { Activity, Calculator, Settings, HelpCircle } from 'lucide-react';

/**
 * MainLayout Component
 * @param {Object} props
 * @param {string} props.activeTab - Current active tab ('tracker' | 'calculator')
 * @param {Function} props.onTabChange - Tab change handler
 * @param {Function} props.onSettingsClick - Settings button click handler
 * @param {Function} props.onHelpClick - Help button click handler
 * @param {React.ReactNode} props.children - Content to render in main area
 */
export function MainLayout({
  activeTab,
  onTabChange,
  onSettingsClick,
  onHelpClick,
  children,
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pb-24">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🤖</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">DrinkBot3000</h1>
              <p className="text-xs text-gray-500">Your Safety Companion</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onHelpClick}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
              aria-label="Help"
            >
              <HelpCircle className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={onSettingsClick}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
              aria-label="Settings"
            >
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-md mx-auto px-6">
          <div className="flex space-x-4">
            <button
              onClick={() => onTabChange('tracker')}
              className={`py-3 px-4 font-medium transition border-b-2 ${
                activeTab === 'tracker'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Activity className="w-4 h-4 inline mr-1" />
              Tracker
            </button>
            <button
              onClick={() => onTabChange('calculator')}
              className={`py-3 px-4 font-medium transition border-b-2 ${
                activeTab === 'calculator'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Calculator className="w-4 h-4 inline mr-1" />
              Calculator
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-6 py-6">{children}</div>
    </div>
  );
}
