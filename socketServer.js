let users = []

const EditData = (data, id, call) => {
    const newData = data.map(item =>
        item.id === id ? { ...item, call } : item
    )
    return newData;
}

const SocketServer = (socket) => {
    // Connect - Disconnect
    socket.on('joinUser', user => {
        users.push({ id: user._id, socketId: socket.id, followers: user.followers })
    })

    socket.on('disconnect', () => {
        const data = users.find(user => user.socketId === socket.id)
        if (data) {
            const clients = users.filter(user =>
                data.followers.find(item => item._id === user.id)
            )

            if (clients.length > 0) {
                clients.forEach(client => {
                    socket.to(`${client.socketId}`).emit('CheckUserOffline', data.id)
                })
            }

            if (data.call) {
                const callUser = users.find(user => user.id === data.call)
                if (callUser) {
                    users = EditData(users, callUser.id, null)
                    socket.to(`${callUser.socketId}`).emit('callerDisconnect')
                }
            }
        }

        users = users.filter(user => user.socketId !== socket.id)
    })

    socket.on('createNotify', (notify) => {
        // Siempre esperamos un array de recipients
        const recipients = Array.isArray(notify.recipients) ? notify.recipients : []
    
        recipients.forEach(recipientId => {
          const client = users.find(u => u.id === recipientId)
          if (client) {
            // Enviar SOLO al dueño del post
            socket.to(client.socketId).emit('createNotifyToClient', notify)
          }
        })
      })
     
        // recibir mensaje del admin
        socket.on("addMessageAdmin", (msg) => {
          // filtramos al destinatario
          const recipient = users.find(user => msg.recipients.includes(user.id));
      
          if (recipient) {
            // enviamos solo al dueño del post
            socket.to(`${recipient.socketId}`).emit("addMessageAdminToClient", msg);
          }
        });
      
      
    socket.on('likePost', newPost => {
        const ids = [...newPost.user.followers, newPost.user._id]
        const clients = users.filter(user => ids.includes(user.id))

        if (clients.length > 0) {
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit('likeToClient', newPost)
            })
        }
    })

    socket.on('unLikePost', newPost => {
        const ids = [...newPost.user.followers, newPost.user._id]
        const clients = users.filter(user => ids.includes(user.id))

        if (clients.length > 0) {
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit('unLikeToClient', newPost)
            })
        }
    })


    // Comments
    socket.on('createComment', newPost => {
        const ids = [...newPost.user.followers, newPost.user._id]
        const clients = users.filter(user => ids.includes(user.id))

        if (clients.length > 0) {
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit('createCommentToClient', newPost)
            })
        }
    })

    socket.on('deleteComment', newPost => {
        const ids = [...newPost.user.followers, newPost.user._id]
        const clients = users.filter(user => ids.includes(user.id))

        if (clients.length > 0) {
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit('deleteCommentToClient', newPost)
            })
        }
    })


    // Follow
    socket.on('follow', newUser => {
        const user = users.find(user => user.id === newUser._id)
        user && socket.to(`${user.socketId}`).emit('followToClient', newUser)
    })

    socket.on('unFollow', newUser => {
        const user = users.find(user => user.id === newUser._id)
        user && socket.to(`${user.socketId}`).emit('unFollowToClient', newUser)
    })


    // Notification
    socket.on('createNotify', msg => {
        const client = users.find(user => msg.recipients.includes(user.id))
        client && socket.to(`${client.socketId}`).emit('createNotifyToClient', msg)
    })

    socket.on('removeNotify', msg => {
        const client = users.find(user => msg.recipients.includes(user.id))
        client && socket.to(`${client.socketId}`).emit('removeNotifyToClient', msg)

    })


    // Message
    socket.on('addMessage', msg => {
        const user = users.find(user => user.id === msg.recipient)
        user && socket.to(`${user.socketId}`).emit('addMessageToClient', msg)
    })


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


    // Call User
    socket.on('callUser', data => {
        users = EditData(users, data.sender, data.recipient)

        const client = users.find(user => user.id === data.recipient)

        if (client) {
            if (client.call) {
                socket.emit('userBusy', data)
                users = EditData(users, data.sender, null)
            } else {
                users = EditData(users, data.recipient, data.sender)
                socket.to(`${client.socketId}`).emit('callUserToClient', data)
            }
        }
    })

    socket.on('endCall', data => {
        const client = users.find(user => user.id === data.sender)

        if (client) {
            socket.to(`${client.socketId}`).emit('endCallToClient', data)
            users = EditData(users, client.id, null)

            if (client.call) {
                const clientCall = users.find(user => user.id === client.call)
                clientCall && socket.to(`${clientCall.socketId}`).emit('endCallToClient', data)

                users = EditData(users, client.call, null)
            }
        }
    })




// Comentarios del Blog
// Eventos de comentarios sin lógica de followers/following
socket.on('blog:comment:new', (data) => {
    socket.broadcast.emit('blog:comment:new', data)
  })

  // ====== ACTUALIZAR COMENTARIO ======
  socket.on('blog:comment:update', (data) => {
    socket.broadcast.emit('blog:comment:update', data)
  })

  // ====== ELIMINAR COMENTARIO ======
  socket.on('blog:comment:delete', (data) => {
    socket.broadcast.emit('blog:comment:delete', data)
  })

  // ====== RESPONDER COMENTARIO ======
  socket.on('blog:comment:reply', (data) => {
    socket.broadcast.emit('blog:comment:reply', data)
  })

  // ====== LIKE COMENTARIO ======
  socket.on('blog:comment:like', (data) => {
    socket.broadcast.emit('blog:comment:like', data)
  })

  // ====== DISLIKE COMENTARIO ======
  socket.on('blog:comment:dislike', (data) => {
    socket.broadcast.emit('blog:comment:dislike', data)
  })











}

module.exports = SocketServer