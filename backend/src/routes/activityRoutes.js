import express from 'express';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Log user activity
router.post('/log', async (req, res) => {
  try {
    const activity = {
      ...req.body,
      _id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    
    // In a real app, save to MongoDB
    // const newActivity = new Activity(activity);
    // await newActivity.save();
    
    // For demo, add to in-memory storage
    req.db.activities.push(activity);
    
    res.status(201).json({ message: 'Activity logged successfully' });
  } catch (error) {
    console.error('Error logging activity:', error);
    res.status(500).json({ message: 'Failed to log activity' });
  }
});

// Get all activities (admin only, requires authentication)
router.get('/', verifyToken, async (req, res) => {
  try {
    const { startDate, endDate, filter } = req.query;
    
    // Filter activities by date range and type
    let filteredActivities = req.db.activities;
    
    if (startDate && endDate) {
      const start = new Date(startDate).getTime();
      const end = new Date(endDate).getTime() + 86400000; // Add one day to include the end date fully
      
      filteredActivities = filteredActivities.filter(
        activity => activity.timestamp >= start && activity.timestamp <= end
      );
    }
    
    if (filter && filter !== 'all') {
      if (filter === 'tab') {
        filteredActivities = filteredActivities.filter(
          activity => activity.type === 'tabLeave' || activity.type === 'tabReturn'
        );
      } else {
        filteredActivities = filteredActivities.filter(
          activity => activity.type === filter
        );
      }
    }
    
    res.json(filteredActivities);
  } catch (error) {
    console.error('Error retrieving activities:', error);
    res.status(500).json({ message: 'Failed to retrieve activities' });
  }
});

// Get activities by session ID
router.get('/session/:sessionId', verifyToken, async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const sessionActivities = req.db.activities.filter(
      activity => activity.sessionId === sessionId
    );
    
    res.json(sessionActivities);
  } catch (error) {
    console.error('Error retrieving session activities:', error);
    res.status(500).json({ message: 'Failed to retrieve session activities' });
  }
});

export default router;