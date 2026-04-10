/**
 * utils.js — Helpers de validación, tokens y UI
 * Servicio_auth / SISWORK
 */

const Utils = (() => {

  /* ── Validaciones ──────────────────────────────────────────── */

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }

  function isValidPassword(password) {
    return password.length >= 6;
  }

  /* ── Token (JWT) ───────────────────────────────────────────── */

  function saveToken(token, remember = false) {
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem('siswork_token', token);
  }

  function getToken() {
    return localStorage.getItem('siswork_token')
      || sessionStorage.getItem('siswork_token')
      || null;
  }

  function removeToken() {
    localStorage.removeItem('siswork_token');
    sessionStorage.removeItem('siswork_token');
  }

  function decodeToken(token) {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  }

  function isTokenExpired(token) {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return true;
    return decoded.exp * 1000 < Date.now();
  }

  function isAuthenticated() {
    const token = getToken();
    if (!token) return false;
    if (isTokenExpired(token)) {
      removeToken();
      return false;
    }
    return true;
  }

  /* ── UI helpers ────────────────────────────────────────────── */

  function showError(inputId, errorId, message) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    if (input) input.classList.add('error');
    if (error) error.textContent = message;
  }

  function clearError(inputId, errorId) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    if (input) input.classList.remove('error');
    if (error) error.textContent = '';
  }

  function showAlert(message, type = 'error') {
    const box = document.getElementById('alertBox');
    const msg = document.getElementById('alertMsg');
    if (!box || !msg) return;
    msg.textContent = message;
    box.className = `alert${type === 'success' ? ' success' : ''}`;
    box.hidden = false;
  }

  function hideAlert() {
    const box = document.getElementById('alertBox');
    if (box) box.hidden = true;
  }

  function setLoading(loading) {
    const btn     = document.getElementById('submitBtn');
    const text    = btn?.querySelector('.btn-text');
    const spinner = document.getElementById('btnSpinner');
    if (!btn) return;
    btn.disabled = loading;
    if (text)    text.style.opacity = loading ? '0' : '1';
    if (spinner) spinner.hidden = !loading;
  }

  return {
    isValidEmail,
    isValidPassword,
    saveToken,
    getToken,
    removeToken,
    decodeToken,
    isAuthenticated,
    showError,
    clearError,
    showAlert,
    hideAlert,
    setLoading,
  };
})();