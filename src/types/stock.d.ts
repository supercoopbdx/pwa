type StockProductInfo = {
  name?: string
  image_url?: string
  found: boolean
  uom_id?: number
  uom_label?: string
  uom_is_decimal?: boolean
  barcode?: string
}

type StockProduct = {
  barcode: string
  quantity: number
  uom_id?: number
} & StockProductInfo
