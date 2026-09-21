export const SIZES = ["S", "M", "L", "XL", "2XL", "3XL"];

export const NSA_3600_SIZE_CHART = [
  { size: "S", chest: 47, length: 67, sleeve: 19 },
  { size: "M", chest: 50, length: 70, sleeve: 19.5 },
  { size: "L", chest: 53, length: 73, sleeve: 20 },
  { size: "XL", chest: 56, length: 75, sleeve: 20.5 },
  { size: "2XL", chest: 59, length: 77, sleeve: 21 },
];

export const NSA_7200_SIZE_CHART = [
  { size: "S", chest: 47, length: 67, sleeve: 19 },
  { size: "M", chest: 50, length: 70, sleeve: 19.5 },
  { size: "L", chest: 53, length: 73, sleeve: 20 },
  { size: "XL", chest: 56, length: 75, sleeve: 20.5 },
  { size: "2XL", chest: 59, length: 77, sleeve: 21 },
  { size: "3XL", chest: 62, length: 80, sleeve: 21.5 },
  { size: "4XL", chest: 65, length: 83, sleeve: 22 },
  { size: "5XL", chest: 68, length: 86, sleeve: 22.5 },
];

export const NSA_7280_SIZE_CHART = [
  { size: "S", chest: 47, length: 67, sleeve: 58 },
  { size: "M", chest: 50, length: 70, sleeve: 59 },
  { size: "L", chest: 53, length: 73, sleeve: 60 },
  { size: "XL", chest: 56, length: 75, sleeve: 61 },
  { size: "2XL", chest: 59, length: 77, sleeve: 62 },
  { size: "3XL", chest: 62, length: 80, sleeve: 63 },
  { size: "4XL", chest: 65, length: 83, sleeve: 64 },
  { size: "5XL", chest: 68, length: 86, sleeve: 65 },
];

export const NSA_72Y00_SIZE_CHART = [
  { size: "XS", chest: 33, length: 45, sleeve: 11.5 },
  { size: "S", chest: 36, length: 48, sleeve: 12.5 },
  { size: "M", chest: 38, length: 51, sleeve: 13.5 },
  { size: "L", chest: 41, length: 54, sleeve: 14.5 },
  { size: "XL", chest: 43, length: 58, sleeve: 15.5 },
];

export const NSA_7250_SIZE_CHART = [
  { size: "S", chest: 47, length: 67, sleeve: 19.5 },
  { size: "M", chest: 50, length: 70, sleeve: 20 },
  { size: "L", chest: 53, length: 73, sleeve: 20.5 },
  { size: "XL", chest: 56, length: 75, sleeve: 21 },
  { size: "2XL", chest: 59, length: 77, sleeve: 21.5 },
];

export const NSA_7260_SIZE_CHART = [
  { size: "S", chest: 47, length: 67, sleeve: 52 },
  { size: "M", chest: 50, length: 70, sleeve: 53 },
  { size: "L", chest: 53, length: 73, sleeve: 54 },
  { size: "XL", chest: 56, length: 75, sleeve: 55 },
  { size: "2XL", chest: 59, length: 77, sleeve: 56 },
];

export const NSA_SIZE_SPECS = {
  XS: { chest: 33, length: 45, sleeve: 11.5, desc: 'Lebar 33 cm • Panjang 45 cm • Lengan 11.5 cm (Kids)' },
  S: { chest: 47, length: 67, sleeve: 19, desc: 'Lebar 47 cm • Panjang 67 cm • Lengan 19 cm' },
  M: { chest: 50, length: 70, sleeve: 19.5, desc: 'Lebar 50 cm • Panjang 70 cm • Lengan 19.5 cm' },
  L: { chest: 53, length: 73, sleeve: 20, desc: 'Lebar 53 cm • Panjang 73 cm • Lengan 20 cm' },
  XL: { chest: 56, length: 75, sleeve: 20.5, desc: 'Lebar 56 cm • Panjang 75 cm • Lengan 20.5 cm' },
  '2XL': { chest: 59, length: 77, sleeve: 21, desc: 'Lebar 59 cm • Panjang 77 cm • Lengan 21 cm' },
  '3XL': { chest: 62, length: 80, sleeve: 21.5, desc: 'Lebar 62 cm • Panjang 80 cm • Lengan 21.5 cm' },
  '4XL': { chest: 65, length: 83, sleeve: 22, desc: 'Lebar 65 cm • Panjang 83 cm • Lengan 22 cm' },
  '5XL': { chest: 68, length: 86, sleeve: 22.5, desc: 'Lebar 68 cm • Panjang 86 cm • Lengan 22.5 cm' },
  XXL: { chest: 59, length: 77, sleeve: 21, desc: 'Lebar 59 cm • Panjang 77 cm • Lengan 21 cm' }
};

