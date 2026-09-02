// frontend/src/components/SymptomCard.js
// Komponen kartu ringkasan gejala dan observasi emosi

export function renderSymptomCard({
  sessionId,
  userEmail,
  startedAt,
  riskLevel = 'rendah',
  moodSummary = 'netral',
  symptoms = [],
  recommendation = '',
  messageCount = 0,
}) {
  const riskClass = `badge-risk-${(riskLevel || 'rendah').toLowerCase()}`;
  const dateStr = startedAt
    ? new Date(startedAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
    : 'Tanggal tidak diketahui';

  const symptomsList = Array.isArray(symptoms) ? symptoms : [];
  const symptomsHtml = symptomsList.length > 0
    ? symptomsList.map((s) => `<span class="symptom-tag" style="font-size: 0.78rem;">${escapeHtml(s)}</span>`).join(' ')
    : '<span style="color: var(--text-muted); font-size: 0.8rem;">Tidak ada gejala spesifik</span>';

  return `
    <div class="glass-panel" style="padding: 1.25rem; display: flex; flex-direction: column; gap: 0.75rem; transition: var(--transition);">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem;">
        <div>
          <div style="font-weight: 600; font-size: 0.95rem; color: var(--text-primary);">
            ${escapeHtml(userEmail || 'Pengguna Anonim')}
          </div>
          <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 2px;">
            🕒 ${dateStr} • 💬 ${messageCount} pesan
          </div>
        </div>
        <span class="badge ${riskClass}">
          ${escapeHtml(riskLevel || 'rendah')}
        </span>
      </div>

      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center;">
        <span style="font-size: 0.8rem; color: var(--text-secondary);">Mood:</span>
        <span class="badge" style="background: rgba(99, 102, 241, 0.12); color: #c7d2fe; border: 1px solid rgba(99, 102, 241, 0.25); font-size: 0.75rem;">
          ${escapeHtml(moodSummary || 'netral')}
        </span>
      </div>

      <div>
        <div style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 0.35rem;">Gejala:</div>
        <div style="display: flex; flex-wrap: wrap; gap: 0.35rem;">
          ${symptomsHtml}
        </div>
      </div>

      ${recommendation ? `
        <div style="background: rgba(255, 255, 255, 0.02); border-radius: var(--radius-sm); padding: 0.65rem 0.85rem; font-size: 0.82rem; color: var(--text-secondary); line-height: 1.45; border-left: 3px solid var(--primary);">
          ${escapeHtml(recommendation)}
        </div>
      ` : ''}

      ${sessionId ? `
        <div style="margin-top: auto; padding-top: 0.5rem; display: flex; justify-content: flex-end;">
          <button class="btn btn-secondary btn-sm" onclick="window.viewSessionDetail && window.viewSessionDetail('${sessionId}')">
            Lihat Percakapan →
          </button>
        </div>
      ` : ''}
    </div>
  `;
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
