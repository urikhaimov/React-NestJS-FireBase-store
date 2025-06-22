// src/categories/categories.controller.ts
import { Controller, Get } from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async findAll() {
     return [{ id: '1', name: 'Shoes' }, { id: '2', name: 'Hats' }];
  }
}