// 34 Warna Standar NSA Premium Cotton (7200, 7280, 72Y00)
export const NSA_34_COLORS = [
  { name: "Black", hex: "#111111", text: "text-white" },
  { name: "White", hex: "#FFFFFF", text: "text-black" },
  { name: "Sport Grey", hex: "#A5A5A5", text: "text-black" },
  { name: "Navy", hex: "#1B2A4A", text: "text-white" },
  { name: "Maroon", hex: "#5C1D24", text: "text-white" },
  { name: "Red", hex: "#B91C1C", text: "text-white" },
  { name: "Royal Blue", hex: "#1E40AF", text: "text-white" },
  { name: "Irish Green", hex: "#009E60", text: "text-white" },
  { name: "Daisy", hex: "#FFD700", text: "text-black" },
  { name: "Forest Green", hex: "#1E3A2F", text: "text-white" },
  { name: "Charcoal", hex: "#2B2B2B", text: "text-white" },
  { name: "Gold", hex: "#E5A823", text: "text-black" },
  { name: "Dark Chocolate", hex: "#3D2314", text: "text-white" },
  { name: "Military Green", hex: "#4B5320", text: "text-white" },
  { name: "Carolina Blue", hex: "#7BAFD4", text: "text-black" },
  { name: "Orange", hex: "#FF6600", text: "text-white" },
  { name: "Light Pink", hex: "#FFB6C1", text: "text-black" },
  { name: "Sand", hex: "#E6DCB8", text: "text-black" },
  { name: "Purple", hex: "#6A0DAD", text: "text-white" },
  { name: "Black Heather", hex: "#222222", text: "text-white" },
  { name: "Navy Heather", hex: "#25344F", text: "text-white" },
  { name: "Red Heather", hex: "#8A282B", text: "text-white" },
  { name: "Dark Green Heather", hex: "#203F31", text: "text-white" },
  { name: "Burgundy Heather", hex: "#4A1E27", text: "text-white" },
  { name: "Aqua Sky", hex: "#7AC5CD", text: "text-black" },
  { name: "Butter", hex: "#FFFDD0", text: "text-black" },
  { name: "Green Ash", hex: "#A0D6B4", text: "text-black" },
  { name: "Lilac", hex: "#C8A2C8", text: "text-black" },
  { name: "Salmon", hex: "#FA8072", text: "text-black" },
  { name: "Mustard", hex: "#D4A373", text: "text-black" },
  { name: "Lime", hex: "#32CD32", text: "text-black" },
  { name: "Chestnut", hex: "#986960", text: "text-white" },
  { name: "Sapphire", hex: "#0F52BA", text: "text-white" },
  { name: "Heliconia", hex: "#DB2777", text: "text-white" }
];

// 29 Warna Standar NSA Softstyle 3600
export const NSA_3600_COLORS = [
  { name: "White", hex: "#FFFFFF", text: "text-black" },
  { name: "Black", hex: "#111111", text: "text-white" },
  { name: "Red", hex: "#B91C1C", text: "text-white" },
  { name: "Navy", hex: "#1B2A4A", text: "text-white" },
  { name: "Royal Blue", hex: "#1E40AF", text: "text-white" },
  { name: "Maroon", hex: "#5C1D24", text: "text-white" },
  { name: "Irish Green", hex: "#009E60", text: "text-white" },
  { name: "Sport Grey", hex: "#A5A5A5", text: "text-black" },
  { name: "Charcoal", hex: "#2B2B2B", text: "text-white" },
  { name: "Forest Green", hex: "#1E3A2F", text: "text-white" },
  { name: "Dark Chocolate", hex: "#3D2314", text: "text-white" },
  { name: "Daisy", hex: "#FFD700", text: "text-black" },
  { name: "Heliconia", hex: "#DB2777", text: "text-white" },
  { name: "Orange", hex: "#FF6600", text: "text-white" },
  { name: "Sand", hex: "#E6DCB8", text: "text-black" },
  { name: "Carolina Blue", hex: "#7BAFD4", text: "text-black" },
  { name: "Lime", hex: "#32CD32", text: "text-black" },
  { name: "Light Pink", hex: "#FFB6C1", text: "text-black" },
  { name: "Sapphire", hex: "#0F52BA", text: "text-white" },
  { name: "Purple", hex: "#6A0DAD", text: "text-white" },
  { name: "Gold", hex: "#E5A823", text: "text-black" },
  { name: "Chestnut", hex: "#986960", text: "text-white" },
  { name: "Military Green", hex: "#4B5320", text: "text-white" },
  { name: "Aqua Sky", hex: "#7AC5CD", text: "text-black" },
  { name: "Lilac", hex: "#C8A2C8", text: "text-black" },
  { name: "Butter", hex: "#FFFDD0", text: "text-black" },
  { name: "Green Ash", hex: "#A0D6B4", text: "text-black" },
  { name: "Salmon", hex: "#FA8072", text: "text-black" },
  { name: "Mustard", hex: "#D4A373", text: "text-black" }
];

