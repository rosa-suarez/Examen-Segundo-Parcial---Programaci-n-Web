// Almacenamiento en memoria de las sesiones activas
// Estructura: { token: userId }
const sessions = new Map();
const datos = require("../data/users.json");

/**
 * Middleware para verificar el token de sesión
 * Espera el token en el header: Authorization: Bearer <token>
 */
exports.verifyToken = (req, res, next) => {
  // Obtener el header Authorization
  const authHeader = req.headers.authorization;
  
  // Verificar que exista y tenga el formato correcto
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      error: 'Token no proporcionado o formato incorrecto',
      formato_esperado: 'Authorization: Bearer <token>' 
    });
  }

  // Extraer el token (remover 'Bearer ')
  const token = authHeader.substring(7);

  // Verificar si el token existe en las sesiones activas
  const userId = sessions.get(token);

  if (!userId) {
    return res.status(401).json({ 
      error: 'Token inválido o expirado' 
    });
  }

  // Agregar la información del usuario al request para uso posterior
  req.userId = userId;
  req.token = token;

  // Continuar con la siguiente función
  next();
};

/**
 * Función para crear una nueva sesión
 * @param {string} userId - ID del usuario
 * @returns {string} token - Token generado
 */
exports.createSession = (userId) => {
  const crypto = require('crypto');
  // Usar crypto.randomUUID cuando esté disponible (Node 14.17+).
  // Si no está disponible, hacer fallback a randomBytes para compatibilidad.
  const token = (typeof crypto.randomUUID === 'function')
    ? crypto.randomUUID()
    : crypto.randomBytes(32).toString('hex');


  sessions.set(token, {userId, paid: false});

  console.log(sessions.get(token));
  return token;

};

/**
 * Función para eliminar una sesión (logout)
 * @param {string} token - Token de la sesión a eliminar
 * @returns {boolean} - True si se eliminó, false si no existía
 */
exports.deleteSession = (token) => {
  return sessions.delete(token);
};

/**
 * Función para obtener todas las sesiones activas (útil para debugging)
 * @returns {number} - Número de sesiones activas
 */
exports.getActiveSessions = () => {
  return sessions.size;
};

/**
 * Función para limpiar todas las sesiones (útil para mantenimiento)
 */
exports.clearAllSessions = () => {
  sessions.clear();
};

// exportar sessions para uso en otros controladores (mínimo cambio)
exports.sessions = sessions;

// verifyP: comprobar paid desde la sesión actual
exports.verifyP = (req, res, next) => {
  const session = req.userSession || sessions.get(req.token);
  if (!session) return res.status(401).json({ error: "Autenticación requerida" });

  console.log("Estado de pago:", session.paid);
  console.log("Token:", req.token);

  if (session.paid) return next();
  return res.status(402).json({ error: "Pago requerido para continuar" });
};


// marcar paid en la sesión actual
exports.payment = (req, res) => {
  const token = req.token;
  // revisa si el token cargo correctamente
  if (!token) return res.status(401).json({ error: "Autenticación fallida" });

  // toma la sesion del token
  const session = sessions.get(token);
  // Revisa si la sesion exite
  if (!session) return res.status(401).json({ error: "Sesión no encontrada" });
  
  // Cambia el estado de la sesion a true de que ya pago
  // Es mejor modificar el jason pero no se si pueda hacer eso
  session.paid = true;

  console.log(sessions.get(token));


  // Se realiza el pago
  return res.json({ ok: true, message: "Pago registrado en sesión" });
};