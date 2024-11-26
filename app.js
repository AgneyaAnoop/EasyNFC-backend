require('dotenv').config();
const express = require('express');
const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const cors = require('cors');

const app = express();

const corsOptions = {
  origin: '*',                    // Allow all origins
  methods: '*',                   // Allow all methods
  allowedHeaders: '*',            // Allow all headers
  credentials: true,              // Enable credentials
  optionsSuccessStatus: 200       // Some legacy browsers choke on 204
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle pre-flight requests
app.options('*', cors(corsOptions));

connectDB();


app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});