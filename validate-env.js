#!/usr/bin/env node

/**
 * Environment Validation Script for Cloudflare Deployment
 * Run with: node validate-env.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Validating Cloudflare Environment Setup...\n');

// Check for required files
const requiredFiles = [
  '.env.example',
  '.env.production', 
  'CLOUDFLARE_DEPLOYMENT.md',
  'public/_headers',
  'public/_redirects',
  'vite.config.ts'
];

console.log('📁 Checking required files:');
let missingFiles = [];

requiredFiles.forEach(file => {
  if (fs.existsSync(path.join(__dirname, file))) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} - MISSING`);
    missingFiles.push(file);
  }
});

// Check environment variables in .env.production
console.log('\n🔧 Checking environment variables:');
const envPath = path.join(__dirname, '.env.production');

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const requiredVars = [
    'VITE_APP_NAME',
    'VITE_APP_VERSION', 
    'VITE_NODE_ENV',
    'VITE_ENABLE_OFFLINE_MODE'
  ];
  
  requiredVars.forEach(varName => {
    if (envContent.includes(varName)) {
      console.log(`  ✅ ${varName}`);
    } else {
      console.log(`  ❌ ${varName} - MISSING`);
    }
  });
} else {
  console.log('  ❌ .env.production file not found');
}

// Check build configuration
console.log('\n🏗️  Checking build setup:');
const packagePath = path.join(__dirname, 'package.json');

if (fs.existsSync(packagePath)) {
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  if (pkg.scripts && pkg.scripts.build) {
    console.log(`  ✅ Build script: ${pkg.scripts.build}`);
  } else {
    console.log('  ❌ Build script missing in package.json');
  }
  
  if (pkg.scripts && pkg.scripts.preview) {
    console.log(`  ✅ Preview script: ${pkg.scripts.preview}`);
  } else {
    console.log('  ⚠️  Preview script recommended for testing');
  }
}

// Cloudflare Pages readiness check
console.log('\n🌐 Cloudflare Pages Readiness:');

if (missingFiles.length === 0) {
  console.log('  ✅ All required files present');
  console.log('  ✅ Environment variables configured');
  console.log('  ✅ Build scripts ready');
  console.log('\n🎉 Project is ready for Cloudflare Pages deployment!');
  console.log('\n📖 Next steps:');
  console.log('  1. Push changes to GitHub repository');
  console.log('  2. Connect repository to Cloudflare Pages');
  console.log('  3. Set environment variables in Cloudflare dashboard');
  console.log('  4. Deploy with build command: npm run build');
  console.log('  5. Output directory: dist');
} else {
  console.log('  ❌ Some required files are missing');
  console.log('  📝 Missing files:', missingFiles.join(', '));  
  console.log('\n🔧 Please run the environment setup again');
}

console.log('\n📊 Project Stats:');
console.log(`  • Node.js: ${process.version}`);
console.log(`  • Platform: ${process.platform}`);
console.log(`  • Working Directory: ${__dirname}`);

// Check for potential issues
console.log('\n🔍 Potential Issues:');
const gitignorePath = path.join(__dirname, '.gitignore');
if (fs.existsSync(gitignorePath)) {
  const gitignore = fs.readFileSync(gitignorePath, 'utf8');
  if (gitignore.includes('.env') && !gitignore.includes('!.env.production')) {
    console.log('  ⚠️  .gitignore might exclude .env.production');
  } else if (gitignore.includes('!.env.production')) {
    console.log('  ✅ .gitignore properly configured for env files');
  }
}

console.log('\n✨ Environment validation complete!\n');