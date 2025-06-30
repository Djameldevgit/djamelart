const router = require('express').Router();
const langCtrl = require('../controllers/langCtrl');

// Ruta pública (sin autenticación) para visitantes
router.put('/language/public', langCtrl.setLanguagePublic);

// Rutas para usuarios autenticados o no (guardan cookie + DB si autenticado)
router.put('/language', langCtrl.updateUserLanguage);

router.put('/language/ingles', langCtrl.updateUserLanguageToEnglish);
router.put('/language/frances', langCtrl.updateUserLanguageToFrench);
router.put('/language/arabe', langCtrl.updateUserLanguageToArabic);

router.put('/language/espanol', langCtrl.updateUserLanguageToSpanish);
router.put('/language/ruso', langCtrl.updateUserLanguageToRussian);
router.put('/language/kabyle', langCtrl.updateUserLanguageToKabyle);
router.put('/language/chino', langCtrl.updateUserLanguageChino);

module.exports = router;
