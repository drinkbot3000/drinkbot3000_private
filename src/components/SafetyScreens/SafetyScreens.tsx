/**
 * SafetyScreens Component
 * Multi-screen safety warnings that users must acknowledge
 */

import React from 'react';
import { AlertTriangle, Pill, Bed, Car, LucideIcon } from 'lucide-react';
import { Button } from '../common';

interface SafetyScreen {
  id: number;
  bgGradient: string;
  iconBg: string;
  iconColor: string;
  Icon: LucideIcon;
  title: string;
  content: JSX.Element;
}

interface SafetyScreensProps {
  currentScreen: number;
  onNext: () => void;
  onDecline: () => void;
}

const safetyScreensData: SafetyScreen[] = [
  {
    id: 0,
    bgGradient: 'from-gray-900 via-gray-800 to-gray-900',
    iconBg: 'bg-gray-100',
    iconColor: 'text-red-600',
    Icon: AlertTriangle,
    title: 'OPIATES WARNING',
    content: (
      <>
        <div className="bg-red-50 rounded-lg p-6 mb-6 border-2 border-red-300">
          <p className="text-red-900 font-bold text-xl mb-4">⚠️ FATAL COMBINATION ⚠️</p>
          <p className="text-gray-800 font-bold mb-4">Alcohol + Opiates = HIGH RISK OF DEATH</p>
          <p className="text-gray-700 mb-4">Common opiates/opioids:</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-white p-2 rounded border border-red-200">Oxycodone</div>
            <div className="bg-white p-2 rounded border border-red-200">Hydrocodone</div>
            <div className="bg-white p-2 rounded border border-red-200">Morphine</div>
            <div className="bg-white p-2 rounded border border-red-200">Fentanyl</div>
            <div className="bg-white p-2 rounded border border-red-200">Codeine</div>
            <div className="bg-white p-2 rounded border border-red-200">Heroin</div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
          <p className="font-semibold text-gray-800 mb-3">Why It's Deadly:</p>
          <ul className="text-left text-sm text-gray-700 space-y-2">
            <li className="flex items-start">
              <span className="text-red-600 font-bold mr-2">•</span>
              <span>
                <strong>Respiratory Depression:</strong> Both slow breathing
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-red-600 font-bold mr-2">•</span>
              <span>
                <strong>You can stop breathing:</strong> Even in your sleep
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-red-600 font-bold mr-2">•</span>
              <span>
                <strong>Overdose risk:</strong> Dramatically increased
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-red-600 font-bold mr-2">•</span>
              <span>
                <strong>Death can occur quickly:</strong> Minutes, not hours
              </span>
            </li>
          </ul>
        </div>

        <div className="bg-red-100 rounded-lg p-4 border-2 border-red-300 mb-4">
          <p className="text-red-900 font-bold text-sm mb-2">
            🚨 NEVER MIX ALCOHOL WITH OPIATES 🚨
          </p>
          <p className="text-red-800 text-sm">
            If you take prescription pain medication, DO NOT drink. If you've been drinking, DO NOT
            take opiates. This combination kills thousands every year.
          </p>
        </div>

        <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
          <p className="text-sm text-blue-900">
            <strong>Emergency:</strong> If someone is unresponsive after mixing alcohol and opiates,
            call 911 immediately. Mention both substances.
          </p>
        </div>
      </>
    ),
  },
  {
    id: 1,
    bgGradient: 'from-orange-900 via-orange-800 to-orange-900',
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
    Icon: Pill,
    title: 'BENZODIAZEPINES WARNING',
    content: (
      <>
        <div className="bg-red-50 rounded-lg p-6 mb-6 border-2 border-red-300">
          <p className="text-red-900 font-bold text-xl mb-4">⚠️ DEADLY COMBINATION ⚠️</p>
          <p className="text-gray-800 mb-4">
            <strong>Never mix alcohol with benzodiazepines!</strong>
          </p>
          <p className="text-gray-700 mb-4">Common benzos include:</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-white p-2 rounded border border-red-200">Xanax</div>
            <div className="bg-white p-2 rounded border border-red-200">Valium</div>
            <div className="bg-white p-2 rounded border border-red-200">Ativan</div>
            <div className="bg-white p-2 rounded border border-red-200">Klonopin</div>
          </div>
        </div>

        <div className="bg-orange-50 rounded-lg p-4 mb-4 border border-orange-200">
          <p className="font-semibold text-gray-800 mb-3">Dangers:</p>
          <ul className="text-left text-sm text-gray-700 space-y-2">
            <li className="flex items-start">
              <span className="text-red-600 font-bold mr-2">•</span>
              <span>Extreme sedation and respiratory depression</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-600 font-bold mr-2">•</span>
              <span>Increased risk of overdose and death</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-600 font-bold mr-2">•</span>
              <span>Severe impairment even at low doses</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-600 font-bold mr-2">•</span>
              <span>Memory blackouts and dangerous behavior</span>
            </li>
          </ul>
        </div>

        <div className="bg-red-100 rounded-lg p-4 border-2 border-red-300">
          <p className="text-red-900 font-bold text-sm">
            If you take benzodiazepines, DO NOT drink alcohol. If you've been drinking, DO NOT take
            benzos. This combination can be fatal.
          </p>
        </div>
      </>
    ),
  },
  {
    id: 2,
    bgGradient: 'from-purple-900 via-purple-800 to-purple-900',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    Icon: Bed,
    title: "Don't Go to Bed Drunk",
    content: (
      <>
        <div className="bg-purple-50 rounded-lg p-6 mb-6 border-2 border-purple-200">
          <p className="text-gray-800 font-bold text-lg mb-4">
            ⚠️ Sleep Can Be Dangerous When Intoxicated
          </p>
          <ul className="text-left text-gray-700 space-y-3">
            <li className="flex items-start">
              <span className="text-red-600 font-bold mr-2">•</span>
              <span>Risk of choking on vomit</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-600 font-bold mr-2">•</span>
              <span>Alcohol poisoning symptoms worsen</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-600 font-bold mr-2">•</span>
              <span>Dehydration and injuries from falls</span>
            </li>
          </ul>
        </div>

        <div className="bg-green-50 rounded-lg p-4 mb-4 border border-green-200">
          <p className="font-semibold text-gray-800 mb-3">Plan Ahead:</p>
          <ul className="text-left text-sm text-gray-700 space-y-2">
            <li>✓ Drink water throughout the evening</li>
            <li>✓ Eat food before drinking</li>
            <li>✓ Stay with friends who can monitor you</li>
            <li>✓ Sleep on your side, not back</li>
            <li>✓ Set multiple alarms</li>
          </ul>
        </div>

        <div className="bg-red-50 rounded-lg p-3 border border-red-200">
          <p className="text-sm text-red-800 font-semibold">
            If someone is passed out drunk, place them in the recovery position and seek medical
            help if needed.
          </p>
        </div>
      </>
    ),
  },
  {
    id: 3,
    bgGradient: 'from-red-900 via-red-800 to-red-900',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    Icon: Car,
    title: 'NEVER DRIVE IMPAIRED',
    content: (
      <>
        <div className="bg-red-50 rounded-lg p-6 mb-6 border-2 border-red-200">
          <p className="text-gray-800 font-bold text-lg mb-4">
            "Impairment to the Slightest Degree"
          </p>
          <p className="text-gray-700 mb-4">
            You can be charged with DUI even BELOW the 0.08% legal limit if you show ANY signs of
            impairment.
          </p>
          <p className="text-red-700 font-semibold">ANY alcohol consumption = impairment</p>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-4 border border-blue-200">
          <p className="font-semibold text-gray-800 mb-3">Use Rideshare Instead:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            <span className="px-3 py-1 bg-black text-white rounded-full text-sm">Uber</span>
            <span className="px-3 py-1 bg-pink-600 text-white rounded-full text-sm">Lyft</span>
            <span className="px-3 py-1 bg-yellow-500 text-gray-900 rounded-full text-sm font-medium">
              Taxi
            </span>
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <p className="font-semibold text-gray-800 mb-3">Or Order Delivery:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            <span className="px-3 py-1 bg-red-600 text-white rounded-full text-sm">DoorDash</span>
            <span className="px-3 py-1 bg-green-600 text-white rounded-full text-sm">
              Instacart
            </span>
            <span className="px-3 py-1 bg-orange-600 text-white rounded-full text-sm">
              Postmates
            </span>
          </div>
        </div>
      </>
    ),
  },
];

export function SafetyScreens({
  currentScreen,
  onNext,
  onDecline,
}: SafetyScreensProps): JSX.Element | null {
  const screen = safetyScreensData[currentScreen];

  if (!screen) return null;

  const { bgGradient, iconBg, iconColor, Icon, title, content } = screen;

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${bgGradient} p-6 flex items-center justify-center`}
    >
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-6">
          <div
            className={`inline-flex items-center justify-center w-24 h-24 mb-6 ${iconBg} rounded-full`}
          >
            <Icon className={`w-16 h-16 ${iconColor}`} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{title}</h1>
          {content}
        </div>

        <div className="space-y-3">
          <Button variant="primary" size="lg" fullWidth onClick={onNext} className="shadow-lg">
            {currentScreen === 3
              ? 'I Understand - Continue to App (4 of 4)'
              : `I Understand (${currentScreen + 1} of 4)`}
          </Button>

          <Button variant="secondary" size="md" fullWidth onClick={onDecline}>
            I Do Not Accept
          </Button>
        </div>
      </div>
    </div>
  );
}
