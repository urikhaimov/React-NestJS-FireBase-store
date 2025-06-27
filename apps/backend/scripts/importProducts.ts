// scripts/importProducts.ts
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as fs from 'fs';
import * as path from 'path';

// ✅ Load Service Account
const serviceAccount = require('../serviceAccountKey.json'); // 👈 update path

// ✅ Init Firebase Admin
initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

// ✅ Load product data
const productsFile = path.resolve(__dirname, '../mock-products.json');
const products = JSON.parse(fs.readFileSync(productsFile, 'utf-8'));

// ✅ Upload each product
async function importProducts() {
  const batch = db.batch();
  const productsRef = db.collection('products');

  products.forEach((product: any) => {
    const docRef = productsRef.doc(); // auto-generated ID
    batch.set(docRef, {
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      categoryId: product.categoryId,
      images: product.images,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

  await batch.commit();
  console.log(`✅ Imported ${products.length} products.`);
}

importProducts().catch((err) => {
  console.error('🔥 Error importing products:', err);
});
