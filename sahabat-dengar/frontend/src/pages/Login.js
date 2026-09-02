// frontend/src/pages/Login.js
// Halaman Login Pengguna & Admin

import { api } from '../services/api.js';

export function renderLogin(container, navigate) {
  container.innerHTML = `
    <div style="max-width: 440px; margin: 3rem auto; padding: 0 1.25rem; width: 100%;">
      <div class="glass-panel" style="padding: 2.25rem 2rem;">
        <div style="text-align: center; margin-bottom: 2rem;">
          <div class="brand-icon" style="margin: 0 auto 1rem; width: 48px; height: 48px; font-size: 1.5rem;">🔐</div>
          <h1 style="font-size: 1.65rem; color: var(--text-primary); margin-bottom: 0.35rem;">Selamat Datang Kembali</h1>
          <p style="color: var(--text-secondary); font-size: 0.9rem;">Masuk ke akun Sahabat Dengar Anda</p>
        </div>

        <div id="login-error-alert" style="display: none; background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: var(--radius-md); padding: 0.75rem 1rem; color: #fca5a5; font-size: 0.88rem; margin-bottom: 1.25rem;"></div>

        <form id="login-form">
          <div class="form-group">
            <label class="form-label" for="login-email">Alamat Email</label>
            <input type="email" id="login-email" class="form-input" placeholder="nama@email.com" required autocomplete="email">
          </div>

          <div class="form-group">
            <label class="form-label" for="login-password">Kata Sandi</label>
            <input type="password" id="login-password" class="form-input" placeholder="••••••••" required autocomplete="current-password">
          </div>

          <button type="submit" class="btn btn-primary" id="btn-submit-login" style="width: 100%; padding: 0.85rem; font-size: 1rem; margin-top: 0.5rem;">
            Masuk ke Akun
          </button>
        </form>

        <div style="text-align: center; margin-top: 1.75rem; font-size: 0.9rem; color: var(--text-secondary);">
          Belum punya akun? <a href="#register" id="link-to-register" style="color: var(--primary); text-decoration: none; font-weight: 600;">Daftar Sekarang</a>
        </div>
      </div>
    </div>
  `;

  const form = container.querySelector('#login-form');
  const errAlert = container.querySelector('#login-error-alert');
  const btnSubmit = container.querySelector('#btn-submit-login');
  const linkRegister = container.querySelector('#link-to-register');

  linkRegister.addEventListener('click', (e) => {
    e.preventDefault();
    navigate('#register');
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errAlert.style.display = 'none';

    const email = form['login-email'].value.trim();
    const password = form['login-password'].value;

    if (!email || !password) return;

    btnSubmit.disabled = true;
    btnSubmit.innerText = 'Memverifikasi...';

    try {
      const res = await api.login(email, password);
      const user = res.data?.user;

      if (user?.is_admin) {
        navigate('#admin');
      } else {
        navigate('#chat');
      }
    } catch (err) {
      errAlert.innerText = err.message || 'Email atau password salah';
      errAlert.style.display = 'block';
    } finally {
      btnSubmit.disabled = false;
      btnSubmit.innerText = 'Masuk ke Akun';
    }
  });
}
