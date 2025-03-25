const express = require('express');
const fs = require('fs');
const https = require('https');
const path = require('path');
const { mongoose, User, Post } = require('./mongoose.js');

//openssl req -nodes -new -x509 -keyout certs/key.pem -out certs/cert.pem

const app = express();
const PORT = 443;

// Cargar certificados SSL
const options = {
  key: fs.readFileSync('certs/key.pem'),
  cert: fs.readFileSync('certs/cert.pem')
};

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

app.get('/graficas',(req,res)=>{
  
})

// Crear servidor HTTPS
https.createServer(options, app).listen(PORT, () => {
  console.log(`Servidor HTTPS corriendo en https://localhost:${PORT}`);
});
