const mongoose = require('mongoose');

const UserBlockSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    unique: true
  },
  motivo: {
    type: String,
    default: "Sin especificar"
  },
  content: {
    type: String,
    default: "Sin especificar"
  },
  fechaLimite: {
    type: Date,
    default: null
  },
 
   

  esBloqueado: {
    type: Boolean,
    default: true
  },
  userquibloquea: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  }
}, {
  timestamps: true // createdAt = fecha del bloqueo
});

module.exports = mongoose.model('blockuser', UserBlockSchema);

 
