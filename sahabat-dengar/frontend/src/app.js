// frontend/src/app.js
// Main Single-Page Application (SPA) Router and State Controller

import { storage } from './utils/storage.js';
import { api } from './services/api.js';
import { renderLanding } from './pages/Landing.js';
import { renderChat } from './pages/Chat.js';
import { renderLogin } from './pages/Login.js';
import { renderRegister } from './pages/Register.js';
import { renderHistory } from './pages/History.js';
import { renderAdmin } from './pages/Admin.js';
import { renderEdukasi } from './pages/Edukasi.js';
import { renderTentang } from './pages/Tentang.js';
import { renderBantuan } from './pages/Bantuan.js';
import { renderTokenCounter } from './components/TokenCounter.js';

// Route definition
const routes = {
  '': renderLanding,
  '#': renderLanding,
  '#landing': renderLanding,
  '#chat': renderChat,
  '#login': renderLogin,
  '#register': renderRegister,
  '#history': renderHistory,
  '#admin': renderAdmin,
  '#edukasi': renderEdukasi,
  '#tentang': renderTentang,
  '#bantuan': renderBantuan,
};

const appContainer = document.getElementById('app');
const navLinksContainer = document.getElementById('nav-links-container');

/**
 * Update top navbar based on auth state and current route
 */
function updateNavbar(currentHash) {
  const isLoggedIn = storage.isLoggedIn();
  const user = storage.getUser();
  const isAdmin = storage.isAdmin();
  const isAnon = !isLoggedIn;

  const currentTokens = isAnon
    ? (storage.getAnonTokens() ?? 15)
    : (user?.token_balance ?? 50);

  let navHtml = '';

  // Token indicator jika di halaman chat
  if (currentHash === '#chat') {
    navHtml += `<div>${renderTokenCounter(currentTokens, isAnon)}</div>`;
  }

  if (isLoggedIn) {
    navHtml += `
      <a href="#chat" class="nav-item ${currentHash === '#chat' ? 'active' : ''}">💬 Chat</a>
      <a href="#history" class="nav-item ${currentHash === '#history' ? 'active' : ''}">📖 Riwayat</a>
      <a href="#edukasi" class="nav-item ${currentHash === '#edukasi' ? 'active' : ''}">📚 Edukasi</a>
      ${isAdmin ? `<a href="#admin" class="nav-item ${currentHash === '#admin' ? 'active' : ''}">👑 Admin</a>` : ''}
      <button class="btn btn-secondary btn-sm" id="btn-logout-nav" style="margin-left: 0.5rem;">
        Keluar
      </button>
    `;
  } else {
    navHtml += `
      <a href="#chat" class="nav-item ${currentHash === '#chat' ? 'active' : ''}">💬 Chat</a>
      <a href="#edukasi" class="nav-item ${currentHash === '#edukasi' ? 'active' : ''}">📚 Edukasi</a>
      <a href="#login" class="nav-item ${currentHash === '#login' ? 'active' : ''}">Masuk</a>
      <a href="#register" class="btn btn-primary btn-sm" style="margin-left: 0.5rem;">Daftar</a>
    `;
  }

  navLinksContainer.innerHTML = navHtml;

  // Bind logout
  const btnLogout = document.getElementById('btn-logout-nav');
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      api.logout();
      navigate('#landing');
    });
  }
}

/**
 * Universal navigate function
 */
export function navigate(hash) {
  window.location.hash = hash;
}

/**
 * Main router handler
 */
async function router() {
  const hash = window.location.hash || '#landing';
  const cleanHash = hash.split('?')[0];

  updateNavbar(cleanHash);

  const renderPage = routes[cleanHash] || renderLanding;
  appContainer.innerHTML = '';
  await renderPage(appContainer, navigate);
}

// Router Event Listeners
window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', router);
