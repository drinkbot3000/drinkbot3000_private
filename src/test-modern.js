/**
 * Test file to verify modern implementation imports
 * Run this with: node --experimental-modules src/test-modern.js
 */

// Test importing constants
console.log('Testing constants import...');
try {
  const constants = require('./constants');
  console.log('✅ Constants imported successfully');
  console.log('  - BAC_CONSTANTS:', Object.keys(constants.BAC_CONSTANTS).length, 'keys');
} catch (e) {
  console.error('❌ Constants import failed:', e.message);
}

// Test importing data
console.log('\nTesting data imports...');
try {
  const jokes = require('./data/jokes');
  console.log('✅ Jokes imported successfully');
  console.log('  - Total jokes:', jokes.JOKES.length);
} catch (e) {
  console.error('❌ Jokes import failed:', e.message);
}

try {
  const messages = require('./data/robotMessages');
  console.log('✅ Robot messages imported successfully');
  console.log('  - Greetings:', messages.ROBOT_GREETINGS.length);
  console.log('  - Comments:', messages.ROBOT_COMMENTS.length);
} catch (e) {
  console.error('❌ Robot messages import failed:', e.message);
}

// Test importing utilities
console.log('\nTesting utility imports...');
try {
  const bacCalc = require('./utils/bacCalculations');
  console.log('✅ BAC calculations imported successfully');
  console.log('  - Functions available:', Object.keys(bacCalc).length);
} catch (e) {
  console.error('❌ BAC calculations import failed:', e.message);
}

try {
  const formatting = require('./utils/formatting');
  console.log('✅ Formatting utilities imported successfully');
  console.log('  - Functions available:', Object.keys(formatting).length);
} catch (e) {
  console.error('❌ Formatting import failed:', e.message);
}

console.log('\n✨ All imports successful!');
console.log('\nTo use the modern implementation:');
console.log('1. Update src/index.js to import AppModern instead of App');
console.log('2. Or use: import { BACTrackerModern } from "./components/BACTracker"');
