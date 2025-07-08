import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderItemDto } from './order-item.dto';
class CartItemDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  price: number;

  @IsString()
  image: string;

  @IsNumber()
  quantity: number;
}

export class CreatePaymentIntentDto {
  @IsNumber()
  amount: number;

  @IsString()
  ownerName: string;

  @IsString()
  passportId: string;

  @IsArray()
  cart: OrderItemDto[];
}

