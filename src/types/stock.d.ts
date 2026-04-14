type StockProductInfo = {
  name?: string
  image_url?: string
  found: boolean
  uom_id?: number
}

type StockProduct = {
  barcode: string
  quantity: number
  uom_id?: number
} & StockProductInfo
