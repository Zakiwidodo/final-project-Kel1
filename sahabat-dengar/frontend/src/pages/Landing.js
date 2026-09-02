// frontend/src/pages/Landing.js
// Landing page untuk Sahabat Dengar

import { api } from '../services/api.js';
import { storage } from '../utils/storage.js';

export function renderLanding(container, navigate) {
  const isLoggedIn = storage.isLoggedIn();
  const user = storage.getUser();

  container.innerHTML = `
    <div style="max-width: 1100px; margin: 0 auto; padding: 3rem 1.5rem; display: flex; flex-direction: column; gap: 4rem;">
      <!-- Hero Section -->
      <section style="text-align: center; display: flex; flex-direction: column; align-items: center; gap: 1.5rem; padding: 2rem 0;">
        <div style="display: inline-flex; align-items: center; gap: 8px; background: rgba(16, 185, 129, 0.12); border: 1px solid rgba(16, 185, 129, 0.3); padding: 0.4rem 1rem; border-radius: var(--radius-full); font-size: 0.88rem; color: #34d399; font-weight: 500;">
          <span>🌱</span> Ruang Aman Bercerita Tanpa Penghakiman
        </div>

        <h1 style="font-size: clamp(2.2rem, 5vw, 3.8rem); line-height: 1.15; font-weight: 800; color: var(--text-primary); max-width: 800px;">
          Setiap Perasaanmu Berhak untuk <span style="background: linear-gradient(135deg, #10b981, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Didengar</span>
        </h1>

        <p style="font-size: 1.15rem; color: var(--text-secondary); max-width: 620px; line-height: 1.6;">
          Sahabat Dengar hadir sebagai pendamping kesehatan mental berbasis AI. Luapkan keluh kesah, temukan ketenangan, dan pahami kondisi emosionalmu dalam ruang yang sepenuhnya aman.
        </p>

        <!-- CTA Buttons -->
        <div style="display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; margin-top: 1rem;">
          <button class="btn btn-primary btn-lg" id="btn-start-anon">
            <span>✨</span> Mulai Chat Anonim
          </button>
          ${isLoggedIn ? `
            <button class="btn btn-secondary btn-lg" id="btn-go-chat">
              <span>💬</span> Buka Chat Saya (${user?.email})
            </button>
          ` : `
            <button class="btn btn-secondary btn-lg" id="btn-go-login">
              <span>🔐</span> Masuk / Daftar Akun
            </button>
          `}
        </div>

        <div style="font-size: 0.85rem; color: var(--text-muted); display: flex; gap: 1.5rem; flex-wrap: wrap; justify-content: center;">
          <span>🔒 Bebas & Tanpa Syarat</span>
          <span>⚡ Respons Empatis Instan</span>
          <span>🛡️ 100% Privasi Terjaga</span>
        </div>
      </section>

      <!-- Key Features Grid -->
      <section>
        <div style="text-align: center; margin-bottom: 2.5rem;">
          <h2 style="font-size: 2rem; margin-bottom: 0.5rem;">Mengapa Sahabat Dengar?</h2>
          <p style="color: var(--text-secondary); font-size: 1rem;">Pendekatan empatik yang dirancang khusus untuk kenyamanan emosionalmu.</p>
        </div>

        <div class="cards-grid">
          <div class="glass-panel" style="padding: 1.75rem;">
            <div style="font-size: 2rem; margin-bottom: 1rem;">🤍</div>
            <h3 style="font-size: 1.2rem; margin-bottom: 0.5rem;">Pendengar yang Tulus</h3>
            <p style="color: var(--text-secondary); font-size: 0.92rem;">
              Didesain tidak untuk menghakimi, mendikte, atau menceramahi. Kami merefleksikan emosimu dengan penuh empati.
            </p>
          </div>

          <div class="glass-panel" style="padding: 1.75rem;">
            <div style="font-size: 2rem; margin-bottom: 1rem;">🕶️</div>
            <h3 style="font-size: 1.2rem; margin-bottom: 0.5rem;">Mode Anonim Total</h3>
            <p style="color: var(--text-secondary); font-size: 0.92rem;">
              Ingin bercerita tanpa identitas? Pesan sesi anonim kamu tidak pernah disimpan di database — hanya di browsermu.
            </p>
          </div>

          <div class="glass-panel" style="padding: 1.75rem;">
            <div style="font-size: 2rem; margin-bottom: 1rem;">📊</div>
            <h3 style="font-size: 1.2rem; margin-bottom: 0.5rem;">Refleksi & Ringkasan Sesi</h3>
            <p style="color: var(--text-secondary); font-size: 0.92rem;">
              Di akhir setiap sesi, dapatkan ringkasan hangat, identifikasi suasana hati, serta saran langkah kecil untuk self-care.
            </p>
          </div>
        </div>
      </section>

      <!-- Medical Disclaimer Box -->
      <section style="background: rgba(30, 41, 59, 0.4); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 1.5rem 2rem; text-align: center;">
        <div style="font-weight: 600; color: var(--accent-cyan); margin-bottom: 0.35rem; font-size: 0.95rem;">
          ℹ️ Catatan Penting
        </div>
        <p style="font-size: 0.85rem; color: var(--text-secondary); max-width: 800px; margin: 0 auto; line-height: 1.6;">
          Sahabat Dengar adalah sistem pendukung kesehatan mental berbasis kecerdasan buatan, <strong>bukan pengganti psikiater, psikolog klinis, atau diagnosis medis resmi</strong>. Jika kamu mengalami krisis emosional berat, silakan hubungi tenaga profesional kesehatan mental terdekat.
        </p>
      </section>
    </div>
  `;

  // Bind Events
  const btnAnon = container.querySelector('#btn-start-anon');
  if (btnAnon) {
    btnAnon.addEventListener('click', async () => {
      try {
        btnAnon.disabled = true;
        btnAnon.innerHTML = '<span>⏳</span> Menyiapkan Sesi...';
        await api.startAnonymous();
        navigate('#chat');
      } catch (err) {
        console.error(err);
        // Fallback offline session
        storage.setAnonSession(`anon_local_${Date.now()}`, `sess_${Date.now()}`, 15);
        navigate('#chat');
      }
    });
  }

  const btnGoChat = container.querySelector('#btn-go-chat');
  if (btnGoChat) {
    btnGoChat.addEventListener('click', () => navigate('#chat'));
  }

  const btnGoLogin = container.querySelector('#btn-go-login');
  if (btnGoLogin) {
    btnGoLogin.addEventListener('click', () => navigate('#login'));
  }
}
