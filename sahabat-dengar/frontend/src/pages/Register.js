// frontend/src/pages/Register.js
// Halaman Registrasi Akun Pengguna Baru

import { api } from '../services/api.js';

export function renderRegister(container, navigate) {
  container.innerHTML = `
    <div style="max-width: 440px; margin: 3rem auto; padding: 0 1.25rem; width: 100%;">
      <div class="glass-panel" style="padding: 2.25rem 2rem;">
        <div style="text-align: center; margin-bottom: 2rem;">
          <div class="brand-icon" style="margin: 0 auto 1rem; width: 48px; height: 48px; font-size: 1.5rem;">🌿</div>
          <h1 style="font-size: 1.65rem; color: var(--text-primary); margin-bottom: 0.35rem;">Buat Akun Baru</h1>
          <p style="color: var(--text-secondary); font-size: 0.9rem;">Dapatkan 50 token gratis dan simpan riwayat refleksi</p>
        </div>

        <div id="register-error-alert" style="display: none; background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: var(--radius-md); padding: 0.75rem 1rem; color: #fca5a5; font-size: 0.88rem; margin-bottom: 1.25rem;"></div>

        <form id="register-form">
          <div class="form-group">
            <label class="form-label" for="reg-email">Alamat Email</label>
            <input type="email" id="reg-email" class="form-input" placeholder="nama@email.com" required autocomplete="email">
          </div>

          <div class="form-group">
            <label class="form-label" for="reg-password">Kata Sandi (Min. 6 Karakter)</label>
            <input type="password" id="reg-password" class="form-input" placeholder="••••••••" required minlength="6" autocomplete="new-password">
          </div>

          <div class="form-group">
            <label class="form-label" for="reg-password-confirm">Konfirmasi Kata Sandi</label>
            <input type="password" id="reg-password-confirm" class="form-input" placeholder="••••••••" required minlength="6" autocomplete="new-password">
          </div>

          <button type="submit" class="btn btn-primary" id="btn-submit-register" style="width: 100%; padding: 0.85rem; font-size: 1rem; margin-top: 0.5rem;">
            Daftar & Mulai
          </button>
        </form>

        <div style="text-align: center; margin-top: 1.75rem; font-size: 0.9rem; color: var(--text-secondary);">
          Sudah memiliki akun? <a href="#login" id="link-to-login" style="color: var(--primary); text-decoration: none; font-weight: 600;">Masuk di sini</a>
        </div>
      </div>
    </div>
  `;

  const form = container.querySelector('#register-form');
  const errAlert = container.querySelector('#register-error-alert');
  const btnSubmit = container.querySelector('#btn-submit-register');
  const linkLogin = container.querySelector('#link-to-login');

  linkLogin.addEventListener('click', (e) => {
    e.preventDefault();
    navigate('#login');
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errAlert.style.display = 'none';

    const email = form['reg-email'].value.trim();
    const password = form['reg-password'].value;
    const confirm = form['reg-password-confirm'].value;

    if (password !== confirm) {
      errAlert.innerText = 'Kata sandi dan konfirmasi tidak cocok';
      errAlert.style.display = 'block';
      return;
    }

    btnSubmit.disabled = true;
    btnSubmit.innerText = 'Mendaftarkan...';

    try {
      await api.register(email, password);
      navigate('#chat');
    } catch (err) {
      errAlert.innerText = err.message || 'Gagal mendaftarkan akun';
      errAlert.style.display = 'block';
    } finally {
      btnSubmit.disabled = false;
      btnSubmit.innerText = 'Daftar & Mulai';
    }
  });
}
