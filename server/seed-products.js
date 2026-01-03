const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const sampleProducts = [
  {
    name: "iPhone 15 Pro",
    description: "Latest Apple smartphone with A17 Pro chip",
    price: 999.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569",
    stock: 50
  },
  {
    name: "MacBook Air M2",
    description: "Lightweight laptop with Apple M2 chip",
    price: 1199.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef",
    stock: 30
  },
  {
    name: "Sony Headphones",
    description: "Noise cancelling wireless headphones",
    price: 299.99,
    category: "Audio",
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90",
    stock: 100
  },
  {
    name: "Gaming Keyboard",
    description: "Mechanical RGB gaming keyboard",
    price: 89.99,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a",
    stock: 75
  },
  {
    name: "Smart Watch",
    description: "Fitness tracker with heart rate monitor",
    price: 199.99,
    category: "Wearables",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    stock: 60
  },
  {
    name: "4K Monitor",
    description: "27-inch 4K UHD computer monitor",
    price: 349.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1",
    stock: 40
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mern_ecommerce');
    console.log('✅ Connected to MongoDB');
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('✅ Cleared existing products');
    
    // Insert new products
    await Product.insertMany(sampleProducts);
    console.log(`✅ Added ${sampleProducts.length} sample products`);
    
    // Display products
    const products = await Product.find();
    console.log('\n📦 Sample Products Added:');
    products.forEach(p => {
      console.log(`- ${p.name} ($${p.price})`);
    });
    
    await mongoose.disconnect();
    console.log('\n🎉 Seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();