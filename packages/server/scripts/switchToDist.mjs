import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Switch exports to use dist/ for production
Object.keys(packageJson.exports).forEach(key => {
  if (typeof packageJson.exports[key] === 'object') {
    if (packageJson.exports[key].import) {
      packageJson.exports[key].import = packageJson.exports[key].import.replace('./src/', './dist/');
    }
    if (packageJson.exports[key].require) {
      packageJson.exports[key].require = packageJson.exports[key].require.replace('./src/', './dist/');
    }
  } else if (typeof packageJson.exports[key] === 'string') {
    packageJson.exports[key] = packageJson.exports[key].replace('./src/', './dist/');
  }
});

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
console.log('✅ Switched to dist/ for production');