const mongoose = require('mongoose');
const Posts = require('./postModel'); // Asegúrate que la ruta es correcta

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    maxlength: 25,
    unique: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: 'https://res.cloudinary.com/devatchannel/image/upload/v1602752402/avatar/avatar_cugq40.png'
  },
  role: {
    type: String,
    enum: ['Utilisateur-No-authentifié', 'user', 'superuser', 'moderador', 'admin'],
    default: 'user'
  },
  mobile: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    default: ''
  },
  story: {
    type: String,
    default: '',
    maxlength: 200
  },
  website: {
    type: String,
    default: ''
  },
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }],
  saved: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'post' // Cambiado a 'post' si guardas posts, o mantener 'user' si son usuarios
  }],
  language: {
    type: String,
    enum: ['en', 'fr', 'ar', 'es', 'ru', 'chino', 'kab'],
    default: 'ar'
  },
  isVerified: {
    type: Boolean,
    default: false
  },

  isActive: {
    type: Boolean,
    default: true
  },
  post: [{ type: mongoose.Types.ObjectId, ref: 'post' }],
  loginType: { type: String, enum: ['local', 'google', 'facebook'], default: 'local' },

  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: null },
  post: [{ type: mongoose.Types.ObjectId, ref: 'post' }],
  report: [{ type: mongoose.Types.ObjectId, ref: 'report' }],
  totalReportGiven: { type: Number, default: 0 },
  likesGiven: { type: Number, default: 0 },
  likesReceived: { type: Number, default: 0 },
  commentsMade: { type: Number, default: 0 },
  commentsReceived: { type: Number, default: 0 },

  esBloqueado: { type: Boolean, default: false },




  cart: {
    items: [{
      postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post',
        required: true
      },
      quantity: {
        type: Number,
        default: 1,
        min: 1
      },
      price: {
        type: Number,
        required: true
      },
      title: String,
      images: Array
    }],
    totalPrice: {
      type: Number,
      default: 0,
      set: function (value) {
        return isNaN(value) ? 0 : parseFloat(value.toFixed(2));
      }
    },

  }
}, {
  timestamps: true // Correctamente definido
});

// Middleware pre-remove mejorado
userSchema.pre('remove', async function (next) {
  try {
    const userId = this._id;

    // Actualizar posts que este usuario haya liked
    await Posts.updateMany(
      { likes: userId },
      { $pull: { likes: userId } }
    ).exec();

    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('user', userSchema);