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
  support: {
    type: String,
  },

  disponibilidad: {
    type: String,
  },
  title: {
    type: String,
    required: true, // 👈 Ahora es obligatorio
    trim: true,
    maxlength: 100,
    validate: {
      validator: function(v) {
        return /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s\-\.,!?()]+$/.test(v); // 👈 Caracteres permitidos
      },
      message: 'El título contiene caracteres no permitidos.'
    }
  },
  envolverobra: {
    type: String,

  },
  subcategory: {
    type: String,

  },

  measurementValue: {
    type: String,
    trim: true,
    maxlength: 20,
  /*  validate: {
      validator: function(v) {
        return /^[0-9.,]+$/.test(v); // 👈 Solo números y decimales
      },
      message: 'El valor de medida solo puede contener números y decimales.'
    }*/
  },
  venteOption: {
    type: String,

  },
 
  price: {
    type: String,
    trim: true,
    maxlength: 20,
  /*  validate: {
      validator: function(v) {
        return /^[0-9.,]+$/.test(v); // 👈 Solo números y decimales
      },
      message: 'El precio solo puede contener números y decimales.'
    }*/
  },
  
  negociable: {
    type: String,

  },


  subCategorySculpture: {
    type: String,

  },
  style: {
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
    trim: true,
    maxlength: 1000, // 👈 Límite de caracteres
    validate: {
      validator: function(v) {
        return /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s\-\.,!?()@#\$%&*+='":;]+$/.test(v); // 👈 Caracteres permitidos
      },
      message: 'La descripción contiene caracteres no permitidos.'
    }
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
  views: { type: Number, default: 0 },
  likes: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
  comments: [{ type: mongoose.Types.ObjectId, ref: 'comment' }],
 

  user: { type: mongoose.Types.ObjectId, ref: 'user' }
}, {
  timestamps: true
})

module.exports = mongoose.model('post', postSchema)