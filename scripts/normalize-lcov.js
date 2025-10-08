#!/usr/bin/env node
/*
 Cross-platform normalization of lcov paths.
 Replaces backslashes with forward slashes ONLY on lines starting with SF: to avoid
 corrupting any other potential content.
*/
const fs = require('fs');
const path = require('path');

const lcovPath = path.resolve(__dirname, '..', 'coverage', 'lcov.info');
if (!fs.existsSync(lcovPath)) {
  console.error(`[normalize-lcov] File not found: ${lcovPath}`);
  process.exit(0); // Don't fail pipeline; Sonar step will show if missing
}

try {
  const original = fs.readFileSync(lcovPath, 'utf8').split(/\r?\n/);
  const transformed = original.map(line => {
    if (line.startsWith('SF:')) {
      return 'SF:' + line.slice(3).replace(/\\\\/g, '/');
    }
    return line;
  });
  fs.writeFileSync(lcovPath, transformed.join('\n'), 'utf8');
  console.log('[normalize-lcov] Normalization complete.');
} catch (err) {
  console.error('[normalize-lcov] Error normalizing lcov:', err);
  process.exit(1);
}
