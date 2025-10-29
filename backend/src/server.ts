import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import prisma from './config/prisma';
import authRoutes from './routes/authRoutes';
import adminRoutes from './routes/adminRoutes';
import storeRoutes from './routes/storeRoutes';
import userRoutes from './routes/userRoutes';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'API is healthy' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/user', userRoutes);

// Error handling
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Server Error:', err);
  res.status(500).json({ message: 'Something broke!', error: err.message });
});

// Start server
async function startServer() {
  try {
    console.log('⏳ Connecting to database...');
    await prisma.$connect();
    console.log('✅ Database connected');

    // Start Express server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('🛑 SIGINT received: closing database connection...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('🛑 SIGTERM received: closing database connection...');
  await prisma.$disconnect();
  process.exit(0);
});

startServer();
