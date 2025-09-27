const User = require('../models/userModel')
 
const privacyCtrl = {
    getPrivacySettings: async (req, res) => {
        try {
            const user = await User.findById(req.user._id).select('privacySettings');
            res.json(user.privacySettings);
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

 updatePrivacySettings: async (req, res) => {
        try {
            const { privacySettings } = req.body;

            const user = await User.findByIdAndUpdate(req.user._id, {
                privacySettings: {
                    profile: privacySettings.profile || 'public',
                    posts: privacySettings.posts || 'public',
                    followers: privacySettings.followers || 'public',
                    following: privacySettings.following || 'public',
                    likes: privacySettings.likes || 'public',
                    email: privacySettings.email || 'private',
                    address: privacySettings.address || 'private',
                    mobile: privacySettings.mobile || 'private'
                }
            }, { new: true }).select('privacySettings');

            res.json({
                msg: 'Configuración de privacidad actualizada',
                privacySettings: user.privacySettings
            });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }
}

module.exports = privacyCtrl;