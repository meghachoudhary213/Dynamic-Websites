import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { defaultTemplates } from './config/templates.js';

dotenv.config();

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/jabalpur_smartengine';

async function runSeed() {
  try {
    console.log('🌱 Starting Database Re-Seed Engine...');
    console.log('⚡ Connecting to MongoDB at:', mongoURI);
    await mongoose.connect(mongoURI);
    console.log('🚀 Connected successfully.');

    // Drop collections to trigger fresh seeds
    const collections = await mongoose.connection.db.listCollections().toArray();
    
    const collectionsToDrop = ['users', 'websiteconfigs', 'blogs', 'notifications'];
    for (const col of collections) {
      if (collectionsToDrop.includes(col.name)) {
        await mongoose.connection.db.dropCollection(col.name);
        console.log(`🗑️ Dropped collection: ${col.name}`);
      }
    }

    // Seed default administrator
    const hashedPassword = await bcrypt.hash('jabalpur2026', 10);
    const UserSchema = new mongoose.Schema({
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      role: { type: String, default: 'admin' }
    });
    const MongooseUser = mongoose.model('User', UserSchema);
    await MongooseUser.create({
      email: 'admin@jabalpur.gov',
      password: hashedPassword,
      role: 'admin'
    });
    console.log('🌱 Seeded default admin user (admin@jabalpur.gov / jabalpur2026)');

    // Seed 10 premium templates
    const WebsiteConfigSchema = new mongoose.Schema({
      businessType: { type: String, required: true },
      isActive: { type: Boolean, default: false },
      theme: mongoose.Schema.Types.Mixed,
      hero: mongoose.Schema.Types.Mixed,
      navigation: mongoose.Schema.Types.Mixed,
      sections: mongoose.Schema.Types.Mixed,
      footer: mongoose.Schema.Types.Mixed,
      seo: mongoose.Schema.Types.Mixed
    });
    const MongooseWebsiteConfig = mongoose.model('WebsiteConfig', WebsiteConfigSchema);

    for (const key of Object.keys(defaultTemplates)) {
      const isCoaching = key === 'coaching';
      await MongooseWebsiteConfig.create({
        ...defaultTemplates[key],
        isActive: isCoaching
      });
      console.log(`✔ Seeded template: ${key} (${defaultTemplates[key].theme.name})`);
    }

    console.log('\n🎉 Re-Seed Engine Completed Successfully! All 10 user-specified websites are ready.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Re-Seed Engine Failed:', error);
    process.exit(1);
  }
}

runSeed();
