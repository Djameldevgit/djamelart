const Users = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const sendMail = require('./sendMail')
const sendCustomEmail = require('./sendCustomEmail')
const { google } = require('googleapis')
const { OAuth2 } = google.auth
const { CLIENT_URL } = process.env
const client = new OAuth2(process.env.MAILING_SERVICE_CLIENT_ID)

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

    sendActivationEmail: async (req, res) => {
        try {
            const user = await Users.findById(req.user._id);
            if (!user)
                return res.status(400).json({ msg: req.__('auth.user_not_found') });

            if (user.isVerified)
                return res.status(400).json({ msg: req.__('auth.already_verified') });

            const activation_token = createActivationToken({ id: user._id });
            const url = `${CLIENT_URL}/user/activate/${activation_token}`;

            // ✅ Pasamos el idioma correctamente desde req:
            await sendMail(user.email, url, req.getLocale());

            res.json({ msg: req.__('auth.activation_email_sent') });
        } catch (err) {
            return res.status(500).json({ msg: req.__('auth.server_error') });
        }
    },



    activationAccount: async (req, res) => {
        try {
            const { activation_token } = req.body;
            const decoded = jwt.verify(activation_token, process.env.ACTIVATION_TOKEN_SECRET);
            const { id } = decoded;

            const user = await Users.findById(id);
            if (!user) return res.status(400).json({ msg: req.__('auth.user_not_found') });

            if (user.isVerified)
                return res.status(400).json({ msg: req.__('auth.already_verified') });

            user.isVerified = true;
            await user.save();

            res.json({ msg: req.__('auth.account_activated') });
        } catch (err) {
            return res.status(500).json({ msg: req.__('auth.server_error') });
        }
    },


    forgotPassword: async (req, res) => {
        try {
            const { email } = req.body;
            const user = await Users.findOne({ email });
            if (!user)
                return res.status(400).json({ msg: req.__('auth.email_not_exist') });

            const access_token = createAccessToken({ id: user._id });
            const url = `${CLIENT_URL}/user/reset/${access_token}`;

            sendMail(email, url, req.getLocale());

            res.json({ msg: req.__('auth.reset_email_sent') });
        } catch (err) {
            return res.status(500).json({ msg: req.__('auth.server_error') });
        }
    },

    resetPassword: async (req, res) => {
        try {
            const { password } = req.body;
            const passwordHash = await bcrypt.hash(password, 12);

            await Users.findOneAndUpdate(
                { _id: req.user.id },
                { password: passwordHash }
            );

            res.json({ msg: req.__('auth.password_changed') });
        } catch (err) {
            return res.status(500).json({ msg: req.__('auth.server_error') });
        }
    },




    sendEmailAdmin: async (req, res) => {
        try {
            const { recipients, subject, message } = req.body

            if (!recipients || !Array.isArray(recipients) || recipients.length === 0)
                return res.status(400).json({ msg: 'No se seleccionaron destinatarios.' })

            const users = await Users.find({ _id: { $in: recipients } })
            const emails = users.map(user => user.email)

            for (const email of emails) {
                await sendCustomEmail(email, subject, message)
            }

            return res.json({ msg: `✅ Correos enviados a ${emails.length} usuarios.` })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
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





    googleLogin: async (req, res) => {
        try {
            const { tokenId } = req.body

            const verify = await client.verifyIdToken({ idToken: tokenId, audience: process.env.MAILING_SERVICE_CLIENT_ID })

            const { email_verified, email, name, picture } = verify.payload

            const password = email + process.env.GOOGLE_SECRET

            const passwordHash = await bcrypt.hash(password, 12)

            if (!email_verified) return res.status(400).json({ msg: "Email verification failed." })

            const user = await Users.findOne({ email })

            if (user) {
                const isMatch = await bcrypt.compare(password, user.password)
                if (!isMatch) return res.status(400).json({ msg: "Password is incorrect." })

                const refresh_token = createRefreshToken({ id: user._id })
                res.cookie('refreshtoken', refresh_token, {
                    httpOnly: true,
                    path: '/user/refresh_token',
                    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
                })

                res.json({ msg: "Login success!" })
            } else {
                const newUser = new Users({
                    name, email, password: passwordHash, avatar: picture
                })

                await newUser.save()

                const refresh_token = createRefreshToken({ id: newUser._id })
                res.cookie('refreshtoken', refresh_token, {
                    httpOnly: true,
                    path: '/user/refresh_token',
                    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
                })

                res.json({ msg: "Login success!" })
            }


        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    facebookLogin: async (req, res) => {
        try {
            const { accessToken, userID } = req.body

            const URL = `https://graph.facebook.com/v2.9/${userID}/?fields=id,name,email,picture&access_token=${accessToken}`

            const data = await fetch(URL).then(res => res.json()).then(res => { return res })

            const { email, name, picture } = data

            const password = email + process.env.FACEBOOK_SECRET

            const passwordHash = await bcrypt.hash(password, 12)

            const user = await Users.findOne({ email })

            if (user) {
                const isMatch = await bcrypt.compare(password, user.password)
                if (!isMatch) return res.status(400).json({ msg: "Password is incorrect." })

                const refresh_token = createRefreshToken({ id: user._id })
                res.cookie('refreshtoken', refresh_token, {
                    httpOnly: true,
                    path: '/user/refresh_token',
                    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
                })

                res.json({ msg: "Login success!" })
            } else {
                const newUser = new Users({
                    name, email, password: passwordHash, avatar: picture.data.url
                })

                await newUser.save()

                const refresh_token = createRefreshToken({ id: newUser._id })
                res.cookie('refreshtoken', refresh_token, {
                    httpOnly: true,
                    path: '/user/refresh_token',
                    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
                })

                res.json({ msg: "Login success!" })
            }


        } catch (err) {
            return res.status(500).json({ msg: err.message })
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
 
const createActivationToken = (payload) => {
    return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, { expiresIn: '5m' })
}
const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' })
}

const createRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30d' })
}

module.exports = authCtrl
