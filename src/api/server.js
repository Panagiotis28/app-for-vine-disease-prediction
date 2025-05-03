const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');

const {
  initializeDatabase,
  savePrediction,
  getPredictionHistory
} = require('./database');
const healthApi = require('./health-api');

const app = express();
const PORT = process.env.PORT || 3000;

// Make sure we always use a single uploads folder at the project root
const UPLOAD_DIR = path.resolve(process.cwd(), 'uploads');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// Initialize database
initializeDatabase();

// Middleware
app.use(cors());
app.use(express.json());

// Health check & other API routes
app.use('/api', healthApi);

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Flask API URL (can be overridden via ENV)
const FLASK_API_URL = process.env.FLASK_API_URL || 'http://127.0.0.1:5000';

// Prediction endpoint
app.post('/api/predict', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ error: 'missing_file', message: 'No image file uploaded' });
    }

    // Prepare form data for Flask API
    const imagePath = req.file.path;
    const imageStream = fs.createReadStream(imagePath);
    const formData = new FormData();
    formData.append('file', imageStream);

    // Send to Flask API
    const response = await axios.post(
      `${FLASK_API_URL}/predict`,
      formData,
      { headers: formData.getHeaders() }
    );

    const { prediction, confidence } = response.data;

    // Save to database
    await savePrediction(
      req.file.originalname,
      prediction,
      confidence,
      req.file.filename
    );

    // Return to client
    res.json({
      prediction,
      confidence,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).json({
      error: 'processing_error',
      message: error.message || 'Failed to process image'
    });
  }
});

// History endpoint
app.get('/api/history', async (req, res) => {
  try {
    const history = await getPredictionHistory();
    res.json(history);
  } catch (error) {
    console.error('Error fetching prediction history:', error);
    res.status(500).json({
      error: 'database_error',
      message: 'Failed to retrieve prediction history'
    });
  }
});

// Serve uploads from the same folder
app.use('/uploads', express.static(UPLOAD_DIR));

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Flask API URL: ${FLASK_API_URL}`);
});
