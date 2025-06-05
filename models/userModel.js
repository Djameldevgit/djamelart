const mongoose = require('mongoose')

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
    
    mobile: { type: String, default: '' },
    address: { type: String, default: '' },
    story: {
        type: String, 
        default: '',
        maxlength: 200
    },
    website: { type: String, default: '' },
    followers: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
    following: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
    saved: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
    language: { 
        type: String, 
        enum: ['en', 'fr', 'ar', 'es', 'ru','chino', 'kab'], // Incluye todos los idiomas que usas
        default: 'ar' 
      },
      
    cart: {
        items: [{
            postId: { type: mongoose.Types.ObjectId, ref: 'post' },
            quantity: { type: Number, default: 1, min: 1 },
            price: { type: Number, required: true }
        }],
        totalPrice: { 
            type: Number, 
            default: 0,
            set: function(value) {
                return isNaN(value) ? 0 : parseFloat(value.toFixed(2));
            }
        }
    }
    
    
}, {
    timestamps: true
})

module.exports = mongoose.model('user', userSchema)