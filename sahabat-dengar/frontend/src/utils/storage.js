// frontend/src/utils/storage.js
// Utility untuk mengelola localStorage (auth) dan sessionStorage (anonim)

const STORAGE_KEYS = {
  AUTH_TOKEN: 'sahabat_dengar_jwt_token',
  USER_DATA: 'sahabat_dengar_user_data',
  ANON_TOKEN: 'sahabat_dengar_anon_token',
  ANON_SESSION_ID: 'sahabat_dengar_anon_session_id',
  ANON_CHAT_HISTORY: 'sahabat_dengar_anon_chat_history',
  ANON_TOKEN_COUNT: 'sahabat_dengar_anon_token_count',
};

export const storage = {
  // ==========================================
  // AUTH STORAGE (localStorage)
  // ==========================================
  setAuth(token, user) {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
  },

  getToken() {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  },

  getUser() {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  clearAuth() {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  },

  isLoggedIn() {
    return !!localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  },

  isAdmin() {
    const user = this.getUser();
    return !!(user && user.is_admin);
  },

  // ==========================================
  // ANONYMOUS CHAT STORAGE (sessionStorage)
  // Sesuai Rule 3: Chat anonim HANYA di memory/sessionStorage
  // ==========================================
  setAnonSession(anonToken, sessionId, initialTokens = 15) {
    sessionStorage.setItem(STORAGE_KEYS.ANON_TOKEN, anonToken);
    sessionStorage.setItem(STORAGE_KEYS.ANON_SESSION_ID, sessionId);
    sessionStorage.setItem(STORAGE_KEYS.ANON_TOKEN_COUNT, initialTokens.toString());
    sessionStorage.setItem(STORAGE_KEYS.ANON_CHAT_HISTORY, JSON.stringify([]));
  },

  getAnonToken() {
    return sessionStorage.getItem(STORAGE_KEYS.ANON_TOKEN);
  },

  getAnonSessionId() {
    return sessionStorage.getItem(STORAGE_KEYS.ANON_SESSION_ID);
  },

  getAnonTokens() {
    const count = sessionStorage.getItem(STORAGE_KEYS.ANON_TOKEN_COUNT);
    return count !== null ? parseInt(count, 10) : null;
  },

  setAnonTokens(count) {
    sessionStorage.setItem(STORAGE_KEYS.ANON_TOKEN_COUNT, count.toString());
  },

  getAnonChatHistory() {
    const raw = sessionStorage.getItem(STORAGE_KEYS.ANON_CHAT_HISTORY);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  appendAnonMessage(role, content) {
    const history = this.getAnonChatHistory();
    history.push({ role, content, timestamp: new Date().toISOString() });
    sessionStorage.setItem(STORAGE_KEYS.ANON_CHAT_HISTORY, JSON.stringify(history));
    return history;
  },

  clearAnonSession() {
    sessionStorage.removeItem(STORAGE_KEYS.ANON_TOKEN);
    sessionStorage.removeItem(STORAGE_KEYS.ANON_SESSION_ID);
    sessionStorage.removeItem(STORAGE_KEYS.ANON_CHAT_HISTORY);
    sessionStorage.removeItem(STORAGE_KEYS.ANON_TOKEN_COUNT);
  },
};
