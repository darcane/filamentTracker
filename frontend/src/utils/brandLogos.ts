// Brand logo mappings - using local SVG logos
export const BRAND_LOGOS: Record<string, string> = {
  'Bambu Lab': '/logos/bambu-lab.svg',
  'SUNLU': '/logos/sunlu.svg',
  'Creality': '/logos/creality.svg',
  'eSun': '/logos/esun.svg',
  'Polymaker': '/logos/polymaker.svg',
  'Prusa': '/logos/prusa.svg',
  'Hatchbox': '/logos/hatchbox.svg',
  'Overture': '/logos/overture.svg',
  'MatterHackers': '/logos/matterhackers.svg',
  'ColorFabb': '/logos/colorfabb.svg',
  'Fillamentum': '/logos/fillamentum.svg',
  'FormFutura': '/logos/formfutura.svg',
};

// Fallback function to get brand initials
export const getBrandInitials = (brand: string): string => {
  return brand
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .substring(0, 2);
};

// Check if brand has a logo
export const hasBrandLogo = (brand: string): boolean => {
  return brand in BRAND_LOGOS;
};

// Get brand logo path or return null
export const getBrandLogo = (brand: string): string | null => {
  return BRAND_LOGOS[brand] || null;
};
