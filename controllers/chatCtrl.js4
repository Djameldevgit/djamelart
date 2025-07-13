const Conversation = require('../models/chat/conversacionn');
const Message = require('../models/chat/message');
const mongoose = require('mongoose');

const chatCtrl = {
// controllers/chatCtrl.js
// chatCtrl.js - Actualizado
createMessage: async (req, res) => {
  try {
    const { conversationId, sender, receiver, message } = req.body;

    if (!sender || !receiver || !message || !message.trim()) {
      return res.status(400).json({ error: 'Datos incompletos' });
    }

    let convId = conversationId;

    // Si no hay conversationId, buscamos o creamos una
    if (!convId) {
      const existing = await Conversation.findOne({
        members: { $all: [sender, receiver], $size: 2 }
      });

      if (existing) {
        convId = existing._id;
      } else {
        const newConv = await Conversation.create({ members: [sender, receiver] });
        convId = newConv._id;
      }
    }

    const newMessage = await Message.create({
      conversation: convId,
      sender,
      receiver,
      message
    });

    // Populate los datos del remitente para el frontend
    const populatedMsg = await Message.findById(newMessage._id)
      .populate('sender', 'username avatar')
      .populate('receiver', 'username avatar');

    res.json(populatedMsg);
  } catch (err) {
    console.error('❌ Error al crear mensaje:', err);
    res.status(500).json({ error: 'Error al enviar mensaje' });
  }
},
  
  getUserConversations: async (req, res) => {
    try {
      const { userId } = req.params;

      const conversations = await Conversation.find({
        members: userId
      }).populate('members', 'username avatar fullname');

      res.json(conversations);
    } catch (err) {
      res.status(500).json({ error: 'Error al obtener conversaciones' });
    }
  },
  findOrCreateConversation: async (req, res) => {
    try {
      const { user1, user2 } = req.params;
  
      let conversation = await Conversation.findOne({
        members: { $all: [user1, user2], $size: 2 }
      });
  
      if (!conversation) {
        conversation = await Conversation.create({ members: [user1, user2] });
      }
  
      return res.json(conversation);
    } catch (err) {
      console.error('❌ Error al buscar o crear conversación:', err);
      return res.status(500).json({ error: 'Error al buscar o crear conversación' });
    }
  },
  
  // Obtener todos los mensajes de una conversación
  getMessages: async (req, res) => {
    try {
      const messages = await Message.find({
        conversation: req.params.conversationId
      }).sort({ createdAt: 1 }); // Orden cronológico

      res.json(messages);
    } catch (err) {
      res.status(500).json({ error: 'Error al obtener mensajes' });
    }
  }
};

module.exports = chatCtrl;
