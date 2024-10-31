// index.js
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('passport');
const path = require('path');
const fs = require('fs');
const globals = require('./middleware/globals');


const app = express();

// Passport configuration
require('./config/passport')(passport);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))  // Mensaje si la conexión es exitosa
  .catch(err => console.log('Error al conectar con MongoDB:', err)); // Manejo de errores de conexión


// EJS setup
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 
// Bodyparser
app.use(express.urlencoded({ extended: false }));

// Express session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.showLoading = true;
  next();
});

// Middleware para manejar la renderización de vistas modulares
app.use((req, res, next) => {
  res.renderModuleView = function(moduleName, view, options) {
    const viewPath = path.join(__dirname, 'modules',moduleName,'views',view);
    options.bodyContent = viewPath;
    options.loadingPath = req.loadingPath;
    options.navbarPath = req.navbarPath;
    return res.render(req.layout_view, options);
  };
  next();
});

// Función para cargar rutas de módulos dinámicamente
modules = [];
function loadModuleRoutes(app) {
  const modulesPath = path.join(__dirname, 'modules');
  const modules = fs.readdirSync(modulesPath).filter(file => 
    fs.statSync(path.join(modulesPath, file)).isDirectory()
  );

  app.use(globals({ modules }));

  modules.forEach(moduleName => {
    const routePath = path.join(modulesPath, moduleName, 'routes.js');
    if (fs.existsSync(routePath)) {
      const route = require(routePath);
      //app.use(`/${moduleName}`, require(routePath));
      route(app, moduleName);
      console.log(`Rutas cargadas para el módulo: ${moduleName}`);
    }
  });
  return modules;
}

// Cargar rutas de módulos
modules = loadModuleRoutes(app);

const indexRoutes = require('./routes/indexRoutes')(modules);
app.use('/', indexRoutes);

const authRoutes = require('./routes/authRoutes')(modules);
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
