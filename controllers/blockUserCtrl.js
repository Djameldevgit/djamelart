const Users = require('../models/userModel');
const BlockUser = require('../models/blockModel');

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
            const { motivo, content, fechaLimite } = req.body;
            const adminId = req.user._id;
    
            const user = await Users.findById(req.params.id);
            if (!user) return res.status(404).json({ msg: req.__('block.user_not_found') });
    
            if (user.esBloqueado) {
                return res.status(400).json({ msg: req.__('block.already_blocked') });
            }
    
            const blockedUser = new BlockUser({
                user: req.params.id,
                motivo: motivo || req.__('block.default_reason'),
                content: content || req.__('block.default_content'),
                fechaLimite: fechaLimite || req.__('block.default_date'),
                esBloqueado: true,
                userquibloquea: adminId
            });
    
            await blockedUser.save();
    
            user.esBloqueado = true;
            await user.save();
    
            res.json({ msg: req.__('block.block_success') });
        } catch (err) {
            return res.status(500).json({ msg: req.__('block.server_error') });
        }
    },

    unblockUser: async (req, res) => {
        try {
            const user = await Users.findById(req.params.id);
            if (!user) return res.status(404).json({ msg: req.__('block.user_not_found') });

            if (!user.esBloqueado) {
                return res.status(400).json({ msg: req.__('block.not_blocked') });
            }

            await BlockUser.findOneAndDelete({ user: req.params.id });

            user.esBloqueado = false;
            await user.save();

            res.json({ msg: req.__('block.unblock_success') });
        } catch (err) {
            return res.status(500).json({ msg: req.__('block.server_error') });
        }
    },

    getBlockedUsers: async (req, res) => {
        try {
            const features = new APIfeatures(
                BlockUser.find().where('esBloqueado').equals(true)
                    .sort('-createdAt')
                    .populate('user', 'username email')
                    .populate('userquibloquea', 'username email'),
                req.query
            ).paginating();
    
            const blockedUsers = await features.query;
    
            return res.json({
                success: true,
                result: blockedUsers.length,
                blockedUsers
            });
        } catch (err) {
            return res.status(500).json({ msg: req.__('block.server_error') });
        }
    }
}

module.exports = blockCtrl;