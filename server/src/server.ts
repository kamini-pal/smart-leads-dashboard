import app from './app';
import env from './config/env';
import connectDB from './config/db';

/**
 * server.ts — Application entry point.
 *
 * This file does only TWO things:
 * 1. Connect to MongoDB
 * 2. Start the Express server
 *
 * WHY this order matters:
 * We connect to the database FIRST, then start listening for requests.
 * If DB connection fails, we exit immediately (no point serving requests
 * if we can't read/write data).
 */

const startServer = async (): Promise<void> => {
  // Step 1: Connect to MongoDB (exits process if it fails)
  await connectDB();

  // Step 2: Start listening for HTTP requests
  app.listen(env.PORT, () => {
    console.log(`\n🚀 Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
    console.log(`📡 Health check: http://localhost:${env.PORT}/api/health\n`);
  });
};

startServer();
