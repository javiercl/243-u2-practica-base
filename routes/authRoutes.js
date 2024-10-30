// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userAuthController = require('../controllers/authController');
const globalParams = require('../middleware/globals');

// Get Page
module.exports = function(modules) {

    router.get('/login', (req, res) => res.render('login',{user: req.user, modules:req.modules}));
    router.get('/register', (req, res) => res.render('register',{user: req.user, modules:req.modules}));
    
    // Handle
    
    router.post('/register', userAuthController.registerUser);
    router.post('/login', userAuthController.loginUser);
    router.get('/logout', userAuthController.logoutUser);
    
    return router;
};
