export interface CreateItemDto {
  name: string;
  sku: string;
  description?: string;
  price: number;
  quantity: number;
}
