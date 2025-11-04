const API = "http://dns-practice-vpn.duckdns.org:3000/api";
let preguntas = [];

// Variables DOM ajustadas a los nombres del backend
const btnLogin = document.getElementById('loginBtn');
const btnLogout = document.getElementById('logoutBtn');
const modalLogin = document.getElementById('loginModal');
const modalClose = document.getElementById('closeModal');
const formLogin = document.getElementById('formLogin');
const cuentaDisplay = document.getElementById('userName');
// Mostrar resultados
const resultadoSection = document.getElementById("resultado");
const calificacion = document.getElementById("calificacion");
const btnCertificado = document.getElementById("imprimir-certificado");

// Función para verificar sesión usando nombres del backend
function checkSession() {
    const cuenta = localStorage.getItem('cuenta');
    const token = localStorage.getItem('token');
    
    if(cuenta && token) {
        cuentaDisplay.textContent = cuenta;
        cuentaDisplay.classList.remove('hidden');
        btnLogin.classList.add('hidden');
        btnLogout.classList.remove('hidden');
        return true;
    }
    
    cuentaDisplay.textContent = ' ';
    cuentaDisplay.classList.add('hidden');
    btnLogin.classList.remove('hidden');
    btnLogout.classList.add('hidden');
    return false;
}

// Función auxiliar para verificar elementos del DOM
function safeEl(el) {
    return el !== null && el !== undefined;
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Modal
    btnLogin?.addEventListener('click', () => modalLogin.classList.remove('hidden'));
    modalClose?.addEventListener('click', () => modalLogin.classList.add('hidden'));
    
    // Cerrar modal al dar click fuera
    modalLogin?.addEventListener('click', (e) => {
        if (e.target === modalLogin) {
            modalLogin.classList.add('hidden');
        }
    });

    // Login
    if (formLogin) {
        formLogin.addEventListener('submit', async (e) => {
            e.preventDefault();
            const cuentaVal = (document.getElementById('cuenta') || {}).value || '';
            const contrasenaVal = (document.getElementById('contrasena') || {}).value || '';

            if (!cuentaVal || !contrasenaVal) {
                Swal.fire({
                        icon: "warning",
                        title: "Valida Datos",
                        text: "Completa usuario y contraseña"
                    });
                return;
            }

            try {
                const res = await fetch(`${API}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ cuenta: cuentaVal, contrasena: contrasenaVal })
                });

                // leer texto crudo y tratar de parsear JSON (más robusto)
                const text = await res.text();
                let data = {};
                try { data = text ? JSON.parse(text) : {}; } catch (e) { data = {}; }

                // Si la respuesta no es OK o falta token -> mostrar alerta y salir
                if (!res.ok || !data.token) {
                    const serverMsg = data.error || data.message || data.msg || "Credenciales inválidas";
                    await Swal.fire({
                        icon: "warning",
                        title: "Valida Datos",
                        text: serverMsg
                    });
                    return;
                }

                Swal.fire({ 
                    title: "Acceso permitido ",
                    icon: "success",
                    draggable: true
                });
                // Login correcto
                localStorage.setItem('token', data.token);
                localStorage.setItem('cuenta', data.usuario?.cuenta || cuentaVal);
                const nombreCompletoFromLogin = data.usuario?.NombreC || data.usuario?.Nombre || null;
                if (nombreCompletoFromLogin) {
                    localStorage.setItem('NombreC', nombreCompletoFromLogin);
                } else {
                    try { await fetchProfile().catch(()=>{}); } catch(e) {}
                }
                localStorage.setItem('complete', 'false');
                if (typeof checkSession === 'function') checkSession();
                modalLogin?.classList.add('hidden');
                formLogin.reset();
             } catch (err) {
                 console.error('Login error:', err);
                 Swal.fire({
                     icon: "warning",
                     title: "Error de servidor",
                     text: "Error de conexión con el servidor"
                 });
             }
        });
    }

    // Logout
    btnLogout?.addEventListener('click', async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                localStorage.clear();
                checkSession();
                return;
            }

            const res = await fetch(`${API}/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!res.ok) {
                console.error('Error en logout:', await res.text());
            }
        } catch (err) {
            console.error('Error en logout:', err);
        } finally {
            localStorage.clear();
            checkSession();
        }
    });

    // Python modal elements
    const pythonModal = document.getElementById('pythonModal');
    const closePythonModal = document.getElementById('closePythonModal');
    const payButton = document.getElementById('payButton');
    const startExamButton = document.getElementById('startExamButton');

    // Mostrar modal al hacer click en la card de Python
    // Seleccionamos todas las tarjetas dentro del contenedor .cards
    const allCards = document.querySelectorAll(".cards .card");

    // Mostrar modal al hacer click en la card de Python
    allCards.forEach((card) => {
    card.addEventListener("click", (e) => {
      e.preventDefault();

      // Si la tarjeta está deshabilitada
      if (card.classList.contains("disabled")) {
        const mensaje =
          card.querySelector("p")?.textContent ||
          "Esta certificación estará disponible pronto.";
        Swal.fire({
                    icon: "warning",
                    title: "Error de servidor",
                    text: `${mensaje}`
                });
        return;
      }

      // Si no está deshabilitada, primero revisamos sesión
      if (!checkSession()) {
        alert("Por favor inicia sesión primero");
        modalLogin.classList.remove("hidden");
        return;
      }

      // Mostrar sección correspondiente según la certificación
      const certName = card.querySelector("h3").textContent;

      if (certName === "Python") {
        document.getElementById("pythonDetails").classList.remove("hidden");
        document
          .getElementById("pythonDetails")
          .scrollIntoView({ behavior: "smooth" });
      }
    });
  });

    // Cerrar modal de Python
    closePythonModal?.addEventListener('click', () => {
        pythonModal.classList.add('hidden');
    });

    // Manejar el pago
    payButton?.addEventListener('click', async () => {
        const complete = localStorage.getItem('complete') === 'true';
        if (complete) {
            Swal.fire({
                icon: "warning",
                title: "Intento realizado",
                text: "Ya completaste el examen. No puedes volver a pagar."
            });
            return;
        }
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const res = await fetch(`${API}/pay`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (res.ok) {
                const startBtn = document.querySelector('#startExamButton');
                if (!startBtn.disabled) {
                    Swal.fire({
                        icon: "warning",
                        title: "Pago realizado",
                        text: "No puedes volver a pagar."
                    });
                    return
                }
                Swal.fire({
                    icon: "success",
                    title: "Pago correcto",
                    text: 'Pago procesado correctamente'
                });
                // Modificar estos selectores para que coincidan con los botones en la sección visible
                const payBtn = document.querySelector('#payButton');
            
                if (startBtn) {
                    startBtn.disabled = false;
                    startBtn.style.opacity = '1'; // Opcional: hacer más visible el botón
                    startBtn.style.cursor = 'pointer';
                }
            } else {
                Swal.fire({
                    icon: "warning",
                    title: "Error de pago",
                    text: 'Error al procesar el pago'
                });
            }
        } catch (err) {
            console.error('Error:', err);
            Swal.fire({
                icon: "warning",
                title: "Error de conexión",
                text: 'Imposible conectarse con el servidor'
            });
        }
    });

    // Iniciar examen
    startExamButton?.addEventListener('click', async () => {
        const complete = localStorage.getItem('complete') === 'true';
        if (complete) {
            Swal.fire({
                icon: "warning",
                title: "Intento realizado",
                text: `Ya completaste el examen. No puedes volver a iniciarlo.`
            });
            return;
        }

        document.getElementById('pythonDetails').classList.add('hidden');
        document.getElementById('inicio').classList.add('hidden');
        document.getElementById('examen').classList.remove('hidden');


 // ---- MÍNIMO: asegurar NombreC (fallback) y mostrar en .nombre-intento ----
  if (!localStorage.getItem('NombreC') && localStorage.getItem('token')) {
    await fetchProfile().catch(()=>{});
  }
  const nombre = localStorage.getItem('NombreC') || localStorage.getItem('cuenta') || '';
  const nombreEl = document.querySelector('.nombre-intento');
  if (nombreEl) {
    const ahora = new Date();
    const fechaHora = ahora.toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' });
    nombreEl.innerHTML = `${nombre ? `<strong>${nombre}</strong><br>` : ''}<small>${fechaHora} — Duración: 30 min</small>`;
  }

        // revisar preguntas       
        const { form, preguntas} = await cargarPreguntas() || {};
        if (form) {
            form.addEventListener('submit', async (e) => {
                 e.preventDefault();
                const token = localStorage.getItem("token"); // Obtener token
                if (!token) {
                    Swal.fire({
                        icon: "warning",
                        title: "Sesión expirada",
                        text: "Debes iniciar sesión nuevamente"
                    });
                    return;
                }
                
                const quizId = localStorage.getItem("quizId");
                if(!quizId)
                    return;

                const answers = preguntas.map(q => {
                    const selected = document.querySelector(`input[name="q_${q.id}"]:checked`);
                        return {
                            id: q.id,
                            answer: selected ? selected.value : null
                        };
                });


                const res = await fetch(`${API}/exams/submit`, {
                method: "POST",
                headers: { "Content-Type": "application/json",  "Authorization": `Bearer ${token}`},
                body: JSON.stringify({ id: quizId,answers })
                });

                const data = await res.json();
                localStorage.setItem('complete', 'true');//-------------

                const examContainer = document.querySelector(".exam-container");
                if (examContainer){
                    examContainer.innerHTML = "";
                    document.getElementById('examen').classList.add('hidden'); 
                    document.getElementById('inicio').classList.remove('hidden');
                }

                // Condicional aprobado
                if (data.passed === true) { // Si incluye la palabra "Aprobado"
                Swal.fire({
                    icon: "success",
                    title: "¡Felicidades!",
                    text: `Aprobaste con ${data.score} de ${data.total}`
                });
                // Mostrar sección de resultados
                document.getElementById("resultado").classList.remove("hidden");

                // Mostrar calificación
                document.getElementById("calificacion").textContent = `Tu calificación: ${data.score} de ${data.total}`;

                // Mostrar botón para descargar certificado
                const btn = document.getElementById("btnCert");
                btn.style.display = "inline-block"; // Se muestra el btn
                btn.onclick = function () {
                    const token = localStorage.getItem("token"); // Obtener token
                    if (!token) {
                        Swal.fire({
                            icon: "warning",
                            title: "Sesión expirada",
                            text: "Debes iniciar sesión nuevamente"
                        });
                        return;
                    }
                    // Si se presiona el boton devuelve el pdf
                    fetch(`${API}/certs/${data.quizId}/pdf`, {
                        method: 'GET',headers: {Authorization: `Bearer ${token}`}})
                    .then(res => {
                        if (!res.ok) throw new Error('No se pudo generar el certificado');
                        return res.blob();
                    })
                    .then(blob => {
                        const url = URL.createObjectURL(blob);
                        window.open(url, '_blank');
                    })
                    .catch(err => {
                        console.error('Error al generar el certificado:', err);
                        Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'No se pudo generar el certificado.'
                        });
                    });
                };
                }else{
                mostrarRecuadroReprobado(data.score, data.total);
                }
            });
        }
    });

    // Check inicial
    checkSession();

  // función mínima para obtener NombreC desde /api/profile y guardarlo
  async function fetchProfile() {
  const token = localStorage.getItem('token');
  const cuenta = localStorage.getItem('cuenta') || '';
  if (!token) {
    if (cuenta) localStorage.setItem('NombreC', cuenta);
    return;
  }
  try {
    const res = await fetch(`${API}/profile`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json().catch(()=>({}));
      if (data?.usuario?.NombreC) {
        localStorage.setItem('NombreC', data.usuario.NombreC);
        return;
      }
      if (data?.usuario?.cuenta) {
        localStorage.setItem('NombreC', data.usuario.cuenta);
        return;
      }
    }
    // fallback si no devuelve nombre (404, 401, etc.)
    if (cuenta) localStorage.setItem('NombreC', cuenta);
  } catch (err) {
    console.warn('No se pudo recuperar profile', err);
    if (cuenta) localStorage.setItem('NombreC', cuenta);
  }
}

});

