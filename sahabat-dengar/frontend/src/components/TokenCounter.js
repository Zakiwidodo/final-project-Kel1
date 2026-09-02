// frontend/src/components/TokenCounter.js
// Komponen badge indikator sisa token

export function renderTokenCounter(tokenCount, isAnon = false) {
  const isLow = tokenCount <= 3;
  const isZero = tokenCount <= 0;

  let colorStyle = 'rgba(16, 185, 129, 0.15)';
  let borderColor = 'rgba(16, 185, 129, 0.4)';
  let textColor = '#34d399';

  if (isZero) {
    colorStyle = 'rgba(239, 68, 68, 0.2)';
    borderColor = 'rgba(239, 68, 68, 0.5)';
    textColor = '#f87171';
  } else if (isLow) {
    colorStyle = 'rgba(245, 158, 11, 0.2)';
    borderColor = 'rgba(245, 158, 11, 0.5)';
    textColor = '#fbbf24';
  }

  return `
    <div class="token-badge" style="background: ${colorStyle}; border-color: ${borderColor}; color: ${textColor};" title="${isAnon ? 'Sisa token sesi anonim Anda' : 'Sisa token akun Anda'}">
      <span>🪙</span>
      <span>${tokenCount !== null && tokenCount !== undefined ? tokenCount : '--'} Token ${isAnon ? '(Anonim)' : ''}</span>
    </div>
  `;
}
