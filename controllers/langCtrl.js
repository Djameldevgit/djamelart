const Users = require('../models/userModel');

const langCtrl = {
  updateUserLanguageToSpanish: async (req, res) => {
    const language = 'es';
    await handleLanguageUpdate(req, res, language, 'Idioma actualizado a español');
  },

  updateUserLanguageToRussian: async (req, res) => {
    const language = 'ru';
    await handleLanguageUpdate(req, res, language, 'Idioma actualizado a ruso');
  },

  updateUserLanguageToKabyle: async (req, res) => {
    const language = 'kab';
    await handleLanguageUpdate(req, res, language, 'Idioma actualizado a cabilio (kabyle)');
  },

  updateUserLanguageChino: async (req, res) => {
    const language = 'chino';
    await handleLanguageUpdate(req, res, language, 'Idioma actualizado a chino');
  },

  updateUserLanguageToEnglish: async (req, res) => {
    const language = 'en';
    await handleLanguageUpdate(req, res, language, 'Idioma actualizado a inglés');
  },

  updateUserLanguageToFrench: async (req, res) => {
    const language = 'fr';
    await handleLanguageUpdate(req, res, language, 'Idioma actualizado a francés');
  },

  updateUserLanguageToArabic: async (req, res) => {
    const language = 'ar';
    await handleLanguageUpdate(req, res, language, 'Idioma actualizado a árabe');
  },

  updateUserLanguage: async (req, res) => {
    const { language } = req.body;
    if (!language) return res.status(400).json({ message: 'Idioma no especificado' });

    await handleLanguageUpdate(req, res, language, 'Idioma actualizado');
  },

  setLanguagePublic: async (req, res) => {
    const { language } = req.body;
    if (!language) return res.status(400).json({ message: 'Idioma no especificado' });

    try {
      // Solo guarda la cookie sin tocar la base de datos
      res.cookie('lang', language, {
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 días
        httpOnly: true,
        sameSite: 'strict'
      });

      res.status(200).json({ message: 'Idioma guardado para visitante' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al guardar idioma para visitante' });
    }
  }
};

// 👉 Función compartida para evitar duplicación de lógica
const handleLanguageUpdate = async (req, res, language, successMsg) => {
  try {
    // Guardar cookie para todos los usuarios (autenticados o no)
    res.cookie('lang', language, {
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 días
      httpOnly: true,
      sameSite: 'strict'
    });

    // Si el usuario está autenticado, actualizar en la base de datos
    if (req.user && req.user._id) {
      const result = await Users.updateOne({ _id: req.user._id }, { language });

      if (result.modifiedCount === 0) {
        return res.status(404).json({ message: 'Usuario no encontrado o idioma ya actualizado' });
      }
    }

    return res.status(200).json({ message: successMsg });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error al actualizar el idioma' });
  }
};

module.exports = langCtrl;
