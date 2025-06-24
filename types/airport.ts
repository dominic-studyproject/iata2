export interface Airport {
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

export interface CreateAirportRequest {
  iata_code: string
  icao_code?: string
  name: string
  city: string
  country_code: string
  latitude?: number
  longitude?: number
  elevation?: number
  timezone?: string
  active?: boolean
}

export interface UpdateAirportRequest {
  iata_code?: string
  icao_code?: string
  name?: string
  city?: string
  country_code?: string
  latitude?: number
  longitude?: number
  elevation?: number
  timezone?: string
  active?: boolean
}