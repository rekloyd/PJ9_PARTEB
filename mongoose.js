const mongoose = require("mongoose");

// Conectar con MongoDB
mongoose.connect('mongodb://localhost:27017/Users')
  .then(() => console.log('MongoDB conectado con éxito'))
  .catch(err => console.error('Error al conectar con MongoDB:', err));

// Definir el modelo de Usuario
const User = mongoose.model('User', new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}));

// Definir el modelo de Post
const Post = mongoose.model('Post', new mongoose.Schema({
  postTitle: { type: String, required: true, unique: true }, 
  postContent: { type: String, required: true }
}));

// Exportar la conexión y los modelos
module.exports = { mongoose, User, Post };
