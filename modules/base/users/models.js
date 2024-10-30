const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  date: { type: Date, default: Date.now },
  role: { type: String, default: 'user' },
  profileImage: {
    type: String, // Almacena la ruta de la imagen
    default: 'https://via.placeholder.com/100', // Puedes tener una imagen predeterminada
  },
});

module.exports = mongoose.model('User', UserSchema); 