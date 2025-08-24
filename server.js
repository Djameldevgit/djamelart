require('dotenv').config();
require('./cronJobs/DeleteUsersNoVerified');
const { autoUnblockUsers } = require('./controllers/autoUnBlockUser');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const i18n = require('i18n');
const { Server } = require('socket.io');
const SocketServer = require('./socketServer');
const morgan = require('morgan');

const app = express();

// --- Lista de dominios permitidos ---
const allowedOrigins = [
  'https://djamelartadmin.onrender.com',
  'https://djamelart.onrender.com',
  'http://localhost:3000',
  'http://localhost:3001'
];

// --- Configuración CORS para Express ---
const corsOptions = {
  origin: function (origin, callback) {
    // Permitir solicitudes sin origen (como herramientas de API o solicitudes de servidor)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

// --- Middleware ---
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// --- Idiomas ---
i18n.configure({
  locales: ['en', 'es', 'fr', 'ar', 'ru', 'kab', 'chino'],
  directory: path.join(__dirname, 'locales'),
  defaultLocale: 'en',
  cookie: 'lang',
  queryParameter: 'lang',
  objectNotation: true,
  updateFiles: false
});
app.use(i18n.init);

// --- Rutas ---
app.get('/api/set-language', (req, res) => {
  const lang = req.query.lang;
  if (lang && i18n.getLocales().includes(lang)) {
    res.cookie('lang', lang, { maxAge: 900000, httpOnly: false });
    return res.send({ message: `Idioma cambiado a ${lang}` });
  }
  res.status(400).send({ error: 'Idioma no válido' });
});

app.use('/api', require('./routes/authRouter'));
app.use('/api', require('./routes/userRouter'));
app.use('/api', require('./routes/postRouter'));
app.use('/api', require('./routes/commentRouter'));
app.use('/api', require('./routes/notifyRouter'));
app.use('/api', require('./routes/messageRouter'));
app.use('/api', require('./routes/cartRouter'));
app.use('/api', require('./routes/languageRouter'));
app.use('/api', require('./routes/rolesRouter'));
app.use('/api', require('./routes/orderRouter'));
app.use('/api', require('./routes/userActionRouter'));
app.use('/api', require('./routes/blockUserRouter'));
app.use('/api', require('./routes/reportRouter'));
app.use('/api/blog/comments', require('./routes/blogCommentRoutes'));
app.use("/api/forms", require("./routes/formRouter"));

// --- Tareas automáticas ---
setInterval(autoUnblockUsers, 5 * 60 * 1000);

// --- Conexión a MongoDB ---
const URI = process.env.MONGODB_URL;
mongoose.connect(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, err => {
  if (err) throw err;
  console.log('✅ Conectado a MongoDB');
});

// --- Servidor HTTP ---
const server = require('http').createServer(app);

// --- Configuración CORS para Socket.IO ---
const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true
  }
});

io.on('connection', socket => SocketServer(socket, io));

// --- Manejo de errores CORS ---
app.use((err, req, res, next) => {
  if (err.message === 'No permitido por CORS') {
    return res.status(403).json({ 
      error: 'CORS policy violation',
      message: 'Dominio no permitido',
      allowedOrigins: allowedOrigins
    });
  }
  next(err);
});

// --- Producción ---
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  });
}

// --- Iniciar servidor ---
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`🌐 Dominios permitidos: ${allowedOrigins.join(', ')}`);
});

// --- Opcional: También puedes cargar dominios desde variables de entorno ---
// const CLIENT_URLS = process.env.CLIENT_URLS || '';
// const allowedOrigins = CLIENT_URLS.split(',').map(url => url.trim()).filter(url => url);
// if (allowedOrigins.length === 0) {
//   allowedOrigins.push('http://localhost:3000');
// }