// 11 Warna Kombinasi Two-Tone untuk Ringer 7250 & Raglan 7260
export const NSA_CONTRAST_COLORS = [
  { name: "White-Black", hex: "#FFFFFF", borderHex: "#111111", text: "text-black" },
  { name: "White-Navy", hex: "#FFFFFF", borderHex: "#1B2A4A", text: "text-black" },
  { name: "White-Maroon", hex: "#FFFFFF", borderHex: "#5C1D24", text: "text-black" },
  { name: "White-Red", hex: "#FFFFFF", borderHex: "#B91C1C", text: "text-black" },
  { name: "White-Forest Green", hex: "#FFFFFF", borderHex: "#1E3A2F", text: "text-black" },
  { name: "White-Gold", hex: "#FFFFFF", borderHex: "#E5A823", text: "text-black" },
  { name: "White-Royal Blue", hex: "#FFFFFF", borderHex: "#1E40AF", text: "text-black" },
  { name: "Sport Grey-Black", hex: "#A5A5A5", borderHex: "#111111", text: "text-black" },
  { name: "Sport Grey-Navy", hex: "#A5A5A5", borderHex: "#1B2A4A", text: "text-black" },
  { name: "Sport Grey-Maroon", hex: "#A5A5A5", borderHex: "#5C1D24", text: "text-black" },
  { name: "Sport Grey-Red", hex: "#A5A5A5", borderHex: "#B91C1C", text: "text-black" }
];

