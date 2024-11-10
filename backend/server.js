const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const port = process.env.PORT || 8080; // Use environment PORT if available, default to 8080

// Determine allowed origins for CORS based on environment
const allowedOrigins = [
  'http://localhost:3000',
  process.env.REACT_APP_URL, // Add your deployed front-end URL as an allowed origin
];

// CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Preflight requests

app.use(express.json());
app.use(cookieParser());

const { connectDB } = require('./db');

(async () => {
  try {
    await connectDB();
    app.use('/user/auth', require('./Routes/Auth'));
    app.use('/user/data', require('./Routes/Data'));
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
  }
})();

// Error-handling middleware
app.use((err, req, res, next) => {
  console.error('Internal Server Error:', err);
  res.status(500).send('Something went wrong!');
});
