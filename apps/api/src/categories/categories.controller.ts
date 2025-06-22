// src/categories/categories.controller.ts
import { Controller, Get } from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('categories') // With global prefix, becomes /api/categories
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async findAll() {
    return this.categoriesService.findAll(); // ✅ real Firestore call
  }
}
