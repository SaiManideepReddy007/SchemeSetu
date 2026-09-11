require('dotenv').config();
const mongoose = require('mongoose');
const Scheme = require('./models/Scheme');
const seedSchemes = require('./data/seedSchemes');

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding');

    await Scheme.deleteMany({}); // clear existing data first
    console.log('Cleared existing schemes');

    await Scheme.insertMany(seedSchemes);
    console.log(`Inserted ${seedSchemes.length} schemes successfully`);

    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seedDatabase();