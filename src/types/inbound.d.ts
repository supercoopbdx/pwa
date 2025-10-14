type InboundProduct = {
  name: string
  barcode: string
  image: string
  parcels: number
  packSize: number
}

type InboundOrder = {
  po?: string
  provider: string
  date: Date
  products: Map<string, InboundProduct>
}
