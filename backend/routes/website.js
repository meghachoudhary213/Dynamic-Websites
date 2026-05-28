import express from 'express';
import { WebsiteConfig, Blog, Notification } from '../config/db.js';
import { verifyAdmin } from './auth.js';
import { defaultTemplates } from '../config/templates.js';

const router = express.Router();

// 1. Get currently active website configuration (Public)
router.get('/active', async (req, res) => {
  try {
    const config = await WebsiteConfig.findOne({ isActive: true });
    if (!config) {
      // Fallback: activate coaching if nothing active
      const restored = await WebsiteConfig.setActiveConfig('coaching');
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

// 3. Switch active business website type (Admin)
router.post('/switch', verifyAdmin, async (req, res) => {
  const { businessType } = req.body;
  if (!businessType || !defaultTemplates[businessType]) {
    return res.status(400).json({ success: false, message: 'Invalid or unsupported business website type.' });
  }

  try {
    const updated = await WebsiteConfig.setActiveConfig(businessType);
    
    // Create a real-time notification
    const msg = `Website switched to "${businessType.toUpperCase()}" template. Theme engine updated!`;
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
  const { businessType, theme, hero, navigation, sections, footer, seo } = req.body;
  if (!businessType) {
    return res.status(400).json({ success: false, message: 'Missing businessType identifier.' });
  }

  try {
    const updated = await WebsiteConfig.findOneAndUpdate(
      { businessType },
      { theme, hero, navigation, sections, footer, seo },
      { upsert: true }
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

export default router;
