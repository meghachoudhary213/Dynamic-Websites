import express from 'express';
import { WebsiteConfig, Blog, Notification, Course, Student, Product, Note, MockTest } from '../config/db.js';
import { verifyAdmin } from './auth.js';
import { defaultTemplates } from '../config/templates.js';

const router = express.Router();

// 1. Get currently active website configuration (Public)
router.get('/active', async (req, res) => {
  try {
    const config = await WebsiteConfig.findOne({ isActive: true });
    if (!config) {
      // Fallback: activate smartengine if nothing active
      const restored = await WebsiteConfig.setActiveConfig('smartengine');
      return res.json({ success: true, config: restored });
    }
    return res.json({ success: true, config });
  } catch (error) {
    console.error('Error fetching active config:', error);
    return res.status(500).json({ success: false, message: 'Server error loading active website.' });
  }
});

// 2. Get all available website configs (Admin)
router.get('/configs', verifyAdmin, async (req, res) => {
  try {
    const configs = await WebsiteConfig.find({});
    return res.json({ success: true, configs });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error loading configurations.' });
  }
});

// 2b. Provision/Create Dynamic Website (Admin)
router.post('/create', verifyAdmin, async (req, res) => {
  const { websiteName, category, primaryColor, accentColor, fonts, sectionsSelection, dashboardModulesSelection } = req.body;
  if (!websiteName || !category) {
    return res.status(400).json({ success: false, message: 'Website Name and Category are required.' });
  }

  const baseTemplate = defaultTemplates[category];
  if (!baseTemplate) {
    return res.status(400).json({ success: false, message: 'Invalid category selection.' });
  }

  try {
    // Generate unique slug
    const cleanName = websiteName.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const newSlug = `${category}_${cleanName}_${Math.random().toString(36).substring(2, 6)}`;

    // Clone and map dynamic sections
    const updatedSections = (baseTemplate.sections || []).map(sec => ({
      ...sec,
      visible: sectionsSelection ? sectionsSelection.includes(sec.id || sec.type) : true
    }));

    const newConfig = {
      businessType: newSlug,
      websiteName,
      isActive: true,
      theme: {
        ...baseTemplate.theme,
        name: websiteName,
        primary: primaryColor || baseTemplate.theme.primary,
        accent: accentColor || baseTemplate.theme.accent,
        fontFamily: fonts || baseTemplate.theme.fontFamily
      },
      hero: {
        ...baseTemplate.hero,
        title: websiteName
      },
      navigation: {
        ...baseTemplate.navigation,
        logoText: websiteName
      },
      sections: updatedSections,
      footer: {
        ...baseTemplate.footer,
        text: `© 2026 ${websiteName}. Centralized Nexus Platform.`
      },
      seo: {
        ...baseTemplate.seo,
        metaTitle: `${websiteName} - Managed via Nexus Command Center`,
        metaDescription: `Discover ${websiteName}, dynamically generated in Jabalpur SmartCity.`
      },
      dashboardModules: dashboardModulesSelection || baseTemplate.dashboardModules || [],
      fonts: fonts || 'Space Grotesk'
    };

    // Save dynamic config
    const created = await WebsiteConfig.findOneAndUpdate(
      { businessType: newSlug },
      newConfig,
      { upsert: true, new: true }
    );

    // Swap active state
    const updated = await WebsiteConfig.setActiveConfig(newSlug);

    const msg = `🚀 New dynamic website "${websiteName}" (${category.toUpperCase()}) successfully deployed via Nexus SaaS!`;
    await Notification.create({ message: msg });

    const io = req.app.get('io');
    if (io) {
      io.emit('config-updated', updated);
      io.emit('new-notification', { message: msg, timestamp: new Date() });
    }

    return res.json({ success: true, config: updated, message: msg });
  } catch (error) {
    console.error('Error creating dynamic website:', error);
    return res.status(500).json({ success: false, message: 'Failed to deploy SaaS website.' });
  }
});

