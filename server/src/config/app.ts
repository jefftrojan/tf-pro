import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { rateLimit } from 'express-rate-limit';
import config from './env';
import { errorHandler } from '../middleware/error';

const configureApp = (app: express.Application): void => {
  // Body parser
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Cookie parser
  app.use(cookieParser());

  // Sanitize data
  app.use(mongoSanitize());

  // Set security headers
  app.use(helmet());

  // Enable CORS
  app.use(cors({
    origin: config.CLIENT_URL,
    credentials: true,
  }));

  // Compression
  app.use(compression());

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  });
  app.use('/api', limiter);

  // Logging middleware
  if (config.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }

  // Error handling
  app.use(errorHandler);
};

export default configureApp;