const { RESULTS } = require("./questions.controller");
const PDFDocument = require("pdfkit");
const { sessions } = require("../middleware/auth.middleware");
const users = require("../data/users.json");

// hace y envia el certificado ===========================================================
exports.Certificado = (req, res) => {
  // Recuperar el id del quiz
  const quizId = req.params.quizId;
  if (!quizId) return res.status(400).json({ error: "Falta quizId" });
  // obtener token del header y extraer la "cuenta" guardada en sessions
  const token = req.headers.authorization?.split(' ')[1];
  let cuentaEnSession = null;
  if (token) {
    const sessVal = sessions.get(token);
    if (typeof sessVal === 'string') cuentaEnSession = sessVal;
    else if (sessVal && (sessVal.userId || sessVal.cuenta)) {
      cuentaEnSession = sessVal.userId || sessVal.cuenta;
    }
  }
  // Recupero los resultados del quiz de la sesion
  const result = RESULTS.get(quizId);
  if (!result) return res.status(404).json({ error: "Resultado no encontrado" });
 // indico si paso o no
  

  //si reprueba
  if(!result.passed){
    return res.status(200).json({
        message: "Reprobado",
        score: result.score,
        total: result.total,
        details: result.details
    });
  }


  // buscar NombreC en users.json y preparar nombre para el PDF
  const user = users.find(u => u.cuenta === cuentaEnSession);
  const nombreCompleto = user?.NombreC || user?.Nombre || cuentaEnSession || 'Usuario';

   // Crear PDF en horizontal
  const doc = new PDFDocument({ size: 'A4', layout: 'landscape' });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'inline; filename="certificado-demo.pdf"');
  doc.pipe(res);

  // Barras decorativas
  doc.rect(0, 0, doc.page.width, 80).fill('#003366');
  doc.rect(0, doc.page.height - 50, doc.page.width, 80).fill('#003366');

  // Espacio para logo centrado debajo de la barra superior
   const path = require('path');
const logoPath = path.join(__dirname, '..', 'cert', '!bgLogo.png'); // Ajusta si tu logo está en otra ruta

doc.image(logoPath, doc.page.width / 2 - 100, 15, {
  width: 200
});
  // Título principal
doc
  .fontSize(28)
  .fillColor('#000')
  .text('CERTIFICADO DE COMPETENCIA', doc.page.width / 2 - 250, 220, {
    width: 500,
    align: 'center'
  });


// Subtítulo
doc
  .fontSize(16)
  .fillColor('#444')
  .text('Por haber aprobado satisfactoriamente el examen de certificación como:', doc.page.width / 2 - 250, 245, {
    width: 500,
    align: 'center'
  });

// Rol 
doc
  .fontSize(22)
  .fillColor('#d4007f')
  .text('Desarrollador Junior en Python', doc.page.width / 2 - 250, 290, {
    width: 500,
    align: 'center'
  });

// Fecha 
const now = new Date();
const fechaEmitido = now.toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' });

doc
  .fontSize(14)
  .fillColor('#000')
  .text(`Emitido el ${fechaEmitido}`, doc.page.width / 2 - 250, 350, {
    width: 500,
    align: 'center'
  });

// Nombre 
doc
    .fontSize(24)
    .fillColor('#000')
    .text(nombreCompleto, doc.page.width / 2 - 250, 380, {
      width: 500,
      align: 'center'
    });

// Ubicación 
doc
  .fontSize(14)
  .fillColor('#444')
  .text('Aguascalientes, AGS — Aplicado por TechCert México', doc.page.width / 2 - 250, 410, {
    width: 500,
    align: 'center'
  });

// Firmas 
const firmaMaria = path.join(__dirname, '..', 'cert', 'firma1.png');
const firmaCarlos = path.join(__dirname, '..', 'cert', 'firma2.png');

doc.image(firmaMaria, doc.page.width / 2 - 255 + 50, 390, { width: 130 });
doc
  .fontSize(12)
  .fillColor('#000000ff')
  .text('_________________________', doc.page.width / 2 - 250, 460, { width: 200, align: 'center' })
  .text('María López\nInstructor', doc.page.width / 2 - 250, 480, { width: 200, align: 'center' });

doc.image(firmaCarlos, doc.page.width / 2 + 50 + 45, 390, { width: 130 });
doc
  .text('_________________________', doc.page.width / 2 + 50, 460, { width: 200, align: 'center' })
  .text('Carlos Gómez\nCEO TechCert', doc.page.width / 2 + 50, 480, { width: 200, align: 'center' });


  doc.end();
};



