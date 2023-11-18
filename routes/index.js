const express = require('express');
const userRoutes = require('./userRoutes');
const thoughtRoutes = require('./thoughtRoutes');

const router = express.Router();

// Define your routes
router.use('/users', userRoutes);
router.use('/thoughts', thoughtRoutes);

module.exports = router;