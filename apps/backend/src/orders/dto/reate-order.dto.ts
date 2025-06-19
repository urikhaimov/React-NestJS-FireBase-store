export class CreateOrderDto {
  items: {
    productId: string;
    name: string;
    quantity: number;
  }[];
  total: number;
  address: string;
}
