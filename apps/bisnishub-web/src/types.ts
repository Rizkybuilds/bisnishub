export type BusinessId = 'all' | 'teestock' | 'multigraph'

export interface BusinessConfig {
  id: BusinessId
  name: string
  tagline: string
  color: string
  badgeBg: string
  border: string
}

export interface Transaction {
  id: string
  businessId: Exclude<BusinessId, 'all'>
  type: 'income' | 'expense' | 'transfer'
  category: string
  amount: number
  description: string
  date: string
  proofRef?: string
}

export interface HppItem {
  id: string
  name: string
  blankCost: number
  dtfCost: number
  electricCost: number
  packCost: number
  overheadCost: number
  bufferDefectRate: number // e.g. 0.05 (5%)
  retailPrice: number
  platformFeeRate: number // e.g. 0.015 (1.5% Midtrans)
}

export type OrderStage = 'NEW' | 'MATERIAL_READY' | 'DTF_PRINT' | 'HEAT_PRESS' | 'QC_PACK' | 'SHIPPED'

export interface OrderItem {
  sku: string
  name: string
  size: string
  color: string
  qty: number
  price: number
}

export interface Order {
  id: string
  orderRef: string
  businessId: 'teestock' | 'multigraph'
  date: string
  customerName: string
  customerPhone: string
  shippingAddress: string
  items: OrderItem[]
  totalAmount: number
  stage: OrderStage
  courier: string
  trackingNo?: string
  thermalPrinted: boolean
  notes?: string
}

export interface Vendor {
  id: string
  name: string
  category: 'garment' | 'dtf_print' | 'packaging' | 'expedition' | 'equipment'
  pic: string
  phone: string
  address: string
  pricingNotes: string
  bankAccount: string
  rating: number
  status: 'active' | 'backup'
}

export interface ContentPlan {
  id: string
  businessId: Exclude<BusinessId, 'all'>
  channel: 'tiktok' | 'reels' | 'instagram' | 'whatsapp'
  targetDate: string
  title: string
  hookCopy: string
  caption: string
  status: 'idea' | 'scripted' | 'ready' | 'published'
}
