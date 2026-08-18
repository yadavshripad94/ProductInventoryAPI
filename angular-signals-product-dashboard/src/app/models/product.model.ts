export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stockQuantity: number;
  isActive: boolean;
}

export interface ProductRequest {
  name: string;
  category: string;
  price: number;
  stockQuantity: number;
  isActive: boolean;
}
