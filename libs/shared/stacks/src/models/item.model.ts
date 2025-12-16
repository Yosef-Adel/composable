export interface Item {
  id: string;
  name: string;
  sku: string;
  description?: string;
  price: number;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}
