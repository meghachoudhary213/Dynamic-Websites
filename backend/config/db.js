import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { defaultTemplates } from './templates.js';

const FALLBACK_FILE_PATH = path.resolve('db_fallback.json');
let useMongoDB = false;

// Mongoose Schemas (used if MongoDB is connected)
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'student' },
  name: { type: String, default: '' },
  phone: { type: String, default: '' },
  websiteId: { type: String, default: '' }
}, { timestamps: true });

const BlogSchema = new mongoose.Schema({
  title: String,
  excerpt: String,
  content: String,
  image: String,
  date: { type: Date, default: Date.now },
  businessType: String
}, { timestamps: true });

const NotificationSchema = new mongoose.Schema({
  message: String,
  timestamp: { type: Date, default: Date.now },
  read: { type: Boolean, default: false }
}, { timestamps: true });

const WebsiteConfigSchema = new mongoose.Schema({
  businessType: { type: String, required: true },
  websiteName: { type: String, required: true },
  isActive: { type: Boolean, default: false },
  theme: mongoose.Schema.Types.Mixed,
  hero: mongoose.Schema.Types.Mixed,
  navigation: mongoose.Schema.Types.Mixed,
  sections: mongoose.Schema.Types.Mixed,
  footer: mongoose.Schema.Types.Mixed,
  seo: mongoose.Schema.Types.Mixed,
  paymentDetails: mongoose.Schema.Types.Mixed,
  dashboardModules: [String],
  fonts: { type: String, default: 'Space Grotesk' }
}, { timestamps: true });

let MongooseUser, MongooseBlog, MongooseNotification, MongooseWebsiteConfig;

// Initialize MongoDB connection
export async function connectDB() {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/jabalpur_smartengine';
  try {
    console.log('⚡ Attempting to connect to MongoDB at:', mongoURI);
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 2000 // Quick timeout to fallback fast
    });
    console.log('🚀 MongoDB Connected Successfully!');
    useMongoDB = true;

    // Define Mongoose Models
    MongooseUser = mongoose.model('User', UserSchema);
    MongooseBlog = mongoose.model('Blog', BlogSchema);
    MongooseNotification = mongoose.model('Notification', NotificationSchema);
    MongooseWebsiteConfig = mongoose.model('WebsiteConfig', WebsiteConfigSchema);

    // Seed default admin and config if empty
    await seedDefaultData();
    
    // Force active website configuration to 'smartengine' flagship
    await WebsiteConfig.setActiveConfig('smartengine');
    console.log('🔮 Flagship "smartengine" template activated as primary MERN template.');
  } catch (error) {
    console.warn('⚠️ MongoDB connection failed. Switching to High-Fidelity JSON Fallback Engine!');
    console.error(`Reason: ${error.message}`);
    useMongoDB = false;
    initializeJSONDB();
    
    // Force active website configuration to 'smartengine' in fallback JSON database
    await WebsiteConfig.setActiveConfig('smartengine');
    console.log('🔮 Flagship "smartengine" template activated in JSON Database.');
  }
}

// Seed helper for MongoDB
async function seedDefaultData() {
  const adminCount = await MongooseUser.countDocuments();
  if (adminCount === 0) {
    const hashedPassword = await bcrypt.hash('jabalpur2026', 10);
    await MongooseUser.create({
      email: 'admin@jabalpur.gov',
      password: hashedPassword,
      role: 'admin',
      name: 'Super Admin',
      phone: '9827012345',
      websiteId: ''
    });
    console.log('🌱 Seeded default admin user in MongoDB (admin@jabalpur.gov / jabalpur2026)');
  }

  // Seed all templates dynamically if missing
  const defaultModulesMap = {
    coaching: ['students', 'attendance', 'tests', 'notes', 'fees', 'analytics'],
    ecommerce: ['products', 'orders', 'payments'],
    real_estate: ['properties', 'tours', 'consultations'],
    hospital: ['appointments', 'doctors', 'reports'],
    cafe: ['menu', 'tables', 'orders'],
    startup: ['sandboxes', 'servers', 'teams'],
    gym: ['bmi', 'workouts', 'trainers'],
    tourism: ['itinerary', 'budget', 'bookings'],
    cybersecurity: ['threats', 'quizzes', 'firewall'],
    career: ['resume', 'interviews', 'placements'],
    smartengine: ['analytics', 'workflows', 'recommendations', 'chatbot', 'files', 'team']
  };

  for (const key of Object.keys(defaultTemplates)) {
    const exists = await MongooseWebsiteConfig.findOne({ businessType: key });
    if (!exists) {
      const isSmartEngine = key === 'smartengine';
      await MongooseWebsiteConfig.create({
        ...defaultTemplates[key],
        websiteName: defaultTemplates[key].theme.name,
        isActive: isSmartEngine,
        dashboardModules: defaultModulesMap[key] || [],
        fonts: defaultTemplates[key].theme.fontFamily || 'Space Grotesk'
      });
      console.log(`🌱 Seeded missing "${key}" template in MongoDB.`);
    }
  }
}

