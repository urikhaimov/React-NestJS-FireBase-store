// setStorageCORS.js
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const projectId = 'onlinestoretemplate-59d3e'; // ✅ Replace with your actual Firebase project ID
const corsConfig = [
  {
    origin: [
      'http://localhost:4173',           // local dev
      'https://your-vercel-app.vercel.app' // ✅ replace with your actual Vercel domain
    ],
    method: ['GET', 'POST', 'PUT', 'DELETE'],
    maxAgeSeconds: 3600,
    responseHeader: ['Content-Type', 'Authorization']
  }
];

const tempFile = path.resolve('./cors.json');
fs.writeFileSync(tempFile, JSON.stringify(corsConfig, null, 2));

console.log('⚙️  Setting CORS config for Firebase Storage...');

try {
  execSync(
    `firebase storage:set-cors ${tempFile} --project ${projectId} --json`,
    { stdio: 'inherit' }
  );
  console.log('✅ CORS config successfully applied.');
} catch (error) {
  console.error('❌ Failed to set CORS:', error.message);
}

fs.unlinkSync(tempFile);
