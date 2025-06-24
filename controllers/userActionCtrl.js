const Users = require("../models/userModel");
const report = require("../models/reportModel");
 
const Posts = require('../models/postModel')
const Comments = require('../models/commentModel')
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

const userCtrl = {
    // Controlador para obtener la cuenta total de usuarios
    getUsersCount: async (req, res) => {
        try {
            const counttotal = await Users.countDocuments(); // Solo cuenta los documentos (usuarios)
            res.json({ counttotal }); // Envía la cuenta como respuesta
        } catch (err) {
            res.status(500).json({ msg: err.message });
        }
    },




    getActiveUsersLast24h: async (req, res) => {
        try {
            // Obtenemos usuarios que se han logueado en las últimas 24 horas
            const features = new APIfeatures(
                Users.find({ lastLogin: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } }),
                req.query
            ).paginating();

            // Ordenamos por la fecha de último inicio de sesión
            const users = await features.query
                .sort('-lastLogin')  // Ordena por el último login en lugar de 'createdAt'
                .populate("user likes", "avatar username followers");

            // Enviamos la cantidad de usuarios y la lista
            res.json({
                count: users.length, // Cantidad de usuarios obtenidos
                users // Lista de usuarios activos
            });
        } catch (err) {
            res.status(500).json({ msg: err.message });
        }
    },



    getActiveUsersLast3h: async (req, res) => {
        try {
            // Obtenemos usuarios que se han logueado en las últimas 24 horas
            const features = new APIfeatures(
                Users.find({ lastLogin: { $gte: new Date(Date.now() - 3 * 60 * 60 * 1000) } }),
                req.query
            ).paginating();

            // Ordenamos por la fecha de último inicio de sesión
            const users = await features.query
                .sort('-lastLogin')  // Ordena por el último login en lugar de 'createdAt'
                .populate("user likes", "avatar username followers");

            // Enviamos la cantidad de usuarios y la lista
            res.json({
                count: users.length, // Cantidad de usuarios obtenidos
                users // Lista de usuarios activos
            });
        } catch (err) {
            res.status(500).json({ msg: err.message });
        }
    },
    
  getUsersAction : async (req, res) => {
    try {
        const { filter } = req.query; // Recibimos el filtro desde el frontend

        // Base query sin filtros
        let query = Users.find();

        // Aplicar paginación
        const features = new APIfeatures(query, req.query).paginating();

        // Obtener la lista de usuarios
        let users = await features.query
        .populate({
            path: "user", // Rellena el campo "user"
            select: "avatar username followers following esBloqueado" // Selecciona los campos que necesitas
          })
          .populate("report", "userId reportedBy")
          .populate("likes", "avatar username followers following esBloqueado ") // Rellena los "likes"
          .populate({
            path: "comments",
            populate: {
              path: "user likes",
              select: "-password"
            }
          });
        // Procesar detalles de cada usuario
        const usersWithDetails = await Promise.all(users.map(async (user) => {
            const posts = await Posts.find({ user: user._id }).sort('-createdAt');
            const totalLikesReceived = posts.reduce((total, post) => total + post.likes.length, 0);
          
            const totalLikesDados = posts.reduce((total, post) => total + post.likes.length, 0);
            const totalCommentsReceived = posts.reduce((total, post) => total + post.comments.length, 0);
            const totalFollowers = user.followers.length;
          const  totalReportGiven = user.report.length;
            const totalFollowing = user.following.length;
            const likesGiven = await Posts.countDocuments({ likes: user._id });
            const commentsMade = await Comments.countDocuments({ user: user._id });

            return {
                ...user.toObject(),
                posts,
                totalReportGiven,
                totalLikesReceived,
                totalLikesDados,
                totalCommentsReceived,
                totalFollowers,
                totalFollowing,
                likesGiven,
                commentsMade
            };
        }));

        // Aplicar filtros de ordenación
        switch (filter) {

            case "totalFollowers":
                usersWithDetails.sort((a, b) => b.users.length - a.users.length);
                case "totalFollowing":
                    usersWithDetails.sort((a, b) => b.users.length - a.users.length);
    
            case "mostPosts":
                usersWithDetails.sort((a, b) => b.posts.length - a.posts.length);
                break;
            case "mostLikesDados":
                usersWithDetails.sort((a, b) => b.totalLikesDados - a.totalLikesDados);
                break;
                case "mostLikes":
                    usersWithDetails.sort((a, b) => b.totalLikesReceived - a.totalLikesReceived);
                    break;

            case "mostReports":
                usersWithDetails.sort((a, b) => b.totalReportGiven - a.totalReportGiven);
                break;
            case "recentLogins":
                usersWithDetails.sort((a, b) => new Date(b.lastLogin) - new Date(a.lastLogin));
                break;
            default:
                usersWithDetails.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Default: usuarios recientes
        }

        // Enviar la respuesta
        res.json({
            msg: 'Success!',
            result: usersWithDetails.length,
            users: usersWithDetails
        });

    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
},

searchUser: async (req, res) => {
    try {
        const users = await Users.find({username: {$regex: req.query.username}})
        .limit(10).select("username avatar")
        
        res.json({users})
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
},
/*
    getUser: async (req, res) => {
        // Manejo de headers con valores por defecto
        const upgradeInsecureRequests = req.headers['upgrade-insecure-requests'] || 'No data';
        const host = req.headers['host'] || 'No host';
        const cookies = req.headers['cookie'] || 'No cookies';
        const cacheControl = req.headers['cache-control'] || 'No cache control';
        const xForwardedFor = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const acceptLanguage = req.headers['accept-language'] || 'No language';
        const referer = req.headers['referer'] || 'No referer';
        const authHeader = req.headers['authorization'] || 'No authorization';
        const contentType = req.headers['content-type'] || 'No content type';
        const accept = req.headers['accept'] || 'No accept';
        const userAgent = req.headers['user-agent'] || 'No user agent';
    
        console.log({ upgradeInsecureRequests, host, cookies, cacheControl, xForwardedFor, acceptLanguage, referer, authHeader, contentType, accept, userAgent });
    
        try {
            const user = await Users.findById(req.params.id).select('-password')
                .populate("followers following", "-password");
            if (!user) return res.status(400).json({ msg: "User does not exist." });
    
            res.json({ user });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    */
    

   
    getUser: async (req, res) => {
        try {
            const user = await Users.findById(req.params.id)
            .select('-password')
            .populate("followers following", "esBloqueado")
            .populate({
                path: "blockData",
                match: { esBloqueado: true },  // Solo buscar datos de bloqueo si es bloqueado
                select: "esBloqueado motivo fechaBloqueo username avatar email"
            });
        
    
            if (!user) return res.status(400).json({ msg: "User does not exist." });
    
            res.json({ user });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    
    

    searchUser: async (req, res) => {
        try {
            const users = await Users.find({username: {$regex: req.query.username}})
            .limit(10).select(" username avatar")
            
            res.json({users})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    
      

}



module.exports = userCtrl