const User = require('./models/User');
const Conversation = require('./models/chat/conversacionn');
const Message = require('./models/messagee');

const onlineUsers = {}; // socket.id => userId

module.exports = (socket, io) => {
  console.log('🔌 Usuario conectado:', socket.id);

  // ✅ Usuario conectado: unirlo a todas sus salas
  socket.on('userConnected', async (userId) => {
    try {
      onlineUsers[socket.id] = userId;

      const conversations = await Conversation.find({ members: userId });
      conversations.forEach(conv => {
        const roomId = conv.members.map(id => id.toString()).sort().join('-');
        socket.join(roomId);
        console.log(`🟢 Usuario ${userId} unido a sala ${roomId}`);
      });

      await User.findByIdAndUpdate(userId, {
        isOnline: true,
        lastOnline: new Date()
      });

      io.emit('updateUserStatus', { userId, isOnline: true });
    } catch (err) {
      console.error('❌ Error actualizando estado online:', err.message);
    }
  });

  // 🔁 Unirse a la sala de una conversación específica
  socket.on('joinRoom', ({ conversationId }) => {
    if (conversationId) {
      socket.join(conversationId);
      console.log(`📥 Usuario unido a sala de conversación ${conversationId}`);
    }
  });

  socket.on('leaveRoom', ({ conversationId }) => {
    if (conversationId) {
      socket.leave(conversationId);
      console.log(`📤 Usuario salió de sala de conversación ${conversationId}`);
    }
  });

  // 📩 Enviar mensaje
  socket.on('sendMessage', (msg) => {
    try {
      io.to(msg.conversation).emit('receiveMessage', msg);
      console.log(`📤 Mensaje enviado a conversación ${msg.conversation}`);
    } catch (err) {
      console.error('❌ Error al emitir mensaje:', err.message);
    }
  });

  // 🔴 Usuario se desconecta
  socket.on('disconnect', async () => {
    const userId = onlineUsers[socket.id];

    if (userId) {
      try {
        await User.findByIdAndUpdate(userId, {
          isOnline: false,
          lastOnline: new Date()
        });

        io.emit('updateUserStatus', { userId, isOnline: false });
        console.log('❌ Usuario desconectado:', userId);
        delete onlineUsers[socket.id];
      } catch (err) {
        console.error('❌ Error al marcar desconexión:', err.message);
      }
    } else {
      console.log('🟠 Socket desconectado sin userId conocido:', socket.id);
    }
  });

  // 🧪 Para depurar todos los eventos
  socket.onAny((event, data) => {
    console.log(`🧪 Evento recibido: ${event}`, data);
  });
};
