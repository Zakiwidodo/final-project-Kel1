// frontend/src/services/api.js
// Client API service untuk komunikasi dengan Express Backend

import { storage } from '../utils/storage.js';

const API_BASE = window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1')
  ? (window.location.port === '5000' ? '' : 'http://localhost:5000')
  : '';

/**
 * Universal fetch wrapper dengan auth headers dan error handling
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Attach JWT jika login
  const token = storage.getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Attach anon token jika sesi anonim
  const anonToken = storage.getAnonToken();
  if (anonToken && !token) {
    headers['x-anon-token'] = anonToken;
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    const data = await res.json().catch(() => ({ message: res.statusText }));

    if (!res.ok) {
      const errorMsg = data.message || (data.errors ? JSON.stringify(data.errors) : `HTTP Error ${res.status}`);
      const err = new Error(errorMsg);
      err.status = res.status;
      err.data = data;
      throw err;
    }

    return data;
  } catch (err) {
    console.error(`[API Error] ${endpoint}:`, err);
    throw err;
  }
}

export const api = {
  // ==========================================
  // HEALTH CHECK
  // ==========================================
  async checkHealth() {
    return request('/api/health');
  },

  // ==========================================
  // AUTH
  // ==========================================
  async register(email, password) {
    const res = await request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (res.data?.token) {
      storage.setAuth(res.data.token, res.data.user);
    }
    return res;
  },

  async login(email, password) {
    const res = await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (res.data?.token) {
      storage.setAuth(res.data.token, res.data.user);
    }
    return res;
  },

  async getMe() {
    return request('/api/auth/me');
  },

  logout() {
    storage.clearAuth();
    storage.clearAnonSession();
  },

  // ==========================================
  // CHAT
  // ==========================================
  async startAnonymous() {
    const res = await request('/api/chat/anonymous/start', {
      method: 'POST',
    });
    if (res.data) {
      storage.setAnonSession(
        res.data.anon_session_token,
        res.data.session_id,
        res.data.token_remaining
      );
    }
    return res.data;
  },

  async sendMessage(content, sessionId = null, chatHistory = null) {
    const payload = { content };
    if (sessionId) payload.session_id = sessionId;
    if (chatHistory) payload.chat_history = chatHistory;

    return request('/api/chat/message', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // ==========================================
  // SESSIONS & SUMMARIES
  // ==========================================
  async endSession(sessionId, chatHistory = null) {
    const payload = {};
    if (sessionId) payload.session_id = sessionId;
    if (chatHistory) payload.chat_history = chatHistory;

    return request('/api/session/end', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getHistory() {
    return request('/api/session/history');
  },

  async getSession(sessionId) {
    return request(`/api/session/${sessionId}`);
  },

  async getSessionSummary(sessionId) {
    return request(`/api/session/${sessionId}/summary`);
  },

  // ==========================================
  // ADMIN
  // ==========================================
  async getAdminUsers() {
    return request('/api/admin/users');
  },

  async getAdminSessions() {
    return request('/api/admin/sessions');
  },

  async getAdminSessionDetail(sessionId) {
    return request(`/api/admin/session/${sessionId}`);
  },

  async getAdminSummaries() {
    return request('/api/admin/summaries');
  },
};
