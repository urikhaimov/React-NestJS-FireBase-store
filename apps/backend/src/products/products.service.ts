// src/products/products.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { adminDb } from '../firebase/firebase-admin';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  private readonly collection = adminDb.collection('products');

  async findAll() {
    return [
      { id: '1', name: 'Test Product', price: 5, stock: 10, category: 'Uncategorized' },
      { id: '2', name: 'Cool Shirt', price: 19.99, stock: 25, category: 'Apparel' },
      { id: '3', name: 'Baby Toy', price: 9.99, stock: 50, category: 'Toys' },
    ];
  }

  async getById(id: string) {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) {
      throw new NotFoundException('Product not found');
    }
    return { id: doc.id, ...doc.data() };
  }

  async create(data: CreateProductDto) {
    const docRef = await this.collection.add({
      ...data,
      createdAt: new Date(),
    });
    return { id: docRef.id };
  }

  async update(id: string, data: UpdateProductDto) {
    const docRef = this.collection.doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      throw new NotFoundException('Product not found');
    }

    await docRef.update({ ...data });
    return { id };
  }

  async delete(id: string) {
    const docRef = this.collection.doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      throw new NotFoundException('Product not found');
    }

    await docRef.delete();
    return { id };
  }
}
