import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'YOUR_KEY',
  authDomain: 'YOUR_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seedCategories() {
  const categories = [
    { name: 'Electronics', subcategories: ['Phones', 'Laptops', 'Accessories'] },
    { name: 'Books', subcategories: ['Fiction', 'Non-fiction', 'Comics'] },
    { name: 'Clothing', subcategories: ['Men', 'Women', 'Kids'] },
  ];

  for (const cat of categories) {
    const catRef = await addDoc(collection(db, 'categories'), { name: cat.name });
    for (const sub of cat.subcategories) {
      await addDoc(collection(db, `categories/${catRef.id}/subcategories`), { name: sub });
    }
    console.log(`Seeded category: ${cat.name}`);
  }
}

seedCategories().then(() => {
  console.log('Seeding complete');
  process.exit(0);
});
