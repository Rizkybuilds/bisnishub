/**
 * TeeStock Color Hex Mapping & Helpers
 * Centralized color map used across ProductCard, ProductDetailPage, and Admin tools.
 */

export const COLOR_HEX_MAP = {
  // Neutral & Basics
  "Hitam": "#111111",
  "Black": "#111111",
  "Putih": "#F8F8F8",
  "White": "#F8F8F8",
  "Charcoal": "#2B2B2B",
  "Sport Grey": "#A5A5A5",
  "Heather Grey": "#9E9E9E",
  
  // Earth & Warm
  "Krem": "#EBE3D5",
  "Sand": "#D4B996",
  "Butter": "#FEF08A",
  "Mustard": "#D9A441",
  "Gold": "#E5A823",
  "Daisy": "#FBBF24",
  "Orange": "#EA580C",
  "Terracotta": "#B85D3B",
  "Chestnut": "#854D0E",
  "Dark Chocolate": "#3B2219",

  // Blues & Cool
  "Navy": "#1B2A4A",
  "Royal Blue": "#1E40AF",
  "Sapphire": "#0284C7",
  "Carolina Blue": "#7BAFD4",
  "Aqua Sky": "#7AC5CD",

  // Greens
  "Forest Green": "#224A30",
  "Dark Green": "#1B4D3E",
  "Olive": "#556B2F",
  "Military Green": "#4D5645",
  "Irish Green": "#15803D",
  "Lime": "#A3E635",
  "Green Ash": "#A7F3D0",
  "Neon Green": "#39FF14",

  // Reds & Pinks
  "Red": "#B91C1C",
  "Merah": "#B91C1C",
  "Maroon": "#5C1D24",
  "Heliconia": "#E11D48",
  "Salmon": "#FA8072",
  "Light Pink": "#FBCFE8",

  // Purples
  "Purple": "#7E22CE",
  "Lilac": "#C084FC"
};

/**
 * Returns hex code for a color name with safe fallback
 */
export function getColorHex(colorName, fallback = "#333333") {
  if (!colorName) return fallback;
  const trimmed = colorName.trim();
  return COLOR_HEX_MAP[trimmed] || fallback;
}
