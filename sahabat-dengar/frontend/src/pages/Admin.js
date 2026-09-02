// frontend/src/pages/Admin.js
// Halaman Dashboard Administrator untuk Monitoring Pengguna & Gejala

import { api } from '../services/api.js';
import { storage } from '../utils/storage.js';
import { renderSymptomCard } from '../components/SymptomCard.js';

export async function renderAdmin(container, navigate) {
  if (!storage.isLoggedIn() || !storage.isAdmin()) {
    navigate('#landing');
    return;
  }

  container.innerHTML = `
    <div style="max-width: 1100px; margin: 0 auto; padding: 2rem 1.5rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <div style="display: inline-flex; align-items: center; gap: 6px; background: rgba(99, 102, 241, 0.15); border: 1px solid rgba(99, 102, 241, 0.3); color: #a5b4fc; padding: 0.25rem 0.65rem; border-radius: var(--radius-full); font-size: 0.8rem; font-weight: 600; margin-bottom: 0.5rem;">
            <span>👑</span> Portal Administrator
          </div>
          <h1 style="font-size: 1.85rem; color: var(--text-primary);">Dashboard Analitik & Monitoring</h1>
        </div>

        <!-- Navigation Tabs -->
        <div style="display: flex; gap: 0.5rem; background: var(--bg-tertiary); padding: 0.35rem; border-radius: var(--radius-md);">
          <button class="btn btn-secondary btn-sm active" id="tab-summaries">Gejala & Risiko</button>
          <button class="btn btn-secondary btn-sm" id="tab-sessions">Semua Sesi</button>
          <button class="btn btn-secondary btn-sm" id="tab-users">Pengguna</button>
        </div>
      </div>

      <!-- Tab Content Area -->
      <div id="admin-tab-content">
        <div style="text-align: center; padding: 3rem; color: var(--text-muted);">
          Memuat data admin...
        </div>
      </div>
    </div>
  `;

  const tabContent = container.querySelector('#admin-tab-content');
  const tabSummaries = container.querySelector('#tab-summaries');
  const tabSessions = container.querySelector('#tab-sessions');
  const tabUsers = container.querySelector('#tab-users');

  function setActiveTab(activeBtn) {
    [tabSummaries, tabSessions, tabUsers].forEach((b) => {
      b.classList.remove('btn-primary');
      b.classList.add('btn-secondary');
    });
    activeBtn.classList.remove('btn-secondary');
    activeBtn.classList.add('btn-primary');
  }

  // Tab 1: Summaries
  async function loadSummaries() {
    setActiveTab(tabSummaries);
    tabContent.innerHTML = '<div style="text-align: center; padding: 2rem; color: var(--text-muted);">Memuat analisis gejala...</div>';
    try {
      const res = await api.getAdminSummaries();
      const summaries = res.data?.summaries || [];

      if (summaries.length === 0) {
        tabContent.innerHTML = '<div class="glass-panel" style="padding: 2rem; text-align: center; color: var(--text-secondary);">Belum ada analisis gejala tercatat.</div>';
        return;
      }

      tabContent.innerHTML = `
        <div class="cards-grid">
          ${summaries.map((s) => renderSymptomCard({
            sessionId: s.session_id,
            userEmail: s.user_email || 'Anonim',
            startedAt: s.created_at,
            riskLevel: s.risk_level || 'rendah',
            moodSummary: s.mood_summary || 'netral',
            symptoms: Array.isArray(s.symptoms) ? s.symptoms : (typeof s.symptoms === 'string' ? JSON.parse(s.symptoms) : []),
            recommendation: s.recommendation,
          })).join('')}
        </div>
      `;
    } catch (err) {
      tabContent.innerHTML = `<div style="color: #f87171;">Error: ${err.message}</div>`;
    }
  }

  // Tab 2: Sessions
  async function loadSessions() {
    setActiveTab(tabSessions);
    tabContent.innerHTML = '<div style="text-align: center; padding: 2rem; color: var(--text-muted);">Memuat data sesi...</div>';
    try {
      const res = await api.getAdminSessions();
      const sessions = res.data?.sessions || [];

      if (sessions.length === 0) {
        tabContent.innerHTML = '<div class="glass-panel" style="padding: 2rem; text-align: center; color: var(--text-secondary);">Belum ada sesi tercatat.</div>';
        return;
      }

      tabContent.innerHTML = `
        <div class="glass-panel" style="overflow-x: auto; padding: 1rem;">
          <table class="data-table">
            <thead>
              <tr>
                <th>Pengguna</th>
                <th>Tipe</th>
                <th>Waktu Mulai</th>
                <th>Pesan</th>
                <th>Tingkat Risiko</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${sessions.map((s) => `
                <tr>
                  <td style="font-weight: 500;">${escapeHtml(s.user_email || 'Pengguna Anonim')}</td>
                  <td>${s.is_anonymous ? '<span class="badge" style="background: rgba(255,255,255,0.06);">Anonim</span>' : '<span class="badge" style="background: rgba(16,185,129,0.15); color: #34d399;">Terdaftar</span>'}</td>
                  <td style="font-size: 0.85rem; color: var(--text-muted);">${new Date(s.started_at).toLocaleString('id-ID')}</td>
                  <td>${s.message_count || 0}</td>
                  <td><span class="badge badge-risk-${(s.risk_level || 'rendah').toLowerCase()}">${escapeHtml(s.risk_level || 'rendah')}</span></td>
                  <td>${s.is_active ? '<span style="color: #34d399; font-weight: 600;">Aktif</span>' : '<span style="color: var(--text-muted);">Selesai</span>'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    } catch (err) {
      tabContent.innerHTML = `<div style="color: #f87171;">Error: ${err.message}</div>`;
    }
  }

  // Tab 3: Users
  async function loadUsers() {
    setActiveTab(tabUsers);
    tabContent.innerHTML = '<div style="text-align: center; padding: 2rem; color: var(--text-muted);">Memuat data pengguna...</div>';
    try {
      const res = await api.getAdminUsers();
      const users = res.data?.users || [];

      tabContent.innerHTML = `
        <div class="glass-panel" style="overflow-x: auto; padding: 1rem;">
          <table class="data-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Role</th>
                <th>Saldo Token</th>
                <th>Tanggal Terdaftar</th>
              </tr>
            </thead>
            <tbody>
              ${users.map((u) => `
                <tr>
                  <td style="font-weight: 600;">${escapeHtml(u.email)}</td>
                  <td>${u.is_admin ? '<span class="badge" style="background: rgba(99,102,241,0.2); color: #a5b4fc;">👑 Admin</span>' : '<span class="badge" style="background: rgba(255,255,255,0.05);">User</span>'}</td>
                  <td style="color: #34d399; font-weight: 600;">🪙 ${u.token_balance}</td>
                  <td style="font-size: 0.85rem; color: var(--text-muted);">${new Date(u.created_at).toLocaleDateString('id-ID')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    } catch (err) {
      tabContent.innerHTML = `<div style="color: #f87171;">Error: ${err.message}</div>`;
    }
  }

  tabSummaries.addEventListener('click', loadSummaries);
  tabSessions.addEventListener('click', loadSessions);
  tabUsers.addEventListener('click', loadUsers);

  // Load default tab
  loadSummaries();
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
