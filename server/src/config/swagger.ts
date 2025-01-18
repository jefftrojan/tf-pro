// src/config/swagger.ts
import swaggerJsdoc from 'swagger-jsdoc';
import config from './env';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Wallet App API Documentation',
      version: '1.0.0',
      description: 'API documentation for  Wallet Application',
      license: {
        name: 'MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },
      contact: {
        name: 'API Support',
        url: 'https://boolean.engineer',
        email: 'jeff@boolean.engineer',
      },
    },
    servers: [
      {
        url: `http://localhost:${config.PORT}/api/v1`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: {
              type: 'string',
              description: 'User name',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email',
            },
            password: {
              type: 'string',
              format: 'password',
              minLength: 6,
              description: 'User password',
            },
          },
        },
        Account: {
          type: 'object',
          required: ['name', 'type'],
          properties: {
            name: {
              type: 'string',
              description: 'Account name',
            },
            type: {
              type: 'string',
              enum: ['checking', 'savings', 'credit', 'investment', 'cash'],
              description: 'Account type',
            },
            balance: {
              type: 'number',
              description: 'Account balance',
            },
            currency: {
              type: 'string',
              default: 'USD',
              description: 'Account currency',
            },
          },
        },
        Transaction: {
          type: 'object',
          required: ['type', 'amount', 'category', 'account'],
          properties: {
            type: {
              type: 'string',
              enum: ['income', 'expense', 'transfer'],
              description: 'Transaction type',
            },
            amount: {
              type: 'number',
              description: 'Transaction amount',
            },
            category: {
              type: 'string',
              description: 'Transaction category',
            },
            subcategory: {
              type: 'string',
              description: 'Transaction subcategory',
            },
            description: {
              type: 'string',
              description: 'Transaction description',
            },
            account: {
              type: 'string',
              description: 'Account ID',
            },
            date: {
              type: 'string',
              format: 'date-time',
              description: 'Transaction date',
            },
          },
        },
        Budget: {
          type: 'object',
          required: ['category', 'limit', 'period', 'startDate', 'endDate'],
          properties: {
            category: {
              type: 'string',
              description: 'Budget category',
            },
            limit: {
              type: 'number',
              description: 'Budget limit amount',
            },
            period: {
              type: 'string',
              enum: ['daily', 'weekly', 'monthly', 'yearly'],
              description: 'Budget period',
            },
            startDate: {
              type: 'string',
              format: 'date',
              description: 'Budget start date',
            },
            endDate: {
              type: 'string',
              format: 'date',
              description: 'Budget end date',
            },
          },
        },
        Category: {
          type: 'object',
          required: ['name', 'type'],
          properties: {
            name: {
              type: 'string',
              description: 'Category name',
            },
            type: {
              type: 'string',
              enum: ['income', 'expense'],
              description: 'Category type',
            },
            icon: {
              type: 'string',
              description: 'Category icon',
            },
            color: {
              type: 'string',
              description: 'Category color',
            },
            parent: {
              type: 'string',
              description: 'Parent category ID',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              default: false,
            },
            error: {
              type: 'string',
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'], // Path to the API routes
};

export const specs = swaggerJsdoc(options);