import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, getDBStatus } from './config/db.js';

// Load Environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);

// Bind Socket.io with robust CORS access
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for dev simplicity
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// Port configuration
const PORT = process.env.PORT || 5000;

// Enable Middlewares
app.use(cors());
app.use(express.json());

// Inject socket server into req context
app.set('io', io);

// Import API Routers
import authRouter from './routes/auth.js';
import websiteRouter from './routes/website.js';
import aiRouter from './routes/ai.js';

// Bind API Routes
app.use('/api/auth', authRouter);
app.use('/api/website', websiteRouter);
app.use('/api/ai', aiRouter);

// Base server check endpoint
app.get('/api/status', (req, res) => {
  const dbStatus = getDBStatus();
  return res.json({
    status: 'ONLINE',
    time: new Date().toISOString(),
    database: dbStatus,
    platform: 'Jabalpur SmartEngine MERN Node API'
  });
});

// Socket.io Real-time Event Pipeline
io.on('connection', (socket) => {
  console.log(`🔌 Web Client Connected: ${socket.id}`);
  
  socket.emit('system-ready', {
    message: 'Established WebSocket link with Jabalpur SmartEngine.',
    serverTime: new Date()
  });

  socket.on('disconnect', () => {
    console.log(`🔌 Web Client Disconnected: ${socket.id}`);
  });
});

// Start Server and Database Connection
async function startServer() {
  try {
    // Connect to MongoDB or fall back transparently
    await connectDB();

    server.listen(PORT, () => {
      console.log(`\n======================================================`);
      console.log(`🚀 Jabalpur SmartEngine Server Running on Port: ${PORT}`);
      console.log(`🔗 Local Address: http://localhost:${PORT}`);
      console.log(`⚡ WebSocket Server: listening for events...`);
      console.log(`🛡️ Admin panel seed credential ready.`);
      console.log(`======================================================\n`);
    });
  } catch (error) {
    console.error('Fatal Server Boot Error:', error);
    process.exit(1);
  }
}

startServer();
