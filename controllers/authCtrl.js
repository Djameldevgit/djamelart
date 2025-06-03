const Users = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const authCtrl = {
    register: async (req, res) => {
        try {
            const { username, email, password } = req.body
            let newUserName = username.toLowerCase().replace(/ /g, '')

            const user_name = await Users.findOne({ username: newUserName })
            if (user_name)
                return res.status(400).json({ msg: req.__('auth.username_exists') })

            const user_email = await Users.findOne({ email })
            if (user_email)
                return res.status(400).json({ msg: req.__('auth.email_exists') })

            if (password.length < 6)
                return res.status(400).json({ msg: req.__('auth.password_too_short') })

            const passwordHash = await bcrypt.hash(password, 12)

            const newUser = new Users({
                username: newUserName, email, password: passwordHash
            })

            const access_token = createAccessToken({ id: newUser._id })
            const refresh_token = createRefreshToken({ id: newUser._id })

            res.cookie('refreshtoken', refresh_token, {
                httpOnly: true,
                path: '/api/refresh_token',
                maxAge: 30 * 24 * 60 * 60 * 1000 // 30 días
            })

            await newUser.save()

            res.json({
                msg: req.__('auth.register_success'),
                access_token,
                user: {
                    ...newUser._doc,
                    password: ''
                }
            })
        } catch (err) {
            return res.status(500).json({ msg: req.__('auth.server_error') })
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body

            const user = await Users.findOne({ email })
            if (!user)
                return res.status(400).json({ msg: req.__('auth.email_not_exist') })

            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch)
                return res.status(400).json({ msg: req.__('auth.incorrect_password') })

            const access_token = createAccessToken({ id: user._id })
            const refresh_token = createRefreshToken({ id: user._id })

            res.cookie('refreshtoken', refresh_token, {
                httpOnly: true,
                path: '/api/refresh_token',
                maxAge: 30 * 24 * 60 * 60 * 1000
            })

            res.json({
                msg: req.__('auth.login_success'),
                access_token,
                user: {
                    ...user._doc,
                    password: ''
                }
            })
        } catch (err) {
            return res.status(500).json({ msg: req.__('auth.server_error') })
        }
    },

    logout: async (req, res) => {
        try {
            res.clearCookie('refreshtoken', { path: '/api/refresh_token' })
            return res.json({ msg: req.__('auth.logout_success') })
        } catch (err) {
            return res.status(500).json({ msg: req.__('auth.server_error') })
        }
    },

    generateAccessToken: async (req, res) => {
        try {
            const rf_token = req.cookies.refreshtoken
            if (!rf_token)
                return res.status(400).json({ msg: req.__('auth.login_required') })

            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, async (err, result) => {
                if (err)
                    return res.status(400).json({ msg: req.__('auth.login_required') })

                const user = await Users.findById(result.id).select("-password")
                    .populate('followers following', 'avatar username followers following')

                if (!user)
                    return res.status(400).json({ msg: req.__('auth.user_not_found') })

                const access_token = createAccessToken({ id: result.id })

                res.json({
                    access_token,
                    user
                })
            })
        } catch (err) {
            return res.status(500).json({ msg: req.__('auth.server_error') })
        }
    }
}

const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' })
}

const createRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30d' })
}

module.exports = authCtrl
