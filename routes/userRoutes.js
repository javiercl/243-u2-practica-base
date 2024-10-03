// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { ensureAuthenticated, ensureAdmin } = require('../middleware/auth'); // Importar los middlewares de autenticació

const upload = require('../config/multer');

// Rutas para usuarios
router.get('/', ensureAuthenticated, userController.getUsers); // Mostrar la lista de usuarios
router.get('/new', ensureAuthenticated, userController.showCreateUserForm); // Mostrar formulario de creación de usuario
router.post('/new', ensureAuthenticated, upload.single('profileImage'), userController.createUser); // Crear un nuevo usuario
router.get('/edit/:id', ensureAuthenticated, userController.showEditUserForm); // Mostrar formulario de edición de usuario
router.post('/edit/:id', ensureAuthenticated, upload.single('profileImage'), userController.updateUser); // Actualizar un usuario
router.post('/delete/:id', ensureAuthenticated, userController.deleteUser); // Eliminar un usuario

module.exports = router;
