const Users = require('../models/userModel');

const langCtrl = {
  updateUserLanguageToSpanish: async (req, res) => {
    const language = 'es';
    await handleLanguageUpdate(req, res, language, req.__('language.updated_spanish'));
  },

  updateUserLanguageToRussian: async (req, res) => {
    const language = 'ru';
    await handleLanguageUpdate(req, res, language, req.__('language.updated_russian'));
  },

  updateUserLanguageToKabyle: async (req, res) => {
    const language = 'kab';
    await handleLanguageUpdate(req, res, language, req.__('language.updated_kabyle'));
  },

  updateUserLanguageChino: async (req, res) => {
    const language = 'chino';
    await handleLanguageUpdate(req, res, language, req.__('language.updated_chinese'));
  },

  updateUserLanguageToEnglish: async (req, res) => {
    const language = 'en';
    await handleLanguageUpdate(req, res, language, req.__('language.updated_english'));
  },

  updateUserLanguageToFrench: async (req, res) => {
    const language = 'fr';
    await handleLanguageUpdate(req, res, language, req.__('language.updated_french'));
  },

  updateUserLanguageToArabic: async (req, res) => {
    const language = 'ar';
    await handleLanguageUpdate(req, res, language, req.__('language.updated_arabic'));
  },

  updateUserLanguage: async (req, res) => {
    const { language } = req.body;
    if (!language) return res.status(400).json({ msg: req.__('language.not_specified') });

    await handleLanguageUpdate(req, res, language, req.__('language.updated'));
  },

  setLanguagePublic: async (req, res) => {
    const { language } = req.body;
    if (!language) return res.status(400).json({ msg: req.__('language.not_specified') });

    try {
      res.cookie('lang', language, {
        maxAge: 1000 * 60 * 60 * 24 * 30,
        httpOnly: true
       
      });

      res.status(200).json({ msg: req.__('language.visitor_saved') });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: req.__('auth.server_error') });
    }
  }
};

// 👉 Función compartida
const handleLanguageUpdate = async (req, res, language, successMsg) => {
  try {
    res.cookie('lang', language, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true
      
    });

    if (req.user && req.user._id) {
      const result = await Users.updateOne({ _id: req.user._id }, { language });

      if (result.modifiedCount === 0) {
        return res.status(404).json({ msg: req.__('language.not_updated') });
      }
    }

    return res.status(200).json({ msg: successMsg });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: req.__('auth.server_error') });
  }
};

module.exports = langCtrl;