// 3. Switch active business website type (Admin)
router.post('/switch', verifyAdmin, async (req, res) => {
  const { businessType } = req.body;
  if (!businessType) {
    return res.status(400).json({ success: false, message: 'Missing businessType.' });
  }

  try {
    const configExists = await WebsiteConfig.findOne({ businessType });
    if (!configExists && !defaultTemplates[businessType]) {
      return res.status(400).json({ success: false, message: 'Invalid or unsupported business website type.' });
    }

    const updated = await WebsiteConfig.setActiveConfig(businessType);
    
    // Create a real-time notification
    const siteName = configExists ? configExists.websiteName : businessType.toUpperCase();
    const msg = `Website switched to "${siteName}" template. Theme engine updated!`;
    await Notification.create({ message: msg });

    // Emit live event via socket.io (server.js will inject the socket server into req.app)
    const io = req.app.get('io');
    if (io) {
      io.emit('config-updated', updated);
      io.emit('new-notification', { message: msg, timestamp: new Date() });
    }

    return res.json({ success: true, config: updated, message: msg });
  } catch (error) {
    console.error('Error switching website type:', error);
    return res.status(500).json({ success: false, message: 'Error switching template.' });
  }
});

// 4. Update website configuration layout/colors/hero (Admin)
router.put('/config', verifyAdmin, async (req, res) => {
  const { businessType, theme, hero, navigation, sections, footer, seo, paymentDetails } = req.body;
  if (!businessType) {
    return res.status(400).json({ success: false, message: 'Missing businessType identifier.' });
  }

  try {
    const updated = await WebsiteConfig.findOneAndUpdate(
      { businessType },
      { theme, hero, navigation, sections, footer, seo, paymentDetails },
      { upsert: true, new: true }
    );

    const msg = `Custom parameters saved for ${businessType.toUpperCase()} landing page.`;
    await Notification.create({ message: msg });

    const io = req.app.get('io');
    if (io) {
      io.emit('config-updated', updated);
      io.emit('new-notification', { message: msg, timestamp: new Date() });
    }

    return res.json({ success: true, config: updated, message: 'Configuration saved successfully!' });
  } catch (error) {
    console.error('Error updating config:', error);
    return res.status(500).json({ success: false, message: 'Error saving parameters.' });
  }
});

