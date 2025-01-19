import express, { Express } from 'express';
import path from 'path';
import connectDB from './config/database';
import config from './config/env';
import configureApp from './config/app';
import { logger } from './utils/logger';
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger';
import cors from 'cors';

// Import routes
import authRoutes from './routes/auth';
import accountRoutes from './routes/accounts';
import transactionRoutes from './routes/transactions';
import budgetRoutes from './routes/budgets';
import categoryRoutes from './routes/categories';

// Create Express app
const app: Express = express();
// Enable CORS with default settings
app.use(cors());


const corsOptions = {
  origin: 'https://tf-pro-zpm1-e4x6868tf-jefftrojans-projects.vercel.app/', 
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Allow cookies
};
app.use(cors(corsOptions));

// Connect to MongoDB
connectDB();

// Configure app middleware
configureApp(app);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/accounts', accountRoutes);
app.use('/api/v1/transactions', transactionRoutes);
app.use('/api/v1/budgets', budgetRoutes);
app.use('/api/v1/categories', categoryRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Wallet App API Documentation',
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    environment: config.NODE_ENV
  });
});

// Handle undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot find ${req.originalUrl} on this server`
  });
});

const PORT = config.PORT || 5001;

const server = app.listen(PORT, () => {
  logger.info(`Server running in ${config.NODE_ENV} mode on port ${PORT}`);
  
  if (config.NODE_ENV === 'development') {
    logger.info(`API Documentation available at http://localhost:${PORT}/api-docs`);
  }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  logger.error('Unhandled Rejection:', err);
  // Close server & exit process
  server.close(() => {
    logger.error('Server closed due to unhandled promise rejection');
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  logger.error('Uncaught Exception:', err);
  // Close server & exit process
  server.close(() => {
    logger.error('Server closed due to uncaught exception');
    process.exit(1);
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

export default server;