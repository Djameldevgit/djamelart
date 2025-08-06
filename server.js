require('dotenv').config();
require('./cronJobs/DeleteUsersNoVerified');
const { autoUnblockUsers } = require('./controllers/autoUnBlockUser');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const i18n = require('i18n');
const SocketServer = require('./socketServer');
const morgan = require('morgan');

// --- Express App ---
const app = express();

// --- Middleware Express ---
app.use(express.json());

// ✅ CORS para Express
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(cookieParser());
app.use(morgan('dev'));

// --- Configuración de idiomas ---
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

// --- Rutas de API ---
app.get('/api/set-language', (req, res) => {
  const lang = req.query.lang;
  if (lang && i18n.getLocales().includes(lang)) {
    res.cookie('lang', lang, { maxAge: 900000, httpOnly: false });
    res.send({ message: `Idioma cambiado a ${lang}` });
  } else {
    res.status(400).send({ error: 'Idioma no válido' });
  }
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
 
// --- Auto desbloqueo de usuarios cada 5 min ---
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

// --- Servidor HTTP y Socket.IO ---
const http = require('http').createServer(app);

// ✅ CORS para Socket.IO
const { Server } = require('socket.io');
const io = new Server(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'DELETE'],
    credentials: true
  }
});

// ✅ Manejo de eventos con tu archivo personalizado
io.on('connection', socket => {
  SocketServer(socket, io); // <-- Pasa socket e io si tu lógica lo requiere
});

// --- Producción: servir frontend ---
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  });
}

// --- Iniciar servidor ---
const PORT = process.env.PORT || 5000;
http.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
