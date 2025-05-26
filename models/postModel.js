const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true
  }, 
  
  devisvente: {
    type: String,
  },
  derechoautor: {
    type: String,
  },
  suporte: {
    type: String,
  },

  disponibilidad: {
    type: String,
  },
 title: {
    type: String,
  },
  envolverobra: {
    type: String,

  },
  subcategory: {
    type: String,

  },

  measurementValue: {
    type: String,

  },
  venteOption: {
    type: String,

  },
 
  price: {
    type: String,

  },
  
  negociable: {
    type: String,

  },


  subCategorySculpture: {
    type: String,

  },
  artStyle: {
    type: String,

  },
  talle: {
    type: String,

  },
  theme: {
    type: String,

  },
  measurementUnit: {
    type: String,

  },
  description: {
    type: String,

  },

 wilaya: {
    type: String,

  },
  commune: {
    type: String,

  },

  estado: {
    type: String,
    enum: ['pendiente', 'aprobado', 'rechazado'],
    default: 'pendiente',
  },

  images: {
    type: Array,
    required: true
  },
  likes: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
  comments: [{ type: mongoose.Types.ObjectId, ref: 'comment' }],
  user: { type: mongoose.Types.ObjectId, ref: 'user' }
}, {
  timestamps: true
})

module.exports = mongoose.model('post', postSchema)