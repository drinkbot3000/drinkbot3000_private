/**
 * SafetyScreen Component
 * Reusable component for displaying safety warnings during onboarding
 */

import React from 'react';
import { Car, Bed, Pill, AlertTriangle } from 'lucide-react';

const SAFETY_SCREENS = {
  DUI: {
    icon: Car,
    bgGradient: 'from-red-900 via-red-800 to-red-900',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    title: 'NEVER DRIVE IMPAIRED',
    mainContent: {
      heading: '"Impairment to the Slightest Degree"',
      text: 'You can be charged with DUI even BELOW the 0.08% legal limit if you show ANY signs of impairment.',
      warning: 'ANY alcohol consumption = impairment'
    },
    sections: [
      {
        title: 'Use Rideshare Instead:',
        bgColor: 'from-blue-50 to-indigo-50',
        borderColor: 'border-blue-200',
        items: [
          { text: 'Uber', color: 'bg-black' },
          { text: 'Lyft', color: 'bg-pink-600' },
          { text: 'Taxi', color: 'bg-yellow-500' }
        ]
      },
      {
        title: 'Or Order Delivery:',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200',
        items: [
          { text: 'DoorDash', color: 'bg-red-600' },
          { text: 'Instacart', color: 'bg-green-600' },
          { text: 'Postmates', color: 'bg-orange-600' }
        ]
      }
    ]
  },
  SLEEP: {
    icon: Bed,
    bgGradient: 'from-purple-900 via-purple-800 to-purple-900',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    title: "Don't Go to Bed Drunk",
    mainContent: {
      heading: '⚠️ Sleep Can Be Dangerous When Intoxicated',
      bullets: [
        'Risk of choking on vomit',
        'Alcohol poisoning symptoms worsen',
        'Dehydration and injuries from falls'
      ]
    },
    sections: [
      {
        title: 'Plan Ahead:',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        bullets: [
          'Drink water throughout the evening',
          'Eat food before drinking',
          'Stay with friends who can monitor you',
          'Sleep on your side, not back'
        ]
      }
    ]
  },
  BENZOS: {
    icon: Pill,
    bgGradient: 'from-orange-900 via-orange-800 to-orange-900',
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
    title: 'NEVER Mix Alcohol & Benzodiazepines',
    mainContent: {
      heading: '☠️ FATAL COMBINATION',
      text: 'Mixing alcohol with benzodiazepines (Xanax, Valium, Ativan, Klonopin, etc.) can cause DEATH.',
      warning: 'Both substances depress your respiratory system. Together, they can STOP YOUR BREATHING.'
    },
    sections: [
      {
        title: 'Common Benzodiazepines:',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        items: [
          { text: 'Xanax', color: 'bg-red-600' },
          { text: 'Valium', color: 'bg-red-600' },
          { text: 'Ativan', color: 'bg-red-600' },
          { text: 'Klonopin', color: 'bg-red-600' }
        ]
      }
    ]
  },
  OPIATES: {
    icon: AlertTriangle,
    bgGradient: 'from-red-900 via-pink-900 to-red-900',
    iconBg: 'bg-pink-100',
    iconColor: 'text-pink-600',
    title: 'NEVER Mix Alcohol & Opiates',
    mainContent: {
      heading: '☠️ DEADLY COMBINATION',
      text: 'Mixing alcohol with opiates (pain pills, codeine, morphine, etc.) can be FATAL.',
      warning: 'Both depress breathing. This combination KILLS people every day.'
    },
    sections: [
      {
        title: 'Common Opiates:',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        items: [
          { text: 'Oxycodone', color: 'bg-red-600' },
          { text: 'Hydrocodone', color: 'bg-red-600' },
          { text: 'Codeine', color: 'bg-red-600' },
          { text: 'Morphine', color: 'bg-red-600' },
          { text: 'Fentanyl', color: 'bg-red-600' }
        ]
      }
    ]
  }
};

/**
 * SafetyScreen Component
 *
 * @param {Object} props
 * @param {'DUI'|'SLEEP'|'BENZOS'|'OPIATES'} props.type - Type of safety screen
 * @param {number} props.screenNumber - Current screen number (0-3)
 * @param {number} props.totalScreens - Total number of screens (default: 4)
 * @param {Function} props.onAccept - Callback when user accepts
 * @param {Function} props.onDecline - Callback when user declines
 */
const SafetyScreen = ({
  type,
  screenNumber = 0,
  totalScreens = 4,
  onAccept,
  onDecline
}) => {
  const config = SAFETY_SCREENS[type];

  if (!config) {
    console.error(`Unknown safety screen type: ${type}`);
    return null;
  }

  const Icon = config.icon;

  return (
    <div className={`min-h-screen bg-gradient-to-br ${config.bgGradient} p-6 flex items-center justify-center`}>
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          {/* Icon */}
          <div className={`inline-flex items-center justify-center w-24 h-24 mb-6 ${config.iconBg} rounded-full`}>
            <Icon className={`w-16 h-16 ${config.iconColor}`} />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{config.title}</h1>

          {/* Main Content */}
          <div className={`${config.mainContent.bgColor || 'bg-red-50'} rounded-lg p-6 mb-6 border-2 ${config.mainContent.borderColor || 'border-red-200'}`}>
            <p className="text-gray-800 font-bold text-lg mb-4">
              {config.mainContent.heading}
            </p>

            {config.mainContent.text && (
              <p className="text-gray-700 mb-4">
                {config.mainContent.text}
              </p>
            )}

            {config.mainContent.bullets && (
              <ul className="text-left text-gray-700 space-y-3">
                {config.mainContent.bullets.map((bullet, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-red-600 font-bold mr-2">•</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            )}

            {config.mainContent.warning && (
              <p className="text-red-700 font-semibold mt-4">
                {config.mainContent.warning}
              </p>
            )}
          </div>

          {/* Additional Sections */}
          {config.sections && config.sections.map((section, idx) => (
            <div
              key={idx}
              className={`${section.bgColor.includes('gradient') ? `bg-gradient-to-r ${section.bgColor}` : section.bgColor} rounded-lg p-4 mb-4 border ${section.borderColor}`}
            >
              <p className="font-semibold text-gray-800 mb-3">{section.title}</p>

              {section.items && (
                <div className="flex flex-wrap gap-2 justify-center">
                  {section.items.map((item, itemIdx) => (
                    <span
                      key={itemIdx}
                      className={`px-3 py-1 ${item.color} text-white rounded-full text-sm`}
                    >
                      {item.text}
                    </span>
                  ))}
                </div>
              )}

              {section.bullets && (
                <ul className="text-left text-sm text-gray-700 space-y-2">
                  {section.bullets.map((bullet, bulletIdx) => (
                    <li key={bulletIdx}>✓ {bullet}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={onAccept}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-lg"
          >
            I Understand ({screenNumber + 1} of {totalScreens})
          </button>

          <button
            onClick={onDecline}
            className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition"
          >
            I Do Not Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default SafetyScreen;
