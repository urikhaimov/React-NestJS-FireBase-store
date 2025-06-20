// src/products/dto/create-product.dto.ts
import { IsString, IsNumber, IsOptional, IsArray } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;

  @IsNumber()
  stock: number;

  @IsArray()
  @IsOptional()
  images?: string[];
}
