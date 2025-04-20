import express from 'express';
import stringSimilarity from 'string-similarity';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Check similarity of content
router.post('/check', async (req, res) => {
  try {
    const { content, sessionId = 'unknown' } = req.body;
    
    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }
    
    // Split content into lines for line-by-line comparison
    const lines = content.split('\n');
    
    // For demo purposes, we'll use a simple approach
    // In a real system, this would compare against a database of previous submissions
    
    // Check for suspicious patterns
    const suspiciousLines = [];
    let totalSimilarity = 0;
    
    // Simple pattern detection (large blocks of identical code)
    for (let i = 0; i < lines.length; i++) {
      // Check if line is suspiciously similar to another line
      for (let j = 0; j < i; j++) {
        if (lines[i].trim() && lines[j].trim() && i !== j) {
          const similarity = stringSimilarity.compareTwoStrings(lines[i], lines[j]);
          
          if (similarity > 0.8) {
            suspiciousLines.push(i + 1); // 1-based line numbering
            break;
          }
        }
      }
      
      // Generate a random similarity score for demo purposes
      // In a real system, this would be calculated based on comparison with a corpus
      totalSimilarity += Math.random() * 0.15; // Random value between 0 and 0.15
    }
    
    // Normalize total similarity
    const similarityScore = Math.min(totalSimilarity / lines.length, 0.95);
    
    // Create a report
    const report = {
      sessionId: sessionId,
      timestamp: Date.now(),
      similarityScore,
      algorithm: 'Jaccard+Levenshtein',
      suspiciousLines: [...new Set(suspiciousLines)], // Remove duplicates
      contentLength: content.length
    };
    
    // In a real app, save to MongoDB
    // const newReport = new SimilarityReport(report);
    // await newReport.save();
    
    // For demo, add to in-memory storage
    req.db.similarityReports.push(report);
    
    res.json(report);
  } catch (error) {
    console.error('Error checking similarity:', error);
    res.status(500).json({ message: 'Failed to check similarity' });
  }
});

// Get all similarity reports (admin only)
router.get('/', verifyToken, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Filter reports by date range
    let filteredReports = req.db.similarityReports;
    
    if (startDate && endDate) {
      const start = new Date(startDate).getTime();
      const end = new Date(endDate).getTime() + 86400000; // Add one day to include the end date fully
      
      filteredReports = filteredReports.filter(
        report => report.timestamp >= start && report.timestamp <= end
      );
    }
    
    res.json(filteredReports);
  } catch (error) {
    console.error('Error retrieving similarity reports:', error);
    res.status(500).json({ message: 'Failed to retrieve similarity reports' });
  }
});

// Get similarity reports by session ID
router.get('/session/:sessionId', verifyToken, async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const sessionReports = req.db.similarityReports.filter(
      report => report.sessionId === sessionId
    );
    
    res.json(sessionReports);
  } catch (error) {
    console.error('Error retrieving session reports:', error);
    res.status(500).json({ message: 'Failed to retrieve session reports' });
  }
});

export default router;