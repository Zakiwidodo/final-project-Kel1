// frontend/src/components/ChatBubble.js
// Komponen render gelembung chat (User vs AI Assistant)

export function renderChatBubble({ role, content, timestamp }) {
  const isUser = role === 'user';
  const timeStr = timestamp
    ? new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  return `
    <div class="message-group ${isUser ? 'user' : 'assistant'}">
      <div class="avatar ${isUser ? 'avatar-user' : 'avatar-ai'}">
        ${isUser ? '👤' : '🧠'}
      </div>
      <div class="bubble-wrapper">
        <div class="bubble">${escapeHtml(content)}</div>
        ${timeStr ? `<div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 4px; text-align: ${isUser ? 'right' : 'left'}">${timeStr}</div>` : ''}
      </div>
    </div>
  `;
}

export function renderTypingIndicator() {
  return `
    <div class="message-group assistant" id="chat-typing-indicator">
      <div class="avatar avatar-ai">🧠</div>
      <div class="bubble typing-indicator">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    </div>
  `;
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
