
const mysql = require('mysql2/promise');
require('dotenv').config();

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'vine_vision',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// Initialize the database (create tables if they don't exist)
const initializeDatabase = async () => {
  try {
    // Check if connection works
    await pool.query('SELECT 1');
    console.log('Database connection successful');
    
    // Create predictions table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS predictions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        file_name VARCHAR(255) NOT NULL,
        prediction VARCHAR(100) NOT NULL,
        confidence FLOAT,
        image_path VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
  }
};

// Save a prediction to the database
const savePrediction = async (fileName, prediction, confidence = null, imagePath = null) => {
  try {
    const [result] = await pool.query(
      'INSERT INTO predictions (file_name, prediction, confidence, image_path) VALUES (?, ?, ?, ?)',
      [fileName, prediction, confidence, imagePath]
    );
    return result.insertId;
  } catch (error) {
    console.error('Error saving prediction:', error);
    throw error;
  }
};

// Get prediction history
const getPredictionHistory = async (limit = 50) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM predictions ORDER BY created_at DESC LIMIT ?',
      [limit]
    );
    return rows.map(row => ({
      id: row.id,
      fileName: row.file_name,
      prediction: row.prediction,
      confidence: row.confidence,
      imageUrl: row.image_path,
      timestamp: row.created_at
    }));
  } catch (error) {
    console.error('Error fetching prediction history:', error);
    throw error;
  }
};

module.exports = {
  pool,
  initializeDatabase,
  savePrediction,
  getPredictionHistory
};
