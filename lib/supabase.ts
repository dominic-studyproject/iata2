import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabase = createClient(supabaseUrl, supabaseServiceKey)

export type Database = {
  public: {
    Tables: {
      airlines: {
        Row: {
          id: string
          numeric_code: string
          iata_code: string
          name: string
          country_code: string | null
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          numeric_code: string
          iata_code: string
          name: string
          country_code?: string | null
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          numeric_code?: string
          iata_code?: string
          name?: string
          country_code?: string | null
          active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      airports: {
        Row: {
          id: string
          iata_code: string
          icao_code: string | null
          name: string
          city: string
          country_code: string
          latitude: number | null
          longitude: number | null
          elevation: number | null
          timezone: string | null
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          iata_code: string
          icao_code?: string | null
          name: string
          city: string
          country_code: string
          latitude?: number | null
          longitude?: number | null
          elevation?: number | null
          timezone?: string | null
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          iata_code?: string
          icao_code?: string | null
          name?: string
          city?: string
          country_code?: string
          latitude?: number | null
          longitude?: number | null
          elevation?: number | null
          timezone?: string | null
          active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}