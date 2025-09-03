// utils/securityUtils.js
const validator = require('validator');

// Sanitizar input: elimina scripts, etiquetas HTML y caracteres peligrosos
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return validator.escape(input.trim());
};

// Validar email
const isValidEmail = (email) => {
  return validator.isEmail(email);
};

// Prevenir SQL Injection (aunque MongoDB es menos vulnerable, es buena práctica)
const preventNoSQLInjection = (input) => {
  // Elimina caracteres peligrosos para consultas NoSQL
  return input.replace(/\$|\{|\}|\\|\./g, '');
};

module.exports = {
  sanitizeInput,
  isValidEmail,
  preventNoSQLInjection
};