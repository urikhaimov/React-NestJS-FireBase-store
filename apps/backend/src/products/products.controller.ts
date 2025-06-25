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
  Patch,
} from '@nestjs/common';
import { ProductsService, ProductWithOrder } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  getAllProducts(): Promise<ProductWithOrder[]> {
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

  @Patch('reorder')
  async reorderProducts(
    @Body()
    body: { id: string; order: number }[],
  ) {
    if (!Array.isArray(body) || body.some((item) => !item.id || item.order == null)) {
      throw new BadRequestException('Invalid reorder payload');
    }

    return this.productsService.reorderProducts(body);
  }
}
