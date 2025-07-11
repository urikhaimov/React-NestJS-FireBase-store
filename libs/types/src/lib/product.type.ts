export interface IProduct {
  name: string,
  description: string,
  price: number,
  stock: number,
  categoryId: number,
  images: string[],
  createdAt: Date,
  updatedAt: Date,
}
