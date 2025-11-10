import React, { useState, useEffect } from 'react';
import { AlertCircle, Beer, User, Weight, Smile, Calculator, Activity, Settings } from 'lucide-react';

export default function BACTracker() {
  const [setupComplete, setSetupComplete] = useState(false);
  const [gender, setGender] = useState('');
  const [weight, setWeight] = useState('');
  const [bac, setBac] = useState(0);
  const [drinks, setDrinks] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [currentJoke, setCurrentJoke] = useState('');
  const [showJoke, setShowJoke] = useState(false);
  const [mode, setMode] = useState('');
  const [estimateDrinks, setEstimateDrinks] = useState('');
  const [estimateHours, setEstimateHours] = useState('');
  const [activeTab, setActiveTab] = useState('tracker');
  const [calcDrinks, setCalcDrinks] = useState('');
  const [calcHours, setCalcHours] = useState('');
  const [calcBAC, setCalcBAC] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [customDrinkOz, setCustomDrinkOz] = useState('');
  const [customDrinkABV, setCustomDrinkABV] = useState('5');
  const [robotMessage, setRobotMessage] = useState('');
  const [showSplash, setShowSplash] = useState(true);
  const [imageError, setImageError] = useState(false);

  const jokes = [
    "Why don't scientists trust atoms? Because they make up everything!",
    "What do you call a bear with no teeth? A gummy bear!",
    "Why did the scarecrow win an award? He was outstanding in his field!",
    "What do you call a fake noodle? An impasta!",
    "Why don't eggs tell jokes? They'd crack each other up!",
    "What's orange and sounds like a parrot? A carrot!",
    "Why did the math book look so sad? Because it had too many problems!",
    "What do you call a can opener that doesn't work? A can't opener!",
    "Why don't skeletons fight each other? They don't have the guts!",
    "What did the ocean say to the beach? Nothing, it just waved!",
    "Why did the coffee file a police report? It got mugged!",
    "What do you call a fish wearing a bowtie? Sofishticated!",
    "Why did the bicycle fall over? Because it was two-tired!",
    "What do you call a sleeping bull? A bulldozer!",
    "Why can't your nose be 12 inches long? Because then it would be a foot!",
    "What do you call a dinosaur that crashes his car? Tyrannosaurus Wrecks!",
    "Why did the golfer bring two pairs of pants? In case he got a hole in one!",
    "What do you call a belt made of watches? A waist of time!",
    "Why did the tomato turn red? Because it saw the salad dressing!",
    "What do you call cheese that isn't yours? Nacho cheese!",
    "Why don't programmers like nature? It has too many bugs!",
    "What did one wall say to the other wall? I'll meet you at the corner!",
    "Why did the cookie go to the doctor? Because it felt crumbly!",
    "What do you call a parade of rabbits hopping backwards? A receding hare-line!",
    "Why don't oysters donate to charity? Because they're shellfish!",
    "What do you call a snowman with a six-pack? An abdominal snowman!",
    "Why did the stadium get hot? All the fans left!",
    "What do you call a lazy kangaroo? A pouch potato!",
    "Why don't scientists trust stairs? They're always up to something!",
    "What do you call a cow with no legs? Ground beef!",
    "Why did the smartphone go to therapy? It had too many hang-ups!",
    "What do you call a group of musical whales? An orca-stra!",
    "Why did the gym close down? It just didn't work out!",
    "What do you call a magic dog? A labracadabrador!",
    "Why don't mountains get cold? They wear snow caps!",
    "What do you call a sheep with no legs? A cloud!",
    "Why did the calendar get in trouble? Its days were numbered!",
    "What do you call a bee that lives in America? A USB!",
    "Why don't vampires go to barbecues? They don't like stakes!",
    "What do you call a pile of cats? A meowtain!",
    "Why did the computer go to the doctor? It had a virus!",
    "What do you call a fake stone? A shamrock!",
    "Why don't zombies eat comedians? They taste funny!",
    "What do you call a dinosaur with an extensive vocabulary? A thesaurus!",
    "Why did the picture go to jail? It was framed!",
    "What do you call a boomerang that won't come back? A stick!",
    "Why don't elephants use computers? They're afraid of the mouse!",
    "What do you call a dog magician? A labracadabrador!",
    "Why did the mushroom go to the party? Because he was a fungi!",
    "What do you call a singing laptop? A Dell!",
    "Why don't trees use social media? They prefer to branch out naturally!",
    "What do you call a bear in the rain? A drizzly bear!",
    "Why did the banana go to the doctor? It wasn't peeling well!",
    "What do you call a sleeping pizza? A piZZZa!",
    "Why don't teddy bears eat dessert? They're always stuffed!",
    "What do you call a cow during an earthquake? A milkshake!",
    "Why did the orange stop rolling? It ran out of juice!",
    "What do you call a knight who's afraid to fight? Sir Render!",
    "Why don't eggs make good comedians? They always crack up!",
    "What do you call a rabbit with fleas? Bugs Bunny!",
    "Why did the chicken join a band? Because it had drumsticks!",
    "What do you call a sleeping dinosaur? A dino-snore!",
    "Why don't pencils ever win races? They always get the lead out!",
    "What do you call a sad coffee? A depresso!",
    "Why did the moon skip dinner? It was too full!",
    "What do you call a belt with a watch on it? A waist of time!",
    "Why don't skeletons ever go trick or treating? Nobody to go with!",
    "What do you call a pig that does karate? A pork chop!",
    "Why did the invisible man turn down the job? He couldn't see himself doing it!",
    "What do you call a duck that gets all A's? A wise quacker!",
    "Why don't bakers ever get rich? They don't make enough dough!",
    "What do you call a laughing motorcycle? A Yamahahaha!",
    "Why did the student eat homework? The teacher said it was a piece of cake!",
    "What do you call a tooth in a glass of water? A one molar solution!",
    "Why don't books ever get cold? They have too many covers!",
    "What do you call a factory that makes okay products? A satisfactory!",
    "Why did the scarecrow become a motivational speaker? He was outstanding in his field!",
    "What do you call a group of disorganized cats? A cat-astrophe!",
    "Why don't eggs tell secrets? They might crack under pressure!",
    "What do you call a can opener that doesn't work anymore? A can't opener!",
    "Why did the math teacher retire? She had too many problems!",
    "What do you call a pig who knows karate? A pork chop!",
    "Why don't windows ever get lonely? They come in panes!",
    "What do you call a broken pencil? Pointless!",
    "Why did the golfer bring two pairs of pants? In case he got a hole in one!",
    "What do you call a line of rabbits walking backwards? A receding hare line!",
    "Why don't crabs ever share? Because they're shellfish!",
    "What do you call a computer that sings? A-Dell!",
    "Why did the cookie go to the hospital? It felt crumbly!",
    "What do you call a bear with no teeth? A gummy bear!",
    "Why don't mountains ever get cold? They wear snow caps!",
    "What do you call a fly without wings? A walk!",
    "Why did the tomato blush? It saw the salad dressing!",
    "What do you call a sheep covered in chocolate? A candy baa!",
    "Why don't basketball players go on vacation? They'd get called for traveling!",
    "What do you call a snowman in summer? A puddle!",
    "Why did the bicycle refuse to stand up? It was two tired!",
    "What do you call a dinosaur fart? A blast from the past!",
    "Why don't scientists trust atoms anymore? They make up everything!",
    "What do you call a train loaded with toffee? A chew chew train!",
  ];

  const robotGreetings = [
    "Greetings, human! I am DrinkBot3000, at your service! 🤖",
    "Beep boop! Ready to track your beverages, dear patron! 🎩",
    "*mechanical bow* Your robotic butler reporting for duty! 🤖",
    "Salutations! Let us monitor your consumption with precision! 🍷",
    "*whirrs politely* I shall keep watch over your evening! 🎩",
  ];

  const robotComments = [
    "*calculates thoughtfully* Most interesting data, human! 🤖",
    "Beep boop! My circuits detect you're having quite an evening! 🎩",
    "*adjusts monocle* I say, do pace yourself, good patron! 🧐",
    "*whirrs concernedly* Perhaps some water, dear human? 💧",
    "My sensors suggest moderation would be wise! 🤖",
    "*beeps approvingly* Excellent hydration protocols detected! 💦",
    "*mechanical nod* You're doing splendidly, if I may say! 🎩",
  ];

  const robotJokes = [
    "*adjusts bow tie* Why did I go to bartender school? To serve you better! 🤖",
    "Beep boop! I don't drink, but I'm always charged! ⚡",
    "*polishes glass* What's my favorite drink? Motor oil martini! 🍸",
    "Why don't robots get drunk? We're always auto-sober! 🤖",
    "*mechanical chuckle* I may be made of metal, but my service is golden! ✨",
  ];

  const getBodyWaterConstant = (g) => g === 'male' ? 0.68 : 0.55;
  const metabolismRate = 0.015;

  const calculateBAC = () => {
    if (mode === 'estimate') {
      if (!estimateDrinks || !estimateHours) return 0;

      const weightKg = parseFloat(weight) * 0.453592;
      const bodyWater = getBodyWaterConstant(gender);
      const numDrinks = parseFloat(estimateDrinks);
      const hours = parseFloat(estimateHours);

      const totalAlcoholGrams = numDrinks * 14;
      const initialBAC = (totalAlcoholGrams / (weightKg * bodyWater * 1000)) * 100;
      const metabolized = metabolismRate * hours;

      return Math.max(0, initialBAC - metabolized);
    }

    if (!startTime || drinks.length === 0) return 0;

    const weightKg = parseFloat(weight) * 0.453592;
    const bodyWater = getBodyWaterConstant(gender);
    const currentTime = Date.now();

    let adjustedBAC = 0;

    drinks.forEach(drink => {
      const standardDrinks = drink.standardDrinks || 1;
      const alcoholGrams = standardDrinks * 14;
      const hoursElapsed = (currentTime - drink.timestamp) / (1000 * 60 * 60);

      const drinkBAC = (alcoholGrams / (weightKg * bodyWater * 1000)) * 100;
      const metabolized = metabolismRate * hoursElapsed;
      const currentDrinkBAC = Math.max(0, drinkBAC - metabolized);

      adjustedBAC += currentDrinkBAC;
    });

    return Math.max(0, adjustedBAC);
  };

  useEffect(() => {
    if (!setupComplete) return;

    const interval = setInterval(() => {
      setBac(calculateBAC());
    }, 1000);

    return () => clearInterval(interval);
  }, [drinks, setupComplete, gender, weight, startTime, mode, estimateDrinks, estimateHours]);

  const handleSetup = () => {
    if (gender && weight && parseFloat(weight) > 0) {
      setSetupComplete(true);
      if (mode === 'live') {
        setStartTime(Date.now());
      }
      const greeting = robotGreetings[Math.floor(Math.random() * robotGreetings.length)];
      setRobotMessage(greeting);
      setTimeout(() => setRobotMessage(''), 5000);
    }
  };

  const handleModeSelect = (selectedMode) => {
    setMode(selectedMode);
  };

  const resetApp = () => {
    setSetupComplete(false);
    setMode('');
    setGender('');
    setWeight('');
    setDrinks([]);
    setBac(0);
    setStartTime(null);
    setEstimateDrinks('');
    setEstimateHours('');
    setActiveTab('tracker');
    setCalcDrinks('');
    setCalcHours('');
    setCalcBAC(null);
    setShowSettings(false);
    setRobotMessage('');
  };

  const addDrink = () => {
    const newDrink = {
      id: Date.now(),
      timestamp: Date.now(),
      standardDrinks: 1
    };
    setDrinks([...drinks, newDrink]);

    const comment = robotComments[Math.floor(Math.random() * robotComments.length)];
    setRobotMessage(comment);
    setTimeout(() => setRobotMessage(''), 5000);
  };

  const undoDrink = () => {
    if (drinks.length > 0) {
      setDrinks(drinks.slice(0, -1));
      setRobotMessage('*beep boop* Last drink removed from records! 🤖');
      setTimeout(() => setRobotMessage(''), 5000);
    }
  };

  const addCustomDrink = (oz, abv) => {
    const pureAlcoholOz = parseFloat(oz) * (parseFloat(abv) / 100);
    const standardDrinks = pureAlcoholOz / 0.6;

    const newDrink = {
      id: Date.now(),
      timestamp: Date.now(),
      standardDrinks: standardDrinks
    };
    setDrinks([...drinks, newDrink]);

    setRobotMessage(`*calculates precisely* That's ${standardDrinks.toFixed(1)} standard drinks! 🤖`);
    setTimeout(() => setRobotMessage(''), 5000);
  };

  const resetDrinkCount = () => {
    if (confirm('Reset your drink count? This will clear all tracked drinks and restart your BAC calculation.')) {
      setDrinks([]);
      setBac(0);
      setStartTime(Date.now());
      setRobotMessage('*beep boop* Drink count reset! Starting fresh! 🤖');
      setTimeout(() => setRobotMessage(''), 5000);
    }
  };

  const tellJoke = () => {
    const allJokes = [...jokes, ...robotJokes];
    const randomJoke = allJokes[Math.floor(Math.random() * allJokes.length)];
    setCurrentJoke(randomJoke);
    setShowJoke(true);
    setTimeout(() => setShowJoke(false), 5000);
  };

  const calculateQuickBAC = () => {
    if (!gender || !weight || !calcDrinks || !calcHours) return;

    const weightKg = parseFloat(weight) * 0.453592;
    const bodyWater = getBodyWaterConstant(gender);
    const numDrinks = parseFloat(calcDrinks);
    const hours = parseFloat(calcHours);

    const totalAlcoholGrams = numDrinks * 14;
    const initialBAC = (totalAlcoholGrams / (weightKg * bodyWater * 1000)) * 100;
    const metabolized = metabolismRate * hours;

    const result = Math.max(0, initialBAC - metabolized);
    setCalcBAC(result);
  };

  const getBACStatus = () => {
    const currentBAC = calcBAC !== null && activeTab === 'calculator' ? calcBAC : bac;
    if (currentBAC === 0) return { text: 'Sober', color: 'text-green-600', bg: 'bg-green-50' };
    if (currentBAC < 0.03) return { text: 'Mild', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    if (currentBAC < 0.08) return { text: 'Impaired', color: 'text-orange-600', bg: 'bg-orange-50' };
    return { text: 'Intoxicated', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const NavBar = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg" style={{ zIndex: 9999 }}>
      <div className="max-w-md mx-auto grid grid-cols-3 gap-1">
        <button
          onClick={() => {
            setActiveTab('tracker');
            setShowSettings(false);
          }}
          className={`py-4 flex flex-col items-center justify-center transition ${
            activeTab === 'tracker' && !showSettings
              ? 'text-indigo-600 bg-indigo-50'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Activity className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">Tracker</span>
        </button>
        <button
          onClick={() => {
            setActiveTab('calculator');
            setShowSettings(false);
          }}
          className={`py-4 flex flex-col items-center justify-center transition ${
            activeTab === 'calculator' && !showSettings
              ? 'text-indigo-600 bg-indigo-50'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Calculator className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">Calculator</span>
        </button>
        <button
          onClick={() => setShowSettings(true)}
          className={`py-4 flex flex-col items-center justify-center transition ${
            showSettings
              ? 'text-indigo-600 bg-indigo-50'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Settings className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">Settings</span>
        </button>
      </div>
    </div>
  );

  const status = getBACStatus();

  if (showSplash) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-900 p-6 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 mb-6 bg-red-100 rounded-full">
              <AlertCircle className="w-16 h-16 text-red-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Every 42 Minutes</h1>
            <p className="text-xl text-gray-700 mb-6">
              Someone dies from drunk driving in the USA
            </p>
            <div className="bg-red-50 rounded-lg p-4 mb-6 border-2 border-red-200">
              <p className="text-gray-700 font-medium">
                DrinkBot3000 helps you track your BAC and make responsible decisions.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowSplash(false)}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-lg"
          >
            Continue to App
          </button>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 italic">
              Please drink responsibly. Never drink and drive.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (showSettings && setupComplete) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 pb-24">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-slate-700 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl">🤖</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Settings</h2>
                  <p className="text-gray-600">*whirrs* Adjust your preferences!</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User className="inline w-4 h-4 mr-1" />
                      Gender
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button onClick={() => setGender('male')} className={`py-3 px-4 rounded-lg font-medium transition ${gender === 'male' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Male</button>
                      <button onClick={() => setGender('female')} className={`py-3 px-4 rounded-lg font-medium transition ${gender === 'female' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Female</button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2"><Weight className="inline w-4 h-4 mr-1" />Weight (lbs)</label>
                    <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="Enter your weight" className="w-full px-4 py-3 border border-gray-300 rounded-lg" min="1" />
                  </div>

                  {mode === 'live' && (
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Custom Drink</h3>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Alcohol % (ABV)</label>
                        <div className="grid grid-cols-3 gap-2 mb-2">
                          <button onClick={() => setCustomDrinkABV('7')} className={`py-2 px-3 rounded-lg font-medium ${customDrinkABV === '7' ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-700'}`}>7%</button>
                          <button onClick={() => setCustomDrinkABV('9')} className={`py-2 px-3 rounded-lg font-medium ${customDrinkABV === '9' ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-700'}`}>9%</button>
                          <button onClick={() => setCustomDrinkABV('12')} className={`py-2 px-3 rounded-lg font-medium ${customDrinkABV === '12' ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-700'}`}>12%</button>
                        </div>
                        <div className="grid grid-cols-3 gap-2 mb-2">
                          <button onClick={() => setCustomDrinkABV('15')} className={`py-2 px-3 rounded-lg font-medium ${customDrinkABV === '15' ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-700'}`}>15%</button>
                          <button onClick={() => setCustomDrinkABV('20')} className={`py-2 px-3 rounded-lg font-medium ${customDrinkABV === '20' ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-700'}`}>20%</button>
                          <button onClick={() => setCustomDrinkABV('40')} className={`py-2 px-3 rounded-lg font-medium ${customDrinkABV === '40' ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-700'}`}>40%</button>
                        </div>
                        <div className="grid grid-cols-3 gap-2 mb-3">
                          <button onClick={() => setCustomDrinkABV('55')} className={`py-2 px-3 rounded-lg font-medium ${customDrinkABV === '55' ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-700'}`}>55%</button>
                          <button onClick={() => setCustomDrinkABV('75.5')} className={`py-2 px-3 rounded-lg font-medium ${customDrinkABV === '75.5' ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-700'}`}>75.5%</button>
                          <button onClick={() => setCustomDrinkABV('95')} className={`py-2 px-3 rounded-lg font-medium ${customDrinkABV === '95' ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-700'}`}>95%</button>
                        </div>
                        <input type="number" value={customDrinkABV} onChange={(e) => setCustomDrinkABV(e.target.value)} placeholder="Or enter custom %" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm" min="0" max="100" step="0.5" />
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Volume (oz)</label>
                        <input type="number" value={customDrinkOz} onChange={(e) => setCustomDrinkOz(e.target.value)} placeholder="Enter ounces" className="w-full px-4 py-3 border border-gray-300 rounded-lg" min="0" step="0.5" />
                      </div>

                      <button onClick={() => { if (customDrinkOz && customDrinkABV) { addCustomDrink(customDrinkOz, customDrinkABV); setCustomDrinkOz(''); setShowSettings(false); setActiveTab('tracker'); }}} disabled={!customDrinkOz || !customDrinkABV} className="w-full bg-amber-600 text-white py-3 rounded-xl font-semibold hover:bg-amber-700 transition disabled:bg-gray-300">
                        <Beer className="inline w-5 h-5 mr-2" />
                        Add Custom Drink
                      </button>
                    </div>
                  )}

                  <button onClick={() => setShowSettings(false)} className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition">
                    Close Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <NavBar />
      </>
    );
  }

  if (activeTab === 'calculator' && setupComplete) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 pb-24">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-slate-700 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl">🤖</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Quick BAC Calculator</h2>
                  <p className="text-gray-600">*beep boop* Let me calculate for you!</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2"><Beer className="inline w-4 h-4 mr-1" />Number of Drinks</label>
                    <input type="number" value={calcDrinks} onChange={(e) => setCalcDrinks(e.target.value)} placeholder="How many?" className="w-full px-4 py-3 border border-gray-300 rounded-lg" min="0" step="0.5" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hours Since First Drink</label>
                    <input type="number" value={calcHours} onChange={(e) => setCalcHours(e.target.value)} placeholder="How long ago?" className="w-full px-4 py-3 border border-gray-300 rounded-lg" min="0" step="0.5" />
                  </div>

                  <button onClick={calculateQuickBAC} disabled={!calcDrinks || !calcHours} className="w-full bg-indigo-600 text-white py-4 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:bg-gray-300">
                    Calculate BAC
                  </button>
                </div>

                {calcBAC !== null && (
                  <>
                    <div className={`mt-6 ${status.bg} p-6 rounded-xl text-center`}>
                      <h3 className="text-sm font-medium text-gray-600 mb-2">Your Estimated BAC</h3>
                      <div className={`text-5xl font-bold ${status.color} mb-2`}>{calcBAC.toFixed(3)}%</div>
                      <div className={`inline-block px-4 py-1 rounded-full ${status.color} bg-white bg-opacity-50 font-semibold`}>{status.text}</div>
                      {calcBAC > 0 && (
                        <div className="mt-4 text-sm text-gray-700">
                          <strong>Sober At:</strong> {(() => {
                            const minutesToSober = Math.ceil((calcBAC / metabolismRate) * 60);
                            const soberTime = new Date(Date.now() + minutesToSober * 60000);
                            return soberTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
                          })()}
                        </div>
                      )}
                    </div>

                    <div className="mt-4 bg-gradient-to-r from-slate-700 to-slate-800 text-white p-4 rounded-xl border-2 border-slate-600 shadow-lg">
                      <p className="text-center font-medium">
                        {calcBAC === 0
                          ? "*beeps approvingly* All clear, human! You're sober! ✨"
                          : calcBAC < 0.08
                            ? "*whirrs thoughtfully* Even below the legal limit, impairment begins at any BAC. Do not drive! 🤖"
                            : "*concerned beeping* You are over the legal limit! Do not drive under any circumstances! 🎩"}
                      </p>
                    </div>
                  </>
                )}

                <button onClick={tellJoke} className="w-full mt-6 bg-purple-600 text-white py-4 rounded-xl font-semibold hover:bg-purple-700 transition flex items-center justify-center">
                  <Smile className="w-6 h-6 mr-2" />
                  Tell Me a Joke
                </button>

                {showJoke && (
                  <div className="mt-4 bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-xl">
                    <p className="text-center text-gray-800 font-medium">{currentJoke}</p>
                  </div>
                )}
              </div>

              <div className="p-6 bg-gray-50 border-t border-gray-200">
                <div className="text-xs text-gray-600 space-y-2">
                  <p><strong>Standard Drink:</strong> 12oz beer (5%), 5oz wine (12%), or 1.5oz spirits (40%)</p>
                  <p><strong>Metabolism:</strong> Average rate is 0.015% per hour</p>
                </div>
              </div>

              <div className="p-6 bg-red-50 border-t border-red-200">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-red-800">
                    <strong>Legal Limit:</strong> 0.08% in most US states. This is an estimate only. Do not drive after drinking.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <NavBar />
      </>
    );
  }

  if (!setupComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-6xl">🤖</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">DrinkBot3000</h1>
            <p className="text-gray-600">Track your blood alcohol content</p>
          </div>

          {!mode ? (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 text-center mb-4">Choose Mode</h2>
              <button onClick={() => handleModeSelect('live')} className="w-full bg-indigo-600 text-white py-4 rounded-lg font-semibold hover:bg-indigo-700 transition">
                Live Tracking
                <p className="text-sm font-normal mt-1">Track drinks in real-time</p>
              </button>
              <button onClick={() => handleModeSelect('estimate')} className="w-full bg-purple-600 text-white py-4 rounded-lg font-semibold hover:bg-purple-700 transition">
                Quick Estimate
                <p className="text-sm font-normal mt-1">Already been drinking?</p>
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2"><User className="inline w-4 h-4 mr-1" />Gender</label>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => setGender('male')} className={`py-3 px-4 rounded-lg font-medium transition ${gender === 'male' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'}`}>Male</button>
                  <button onClick={() => setGender('female')} className={`py-3 px-4 rounded-lg font-medium transition ${gender === 'female' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'}`}>Female</button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2"><Weight className="inline w-4 h-4 mr-1" />Weight (lbs)</label>
                <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="Enter your weight" className="w-full px-4 py-3 border border-gray-300 rounded-lg" min="1" />
              </div>

              {mode === 'estimate' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2"><Beer className="inline w-4 h-4 mr-1" />Number of Drinks</label>
                    <input type="number" value={estimateDrinks} onChange={(e) => setEstimateDrinks(e.target.value)} placeholder="How many drinks?" className="w-full px-4 py-3 border border-gray-300 rounded-lg" min="0" step="0.5" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hours Since First Drink</label>
                    <input type="number" value={estimateHours} onChange={(e) => setEstimateHours(e.target.value)} placeholder="How many hours ago?" className="w-full px-4 py-3 border border-gray-300 rounded-lg" min="0" step="0.5" />
                  </div>
                </>
              )}

              <button onClick={handleSetup} disabled={!gender || !weight || (mode === 'estimate' && (!estimateDrinks || !estimateHours))} className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:bg-gray-300">
                {mode === 'estimate' ? 'Calculate BAC' : 'Start Tracking'}
              </button>

              <button onClick={() => { setMode(''); setGender(''); setWeight(''); setEstimateDrinks(''); setEstimateHours(''); }} className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-300 transition">
                Back
              </button>
            </div>
          )}

          <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-amber-600 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800">This app provides estimates only. Never drink and drive.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {robotMessage && (
        <div className="fixed top-20 left-0 right-0 px-6 z-40 pointer-events-none">
          <div className="max-w-md mx-auto">
            <div className="bg-gradient-to-r from-slate-700 to-slate-800 text-white p-4 rounded-xl border-2 border-slate-600 shadow-2xl animate-pulse">
              <p className="text-center font-medium">{robotMessage}</p>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 pb-24">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className={`${status.bg} p-8 text-center`}>
              <div className="mb-4">
                <div className="w-16 h-16 bg-slate-700 rounded-xl flex items-center justify-center mx-auto">
                  <span className="text-4xl">🤖</span>
                </div>
              </div>

              <h2 className="text-sm font-medium text-gray-600 mb-2">Current BAC</h2>
              <div className={`text-6xl font-bold ${status.color} mb-2`}>{bac.toFixed(3)}%</div>
              <div className={`inline-block px-4 py-1 rounded-full ${status.color} bg-white bg-opacity-50 font-semibold`}>{status.text}</div>
            </div>

            <div className="p-6 bg-gray-50 border-b border-gray-200">
              <div className="grid grid-cols-2 gap-4 text-center mb-4">
                <div>
                  <div className="text-2xl font-bold text-gray-800">{mode === 'estimate' ? estimateDrinks : drinks.length}</div>
                  <div className="text-sm text-gray-600">Drinks</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-800">
                    {bac > 0 ? (() => {
                      const minutesToSober = Math.ceil((bac / metabolismRate) * 60);
                      const soberTime = new Date(Date.now() + minutesToSober * 60000);
                      return soberTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
                    })() : '--:--'}
                  </div>
                  <div className="text-sm text-gray-600">Sober At</div>
                </div>
              </div>

              {mode === 'live' && drinks.length > 0 && (
                <button onClick={undoDrink} className="w-full bg-orange-100 text-orange-700 py-2 rounded-lg font-medium hover:bg-orange-200 transition text-sm">
                  Undo Last Drink
                </button>
              )}
            </div>

            {mode === 'live' && (
              <div className="p-6 space-y-3">
                <button onClick={addDrink} className="w-full bg-indigo-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-indigo-700 transition flex items-center justify-center shadow-lg">
                  <Beer className="w-6 h-6 mr-2" />
                  Add Drink
                </button>

                <button onClick={tellJoke} className="w-full bg-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-purple-700 transition flex items-center justify-center shadow-lg">
                  <Smile className="w-6 h-6 mr-2" />
                  Tell Me a Joke
                </button>
              </div>
            )}

            {mode === 'estimate' && (
              <div className="p-6">
                <button onClick={tellJoke} className="w-full bg-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-purple-700 transition flex items-center justify-center shadow-lg">
                  <Smile className="w-6 h-6 mr-2" />
                  Tell Me a Joke
                </button>
              </div>
            )}

            {showJoke && (
              <div className="px-6 pb-6">
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-xl border-2 border-purple-300 animate-pulse">
                  <p className="text-center text-gray-800 font-medium">{currentJoke}</p>
                </div>
              </div>
            )}

            <div className="p-6 bg-gray-50">
              <div className="text-xs text-gray-600 space-y-2">
                <p><strong>Profile:</strong> {gender === 'male' ? 'Male' : 'Female'}, {weight} lbs</p>
                <p><strong>Standard Drink:</strong> 12oz beer (5%), 5oz wine (12%), or 1.5oz spirits (40%)</p>
              </div>
            </div>

            <div className="p-6 bg-red-50 border-t border-red-200">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-red-800">
                  <strong>Legal Limit:</strong> 0.08% in most US states. This is an estimate only. Do not drive after drinking.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <NavBar />
    </>
  );
}
