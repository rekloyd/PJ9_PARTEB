const express = require('express');
const fs = require('fs');
const https = require('https');
const path = require('path');
const cookieParser = require('cookie-parser');
const { User } = require('./mongoose'); 

let posts = [
  { id: "1", title: "hola", content: "hola" },
  { id: "2", title: "hola2", content: "hola2" }
];

const app = express();
const PORT = 443;

const options = {
  key: fs.readFileSync('certs/key.pem'),
  cert: fs.readFileSync('certs/cert.pem')
};

// Configurar carpeta de archivos estáticos (CSS, imágenes, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Configuración de motor de plantillas
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Crear usuarios por defecto
async function createDefaultAdmin() {
  try {
    const existingUser = await User.findOne({ username: "admin" });
    if (!existingUser) {
      const newUser = new User({ username: "admin", password: "1234" });
      await newUser.save();
      console.log('Usuario por defecto "admin" creado con éxito');
    } else {
      console.log('El usuario "admin" ya existe');
    }
  } catch (error) {
    console.error("Error al crear el usuario por defecto:", error);
  }
}

async function createDefaultUser() {
  try {
    const existingUser = await User.findOne({ username: "user" });
    if (!existingUser) {
      const newUser = new User({ username: "user", password: "1234" });
      await newUser.save();
      console.log('Usuario por defecto "user" creado con éxito');
    } else {
      console.log('El usuario "user" ya existe');
    }
  } catch (error) {
    console.error("Error al crear el usuario por defecto:", error);
  }
}

createDefaultUser();
createDefaultAdmin();

// Middleware autenticación
function checkAuthentication(req, res, next) {
  if (req.cookies && req.cookies.session_id) {
    req.username = req.cookies.session_id;
  } else {
    req.username = null;
  }
  next();
}
app.use(checkAuthentication);

// Rutas principales con vistas pug
app.get('/', (req, res) => {
  if (req.username) {
    return res.redirect('/');
  }
  return res.render('index');
});

const paginasEstaticas = [
  'inicio',
  'quizz',
  'contacto',
  'graficas',
  'about',
  'cookies',
  'terminos',
  'admin'
];

paginasEstaticas.forEach((pagina) => {
  app.get(`/${pagina}`, (req, res) => {
    if ((pagina === 'admin' || pagina === 'blogAdmin') && req.username?.toLowerCase() !== 'admin') {
      return res.status(403).send(`
        <script>
          alert("Acceso denegado: No tienes permisos de administrador");
          window.location.href = "/";
        </script>
      `);
    }
    return res.render(pagina);
  });
});

// Autenticación
app.post('/auth/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.send(`
        <script>
          alert("Usuario no encontrado");
          window.location.href = "/";
        </script>
      `);
    }
    if (user.password !== password) {
      return res.send(`
        <script>
          alert("Datos incorrectos");
          window.location.href = "/";
        </script>
      `);
    }
    res.cookie('session_id', user.username, { httpOnly: true, path: '/' });
    res.redirect('/inicio');
  } catch (err) {
    res.status(500).send("Error en el servidor");
  }
});

app.get('/auth/logout', (req, res) => {
  res.clearCookie('session_id', { path: '/' });
  res.redirect('/');
});

// Middleware admin
function requireAdmin(req, res, next) {
  if (!req.username || req.username.toLowerCase() !== 'admin') {
    return res.status(403).json({ message: "Acceso no autorizado" });
  }
  next();
}

// API usuarios
app.get('/api/users', requireAdmin, async (req, res) => {
  try {
    const users = await User.find({}, 'username password _id');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
});

app.post('/api/users', requireAdmin, async (req, res) => {
  try {
    const userData = req.body;
    const existingUser = await User.findOne({ username: userData.username });
    if (existingUser) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }
    const newUser = new User(userData);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: "Datos inválidos" });
  }
});

app.delete('/api/users/:id', requireAdmin, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json({ message: "Usuario eliminado" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar usuario" });
  }
});

app.put('/api/users/:id', requireAdmin, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: "Datos inválidos" });
  }
});

// API posts
app.get('/api/posts', (req, res) => {
  res.json(posts);
});

app.post('/api/posts', (req, res) => {
  const newPost = req.body;
  posts.push(newPost);
  res.status(201).json({ message: "Post creado con éxito", post: newPost });
});

app.get('/api/posts/:id', (req, res) => {
  const post = posts.find(p => p.id === req.params.id);
  if (post) {
    res.json(post);
  } else {
    res.status(404).json({ message: "Post no encontrado" });
  }
});

app.delete('/api/posts/:id', (req, res) => {
  const postIndex = posts.findIndex(p => p.id === req.params.id);
  if (postIndex !== -1) {
    posts.splice(postIndex, 1);
    res.json({ message: "Post eliminado con éxito" });
  } else {
    res.status(404).json({ message: "Post no encontrado" });
  }
});

app.put('/api/posts/:id', (req, res) => {
  const postIndex = posts.findIndex(p => p.id === req.params.id);
  if (postIndex !== -1) {
    posts[postIndex] = { ...posts[postIndex], ...req.body };
    res.json({ message: "Post actualizado con éxito", post: posts[postIndex] });
  } else {
    res.status(404).json({ message: "Post no encontrado" });
  }
});

// Iniciar servidor HTTPS
https.createServer(options, app).listen(PORT, () => {
  console.log(`Servidor HTTPS corriendo en https://localhost:${PORT}`);
});
