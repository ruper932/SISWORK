/**
 * api.js — Capa de comunicación con el microservicio de auth
 * Servicio_auth / SISWORK
 *
 * Cambia BASE_URL al endpoint real del backend cuando esté disponible.
 */

const API = (() => {

  /* ── Configuración ─────────────────────────────────────────── */
  const BASE_URL = 'http://localhost:3001/api/auth'; // ← ajustar al puerto real

  const DEFAULT_HEADERS = {
    'Content-Type': 'application/json',
  };

  /* ── Request helper ────────────────────────────────────────── */
  async function request(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;
    const token = Utils.getToken();

    const headers = { ...DEFAULT_HEADERS, ...options.headers };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const config = {
      ...options,
      headers,
    };

    const response = await fetch(url, config);

    // Intenta parsear JSON siempre
    let data;
    try {
      data = await response.json();
    } catch {
      data = { message: 'Error de servidor' };
    }

    if (!response.ok) {
      // Lanza el mensaje del servidor si existe
      throw new Error(data.message || `Error ${response.status}`);
    }

    return data;
  }

  /* ── Endpoints de autenticación ────────────────────────────── */

  /**
   * POST /login
   * @param {string} email
   * @param {string} password
   * @returns {{ token: string, user: object }}
   */
  async function login(email, password) {
    return request('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  /**
   * POST /register
   * @param {object} userData - { name, email, password }
   * @returns {{ token: string, user: object }}
   */
  async function register(userData) {
    return request('/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  /**
   * POST /logout
   */
  async function logout() {
    try {
      await request('/logout', { method: 'POST' });
    } finally {
      Utils.removeToken();
    }
  }

  /**
   * POST /refresh-token
   * @returns {{ token: string }}
   */
  async function refreshToken() {
    return request('/refresh-token', { method: 'POST' });
  }

  /**
   * POST /forgot-password
   * @param {string} email
   */
  async function forgotPassword(email) {
    return request('/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  /**
   * GET /me — obtener perfil del usuario autenticado
   */
  async function getMe() {
    return request('/me', { method: 'GET' });
  }

  return {
    login,
    register,
    logout,
    refreshToken,
    forgotPassword,
    getMe,
  };
})();