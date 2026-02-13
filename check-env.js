// Environment Variable Checker
// Run this with: node check-env.js

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('=== Environment Variable Checker ===\n');

try {
  const envContent = readFileSync(join(__dirname, '.env'), 'utf-8');
  const lines = envContent.split('\n');
  
  const vars = {};
  lines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      const value = valueParts.join('=').split('#')[0].trim();
      if (key && value) {
        vars[key.trim()] = value;
      }
    }
  });
  
  console.log('Found environment variables:\n');
  
  const checkVar = (name, required = false) => {
    const value = vars[name];
    const status = value ? '✅' : (required ? '❌' : '⚠️');
    const display = value 
      ? (name.includes('KEY') ? `${value.substring(0, 10)}...` : value)
      : 'NOT SET';
    console.log(`${status} ${name}: ${display}`);
    return !!value;
  };
  
  // Check required variables
  console.log('Google AI Configuration:');
  const hasApiKey = checkVar('VITE_GOOGLE_AI_API_KEY', true);
  checkVar('VITE_GOOGLE_AI_MODEL');
  
  console.log('\nOther Configuration:');
  checkVar('VITE_API_URL');
  checkVar('VITE_MAPBOX_TOKEN');
  
  console.log('\n=== Summary ===');
  if (hasApiKey) {
    console.log('✅ Google AI is configured!');
    console.log('\n⚠️  IMPORTANT: If you just added these variables, you MUST restart your dev server!');
    console.log('   Stop the server (Ctrl+C) and run "npm run dev" again.');
  } else {
    console.log('❌ Google AI API key is missing!');
    console.log('\nTo fix this:');
    console.log('1. Get your API key from: https://makersuite.google.com/app/apikey');
    console.log('2. Add it to your .env file: VITE_GOOGLE_AI_API_KEY=your_key_here');
    console.log('3. Restart your dev server');
  }
  
} catch (error) {
  console.error('❌ Error reading .env file:', error.message);
  console.log('\nMake sure you have a .env file in the project root.');
}

console.log('\n====================================\n');
