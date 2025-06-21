const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'user',
    required: true
  },
  items: [
    {
      product: {
        type: mongoose.Types.ObjectId,
        ref: 'post'
      },
      quantity: {
        type: Number,
        default: 1
      },
      price: {
        type: Number
      },
      title: String,
      images: Array
    }
  ],
  total: {
    type: Number,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pendiente', 'pagado', 'enviado'],
    default: 'pendiente'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('order', orderSchema);
