// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userAuthController = require('../controllers/authController');

// Get Page
router.get('/login', (req, res) => res.render('login'));
router.get('/register', (req, res) => res.render('register'));

// Handle
router.post('/register', userAuthController.registerUser);
router.post('/login', userAuthController.loginUser);
router.get('/logout', userAuthController.logoutUser);


module.exports = router;
