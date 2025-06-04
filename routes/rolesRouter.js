const router = require('express').Router()
 
const roleCtrl = require('../controllers/roleCtrl')
const auth = require("../middleware/auth")
 
  
router.patch('/user/:id/roleusernoidantificado', auth, roleCtrl.UserRoleNoIdentificado);
router.patch('/user/:id/roleuser', auth, roleCtrl.assignUserRole);
router.patch('/user/:id/rolesuperuser', auth, roleCtrl.assignSuperUserRole);
router.patch('/user/:id/rolemoderador', auth, roleCtrl.assignModeratorRole);
router.patch('/user/:id/roleadmin', auth, roleCtrl.assignAdminRole);
 
module.exports = router