// Función para cargar preguntas
async function cargarPreguntas() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            Swal.fire({
                icon: "warning",
                title: "Error de sesion",
                text: `Por favor inicia sesión primero`
            });
            return;
        }

        const res = await fetch(`${API}/exams/start`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await res.json();
        
        if (!res.ok) {
            throw new Error(data.error || 'Error al cargar preguntas');
        }

        const quizId = data.id;
            if(!quizId) return;
        localStorage.setItem("quizId", quizId); // ✅ guardar para uso posterior

        preguntas = data.questions || [];

        // Obtener el contenedor de preguntas
        const examContainer = document.querySelector('.exam-container');
        if (!examContainer) return;

        // Crear el formulario de preguntas
        examContainer.innerHTML = `
            <form id="quizForm">
                <div id="listaPreguntas"></div>
                <button type="submit" class="btn-primary">Enviar respuestas</button>
            </form>
        `;

        const listaPreguntas = document.getElementById('listaPreguntas');
        if (!listaPreguntas) return;

        // Mostrar las preguntas
        preguntas.forEach((q, index) => {
            const div = document.createElement("div");
            div.className = "question-card";
            div.innerHTML = `
                <p><strong>${index + 1}.</strong> ${q.text}</p>
                ${(q.options || [])
                    .map(opt => `
                        <label>
                            <input type="radio" name="q_${q.id}" value="${opt}"> ${opt}
                        </label><br>
                    `).join("")
                }
            `;
            listaPreguntas.appendChild(div);
        });

        return { form: quizForm, preguntas};

    } catch (err) {
        console.error("Error al cargar preguntas:", err);
        Swal.fire({
                icon: "warning",
                title: "Error de sesion",
                text: `${err.message} No se pudieron cargar las preguntas. Revisa el servidor.`
            });
    }
}


