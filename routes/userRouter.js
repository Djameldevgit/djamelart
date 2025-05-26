const router = require('express').Router()
const auth = require("../middleware/auth")
const carritoCtrl = require("../controllers/carritoCtrl")

router.post('/cart/add/:id', auth, carritoCtrl.addToCart)
router.delete('/remove/:id', auth, carritoCtrl.removeFromCart)
router.get('/', auth, carritoCtrl.getCart)
router.put('/update/:id', auth, carritoCtrl.updateCartItemQuantity)

module.exports = router