// JSON Database operations (Fallback Mode)
const readJSONDB = () => {
  if (!fs.existsSync(FALLBACK_FILE_PATH)) {
    initializeJSONDB();
  }
  try {
    const data = fs.readFileSync(FALLBACK_FILE_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading JSON Fallback Database, resetting:', err);
    return initializeJSONDB();
  }
};

const writeJSONDB = (data) => {
  fs.writeFileSync(FALLBACK_FILE_PATH, JSON.stringify(data, null, 2), 'utf8');
};

function initializeJSONDB() {
  console.log('📂 Initializing Local JSON Fallback Database at:', FALLBACK_FILE_PATH);
  
  // Create default admin hashed password
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync('jabalpur2026', salt);

  const defaultModulesMap = {
    coaching: ['students', 'attendance', 'tests', 'notes', 'fees', 'analytics'],
    ecommerce: ['products', 'orders', 'payments'],
    real_estate: ['properties', 'tours', 'consultations'],
    hospital: ['appointments', 'doctors', 'reports'],
    cafe: ['menu', 'tables', 'orders'],
    startup: ['sandboxes', 'servers', 'teams'],
    gym: ['bmi', 'workouts', 'trainers'],
    tourism: ['itinerary', 'budget', 'bookings'],
    cybersecurity: ['threats', 'quizzes', 'firewall'],
    career: ['resume', 'interviews', 'placements'],
    smartengine: ['analytics', 'workflows', 'recommendations', 'chatbot', 'files', 'team']
  };

  const initialDB = {
    users: [
      {
        _id: 'usr_default_admin',
        email: 'admin@jabalpur.gov',
        password: hashedPassword,
        role: 'admin',
        name: 'Super Admin',
        phone: '9827012345',
        websiteId: '',
        createdAt: new Date().toISOString()
      }
    ],
    blogs: [],
    notifications: [
      {
        _id: 'notif_welcome',
        message: 'System initiated in JSON Fallback Mode. Welcome to Jabalpur SmartEngine!',
        read: false,
        timestamp: new Date().toISOString()
      }
    ],
    websiteConfigs: Object.keys(defaultTemplates).map((key, index) => ({
      _id: `config_${key}`,
      ...defaultTemplates[key],
      websiteName: defaultTemplates[key].theme.name,
      isActive: key === 'smartengine',
      dashboardModules: defaultModulesMap[key] || [],
      fonts: defaultTemplates[key].theme.fontFamily || 'Space Grotesk',
      createdAt: new Date().toISOString()
    }))
  };

  writeJSONDB(initialDB);
  return initialDB;
}

// Abstract DB Access Wrappers
export const User = {
  find: async (query = {}) => {
    if (useMongoDB) return MongooseUser.find(query);
    const db = readJSONDB();
    return db.users.filter(u => Object.keys(query).every(k => u[k] === query[k]));
  },
  findOne: async (query = {}) => {
    if (useMongoDB) return MongooseUser.findOne(query);
    const db = readJSONDB();
    return db.users.find(u => Object.keys(query).every(k => u[k] === query[k])) || null;
  },
  create: async (userData) => {
    if (useMongoDB) return MongooseUser.create(userData);
    const db = readJSONDB();
    const newUser = {
      _id: `usr_${uuidv4()}`,
      name: userData.name || '',
      phone: userData.phone || '',
      websiteId: userData.websiteId || '',
      ...userData,
      createdAt: new Date().toISOString()
    };
    db.users.push(newUser);
    writeJSONDB(db);
    return newUser;
  }
};

export const Blog = {
  find: async (query = {}) => {
    if (useMongoDB) return MongooseBlog.find(query).sort({ createdAt: -1 });
    const db = readJSONDB();
    let results = db.blogs.filter(b => Object.keys(query).every(k => b[k] === query[k]));
    return results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },
  create: async (blogData) => {
    if (useMongoDB) return MongooseBlog.create(blogData);
    const db = readJSONDB();
    const newBlog = {
      _id: `blog_${uuidv4()}`,
      ...blogData,
      createdAt: new Date().toISOString()
    };
    db.blogs.push(newBlog);
    writeJSONDB(db);
    return newBlog;
  },
  deleteOne: async (query = {}) => {
    if (useMongoDB) return MongooseBlog.deleteOne(query);
    const db = readJSONDB();
    const lengthBefore = db.blogs.length;
    db.blogs = db.blogs.filter(b => !Object.keys(query).every(k => b[k] === query[k]));
    writeJSONDB(db);
    return { deletedCount: lengthBefore - db.blogs.length };
  }
};

export const Notification = {
  find: async (query = {}) => {
    if (useMongoDB) return MongooseNotification.find(query).sort({ timestamp: -1 });
    const db = readJSONDB();
    let results = db.notifications.filter(n => Object.keys(query).every(k => n[k] === query[k]));
    return results.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  },
  create: async (notifData) => {
    if (useMongoDB) return MongooseNotification.create(notifData);
    const db = readJSONDB();
    const newNotif = {
      _id: `notif_${uuidv4()}`,
      message: notifData.message,
      read: false,
      timestamp: new Date().toISOString()
    };
    db.notifications.push(newNotif);
    writeJSONDB(db);
    return newNotif;
  },
  updateMany: async (query = {}, updateData = {}) => {
    if (useMongoDB) return MongooseNotification.updateMany(query, updateData);
    const db = readJSONDB();
    let modified = 0;
    db.notifications = db.notifications.map(n => {
      if (Object.keys(query).every(k => n[k] === query[k])) {
        modified++;
        return { ...n, ...updateData };
      }
      return n;
    });
    writeJSONDB(db);
    return { modifiedCount: modified };
  }
};

export const WebsiteConfig = {
  find: async (query = {}) => {
    if (useMongoDB) return MongooseWebsiteConfig.find(query);
    const db = readJSONDB();
    return db.websiteConfigs.filter(c => Object.keys(query).every(k => c[k] === query[k]));
  },
  findOne: async (query = {}) => {
    if (useMongoDB) return MongooseWebsiteConfig.findOne(query);
    const db = readJSONDB();
    return db.websiteConfigs.find(c => Object.keys(query).every(k => c[k] === query[k])) || null;
  },
  findOneAndUpdate: async (query = {}, updateData = {}, options = {}) => {
    if (useMongoDB) {
      return MongooseWebsiteConfig.findOneAndUpdate(query, updateData, { new: true, ...options });
    }
    const db = readJSONDB();
    let configIndex = db.websiteConfigs.findIndex(c => Object.keys(query).every(k => c[k] === query[k]));
    if (configIndex === -1) {
      if (options.upsert) {
        const newConfig = {
          _id: `config_${uuidv4()}`,
          ...query,
          ...updateData,
          createdAt: new Date().toISOString()
        };
        db.websiteConfigs.push(newConfig);
        writeJSONDB(db);
        return newConfig;
      }
      return null;
    }
    
    // Perform update
    const updated = {
      ...db.websiteConfigs[configIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    db.websiteConfigs[configIndex] = updated;
    writeJSONDB(db);
    return updated;
  },
  // Swapper custom call
  setActiveConfig: async (businessType) => {
    if (useMongoDB) {
      // Deactivate all
      await MongooseWebsiteConfig.updateMany({}, { isActive: false });
      // Activate selected
      const updated = await MongooseWebsiteConfig.findOneAndUpdate(
        { businessType },
        { isActive: true },
        { new: true }
      );
      return updated;
    }
    const db = readJSONDB();
    db.websiteConfigs = db.websiteConfigs.map(c => ({
      ...c,
      isActive: c.businessType === businessType
    }));
    writeJSONDB(db);
    return db.websiteConfigs.find(c => c.businessType === businessType);
  }
};

export const getDBStatus = () => {
  return {
    mode: useMongoDB ? 'MongoDB' : 'Local File Fallback',
    mongoURI: process.env.MONGO_URI || 'default',
    fallbackPath: FALLBACK_FILE_PATH
  };
};
