
const Posts = require('../models/postModel')
const Report = require('../models/reportModel')
const Users = require('../models/userModel')
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

const reportCtrl = {


  createReport: async (req, res) => {
    try {
      const { postId, userId, reason } = req.body;
      const reportedBy = req.user._id; // Usuario que hace el reporte

      if (!postId || !userId || !reason) {
        return res.status(400).json({ msg: "Todos los campos son obligatorios." });
      }

      const newReport = new Report({
        postId,
        userId, // Usuario reportado
        reportedBy, // Usuario que reportó
        reason,
      });

      await newReport.save();
      res.json({ msg: "Reporte creado correctamente." });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getReports: async (req, res) => {
    try {
      const reports = await Report.find()
        .populate("report", "userId postId reportedBy")
        .exec();

      res.json({ reports, result: reports.length });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  // Obtener los usuarios más reportados
  getMostReportedUsers: async (req, res) => {
    try {
      const mostReportedUsers = await Report.aggregate([
        { $group: { _id: "$userId", count: { $sum: 1 } } }, // Cuenta reportes por usuario
        { $sort: { count: -1 } }, // Ordena por mayor número de reportes
        { $limit: 10 }, // Opcional: obtener los 10 más reportados
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "user",
          },
        }, // Trae datos del usuario
        { $unwind: "$user" }, // Convierte el array en objeto
        {
          $project: {
            _id: 1,
            count: 1,
            "user.username": 1,
            "user.avatar": 1,
          },
        }, // Devuelve solo lo necesario
      ]);

      res.json({ mostReportedUsers });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  // Obtener los usuarios que más reportes han hecho
  getMostActiveReporters: async (req, res) => {
    try {
      const mostActiveReporters = await Report.aggregate([
        { $group: { _id: "$reportedBy", count: { $sum: 1 } } }, // Cuenta reportes hechos por cada usuario
        { $sort: { count: -1 } }, // Ordena por cantidad de reportes hechos
        { $limit: 10 }, // Opcional: obtener los 10 más activos
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "user",
          },
        }, // Obtiene datos del usuario
        { $unwind: "$user" }, // Convierte el array en objeto
        {
          $project: {
            _id: 1,
            count: 1,
            "user.username": 1,
            "user.avatar": 1,
          },
        }, // Devuelve solo lo necesario
      ]);

      res.json({ mostActiveReporters });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = reportCtrl;



