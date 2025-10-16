# 3D Printer Filament Tracker

A full-stack TypeScript application for tracking 3D printer filament inventory with a modern React frontend and Node.js backend.

## Features

- **Add Filaments**: Quick-add form with dropdowns for brands, types, and currencies
- **Free Color Input**: Enter any color name or description (e.g., "Bambu Lab Gray", "Wood Brown")
- **Inventory Management**: View all filaments in a searchable, filterable, and sortable table
- **Real Brand Logos**: Visual brand identification with actual brand logos from the internet
- **Dark Mode**: Toggle between light and dark themes with persistent preference
- **Amount Tracking**: Track filament amounts in grams with reduction capabilities
- **Multi-Currency**: Support for SEK (default), EUR, and USD
- **Home Assistant Integration**: API endpoint for reducing filament amounts from Home Assistant
- **Quick Add Mode**: Form retains values after adding for rapid inventory entry

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite + Material-UI
- **Backend**: Node.js + Express + TypeScript
- **Database**: JSON file storage (easily migratable to SQLite/PostgreSQL)
- **API**: RESTful endpoints with CORS support

## Project Structure

```
FilamentTracker/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── types/           # TypeScript interfaces
│   │   ├── services/        # API client
│   │   └── utils/           # Utility functions
│   └── public/logos/        # Brand logo assets
├── backend/                 # Express backend API
│   ├── src/
│   │   ├── routes/          # API route handlers
│   │   ├── services/        # Business logic
│   │   └── types/           # Shared TypeScript types
│   └── data/               # JSON data storage
└── README.md
```

## Installation & Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Filaments

- `GET /api/filaments` - Get all filaments
- `GET /api/filaments/:id` - Get filament by ID
- `POST /api/filaments` - Create new filament
- `PUT /api/filaments/:id` - Update filament
- `DELETE /api/filaments/:id` - Delete filament
- `PATCH /api/filaments/:id/reduce` - Reduce filament amount

### Health Check

- `GET /health` - Server health status

### API Documentation

- `GET /api-docs` - Interactive Swagger UI documentation

## API Documentation

The backend includes comprehensive Swagger/OpenAPI documentation that you can access at:

**http://localhost:5000/api-docs**

This interactive documentation allows you to:
- View all available endpoints
- See request/response schemas
- Test API endpoints directly from the browser
- Download the OpenAPI specification

## Home Assistant Integration

The application provides an API endpoint for Home Assistant to reduce filament amounts when prints are completed:

```yaml
# Example Home Assistant automation
automation:
  - alias: "Reduce Filament After Print"
    trigger:
      platform: state
      entity_id: sensor.printer_status
      to: "idle"
    action:
      - service: rest_command.reduce_filament
        data:
          filament_id: "your-filament-id"
          amount: "{{ states('sensor.print_weight') | float }}"

rest_command:
  reduce_filament:
    url: "http://localhost:5000/api/filaments/{{ filament_id }}/reduce"
    method: PATCH
    headers:
      Content-Type: "application/json"
    payload: '{"amount": {{ amount }}}'
```

## Data Model

```typescript
interface Filament {
  id: string;
  brand: string;
  filamentType: string; // PLA, PETG, ABS, etc.
  typeModifier?: string; // CF, GF, Silk, Matte, etc.
  color: string;
  amount: number; // grams
  cost: number;
  currency: 'SEK' | 'EUR' | 'USD';
  createdAt: string;
  updatedAt: string;
}
```

## Supported Brands

- Bambu Lab
- SUNLU
- Creality
- eSun
- Polymaker
- Prusa
- Hatchbox
- Overture
- MatterHackers
- ColorFabb
- Fillamentum
- FormFutura
- Other (custom input)

## Supported Filament Types

- PLA, PETG, ABS, TPU, ASA, Nylon, PC, PVA, HIPS
- Wood, Metal, Carbon Fiber, Glass Fiber
- Other (custom input)

## Development

### Adding New Brand Logos

1. Add SVG/PNG logo files to `frontend/public/logos/`
2. Update the brand name in `BRAND_OPTIONS` if needed
3. The `BrandLogo` component will automatically detect and display the logo

### Database Migration

The current implementation uses JSON file storage. To migrate to a database:

1. Replace `storage.ts` with database-specific implementation
2. Update the data model if needed
3. Add database connection configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details
