// frontend/src/components/SessionSummaryModal.js
// Modal ringkasan akhir sesi dan hasil analisis gejala

export function renderSessionSummaryModal({
  user_summary,
  symptoms = [],
  risk_level = 'rendah',
  mood_summary = 'netral',
  recommendation = '',
  onClose,
}) {
  const riskClass = `badge-risk-${risk_level.toLowerCase()}`;
  const symptomsHtml = symptoms && symptoms.length > 0
    ? symptoms.map((s) => `<span class="symptom-tag">${escapeHtml(s)}</span>`).join(' ')
    : '<span style="color: var(--text-muted); font-size: 0.88rem;">Tidak ada gejala signifikan yang terdeteksi</span>';

  return `
    <div class="modal-backdrop" id="session-summary-modal">
      <div class="modal-card">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.25rem;">
          <div>
            <div style="font-size: 0.85rem; color: var(--primary); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">
              Sesi Selesai
            </div>
            <h2 style="font-size: 1.5rem; color: var(--text-primary);">Ringkasan Refleksi Kamu</h2>
          </div>
          <button class="btn btn-secondary btn-sm" id="btn-close-modal" style="border-radius: 50%; width: 32px; height: 32px; padding: 0;">✕</button>
        </div>

        <!-- Badges Bar -->
        <div style="display: flex; gap: 0.65rem; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap;">
          <span class="badge ${riskClass}">
            <span>🛡️</span> Risiko: ${escapeHtml(risk_level)}
          </span>
          <span class="badge" style="background: rgba(99, 102, 241, 0.15); color: #a5b4fc; border: 1px solid rgba(99, 102, 241, 0.3);">
            <span>🎭</span> Mood: ${escapeHtml(mood_summary)}
          </span>
        </div>

        <!-- Warm User Summary Card -->
        <div style="background: rgba(16, 185, 129, 0.06); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: var(--radius-md); padding: 1.25rem; margin-bottom: 1.25rem;">
          <h4 style="color: #34d399; font-size: 0.95rem; margin-bottom: 0.65rem; display: flex; align-items: center; gap: 6px;">
            <span>💬</span> Pesan dari Sahabat Dengar
          </h4>
          <p style="color: var(--text-primary); font-size: 0.94rem; line-height: 1.65; white-space: pre-wrap;">${escapeHtml(user_summary || 'Terima kasih telah berbagi cerita hari ini.')}</p>
        </div>

        <!-- Symptoms Section -->
        <div style="margin-bottom: 1.25rem;">
          <div style="font-size: 0.88rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 0.6rem;">
            Fokus & Perhatian Teridentifikasi:
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
            ${symptomsHtml}
          </div>
        </div>

        ${recommendation ? `
          <div style="background: var(--bg-tertiary); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1rem; margin-bottom: 1.5rem;">
            <div style="font-size: 0.85rem; font-weight: 600; color: var(--accent-cyan); margin-bottom: 0.35rem;">
              💡 Langkah Kecil Hari Ini:
            </div>
            <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.5;">${escapeHtml(recommendation)}</p>
          </div>
        ` : ''}

        <!-- Hotline Emergency Card -->
        <div style="background: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.25); border-radius: var(--radius-md); padding: 0.85rem 1rem; margin-bottom: 1.5rem; font-size: 0.82rem; color: #fca5a5;">
          <strong>🚨 Butuh Bantuan Darurat?</strong> Jika kamu merasa tidak aman atau terancam, hubungi <strong>Layanan Sejiwa di 119 ext 8 (24 Jam)</strong> atau kunjungi fasilitas kesehatan terdekat.
        </div>

        <!-- Footer Actions -->
        <div style="display: flex; justify-content: flex-end; gap: 0.75rem;">
          <button class="btn btn-primary" id="btn-modal-done" style="width: 100%;">
            Selesai & Mulai Sesi Baru
          </button>
        </div>
      </div>
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
