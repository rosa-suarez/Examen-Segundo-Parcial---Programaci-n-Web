const express = require("express");
const { login, logout, getProfile, Contacto } = require("../controllers/auth.controller");
const { verifyToken, verifyP, payment } = require("../middleware/auth.middleware");
const { startQuiz, submitAnswers } = require("../controllers/questions.controller");
const { Certificado } = require("../controllers/cert.controller");

const router = express.Router();

// Ruta pública: POST /api/login
router.post("/login", login);

// Rutas protegidas (requieren token)
// POST /api/logout - Cerrar sesión
router.post("/logout", verifyToken, logout);

// GET /api/profile - Obtener perfil del usuario autenticado
router.get("/profile", verifyToken, getProfile);

router.post("/pay", verifyToken, payment);

// POST que envía preguntas
router.post("/exams/start", verifyToken, verifyP, startQuiz);

// POST que recibe y evalúa respuestas
router.post("/exams/submit", verifyToken, submitAnswers);

router.get('/certs/:quizId/pdf', verifyToken, Certificado);

router.post('/contact', Contacto);

module.exports = router;