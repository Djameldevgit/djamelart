const mongoose = require('mongoose');

const UserBlockSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    unique: true // Un usuario solo puede tener un bloqueo activo
  },
  motivo: {
    type: String,
    default: "Sin especificar"
  },
  content: {
    type: String,
    default: "Sin especificar"
  },
  userquibloquea: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  }
}, {
  timestamps: true // `createdAt` sirve como fecha de bloqueo
});

module.exports = mongoose.model('blockuser', UserBlockSchema);

 