// mostrar reprobado
function mostrarRecuadroReprobado(score, total) {
  const modal2 = document.getElementById("failModal");
  const msg = document.getElementById("failMsg");

  msg.innerHTML = `
    <h2>Lo sentimos, no aprobaste</h2>
    <p>Obtuviste <strong>${score}</strong> de <strong>${total}</strong>.</p>
    <p>Inténtalo de nuevo cuando estés listo.</p>
  `;

  modal2.classList.remove("hidden");

  // Cierre al hacer clic fuera del contenido
  modal2.onclick = (e) => {
    if (e.target === modal2) {
      modal2.classList.add("hidden");
    }
  };
}

// Agregar manejo del formulario de contacto (envío al servidor)
const contactForm = document.querySelector(".formulario");
if (contactForm) {
  contactForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const name = (document.getElementById('name') || {}).value || '';
    const email = (document.getElementById('email') || {}).value || '';
    const tel = (document.getElementById('tel') || {}).value || '';
    const mensaje = (document.getElementById('mensaje') || {}).value || '';

    try {
      const res = await fetch(`${API}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, tel, mensaje })
      });

      if (res.ok) {
        if (typeof alertify !== 'undefined' && alertify && typeof alertify.success === 'function') {
          alertify.success("¡Mensaje enviado con éxito!");
        } else {
          alert("¡Mensaje enviado con éxito!");
        }
        contactForm.reset();
      } else {
        throw new Error('Error al enviar el mensaje');
      }
    } catch (err) {
      console.error('Error enviando contacto:', err);
      alert('No se pudo enviar el mensaje. Intenta más tarde.');
    }
  });
}
