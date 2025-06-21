// src/products/products.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // ✅ Public route for customer homepage
  @Get('products')
  getAllPublic() {
    return this.productsService.getAll();
  }

  // ✅ Admin-only routes
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  @Get('admin/products')
  getAllAdmin() {
    return this.productsService.getAll();
  }

  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  @Get('admin/products/:id')
  getById(@Param('id') id: string) {
    return this.productsService.getById(id);
  }

  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  @Post('admin/products')
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  @Patch('admin/products/:id')
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  @Delete('admin/products/:id')
  remove(@Param('id') id: string) {
    return this.productsService.delete(id);
  }
}
