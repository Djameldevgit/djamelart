const router = require('express').Router()
const auth = require("../middleware/auth")
 const orderCtrl = require('../controllers/orderCtrl');


 


// Crear pedido desde el carrito
router.post('/order', auth, orderCtrl.createOrder);

// Ver mis pedidos
router.get('/orders', auth, orderCtrl.getMyOrders);

// Ver pedido individual
router.get('/order/:id', auth, orderCtrl.getOrderById);

// Cambiar estado del pedido
router.patch('/order/status/:id', auth, orderCtrl.updateOrderStatus);

// Eliminar pedido
router.delete('/order/:id', auth, orderCtrl.deleteOrder);

module.exports = router