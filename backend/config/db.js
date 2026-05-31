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

const WebsiteSchema = new mongoose.Schema({
  websiteId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  isActive: { type: Boolean, default: false }
}, { timestamps: true });

const CourseSchema = new mongoose.Schema({
  courseId: { type: String, required: true, unique: true },
  websiteId: { type: String, required: true },
  name: { type: String, required: true },
  duration: { type: String, required: true },
  faculty: { type: String, required: true },
  target: { type: String, required: true },
  fees: { type: String, required: true },
  progress: { type: Number, default: 0 }
}, { timestamps: true });

const StudentSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true },
  websiteId: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  attendance: { type: Number, default: 94.2 },
  mockRank: { type: String, default: "AIR 142" },
  diagnosedHours: { type: Number, default: 248 },
  syllabusTrack: { type: Number, default: 76.4 },
  enrolledCourses: { type: [String], default: [] },
  quizScores: { type: mongoose.Schema.Types.Mixed, default: {} },
  attendanceLogs: { type: mongoose.Schema.Types.Mixed, default: [] }
}, { timestamps: true });

const NoteSchema = new mongoose.Schema({
  noteId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  size: { type: String, required: true },
  date: { type: String, required: true }
}, { timestamps: true });

const MockTestSchema = new mongoose.Schema({
  testId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  subject: { type: String, required: true },
  duration: { type: String, required: true },
  qCount: { type: Number, required: true },
  questions: { type: mongoose.Schema.Types.Mixed, default: [] }
}, { timestamps: true });

const ProductSchema = new mongoose.Schema({
  productId: { type: String, required: true, unique: true },
  websiteId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  rating: { type: Number, default: 5.0 },
  stock: { type: Number, default: 10 },
  image: { type: String, required: true }
}, { timestamps: true });

