#!/usr/bin/env node

/**
 * Script to fix MUI barrel imports for better tree-shaking
 * 
 * Usage: node scripts/fix-mui-imports.js
 * 
 * This script will:
 * 1. Find all files with MUI barrel imports
 * 2. Convert them to direct imports
 * 3. Report the changes made
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// MUI packages to fix
const MUI_PACKAGES = [
  '@mui/material',
  '@mui/icons-material',
  '@mui/lab',
  '@mui/system',
];

// Find all JS/JSX/TS/TSX files
const files = glob.sync('src/**/*.{js,jsx,ts,tsx}', {
  ignore: ['**/node_modules/**', '**/dist/**', '**/*.test.*', '**/__tests__/**'],
});

let totalFixed = 0;
let filesModified = 0;

console.log(`🔍 Scanning ${files.length} files for MUI barrel imports...\n`);

files.forEach((filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  let fixCount = 0;

  MUI_PACKAGES.forEach((pkg) => {
    // Match: import { X, Y, Z } from '@mui/material';
    const barrelImportRegex = new RegExp(
      `import\\s*{([^}]+)}\\s*from\\s*['"]${pkg.replace('/', '\\/')}['"];?`,
      'g'
    );

    const matches = content.match(barrelImportRegex);
    
    if (matches) {
      matches.forEach((match) => {
        // Extract component names
        const componentsMatch = match.match(/import\s*{([^}]+)}/);
        if (!componentsMatch) return;

        const components = componentsMatch[1]
          .split(',')
          .map((c) => c.trim())
          .filter((c) => c.length > 0);

        // Generate direct imports
        const directImports = components
          .map((component) => {
            // Handle aliased imports: "Button as MuiButton"
            const aliasMatch = component.match(/^(\w+)\s+as\s+(\w+)$/);
            if (aliasMatch) {
              const [, original, alias] = aliasMatch;
              return `import ${alias} from '${pkg}/${original}';`;
            }
            return `import ${component} from '${pkg}/${component}';`;
          })
          .join('\n');

        // Replace barrel import with direct imports
        content = content.replace(match, directImports);
        modified = true;
        fixCount++;
      });
    }
  });

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    filesModified++;
    totalFixed += fixCount;
    console.log(`✅ Fixed ${fixCount} import(s) in: ${filePath}`);
  }
});

console.log(`\n📊 Summary:`);
console.log(`   Files scanned: ${files.length}`);
console.log(`   Files modified: ${filesModified}`);
console.log(`   Imports fixed: ${totalFixed}`);
console.log(`\n✨ Done! Your MUI imports are now optimized for tree-shaking.`);

if (filesModified > 0) {
  console.log(`\n⚠️  Note: Please review the changes and test your app.`);
  console.log(`   Some imports may need manual adjustment if they use:`)
  console.log(`   - Re-exports (e.g., styled from '@mui/material/styles')`);
  console.log(`   - Type imports`);
  console.log(`   - Default exports with named imports`);
}
