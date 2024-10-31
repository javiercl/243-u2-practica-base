// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userAuthController = require('../controllers/authController');
const globalParams = require('../middleware/globals');

// Get Page
module.exports = function(modules) {

    router.get('/login', (req, res) => res.render(req.layout_view, {user: req.user, modules:req.modules,title: 'Login', bodyContent: './login.ejs',loadingPath: req.loadingPath ,navbarPath: req.navbarPath}));

    router.get('/register', (req, res) => res.render(req.layout_view, {user: req.user, modules:req.modules, title: 'Registro', bodyContent: './register.ejs', loadingPath: req.loadingPath, navbarPath: req.navbarPath }));
    
    // Handle
    
    router.post('/register', userAuthController.registerUser);
    router.post('/login', userAuthController.loginUser);
    router.get('/logout', userAuthController.logoutUser);
    
    return router;
};
