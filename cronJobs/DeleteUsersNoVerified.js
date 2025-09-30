const cron = require('node-cron');
const Users = require('../models/userModel');
const Posts = require('../models/postModel');
const Comments = require('../models/commentModel');
const BlogComment = require('../models/BlogComment');
const Report = require('../models/reportModel');
const Notify = require('../models/notifyModel');
const Message = require('../models/messageModel');

// 🔹 Variables de configuración (24 horas por defecto)
const UNVERIFIED_HOURS = process.env.CLEANUP_UNVERIFIED_HOURS || 24; // horas
const INACTIVE_DAYS = process.env.CLEANUP_INACTIVE_DAYS || 24; // días

// 🔹 Ejecutar una vez cada 24h (a medianoche)
cron.schedule('0 0 * * *', async () => {
  console.log('🧹 Iniciando limpieza profunda... (ejecutando cada 24h)');

  const unverifiedLimit = new Date(Date.now() - UNVERIFIED_HOURS * 60 * 60 * 1000); // usuarios no verificados
  const inactiveLimit = new Date(Date.now() - INACTIVE_DAYS * 24 * 60 * 60 * 1000); // usuarios inactivos

  try {
    // 🔹 1. Eliminar usuarios NO verificados
    const usersToDelete = await Users.find({
      isVerified: false,
      createdAt: { $lt: unverifiedLimit }
    }).select('_id username email');

    const userIds = usersToDelete.map(u => u._id);

    if (userIds.length > 0) {
      await Promise.all([
        Users.deleteMany({ _id: { $in: userIds } }),
        Posts.deleteMany({ user: { $in: userIds } }),
        Comments.deleteMany({ user: { $in: userIds } }),
        BlogComment.deleteMany({ user: { $in: userIds } }),
        Notify.deleteMany({ $or: [{ user: { $in: userIds } }, { recipients: { $in: userIds } }] }),
        Message.deleteMany({ $or: [{ sender: { $in: userIds } }, { recipient: { $in: userIds } }] }),
        Users.updateMany({}, { $pull: { followers: { $in: userIds }, following: { $in: userIds } } })
      ]);

      usersToDelete.forEach(u => console.log(`🗑️ Usuario no verificado eliminado: ${u.username} (${u.email})`));
      console.log(`✅ Eliminados ${userIds.length} usuarios no verificados`);
    } else {
      console.log('✅ No hay usuarios no verificados antiguos');
    }

    // 🔹 2. Obtener IDs válidos actuales
    const [allUsers, allPosts] = await Promise.all([
      Users.find({}).select('_id'),
      Posts.find({}).select('_id')
    ]);

    const existingUserIds = new Set(allUsers.map(u => u._id.toString()));
    const existingPostIds = new Set(allPosts.map(p => p._id.toString()));

    // 🔹 3 y 4. Eliminar posts y comentarios huérfanos
    await Promise.all([
      Posts.deleteMany({ user: { $nin: Array.from(existingUserIds) } }),
      Comments.deleteMany({ user: { $nin: Array.from(existingUserIds) } }),
      BlogComment.deleteMany({ user: { $nin: Array.from(existingUserIds) } })
    ]);

    // 🔹 5. Usuarios verificados inactivos
    const inactiveUsers = await Users.aggregate([
      { $match: { isVerified: true, createdAt: { $lt: inactiveLimit } } },
      {
        $lookup: {
          from: 'posts',
          localField: '_id',
          foreignField: 'user',
          as: 'posts'
        }
      },
      {
        $lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'user',
          as: 'comments'
        }
      },
      {
        $lookup: {
          from: 'blogcomments',
          localField: '_id',
          foreignField: 'user',
          as: 'blogComments'
        }
      },
      { $match: { posts: { $size: 0 }, comments: { $size: 0 }, blogComments: { $size: 0 } } },
      { $project: { _id: 1, username: 1, email: 1 } }
    ]);

    if (inactiveUsers.length > 0) {
      const inactiveIds = inactiveUsers.map(u => u._id);

      await Promise.all([
        Users.deleteMany({ _id: { $in: inactiveIds } }),
        Notify.deleteMany({ $or: [{ user: { $in: inactiveIds } }, { recipients: { $in: inactiveIds } }] }),
        Message.deleteMany({ $or: [{ sender: { $in: inactiveIds } }, { recipient: { $in: inactiveIds } }] }),
        Users.updateMany({}, { $pull: { followers: { $in: inactiveIds }, following: { $in: inactiveIds } } })
      ]);

      inactiveUsers.forEach(u => console.log(`😴 Usuario inactivo eliminado: ${u.username} (${u.email})`));
      console.log(`✅ Eliminados ${inactiveIds.length} usuarios verificados inactivos`);
    } else {
      console.log('✅ No hay usuarios verificados inactivos para eliminar');
    }

    // 🔹 6 a 9. Limpiar reportes, notificaciones, mensajes y likes huérfanos
    await Promise.all([
      Report.deleteMany({
        $or: [
          { postId: { $nin: Array.from(existingPostIds) } },
          { userId: { $nin: Array.from(existingUserIds) } },
          { reportedBy: { $nin: Array.from(existingUserIds) } }
        ]
      }),
      Notify.deleteMany({
        $or: [
          { user: { $nin: Array.from(existingUserIds) } },
          { recipients: { $nin: Array.from(existingUserIds) } },
          { postId: { $nin: Array.from(existingPostIds) } }
        ]
      }),
      Message.deleteMany({
        $or: [
          { sender: { $nin: Array.from(existingUserIds) } },
          { recipient: { $nin: Array.from(existingUserIds) } }
        ]
      }),
      Posts.updateMany({}, { $pull: { likes: { $nin: Array.from(existingUserIds) } } }),
      Comments.updateMany({}, { $pull: { likes: { $nin: Array.from(existingUserIds) } } }),
      BlogComment.updateMany({}, { $pull: { likes: { $nin: Array.from(existingUserIds) } } })
    ]);

    console.log('✅ Likes, reportes, notificaciones y mensajes huérfanos eliminados');
    console.log('🧼 Limpieza completa realizada');

  } catch (err) {
    console.error('❌ Error en limpieza profunda:', err.message);
  }
});
