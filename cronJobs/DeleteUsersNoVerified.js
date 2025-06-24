const cron = require('node-cron');
const Users = require('../models/userModel');
const Posts = require('../models/postModel');
const Comments = require('../models/commentModel');

// Ejecutar a las 00:00 todos los días
cron.schedule('0 0 * * *', async () => {
  console.log('🧹 Iniciando limpieza profunda diaria de usuarios no verificados y restos...');

  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  try {
    const usersToDelete = await Users.find({
      isVerified: false,
      createdAt: { $lt: twentyFourHoursAgo }
    }).select('_id username email createdAt');

    const userIds = usersToDelete.map(user => user._id);

    if (userIds.length === 0) {
      console.log('✅ No hay usuarios antiguos no verificados.');
    } else {
      await Users.deleteMany({ _id: { $in: userIds } });
      await Posts.deleteMany({ user: { $in: userIds } });
      await Comments.deleteMany({ user: { $in: userIds } });

      await Users.updateMany({}, {
        $pull: {
          followers: { $in: userIds },
          following: { $in: userIds }
        }
      });

      usersToDelete.forEach(user => {
        console.log(`🗑️ Usuario eliminado: ${user.username} (${user.email})`);
      });

      console.log(`✅ Usuarios eliminados: ${userIds.length}`);
    }

    const allUserIds = await Users.find({}).select('_id');
    const existingIds = new Set(allUserIds.map(u => u._id.toString()));

    const remainingPosts = await Posts.find({});
    for (const post of remainingPosts) {
      if (post.user && !existingIds.has(post.user.toString())) {
        await Posts.findByIdAndDelete(post._id);
        console.log(`🚫 Post eliminado por user inexistente: ${post._id}`);
      }
    }

    const remainingComments = await Comments.find({});
    for (const comment of remainingComments) {
      if (comment.user && !existingIds.has(comment.user.toString())) {
        await Comments.findByIdAndDelete(comment._id);
        console.log(`🚫 Comentario eliminado por user inexistente: ${comment._id}`);
      }
    }

    console.log('✅ Limpieza de referencias completada.');

  } catch (err) {
    console.error('❌ Error en limpieza profunda:', err.message);
  }
});
