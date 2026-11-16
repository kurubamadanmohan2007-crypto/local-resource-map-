const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const resourceRoutes = require('./routes/resourceRoutes');

// Load environment variables
dotenv.config();

// Connect to Database (with automatic fallback if local mongod is offline)
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger for API calls
app.use((req, res, next) => {
  console.log(`[API] ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/api', resourceRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Local Resource Map API'
  });
});

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Error]', err.stack || err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`  Local Resource Map - Backend Server Running`);
  console.log(`  Port: http://localhost:${PORT}`);
  console.log(`  API Health: http://localhost:${PORT}/api/health`);
  console.log(`  API Resources: http://localhost:${PORT}/api/resources`);
  console.log(`  API Stats: http://localhost:${PORT}/api/stats`);
  console.log(`======================================================\n`);
});
