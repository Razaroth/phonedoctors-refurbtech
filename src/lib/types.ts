export type DeviceType = 'mobile' | 'tablet' | 'laptop' | 'desktop' | 'other'

export type DeviceStatus = 
  | 'intake'
  | 'diagnosis'
  | 'parts-ordered'
  | 'in-repair'
  | 'testing'
  | 'complete'
  | 'ready-for-sale'

export type StoreLocation = 
  | 'Edmond'
  | 'Memorial'
  | 'Norman'
  | 'E. 41st St.'
  | 'Broken Arrow'
  | 'Owasso'
  | 'Jenks'
  | 'Bixby'
  | 'Fayetteville'
  | 'Fort Smith'

export interface User {
  id: string
  username: string
  fullName: string
  email: string
  role: string
  storeLocation: StoreLocation
  createdAt: string
}

export interface Device {
  id: string
  type: DeviceType
  brand: string
  model: string
  serialNumber: string
  imei?: string
  status: DeviceStatus
  condition: string
  issuesReported: string
  repairsNeeded: string[]
  customerName?: string
  customerContact?: string
  technicianId: string
  technicianName: string
  storeLocation: StoreLocation
  partsUsed: DevicePart[]
  notes: string
  purchasePrice?: number
  marketValue?: number
  technicianNotes?: TechnicianNote[]
  photos?: string[]
  createdAt: string
  updatedAt: string
  completedAt?: string
}

export interface DevicePart {
  id: string
  partName: string
  partNumber?: string
  quantity: number
  pricePerUnit?: number
  supplier?: string
}

export interface TechnicianNote {
  id: string
  technicianName: string
  technicianId: string
  note: string
  createdAt: string
}

export interface PartPrice {
  id: string
  partName: string
  partNumber: string
  supplier: 'wgp' | 'phonelcdparts' | 'mobilesentrix' | 'other'
  price: number
  inStock: boolean
  lastUpdated: string
  notes?: string
}
