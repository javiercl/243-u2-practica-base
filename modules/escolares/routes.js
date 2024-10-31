// routes/userRoutes.js
const express = require('express');
const Alumno = require('./alumnos/models');
const Profesor = require('./profesores/models');
const Materias = require('./materias/models');

const router = express.Router();

const configbaseRoutes = require('../../routes/baseRoutes');

module.exports = function(app) {
    configbaseRoutes(router, {
        moduleName: 'escolares/alumnos',
        view_list: 'list',
        view_form: 'form',
        model: Alumno,
        route: '/alumnos',
        title: 'Alumnos'
    });
    configbaseRoutes(router, {
        moduleName: 'escolares/profesores',
        view_list: 'list',
        view_form: 'form',
        model: Profesor,
        route: '/profesores',
        title: 'Profesores'
    });
    configbaseRoutes(router, {
        moduleName: 'escolares/materias',
        view_list: 'list',
        view_form: 'form',
        model: Materias,
        route: '/materias',
        title: 'Materias'
    });

    app.use(`/escolares`, router);
};