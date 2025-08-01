const Users = require('../models/userModel');
const Orders = require('../models/orderModel');

const orderCtrl = {
    createOrder: async (req, res) => {
        try {
            const user = await Users.findById(req.user._id);
            if (!user || user.cart.items.length === 0) {
                return res.status(400).json({ msg: req.__('order.cart_empty') });
            }

            const { country } = req.body;

            const newOrder = new Orders({
                user: req.user._id,
                items: user.cart.items,
                total: user.cart.totalPrice,
                country
            });

            await newOrder.save();

            user.cart.items = [];
            user.cart.totalPrice = 0;
            await user.save();

            res.json({ msg: req.__('order.created_success'), order: newOrder });
        } catch (err) {
            res.status(500).json({ msg: err.message });
        }
    },

    getMyOrders: async (req, res) => {
        try {
            const orders = await Orders.find({ user: req.user._id })
                .populate('items.product')
                .populate('user', 'name email')
                .sort({ createdAt: -1 });
    
            res.json({ orders });
        } catch (err) {
            res.status(500).json({ msg: err.message });
        }
    },

    getOrderById: async (req, res) => {
        try {
            const order = await Orders.findById(req.params.id).populate('user', 'username email');
            if (!order) return res.status(404).json({ msg: req.__('order.not_found') });

            if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(403).json({ msg: req.__('auth.unauthorized') });
            }

            res.json({ order });
        } catch (err) {
            res.status(500).json({ msg: err.message });
        }
    },

    updateOrderStatus: async (req, res) => {
        try {
            const { status } = req.body;
            const order = await Orders.findById(req.params.id);
            if (!order) return res.status(404).json({ msg: req.__('order.not_found') });

            if (req.user.role !== 'admin' && order.user.toString() !== req.user._id.toString()) {
                return res.status(403).json({ msg: req.__('auth.unauthorized') });
            }

            order.status = status;
            await order.save();
            res.json({ msg: req.__('order.status_updated'), order });
        } catch (err) {
            res.status(500).json({ msg: err.message });
        }
    },

    deleteOrder: async (req, res) => {
        try {
            const order = await Orders.findById(req.params.id);
            if (!order) return res.status(404).json({ msg: req.__('order.not_found') });

            if (req.user.role !== 'admin' && order.user.toString() !== req.user._id.toString()) {
                return res.status(403).json({ msg: req.__('auth.unauthorized') });
            }

            await order.remove();
            res.json({ msg: req.__('order.deleted_success') });
        } catch (err) {
            res.status(500).json({ msg: err.message });
        }
    }
};

module.exports = orderCtrl;