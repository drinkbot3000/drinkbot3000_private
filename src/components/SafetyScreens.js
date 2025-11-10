import React from 'react';
import { Car, Bed, Pill, AlertTriangle } from 'lucide-react';

/**
 * SafetyScreens Component
 * Displays multi-screen safety warnings with ARIA labels for accessibility
 */
const SafetyScreens = ({ currentScreen, onNext }) => {
  // Screen 1: DUI / Impairment Warning
  if (currentScreen === 0) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-900 p-6 flex items-center justify-center"
        role="main"
        aria-labelledby="safety-dui-title"
      >
        <div
          className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full"
          role="dialog"
          aria-modal="true"
          aria-labelledby="safety-dui-title"
          aria-describedby="safety-dui-description"
        >
          <div className="text-center mb-6">
            <div
              className="inline-flex items-center justify-center w-24 h-24 mb-6 bg-red-100 rounded-full"
              aria-hidden="true"
            >
              <Car className="w-16 h-16 text-red-600" />
            </div>
            <h1
              id="safety-dui-title"
              className="text-3xl font-bold text-gray-800 mb-4"
            >
              NEVER DRIVE IMPAIRED
            </h1>
            <div id="safety-dui-description">
              <div className="bg-red-50 rounded-lg p-6 mb-6 border-2 border-red-200" role="alert">
                <p className="text-gray-800 font-bold text-lg mb-4">
                  "Impairment to the Slightest Degree"
                </p>
                <p className="text-gray-700 mb-4">
                  You can be charged with DUI even BELOW the 0.08% legal limit if you show ANY signs of impairment.
                </p>
                <p className="text-red-700 font-semibold">
                  ANY alcohol consumption = impairment
                </p>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-4 border border-blue-200">
                <p className="font-semibold text-gray-800 mb-3">Use Rideshare Instead:</p>
                <div className="flex flex-wrap gap-2 justify-center" role="list" aria-label="Rideshare options">
                  <span className="px-3 py-1 bg-black text-white rounded-full text-sm" role="listitem">Uber</span>
                  <span className="px-3 py-1 bg-pink-600 text-white rounded-full text-sm" role="listitem">Lyft</span>
                  <span className="px-3 py-1 bg-yellow-500 text-white rounded-full text-sm" role="listitem">Taxi</span>
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <p className="font-semibold text-gray-800 mb-3">Or Order Delivery:</p>
                <div className="flex flex-wrap gap-2 justify-center" role="list" aria-label="Delivery options">
                  <span className="px-3 py-1 bg-red-600 text-white rounded-full text-sm" role="listitem">DoorDash</span>
                  <span className="px-3 py-1 bg-green-600 text-white rounded-full text-sm" role="listitem">Instacart</span>
                  <span className="px-3 py-1 bg-orange-600 text-white rounded-full text-sm" role="listitem">Postmates</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={onNext}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-lg focus:outline-none focus:ring-4 focus:ring-indigo-300"
            aria-label="I understand never to drive impaired, continue to next safety screen, 1 of 4"
          >
            I Understand (1 of 4)
          </button>
        </div>
      </div>
    );
  }

  // Screen 2: Don't Sleep When Drunk
  if (currentScreen === 1) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 p-6 flex items-center justify-center"
        role="main"
        aria-labelledby="safety-sleep-title"
      >
        <div
          className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full"
          role="dialog"
          aria-modal="true"
          aria-labelledby="safety-sleep-title"
          aria-describedby="safety-sleep-description"
        >
          <div className="text-center mb-6">
            <div
              className="inline-flex items-center justify-center w-24 h-24 mb-6 bg-purple-100 rounded-full"
              aria-hidden="true"
            >
              <Bed className="w-16 h-16 text-purple-600" />
            </div>
            <h1
              id="safety-sleep-title"
              className="text-3xl font-bold text-gray-800 mb-4"
            >
              Don't Go to Bed Drunk
            </h1>
            <div id="safety-sleep-description">
              <div className="bg-purple-50 rounded-lg p-6 mb-6 border-2 border-purple-200" role="alert">
                <p className="text-gray-800 font-bold text-lg mb-4">
                  ⚠️ Sleep Can Be Dangerous When Intoxicated
                </p>
                <ul className="text-left text-gray-700 space-y-3" role="list" aria-label="Dangers of sleeping while drunk">
                  <li className="flex items-start" role="listitem">
                    <span className="text-red-600 font-bold mr-2" aria-hidden="true">•</span>
                    <span>Risk of choking on vomit</span>
                  </li>
                  <li className="flex items-start" role="listitem">
                    <span className="text-red-600 font-bold mr-2" aria-hidden="true">•</span>
                    <span>Alcohol poisoning symptoms worsen</span>
                  </li>
                  <li className="flex items-start" role="listitem">
                    <span className="text-red-600 font-bold mr-2" aria-hidden="true">•</span>
                    <span>Dehydration and injuries from falls</span>
                  </li>
                </ul>
              </div>

              <div className="bg-green-50 rounded-lg p-4 mb-4 border border-green-200">
                <p className="font-semibold text-gray-800 mb-3">Plan Ahead:</p>
                <ul className="text-left text-sm text-gray-700 space-y-2" role="list" aria-label="Safety tips">
                  <li role="listitem">✓ Drink water throughout the evening</li>
                  <li role="listitem">✓ Eat food before drinking</li>
                  <li role="listitem">✓ Stay with friends who can monitor you</li>
                  <li role="listitem">✓ Sleep on your side, not back</li>
                  <li role="listitem">✓ Set multiple alarms</li>
                </ul>
              </div>

              <div className="bg-red-50 rounded-lg p-3 border border-red-200" role="alert">
                <p className="text-sm text-red-800 font-semibold">
                  If someone is passed out drunk, place them in the recovery position and seek medical help if needed.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={onNext}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-lg focus:outline-none focus:ring-4 focus:ring-indigo-300"
            aria-label="I understand not to go to bed drunk, continue to next safety screen, 2 of 4"
          >
            I Understand (2 of 4)
          </button>
        </div>
      </div>
    );
  }

  // Screen 3: Benzodiazepines Warning
  if (currentScreen === 2) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-orange-900 via-orange-800 to-orange-900 p-6 flex items-center justify-center"
        role="main"
        aria-labelledby="safety-benzos-title"
      >
        <div
          className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full"
          role="dialog"
          aria-modal="true"
          aria-labelledby="safety-benzos-title"
          aria-describedby="safety-benzos-description"
        >
          <div className="text-center mb-6">
            <div
              className="inline-flex items-center justify-center w-24 h-24 mb-6 bg-orange-100 rounded-full"
              aria-hidden="true"
            >
              <Pill className="w-16 h-16 text-orange-600" />
            </div>
            <h1
              id="safety-benzos-title"
              className="text-3xl font-bold text-gray-800 mb-4"
            >
              BENZODIAZEPINES WARNING
            </h1>
            <div id="safety-benzos-description">
              <div className="bg-red-50 rounded-lg p-6 mb-6 border-2 border-red-300" role="alert">
                <p className="text-red-900 font-bold text-xl mb-4">
                  ☠️ DEADLY COMBINATION ☠️
                </p>
                <p className="text-gray-800 mb-4">
                  <strong>Never mix alcohol with benzodiazepines!</strong>
                </p>
                <p className="text-gray-700 mb-4">
                  Common benzos include:
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm" role="list" aria-label="Common benzodiazepines">
                  <div className="bg-white p-2 rounded border border-red-200" role="listitem">Xanax</div>
                  <div className="bg-white p-2 rounded border border-red-200" role="listitem">Valium</div>
                  <div className="bg-white p-2 rounded border border-red-200" role="listitem">Ativan</div>
                  <div className="bg-white p-2 rounded border border-red-200" role="listitem">Klonopin</div>
                </div>
              </div>

              <div className="bg-orange-50 rounded-lg p-4 mb-4 border border-orange-200">
                <p className="font-semibold text-gray-800 mb-3">Dangers:</p>
                <ul className="text-left text-sm text-gray-700 space-y-2" role="list" aria-label="Dangers of mixing alcohol with benzos">
                  <li className="flex items-start" role="listitem">
                    <span className="text-red-600 font-bold mr-2" aria-hidden="true">•</span>
                    <span>Extreme sedation and respiratory depression</span>
                  </li>
                  <li className="flex items-start" role="listitem">
                    <span className="text-red-600 font-bold mr-2" aria-hidden="true">•</span>
                    <span>Increased risk of overdose and death</span>
                  </li>
                  <li className="flex items-start" role="listitem">
                    <span className="text-red-600 font-bold mr-2" aria-hidden="true">•</span>
                    <span>Severe impairment even at low doses</span>
                  </li>
                  <li className="flex items-start" role="listitem">
                    <span className="text-red-600 font-bold mr-2" aria-hidden="true">•</span>
                    <span>Memory blackouts and dangerous behavior</span>
                  </li>
                </ul>
              </div>

              <div className="bg-red-100 rounded-lg p-4 border-2 border-red-300" role="alert">
                <p className="text-red-900 font-bold text-sm">
                  If you take benzodiazepines, DO NOT drink alcohol. If you've been drinking, DO NOT take benzos. This combination can be fatal.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={onNext}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-lg focus:outline-none focus:ring-4 focus:ring-indigo-300"
            aria-label="I understand never to mix alcohol with benzodiazepines, continue to next safety screen, 3 of 4"
          >
            I Understand (3 of 4)
          </button>
        </div>
      </div>
    );
  }

  // Screen 4: Opiates Warning
  if (currentScreen === 3) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 flex items-center justify-center"
        role="main"
        aria-labelledby="safety-opiates-title"
      >
        <div
          className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full"
          role="dialog"
          aria-modal="true"
          aria-labelledby="safety-opiates-title"
          aria-describedby="safety-opiates-description"
        >
          <div className="text-center mb-6">
            <div
              className="inline-flex items-center justify-center w-24 h-24 mb-6 bg-gray-100 rounded-full"
              aria-hidden="true"
            >
              <AlertTriangle className="w-16 h-16 text-red-600" />
            </div>
            <h1
              id="safety-opiates-title"
              className="text-3xl font-bold text-gray-800 mb-4"
            >
              OPIATES WARNING
            </h1>
            <div id="safety-opiates-description">
              <div className="bg-red-50 rounded-lg p-6 mb-6 border-2 border-red-300" role="alert">
                <p className="text-red-900 font-bold text-xl mb-4">
                  ☠️ FATAL COMBINATION ☠️
                </p>
                <p className="text-gray-800 font-bold mb-4">
                  Alcohol + Opiates = HIGH RISK OF DEATH
                </p>
                <p className="text-gray-700 mb-4">
                  Common opiates/opioids:
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm" role="list" aria-label="Common opiates">
                  <div className="bg-white p-2 rounded border border-red-200" role="listitem">Oxycodone</div>
                  <div className="bg-white p-2 rounded border border-red-200" role="listitem">Hydrocodone</div>
                  <div className="bg-white p-2 rounded border border-red-200" role="listitem">Morphine</div>
                  <div className="bg-white p-2 rounded border border-red-200" role="listitem">Fentanyl</div>
                  <div className="bg-white p-2 rounded border border-red-200" role="listitem">Codeine</div>
                  <div className="bg-white p-2 rounded border border-red-200" role="listitem">Heroin</div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
                <p className="font-semibold text-gray-800 mb-3">Why It's Deadly:</p>
                <ul className="text-left text-sm text-gray-700 space-y-2" role="list" aria-label="Why mixing alcohol with opiates is deadly">
                  <li className="flex items-start" role="listitem">
                    <span className="text-red-600 font-bold mr-2" aria-hidden="true">•</span>
                    <span><strong>Respiratory Depression:</strong> Both slow breathing</span>
                  </li>
                  <li className="flex items-start" role="listitem">
                    <span className="text-red-600 font-bold mr-2" aria-hidden="true">•</span>
                    <span><strong>You can stop breathing:</strong> Even in your sleep</span>
                  </li>
                  <li className="flex items-start" role="listitem">
                    <span className="text-red-600 font-bold mr-2" aria-hidden="true">•</span>
                    <span><strong>Overdose risk:</strong> Dramatically increased</span>
                  </li>
                  <li className="flex items-start" role="listitem">
                    <span className="text-red-600 font-bold mr-2" aria-hidden="true">•</span>
                    <span><strong>Death can occur quickly:</strong> Minutes, not hours</span>
                  </li>
                </ul>
              </div>

              <div className="bg-red-100 rounded-lg p-4 border-2 border-red-300 mb-4" role="alert">
                <p className="text-red-900 font-bold text-sm mb-2">
                  🚨 NEVER MIX ALCOHOL WITH OPIATES 🚨
                </p>
                <p className="text-red-800 text-sm">
                  If you take prescription pain medication, DO NOT drink. If you've been drinking, DO NOT take opiates. This combination kills thousands every year.
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200" role="note">
                <p className="text-sm text-blue-900">
                  <strong>Emergency:</strong> If someone is unresponsive after mixing alcohol and opiates, call 911 immediately. Mention both substances.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={onNext}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-lg focus:outline-none focus:ring-4 focus:ring-indigo-300"
            aria-label="I understand never to mix alcohol with opiates, continue to app, final safety screen 4 of 4"
          >
            I Understand - Continue to App (4 of 4)
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default SafetyScreens;
