const router = require('express').Router();
 
const chatCtrl = require('../controllers/chatCtrl');
const auth = require('../middleware/auth');
 
// Obtener todas las conversaciones de un usuario
router.post('/messages', auth, chatCtrl.createMessage);
// Obtener todos los mensajes de una conversación
router.get('/messages/:conversationId', auth, chatCtrl.getMessages);

// Obtener una conversación específica entre dos usuarios
router.get('/conversations/:userId', chatCtrl.getUserConversations);
 // Obtener una conversación específica entre dos usuarios
 router.get('/conversations/find/:user1/:user2', auth, chatCtrl.findOrCreateConversation);
module.exports = router