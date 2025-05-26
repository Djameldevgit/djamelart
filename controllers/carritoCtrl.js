const Posts = require('../models/postModel')
const Users = require('../models/userModel')

const carritoCtrl = {
    addToCart: async (req, res) => {
        try {
            const post = await Posts.findById(req.params.id);
            if (!post || !post.price) {
                return res.status(404).json({ msg: "Publicación no encontrada o sin precio" });
            }
    
            const user = await Users.findById(req.user._id);
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
    
            user.cart.totalPrice = user.cart.items.reduce(
                (total, item) => total + (item.price * item.quantity), 0
            );
    
            await user.save();
    
            res.json({
                msg: 'Publicación agregada al carrito',
                cart: user.cart
            });
    
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    
    removeFromCart: async (req, res) => {
   // En carritoCtrl.js
 
    try {
      // Validación del precio
      const price = parseFloat(req.body.price);
      if (isNaN(price)) {
        return res.status(400).json({ msg: "El precio debe ser un número" });
      }
      if (price <= 0) {
        return res.status(400).json({ msg: "El precio debe ser positivo" });
      }
  
      // Validación de la cantidad
      const quantity = parseInt(req.body.quantity) || 1;
      if (quantity < 1) {
        return res.status(400).json({ msg: "La cantidad debe ser al menos 1" });
      }
  
      // Lógica de eliminación...
      const user = await Users.findOneAndUpdate(
        { _id: req.user._id },
        {
          $pull: { "cart.items": { postId: req.params.id } },
          $inc: { "cart.totalPrice": -price * quantity },
        },
        { new: true }
      );
  
      res.json({ msg: "Producto eliminado", user });
    } catch (err) {
      res.status(500).json({ msg: "Error del servidor" });
    }
  },
    getCart: async (req, res) => {
        try {
            const user = await Users.findById(req.user._id).populate('cart.items.postId')

            
            res.json({
                items: user.cart.items,
                totalPrice: user.cart.totalPrice,
                itemCount: user.cart.items.reduce((sum, item) => sum + item.quantity, 0)
            })
            
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },

    updateCartItemQuantity: async (req, res) => {
        try {
            const { quantity } = req.body
            if (!quantity || quantity < 1) {
                return res.status(400).json({ msg: "Cantidad inválida" })
            }
            
            const user = await Users.findById(req.user._id)
            const item = user.cart.items.find(item => 
                item.postId.toString() === req.params.id
            )
            
            
            if (!item) {
                return res.status(404).json({ msg: "Producto no encontrado en el carrito" })
            }
            
            // Calcular diferencia de precio
            const priceDifference = (quantity - item.quantity) * item.price
            item.quantity = quantity
            
            // Actualizar total
            user.cart.totalPrice += priceDifference
            
            await user.save()
            
            res.json({
                msg: 'Cantidad actualizada',
                cart: user.cart
            })
            
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    }
}

module.exports = carritoCtrl