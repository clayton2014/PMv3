import { supabase } from './supabase'
import { Material, Ink, Service } from './types'

// Tipos para autenticação
export interface User {
  id: string
  email: string
  name: string
  phone: string
}

// Funções de Autenticação
export const signUp = async (email: string, password: string, name: string, phone: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) throw error

    if (data.user) {
      // Criar perfil do usuário
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          name,
          phone,
        })

      if (profileError) throw profileError

      // Inserir materiais padrão para o novo usuário
      await insertDefaultMaterials(data.user.id)
      
      // Inserir tintas padrão para o novo usuário
      await insertDefaultInks(data.user.id)
    }

    return { data, error: null }
  } catch (error: any) {
    return { data: null, error: error.message }
  }
}

export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    return { data, error: null }
  } catch (error: any) {
    return { data: null, error: error.message }
  }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    // Primeiro, verificar se há uma sessão ativa
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.error('Erro ao obter sessão:', sessionError)
      return null
    }

    if (!session || !session.user) {
      console.log('Nenhuma sessão ativa encontrada')
      return null
    }

    const user = session.user

    // Buscar perfil do usuário
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('name, phone')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Erro ao buscar perfil:', profileError)
      
      // Se o perfil não existe, criar um perfil básico
      if (profileError.code === 'PGRST116') {
        console.log('Perfil não encontrado, criando perfil básico...')
        
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            name: user.email?.split('@')[0] || 'Usuário',
            phone: '',
          })

        if (insertError) {
          console.error('Erro ao criar perfil:', insertError)
          return null
        }

        // Inserir materiais e tintas padrão
        await insertDefaultMaterials(user.id)
        await insertDefaultInks(user.id)

        return {
          id: user.id,
          email: user.email!,
          name: user.email?.split('@')[0] || 'Usuário',
          phone: '',
        }
      }
      
      return null
    }

    return {
      id: user.id,
      email: user.email!,
      name: profile.name,
      phone: profile.phone || '',
    }
  } catch (error) {
    console.error('Erro inesperado ao buscar usuário:', error)
    return null
  }
}

// Funções para inserir dados padrão
const insertDefaultMaterials = async (userId: string) => {
  try {
    const defaultMaterials = [
      {
        user_id: userId,
        name: 'LONA 440G',
        type: 'lona',
        cost_per_meter: 12.50,
        cost_per_square_meter: 12.50,
        supplier: 'Fornecedor Padrão',
        description: 'Lona 440g para impressão digital'
      },
      {
        user_id: userId,
        name: 'ADESIVO FOSCO',
        type: 'adesivo',
        cost_per_meter: 8.90,
        cost_per_square_meter: 8.90,
        supplier: 'Fornecedor Padrão',
        description: 'Adesivo fosco para aplicação'
      },
      {
        user_id: userId,
        name: 'TECIDO DRY FIT',
        type: 'tecido',
        cost_per_meter: 18.00,
        cost_per_square_meter: 18.00,
        supplier: 'Fornecedor Padrão',
        description: 'Tecido dry fit para impressão'
      }
    ]

    await supabase.from('materials').insert(defaultMaterials)
  } catch (error) {
    console.error('Erro ao inserir materiais padrão:', error)
  }
}

const insertDefaultInks = async (userId: string) => {
  try {
    const defaultInks = [
      {
        user_id: userId,
        name: 'TINTA JETBEST NOVA ECO PREMIUM',
        color: 'CMYK',
        cost_per_ml: 0.48,
        supplier: 'JetBest',
        description: 'Tinta eco premium para impressão digital'
      },
      {
        user_id: userId,
        name: 'TINTA JETBEST SOLVENTE DX SILVER',
        color: 'Prata',
        cost_per_ml: 0.24,
        supplier: 'JetBest',
        description: 'Tinta solvente DX Silver'
      },
      {
        user_id: userId,
        name: 'TINTA JETBEST SUBLIMAÇÃO TX',
        color: 'CMYK',
        cost_per_ml: 0.19,
        supplier: 'JetBest',
        description: 'Tinta para sublimação TX'
      },
      {
        user_id: userId,
        name: 'TINTA JETBEST UV',
        color: 'CMYK + Branco',
        cost_per_ml: 0.97,
        supplier: 'JetBest',
        description: 'Tinta UV para diversos materiais'
      }
    ]

    await supabase.from('inks').insert(defaultInks)
  } catch (error) {
    console.error('Erro ao inserir tintas padrão:', error)
  }
}

