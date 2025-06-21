 
const Users = require('../models/userModel');
const Orders = require('../models/orderModel');
 
 

const orderCtrl = {
   


 // ✅ Crear pedido (usando carrito del usuario)
 createOrder: async (req, res) => {
    try {
      const user = await Users.findById(req.user._id);
      if (!user || user.cart.items.length === 0) {
        return res.status(400).json({ msg: "Tu carrito está vacío" });
      }

      const { country } = req.body;

      const newOrder = new Orders({
        user: req.user._id,
        items: user.cart.items,
        total: user.cart.totalPrice,
        country
      });

      await newOrder.save();

      // Limpiar el carrito después de comprar
      user.cart.items = [];
      user.cart.totalPrice = 0;
      await user.save();

      res.json({ msg: "✅ Pedido creado con éxito", order: newOrder });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  // ✅ Ver mis pedidos
  getMyOrders: async (req, res) => {
    try {
      const orders = await Orders.find({ user: req.user._id })
        .populate('items.product') // ✅ popular productos individuales del array items
        .populate('user', 'name email')
        .sort({ createdAt: -1 });
  
      res.json({ orders });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
  
  

  // ✅ Ver pedido por ID
  getOrderById: async (req, res) => {
    try {
      const order = await Orders.findById(req.params.id).populate('user', 'username email');
      if (!order) return res.status(404).json({ msg: "Pedido no encontrado" });

      if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ msg: "No autorizado" });
      }

      res.json({ order });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  // ✅ Cambiar estado (admin o dueño del pedido)
  updateOrderStatus: async (req, res) => {
    try {
      const { status } = req.body;
      const order = await Orders.findById(req.params.id);
      if (!order) return res.status(404).json({ msg: "Pedido no encontrado" });

      if (req.user.role !== 'admin' && order.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ msg: "No autorizado" });
      }

      order.status = status;
      await order.save();
      res.json({ msg: "Estado del pedido actualizado", order });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  // ✅ Eliminar pedido (admin o dueño del pedido)
  deleteOrder: async (req, res) => {
    try {
      const order = await Orders.findById(req.params.id);
      if (!order) return res.status(404).json({ msg: "Pedido no encontrado" });

      if (req.user.role !== 'admin' && order.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ msg: "No autorizado" });
      }

      await order.remove();
      res.json({ msg: "Pedido eliminado con éxito" });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },




};

module.exports = orderCtrl;
