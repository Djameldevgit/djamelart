const Users = require('../models/userModel');
const BlockUser = require('../models/blockModel'); // Importar modelo de bloqueos
class APIfeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    paginating() {
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 9
        const skip = (page - 1) * limit
        this.query = this.query.skip(skip).limit(limit)
        return this;
    }
}

const blockCtrl = {

    blockUser: async (req, res) => {
        try {
            const { motivo, content,fechaLimite ,fechaBloqueo } = req.body;//
            const adminId = req.user._id; // ID del admin que bloquea

            const user = await Users.findById(req.params.id);
            if (!user) return res.status(404).json({ msg: "Usuario no encontrado." });

            if (user.esBloqueado) {
                return res.status(400).json({ msg: "Este usuario ya está bloqueado." });
            }

            // Crear el registro en BlockUser
            const blockedUser = new BlockUser({
                user: req.params.id,
                motivo: motivo || "Sin especificar",
                content: content || "Sin especificar",
                fechaBloqueo: new Date(), // ← Aquí se asigna la fecha actual

                fechaLimite : fechaLimite  || "Sin especificar",
                fechaBloqueo : fechaBloqueo  || "Sin especificar",
                   esBloqueado: true,
                userquibloquea: adminId, // Guardamos quién lo bloqueó

            });

            await blockedUser.save();

            // Actualizar estado en Users
            user.esBloqueado = true;
            await user.save();

            res.json({ msg: "Utilisateur bloqué avec succès." });
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },



    // 🟢 Desbloquear usuario
    unblockUser: async (req, res) => {
        try {
            const user = await Users.findById(req.params.id);
            if (!user) return res.status(404).json({ msg: "Usuario no encontrado." });

            if (!user.esBloqueado) {
                return res.status(400).json({ msg: "Este usuario no está bloqueado." });
            }

            // Eliminar registro de bloqueo
            await BlockUser.findOneAndDelete({ user: req.params.id });

            // Actualizar el estado en Users
            user.esBloqueado = false;
            await user.save();

            res.json({ msg: "l'utilisateur a été débloqué avec succès." });
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },



    getBlockedUsers: async (req, res) => {

        try {
            const features = new APIfeatures(BlockUser.find(), req.query).paginating()
            const blockedUsers = await features.query.sort('-createdAt')

                .where('esBloqueado').equals(true)  // Filtra por usuarios bloqueados
                .sort('-createdAt')
                .populate('user', 'username email')
                .populate('userquibloquea', 'username email');
     

            return res.json({
                success: true,
                result: blockedUsers.length,
                blockedUsers
            });


        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
}

module.exports = blockCtrl;

