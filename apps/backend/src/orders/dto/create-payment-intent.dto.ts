// src/orders/dto/create-payment-intent.dto.ts
import { IsString, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderItemDto } from './order-item.dto';

export class CreatePaymentIntentDto {
  @IsNumber()
  amount: number;

  @IsString()
  ownerName: string;

  @IsString()
  passportId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  cart: OrderItemDto[];
}