let MongooseUser, MongooseBlog, MongooseNotification, MongooseWebsiteConfig, MongooseWebsite, MongooseCourse, MongooseStudent, MongooseProduct, MongooseNote, MongooseMockTest;

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
    MongooseWebsite = mongoose.model('Website', WebsiteSchema);
    MongooseCourse = mongoose.model('Course', CourseSchema);
    MongooseStudent = mongoose.model('Student', StudentSchema);
    MongooseProduct = mongoose.model('Product', ProductSchema);
    MongooseNote = mongoose.model('Note', NoteSchema);
    MongooseMockTest = mongoose.model('MockTest', MockTestSchema);

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

  // Seed default Websites
  const websiteCount = await MongooseWebsite.countDocuments();
  if (websiteCount === 0) {
    await MongooseWebsite.create({ websiteId: 'web_nextrank', name: 'NextRank Institute', slug: 'nextrank', category: 'coaching', isActive: true });
    await MongooseWebsite.create({ websiteId: 'web_shopverse', name: 'ShopVerse Store', slug: 'shopverse', category: 'ecommerce', isActive: true });
    console.log('🌱 Seeded default Websites in MongoDB (NextRank & ShopVerse)');
  }

  // Seed default Courses
  const courseCount = await MongooseCourse.countDocuments();
  if (courseCount === 0) {
    await MongooseCourse.create({ courseId: 'crs_1', websiteId: 'nextrank', name: 'IIT-JEE Advanced Physics', duration: '12 Months', faculty: 'Dr. H.C. Verma', target: 'JEE 2027', fees: '₹15,000', progress: 78 });
    await MongooseCourse.create({ courseId: 'crs_2', websiteId: 'nextrank', name: 'Organic Chemistry Masterclass', duration: '6 Months', faculty: 'Prof. D.K. Singh', target: 'JEE/NEET', fees: '₹8,500', progress: 62 });
    await MongooseCourse.create({ courseId: 'crs_3', websiteId: 'nextrank', name: 'NEET Biology Diagnostics', duration: '9 Months', faculty: 'Dr. Shashi Bala', target: 'NEET 2026', fees: '₹12,000', progress: 91 });
    console.log('🌱 Seeded default Courses in MongoDB');
  }

  // Seed default Students
  const studentCount = await MongooseStudent.countDocuments();
  if (studentCount === 0) {
    await MongooseStudent.create({ studentId: 'std_1', websiteId: 'nextrank', name: 'Aarav Sharma', email: 'aarav@gmail.com', phone: '9827012345', attendance: 94.2, mockRank: 'AIR 142', diagnosedHours: 248, syllabusTrack: 76.4 });
    console.log('🌱 Seeded default Students in MongoDB');
  }

  // Seed default Products
  const productCount = await MongooseProduct.countDocuments();
  if (productCount === 0) {
    await MongooseProduct.create({ productId: 'prd_1', websiteId: 'shopverse', name: 'ShopVerse Premium Leather Bag', price: 4200, rating: 4.8, stock: 12, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=400' });
    await MongooseProduct.create({ productId: 'prd_2', websiteId: 'shopverse', name: 'Luxury Autumn Woolen Jacket', price: 3800, rating: 4.7, stock: 8, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=400' });
    await MongooseProduct.create({ productId: 'prd_3', websiteId: 'shopverse', name: 'Gold Plated Chrono Watch', price: 6500, rating: 4.9, stock: 4, image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=400' });
    console.log('🌱 Seeded default Products in MongoDB');
  }

  // Seed default Notes
  const noteCount = await MongooseNote.countDocuments();
  if (noteCount === 0) {
    await MongooseNote.create({ noteId: 'note_1', title: 'Advanced Electromagnetism Lecture Notes.pdf', author: 'Dr. H.C. Verma', size: '4.2 MB', date: 'May 26, 2026' });
    await MongooseNote.create({ noteId: 'note_2', title: 'Organic Reaction Mechanism Cheat-sheet.pdf', author: 'Prof. D.K. Singh', size: '2.8 MB', date: 'May 22, 2026' });
    await MongooseNote.create({ noteId: 'note_3', title: 'Plant Physiology Diagnostics Guide.pdf', author: 'Dr. Shashi Bala', size: '5.1 MB', date: 'May 18, 2026' });
    console.log('🌱 Seeded default Notes in MongoDB');
  }

  // Seed default MockTests
  const testCount = await MongooseMockTest.countDocuments();
  if (testCount === 0) {
    await MongooseMockTest.create({
      testId: 'test_phy_1',
      title: 'IIT-JEE Electrostatics MCQ Sprint',
      subject: 'Physics',
      duration: '20 mins',
      qCount: 4,
      questions: [
        { q: "What is the electric field inside a hollow charged spherical conductor of radius R at a distance r < R?", options: ["Zero", "kQ/R²", "kQ/r²", "Infinite"], answer: 0 },
        { q: "Two charges +q and -q are separated by a distance 2d. What is the electric dipole moment?", options: ["q*d", "2qd", "q/2d", "Zero"], answer: 1 },
        { q: "What is the SI unit of electric permittivity (ε₀)?", options: ["C² N⁻¹ m⁻²", "C N m", "N m² C⁻²", "None of these"], answer: 0 },
        { q: "The capacitance of a parallel plate capacitor does NOT depend on which of the following?", options: ["Area of plates", "Distance between plates", "Material of plates", "Permittivity of dielectric"], answer: 2 }
      ]
    });
    await MongooseMockTest.create({
      testId: 'test_chem_1',
      title: 'NEET Organic Reaction Mechanism Quiz',
      subject: 'Chemistry',
      duration: '15 mins',
      qCount: 3,
      questions: [
        { q: "Which of the following organic carboxylic acids is the strongest?", options: ["CH₃COOH (Acetic)", "ClCH₂COOH (Monochloroacetic)", "Cl₂CHCOOH (Dichloroacetic)", "Cl₃CCOOH (Trichloroacetic)"], answer: 3 },
        { q: "What is the hybridization of carbon atoms in Ethane, Ethene, and Ethyne respectively?", options: ["sp, sp², sp³", "sp³, sp², sp", "sp², sp³, sp", "sp³, sp, sp²"], answer: 1 },
        { q: "Which organic nucleophilic substitution mechanism involves a carbocation intermediate?", options: ["SN1 reaction", "SN2 reaction", "E2 elimination", "None of these"], answer: 0 }
      ]
    });
    await MongooseMockTest.create({
      testId: 'test_math_1',
      title: 'JEE Advanced Limits & Derivatives Mock',
      subject: 'Mathematics',
      duration: '15 mins',
      qCount: 3,
      questions: [
        { q: "Find the limit: lim (x -> 0) of sin(x) / x.", options: ["0", "1", "Infinite", "Undefined"], answer: 1 },
        { q: "What is the derivative of ln(sin(x)) with respect to x?", options: ["tan(x)", "cot(x)", "-cot(x)", "1 / sin(x)"], answer: 1 },
        { q: "Find the derivative of e^(3x²) with respect to x.", options: ["6x * e^(3x²)", "e^(3x²)", "3x * e^(3x²)", "6 * e^(3x²)"], answer: 0 }
      ]
    });
    console.log('🌱 Seeded default MockTests in MongoDB');
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
    })),
    websites: [
      { _id: 'web_nextrank', websiteId: 'web_nextrank', name: 'NextRank Institute', slug: 'nextrank', category: 'coaching', isActive: true, createdAt: new Date().toISOString() },
      { _id: 'web_shopverse', websiteId: 'web_shopverse', name: 'ShopVerse Store', slug: 'shopverse', category: 'ecommerce', isActive: true, createdAt: new Date().toISOString() }
    ],
    courses: [
      { _id: 'crs_1', courseId: 'crs_1', websiteId: 'nextrank', name: 'IIT-JEE Advanced Physics', duration: '12 Months', faculty: 'Dr. H.C. Verma', target: 'JEE 2027', fees: '₹15,000', progress: 78, createdAt: new Date().toISOString() },
      { _id: 'crs_2', courseId: 'crs_2', websiteId: 'nextrank', name: 'Organic Chemistry Masterclass', duration: '6 Months', faculty: 'Prof. D.K. Singh', target: 'JEE/NEET', fees: '₹8,500', progress: 62, createdAt: new Date().toISOString() },
      { _id: 'crs_3', courseId: 'crs_3', websiteId: 'nextrank', name: 'NEET Biology Diagnostics', duration: '9 Months', faculty: 'Dr. Shashi Bala', target: 'NEET 2026', fees: '₹12,000', progress: 91, createdAt: new Date().toISOString() }
    ],
    students: [
      { _id: 'std_1', studentId: 'std_1', websiteId: 'nextrank', name: 'Aarav Sharma', email: 'aarav@gmail.com', phone: '9827012345', attendance: 94.2, mockRank: 'AIR 142', diagnosedHours: 248, syllabusTrack: 76.4, createdAt: new Date().toISOString() }
    ],
    products: [
      { _id: 'prd_1', productId: 'prd_1', websiteId: 'shopverse', name: 'ShopVerse Premium Leather Bag', price: 4200, rating: 4.8, stock: 12, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=400', createdAt: new Date().toISOString() },
      { _id: 'prd_2', productId: 'prd_2', websiteId: 'shopverse', name: 'Luxury Autumn Woolen Jacket', price: 3800, rating: 4.7, stock: 8, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=400', createdAt: new Date().toISOString() },
      { _id: 'prd_3', productId: 'prd_3', websiteId: 'shopverse', name: 'Gold Plated Chrono Watch', price: 6500, rating: 4.9, stock: 4, image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=400', createdAt: new Date().toISOString() }
    ]
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

export const Website = {
  find: async (query = {}) => {
    if (useMongoDB) return MongooseWebsite.find(query);
    const db = readJSONDB();
    return db.websites.filter(w => Object.keys(query).every(k => w[k] === query[k]));
  },
  findOne: async (query = {}) => {
    if (useMongoDB) return MongooseWebsite.findOne(query);
    const db = readJSONDB();
    return db.websites.find(w => Object.keys(query).every(k => w[k] === query[k])) || null;
  },
  create: async (data) => {
    if (useMongoDB) return MongooseWebsite.create(data);
    const db = readJSONDB();
    const newDoc = { _id: `web_${uuidv4()}`, ...data, createdAt: new Date().toISOString() };
    db.websites.push(newDoc);
    writeJSONDB(db);
    return newDoc;
  }
};

export const Course = {
  find: async (query = {}) => {
    if (useMongoDB) return MongooseCourse.find(query);
    const db = readJSONDB();
    return db.courses.filter(c => Object.keys(query).every(k => c[k] === query[k]));
  },
  findOne: async (query = {}) => {
    if (useMongoDB) return MongooseCourse.findOne(query);
    const db = readJSONDB();
    return db.courses.find(c => Object.keys(query).every(k => c[k] === query[k])) || null;
  },
  create: async (data) => {
    if (useMongoDB) return MongooseCourse.create(data);
    const db = readJSONDB();
    const newDoc = { _id: `crs_${uuidv4()}`, ...data, createdAt: new Date().toISOString() };
    db.courses.push(newDoc);
    writeJSONDB(db);
    return newDoc;
  }
};

export const Student = {
  find: async (query = {}) => {
    if (useMongoDB) return MongooseStudent.find(query);
    const db = readJSONDB();
    return db.students.filter(s => Object.keys(query).every(k => s[k] === query[k]));
  },
  findOne: async (query = {}) => {
    if (useMongoDB) return MongooseStudent.findOne(query);
    const db = readJSONDB();
    return db.students.find(s => Object.keys(query).every(k => s[k] === query[k])) || null;
  },
  findOneAndUpdate: async (query = {}, updateData = {}, options = {}) => {
    if (useMongoDB) {
      return MongooseStudent.findOneAndUpdate(query, updateData, { new: true, ...options });
    }
    const db = readJSONDB();
    let index = db.students.findIndex(s => Object.keys(query).every(k => s[k] === query[k]));
    if (index === -1) {
      if (options.upsert) {
        const newDoc = { _id: `std_${uuidv4()}`, ...query, ...updateData, createdAt: new Date().toISOString() };
        db.students.push(newDoc);
        writeJSONDB(db);
        return newDoc;
      }
      return null;
    }
    const updated = { ...db.students[index], ...updateData, updatedAt: new Date().toISOString() };
    db.students[index] = updated;
    writeJSONDB(db);
    return updated;
  },
  create: async (data) => {
    if (useMongoDB) return MongooseStudent.create(data);
    const db = readJSONDB();
    const newDoc = { _id: `std_${uuidv4()}`, ...data, createdAt: new Date().toISOString() };
    db.students.push(newDoc);
    writeJSONDB(db);
    return newDoc;
  }
};

export const Product = {
  find: async (query = {}) => {
    if (useMongoDB) return MongooseProduct.find(query);
    const db = readJSONDB();
    return db.products.filter(p => Object.keys(query).every(k => p[k] === query[k]));
  },
  findOne: async (query = {}) => {
    if (useMongoDB) return MongooseProduct.findOne(query);
    const db = readJSONDB();
    return db.products.find(p => Object.keys(query).every(k => p[k] === query[k])) || null;
  },
  findOneAndUpdate: async (query = {}, updateData = {}, options = {}) => {
    if (useMongoDB) {
      return MongooseProduct.findOneAndUpdate(query, updateData, { new: true, ...options });
    }
    const db = readJSONDB();
    let index = db.products.findIndex(p => Object.keys(query).every(k => p[k] === query[k]));
    if (index === -1) {
      if (options.upsert) {
        const newDoc = { _id: `prd_${uuidv4()}`, ...query, ...updateData, createdAt: new Date().toISOString() };
        db.products.push(newDoc);
        writeJSONDB(db);
        return newDoc;
      }
      return null;
    }
    const updated = { ...db.products[index], ...updateData, updatedAt: new Date().toISOString() };
    db.products[index] = updated;
    writeJSONDB(db);
    return updated;
  },
  create: async (data) => {
    if (useMongoDB) return MongooseProduct.create(data);
    const db = readJSONDB();
    const newDoc = { _id: `prd_${uuidv4()}`, ...data, createdAt: new Date().toISOString() };
    db.products.push(newDoc);
    writeJSONDB(db);
    return newDoc;
  }
};

export const Note = {
  find: async (query = {}) => {
    if (useMongoDB) return MongooseNote.find(query);
    const db = readJSONDB();
    if (!db.notes) db.notes = [];
    return db.notes.filter(n => Object.keys(query).every(k => n[k] === query[k]));
  },
  findOne: async (query = {}) => {
    if (useMongoDB) return MongooseNote.findOne(query);
    const db = readJSONDB();
    if (!db.notes) db.notes = [];
    return db.notes.find(n => Object.keys(query).every(k => n[k] === query[k])) || null;
  },
  create: async (data) => {
    if (useMongoDB) return MongooseNote.create(data);
    const db = readJSONDB();
    if (!db.notes) db.notes = [];
    const newDoc = { _id: `note_${uuidv4()}`, ...data, createdAt: new Date().toISOString() };
    db.notes.push(newDoc);
    writeJSONDB(db);
    return newDoc;
  }
};

export const MockTest = {
  find: async (query = {}) => {
    if (useMongoDB) return MongooseMockTest.find(query);
    const db = readJSONDB();
    if (!db.mockTests) db.mockTests = [];
    return db.mockTests.filter(t => Object.keys(query).every(k => t[k] === query[k]));
  },
  findOne: async (query = {}) => {
    if (useMongoDB) return MongooseMockTest.findOne(query);
    const db = readJSONDB();
    if (!db.mockTests) db.mockTests = [];
    return db.mockTests.find(t => Object.keys(query).every(k => t[k] === query[k])) || null;
  },
  findOneAndUpdate: async (query = {}, updateData = {}, options = {}) => {
    if (useMongoDB) {
      return MongooseMockTest.findOneAndUpdate(query, updateData, { new: true, ...options });
    }
    const db = readJSONDB();
    if (!db.mockTests) db.mockTests = [];
    let index = db.mockTests.findIndex(t => Object.keys(query).every(k => t[k] === query[k]));
    if (index === -1) {
      if (options.upsert) {
        const newDoc = { _id: `test_${uuidv4()}`, ...query, ...updateData, createdAt: new Date().toISOString() };
        db.mockTests.push(newDoc);
        writeJSONDB(db);
        return newDoc;
      }
      return null;
    }
    const updated = { ...db.mockTests[index], ...updateData, updatedAt: new Date().toISOString() };
    db.mockTests[index] = updated;
    writeJSONDB(db);
    return updated;
  },
  create: async (data) => {
    if (useMongoDB) return MongooseMockTest.create(data);
    const db = readJSONDB();
    if (!db.mockTests) db.mockTests = [];
    const newDoc = { _id: `test_${uuidv4()}`, ...data, createdAt: new Date().toISOString() };
    db.mockTests.push(newDoc);
    writeJSONDB(db);
    return newDoc;
  }
};

export const getDBStatus = () => {
  return {
    mode: useMongoDB ? 'MongoDB' : 'Local File Fallback',
    mongoURI: process.env.MONGO_URI || 'default',
    fallbackPath: FALLBACK_FILE_PATH
  };
};
