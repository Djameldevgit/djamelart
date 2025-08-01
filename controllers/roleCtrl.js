const Users = require("../models/userModel");

const roleCtrl = {
    UserRoleNoIdentificado: async (req, res) => {
        const { role } = req.body;
        try {
            const user = await Users.findByIdAndUpdate(req.params.id, { role }, { new: true });
            if (!user) return res.status(404).json({ msg: req.__('role.user_not_found') });

            res.json({ msg: req.__('role.role_assigned') });
        } catch (error) {
            res.status(500).json({ msg: req.__('role.update_error') });
        }
    },

    assignUserRole: async (req, res) => {
        const { role } = req.body;
        try {
            const user = await Users.findByIdAndUpdate(req.params.id, { role }, { new: true });
            if (!user) return res.status(404).json({ msg: req.__('role.user_not_found') });

            res.json({ msg: req.__('role.role_assigned') });
        } catch (error) {
            res.status(500).json({ msg: req.__('role.update_error') });
        }
    },

    assignSuperUserRole: async (req, res) => {
        const { role } = req.body;
        try {
            const user = await Users.findByIdAndUpdate(req.params.id, { role }, { new: true });
            if (!user) return res.status(404).json({ msg: req.__('role.user_not_found') });

            res.json({ msg: req.__('role.superuser_assigned') });
        } catch (error) {
            res.status(500).json({ msg: req.__('role.update_error') });
        }
    },

    assignModeratorRole: async (req, res) => {
        const { role } = req.body;
        try {
            const user = await Users.findByIdAndUpdate(req.params.id, { role }, { new: true });
            if (!user) return res.status(404).json({ msg: req.__('role.user_not_found') });

            res.json({ msg: req.__('role.moderator_assigned') });
        } catch (error) {
            res.status(500).json({ msg: req.__('role.update_error') });
        }
    },

    assignAdminRole: async (req, res) => {
        const { role } = req.body;
        try {
            const user = await Users.findByIdAndUpdate(req.params.id, { role }, { new: true });
            if (!user) return res.status(404).json({ msg: req.__('role.user_not_found') });

            res.json({ msg: req.__('role.admin_assigned') });
        } catch (error) {
            res.status(500).json({ msg: req.__('role.update_error') });
        }
    }
};

module.exports = roleCtrl;