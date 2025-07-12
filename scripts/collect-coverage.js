#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function copyFile(src, dest) {
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`✅ Copied ${src} to ${dest}`);
    return true;
  }
  console.log(`⚠️  File not found: ${src}`);
  return false;
}

function analyzeCoverageFile(filePath) {
  try {
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const files = Object.keys(content);
    let totalStatements = 0;
    let coveredStatements = 0;
    let totalFunctions = 0;
    let coveredFunctions = 0;
    let totalBranches = 0;
    let coveredBranches = 0;
    let totalLines = 0;
    let coveredLines = 0;

    files.forEach(file => {
      const fileData = content[file];
      if (fileData.s) {
        totalStatements += Object.keys(fileData.s).length;
        coveredStatements += Object.values(fileData.s).filter(v => v > 0).length;
      }
      if (fileData.f) {
        totalFunctions += Object.keys(fileData.f).length;
        coveredFunctions += Object.values(fileData.f).filter(v => v > 0).length;
      }
      if (fileData.b) {
        const branches = Object.values(fileData.b);
        branches.forEach(branch => {
          if (Array.isArray(branch)) {
            totalBranches += branch.length;
            coveredBranches += branch.filter(v => v > 0).length;
          }
        });
      }
      if (fileData.l) {
        const lineNumbers = Object.keys(fileData.l).map(Number);
        if (lineNumbers.length > 0) {
          totalLines += lineNumbers.length;
          coveredLines += Object.values(fileData.l).filter(v => v > 0).length;
        }
      }
    });

    return {
      files: files.length,
      statements: totalStatements > 0 ? Math.round((coveredStatements / totalStatements) * 100) : 0,
      functions: totalFunctions > 0 ? Math.round((coveredFunctions / totalFunctions) * 100) : 0,
      branches: totalBranches > 0 ? Math.round((coveredBranches / totalBranches) * 100) : 0,
      lines: totalLines > 0 ? Math.round((coveredLines / totalLines) * 100) : 0
    };
  } catch (e) {
    return null;
  }
}

function collectCoverage() {
  console.log('\n🧪 Collecting coverage reports from all packages...\n');
  
  const rootDir = process.cwd();
  const coverageDir = path.join(rootDir, 'coverage');
  const rawDir = path.join(coverageDir, 'raw');

  // Ensure directories exist
  ensureDir(rawDir);

  let filesCollected = 0;
  const coverageStats = {};

  // Collect web app coverage
  const webCoverage = path.join(rootDir, 'apps/web/coverage/coverage-final.json');
  if (copyFile(webCoverage, path.join(rawDir, 'web-coverage.json'))) {
    filesCollected++;
    const stats = analyzeCoverageFile(webCoverage);
    if (stats) {
      coverageStats['Web App'] = stats;
    }
  }

  // Collect API coverage
  const apiCoverage = path.join(rootDir, 'apps/api/coverage/coverage-final.json');
  if (copyFile(apiCoverage, path.join(rawDir, 'api-coverage.json'))) {
    filesCollected++;
    const stats = analyzeCoverageFile(apiCoverage);
    if (stats) {
      coverageStats['API'] = stats;
    }
  }

  // Collect package coverage
  const packagesDir = path.join(rootDir, 'packages');
  if (fs.existsSync(packagesDir)) {
    const packages = fs.readdirSync(packagesDir);
    packages.forEach(packageName => {
      const packageCoverage = path.join(packagesDir, packageName, 'coverage/coverage-final.json');
      if (copyFile(packageCoverage, path.join(rawDir, `${packageName}-coverage.json`))) {
        filesCollected++;
        const stats = analyzeCoverageFile(packageCoverage);
        if (stats) {
          coverageStats[`@repo/${packageName}`] = stats;
        }
      }
    });
  }

  console.log(`\n📊 Collected ${filesCollected} coverage files\n`);
  
  if (filesCollected === 0) {
    console.log('⚠️  No coverage files found. Make sure to run tests with coverage first.');
    process.exit(1);
  }

  // Display summary
  if (Object.keys(coverageStats).length > 0) {
    console.log('📈 Individual Package Coverage Summary:');
    console.log('─'.repeat(70));
    console.log('Package'.padEnd(20) + 'Files'.padEnd(8) + 'Statements'.padEnd(12) + 'Functions'.padEnd(12) + 'Branches'.padEnd(10) + 'Lines');
    console.log('─'.repeat(70));
    
    Object.entries(coverageStats).forEach(([name, stats]) => {
      console.log(
        name.padEnd(20) + 
        stats.files.toString().padEnd(8) + 
        `${stats.statements}%`.padEnd(12) + 
        `${stats.functions}%`.padEnd(12) + 
        `${stats.branches}%`.padEnd(10) + 
        `${stats.lines}%`
      );
    });
    console.log('─'.repeat(70));
    console.log('\n🔄 Merging all coverage reports...\n');
  }

  return filesCollected;
}

if (require.main === module) {
  collectCoverage();
}

module.exports = { collectCoverage };
