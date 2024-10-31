// routes/index.js
const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Home Page
module.exports = function(modules) {
    router.get('/', (req, res) => {
        // Renderizar la vista pasando el contenido del cuerpo como parámetro
        res.render(req.layout_view, { user:req.user, modules:modules, title: 'Home', bodyContent: './index.ejs',loadingPath: req.loadingPath,navbarPath: req.navbarPath });
    });

    return router;
};
