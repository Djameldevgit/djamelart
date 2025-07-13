const router = require('express').Router()
const auth = require("../middleware/auth")
const carritoCtrl = require("../controllers/carritoCtrl")
const userCtrl = require('../controllers/userCtrl')

router.post('/contact-support-block', auth, userCtrl.contactBlockedSupport);

router.post('/contact-support', auth, userCtrl.contactMailSupport)
// Rutas existentes...ToCart)
router.delete('/remove/:id', auth, carritoCtrl.removeFromCart)
router.get('/', auth, carritoCtrl.getCart)
router.put('/update/:id', auth, carritoCtrl.updateCartItemQuantity)

// Rutas de usuarios
router.get('/users', auth, userCtrl.getUsersAction)
router.get('/users/usersaction', auth, userCtrl.getUsersAction)

router.get('/search', auth, userCtrl.searchUser)
router.get('/user/:id', auth, userCtrl.getUser)
router.patch('/user', auth, userCtrl.updateUser)
router.get('/suggestionsUser', auth, userCtrl.suggestionsUser)
router.patch('/user/:id/follow', auth, userCtrl.follow)
router.patch('/user/:id/unfollow', auth, userCtrl.unfollow)

// Nueva ruta para eliminar usuario
router.delete('/user/:id', auth, userCtrl.deleteUser)
 
router.delete('/posts', auth  ,userCtrl.eliminaRrestosDePosts)

router.post('/contact-activation-request', auth, userCtrl.contactForActivation);
router.patch('/toggle_active/:id', auth, userCtrl.toggleActiveStatus);








module.exports = router