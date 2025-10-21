type InboundProduct = {
  name: string
  barcode: string
  image: string
  parcels: number
  packSize: number
  inbound?: {
    ok: boolean,
    received?: number,
    comment?: string
  }
}

type MappedInboundOrder = {
  po: string
  provider: string
  date: Date
  products: Map<string, InboundProduct>
}

type InboundOrderResponse = {
  po: string
  provider: string
  date: Date
  products: InboundProduct[]
}
