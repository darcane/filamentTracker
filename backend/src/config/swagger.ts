import swaggerJsdoc from 'swagger-jsdoc';
import { Options } from 'swagger-jsdoc';

const options: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FilamentFlow API',
      version: '1.0.0',
      description: 'A RESTful API for managing 3D printer filament inventory with Home Assistant integration',
      contact: {
        name: 'FilamentFlow API',
        email: 'support@filamentflow.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
      {
        url: 'https://yourdomain.com',
        description: 'Production server',
      },
    ],
    components: {
      schemas: {
        Filament: {
          type: 'object',
          required: ['id', 'brand', 'filamentType', 'color', 'amount', 'cost', 'currency', 'createdAt', 'updatedAt'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Unique identifier for the filament',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
            brand: {
              type: 'string',
              description: 'Brand name of the filament',
              example: 'Bambu Lab',
            },
            filamentType: {
              type: 'string',
              description: 'Type of filament material',
              example: 'PLA',
              enum: ['PLA', 'PETG', 'ABS', 'TPU', 'ASA', 'Nylon', 'PC', 'PVA', 'HIPS', 'Wood', 'Metal', 'Carbon Fiber', 'Glass Fiber', 'Other'],
            },
            typeModifier: {
              type: 'string',
              description: 'Modifier for the filament type',
              example: 'CF - Carbon Fiber',
              enum: ['Standard', 'CF - Carbon Fiber', 'GF - Glass Fiber', 'Matte', 'Silk', 'Glow in Dark', 'Marble', 'Wood', 'Metal', 'Transparent', 'Semi-Transparent', 'Other'],
            },
            color: {
              type: 'string',
              description: 'Color or color description of the filament',
              example: 'Bambu Lab Gray',
            },
            amount: {
              type: 'number',
              description: 'Amount of filament in grams',
              example: 1000,
              minimum: 0,
            },
            cost: {
              type: 'number',
              description: 'Cost of the filament',
              example: 165.50,
              minimum: 0,
            },
            currency: {
              type: 'string',
              description: 'Currency code',
              example: 'SEK',
              enum: ['SEK', 'EUR', 'USD'],
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
              example: '2023-12-01T10:00:00.000Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
              example: '2023-12-01T10:00:00.000Z',
            },
          },
        },
        CreateFilamentRequest: {
          type: 'object',
          required: ['brand', 'filamentType', 'color', 'amount', 'cost', 'currency'],
          properties: {
            brand: {
              type: 'string',
              description: 'Brand name of the filament',
              example: 'Bambu Lab',
            },
            filamentType: {
              type: 'string',
              description: 'Type of filament material',
              example: 'PLA',
            },
            typeModifier: {
              type: 'string',
              description: 'Modifier for the filament type',
              example: 'CF - Carbon Fiber',
            },
            color: {
              type: 'string',
              description: 'Color or color description of the filament',
              example: 'Bambu Lab Gray',
            },
            amount: {
              type: 'number',
              description: 'Amount of filament in grams',
              example: 1000,
              minimum: 0,
            },
            cost: {
              type: 'number',
              description: 'Cost of the filament',
              example: 165.50,
              minimum: 0,
            },
            currency: {
              type: 'string',
              description: 'Currency code',
              example: 'SEK',
              enum: ['SEK', 'EUR', 'USD'],
            },
          },
        },
        UpdateFilamentRequest: {
          type: 'object',
          properties: {
            brand: {
              type: 'string',
              description: 'Brand name of the filament',
              example: 'Bambu Lab',
            },
            filamentType: {
              type: 'string',
              description: 'Type of filament material',
              example: 'PLA',
            },
            typeModifier: {
              type: 'string',
              description: 'Modifier for the filament type',
              example: 'CF - Carbon Fiber',
            },
            color: {
              type: 'string',
              description: 'Color or color description of the filament',
              example: 'Bambu Lab Gray',
            },
            amount: {
              type: 'number',
              description: 'Amount of filament in grams',
              example: 1000,
              minimum: 0,
            },
            cost: {
              type: 'number',
              description: 'Cost of the filament',
              example: 165.50,
              minimum: 0,
            },
            currency: {
              type: 'string',
              description: 'Currency code',
              example: 'SEK',
              enum: ['SEK', 'EUR', 'USD'],
            },
          },
        },
        ReduceAmountRequest: {
          type: 'object',
          required: ['amount'],
          properties: {
            amount: {
              type: 'number',
              description: 'Amount to reduce in grams',
              example: 50,
              minimum: 0,
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message',
              example: 'Filament not found',
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Filaments',
        description: 'Operations related to filament inventory management',
      },
      {
        name: 'Health',
        description: 'Health check endpoints',
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // Path to the API files
};

export const specs = swaggerJsdoc(options);