// Funções para Materiais
export const getMaterials = async (): Promise<Material[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data, error } = await supabase
      .from('materials')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return data.map(item => ({
      id: item.id,
      name: item.name,
      type: item.type as Material['type'],
      costPerMeter: item.cost_per_meter,
      costPerSquareMeter: item.cost_per_square_meter,
      supplier: item.supplier,
      description: item.description,
      createdAt: item.created_at,
    }))
  } catch (error) {
    console.error('Erro ao buscar materiais:', error)
    return []
  }
}

export const saveMaterial = async (material: Omit<Material, 'createdAt'>) => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Usuário não autenticado')

    const materialData = {
      user_id: user.id,
      name: material.name,
      type: material.type,
      cost_per_meter: material.costPerMeter,
      cost_per_square_meter: material.costPerSquareMeter,
      supplier: material.supplier,
      description: material.description,
    }

    if (material.id) {
      // Atualizar material existente
      const { error } = await supabase
        .from('materials')
        .update(materialData)
        .eq('id', material.id)
        .eq('user_id', user.id)

      if (error) throw error
    } else {
      // Criar novo material
      const { error } = await supabase
        .from('materials')
        .insert(materialData)

      if (error) throw error
    }

    return { success: true }
  } catch (error: any) {
    console.error('Erro ao salvar material:', error)
    return { success: false, error: error.message }
  }
}

export const deleteMaterial = async (id: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Usuário não autenticado')

    const { error } = await supabase
      .from('materials')
      .update({ name: `${Date.now()}_deleted` }) // Soft delete
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw error
    return { success: true }
  } catch (error: any) {
    console.error('Erro ao deletar material:', error)
    return { success: false, error: error.message }
  }
}

// Funções para Tintas
export const getInks = async (): Promise<Ink[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data, error } = await supabase
      .from('inks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return data.map(item => ({
      id: item.id,
      name: item.name,
      color: item.color,
      costPerMl: item.cost_per_ml,
      supplier: item.supplier,
      description: item.description,
      createdAt: item.created_at,
    }))
  } catch (error) {
    console.error('Erro ao buscar tintas:', error)
    return []
  }
}

export const saveInk = async (ink: Omit<Ink, 'createdAt'>) => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Usuário não autenticado')

    const inkData = {
      user_id: user.id,
      name: ink.name,
      color: ink.color,
      cost_per_ml: ink.costPerMl,
      supplier: ink.supplier,
      description: ink.description,
    }

    if (ink.id) {
      // Atualizar tinta existente
      const { error } = await supabase
        .from('inks')
        .update(inkData)
        .eq('id', ink.id)
        .eq('user_id', user.id)

      if (error) throw error
    } else {
      // Criar nova tinta
      const { error } = await supabase
        .from('inks')
        .insert(inkData)

      if (error) throw error
    }

    return { success: true }
  } catch (error: any) {
    console.error('Erro ao salvar tinta:', error)
    return { success: false, error: error.message }
  }
}

export const deleteInk = async (id: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Usuário não autenticado')

    const { error } = await supabase
      .from('inks')
      .update({ name: `${Date.now()}_deleted` }) // Soft delete
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw error
    return { success: true }
  } catch (error: any) {
    console.error('Erro ao deletar tinta:', error)
    return { success: false, error: error.message }
  }
}

// Funções para Serviços
export const getServices = async (): Promise<Service[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return data.map(item => ({
      id: item.id,
      name: item.name,
      material: item.material_data,
      ink: item.ink_data,
      otherCosts: item.other_costs || [],
      totalCost: item.total_cost,
      salePrice: item.sale_price,
      profit: item.profit,
      margin: item.margin,
      date: item.created_at,
    }))
  } catch (error) {
    console.error('Erro ao buscar serviços:', error)
    return []
  }
}

export const saveService = async (service: any) => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Usuário não autenticado')

    const serviceData = {
      user_id: user.id,
      name: service.name,
      material_data: service.material,
      ink_data: service.ink,
      other_costs: service.otherCosts || [],
      total_cost: service.totalCost,
      sale_price: service.salePrice,
      profit: service.profit,
      margin: service.margin,
    }

    if (service.id) {
      // Atualizar serviço existente
      const { error } = await supabase
        .from('services')
        .update(serviceData)
        .eq('id', service.id)
        .eq('user_id', user.id)

      if (error) throw error
    } else {
      // Criar novo serviço
      const { error } = await supabase
        .from('services')
        .insert(serviceData)

      if (error) throw error
    }

    return { success: true }
  } catch (error: any) {
    console.error('Erro ao salvar serviço:', error)
    return { success: false, error: error.message }
  }
}

export const deleteService = async (id: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Usuário não autenticado')

    const { error } = await supabase
      .from('services')
      .update({ name: `${Date.now()}_deleted` }) // Soft delete
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw error
    return { success: true }
  } catch (error: any) {
    console.error('Erro ao deletar serviço:', error)
    return { success: false, error: error.message }
  }
}