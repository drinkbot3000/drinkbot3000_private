import React from 'react';
import { Car, Bed, Pill, AlertTriangle } from 'lucide-react';

// Safety Screen Component Factory
function SafetyScreen({ icon: Icon, title, children, onNext, onDecline, screenNumber, totalScreens }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-900 p-6 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className={`inline-flex items-center justify-center w-24 h-24 mb-6 ${getIconBgClass(screenNumber)} rounded-full`}>
            <Icon className={`w-16 h-16 ${getIconColorClass(screenNumber)}`} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{title}</h1>
          {children}
        </div>

        <div className="space-y-3">
          <button
            onClick={onNext}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-lg"
          >
            I Understand ({screenNumber} of {totalScreens})
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
}

function getIconBgClass(screenNumber) {
  const classes = ['bg-red-100', 'bg-purple-100', 'bg-orange-100', 'bg-gray-100'];
  return classes[screenNumber - 1] || 'bg-red-100';
}

function getIconColorClass(screenNumber) {
  const classes = ['text-red-600', 'text-purple-600', 'text-orange-600', 'text-red-600'];
  return classes[screenNumber - 1] || 'text-red-600';
}

// Individual Safety Screens
export function SafetyScreen1({ onNext, onDecline }) {
  return (
    <SafetyScreen
      icon={Car}
      title="NEVER DRIVE IMPAIRED"
      onNext={onNext}
      onDecline={onDecline}
      screenNumber={1}
      totalScreens={4}
    >
      <div className="bg-red-50 rounded-lg p-6 mb-6 border-2 border-red-200">
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
        <div className="flex flex-wrap gap-2 justify-center">
          <span className="px-3 py-1 bg-black text-white rounded-full text-sm">Uber</span>
          <span className="px-3 py-1 bg-pink-600 text-white rounded-full text-sm">Lyft</span>
          <span className="px-3 py-1 bg-yellow-500 text-white rounded-full text-sm">Taxi</span>
        </div>
      </div>

      <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
        <p className="font-semibold text-gray-800 mb-3">Or Order Delivery:</p>
        <div className="flex flex-wrap gap-2 justify-center">
          <span className="px-3 py-1 bg-red-600 text-white rounded-full text-sm">DoorDash</span>
          <span className="px-3 py-1 bg-green-600 text-white rounded-full text-sm">Instacart</span>
          <span className="px-3 py-1 bg-orange-600 text-white rounded-full text-sm">Postmates</span>
        </div>
      </div>
    </SafetyScreen>
  );
}

export function SafetyScreen2({ onNext, onDecline }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 p-6 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-24 h-24 mb-6 bg-purple-100 rounded-full">
            <Bed className="w-16 h-16 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Don't Go to Bed Drunk</h1>
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
              If someone is passed out drunk, place them in the recovery position and seek medical help if needed.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={onNext}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-lg"
          >
            I Understand (2 of 4)
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
}

export function SafetyScreen3({ onNext, onDecline }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-900 via-orange-800 to-orange-900 p-6 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-24 h-24 mb-6 bg-orange-100 rounded-full">
            <Pill className="w-16 h-16 text-orange-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">BENZODIAZEPINES WARNING</h1>
          <div className="bg-red-50 rounded-lg p-6 mb-6 border-2 border-red-300">
            <p className="text-red-900 font-bold text-xl mb-4">
              ⚠️ DEADLY COMBINATION ⚠️
            </p>
            <p className="text-gray-800 mb-4">
              <strong>Never mix alcohol with benzodiazepines!</strong>
            </p>
            <p className="text-gray-700 mb-4">
              Common benzos include:
            </p>
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
              If you take benzodiazepines, DO NOT drink alcohol. If you've been drinking, DO NOT take benzos. This combination can be fatal.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={onNext}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-lg"
          >
            I Understand (3 of 4)
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
}

export function SafetyScreen4({ onNext, onDecline }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-24 h-24 mb-6 bg-gray-100 rounded-full">
            <AlertTriangle className="w-16 h-16 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">OPIATES WARNING</h1>
          <div className="bg-red-50 rounded-lg p-6 mb-6 border-2 border-red-300">
            <p className="text-red-900 font-bold text-xl mb-4">
              ⚠️ FATAL COMBINATION ⚠️
            </p>
            <p className="text-gray-800 font-bold mb-4">
              Alcohol + Opiates = HIGH RISK OF DEATH
            </p>
            <p className="text-gray-700 mb-4">
              Common opiates/opioids:
            </p>
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
                <span><strong>Respiratory Depression:</strong> Both slow breathing</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 font-bold mr-2">•</span>
                <span><strong>You can stop breathing:</strong> Even in your sleep</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 font-bold mr-2">•</span>
                <span><strong>Overdose risk:</strong> Dramatically increased</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 font-bold mr-2">•</span>
                <span><strong>Death can occur quickly:</strong> Minutes, not hours</span>
              </li>
            </ul>
          </div>

          <div className="bg-red-100 rounded-lg p-4 border-2 border-red-300 mb-4">
            <p className="text-red-900 font-bold text-sm mb-2">
              🚨 NEVER MIX ALCOHOL WITH OPIATES 🚨
            </p>
            <p className="text-red-800 text-sm">
              If you take prescription pain medication, DO NOT drink. If you've been drinking, DO NOT take opiates. This combination kills thousands every year.
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
            <p className="text-sm text-blue-900">
              <strong>Emergency:</strong> If someone is unresponsive after mixing alcohol and opiates, call 911 immediately. Mention both substances.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={onNext}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-lg"
          >
            I Understand - Continue to App (4 of 4)
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
}
