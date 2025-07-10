// src/orders/dto/create-payment-intent.dto.ts
import {
  IsArray,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
  @IsString()
  productId: string;

  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsString()
  image: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}

export class CreatePaymentIntentDto {
  @IsNumber()
  @Min(1)
  amount: number; // in cents

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  cart: OrderItemDto[];

  @IsString()
  ownerName: string;

  @IsString()
  passportId: string;

  @IsNumber()
  shipping: number;

  @IsNumber()
  taxRate: number;

  @IsNumber()
  discount: number;
}
