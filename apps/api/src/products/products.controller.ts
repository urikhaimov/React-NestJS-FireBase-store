// apps/backend/src/products/products.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Get()
  getAllProducts() {
    return this.productsService.findAll();
  }

  @Post()
  async create(@Body() body: { name: string; price: number; stock: number }) {
    const { name, price, stock } = body;

    if (!name?.trim() || price == null || stock == null) {
      throw new BadRequestException('Name, price, and stock are required');
    }

    return this.productsService.create({ name: name.trim(), price, stock });
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: { name?: string; price?: number; stock?: number },
  ) {
    return this.productsService.update(id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.productsService.findById(id);
  }
}
