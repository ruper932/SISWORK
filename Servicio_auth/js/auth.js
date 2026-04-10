/**
 * auth.js — Lógica del formulario de login
 * Servicio_auth / SISWORK
 *
 * Depende de: utils.js, api.js (cargados antes en el HTML)
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Referencias DOM ───────────────────────────────────────── */
  const form           = document.getElementById('loginForm');
  const emailInput     = document.getElementById('email');
  const passwordInput  = document.getElementById('password');
  const rememberCheck  = document.getElementById('remember');
  const toggleBtn      = document.getElementById('togglePassword');
  const forgotLink     = document.getElementById('forgotLink');

  /* ── Redirigir si ya hay sesión activa ─────────────────────── */
  if (Utils.isAuthenticated()) {
    redirectToDashboard();
  }

  /* ── Toggle visibilidad contraseña ─────────────────────────── */
  toggleBtn.addEventListener('click', () => {
    const visible = passwordInput.type === 'text';
    passwordInput.type = visible ? 'password' : 'text';
    toggleBtn.setAttribute('aria-label', visible ? 'Mostrar contraseña' : 'Ocultar contraseña');
    toggleBtn.querySelector('svg').innerHTML = visible
      ? `<path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" stroke="currentColor" stroke-width="1.4"/>
         <circle cx="10" cy="10" r="2.5" stroke="currentColor" stroke-width="1.4"/>`
      : `<path d="M3 3l14 14M8.5 8.6A3 3 0 0012 13m-3.8-6.4A3 3 0 0110 7c2.8 0 5 1.8 7 3s-1.5 2.6-3 3.5m-8-1c-.8-.6-1.5-1.3-2-2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>`;
  });

  /* ── Limpiar errores al escribir ───────────────────────────── */
  emailInput.addEventListener('input', () => {
    Utils.clearError('email', 'emailError');
    Utils.hideAlert();
  });
  passwordInput.addEventListener('input', () => {
    Utils.clearError('password', 'passwordError');
    Utils.hideAlert();
  });

  /* ── Olvidé mi contraseña ──────────────────────────────────── */
  forgotLink.addEventListener('click', async (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();

    if (!Utils.isValidEmail(email)) {
      Utils.showError('email', 'emailError', 'Ingresa un correo válido para recuperar la contraseña');
      emailInput.focus();
      return;
    }

    try {
      await API.forgotPassword(email);
      Utils.showAlert(`Se envió un enlace de recuperación a ${email}`, 'success');
    } catch (err) {
      Utils.showAlert(err.message || 'No se pudo enviar el correo de recuperación');
    }
  });

  /* ── Submit del formulario ─────────────────────────────────── */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    Utils.hideAlert();

    const email    = emailInput.value.trim();
    const password = passwordInput.value;
    const remember = rememberCheck.checked;

    // Validación del lado del cliente
    let valid = true;

    if (!email) {
      Utils.showError('email', 'emailError', 'El correo es obligatorio');
      valid = false;
    } else if (!Utils.isValidEmail(email)) {
      Utils.showError('email', 'emailError', 'Ingresa un correo válido');
      valid = false;
    }

    if (!password) {
      Utils.showError('password', 'passwordError', 'La contraseña es obligatoria');
      valid = false;
    } else if (!Utils.isValidPassword(password)) {
      Utils.showError('password', 'passwordError', 'La contraseña debe tener al menos 6 caracteres');
      valid = false;
    }

    if (!valid) return;

    // Llamada al API
    Utils.setLoading(true);

    try {
      const data = await API.login(email, password);

      // Guardar token según "recuérdame"
      Utils.saveToken(data.token, remember);

      // Pequeño delay visual para confirmar éxito
      Utils.showAlert('Sesión iniciada correctamente', 'success');
      setTimeout(() => redirectToDashboard(), 800);

    } catch (err) {
      Utils.showAlert(err.message || 'Credenciales incorrectas. Inténtalo de nuevo.');
    } finally {
      Utils.setLoading(false);
    }
  });

  /* ── Redirección al dashboard ──────────────────────────────── */
  function redirectToDashboard() {
    // Ajustar la ruta al dashboard real del proyecto
    window.location.href = '../index.html';
  }

});