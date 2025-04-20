import express from 'express';
import { Worker } from 'worker_threads';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const router = express.Router();
const __dirname = dirname(fileURLToPath(import.meta.url));

// Execute code in a sandboxed environment
router.post('/execute', async (req, res) => {
  try {
    const { code, language } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }
    
    // Create a worker to run the code in isolation
    const worker = new Worker(join(__dirname, '../workers/codeExecutor.js'), {
      workerData: { code, language }
    });
    
    // Set a timeout of 5 seconds
    const timeout = setTimeout(() => {
      worker.terminate();
      res.status(408).json({ error: 'Execution timed out' });
    }, 5000);
    
    worker.on('message', (result) => {
      clearTimeout(timeout);
      res.json(result);
    });
    
    worker.on('error', (error) => {
      clearTimeout(timeout);
      res.status(500).json({ error: error.message });
    });
    
    worker.on('exit', (code) => {
      if (code !== 0) {
        clearTimeout(timeout);
        res.status(500).json({ error: 'Worker stopped unexpectedly' });
      }
    });
  } catch (error) {
    console.error('Error executing code:', error);
    res.status(500).json({ error: 'Failed to execute code' });
  }
});

export default router;