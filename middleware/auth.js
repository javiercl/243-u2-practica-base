// middleware/auth.js

// Middleware para proteger rutas: verificar si el usuario está autenticado
exports.ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next(); // El usuario está autenticado, continuar con la siguiente función
    }
    req.flash('error_msg', 'Por favor, inicia sesión para acceder a esta página.');
    res.redirect('/'); // Redirigir a la página de login si no está autenticado
  };
  
  // Middleware para proteger rutas: verificar si el usuario es administrador
exports.ensureAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === 'admin') {
      return next(); // El usuario es administrador, continuar
    }
    req.flash('error_msg', 'No tienes permiso para acceder a esta página.');
    res.redirect('/'); // Redirigir a una página de error o a la página principal
  };
  