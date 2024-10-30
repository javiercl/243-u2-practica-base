// controllers/userController.js
const User = require('../modules/base/users/models');
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Register User
exports.registerUser = async (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Por favor llena todos los campos' });
  }

  if (password !== password2) {
    errors.push({ msg: 'Las contraseñas no coinciden' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'La contraseña debe tener al menos 6 caracteres' });
  }

  if (errors.length > 0) {
    req.flash('error_msg', errors.map(error => error.msg).join('. '));
    return res.redirect('/');
  } else {
    const user = await User.findOne({ email });
    if (user) {
      errors.push({ msg: 'El correo electrónico ya está registrado' });
      req.flash('error_msg', errors.map(error => error.msg).join('. '));
      return res.redirect('/');
    } else {
      const newUser = new User({ name, email, password });
      const salt = await bcrypt.genSalt(10);
      newUser.password = await bcrypt.hash(password, salt);
      await newUser.save();
      req.flash('success_msg', 'Estás registrado y ahora puedes iniciar sesión');
      res.redirect('/');
    }
  }
};

// Login User
exports.loginUser = (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/',
    failureFlash: true
  })(req, res, next);
};

// Logout User
exports.logoutUser = (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Error al cerrar sesión:', err);
      req.flash('error_msg', 'Hubo un problema al cerrar sesión. Intenta de nuevo.');
      return res.redirect('/'); // Redirige a la página deseada si hay un error
    }
    req.flash('success_msg', 'Has cerrado sesión correctamente');
    res.redirect('/'); // Cambia esta ruta a la página a la que quieras redirigir después del logout
  });
};
