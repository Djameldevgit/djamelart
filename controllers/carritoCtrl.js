const Posts = require('../models/postModel');
const Users = require('../models/userModel');

const mongoose = require('mongoose');

const calculateTotal = (items) => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

const carritoCtrl = {
    addToCart: async (req, res) => {
        try {
            const post = await Posts.findById(req.params.id);//Busca en la base de datos el post que se quiere agregar al carrito.
            //  req.params.id viene de la URL, como /cart/123abc.
            if (!post || !post.price) {
                return res.status(404).json({ msg: req.__('cart.post_not_found_or_no_price') });
            }

            const user = await Users.findById(req.user._id);//Busca al usuario autenticado por su ID (req.user._id), que normalmente se obtiene desde el middleware de autenticación con JWT
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
                    price: post.price,
                    // Cacheado
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
            const { id: postId } = req.params;
 
            if (!mongoose.Types.ObjectId.isValid(postId)) {
                return res.status(400).json({ msg: "El ID del producto no es válido" });
            }

            const user = await Users.findById(req.user._id);
            if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });

            const itemIndex = user.cart.items.findIndex(
                item => item.postId.toString() === postId
            );

            if (itemIndex === -1) {
                return res.status(404).json({ msg: "Producto no encontrado en el carrito" });
            }

            user.cart.items.splice(itemIndex, 1);
            user.cart.totalPrice = calculateTotal(user.cart.items);
            await user.save();

            return res.json({
                msg: "Producto eliminado del carrito",
                cart: user.cart
            });

        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    getCart: async (req, res) => {
        try {
            const user = await Users.findById(req.user._id)
                .populate({
                    path: 'cart.items.postId', // Asegúrate de que esto coincida con tu modelo
                    select: 'title images',    // Solo los campos que necesitas
                });
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
