// Función reutilizable para obtener resultados paginados y filtrados
exports.getItemsPaginated = async(req, res, moduleName, view, Model, title) => {

    const searchFields = Object.keys(Model.schema.paths).filter(path => {
      const schemaType = Model.schema.paths[path];
      return (
        schemaType.instance === 'String' ||
        (schemaType.instance === 'Array' && schemaType.caster.instance === 'String')
      ) && !path.startsWith('_');
    });

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
        ? { $or: 
              searchFields.map(field => ({ 
                [field]: { $regex: searchQuery, $options: 'i' } }))
          } 
        : {};
          console.log(`searchRegex ${searchRegex}`);
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
  
      console.log(`Modulos xx: ${modules}`);
      // Renderizar la vista, pasando los resultados, búsqueda y paginación
      res.renderModuleView(moduleName, view, {
        results,
        user: req.user,  // Usuario autenticado
        searchQuery,
        currentPage: page,
        totalPages,
        limit,
        title: `${Model.modelName}`,
        moduleName: moduleName,
        modules:req.modules
      });
      
    } catch (err) {
      console.error('Error al obtener los resultados:', err);
      req.flash('error_msg', 'Error al cargar los resultados.');
      res.redirect('/');
    }
};

exports.showCreateItemForm = async (req, res, moduleName, view, Model, typeform) => {
  try { 
    res.renderModuleView(moduleName, view, { 
      user: req.user, 
      modules:req.modules, 
      moduleName:moduleName,
      title: `${Model.modelName}`,
      model: Model,
      typeform: typeform
    });
    // Renderiza el formulario de edición
  } catch (err) {
    console.error(`Error al crear el ${Model.modelName} para crear:`, err);
    req.flash('error_msg', `Error al crear el ${Model.modelName}.`);
    res.redirect(`/${moduleName}/list`);
  }
};


exports.createItem = async (req, res, moduleName, Model) => {
    try {

      const fields = Object.keys(Model.schema.paths).filter(path => !path.startsWith('_'));

      let data = {};
      fields.forEach(field => {
        if (req.body[field] !== undefined) {
          data[field] = req.body[field];
        }
      });

      if (req.file) {
        data.profileImage = req.file.filename; // Guardar la nueva imagen si se carga
      }

      const newItem = new Model(data); // Crear un nuevo usuario
      await newItem.save(); // Guardar el usuario en la base de datos
      req.flash('success_msg', `${Model.modelName} creado correctamente.`);
      res.redirect(`/${moduleName}/list`); // edirigir a la lista de items
    } catch (err) {
      console.error(`Error al crear ${Model.modelName}:`, err);
      req.flash('error_msg', `Error al crear el ${Model.modelName}.`);
      res.redirect(`/${moduleName}/form/new`);
    }
};

exports.updateItem = async (req, res, moduleName, Model) => {
    const fields = Object.keys(Model.schema.paths).filter(path => !path.startsWith('_'));

    let data = {};
    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        data[field] = req.body[field];
      }
    });
  
    if (req.file) {
      data.profileImage = req.file.filename; // Guardar la nueva imagen si se carga
    }

    try {
      await Model.findByIdAndUpdate(req.params.id, data); // Actualizar el usuario
      req.flash('success_msg', `${Model.modelName} actualizado correctamente.`);
      res.redirect(`/${moduleName}/list`);
    } catch (err) {
      console.error(`Error al actualizar ${Model.modelName}:`, err);
      req.flash('error_msg', `Error al actualizar el ${Model.modelName}.`);
      res.redirect(`/${moduleName}/form/edit/${req.params.id}`);
    }
};

// Eliminar un usuario
exports.deleteItem = async (req, res, moduleName, Model) => {
    try {
      await Model.findByIdAndDelete(req.params.id); // Eliminar el usuario por ID
      req.flash('success_msg', `${Model.modelName} eliminado correctamente.`);
      res.redirect(`/${moduleName}/list`);
    } catch (err) {
      console.error(`Error al eliminar ${Model.modelName}:`, err);
      req.flash('error_msg', `Error al eliminar el ${Model.modelName}.`);
      res.redirect(`/${moduleName}/list`);
    }
};

exports.showEditUserForm = async (req, res, moduleName, view, Model, typeform) => {
  try { 
    const item = await Model.findById(req.params.id); // Buscar el usuario por ID
    if (!item) {
      req.flash('error_msg', `${Model.modelName} no encontrado.`);
      return res.redirect(`/${moduleName}/list`);
    }
    //console.info(`pasa ${item}`);

    res.renderModuleView(moduleName, view,{
      title: `${Model.modelName}`,
      moduleName,
      item,
      user: req.user,  // Usuario autenticado
      modules: req.modules,
      typeform: typeform
    });
    // Renderiza el formulario de edición
  } catch (err) {
    console.error(`Error al cargar el ${Model.modelName} para editar:`, err);
    req.flash('error_msg', `Error al cargar el ${Model.modelName}.`);
    res.redirect(`/${moduleName}/list`);
  }
};