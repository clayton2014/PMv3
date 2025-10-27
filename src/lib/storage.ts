import { AppData, Material, Ink, Service } from './types'

const STORAGE_KEY = 'printmanager-data'

const defaultData: AppData = {
  services: [],
  materials: [
    {
      id: '1',
      name: 'LONA 440G',
      type: 'lona',
      costPerMeter: 12.50,
      costPerSquareMeter: 12.50,
      supplier: 'Fornecedor Padrão',
      description: 'Lona 440g para impressão digital',
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      name: 'ADESIVO FOSCO',
      type: 'adesivo',
      costPerMeter: 8.90,
      costPerSquareMeter: 8.90,
      supplier: 'Fornecedor Padrão',
      description: 'Adesivo fosco para aplicação',
      createdAt: new Date().toISOString()
    },
    {
      id: '3',
      name: 'TECIDO DRY FIT',
      type: 'tecido',
      costPerMeter: 18.00,
      costPerSquareMeter: 18.00,
      supplier: 'Fornecedor Padrão',
      description: 'Tecido dry fit para impressão',
      createdAt: new Date().toISOString()
    }
  ],
  inks: [
    {
      id: '1',
      name: 'TINTA JETBEST NOVA ECO PREMIUM',
      color: 'CMYK',
      costPerMl: 0.48,
      supplier: 'JetBest',
      description: 'Tinta eco premium para impressão digital',
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      name: 'TINTA JETBEST SOLVENTE DX SILVER',
      color: 'Prata',
      costPerMl: 0.24,
      supplier: 'JetBest',
      description: 'Tinta solvente DX Silver',
      createdAt: new Date().toISOString()
    },
    {
      id: '3',
      name: 'TINTA JETBEST SUBLIMAÇÃO TX',
      color: 'CMYK',
      costPerMl: 0.19,
      supplier: 'JetBest',
      description: 'Tinta para sublimação TX',
      createdAt: new Date().toISOString()
    },
    {
      id: '4',
      name: 'TINTA JETBEST UV',
      color: 'CMYK + Branco',
      costPerMl: 0.97,
      supplier: 'JetBest',
      description: 'Tinta UV para diversos materiais',
      createdAt: new Date().toISOString()
    }
  ]
}

export const loadData = (): AppData => {
  if (typeof window === 'undefined') return defaultData
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const data = JSON.parse(stored)
      return {
        services: data.services || [],
        materials: data.materials || defaultData.materials,
        inks: data.inks || defaultData.inks
      }
    }
    return defaultData
  } catch (error) {
    console.error('Erro ao carregar dados:', error)
    return defaultData
  }
}

export const saveData = (data: AppData): void => {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('Erro ao salvar dados:', error)
  }
}

// Funções para Materiais
export const getMaterials = (): Material[] => {
  const data = loadData()
  return data.materials
}

export const saveMaterial = (material: Material): void => {
  const data = loadData()
  const existingIndex = data.materials.findIndex(m => m.id === material.id)
  
  if (existingIndex >= 0) {
    data.materials[existingIndex] = material
  } else {
    data.materials.push(material)
  }
  
  saveData(data)
}

export const deleteMaterial = (id: string): void => {
  const data = loadData()
  data.materials = data.materials.filter(m => m.id !== id)
  saveData(data)
}

// Funções para Tintas
export const getInks = (): Ink[] => {
  const data = loadData()
  return data.inks
}

export const saveInk = (ink: Ink): void => {
  const data = loadData()
  const existingIndex = data.inks.findIndex(i => i.id === ink.id)
  
  if (existingIndex >= 0) {
    data.inks[existingIndex] = ink
  } else {
    data.inks.push(ink)
  }
  
  saveData(data)
}

export const deleteInk = (id: string): void => {
  const data = loadData()
  data.inks = data.inks.filter(i => i.id !== id)
  saveData(data)
}

// Funções para Serviços
export const getServices = (): Service[] => {
  const data = loadData()
  return data.services
}

export const saveService = (service: Service): void => {
  const data = loadData()
  const existingIndex = data.services.findIndex(s => s.id === service.id)
  
  if (existingIndex >= 0) {
    data.services[existingIndex] = service
  } else {
    data.services.push(service)
  }
  
  saveData(data)
}

export const deleteService = (id: string): void => {
  const data = loadData()
  data.services = data.services.filter(s => s.id !== id)
  saveData(data)
}

export const exportData = (): string => {
  const data = loadData()
  return JSON.stringify(data, null, 2)
}

export const importData = (jsonData: string): boolean => {
  try {
    const data = JSON.parse(jsonData)
    saveData(data)
    return true
  } catch (error) {
    console.error('Erro ao importar dados:', error)
    return false
  }
}