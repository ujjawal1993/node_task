// app.js
require('dotenv').config(); // .env variables use karne ke liye
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Import all routes
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const serviceRoutes = require('./routes/serviceRoutes');

// Use routes
app.use('/api', authRoutes);
app.use('/api', categoryRoutes);
app.use('/api', serviceRoutes);

module.exports = app;
