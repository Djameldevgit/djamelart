const express = require('express');
const router = express.Router();
const controller = require('../controllers/blogCommentController');

// Ajusta "authMiddleware" al nombre real de tu middleware (ej: auth, authMiddleware, verifyToken)
const auth = require('../middleware/auth')
router.get('/', controller.getAll);
router.post('/', auth, controller.create); // antes tenía /blog/comments
router.post('/:id/reply', auth, controller.reply);
router.put('/:id', auth, controller.update);
router.delete('/:id', auth, controller.remove);


module.exports = router;
