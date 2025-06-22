// /cron/cleanUnverifiedUsers.js (por ejemplo)
const cron = require('node-cron');
const Users = require('../models/userModel'); // ajusta la ruta según tu estructura
/*

const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);            // ⏱ Hace 5 minutos
const halfHourAgo = new Date(Date.now() - 30 * 60 * 1000);              // ⏱ Hace 30 minutos
const twentyFiveHoursAgo = new Date(Date.now() - 25 * 60 * 60 * 1000);  // ⏱ Hace 25 horas
const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);    // 📅 Hace 3 días
const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);      // 📅 Hace 1 semana
*/




// ⏱ Ejecutar cada minuto
cron.schedule('* * * * *', async () => {
  console.log('⏰ Ejecutando limpieza automática de usuarios no verificados...');

    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);      // 📅 Hace 1 semana
  try {
    const pendingUsers = await Users.find({
      isVerified: false,
      createdAt: { $lt: oneWeekAgo }
    }).select('email username createdAt');

    if (pendingUsers.length === 0) {
      console.log('⚠️ No hay usuarios pendientes de eliminar.');
      return;
    }

    const result = await Users.deleteMany({
      isVerified: false,
      createdAt: { $lt: oneWeekAgo }
    });

    console.log(`✅ Usuarios eliminados: ${result.deletedCount}`);
    pendingUsers.forEach(user => {
      console.log(`🗑️ - ${user.username} (${user.email}) → creado el ${user.createdAt}`);
    });

  } catch (err) {
    console.error('❌ Error al eliminar usuarios no verificados:', err.message);
  }
});
