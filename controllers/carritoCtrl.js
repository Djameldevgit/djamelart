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
            // 1. Validación mejorada del ID
            if (!req.params.id || typeof req.params.id !== 'string') {
                return res.status(400).json({ 
                    msg: req.__('cart.invalid_product_id'),
                    details: 'El ID del producto no es válido'
                });
            }
    
            // 2. Validar que sea un ObjectId válido
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                return res.status(400).json({ 
                    msg: req.__('cart.invalid_product_id'),
                    details: 'El formato del ID no es correcto'
                });
            }
    
            // 3. Buscar el usuario con el carrito
            const user = await Users.findById(req.user._id).select('cart');
            if (!user) {
                return res.status(404).json({ 
                    msg: req.__('user_not_found'),
                    details: 'Usuario no encontrado'
                });
            }
    
            // 4. Encontrar el índice del producto
            const itemIndex = user.cart.items.findIndex(item => 
                item.postId.toString() === req.params.id
            );
    
            if (itemIndex === -1) {
                return res.status(404).json({ 
                    msg: req.__('cart.product_not_found_in_cart'),
                    details: `Producto con ID ${req.params.id} no encontrado en el carrito`
                });
            }
    
            // 5. Eliminar el producto y recalcular total
            const removedItem = user.cart.items[itemIndex];
            user.cart.items.splice(itemIndex, 1);
            
            // 6. Calcular nuevo total de forma segura
            user.cart.totalPrice = user.cart.items.reduce((total, item) => {
                return total + (item.price * (item.quantity || 1)); // Manejo seguro de quantity
            }, 0);
    
            // 7. Guardar los cambios
            await user.save();
    
            // 8. Responder con éxito
            res.json({
                msg: req.__('cart.product_removed'),
                cart: user.cart,
                removedItem: {
                    ...removedItem.toObject(),
                    postId: removedItem.postId.toString() // Asegurar ID como string
                }
            });
    
        } catch (err) {
            console.error('Error en removeFromCart:', err);
            
            // 9. Manejo mejorado de errores
            const errorMsg = err.code === 11000 ? 'Error de duplicado en la base de datos' : 
                             err.name === 'ValidationError' ? 'Error de validación' : 
                             req.__('cart.server_error');
    
            res.status(500).json({ 
                msg: errorMsg,
                details: err.message,
                stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
            });
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
