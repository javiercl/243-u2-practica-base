// models/user.js
const mongoose = require('mongoose');
const ProfesorSchema = new mongoose.Schema({
  nip: { type: String, required: true, description:'NUmero de Identificación' },
  name: { type: String, required: true, description:'Nombre del profesor' },
  email: { type: String, required: true, unique: true, description:'Correo electrónico' },
  curp: { type: String, description:'CURP' },
  ingres_date: { type: Date, description:'Fecha de Ingreso' },
  grade: { type: String, enum: ['licenciatura', 'maestria', 'doctorado'], description:'Grado de Estudios' },
  profileImage: {
    type: String, // Almacena la ruta de la imagen
    default: 'https://via.placeholder.com/100', // Puedes tener una imagen predeterminada
    description:'Imagen de perfil'
  },
});

module.exports = mongoose.model('Profesor', ProfesorSchema);
