type StockProductInfo = {
  name?: string
  image?: string
  found: boolean
}

type StockProduct = {
  barcode: string
  quantity: number
} & StockProductInfo
