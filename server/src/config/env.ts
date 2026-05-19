import dotenv from 'dotenv';

// Load .env file FIRST — before anything else uses process.env
dotenv.config();

/**
 * Centralized environment configuration.
 *
 * WHY: Instead of writing process.env.PORT everywhere (which could be undefined
 * and has no type safety), we read all env vars ONCE here and export typed values.
 * If a required variable is missing, the app crashes immediately with a clear message
 * instead of failing randomly later.
 */
const env = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI || '',
  JWT_SECRET: process.env.JWT_SECRET || '',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
};

// Validate required env vars — fail fast with clear error messages
const requiredVars: (keyof typeof env)[] = ['MONGODB_URI', 'JWT_SECRET'];

for (const key of requiredVars) {
  if (!env[key]) {
    throw new Error(`❌ Missing required environment variable: ${key}. Check your .env file.`);
  }
}

export default env;
