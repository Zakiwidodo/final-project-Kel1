// frontend/src/pages/Chat.js
// Halaman percakapan utama (mendukung mode anonim & login)

import { api } from '../services/api.js';
import { storage } from '../utils/storage.js';
import { renderChatBubble, renderTypingIndicator } from '../components/ChatBubble.js';
import { renderTokenCounter } from '../components/TokenCounter.js';
import { renderSessionSummaryModal } from '../components/SessionSummaryModal.js';

export function renderChat(container, navigate) {
  const isLoggedIn = storage.isLoggedIn();
  const user = storage.getUser();
  const isAnon = !isLoggedIn;

  // State
  let currentSessionId = isAnon ? storage.getAnonSessionId() : null;
  let currentTokens = isAnon ? (storage.getAnonTokens() ?? 15) : (user?.token_balance ?? 50);
  let messages = isAnon ? storage.getAnonChatHistory() : [];
  let isSending = false;

  // Jika anonim belum punya session token, inisialisasi
  if (isAnon && !storage.getAnonToken()) {
    storage.setAnonSession(`anon_${Date.now()}`, `sess_${Date.now()}`, 15);
    currentTokens = 15;
  }

  // Pesan sambutan default jika belum ada chat
  if (messages.length === 0) {
    messages.push({
      role: 'assistant',
      content: 'Halo, aku Sahabat Dengar 🌿. Aku di sini untuk mendengarkan apa pun yang sedang kamu rasakan atau pikirkan tanpa penghakiman. Apa yang ingin kamu ceritakan hari ini?',
      timestamp: new Date().toISOString(),
    });
    if (isAnon) {
      storage.appendAnonMessage(messages[0].role, messages[0].content);
    }
  }

  container.innerHTML = `
    <div class="chat-page">
      <!-- Chat Header Bar -->
      <div class="glass-panel" style="padding: 0.85rem 1.25rem; display: flex; justify-content: space-between; align-items: center; border-radius: var(--radius-lg); margin-bottom: 0.75rem;">
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <div class="avatar avatar-ai" style="width: 38px; height: 38px;">🧠</div>
          <div>
            <div style="font-weight: 700; font-size: 0.95rem; color: var(--text-primary); display: flex; align-items: center; gap: 6px;">
              Sahabat Dengar
              <span style="width: 8px; height: 8px; background: var(--primary); border-radius: 50%; display: inline-block;"></span>
            </div>
            <div style="font-size: 0.78rem; color: var(--text-muted);">
              ${isLoggedIn ? `Sesi Akun (${escapeHtml(user?.email)})` : 'Sesi Anonim (Tidak disimpan ke DB)'}
            </div>
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <div id="chat-token-counter">
            ${renderTokenCounter(currentTokens, isAnon)}
          </div>
          <button class="btn btn-danger btn-sm" id="btn-end-session">
            <span>🛑</span> Akhiri Sesi
          </button>
        </div>
      </div>

      <!-- Messages Stream Area -->
      <div class="glass-panel" style="flex: 1; display: flex; flex-direction: column; overflow: hidden; padding: 0.5rem 1rem;">
        <div class="chat-messages-container" id="chat-messages-stream">
          ${messages.map((m) => renderChatBubble(m)).join('')}
        </div>

        <!-- Input Bar -->
        <div class="chat-input-area">
          <div class="input-box-wrapper">
            <textarea
              id="chat-input"
              class="chat-textarea"
              placeholder="Ceritakan apa yang kamu rasakan... (Tekan Enter untuk kirim, Shift+Enter untuk baris baru)"
              rows="1"
            ></textarea>
          </div>
          <button class="btn btn-primary" id="btn-send-message" style="height: 48px; min-width: 48px; padding: 0 1.25rem; border-radius: var(--radius-lg);">
            <span>Kirim</span>
            <span>➤</span>
          </button>
        </div>
      </div>
    </div>
  `;

  const messagesStream = container.querySelector('#chat-messages-stream');
  const chatInput = container.querySelector('#chat-input');
  const btnSend = container.querySelector('#btn-send-message');
  const btnEnd = container.querySelector('#btn-end-session');
  const tokenCounterWrapper = container.querySelector('#chat-token-counter');

  // Auto scroll ke bawah
  function scrollToBottom() {
    if (messagesStream) {
      messagesStream.scrollTop = messagesStream.scrollHeight;
    }
  }
  scrollToBottom();

  // Auto-resize textarea
  chatInput.addEventListener('input', () => {
    chatInput.style.height = 'auto';
    chatInput.style.height = `${Math.min(chatInput.scrollHeight, 130)}px`;
  });

  // Handle Enter to send
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  });

  btnSend.addEventListener('click', handleSendMessage);

  async function handleSendMessage() {
    const text = chatInput.value.trim();
    if (!text || isSending) return;

    // Cek sisa token
    if (currentTokens <= 0) {
      showTokenExhaustedModal();
      return;
    }

    // Append user message ke UI
    const userMsg = {
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };
    messages.push(userMsg);
    messagesStream.insertAdjacentHTML('beforeend', renderChatBubble(userMsg));
    chatInput.value = '';
    chatInput.style.height = 'auto';
    scrollToBottom();

    // Simpan ke storage jika anonim
    if (isAnon) {
      storage.appendAnonMessage('user', text);
    }

    // Tampilkan typing indicator
    isSending = true;
    btnSend.disabled = true;
    messagesStream.insertAdjacentHTML('beforeend', renderTypingIndicator());
    scrollToBottom();

    try {
      // Kirim ke backend
      const historyPayload = isAnon ? storage.getAnonChatHistory() : null;
      const res = await api.sendMessage(text, currentSessionId, historyPayload);

      // Hapus typing indicator
      const typingEl = document.getElementById('chat-typing-indicator');
      if (typingEl) typingEl.remove();

      const reply = res.data?.reply || 'Terima kasih telah berbagi ceritamu.';
      if (res.data?.session_id) {
        currentSessionId = res.data.session_id;
      }
      if (res.data?.token_remaining !== undefined) {
        currentTokens = res.data.token_remaining;
        if (isAnon) storage.setAnonTokens(currentTokens);
        tokenCounterWrapper.innerHTML = renderTokenCounter(currentTokens, isAnon);
      }

      const assistantMsg = {
        role: 'assistant',
        content: reply,
        timestamp: new Date().toISOString(),
      };
      messages.push(assistantMsg);
      messagesStream.insertAdjacentHTML('beforeend', renderChatBubble(assistantMsg));
      scrollToBottom();

      if (isAnon) {
        storage.appendAnonMessage('assistant', reply);
      }
    } catch (err) {
      const typingEl = document.getElementById('chat-typing-indicator');
      if (typingEl) typingEl.remove();

      console.error(err);
      const errMsg = err.message || 'Maaf, terjadi kendala saat memproses respon.';
      if (err.status === 403) {
        showTokenExhaustedModal();
      } else {
        const fallbackMsg = {
          role: 'assistant',
          content: `⚠️ [Koneksi] ${errMsg}`,
          timestamp: new Date().toISOString(),
        };
        messagesStream.insertAdjacentHTML('beforeend', renderChatBubble(fallbackMsg));
        scrollToBottom();
      }
    } finally {
      isSending = false;
      btnSend.disabled = false;
      chatInput.focus();
    }
  }

  // End Session Action
  btnEnd.addEventListener('click', async () => {
    if (messages.length <= 1) {
      if (!confirm('Sesi baru saja dimulai. Apakah kamu yakin ingin mengakhirinya sekarang?')) {
        return;
      }
    }

    const modalRoot = document.getElementById('modal-root');
    btnEnd.disabled = true;
    btnEnd.innerText = 'Menganalisis...';

    try {
      const chatHistory = isAnon ? storage.getAnonChatHistory() : null;
      const res = await api.endSession(currentSessionId, chatHistory);

      const summaryData = res.data || {};

      modalRoot.innerHTML = renderSessionSummaryModal({
        user_summary: summaryData.user_summary,
        symptoms: summaryData.symptoms,
        risk_level: summaryData.risk_level,
        mood_summary: summaryData.mood_summary,
        recommendation: summaryData.recommendation,
      });

      // Bind modal buttons
      const btnClose = modalRoot.querySelector('#btn-close-modal');
      const btnDone = modalRoot.querySelector('#btn-modal-done');

      const cleanup = () => {
        modalRoot.innerHTML = '';
        if (isAnon) {
          storage.clearAnonSession();
        }
        navigate('#landing');
      };

      if (btnClose) btnClose.addEventListener('click', cleanup);
      if (btnDone) btnDone.addEventListener('click', cleanup);
    } catch (err) {
      console.error('Error ending session:', err);
      alert(`Gagal mengakhiri sesi: ${err.message}`);
    } finally {
      btnEnd.disabled = false;
      btnEnd.innerHTML = '<span>🛑</span> Akhiri Sesi';
    }
  });

  function showTokenExhaustedModal() {
    const modalRoot = document.getElementById('modal-root');
    modalRoot.innerHTML = `
      <div class="modal-backdrop">
        <div class="modal-card" style="text-align: center;">
          <div style="font-size: 3rem; margin-bottom: 1rem;">🪙</div>
          <h2 style="font-size: 1.5rem; margin-bottom: 0.5rem;">Token Sesi Telah Habis</h2>
          <p style="color: var(--text-secondary); font-size: 0.95rem; margin-bottom: 1.5rem;">
            ${isAnon ? 'Sesi chat anonim memiliki batas 15 pesan gratis. Untuk melanjutkan bercerita dan menyimpan riwayat refleksi, silakan masuk atau daftar akun baru.' : 'Token akunmu telah habis. Silakan hubungi admin atau perbarui paket token Anda.'}
          </p>
          <div style="display: flex; gap: 0.75rem; justify-content: center;">
            <button class="btn btn-secondary" id="btn-close-token-modal">Tutup</button>
            <button class="btn btn-primary" id="btn-login-token-modal">Masuk / Daftar Akun</button>
          </div>
        </div>
      </div>
    `;

    modalRoot.querySelector('#btn-close-token-modal')?.addEventListener('click', () => {
      modalRoot.innerHTML = '';
    });
    modalRoot.querySelector('#btn-login-token-modal')?.addEventListener('click', () => {
      modalRoot.innerHTML = '';
      navigate('#login');
    });
  }
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
