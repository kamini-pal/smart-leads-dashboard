import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import errorHandler from './middleware/errorHandler';
import authRoutes from './routes/authRoutes';
import leadRoutes from './routes/leadRoutes';

/**
 * app.ts — Express application setup.
 *
 * WHY separate from server.ts?
 * - app.ts = "what" (configure Express, middleware, routes)
 * - server.ts = "when" (start listening, connect DB)
 *
 * This separation is a professional pattern because:
 * 1. You can import `app` in tests without starting the server
 * 2. Keeps concerns clean — configuration vs. startup
 */

const app = express();

// ────────────────────────────────────────────────────────────
// MIDDLEWARE (runs on EVERY request, in this order)
// ────────────────────────────────────────────────────────────

// Security headers — adds headers like X-Content-Type-Options, X-Frame-Options
// Protects against common web vulnerabilities
app.use(helmet());

// CORS — allows requests from your React frontend (different port/domain)
// Without this, the browser blocks cross-origin requests
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://smart-leads-dashboard-one-indol.vercel.app',
  ],
  credentials: true,
}));

// JSON body parser — converts request body from raw JSON string to JavaScript object
// Without this, req.body would be undefined
app.use(express.json());

// URL-encoded body parser — handles form submissions
app.use(express.urlencoded({ extended: true }));

// HTTP request logger — logs every request to the console
// "dev" format: colored, concise (e.g., "GET /api/leads 200 12ms")
app.use(morgan('dev'));

// ────────────────────────────────────────────────────────────
// ROUTES
// ────────────────────────────────────────────────────────────

// Health check — used by deployment platforms to verify the server is alive
// This is the first thing to test after setup
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Smart Leads Dashboard API is running 🚀',
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

// ────────────────────────────────────────────────────────────
// ERROR HANDLING (must be AFTER all routes)
// ────────────────────────────────────────────────────────────

// Centralized error handler — catches all errors from routes/controllers
app.use(errorHandler);

export default app;
