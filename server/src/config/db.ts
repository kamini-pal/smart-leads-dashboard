import mongoose from 'mongoose';
import env from './env';

/**
 * Connects to MongoDB using Mongoose.
 *
 * WHY this is a separate function:
 * - Keeps database logic out of server.ts (separation of concerns)
 * - Can be reused in tests or scripts
 * - Easy to add connection event handlers (connected, error, disconnected)
 */
const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(env.MONGODB_URI);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    // Exit with failure code — the app can't work without a database
    process.exit(1);
  }
};

export default connectDB;
