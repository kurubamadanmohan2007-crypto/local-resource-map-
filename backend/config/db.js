const mongoose = require('mongoose');
const dataStore = require('../services/dataStore');
const Resource = require('../models/Resource');
const sampleResources = require('../data/seedData');

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/local_resource_map';

  try {
    console.log(`[DB] Attempting connection to MongoDB at: ${mongoURI}`);
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 2000 // 2 seconds timeout for fast launch
    });

    console.log(`[DB] MongoDB Connected Successfully: ${conn.connection.host}`);
    dataStore.setMongoStatus(true);

    // Auto seed MongoDB if collection is empty
    const count = await Resource.countDocuments();
    if (count === 0) {
      console.log('[DB] No existing resources found in MongoDB. Auto-seeding with initial sample data...');
      await dataStore.seedDatabase();
    } else {
      console.log(`[DB] MongoDB contains ${count} community resources.`);
    }
  } catch (error) {
    console.warn(`\n[DB] Notice: Could not connect to local MongoDB (${error.message}).`);
    console.warn(`[DB] Seamlessly switching to In-Memory High-Availability Database Mode.`);
    console.warn(`[DB] The application is fully functional with CRUD, verification & reporting!`);
    console.warn(`[DB] (To use MongoDB, ensure mongod service is running or set MONGODB_URI in backend/.env)\n`);
    dataStore.setMongoStatus(false);
    dataStore.initializeInMemory();
  }
};

module.exports = connectDB;
