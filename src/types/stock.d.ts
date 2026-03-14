type StockProductInfo = {
  name?: string
  image_url?: string
  found: boolean
}

type StockProduct = {
  barcode: string
  quantity: number
} & StockProductInfo
