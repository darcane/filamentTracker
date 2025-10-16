export interface Filament {
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

export interface CreateFilamentRequest {
  brand: string;
  filamentType: string;
  typeModifier?: string;
  color: string;
  amount: number;
  cost: number;
  currency: 'SEK' | 'EUR' | 'USD';
}

export interface UpdateFilamentRequest extends Partial<CreateFilamentRequest> {}

export interface ReduceAmountRequest {
  amount: number; // grams to reduce
}

// Predefined options for dropdowns
export const BRAND_OPTIONS = [
  'Bambu Lab',
  'SUNLU',
  'Creality',
  'eSun',
  'Polymaker',
  'Prusa',
  'Hatchbox',
  'Overture',
  'MatterHackers',
  'ColorFabb',
  'Fillamentum',
  'FormFutura',
  'Other'
];

export const FILAMENT_TYPE_OPTIONS = [
  'PLA',
  'PETG',
  'ABS',
  'TPU',
  'ASA',
  'Nylon',
  'PC',
  'PVA',
  'HIPS',
  'Wood',
  'Metal',
  'Carbon Fiber',
  'Glass Fiber',
  'Other'
];

export const TYPE_MODIFIER_OPTIONS = [
  'Standard',
  'CF - Carbon Fiber',
  'GF - Glass Fiber',
  'Matte',
  'Silk',
  'Glow in Dark',
  'Marble',
  'Wood',
  'Metal',
  'Transparent',
  'Semi-Transparent',
  'Other'
];

export const COLOR_OPTIONS = [
  'Black',
  'White',
  'Gray',
  'Silver',
  'Red',
  'Blue',
  'Green',
  'Yellow',
  'Orange',
  'Purple',
  'Pink',
  'Brown',
  'Transparent',
  'Other'
];

export const CURRENCY_OPTIONS = ['SEK', 'EUR', 'USD'] as const;
