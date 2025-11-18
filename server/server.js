const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const envFile = path.resolve(__dirname, '.env');
const fallbackEnvFile = path.resolve(__dirname, 'env.example');

const primaryEnvResult = dotenv.config({ path: envFile });
if (primaryEnvResult.error) {
  console.warn('⚠️  server/.env not found or unreadable. Falling back to env.example defaults.');
}

dotenv.config({ path: fallbackEnvFile, override: false });

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();

const port = process.env.PORT || 5000;
const isDev = process.env.NODE_ENV !== 'production';

const normalizeOrigins = (raw = '') =>
  raw
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

const configuredOrigins = normalizeOrigins(process.env.CLIENT_ORIGIN);
const allowedOrigins = configuredOrigins.length ? configuredOrigins : ['http://localhost:5173'];
const localhostRegex = /^https?:\/\/localhost:\d+$/i;

const allowOrigin = (origin) => {
  if (!origin) {
    return true;
  }

  const normalized = origin.toLowerCase();
  const listMatch = allowedOrigins.some((allowed) => allowed.toLowerCase() === normalized);
  const devMatch = isDev && localhostRegex.test(normalized);

  return listMatch || devMatch;
};

const corsOptions = {
  origin(origin, callback) {
    if (allowOrigin(origin)) {
      if (origin) {
        console.log(`[CORS] Allowed origin: ${origin}`);
      }
      return callback(null, true);
    }

    console.warn(`[CORS] Blocked origin: ${origin}. Allowed: ${allowedOrigins.join(', ')}`);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204,
};

const reportEnv = () => {
  const summary = {
    PORT: port,
    MONGODB_URI: process.env.MONGODB_URI || '(not set)',
    CLIENT_ORIGIN: allowedOrigins,
    USE_IN_MEMORY_DB: process.env.USE_IN_MEMORY_DB === 'true',
    JWT_SECRET: process.env.JWT_SECRET ? '[set]' : '[missing]',
  };

  console.log('🌱 Environment configuration:', summary);
};

reportEnv();

app.use(cors(corsOptions));

app.use((req, res, next) => {
  if (req.headers.origin) {
    console.log(`[REQ] ${req.method} ${req.originalUrl} | origin: ${req.headers.origin}`);
  }
  next();
});

app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json({ success: true, message: 'EdTech Learning Task Manager API' });
});

app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const startServer = async () => {
  await connectDB();

  app.listen(port, () => {
    console.log(`🚀 Server listening on port ${port}`);
  });
};

startServer();

