const Posts = require('../models/postModel');
const Users = require('../models/userModel');

// Función utilitaria para calcular el total del carrito
const calculateTotal = (items) => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

const carritoCtrl = {
    addToCart: async (req, res) => {
        try {
            const post = await Posts.findById(req.params.id);
            if (!post || !post.price) {
                return res.status(404).json({ msg: req.__('cart.post_not_found_or_no_price') });
            }

            const user = await Users.findById(req.user._id);
            if (!user) {
                return res.status(404).json({ msg: req.__('user_not_found') });
            }

            const postIndex = user.cart.items.findIndex(item =>
                item.postId.toString() === req.params.id
            );

            if (postIndex >= 0) {
                user.cart.items[postIndex].quantity += 1;
            } else {
                user.cart.items.push({
                    postId: post._id,
                    quantity: 1,
                    price: post.price
                });
            }

            user.cart.totalPrice = calculateTotal(user.cart.items);
            await user.save();

            res.json({
                msg: req.__('cart.item_added_to_cart'),
                cart: user.cart
            });

        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    removeFromCart: async (req, res) => {
        try {
            const user = await Users.findById(req.user._id);
            if (!user) return res.status(404).json({ msg: req.__('user_not_found') });

            const item = user.cart.items.find(item =>
                item.postId.toString() === req.params.id
            );

            if (!item) return res.status(404).json({ msg: req.__('cart.product_not_found_in_cart') });

            user.cart.items = user.cart.items.filter(item =>
                item.postId.toString() !== req.params.id
            );

            user.cart.totalPrice = calculateTotal(user.cart.items);
            await user.save();

            res.json({ msg: req.__('cart.product_removed'), cart: user.cart });

        } catch (err) {
            res.status(500).json({ msg: req.__('cart.server_error') });
        }
    },

    getCart: async (req, res) => {
        try {
            const user = await Users.findById(req.user._id).populate('cart.items.postId');
            if (!user) return res.status(404).json({ msg: req.__('user_not_found') });

            // Elimina productos eliminados de la BD
            user.cart.items = user.cart.items.filter(item => item.postId);
            user.cart.totalPrice = calculateTotal(user.cart.items);
            await user.save();

            res.json({
                items: user.cart.items,
                totalPrice: user.cart.totalPrice,
                itemCount: user.cart.items.reduce((sum, item) => sum + item.quantity, 0)
            });

        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    updateCartItemQuantity: async (req, res) => {
        try {
            const { quantity } = req.body;

            if (!quantity || quantity < 1) {
                return res.status(400).json({ msg: req.__('cart.invalid_quantity') });
            }

            const user = await Users.findById(req.user._id);
            if (!user) return res.status(404).json({ msg: req.__('user_not_found') });

            const item = user.cart.items.find(item =>
                item.postId.toString() === req.params.id
            );

            if (!item) {
                return res.status(404).json({ msg: req.__('cart.product_not_found_in_cart') });
            }

            item.quantity = quantity;
            user.cart.totalPrice = calculateTotal(user.cart.items);

            await user.save();

            res.json({
                msg: req.__('cart.quantity_updated'),
                cart: user.cart
            });

        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }
};

module.exports = carritoCtrl;
