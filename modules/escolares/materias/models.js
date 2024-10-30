// models/user.js
const mongoose = require('mongoose');
const MateriasSchema = new mongoose.Schema({
  name: { type: String, required: true, description:'Clave de materia' },
  description:{type: String, description:'Nombre del Materias' },
  cred: { type: Number, required: true, description:'Creditos' },
  hp: { type: Number, description:'Horas Practica' },
  ht: { type: Date, description:'Horas Teoria' },
});

module.exports = mongoose.model('Materias', MateriasSchema);
