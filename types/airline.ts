export interface Airline {
  id: string
  numeric_code: string
  iata_code: string
  name: string
  country_code: string | null
  active: boolean
  created_at: string
  updated_at: string
}

export interface CreateAirlineRequest {
  numeric_code: string
  iata_code: string
  name: string
  country_code?: string
  active?: boolean
}

export interface UpdateAirlineRequest {
  numeric_code?: string
  iata_code?: string
  name?: string
  country_code?: string
  active?: boolean
}