// src/orders/dto/order-item.dto.ts
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class OrderItemDto {
  @IsString()
  productId: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsNumber()
  price: number;

  @IsNumber()
  quantity: number;
}
