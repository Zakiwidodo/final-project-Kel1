// frontend/src/pages/History.js
// Halaman Riwayat Sesi & Refleksi Pengguna (Khusus Pengguna Login)

import { api } from '../services/api.js';
import { storage } from '../utils/storage.js';
import { renderSymptomCard } from '../components/SymptomCard.js';
import { renderChatBubble } from '../components/ChatBubble.js';

export async function renderHistory(container, navigate) {
  if (!storage.isLoggedIn()) {
    navigate('#login');
    return;
  }

  container.innerHTML = `
    <div style="max-width: 1000px; margin: 0 auto; padding: 2rem 1.5rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h1 style="font-size: 1.85rem; color: var(--text-primary); margin-bottom: 0.25rem;">Riwayat Refleksi Kamu</h1>
          <p style="color: var(--text-secondary); font-size: 0.95rem;">Catatan perjalanan dan wawasan dari setiap sesimu</p>
        </div>
        <button class="btn btn-primary" id="btn-new-chat">
          <span>💬</span> Mulai Sesi Baru
        </button>
      </div>

      <div id="history-content-area">
        <div style="text-align: center; padding: 3rem; color: var(--text-muted);">
          Memuat riwayat sesi...
        </div>
      </div>
    </div>
  `;

  const contentArea = container.querySelector('#history-content-area');
  container.querySelector('#btn-new-chat')?.addEventListener('click', () => navigate('#chat'));

  try {
    const res = await api.getHistory();
    const sessions = res.data?.sessions || [];

    if (sessions.length === 0) {
      contentArea.innerHTML = `
        <div class="glass-panel" style="text-align: center; padding: 3.5rem 1.5rem;">
          <div style="font-size: 2.5rem; margin-bottom: 1rem;">📖</div>
          <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem;">Belum Ada Riwayat Sesi</h3>
          <p style="color: var(--text-secondary); max-width: 450px; margin: 0 auto 1.5rem; font-size: 0.92rem;">
            Kamu belum menyelesaikan sesi refleksi apa pun. Mulai sesi pertamamu sekarang untuk melihat analisis mood dan gejala.
          </p>
          <button class="btn btn-primary" id="btn-start-first-session">Mulai Sesi Sekarang</button>
        </div>
      `;
      contentArea.querySelector('#btn-start-first-session')?.addEventListener('click', () => navigate('#chat'));
      return;
    }

    contentArea.innerHTML = `
      <div class="cards-grid">
        ${sessions.map((s) => renderSymptomCard({
          sessionId: s.id,
          userEmail: storage.getUser()?.email,
          startedAt: s.started_at,
          riskLevel: s.risk_level || 'rendah',
          moodSummary: s.mood_summary || 'netral',
          messageCount: s.message_count || 0,
        })).join('')}
      </div>
    `;

    // Global handler untuk view session detail modal
    window.viewSessionDetail = async (sessionId) => {
      const modalRoot = document.getElementById('modal-root');
      modalRoot.innerHTML = `
        <div class="modal-backdrop">
          <div class="modal-card" style="max-width: 750px;">
            <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
              Memuat detail percakapan...
            </div>
          </div>
        </div>
      `;

      try {
        const detailRes = await api.getSession(sessionId);
        const { session, messages, summary } = detailRes.data;

        modalRoot.innerHTML = `
          <div class="modal-backdrop" id="session-detail-modal">
            <div class="modal-card" style="max-width: 750px; display: flex; flex-direction: column; max-height: 85vh;">
              <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-subtle); padding-bottom: 1rem; margin-bottom: 1rem;">
                <div>
                  <h3 style="font-size: 1.25rem;">Detail Sesi Refleksi</h3>
                  <div style="font-size: 0.8rem; color: var(--text-muted);">
                    ${new Date(session.started_at).toLocaleString('id-ID')}
                  </div>
                </div>
                <button class="btn btn-secondary btn-sm" id="btn-close-detail" style="border-radius: 50%; width: 32px; height: 32px; padding: 0;">✕</button>
              </div>

              ${summary ? `
                <div style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.25); border-radius: var(--radius-md); padding: 1rem; margin-bottom: 1rem;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                    <span style="font-size: 0.85rem; font-weight: 600; color: #34d399;">Mood: ${summary.mood_summary || 'netral'}</span>
                    <span class="badge badge-risk-${(summary.risk_level || 'rendah').toLowerCase()}">Risiko: ${summary.risk_level || 'rendah'}</span>
                  </div>
                  <div style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.5;">
                    ${summary.recommendation || '-'}
                  </div>
                </div>
              ` : ''}

              <div style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 0.85rem; padding-right: 0.5rem;">
                ${messages && messages.length > 0 ? messages.map((m) => renderChatBubble(m)).join('') : '<div style="color: var(--text-muted); text-align: center;">Tidak ada pesan</div>'}
              </div>
            </div>
          </div>
        `;

        modalRoot.querySelector('#btn-close-detail')?.addEventListener('click', () => {
          modalRoot.innerHTML = '';
        });
      } catch (err) {
        alert(`Gagal memuat detail sesi: ${err.message}`);
        modalRoot.innerHTML = '';
      }
    };
  } catch (err) {
    contentArea.innerHTML = `
      <div style="color: #f87171; text-align: center; padding: 2rem;">
        Gagal memuat riwayat: ${err.message}
      </div>
    `;
  }
}
