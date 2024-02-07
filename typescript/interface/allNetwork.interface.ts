export interface AllNetwork {
    networks: AllNetworkInterface[]
  }
  
  export interface AllNetworkInterface {
    company: string[]
    href: string
    id: string
    location: Location
    name: string
    source?: string
    gbfs_href?: string
    license?: License
    ebikes?: boolean
  }
  
  export interface Location {
    city: string
    country: string
    latitude: number
    longitude: number
  }
  
  export interface License {
    name: string
    url: string
  }