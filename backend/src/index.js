import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import activityRoutes from './routes/activityRoutes.js';
import similarityRoutes from './routes/similarityRoutes.js';
import authRoutes from './routes/authRoutes.js';
import codeRoutes from './routes/codeRoutes.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// For demo purposes, use in-memory storage
const inMemoryDB = {
  activities: [],
  similarityReports: [],
  users: [
    { id: '1', username: 'admin', password: 'admin123', role: 'admin' }
  ]
};

// Make in-memory DB available to routes
app.use((req, res, next) => {
  req.db = inMemoryDB;
  next();
});

// Routes
app.use('/api/activity', activityRoutes);
app.use('/api/similarity', similarityRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/code', codeRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Code Plagiarism Detection API');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// For clean shutdown
process.on('SIGINT', () => {
  console.log('Closing server gracefully');
  process.exit(0);
});