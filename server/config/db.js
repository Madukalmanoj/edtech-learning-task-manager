const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let memoryServer;

const connectDB = async () => {
  let uri = process.env.MONGODB_URI;

  if (!uri) {
    if (process.env.USE_IN_MEMORY_DB === 'true') {
      memoryServer = await MongoMemoryServer.create();
      uri = memoryServer.getUri();
      console.warn('⚠️  Using in-memory MongoDB instance for development/testing');
    } else {
      throw new Error('MONGODB_URI is not defined. Set it in server/.env or enable USE_IN_MEMORY_DB.');
    }
  }

  try {
    await mongoose.connect(uri, {
      autoIndex: true,
    });
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error', error);
    if (memoryServer) {
      await memoryServer.stop();
    }
    process.exit(1);
  }
};

process.on('SIGINT', async () => {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
  }
  process.exit(0);
});

module.exports = connectDB;

