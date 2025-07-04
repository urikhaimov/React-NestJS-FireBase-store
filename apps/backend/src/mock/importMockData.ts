import { adminDb } from '../firebase/firebase-admin'; // ✅ your initialized admin SDK

const categories = [
  {
    id: 'exterior-accessories',
    name: 'Exterior Accessories',
    description: 'Enhance your car’s exterior with spoilers, chrome trims, and carbon fiber kits.',
    imageUrl: '/assets/categories/exterior.jpg',
    order: 1,
  },
  {
    id: 'interior-upgrades',
    name: 'Interior Upgrades',
    description: 'Premium leather seat covers, ambient lighting, dashboard enhancements.',
    imageUrl: '/assets/categories/interior.jpg',
    order: 2,
  },
  {
    id: 'performance-parts',
    name: 'Performance Parts',
    description: 'Turbochargers, exhaust systems, suspension kits, and more.',
    imageUrl: '/assets/categories/performance.jpg',
    order: 3,
  },
  {
    id: 'detailing-care',
    name: 'Detailing & Care',
    description: 'Ceramic coatings, premium wax, detailing tools and cleaners.',
    imageUrl: '/assets/categories/detailing.jpg',
    order: 4,
  },
  {
    id: 'tech-gadgets',
    name: 'Tech & Gadgets',
    description: 'Dashcams, parking sensors, Android Auto kits and luxury infotainment.',
    imageUrl: '/assets/categories/tech.jpg',
    order: 5,
  },
];


const products = [
  {
    id: 'carbon-fiber-spoiler',
    name: 'Carbon Fiber Rear Spoiler',
    price: 429.99,
    stock: 12,
    categoryId: 'exterior-accessories',
    imageUrl: '/assets/products/spoiler.jpg',
    description: 'Aerodynamic carbon fiber spoiler designed for high-speed stability and style.',
  },
  {
    id: 'chrome-door-handle-covers',
    name: 'Chrome Door Handle Covers',
    price: 59.99,
    stock: 30,
    categoryId: 'exterior-accessories',
    imageUrl: '/assets/products/chrome-handles.jpg',
    description: 'Add a sleek chrome finish to your car’s door handles.',
  },
  {
    id: 'leather-seat-covers',
    name: 'Premium Leather Seat Covers',
    price: 299.99,
    stock: 10,
    categoryId: 'interior-upgrades',
    imageUrl: '/assets/products/leather-seats.jpg',
    description: 'Custom-fit leather covers for luxury feel and protection.',
  },
  {
    id: 'ambient-lighting-kit',
    name: 'Ambient Interior Lighting Kit',
    price: 89.99,
    stock: 15,
    categoryId: 'interior-upgrades',
    imageUrl: '/assets/products/ambient-lighting.jpg',
    description: 'Multi-color LED strips for under-dash and footwell lighting.',
  },
  {
    id: 'turbocharger-kit',
    name: 'Bolt-On Turbocharger Kit',
    price: 1499.99,
    stock: 3,
    categoryId: 'performance-parts',
    imageUrl: '/assets/products/turbo-kit.jpg',
    description: 'Boost your horsepower and acceleration with this easy-install kit.',
  },
  {
    id: 'performance-exhaust',
    name: 'Stainless Steel Performance Exhaust',
    price: 799.99,
    stock: 5,
    categoryId: 'performance-parts',
    imageUrl: '/assets/products/exhaust.jpg',
    description: 'Aggressive sound and optimized flow for max power.',
  },
  {
    id: 'detailing-kit',
    name: 'Complete Car Detailing Kit',
    price: 179.99,
    stock: 18,
    categoryId: 'detailing-care',
    imageUrl: '/assets/products/detailing-kit.jpg',
    description: 'Everything you need to professionally detail your car at home.',
  },
  {
    id: 'ceramic-coating',
    name: 'Ceramic Paint Protection Kit',
    price: 129.99,
    stock: 25,
    categoryId: 'detailing-care',
    imageUrl: '/assets/products/ceramic-coating.jpg',
    description: 'Lasting shine and protection from UV, water, and grime.',
  },
  {
    id: 'dashcam-4k',
    name: '4K Ultra HD Dashcam',
    price: 249.99,
    stock: 9,
    categoryId: 'tech-gadgets',
    imageUrl: '/assets/products/dashcam.jpg',
    description: 'Capture every drive with ultra-clear front and rear recording.',
  },
  {
    id: 'android-auto-kit',
    name: 'Wireless Android Auto CarPlay Kit',
    price: 159.99,
    stock: 11,
    categoryId: 'tech-gadgets',
    imageUrl: '/assets/products/android-auto.jpg',
    description: 'Add smart infotainment to any vehicle with plug-and-play setup.',
  }
];

import { collection, getDocs, deleteDoc } from 'firebase/firestore';

async function deleteAllFromCollection(collectionPath: string) {
  const snap = await adminDb.collection(collectionPath).get();
  const deletions = snap.docs.map(doc => doc.ref.delete());
  await Promise.all(deletions);
  console.log(`🗑️ Cleared ${collectionPath}`);
}

export async function importMockData() {
  try {
    await deleteAllFromCollection('categories');
    await deleteAllFromCollection('products');
    for (const category of categories) {
      await adminDb.collection('categories').doc(category.id).set(category); // ✅ admin-style
      console.log(`✅ Category added: ${category.name}`);
    }

    for (const product of products) {
      await adminDb.collection('products').doc(product.id).set(product); // ✅ admin-style
      console.log(`✅ Product added: ${product.name}`);
    }

    console.log('🎉 All mock data imported successfully!');
  } catch (err) {
    console.error('❌ Error importing mock data:', err);
  }
}

// Allow CLI execution:
if (require.main === module) {
  importMockData();
}
