
const Users = require('../models/userModel');
const Posts = require('../models/postModel');
const Comments = require('../models/commentModel');

const Notifications = require('../models/notifyModel')

const mongoose = require('mongoose');





class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  paginating() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 9;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
const userCtrl = {


  validateUserActivity: async (req, res, next) => {
    const user = await Users.findById(req.user._id);
    if (!user) return res.status(401).json({ msg: 'Usuario no encontrado.' });

    // Si no está verificado y tiene más de 3 días
    const accountAge = Date.now() - new Date(user.createdAt).getTime();
    const threeDays = 3 * 24 * 60 * 60 * 1000;

    if (!user.isVerified && accountAge > threeDays) {
      await Users.findByIdAndDelete(user._id);
      return res.status(403).json({
        msg: 'Tu cuenta ha sido eliminada por no verificarla a tiempo. Regístrate de nuevo si deseas acceder.',
      });
    }

    next(); // pasa a la siguiente acción si todo está bien
  },



  toggleActiveStatus: async (req, res) => {
    try {
      const user = await Users.findById(req.params.id);
      if (!user) return res.status(404).json({ msg: "Usuario no encontrado." });

      user.isActive = !user.isActive;
      await user.save();

      res.json({ msg: "Estado actualizado", user });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },




  searchUser: async (req, res) => {
    try {
      const users = await Users.find({ username: { $regex: req.query.username } })
        .limit(10).select("fullname username avatar")

      res.json({ users })
    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
  },
  getUser: async (req, res) => {
    try {
      const user = await Users.findById(req.params.id).select('-password')
        .populate("followers following", "-password")
      if (!user) return res.status(400).json({ msg: "User does not exist." })

      res.json({ user })
    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
  },


  getUsers: async (req, res) => {
    try {
      const features = new APIfeatures(Users.find({

      }), req.query).paginating()

      const users = await features.query.sort('-createdAt')
        .populate("user", "avatar username email")


      res.json({
        msg: 'Success!',
        result: users.length,
        users
      })

    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
  },

  updateUser: async (req, res) => {
    try {
      const { avatar, fullname, mobile, address, story, website, gender } = req.body
      if (!fullname) return res.status(400).json({ msg: "Please add your full name." })

      await Users.findOneAndUpdate({ _id: req.user._id }, {
        avatar, fullname, mobile, address, story, website, gender
      })

      res.json({ msg: "Update Success!" })

    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
  },
  follow: async (req, res) => {
    try {
      const user = await Users.find({ _id: req.params.id, followers: req.user._id })
      if (user.length > 0) return res.status(500).json({ msg: "You followed this user." })

      const newUser = await Users.findOneAndUpdate({ _id: req.params.id }, {
        $push: { followers: req.user._id }
      }, { new: true }).populate("followers following", "-password")

      await Users.findOneAndUpdate({ _id: req.user._id }, {
        $push: { following: req.params.id }
      }, { new: true })

      res.json({ newUser })

    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
  },
  unfollow: async (req, res) => {
    try {

      const newUser = await Users.findOneAndUpdate({ _id: req.params.id }, {
        $pull: { followers: req.user._id }
      }, { new: true }).populate("followers following", "-password")

      await Users.findOneAndUpdate({ _id: req.user._id }, {
        $pull: { following: req.params.id }
      }, { new: true })

      res.json({ newUser })

    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
  },
  suggestionsUser: async (req, res) => {
    try {
      const newArr = [...req.user.following, req.user._id]

      const num = req.query.num || 10

      const users = await Users.aggregate([
        { $match: { _id: { $nin: newArr } } },
        { $sample: { size: Number(num) } },
        { $lookup: { from: 'users', localField: 'followers', foreignField: '_id', as: 'followers' } },
        { $lookup: { from: 'users', localField: 'following', foreignField: '_id', as: 'following' } },
      ]).project("-password")

      return res.json({
        users,
        result: users.length
      })

    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
  },


  /*
       deleteUser: async (req, res) => {
         try {
           // Verificar si el usuario que hace la solicitud es admin
           const requestingUser = await Users.findById(req.user._id)
           if (!requestingUser.role === 'admin') {
             return res.status(403).json({ msg: 'Solo los administradores pueden eliminar usuarios' })
           }
     
           // Verificar si el usuario a eliminar existe
           const userToDelete = await Users.findById(req.params.id)
           if (!userToDelete) {
             return res.status(404).json({ msg: 'Usuario no encontrado' })
           }
     
           // Evitar que un admin se elimine a sí mismo
           if (userToDelete._id.toString() === req.user._id.toString()) {
             return res.status(400).json({ msg: 'No puedes eliminarte a ti mismo' })
           }
     
           // Eliminar el usuario permanentemente
           await Users.findByIdAndDelete(req.params.id)
     
           res.json({ 
             msg: 'Usuario eliminado permanentemente',
             deletedUserId: req.params.id
           })
     
         } catch (err) {
           console.error('Error al eliminar usuario:', err)
           return res.status(500).json({ msg: err.message })
         }
       }
     
     
 
 
       deleteUser: async (req, res) => {
         const session = await mongoose.startSession();
         session.startTransaction();
         
         try {
           // 1. Verificar permisos de administrador
           if (req.user.role !== 'admin') {
             return res.status(403).json({ 
               success: false,
               msg: 'Acceso denegado. Se requieren privilegios de administrador' 
             });
           }
     
           // 2. Validar ID y existencia del usuario
           if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
             return res.status(400).json({ 
               success: false,
               msg: 'ID de usuario no válido' 
             });
           }
     
           const userToDelete = await Users.findById(req.params.id).session(session);
           if (!userToDelete) {
             return res.status(404).json({ 
               success: false,
               msg: 'Usuario no encontrado' 
             });
           }
     
           // 3. Prevenir auto-eliminación
           if (userToDelete._id.toString() === req.user._id.toString()) {
             return res.status(400).json({ 
               success: false,
               msg: 'No puedes eliminarte a ti mismo' 
             });
           }
     
           // 4. Eliminación en cascada de todo el contenido relacionado
           await Promise.all([
             // Eliminar todos los posts del usuario y sus comentarios/likes
             Posts.deleteMany({ user: req.params.id }).session(session)
               .then(() => {
                 // Eliminar comentarios y likes de esos posts
                 return Promise.all([
                   Comments.deleteMany({ post: { $in: userToDelete.posts } }).session(session),
                   Likes.deleteMany({ post: { $in: userToDelete.posts } }).session(session)
                 ]);
               }),
             
             // Eliminar comentarios hechos por el usuario en otros posts
             Comments.deleteMany({ user: req.params.id }).session(session),
             
             // Eliminar likes dados por el usuario
             Likes.deleteMany({ user: req.params.id }).session(session),
             
             // Eliminar carritos del usuario
             Cart.deleteMany({ user: req.params.id }).session(session),
             
             // Eliminar relaciones de seguimiento
             Follows.deleteMany({ 
               $or: [{ follower: req.params.id }, { following: req.params.id }] 
             }).session(session),
             
             // Eliminar notificaciones relacionadas
             Notifications.deleteMany({ 
               $or: [
                 { sender: req.params.id },
                 { recipient: req.params.id }
               ] 
             }).session(session),
             
             // Eliminar de listas de seguidores/seguidos en otros usuarios
             Users.updateMany(
               { $or: [{ followers: req.params.id }, { following: req.params.id }] },
               { 
                 $pull: { 
                   followers: req.params.id, 
                   following: req.params.id 
                 } 
               }
             ).session(session)
           ]);
     
           // 5. Registrar acción antes de eliminar (opcional)
           console.log(`[ADMIN ACTION] User ${req.user._id} deleted user ${req.params.id} at ${new Date()}`);
     
           // 6. Finalmente eliminar al usuario
           await Users.findByIdAndDelete(req.params.id).session(session);
     
           // 7. Confirmar la transacción
           await session.commitTransaction();
           
           res.json({ 
             success: true,
             msg: 'Usuario y todo su contenido relacionado (posts, comentarios, likes, carritos) eliminados permanentemente',
             deletedUserId: req.params.id,
             deletedAt: new Date()
           });
     
         } catch (err) {
           // Revertir la transacción en caso de error
           await session.abortTransaction();
           
           console.error('Error en transacción de eliminación completa:', err);
           res.status(500).json({ 
             success: false,
             msg: 'Error al eliminar usuario y su contenido',
             error: err.message
           });
         } finally {
           // Finalizar la sesión
           session.endSession();
         }
       }
  */

  deleteUser: async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 1. Verificar permisos de administrador
      if (req.user.role !== 'admin') {
        await session.abortTransaction();
        return res.status(403).json({
          success: false,
          msg: 'Acceso denegado. Se requieren privilegios de administrador'
        });
      }

      // 2. Validar ID del usuario
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        await session.abortTransaction();
        return res.status(400).json({
          success: false,
          msg: 'ID de usuario no válido'
        });
      }

      // 3. Obtener usuario a eliminar
      const userToDelete = await Users.findById(req.params.id).session(session);
      if (!userToDelete) {
        await session.abortTransaction();
        return res.status(404).json({
          success: false,
          msg: 'Usuario no encontrado'
        });
      }

      // 4. Prevenir auto-eliminación
      if (userToDelete._id.toString() === req.user._id.toString()) {
        await session.abortTransaction();
        return res.status(400).json({
          success: false,
          msg: 'No puedes eliminarte a ti mismo'
        });
      }

      // 5. Obtener todos los posts del usuario
      const userPosts = await Posts.find({ user: req.params.id }).session(session);

      // 6. Eliminación en cascada
      await Promise.all([
        // Eliminar posts y sus relaciones
        Posts.deleteMany({ user: req.params.id }).session(session)
          .then(async () => {
            // Eliminar comentarios de esos posts
            await Comments.deleteMany({
              post: { $in: userPosts.map(p => p._id) }
            }).session(session);
          }),

        // Eliminar comentarios hechos por el usuario
        Comments.deleteMany({ user: req.params.id }).session(session),

        // Eliminar notificaciones
        Notifications.deleteMany({
          $or: [
            { sender: req.params.id },
            { recipient: req.params.id }
          ]
        }).session(session),

        // Actualizar relaciones de usuarios (followers, following, saved)
        Users.updateMany(
          {
            $or: [
              { followers: req.params.id },
              { following: req.params.id },
              { saved: req.params.id }
            ]
          },
          {
            $pull: {
              followers: req.params.id,
              following: req.params.id,
              saved: req.params.id
            }
          }
        ).session(session),

        // Limpiar likes del usuario en posts (array de referencias)
        Posts.updateMany(
          { likes: req.params.id },
          { $pull: { likes: req.params.id } }
        ).session(session),

        // Limpiar referencias en carritos de otros usuarios
        Users.updateMany(
          { "cart.items.postId": { $in: userPosts.map(p => p._id) } },
          { $pull: { "cart.items": { postId: { $in: userPosts.map(p => p._id) } } } }
        ).session(session).then(async () => {
          // Recalcular totales de carritos afectados
          const affectedUsers = await Users.find({
            "cart.items.postId": { $in: userPosts.map(p => p._id) }
          }).session(session);

          for (const user of affectedUsers) {
            const total = user.cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            await Users.updateOne(
              { _id: user._id },
              { $set: { "cart.totalPrice": total } }
            ).session(session);
          }
        })
      ]);

      // 7. Eliminar al usuario (esto activará el middleware pre('remove'))
      await userToDelete.remove({ session });

      // 8. Confirmar transacción
      await session.commitTransaction();

      res.json({
        success: true,
        msg: 'Usuario y todo su contenido relacionado eliminados permanentemente',
        deletedAt: new Date()
      });

    } catch (err) {
      await session.abortTransaction();
      console.error('Error en eliminación completa:', err);
      res.status(500).json({
        success: false,
        msg: 'Error al eliminar usuario',
        error: err.message
      });
    } finally {
      session.endSession();
    }
  },




















  eliminaRrestosDePosts: async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    console.log('🟢 Entró al controlador eliminaRrestosDePosts');

    try {


      if (!req.user || req.user.role !== 'admin') {
        await session.abortTransaction();
        return res.status(403).json({
          success: false,
          msg: 'Acceso denegado. Se requieren privilegios de administrador'
        });
      }

      const orphanedPosts = await Posts.aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'author_data'
          }
        },
        {
          $match: {
            $or: [
              { user: { $exists: false } },
              { user: null },
              { author_data: { $size: 0 } }
            ]
          }
        },
        {
          $project: {
            _id: 1,
            comments: 1
          }
        }
      ]).session(session);

      console.log('Orphaned posts:', orphanedPosts);

      const idsToDelete = orphanedPosts.map(post => post._id);
      const commentIdsToDelete = orphanedPosts.flatMap(post => post.comments || []);
      const idsToDeleteObjectId = idsToDelete.map(id => new mongoose.Types.ObjectId(id));

      await Promise.all([
        Posts.deleteMany({ _id: { $in: idsToDeleteObjectId } }).session(session),
        Comments.deleteMany({ _id: { $in: commentIdsToDelete } }).session(session),
        Posts.updateMany({}, { $pull: { likes: { $in: idsToDeleteObjectId } } }).session(session),
        Users.updateMany({}, { $pull: { saved: { $in: idsToDeleteObjectId } } }).session(session),
        Users.updateMany(
          {},
          { $pull: { "cart.items": { postId: { $in: idsToDeleteObjectId } } } }
        ).session(session)
      ]);

      await session.commitTransaction();

      res.json({
        success: true,
        deletedPosts: idsToDelete.length,
        deletedComments: commentIdsToDelete.length,
        message: `Limpieza completada: ${idsToDelete.length} posts y ${commentIdsToDelete.length} comentarios eliminados`
      });

    } catch (err) {

      console.error('Error en limpieza de posts huérfanos:');
      console.error(err);
      console.error('Stack Trace:');


      await session.abortTransaction();
      console.error('Error en limpieza de posts huérfanos:', err);
      res.status(500).json({
        success: false,
        error: err.message,
        details: process.env.NODE_ENV === 'development' ? {
          stack: err.stack,
          fullError: JSON.stringify(err, Object.getOwnPropertyNames(err))
        } : undefined
      });
    } finally {
      session.endSession();
    }
  }





}


module.exports = userCtrl