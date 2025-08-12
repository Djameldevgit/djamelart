const User = require('./models/userModel'); // Ajusta la ruta si es necesario

let users = [];

const EditData = (data, id, call) =>
  data.map(item => item.id === id ? { ...item, call } : item);

const SocketServer = (socket, io) => {
  // Usuario entra
  socket.on('joinUser', async user => {
    socket.userId = user._id;

    users.push({
      id: user._id,
      socketId: socket.id,
      followers: user.followers
    });

    await User.findByIdAndUpdate(user._id, {
      isOnline: true,
      lastConnectedAt: new Date()
    });
  });

  // Usuario sale
  socket.on('disconnect', () => {
    const data = users.find(user => user.socketId === socket.id)
    if(data){
        const clients = users.filter(user => 
            data.followers.find(item => item._id === user.id)
        )

        if(clients.length > 0){
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit('CheckUserOffline', data.id)
            })
        }

        if(data.call){
            const callUser = users.find(user => user.id === data.call)
            if(callUser){
                users = EditData(users, callUser.id, null)
                socket.to(`${callUser.socketId}`).emit('callerDisconnect')
            }
        }
    }

    users = users.filter(user => user.socketId !== socket.id)
})



  // Escribiendo
  socket.on('typing', ({ to }) => {
    const user = users.find(u => u.id === to);
    if (user) socket.to(user.socketId).emit('typing', { from: socket.userId });
  });

  socket.on('stopTyping', ({ to }) => {
    const user = users.find(u => u.id === to);
    if (user) socket.to(user.socketId).emit('stopTyping', { from: socket.userId });
  });

  // Likes
  socket.on('likePost', newPost => {
    const ids = [...newPost.user.followers, newPost.user._id];
    users.filter(u => ids.includes(u.id))
         .forEach(client => socket.to(client.socketId).emit('likeToClient', newPost));
  });

  socket.on('unLikePost', newPost => {
    const ids = [...newPost.user.followers, newPost.user._id];
    users.filter(u => ids.includes(u.id))
         .forEach(client => socket.to(client.socketId).emit('unLikeToClient', newPost));
  });

  // Comments
  socket.on('createComment', newPost => {
    const ids = [...newPost.user.followers, newPost.user._id];
    users.filter(u => ids.includes(u.id))
         .forEach(client => socket.to(client.socketId).emit('createCommentToClient', newPost));
  });

  socket.on('deleteComment', newPost => {
    const ids = [...newPost.user.followers, newPost.user._id];
    users.filter(u => ids.includes(u.id))
         .forEach(client => socket.to(client.socketId).emit('deleteCommentToClient', newPost));
  });

  // Follow / Unfollow
  socket.on('follow', newUser => {
    const user = users.find(u => u.id === newUser._id);
    if (user) socket.to(user.socketId).emit('followToClient', newUser);
  });

  socket.on('unFollow', newUser => {
    const user = users.find(u => u.id === newUser._id);
    if (user) socket.to(user.socketId).emit('unFollowToClient', newUser);
  });

  // Notifications
  socket.on('createNotify', msg => {
    const client = users.find(u => msg.recipients.includes(u.id));
    if (client) socket.to(client.socketId).emit('createNotifyToClient', msg);
  });

  socket.on('removeNotify', msg => {
    const client = users.find(u => msg.recipients.includes(u.id));
    if (client) socket.to(client.socketId).emit('removeNotifyToClient', msg);
  });

  // Mensajes
  socket.on('addMessage', msg => {
    const user = users.find(u => u.id === msg.recipient);
    if (user) socket.to(user.socketId).emit('addMessageToClient', msg);
  });

  // Estado online

    // Check User Online / Offline
    socket.on('checkUserOnline', data => {
      const following = users.filter(user =>
          data.following.find(item => item._id === user.id)
      )
      socket.emit('checkUserOnlineToMe', following)

      const clients = users.filter(user =>
          data.followers.find(item => item._id === user.id)
      )

      if (clients.length > 0) {
          clients.forEach(client => {
              socket.to(`${client.socketId}`).emit('checkUserOnlineToClient', data._id)
          })
      }

  })

  // Llamadas
  socket.on('callUser', data => {
    users = EditData(users, data.sender, data.recipient);
    const client = users.find(u => u.id === data.recipient);

    if (client) {
      if (client.call) {
        socket.emit('userBusy', data);
        users = EditData(users, data.sender, null);
      } else {
        users = EditData(users, data.recipient, data.sender);
        socket.to(client.socketId).emit('callUserToClient', data);
      }
    }
  });

  socket.on('endCall', data => {
    const client = users.find(u => u.id === data.sender);
    if (client) {
      socket.to(client.socketId).emit('endCallToClient', data);
      users = EditData(users, client.id, null);

      if (client.call) {
        const clientCall = users.find(u => u.id === client.call);
        if (clientCall) socket.to(clientCall.socketId).emit('endCallToClient', data);
        users = EditData(users, client.call, null);
      }
    }
  });
};

// Namespace /blog
const BlogNamespace = io => {
  io.of('/blog').on('connection', socket => {
    console.log('Client connected to /blog:', socket.id);

    socket.on('blog:comment:new', ({ comment }) => {
      io.of('/blog').emit('blog:comment:new', { comment });
    });

    socket.on('blog:comment:update', ({ commentId, text }) => {
      io.of('/blog').emit('blog:comment:update', { commentId, text });
    });

    socket.on('blog:comment:delete', ({ commentId }) => {
      io.of('/blog').emit('blog:comment:delete', { commentId });
    });
  });
};

module.exports = SocketServer;
