// controllers/userController.js
const sharp = require('sharp');
const { getPaginatedResults } = require('./mainController');
// Importar el const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const path = require('path');

exports.getItems = async(req, res, modelo, view, fields=[]) => {
  // Usar la función reutilizable para obtener la lista de usuarios
    const Model = require(`../modules/${module}/${module}_models`); // Importar el modelo

    let searchQuery = req.query.search || ''; // Obtener la consulta de búsqueda
    let page = parseInt(req.query.page) || 1; // Obtener el número de página
    let limit = parseInt(req.query.limit) || 5; // Número de registros por página
    let skip = (page - 1) * limit; // Calcular cuántos registros saltar
  
    // Asegurarse de que los valores de página y límite sean válidos
    if (page < 1) page = 1;
    if (limit < 1) limit = 5;
  
    let results, totalResults;
  
    try {
      // Construir el filtro de búsqueda en base a los campos indicados
      const searchRegex = searchQuery 
        ? { $or: searchFields.map(field => ({ [field]: { $regex: searchQuery, $options: 'i' } })) } 
        : {};
  
      // Obtener los resultados con paginación y búsqueda
      results = await Model.find(searchRegex)
        .skip(skip)
        .limit(limit);
  
      // Contar el total de resultados
      totalResults = await Model.countDocuments(searchRegex);
  
      // Calcular total de páginas
      let totalPages = Math.ceil(totalResults / limit);
  
      // Asegurarse de que la página no exceda el número total de páginas
      if (page > totalPages) page = totalPages;
  
      // Renderizar la vista, pasando los resultados, búsqueda y paginación
      res.render(view, {
        results,
        user: req.user,  // Usuario autenticado
        searchQuery,
        currentPage: page,
        totalPages,
        limit
      });
      
    } catch (err) {
      console.error('Error al obtener los resultados:', err);
      req.flash('error_msg', 'Error al cargar los resultados.');
      res.redirect('/');
    }
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
    res.render('users/users_edit', { user, user: req.user }); // Renderiza el formulario de edición
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

exports.exportUsersToCSV = async (req, res) => {
  try {
    const users = await User.find({}, 'name email role');
    
    const csvWriter = createCsvWriter({
      path: path.join(__dirname, '..', 'public', 'exports', 'users.csv'),
      header: [
        {id: 'name', title: 'Name'},
        {id: 'email', title: 'Email'},
        {id: 'role', title: 'Role'}
      ]
    });
    
    await csvWriter.writeRecords(users);
    
    res.download(path.join(__dirname, '..', 'public', 'exports', 'users.csv'));
  } catch (err) {
    console.error('Error exporting users to CSV:', err);
    req.flash('error_msg', 'Error exporting users to CSV.');
    res.redirect('/users');
  }
};
