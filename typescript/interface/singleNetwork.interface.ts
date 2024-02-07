export interface SingleNetwork {
    network: SingleNetworkInterface
  }
  
  export interface SingleNetworkInterface {
    company: string[]
    ebikes: boolean
    gbfs_href: string
    href: string
    id: string
    license: License
    location: Location
    name: string
    stations: Station[]
  }
  
  export interface License {
    name: string
    url: string
  }
  
  export interface Location {
    city: string
    country: string
    latitude: number
    longitude: number
  }
  
  export interface Station {
    empty_slots: number
    extra: Extra
    free_bikes: number
    id: string
    latitude: number
    longitude: number
    name: string
    timestamp: string
  }
  
  export interface Extra {
    banking: boolean
    ebikes: number
    last_updated: number
    "payment-terminal": boolean
    renting: number
    returning: number
    slots: number
    station_id: number
    uid: string
    payment?: string[]
  }
  