export const GARMENT_TYPES = {
  // 1. NSA Premium Cotton 7200 (24s) — Hero Anchor
  nsa_heavyweight_24s: {
    id: "nsa_heavyweight_24s",
    name: "NSA Premium Cotton 7200 (24s)",
    code: "NSA-7200",
    modelNumber: "7200",
    weight: "180 g/m2",
    description: "100% Cotton Ring Spun Preshrunk Jersey Knit, 180 g/m2. Single needle 2.2 cm collar, tubular construction tanpa sambungan samping, double needle sleeve dan bottom hems. Standar streetwear distro internasional.",
    baseCost: 42000,
    baseCostWhite: 39000,
    retailPrice: 45000,
    retailPriceWhite: 42000,
    resellerPrice: 43000,
    resellerPriceWhite: 40000,
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'],
    sizeChart: NSA_7200_SIZE_CHART,
    colors: NSA_34_COLORS,
    vendorPricing: {
      retail: { white: 39000, color: 42000 },
      tier12: { white: 37000, color: 40000 },
      tier72: { white: 34000, color: 37000 }
    },
    surcharges: {
      '2XL': 5000,
      '3XL': 10000,
      '4XL': 15000,
      '5XL': 20000
    }
  },

  // 2. NSA Softstyle 3600 (30s) — Value Edition
  nsa_softstyle_30s: {
    id: "nsa_softstyle_30s",
    name: "NSA Softstyle 3600 (30s)",
    code: "NSA-3600",
    modelNumber: "3600",
    weight: "150 g/m2 (White) / 145 g/m2 (Color)",
    description: "100% Cotton Ring Spun Preshrunk Jersey Knit. Single needle 2 cm collar, taped neck and shoulders, tubular construction. Lembut, ringan, dan adem. Sangat cocok untuk iklim tropis dan daily wear.",
    baseCost: 37000,
    baseCostWhite: 34000,
    retailPrice: 40000,
    retailPriceWhite: 37000,
    resellerPrice: 38000,
    resellerPriceWhite: 35000,
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    sizeChart: NSA_3600_SIZE_CHART,
    colors: NSA_3600_COLORS,
    vendorPricing: {
      retail: { white: 34000, color: 37000 },
      tier12: { white: 32000, color: 35000 },
      tier72: { white: 29000, color: 32000 }
    },
    surcharges: {
      '2XL': 5000
    }
  },

  // 3. NSA Premium Cotton Long Sleeve 7280 (24s)
  nsa_longsleeve: {
    id: "nsa_longsleeve",
    name: "NSA Premium Cotton Long Sleeve 7280 (24s)",
    code: "NSA-7280",
    modelNumber: "7280",
    weight: "180 g/m2",
    description: "100% Cotton Ring Spun Preshrunk Jersey Knit 180 g/m2. Kaos lengan panjang dengan manset rib tebal di pergelangan tangan, tubular construction. Sangat nyaman untuk daily outfit dan cuaca sejuk.",
    baseCost: 56000,
    baseCostWhite: 53000,
    retailPrice: 59000,
    retailPriceWhite: 56000,
    resellerPrice: 57000,
    resellerPriceWhite: 54000,
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'],
    sizeChart: NSA_7280_SIZE_CHART,
    colors: NSA_34_COLORS,
    vendorPricing: {
      retail: { white: 53000, color: 56000 },
      tier12: { white: 51000, color: 54000 },
      tier72: { white: 48000, color: 51000 }
    },
    surcharges: {
      '2XL': 7000,
      '3XL': 14000,
      '4XL': 21000,
      '5XL': 28000
    }
  },

  // 4. NSA Premium Cotton Youth Kids 72Y00 (24s)
  nsa_youth: {
    id: "nsa_youth",
    name: "NSA Premium Cotton Youth Kids 72Y00 (24s)",
    code: "NSA-72Y00",
    modelNumber: "72Y00",
    weight: "180 g/m2",
    description: "100% Cotton Ring Spun Preshrunk Jersey Knit 180 g/m2. Single-needle collar, taped neck and shoulders, 1x1 cotton rib. Sangat lembut, adem, dan aman untuk kulit sensitif anak-anak.",
    baseCost: 33000,
    baseCostWhite: 33000,
    retailPrice: 36000,
    retailPriceWhite: 36000,
    resellerPrice: 34000,
    resellerPriceWhite: 34000,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    sizeChart: NSA_72Y00_SIZE_CHART,
    colors: NSA_34_COLORS,
    vendorPricing: {
      retail: { white: 33000, color: 33000 },
      tier12: { white: 31000, color: 31000 },
      tier72: { white: 28000, color: 28000 }
    },
    surcharges: {}
  },

  // 5. NSA Premium Cotton Ringer 7250 (24s)
  nsa_ringer: {
    id: "nsa_ringer",
    name: "NSA Premium Cotton Ringer 7250 (24s)",
    code: "NSA-7250",
    modelNumber: "7250",
    weight: "180 g/m2",
    description: "Kain rajut jersey 100% katun ring spun preshrunk 180 g/m2. Kerah dan lingkar lengan warna kontras retro 70s. Taped neck and shoulders, tubular construction.",
    baseCost: 45000,
    baseCostWhite: 45000,
    retailPrice: 48000,
    retailPriceWhite: 48000,
    resellerPrice: 46000,
    resellerPriceWhite: 46000,
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    sizeChart: NSA_7250_SIZE_CHART,
    colors: NSA_CONTRAST_COLORS,
    vendorPricing: {
      retail: { white: 45000, color: 45000 },
      tier12: { white: 43000, color: 43000 },
      tier72: { white: 40000, color: 40000 }
    },
    surcharges: {
      '2XL': 5000
    }
  },

  // 6. NSA Premium Cotton Raglan 3/4 7260 (24s)
  nsa_raglan: {
    id: "nsa_raglan",
    name: "NSA Premium Cotton Raglan 3/4 7260 (24s)",
    code: "NSA-7260",
    modelNumber: "7260",
    weight: "180 g/m2",
    description: "100% Cotton Ring Spun Preshrunk Jersey Knit 180 g/m2. Kaos raglan lengan 3/4 kombinasi dua warna baseball klasik. Taped neck and shoulders, tubular construction.",
    baseCost: 55000,
    baseCostWhite: 55000,
    retailPrice: 58000,
    retailPriceWhite: 58000,
    resellerPrice: 56000,
    resellerPriceWhite: 56000,
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    sizeChart: NSA_7260_SIZE_CHART,
    colors: NSA_CONTRAST_COLORS,
    vendorPricing: {
      retail: { white: 55000, color: 55000 },
      tier12: { white: 53000, color: 53000 },
      tier72: { white: 50000, color: 50000 }
    },
    surcharges: {
      '2XL': 5000
    }
  },

  // 📦 Packaging & Operational Supplies (MultiGraph & Ekosistem BisnisHub)
  supplies: {
    id: "supplies",
    name: "Packaging & Material",
    code: "SUPPLIES",
    description: "Kemasan polymailer tebal, stiker vinyl, hangtag distro, kertas roti baking paper heat press, dan lakban fragile.",
    baseCost: 0,
    colors: [],
    items: [
      { id: "polymailer", name: "Polymailer Hitam Doff 30x40", unit: "pcs", minStock: 20 },
      { id: "sticker", name: "Stiker Vinyl Unboxing 6x6 cm", unit: "pcs", minStock: 25 },
      { id: "care_card", name: "Care Card & Thank You Insert A6", unit: "pcs", minStock: 20 },
      { id: "hangtag", name: "Hangtag Distro Kraft Tebal", unit: "pcs", minStock: 20 },
      { id: "teflon_sheet", name: "Kertas Teflon Heat Press", unit: "lembar", minStock: 2 },
      { id: "lakban", name: "Lakban Fragile & Bening", unit: "roll", minStock: 2 }
    ]
  }
};
