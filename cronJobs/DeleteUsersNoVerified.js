const cron = require('node-cron');
const mongoose = require('mongoose');
const Users = require('../models/userModel');
const Posts = require('../models/postModel');
const Comments = require('../models/commentModel');
const Report = require('../models/reportModel');
const Notify = require('../models/notifyModel'); // 👈 añade tu modelo de notificaciones

// Ejecutar limpieza profunda cada 24 horas (medianoche)
cron.schedule('0 0 * * *', async () => {
  console.log('🧹 Iniciando limpieza profunda...');

  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  try {
    // 🔹 1. Eliminar usuarios NO VERIFICADOS hace más de 24h
    const usersToDelete = await Users.find({
      isVerified: false,
      createdAt: { $lt: twentyFourHoursAgo }
    }).select('_id username email');

    const userIds = usersToDelete.map(user => user._id);

    if (userIds.length > 0) {
      await Users.deleteMany({ _id: { $in: userIds } });
      await Posts.deleteMany({ user: { $in: userIds } });
      await Comments.deleteMany({ user: { $in: userIds } });
      await Notify.deleteMany({
        $or: [
          { user: { $in: userIds } },        // notificaciones enviadas por este usuario
          { recipients: { $in: userIds } }   // notificaciones dirigidas a este usuario
        ]
      });

      await Users.updateMany({}, {
        $pull: {
          followers: { $in: userIds },
          following: { $in: userIds }
        }
      });

      usersToDelete.forEach(user => {
        console.log(`🗑️ Usuario NO verificado eliminado: ${user.username} (${user.email})`);
      });

      console.log(`✅ Usuarios no verificados eliminados: ${userIds.length}`);
    } else {
      console.log('✅ No hay usuarios antiguos no verificados.');
    }

    // 🔹 2. Obtener IDs válidos actuales
    const allUserIds = await Users.find({}).select('_id');
    const existingUserIds = new Set(allUserIds.map(u => u._id.toString()));

    const allPostIds = await Posts.find({}).select('_id');
    const existingPostIds = new Set(allPostIds.map(p => p._id.toString()));

    // 🔹 3. Eliminar posts huérfanos
    const remainingPosts = await Posts.find({});
    for (const post of remainingPosts) {
      if (post.user && !existingUserIds.has(post.user.toString())) {
        await Posts.findByIdAndDelete(post._id);
        console.log(`🚫 Post huérfano eliminado: ${post._id}`);
      }
    }

    // 🔹 4. Eliminar comentarios huérfanos
    const remainingComments = await Comments.find({});
    for (const comment of remainingComments) {
      if (comment.user && !existingUserIds.has(comment.user.toString())) {
        await Comments.findByIdAndDelete(comment._id);
        console.log(`🚫 Comentario huérfano eliminado: ${comment._id}`);
      }
    }

    // 🔹 5. Eliminar usuarios verificados pero INACTIVOS (30 días)
    const inactiveUsers = await Users.find({
      isVerified: true,
      createdAt: { $lt: oneMonthAgo }
    }).select('_id username email');

    const trulyInactive = [];
    for (const user of inactiveUsers) {
      const hasPosts = await Posts.exists({ user: user._id });
      const hasComments = await Comments.exists({ user: user._id });
      if (!hasPosts && !hasComments) {
        trulyInactive.push(user);
      }
    }

    if (trulyInactive.length > 0) {
      const inactiveIds = trulyInactive.map(user => user._id);
      await Users.deleteMany({ _id: { $in: inactiveIds } });
      await Notify.deleteMany({
        $or: [
          { user: { $in: inactiveIds } },
          { recipients: { $in: inactiveIds } }
        ]
      });

      await Users.updateMany({}, {
        $pull: {
          followers: { $in: inactiveIds },
          following: { $in: inactiveIds }
        }
      });

      trulyInactive.forEach(user => {
        console.log(`😴 Usuario inactivo eliminado: ${user.username} (${user.email})`);
      });

      console.log(`✅ Usuarios verificados pero inactivos eliminados: ${inactiveIds.length}`);
    } else {
      console.log('✅ No hay usuarios verificados inactivos para eliminar.');
    }

    // 🔹 6. Eliminar reportes huérfanos
    await Report.deleteMany({
      $or: [
        { postId: { $nin: Array.from(existingPostIds) } },
        { userId: { $nin: Array.from(existingUserIds) } },
        { reportedBy: { $nin: Array.from(existingUserIds) } }
      ]
    });

    // 🔹 7. Eliminar notificaciones huérfanas
    await Notify.deleteMany({
      $or: [
        { user: { $nin: Array.from(existingUserIds) } },
        { recipients: { $nin: Array.from(existingUserIds) } },
        { postId: { $nin: Array.from(existingPostIds) } }
      ]
    });

    // 🔹 8. Limpiar likes huérfanos en posts y comentarios
    await Posts.updateMany({}, {
      $pull: { likes: { $nin: Array.from(existingUserIds) } }
    });
    await Comments.updateMany({}, {
      $pull: { likes: { $nin: Array.from(existingUserIds) } }
    });

    console.log('✅ Likes huérfanos eliminados de posts y comentarios');
    console.log('✅ Reportes y notificaciones huérfanas eliminados');
    console.log('🧼 Limpieza completa realizada');
  } catch (err) {
    console.error('❌ Error en limpieza profunda:', err.message);
  }
});
