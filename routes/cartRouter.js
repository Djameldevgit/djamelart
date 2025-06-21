const router = require('express').Router()
const auth = require("../middleware/auth")
const carritoCtrl = require("../controllers/carritoCtrl")


// Idealmente
router.put('/cart/add/:id', auth, carritoCtrl.addToCart);

router.delete('/cart/remove/:id', auth, carritoCtrl.removeFromCart);
router.get('/cart', auth, carritoCtrl.getCart);
router.put('/update/:id', auth, carritoCtrl.updateCartItemQuantity);

 

module.exports = router