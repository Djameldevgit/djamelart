require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const path = require('path')
const i18n = require('i18n') // Solo usamos este i18n en el servidor
const SocketServer = require('./socketServer')

const app = express()

// Middleware base
app.use(express.json())
app.use(cors({ origin: true, credentials: true })) // habilita cookies cross-origin si es necesario
app.use(cookieParser())

// Configurar i18n en el servidor
i18n.configure({
  locales: ['en', 'es', 'fr', 'ar', 'ru', 'kab', 'chino'],
  directory: path.join(__dirname, 'locales'), // asegúrate que exista y tenga archivos .json por idioma
  defaultLocale: 'en',
  cookie: 'lang',
  queryParameter: 'lang',
  objectNotation: true
})

app.use(cookieParser()); // primero las cookies
app.use(i18n.init);  
 

// --- SOCKET.IO ---
const http = require('http').createServer(app)
const io = require('socket.io')(http)

io.on('connection', socket => {
  SocketServer(socket)
})
app.get('/api/set-language', (req, res) => {
  const lang = req.query.lang
  if (lang && i18n.getLocales().includes(lang)) {
    res.cookie('lang', lang, { maxAge: 900000, httpOnly: false }) // puedes ajustar maxAge y opciones
    res.send({ message: `Idioma cambiado a ${lang}` })
  } else {
    res.status(400).send({ error: 'Idioma no válido' })
  }
})

// --- RUTAS DE API ---
app.use('/api', require('./routes/authRouter'))
app.use('/api', require('./routes/userRouter'))
app.use('/api', require('./routes/postRouter'))
app.use('/api', require('./routes/commentRouter'))
app.use('/api', require('./routes/notifyRouter'))
app.use('/api', require('./routes/messageRouter'))
app.use('/api', require('./routes/cartRouter'))
app.use('/api', require('./routes/languageRouter'))

// --- RUTA PARA CAMBIAR EL IDIOMA ---

// --- CONEXIÓN A MONGODB ---
const URI = process.env.MONGODB_URL
mongoose.connect(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, err => {
  if (err) throw err
  console.log('Connected to MongoDB')
})

// --- PRODUCCIÓN: SERVIR CLIENTE ---
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'))
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
  })
}

// --- INICIAR SERVIDOR ---
const port = process.env.PORT || 5000
http.listen(port, () => {
  console.log('Server is running on port', port)
})
