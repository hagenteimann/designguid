#!/usr/bin/env node

/**
 * Generate static files for the SPA
 * Copies public/* files to dist/ and generates dynamic content
 */

const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '../public');
const DIST_DIR = path.join(__dirname, '../dist');

console.log('[Static Files] Generating static files...');

// Ensure dist directory exists
if (!fs.existsSync(DIST_DIR)) {
  fs.mkdirSync(DIST_DIR, { recursive: true });
}

/**
 * Copy static files from public to dist
 */
function copyStaticFiles() {
  const filesToCopy = [
    '404.html',
    'robots.txt',
    'sitemap.xml',
    'manifest.json',
    '_headers',
    'sw.js'
  ];

  filesToCopy.forEach((file) => {
    const src = path.join(PUBLIC_DIR, file);
    const dest = path.join(DIST_DIR, file);

    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      console.log(`  ✓ Copied ${file}`);
    } else {
      console.warn(`  ⚠ File not found: ${file}`);
    }
  });
}

/**
 * Create .nojekyll file to prevent Jekyll processing
 */
function createNoJekyll() {
  const noJekyllPath = path.join(DIST_DIR, '.nojekyll');
  fs.writeFileSync(noJekyllPath, '');
  console.log('  ✓ Created .nojekyll');
}

/**
 * Verify Service Worker is in dist
 */
function verifyServiceWorker() {
  const swPath = path.join(DIST_DIR, 'sw.js');
  if (fs.existsSync(swPath)) {
    const content = fs.readFileSync(swPath, 'utf-8');
    if (content.includes('CACHE_NAME')) {
      console.log('  ✓ Service Worker verified');
    } else {
      console.warn('  ⚠ Service Worker appears corrupted');
    }
  } else {
    console.warn('  ⚠ Service Worker not found in dist');
  }
}

/**
 * Create security headers file (for platforms that support it)
 */
function createSecurityHeaders() {
  const headersPath = path.join(DIST_DIR, '_headers');
  if (!fs.existsSync(headersPath)) {
    const content = `/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
`;
    fs.writeFileSync(headersPath, content);
    console.log('  ✓ Created _headers');
  }
}

/**
 * Main execution
 */
try {
  copyStaticFiles();
  createNoJekyll();
  createSecurityHeaders();
  verifyServiceWorker();
  console.log('[Static Files] Complete!\n');
} catch (error) {
  console.error('[Static Files] Error:', error);
  process.exit(1);
}
