const fs = require('fs').promises;
const path = require('path');
const config = require('../config/config');

async function initializeApp() {
  try {
    const uploadPath = path.resolve(config.upload.path);
    try {
      await fs.access(uploadPath);
    } catch {
      await fs.mkdir(uploadPath, { recursive: true });
    }

    const requiredEnvVars = ['JWT_SECRET', 'MONGODB_URI'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      console.warn('Warning: Missing environment variables:', missingVars.join(', '));
      console.warn('Please set these variables in your .env file');
    }
  } catch (error) {
    process.exit(1);
  }
}

if (require.main === module) {
  initializeApp();
}

module.exports = initializeApp;