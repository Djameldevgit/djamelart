const Users = require('../models/userModel')

 const langCtrl = {
 
  updateUserLanguageToSpanish: async (req, res) => {
    const language = 'es';
  
    try {
      const result = await Users.updateOne({ _id: req.user._id }, { language });
  
      if (result.modifiedCount === 0) {
        return res.status(404).json({ message: 'No se encontró el usuario o el idioma ya estaba en español' });
      }
  
      res.status(200).json({ message: 'Idioma actualizado a español' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al actualizar el idioma del usuario' });
    }
  },
  
  updateUserLanguageToRussian: async (req, res) => {
    const language = 'ru';
  
    try {
      const result = await Users.updateOne({ _id: req.user._id }, { language });
  
      if (result.modifiedCount === 0) {
        return res.status(404).json({ message: 'No se encontró el usuario o el idioma ya estaba en ruso' });
      }
  
      res.status(200).json({ message: 'Idioma actualizado a ruso' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al actualizar el idioma del usuario' });
    }
  },
  
  updateUserLanguageToKabyle: async (req, res) => {
    const language = 'kab';
  
    try {
      const result = await Users.updateOne({ _id: req.user._id }, { language });
  
      if (result.modifiedCount === 0) {
        return res.status(404).json({ message: 'No se encontró el usuario o el idioma ya estaba en cabilio' });
      }
  
      res.status(200).json({ message: 'Idioma actualizado a cabilio (kabyle)' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al actualizar el idioma del usuario' });
    }
  },
  
 

// Actualiza el idioma del usuario en la base de datos
updateUserLanguage: async (req, res) => {
   
    const { language } = req.body; // obtener el idioma del cuerpo de la solicitud
    try {
      const user = await Users.findByIdAndUpdate({_id : req.user._id});
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      user.language = language; // actualiza el idioma del usuario en la base de datos
      await user.save();
      res.status(200).json({ message: `Idioma actualizado exitosamente a ${language}` });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
},

 
 updateUserLanguageToEnglish : async (req, res) => {
    
    const language = 'en';
  
    try {
      await Users.updateOne({ _id: req.user._id }, { language });
      res.status(200).json({ message: 'Idioma actualizado a inglés' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al actualizar el idioma del usuario' });
    }
    
  },
  
  updateUserLanguageToFrench: async (req, res) => {
    const language = 'fr';

    try {
        console.log('🔹 ID del usuario:', req.user ? req.user._id : 'ID no recibido');
        console.log('🔹 Intentando actualizar idioma a:', language);

        const result = await Users.updateOne({ _id: req.user._id }, { language });

        console.log('🔹 Resultado de la actualización:', result);

        if (result.modifiedCount === 0) {
            console.log('⚠️ No se realizó ninguna modificación.');
            return res.status(404).json({ message: 'Usuario no encontrado o idioma ya en francés' });
        }

        res.status(200).json({ message: 'Idioma actualizado a francés' });
    } catch (error) {
        console.error('❌ Error en el controlador:', error);
        res.status(500).json({ message: 'Error interno en el servidor' });
    }
},


  
 
  // updateUserLanguageToArabic
  updateUserLanguageToArabic: async (req, res) => {
    const language = 'ar';
  
    try {
        const result = await Users.updateOne({ _id: req.user._id }, { language });
  
        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: 'No se encontró el usuario o el idioma ya estaba en árabe' });
        }
  
        res.status(200).json({ message: 'Idioma actualizado a árabe' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar el idioma del usuario' });
    }
  },








 }
 module.exports = langCtrl