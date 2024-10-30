
const express = require('express');
const router = express.Router();

const User = require('./users/models');

const usersBaseRoutes = require('../../routes/baseRoutes');

module.exports = function(app) {
    usersBaseRoutes(router, {
        moduleName: 'base/users',
        view_list: 'users_list',
        view_create: 'users_create',
        view_edit: 'users_edit',
        model: User,
        route: '/users',
    });
    app.use(`/base`, router);
}
