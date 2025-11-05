#!/usr/bin/env node

/**
 * Patch react-native-worklets to support React Native 0.76.x
 * This is needed for Expo SDK 52 compatibility
 * Run this after npm install if you need to rebuild iOS
 */

const fs = require('fs');
const path = require('path');

const validationScriptPath = path.join(
  __dirname,
  '..',
  'node_modules',
  'react-native-worklets',
  'scripts',
  'validate-react-native-version.js'
);

if (!fs.existsSync(validationScriptPath)) {
  console.log('⚠️  react-native-worklets not found. Skipping patch.');
  process.exit(0);
}

let content = fs.readFileSync(validationScriptPath, 'utf8');

// Check if already patched
if (content.includes('0.76.')) {
  console.log('✅ react-native-worklets already patched');
  process.exit(0);
}

// Add patch before the prerelease check
const patch = `// Allow React Native 0.76.x for Expo SDK 52 compatibility
if (reactNativeVersion && reactNativeVersion.startsWith('0.76.')) {
  process.exit(0);
}

`;

const insertPoint = content.indexOf('if (semverPrerelease(reactNativeVersion))');
if (insertPoint !== -1) {
  content = content.slice(0, insertPoint) + patch + content.slice(insertPoint);
  fs.writeFileSync(validationScriptPath, content);
  console.log('✅ Patched react-native-worklets for React Native 0.76.x support');
} else {
  console.error('❌ Could not find insertion point in validation script');
  process.exit(1);
}


