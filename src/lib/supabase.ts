import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para o banco de dados
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string
          phone: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          phone: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          phone?: string
          created_at?: string
          updated_at?: string
        }
      }
      materials: {
        Row: {
          id: string
          user_id: string
          name: string
          type: string
          cost_per_meter: number | null
          cost_per_square_meter: number | null
          supplier: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          type: string
          cost_per_meter?: number | null
          cost_per_square_meter?: number | null
          supplier: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          type?: string
          cost_per_meter?: number | null
          cost_per_square_meter?: number | null
          supplier?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      inks: {
        Row: {
          id: string
          user_id: string
          name: string
          color: string
          cost_per_ml: number
          supplier: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          color: string
          cost_per_ml: number
          supplier: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          color?: string
          cost_per_ml?: number
          supplier?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      services: {
        Row: {
          id: string
          user_id: string
          name: string
          material_data: any
          ink_data: any
          other_costs: any
          total_cost: number
          sale_price: number
          profit: number
          margin: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          material_data: any
          ink_data: any
          other_costs?: any
          total_cost: number
          sale_price: number
          profit: number
          margin: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          material_data?: any
          ink_data?: any
          other_costs?: any
          total_cost?: number
          sale_price?: number
          profit?: number
          margin?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}