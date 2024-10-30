// routes/index.js
const express = require('express');
const router = express.Router();

// Home Page
module.exports = function(modules) {
    router.get('/', (req, res) => res.render('index', { user: req.user,  modules:req.modules}));
    
    return router;
};
