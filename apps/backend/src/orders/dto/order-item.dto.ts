import { IsNumber, IsString, IsOptional } from 'class-validator';

export class OrderItemDto {
  @IsString()
  productId: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsNumber()
  price: number;

  @IsNumber()
  quantity: number;
}
