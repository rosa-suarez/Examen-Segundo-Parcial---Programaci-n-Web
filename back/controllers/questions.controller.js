const QUESTIONS = require("../data/questions");

// Mapa global para conservar las preguntas en diferentes usuarios (se requiere crypto)
const ACTIVE_QUIZZES = new Map();
const RESULTS = new Map();

// --- 1) Enviar preguntas al frontend ===============================================================================
const startQuiz = (req, res) => {
  const crypto = require("crypto");
  console.log("Inician las Preguntas del examen");

  // Barajar una copia y tomar 8 preguntas aleatorias sin repetir (no muta QUESTIONS)
  const shuffled = [...QUESTIONS].sort(() => Math.random() - 0.5);
  const randomQuestions = shuffled.slice(0, 8);

  // Mapear a estructura interna: { displayId: 1..8, origId, text, options, correct }
  const selected = randomQuestions.map((q, idx) => {
    // opcional: mezclar opciones para cada pregunta
    const shuffledOptions = [...(q.options || [])].sort(() => Math.random() - 0.5);
    return {
      displayId: idx + 1,
      origId: q.id,
      text: q.text,
      options: shuffledOptions,
      correct: q.correct
    };
  });

  // Generar id del intento y guardar la versión server-side (incluye correct y origId)
  const quizId = crypto.randomUUID();
  ACTIVE_QUIZZES.set(quizId, selected);

  console.log("Intento existe:", ACTIVE_QUIZZES.has(quizId));
  console.log(quizId);
  // Versión pública: exponer displayId como id y no enviar campo 'correct' ni origId
  const publicQuestions = selected.map(({ displayId, text, options }) => ({
    id: displayId,
    text,
    options

  
  }));

  return res.status(200).json({
    id: quizId,
    message: "Preguntas listas. ¡Éxito!",
    questions: publicQuestions
  });
};

const submitAnswers = (req, res) => {
  //console.log("Respuestas recibidas:", req.body);
  const quizId = req.body.id;

  console.log("Intento recibido:", quizId);
  console.log("Intento existe:", ACTIVE_QUIZZES.has(quizId));

  // respuestas enviadas por el usuario (id = displayId)
  const userAnswers = Array.isArray(req.body.answers) ? req.body.answers : [];

  // recoger nombre completo enviado desde el frontend (opcional)
  const nombreCompleto = req.body?.nombre || null;

  // recuperar cuestionario por quizId
  const stored = ACTIVE_QUIZZES.get(quizId);
  if (!stored) {
    return res.status(400).json({ error: "Quiz no encontrado o expirado" });
  }

  let score = 0;
  const details = [];

  // recorrer preguntas guardadas (usa displayId para comparar con lo enviado)
  for (const q of stored) {
    const user = userAnswers.find(a => {
      // aceptar string/number
      return String(a.id) === String(q.displayId);
    });

    const isCorrect = !!user && user.answer === q.correct;
    if (isCorrect) score++;

    details.push({
      displayId: q.displayId,
      origId: q.origId,
      text: q.text,
      yourAnswer: user ? user.answer : null,
      correctAnswer: q.correct,
      correct: isCorrect
    });
  }
  console.log(score);
  const total = stored.length;
  const passed = score >= 6; // umbral ajustable

  // opcional: persistir resultado en RESULTS o similar
  RESULTS.set(quizId, { score, total, details, userId: req.userId || null, userFullName: nombreCompleto, passed, createdAt: Date.now() });

  // eliminar attempt activo para evitar reintentos
  ACTIVE_QUIZZES.delete(quizId);

  console.log("sali de la funcion");
  return res.status(200).json({
    message: "Respuestas evaluadas.",
    complete:true,
    quizId,
    score,
    total,
    passed,
    details 
  });
};

module.exports = { startQuiz, submitAnswers, ACTIVE_QUIZZES, RESULTS };