// 5. Reset website configuration to its factory template setting (Admin)
router.post('/reset', verifyAdmin, async (req, res) => {
  const { businessType } = req.body;
  if (!businessType || !defaultTemplates[businessType]) {
    return res.status(400).json({ success: false, message: 'Invalid business type.' });
  }

  try {
    const activeDoc = await WebsiteConfig.findOne({ businessType });
    const isActive = activeDoc ? activeDoc.isActive : false;

    const restored = await WebsiteConfig.findOneAndUpdate(
      { businessType },
      { ...defaultTemplates[businessType], isActive },
      { overwrite: true, new: true }
    );

    const msg = `Restored factory defaults for ${businessType.toUpperCase()} template.`;
    await Notification.create({ message: msg });

    const io = req.app.get('io');
    if (io) {
      io.emit('config-updated', restored);
      io.emit('new-notification', { message: msg, timestamp: new Date() });
    }

    return res.json({ success: true, config: restored, message: 'Restored default configurations successfully!' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error resetting template.' });
  }
});

// 5b. Delete website configuration (Admin)
router.delete('/config/:businessType', verifyAdmin, async (req, res) => {
  const { businessType } = req.params;
  if (!businessType) {
    return res.status(400).json({ success: false, message: 'Missing businessType identifier.' });
  }

  // Protect default templates from deletion
  const defaultKeys = ['coaching', 'ecommerce', 'real_estate', 'hospital', 'cafe', 'startup', 'gym', 'tourism', 'cybersecurity', 'career', 'smartengine'];
  if (defaultKeys.includes(businessType)) {
    return res.status(400).json({ success: false, message: 'Cannot delete core default templates.' });
  }

  try {
    const config = await WebsiteConfig.findOne({ businessType });
    if (!config) {
      return res.status(404).json({ success: false, message: 'Website configuration not found.' });
    }

    // Delete configuration document
    await WebsiteConfig.deleteOne({ businessType });

    // Clean up associated dynamic models (courses, products, students) to prevent orphan data
    await Course.deleteMany({ websiteId: businessType });
    await Student.deleteMany({ websiteId: businessType });
    await Product.deleteMany({ websiteId: businessType });

    // If the deleted website was currently active, fall back to smartengine flagship
    if (config.isActive) {
      await WebsiteConfig.setActiveConfig('smartengine');
    }

    const msg = `🗑️ Dynamic website "${config.websiteName || businessType}" was permanently deleted.`;
    await Notification.create({ message: msg });

    const io = req.app.get('io');
    if (io) {
      const active = await WebsiteConfig.findOne({ isActive: true }) || await WebsiteConfig.setActiveConfig('smartengine');
      io.emit('config-updated', active);
      io.emit('new-notification', { message: msg, timestamp: new Date() });
    }

    return res.json({ success: true, message: 'Website configuration successfully deleted!' });
  } catch (error) {
    console.error('Error deleting configuration:', error);
    return res.status(500).json({ success: false, message: 'Server error deleting website configuration.' });
  }
});

// 6. Blog Operations
// Get blogs matching the current business type (Public)
router.get('/blogs/:type', async (req, res) => {
  try {
    const blogs = await Blog.find({ businessType: req.params.type });
    return res.json({ success: true, blogs });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error retrieving blogs.' });
  }
});

// Create a blog post (Admin)
router.post('/blogs', verifyAdmin, async (req, res) => {
  const { title, excerpt, content, image, businessType } = req.body;
  if (!title || !content || !businessType) {
    return res.status(400).json({ success: false, message: 'Title, Content and Business Type are required.' });
  }

  try {
    const newBlog = await Blog.create({
      title,
      excerpt: excerpt || title.substring(0, 100) + '...',
      content,
      image: image || 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=800&auto=format&fit=crop',
      businessType
    });

    const msg = `New blog published: "${title}" added to ${businessType.toUpperCase()}.`;
    await Notification.create({ message: msg });

    const io = req.app.get('io');
    if (io) {
      io.emit('new-notification', { message: msg, timestamp: new Date() });
    }

    return res.json({ success: true, blog: newBlog });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error publishing blog.' });
  }
});

// Delete a blog post (Admin)
router.delete('/blogs/:id', verifyAdmin, async (req, res) => {
  try {
    await Blog.deleteOne({ _id: req.params.id });
    return res.json({ success: true, message: 'Blog deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error deleting blog.' });
  }
});

// 7. Get system notification feeds (Admin)
router.get('/notifications', verifyAdmin, async (req, res) => {
  try {
    const notifs = await Notification.find({});
    return res.json({ success: true, notifications: notifs });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error loading notifications.' });
  }
});

// Clear/read all notifications (Admin)
router.post('/notifications/read', verifyAdmin, async (req, res) => {
  try {
    await Notification.updateMany({ read: false }, { read: true });
    return res.json({ success: true, message: 'All notifications marked as read.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error updating notifications.' });
  }
});

// 8. Razorpay integration simulation
router.post('/simulate-payment', async (req, res) => {
  const { amount, userName, planName } = req.body;
  if (!amount || !planName) {
    return res.status(400).json({ success: false, message: 'Missing payment parameters.' });
  }

  try {
    const transactionId = `pay_mock_${Math.random().toString(36).substring(2, 11)}`;
    const msg = `💳 payment Success! ${userName || 'Citizen'} paid ₹${amount} for "${planName}". TransID: ${transactionId}`;
    
    await Notification.create({ message: msg });

    const io = req.app.get('io');
    if (io) {
      io.emit('new-notification', { message: msg, timestamp: new Date() });
      io.emit('payment-success', { transactionId, amount, userName, planName });
    }

    return res.json({
      success: true,
      transactionId,
      message: 'Razorpay payment successfully simulated & broadcast!'
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error simulating payment.' });
  }
});

// 9. Get specific configuration profile by slug/businessType (Public)
router.get('/config/:businessType', async (req, res) => {
  try {
    const querySlug = req.params.businessType.toLowerCase();

    // 1. Direct businessType match
    let config = await WebsiteConfig.findOne({ businessType: req.params.businessType });

    // 2. Try case-insensitive businessType match
    if (!config) {
      config = await WebsiteConfig.findOne({
        businessType: { $regex: new RegExp(`^${querySlug}$`, 'i') }
      });
    }

    // 3. Try matches by websiteName clean slug or substring
    if (!config) {
      const allConfigs = await WebsiteConfig.find({});
      config = allConfigs.find(cfg => {
        const cleanName = (cfg.websiteName || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        const cleanQuery = querySlug.replace(/[^a-z0-9]/g, '');
        return cleanName === cleanQuery || cfg.businessType.toLowerCase().includes(cleanQuery);
      });
    }

    if (!config) {
      if (defaultTemplates[req.params.businessType]) {
        return res.json({ success: true, config: defaultTemplates[req.params.businessType] });
      }

      // Check if case-insensitive default template exists
      const matchedDefaultKey = Object.keys(defaultTemplates).find(
        key => key.toLowerCase() === querySlug
      );
      if (matchedDefaultKey) {
        return res.json({ success: true, config: defaultTemplates[matchedDefaultKey] });
      }

      return res.status(404).json({ success: false, message: 'Website configuration not found.' });
    }
    return res.json({ success: true, config });
  } catch (error) {
    console.error('Error fetching specific config:', error);
    return res.status(500).json({ success: false, message: 'Error retrieving configuration.' });
  }
});

// 10. Get dynamic collection data (courses, products, students) for a dynamic website (Public)
router.get('/data/:businessType', async (req, res) => {
  const { businessType } = req.params;
  try {
    const slugMap = {
      nextrank: 'nextrank',
      shopverse: 'shopverse',
      medicare: 'medicare',
      cybershield: 'cybershield'
    };
    
    const targetId = slugMap[businessType.toLowerCase()] || businessType;

    const courses = await Course.find({ websiteId: targetId });
    const students = await Student.find({ websiteId: targetId });
    const products = await Product.find({ websiteId: targetId });

    return res.json({
      success: true,
      courses,
      students,
      products
    });
  } catch (err) {
    console.error('Error fetching website data:', err);
    return res.status(500).json({ success: false, message: 'Server error retrieving dynamic data.' });
  }
});

// 11. Update product price sandbox (Public for demo checklist edits)
router.put('/product/price', async (req, res) => {
  const { productId, price } = req.body;
  if (!productId || !price) {
    return res.status(400).json({ success: false, message: 'Provide productId and price.' });
  }

  try {
    const updated = await Product.findOneAndUpdate(
      { productId },
      { price },
      { new: true }
    );
    return res.json({ success: true, product: updated });
  } catch (err) {
    console.error('Error updating product price:', err);
    return res.status(500).json({ success: false, message: 'Failed to write updates to MongoDB.' });
  }
});

// 12. Create dynamic catalog product (Public for demo dispatches)
router.post('/product/create', async (req, res) => {
  const { name, price, websiteId } = req.body;
  if (!name || !price || !websiteId) {
    return res.status(400).json({ success: false, message: 'Provide name, price, and websiteId.' });
  }

  try {
    const newProd = await Product.create({
      productId: `prd_${Math.random().toString(36).substring(2, 9)}`,
      websiteId,
      name,
      price,
      rating: 5.0,
      stock: 10,
      image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=400'
    });
    return res.json({ success: true, product: newProd });
  } catch (err) {
    console.error('Error creating product:', err);
    return res.status(500).json({ success: false, message: 'Failed to create product in MongoDB.' });
  }
});

// GET Student Dashboard Data (Dynamic Telemetry and Modules)
router.get('/student-dashboard/:email', async (req, res) => {
  const { email } = req.params;
  try {
    let student = await Student.findOne({ email: email.toLowerCase() });
    if (!student) {
      // Auto-provision a dynamic student record on-demand if it doesn't exist
      student = await Student.create({
        studentId: `std_${Math.random().toString(36).substring(2, 9)}`,
        websiteId: 'nextrank',
        name: email.split('@')[0],
        email: email.toLowerCase(),
        phone: '9827012345',
        attendance: 94.2,
        mockRank: 'AIR 142',
        diagnosedHours: 248,
        syllabusTrack: 76.4,
        enrolledCourses: ['crs_1'], // Default enroll in first course
        quizScores: {},
        attendanceLogs: []
      });
      console.log(`🌱 [STUDENT TELEMETRY AUTO-PROVISION] Seeding student profile for ${email}`);
    }

    const allCourses = await Course.find({ websiteId: 'nextrank' });
    const databaseCourses = allCourses && allCourses.length > 0 ? allCourses : [
      { courseId: 'crs_1', websiteId: 'nextrank', name: 'IIT-JEE Advanced Physics', duration: '12 Months', faculty: 'Dr. H.C. Verma', target: 'JEE 2027', fees: '₹15,000', progress: 78 },
      { courseId: 'crs_2', websiteId: 'nextrank', name: 'Organic Chemistry Masterclass', duration: '6 Months', faculty: 'Prof. D.K. Singh', target: 'JEE/NEET', fees: '₹8,500', progress: 62 },
      { courseId: 'crs_3', websiteId: 'nextrank', name: 'NEET Biology Diagnostics', duration: '9 Months', faculty: 'Dr. Shashi Bala', target: 'NEET 2026', fees: '₹12,000', progress: 91 }
    ];

    const studentEnrolledIds = student.enrolledCourses || ['crs_1'];
    
    // Map enrolled courses with their database properties
    const activeCourses = databaseCourses.map(course => {
      const isEnrolled = studentEnrolledIds.includes(course.courseId);
      return {
        ...course.toObject?.() || course,
        isEnrolled,
        progress: isEnrolled ? (course.progress || 60) : 0
      };
    });

    // Seed mock tests dynamically, highlighting student attempted records
    const defaultMockTests = [
      { id: 'test_phy_1', title: 'IIT-JEE Electrostatics MCQ Sprint', subject: 'Physics', duration: '20 mins', qCount: 4, date: 'Active' },
      { id: 'test_chem_1', title: 'NEET Organic Reaction Mechanism Quiz', subject: 'Chemistry', duration: '15 mins', qCount: 3, date: 'Active' },
      { id: 'test_math_1', title: 'JEE Advanced Limits & Derivatives Mock', subject: 'Mathematics', duration: '15 mins', qCount: 3, date: 'Active' }
    ];

    const studentScores = student.quizScores || {};
    const mockTests = defaultMockTests.map(test => {
      const attempt = studentScores[test.id];
      return {
        ...test,
        score: attempt ? `${attempt.score}/${test.qCount}` : '--',
        rank: attempt ? attempt.score >= 3 ? 'EXCELLENT' : 'PASSED' : 'UNATTEMPTED',
        attempted: !!attempt,
        attemptDate: attempt ? attempt.date : null
      };
    });

    const studentName = student.name || email.split('@')[0];
    const attendanceLogs = student.attendanceLogs && student.attendanceLogs.length > 0 ? student.attendanceLogs : [
      { name: studentName, timestamp: '08:02 AM', status: 'PRESENT', method: 'RFID Gate 2' },
      { name: studentName, timestamp: '08:15 AM', status: 'LATE', method: 'RFID Gate 1' },
      { name: studentName, timestamp: '07:58 AM', status: 'PRESENT', method: 'Biometric Scanner' }
    ];

    const notesLibrary = [
      { title: 'Advanced Electromagnetism Lecture Notes.pdf', date: 'May 26, 2026', author: 'Dr. H.C. Verma', size: '4.2 MB' },
      { title: 'Organic Reaction Mechanism Cheat-sheet.pdf', date: 'May 22, 2026', author: 'Prof. D.K. Singh', size: '2.8 MB' },
      { title: 'Plant Physiology Diagnostics Guide.pdf', date: 'May 18, 2026', author: 'Dr. Shashi Bala', size: '5.1 MB' }
    ];

    const faculty = [
      { name: 'Dr. H.C. Verma', subject: 'Physics Expert', qual: 'IIT Kanpur' },
      { name: 'Prof. D.K. Singh', subject: 'Chemistry Expert', qual: 'BITS Pilani' },
      { name: 'Dr. Shashi Bala', subject: 'Biology Expert', qual: 'AIIMS Delhi' }
    ];

    return res.json({
      success: true,
      student: {
        ...student.toObject?.() || student,
        attendanceLogs
      },
      courses: activeCourses,
      tests: mockTests,
      notes: notesLibrary,
      faculty
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error loading student details.' });
  }
});

// POST Course Enrollment
router.post('/enroll', async (req, res) => {
  const { email, courseId } = req.body;
  if (!email || !courseId) {
    return res.status(400).json({ success: false, message: 'Please provide email and courseId.' });
  }

  try {
    const student = await Student.findOne({ email: email.toLowerCase() });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found.' });
    }

    const enrolled = student.enrolledCourses || [];
    if (enrolled.includes(courseId)) {
      return res.status(400).json({ success: false, message: 'Already enrolled in this course.' });
    }

    const updatedEnrolled = [...enrolled, courseId];
    await Student.findOneAndUpdate(
      { email: email.toLowerCase() },
      { enrolledCourses: updatedEnrolled }
    );

    // Create system notification
    const msg = `🎓 Student "${student.name}" dynamically enrolled in course: ${courseId}!`;
    await Notification.create({ message: msg });

    const io = req.app.get('io');
    if (io) {
      io.emit('new-notification', { message: msg, timestamp: new Date() });
    }

    return res.json({ success: true, message: 'Successfully enrolled in course!', enrolledCourses: updatedEnrolled });
  } catch (error) {
    console.error('Enrollment error:', error);
    return res.status(500).json({ success: false, message: 'Server error during enrollment.' });
  }
});

// POST Mock Quiz Taking Submission
router.post('/submit-test', async (req, res) => {
  const { email, testId, score, answers, totalQuestions } = req.body;
  if (!email || !testId) {
    return res.status(400).json({ success: false, message: 'Please provide email, testId.' });
  }

  try {
    const student = await Student.findOne({ email: email.toLowerCase() });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found.' });
    }

    const scores = student.quizScores || {};
    scores[testId] = {
      score,
      totalQuestions,
      answers,
      date: new Date().toLocaleDateString(),
      timestamp: new Date().toISOString()
    };

    // Calculate dynamic AIR mock rank based on score
    let mockRank = student.mockRank || 'AIR 142';
    if (score >= 3) {
      mockRank = `AIR ${Math.floor(20 + Math.random() * 50)}`;
    } else if (score === 2) {
      mockRank = `AIR ${Math.floor(100 + Math.random() * 100)}`;
    } else {
      mockRank = `AIR ${Math.floor(250 + Math.random() * 200)}`;
    }

    const updated = await Student.findOneAndUpdate(
      { email: email.toLowerCase() },
      { quizScores: scores, mockRank }
    );

    // Create system notification
    const msg = `🏆 Student "${student.name}" completed Mock Test ${testId}! Score: ${score}/${totalQuestions}. Rank: ${mockRank}`;
    await Notification.create({ message: msg });

    const io = req.app.get('io');
    if (io) {
      io.emit('new-notification', { message: msg, timestamp: new Date() });
    }

    return res.json({ success: true, message: 'Test submitted successfully!', mockRank, quizScores: scores });
  } catch (error) {
    console.error('Submit test error:', error);
    return res.status(500).json({ success: false, message: 'Server error submitting mock test.' });
  }
});

// POST Student Profile Updates
router.post('/student-profile', async (req, res) => {
  const { email, name, phone, mockRank, diagnosedHours, syllabusTrack } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Please provide student email.' });
  }

  try {
    const student = await Student.findOne({ email: email.toLowerCase() });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found.' });
    }

    const updatedStudent = await Student.findOneAndUpdate(
      { email: email.toLowerCase() },
      {
        name: name || student.name,
        phone: phone || student.phone,
        mockRank: mockRank || student.mockRank,
        diagnosedHours: diagnosedHours || student.diagnosedHours,
        syllabusTrack: syllabusTrack || student.syllabusTrack
      }
    );

    await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      {
        name: name || student.name,
        phone: phone || student.phone
      }
    );

    const msg = `✍️ Student "${email}" updated profile parameters dynamically.`;
    await Notification.create({ message: msg });

    const io = req.app.get('io');
    if (io) {
      io.emit('new-notification', { message: msg, timestamp: new Date() });
    }

    return res.json({ success: true, message: 'Profile updated successfully!', student: updatedStudent });
  } catch (error) {
    console.error('Student profile update error:', error);
    return res.status(500).json({ success: false, message: 'Server error updating student profile.' });
  }
});

export default router;
