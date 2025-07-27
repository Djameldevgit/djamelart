const User = require('./models/userModel'); // Ajusta la ruta si es necesario

let users = [];

const EditData = (data, id, call) => {
  return data.map(item =>
    item.id === id ? { ...item, call } : item
  );
};

const SocketServer = (socket) => {
  // Guardar userId en el socket para uso posterior
  socket.on('joinUser', async user => {
    socket.userId = user._id;

    users.push({
      id: user._id,
      socketId: socket.id,
      followers: user.followers
    });

    // Actualiza en BD que está en línea
    await User.findByIdAndUpdate(user._id, {
      isOnline: true,
      lastConnectedAt: new Date()
    });
  });

  socket.on('disconnect', async () => {
    const data = users.find(user => user.socketId === socket.id);
    if (data) {
      const clients = users.filter(user =>
        data.followers.find(item => item._id === user.id)
      );

      if (clients.length > 0) {
        clients.forEach(client => {
          socket.to(`${client.socketId}`).emit('CheckUserOffline', data.id);
        });
      }

      if (data.call) {
        const callUser = users.find(user => user.id === data.call);
        if (callUser) {
          users = EditData(users, callUser.id, null);
          socket.to(`${callUser.socketId}`).emit('callerDisconnect');
        }
      }

      // Actualiza en BD que se desconectó
      await User.findByIdAndUpdate(data.id, {
        isOnline: false,
        lastDisconnectedAt: new Date(),
        lastOnline: new Date()
      });
    }

    users = users.filter(user => user.socketId !== socket.id);
  });

  // Typing
  socket.on('typing', ({ to }) => {
    const userId = socket.userId;
    const user = users.find(u => u.id === to);
    if (user) {
      socket.to(user.socketId).emit('typing', { from: userId });
    }
  });

  socket.on('stopTyping', ({ to }) => {
    const userId = socket.userId;
    const user = users.find(u => u.id === to);
    if (user) {
      socket.to(user.socketId).emit('stopTyping', { from: userId });
    }
  });

  // Likes
  socket.on('likePost', newPost => {
    const ids = [...newPost.user.followers, newPost.user._id];
    const clients = users.filter(user => ids.includes(user.id));
    clients.forEach(client => {
      socket.to(`${client.socketId}`).emit('likeToClient', newPost);
    });
  });

  socket.on('unLikePost', newPost => {
    const ids = [...newPost.user.followers, newPost.user._id];
    const clients = users.filter(user => ids.includes(user.id));
    clients.forEach(client => {
      socket.to(`${client.socketId}`).emit('unLikeToClient', newPost);
    });
  });

  // Comments
  socket.on('createComment', newPost => {
    const ids = [...newPost.user.followers, newPost.user._id];
    const clients = users.filter(user => ids.includes(user.id));
    clients.forEach(client => {
      socket.to(`${client.socketId}`).emit('createCommentToClient', newPost);
    });
  });

  socket.on('deleteComment', newPost => {
    const ids = [...newPost.user.followers, newPost.user._id];
    const clients = users.filter(user => ids.includes(user.id));
    clients.forEach(client => {
      socket.to(`${client.socketId}`).emit('deleteCommentToClient', newPost);
    });
  });

  // Follow
  socket.on('follow', newUser => {
    const user = users.find(user => user.id === newUser._id);
    user && socket.to(`${user.socketId}`).emit('followToClient', newUser);
  });

  socket.on('unFollow', newUser => {
    const user = users.find(user => user.id === newUser._id);
    user && socket.to(`${user.socketId}`).emit('unFollowToClient', newUser);
  });

  // Notification
  socket.on('createNotify', msg => {
    const client = users.find(user => msg.recipients.includes(user.id));
    client && socket.to(`${client.socketId}`).emit('createNotifyToClient', msg);
  });

  socket.on('removeNotify', msg => {
    const client = users.find(user => msg.recipients.includes(user.id));
    client && socket.to(`${client.socketId}`).emit('removeNotifyToClient', msg);
  });

  // Message
  socket.on('addMessage', msg => {
    const user = users.find(user => user.id === msg.recipient);
    user && socket.to(`${user.socketId}`).emit('addMessageToClient', msg);
  });

  // Check Online
  socket.on('checkUserOnline', data => {
    const following = users.filter(user =>
      data.following.find(item => item._id === user.id)
    );
    socket.emit('checkUserOnlineToMe', following);

    const clients = users.filter(user =>
      data.followers.find(item => item._id === user.id)
    );
    clients.forEach(client => {
      socket.to(`${client.socketId}`).emit('checkUserOnlineToClient', data._id);
    });
  });

  // Call
  socket.on('callUser', data => {
    users = EditData(users, data.sender, data.recipient);

    const client = users.find(user => user.id === data.recipient);

    if (client) {
      if (client.call) {
        socket.emit('userBusy', data);
        users = EditData(users, data.sender, null);
      } else {
        users = EditData(users, data.recipient, data.sender);
        socket.to(`${client.socketId}`).emit('callUserToClient', data);
      }
    }
  });

  socket.on('endCall', data => {
    const client = users.find(user => user.id === data.sender);

    if (client) {
      socket.to(`${client.socketId}`).emit('endCallToClient', data);
      users = EditData(users, client.id, null);

      if (client.call) {
        const clientCall = users.find(user => user.id === client.call);
        clientCall && socket.to(`${clientCall.socketId}`).emit('endCallToClient', data);
        users = EditData(users, client.call, null);
      }
    }
  });
};

module.exports = SocketServer;
