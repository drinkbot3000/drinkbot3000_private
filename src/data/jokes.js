/**
 * Collection of family-friendly jokes for entertainment
 */

export const JOKES = [
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
  "Why did the mushroom go to the party? Because he was a fungi!",
  "What do you call a singing laptop? A Dell!",
  "Why don't trees use social media? They prefer to branch out naturally!",
  "What do you call a bear in the rain? A drizzly bear!",
];

export const ROBOT_JOKES = [
  "*adjusts bow tie* Why did I go to bartender school? To serve you better! 🤖",
  "Beep boop! I don't drink, but I'm always charged! ⚡",
  "*polishes glass* What's my favorite drink? Motor oil martini! 🍸",
  "Why don't robots get drunk? We're always auto-sober! 🤖",
  "*mechanical chuckle* I may be made of metal, but my service is golden! ✨",
];

/**
 * Get a random joke from the combined collection
 * @returns {string} A random joke
 */
export const getRandomJoke = () => {
  const allJokes = [...JOKES, ...ROBOT_JOKES];
  return allJokes[Math.floor(Math.random() * allJokes.length)];
};
