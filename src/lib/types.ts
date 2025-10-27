export interface Service {
  id: string
  name: string
  material: {
    id: string
    name: string
    quantity: number
    cost: number
  }
  ink: {
    id: string
    name: string
    quantity: number
    cost: number
  }
  totalCost: number
  salePrice: number
  date: string
}

export interface Material {
  id: string
  name: string
  type: 'lona' | 'adesivo' | 'papel' | 'vinil' | 'tecido' | 'outro'
  costPerMeter?: number
  costPerSquareMeter?: number
  supplier: string
  description?: string
  createdAt: string
}

export interface Ink {
  id: string
  name: string
  color: string
  costPerMl: number
  supplier: string
  description?: string
  createdAt: string
}

export interface AppData {
  services: Service[]
  materials: Material[]
  inks: Ink[]
}

export interface ServiceFormData {
  name: string
  material: string
  materialQuantity: number
  ink: string
  inkQuantity: number
  salePrice: number
}