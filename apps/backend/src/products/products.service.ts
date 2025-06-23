// apps/backend/src/products/products.service.ts
import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { adminDb } from '../firebase/firebase-admin';

@Injectable()
export class ProductsService {
  private productsRef = adminDb.collection('products');
async findById(id: string) {
  const doc = await this.productsRef.doc(id).get();
  if (!doc.exists) {
    throw new NotFoundException('Product not found');
  }
  return { id: doc.id, ...doc.data() };
}

  async findAll() {
    const snapshot = await this.productsRef.get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  async create(product: { name: string; price: number; stock: number }) {
    const existing = await this.productsRef
      .where('name', '==', product.name)
      .get();

    if (!existing.empty) {
      throw new ConflictException('Product already exists');
    }

    const docRef = await this.productsRef.add(product);
    return { id: docRef.id, ...product };
  }

  async update(id: string, updateData: Partial<{ name: string; price: number; stock: number }>) {
    const ref = this.productsRef.doc(id);

    const doc = await ref.get();
    if (!doc.exists) {
      throw new NotFoundException('Product not found');
    }

    await ref.update(updateData);
    return { id, ...updateData };
  }

  async remove(id: string) {
    const ref = this.productsRef.doc(id);
    await ref.delete();
    return { message: 'Product deleted' };
  }
}
