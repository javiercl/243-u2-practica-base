// controllers/userController.js
const sharp = require('sharp');
const User = require('../models/user'); // Importar el modelo de usuario

// Mostrar la lista de usuarios
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find(); // Obtener todos los usuarios de la base de datos
    res.render('users', { users, user: req.user }); // Renderiza la vista de usuarios
  } catch (err) {
    console.error('Error al obtener la lista de usuarios:', err);
    req.flash('error_msg', 'Error al cargar la lista de usuarios.');
    res.redirect('/');
  }
};

// Mostrar el formulario para crear un nuevo usuario
exports.showCreateUserForm = (req, res) => {
  res.render('users/new', { user: req.user }); // Renderiza el formulario de creación de usuario
};

// Crear un nuevo usuario
exports.createUser = async (req, res) => {
  const { name, email, role, password } = req.body;
  let profileImage = '/images/user-default.png';
  if (req.file) {
    profileImage = req.file.filename; // Guardar el nombre del archivo subido
  }
  try {
    const newUser = new User({ name, email, role, password, profileImage }); // Crear un nuevo usuario
    await newUser.save(); // Guardar el usuario en la base de datos
    req.flash('success_msg', 'Usuario creado correctamente.');
    res.redirect('/users'); // Redirigir a la lista de usuarios
  } catch (err) {
    console.error('Error al crear usuario:', err);
    req.flash('error_msg', 'Error al crear el usuario.');
    res.redirect('/users/new');
  }
};

// Mostrar el formulario de edición de un usuario
exports.showEditUserForm = async (req, res) => {
  try {
    const user = await User.findById(req.params.id); // Buscar el usuario por ID
    if (!user) {
      req.flash('error_msg', 'Usuario no encontrado.');
      return res.redirect('/users');
    }
    res.render('users/edit', { user, user: req.user }); // Renderiza el formulario de edición
  } catch (err) {
    console.error('Error al cargar el usuario para editar:', err);
    req.flash('error_msg', 'Error al cargar el usuario.');
    res.redirect('/users');
  }
};

// Actualizar un usuario existente
exports.updateUser = async (req, res) => {
  const { name, email, role } = req.body;
  let profileImage;

  if (req.file) {
    profileImage = req.file.filename; // Guardar la nueva imagen si se carga
  }
  try {
    await User.findByIdAndUpdate(req.params.id, { name, email, role, profileImage }); // Actualizar el usuario
    req.flash('success_msg', 'Usuario actualizado correctamente.');
    res.redirect('/users');
  } catch (err) {
    console.error('Error al actualizar usuario:', err);
    req.flash('error_msg', 'Error al actualizar el usuario.');
    res.redirect(`/users/edit/${req.params.id}`);
  }
};

// Eliminar un usuario
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id); // Eliminar el usuario por ID
    req.flash('success_msg', 'Usuario eliminado correctamente.');
    res.redirect('/users');
  } catch (err) {
    console.error('Error al eliminar usuario:', err);
    req.flash('error_msg', 'Error al eliminar el usuario.');
    res.redirect('/users');
  }
};
