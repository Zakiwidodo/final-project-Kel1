// frontend/src/pages/Tentang.js
// Halaman "Tentang Layanan Ini" — memenuhi kebutuhan PRD FR-7.1
// Menjelaskan batasan layanan secara terbuka supaya user punya ekspektasi yang benar.

/**
 * Batasan layanan dibuat berpasangan (bisa / tidak bisa) supaya user
 * langsung paham posisi Sahabat Dengar tanpa harus membaca paragraf panjang.
 */
const YANG_BISA = [
  'Menemani kamu bercerita kapan pun, tanpa menghakimi',
  'Merefleksikan kembali perasaan yang kamu sampaikan',
  'Memberi psikoedukasi ringan seputar kesehatan mental',
  'Menyarankan langkah self-care sederhana yang relevan',
  'Merangkum sesi curhatmu agar bisa kamu baca ulang',
];

const YANG_TIDAK_BISA = [
  'Memberi diagnosis klinis atau menyebut nama gangguan secara pasti',
  'Meresepkan obat, dosis, atau instruksi medis apa pun',
  'Menggantikan psikolog, psikiater, atau konselor berlisensi',
  'Menangani keadaan darurat yang butuh pertolongan segera',
  'Menjamin kebenaran mutlak, karena jawaban dihasilkan oleh AI',
];

/**
 * Poin privasi. Isinya harus jujur mengikuti implementasi yang sebenarnya —
 * jangan menjanjikan sesuatu yang tidak dilakukan sistem.
 */
const POIN_PRIVASI = [
  {
    ikon: '🕶️',
    judul: 'Mode anonim tidak butuh identitas',
    isi: 'Kamu bisa langsung bercerita tanpa mendaftar. Tidak ada nama, email, atau nomor telepon yang diminta.',
  },
  {
    ikon: '🔐',
    judul: 'Kata sandi tidak pernah disimpan apa adanya',
    isi: 'Kata sandi akun diacak menggunakan bcrypt sebelum masuk ke database, sehingga tidak bisa dibaca kembali oleh siapa pun.',
  },
  {
    ikon: '🙈',
    judul: 'Riwayat hanya bisa dibuka pemiliknya',
    isi: 'Setiap permintaan riwayat diperiksa dua kali: token login harus valid, dan sesi yang diminta harus benar-benar milik akun tersebut.',
  },
  {
    ikon: '🔑',
    judul: 'Kunci API disimpan di sisi server',
    isi: 'Kredensial layanan AI tidak pernah dikirim ke browser, jadi tidak bisa diambil dari halaman ini.',
  },
];

export function renderTentang(container, navigate) {
  container.innerHTML = `
    <div style="max-width: 900px; margin: 0 auto; padding: 3rem 1.5rem; display: flex; flex-direction: column; gap: 3rem;">

      <!-- Header -->
      <section style="text-align: center; display: flex; flex-direction: column; align-items: center; gap: 1rem;">
        <div style="display: inline-flex; align-items: center; gap: 8px; background: rgba(6, 182, 212, 0.12); border: 1px solid rgba(6, 182, 212, 0.3); padding: 0.4rem 1rem; border-radius: var(--radius-full); font-size: 0.88rem; color: #67e8f9; font-weight: 500;">
          <span>ℹ️</span> Tentang Layanan Ini
        </div>
        <h1 style="font-size: clamp(1.9rem, 4.5vw, 2.8rem); line-height: 1.2; font-weight: 800; color: var(--text-primary); max-width: 680px;">
          Apa Adanya, Supaya Kamu Tahu Apa yang Kamu Dapat
        </h1>
        <p style="font-size: 1.05rem; color: var(--text-secondary); max-width: 620px; line-height: 1.7;">
          Sahabat Dengar adalah pendamping berbasis kecerdasan buatan yang berperan sebagai pendengar empatik. Kami memilih menjelaskan batasannya sejak awal, karena kejelasan itu bagian dari menjaga keselamatanmu.
        </p>
      </section>

      <!-- Peringatan Utama -->
      <section style="background: var(--risk-high-bg); border: 1px solid rgba(239, 68, 68, 0.35); border-radius: var(--radius-lg); padding: 1.6rem 1.9rem;">
        <h2 style="font-size: 1.15rem; color: #fca5a5; margin-bottom: 0.6rem;">
          Layanan ini bukan untuk keadaan darurat
        </h2>
        <p style="color: var(--text-secondary); font-size: 0.95rem; line-height: 1.65; margin: 0;">
          Kalau kamu atau orang di sekitarmu sedang dalam bahaya langsung, jangan menunggu balasan chat. Hubungi
          <strong style="color: var(--text-primary);">Layanan SEJIWA 119 ext 8</strong> yang tersedia 24 jam, atau pergi ke
          <strong style="color: var(--text-primary);">IGD rumah sakit terdekat</strong>.
        </p>
        <button class="btn btn-danger btn-sm" id="btn-tentang-bantuan" style="margin-top: 1.1rem;">
          Lihat Semua Kontak Bantuan
        </button>
      </section>

      <!-- Bisa vs Tidak Bisa -->
      <section>
        <h2 style="font-size: 1.6rem; margin-bottom: 1.5rem;">Batasan Layanan</h2>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem;">
          <div class="glass-panel" style="padding: 1.6rem;">
            <h3 style="font-size: 1.05rem; margin-bottom: 1rem; color: var(--risk-low);">
              Yang bisa dilakukan Sahabat Dengar
            </h3>
            <ul style="margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 0.7rem;">
              ${YANG_BISA.map(
                (b) => `
                <li style="display: flex; gap: 0.6rem; align-items: flex-start; color: var(--text-secondary); font-size: 0.92rem; line-height: 1.55;">
                  <span style="color: var(--risk-low); flex-shrink: 0;">✓</span>
                  <span>${b}</span>
                </li>
              `
              ).join('')}
            </ul>
          </div>

          <div class="glass-panel" style="padding: 1.6rem;">
            <h3 style="font-size: 1.05rem; margin-bottom: 1rem; color: var(--risk-high);">
              Yang tidak bisa dan tidak boleh dilakukan
            </h3>
            <ul style="margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 0.7rem;">
              ${YANG_TIDAK_BISA.map(
                (t) => `
                <li style="display: flex; gap: 0.6rem; align-items: flex-start; color: var(--text-secondary); font-size: 0.92rem; line-height: 1.55;">
                  <span style="color: var(--risk-high); flex-shrink: 0;">✕</span>
                  <span>${t}</span>
                </li>
              `
              ).join('')}
            </ul>
          </div>
        </div>
      </section>

      <!-- Privasi -->
      <section>
        <div style="margin-bottom: 1.5rem;">
          <h2 style="font-size: 1.6rem; margin-bottom: 0.4rem;">Bagaimana Ceritamu Dijaga</h2>
          <p style="color: var(--text-secondary); font-size: 0.95rem;">
            Isi percakapan soal kesehatan mental termasuk data yang sangat pribadi, jadi ini yang kami lakukan:
          </p>
        </div>

        <div class="cards-grid">
          ${POIN_PRIVASI.map(
            (p) => `
            <div class="glass-panel" style="padding: 1.5rem;">
              <div style="font-size: 1.6rem; margin-bottom: 0.75rem;">${p.ikon}</div>
              <h3 style="font-size: 1rem; margin-bottom: 0.45rem;">${p.judul}</h3>
              <p style="color: var(--text-secondary); font-size: 0.89rem; line-height: 1.6;">${p.isi}</p>
            </div>
          `
          ).join('')}
        </div>
      </section>

      <!-- Cara Kerja Singkat -->
      <section class="glass-panel" style="padding: 1.75rem 2rem;">
        <h2 style="font-size: 1.3rem; margin-bottom: 1rem;">Cara Kerjanya Secara Singkat</h2>
        <ol style="margin: 0; padding-left: 1.3rem; display: flex; flex-direction: column; gap: 0.65rem; color: var(--text-secondary); font-size: 0.93rem; line-height: 1.6;">
          <li>Kamu menulis apa yang sedang dirasakan.</li>
          <li>Pesanmu dikirim ke model AI bersama panduan peran sebagai pendengar empatik.</li>
          <li>Kalau layanan AI utama sedang bermasalah, sistem otomatis beralih ke model cadangan agar percakapan tetap jalan.</li>
          <li>Balasan ditampilkan, lalu percakapan disimpan kalau kamu memakai akun.</li>
          <li>Saat sesi diakhiri, sistem membuat ringkasan hangat beserta catatan suasana hati.</li>
        </ol>
      </section>

      <!-- Disclaimer Penutup -->
      <section style="background: rgba(30, 41, 59, 0.4); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 1.5rem 2rem; text-align: center;">
        <div style="font-weight: 600; color: var(--accent-cyan); margin-bottom: 0.45rem; font-size: 0.95rem;">
          Penafian
        </div>
        <p style="font-size: 0.87rem; color: var(--text-secondary); max-width: 780px; margin: 0 auto; line-height: 1.65;">
          Sahabat Dengar adalah sistem pendukung kesehatan mental berbasis kecerdasan buatan,
          <strong>bukan pengganti psikiater, psikolog klinis, atau diagnosis medis resmi</strong>.
          Jawaban dihasilkan oleh model bahasa dan bisa saja keliru. Keputusan mengenai kesehatanmu
          sebaiknya selalu didiskusikan dengan tenaga profesional berlisensi.
        </p>
        <div style="display: flex; gap: 0.7rem; flex-wrap: wrap; justify-content: center; margin-top: 1.25rem;">
          <button class="btn btn-secondary btn-sm" id="btn-tentang-edukasi">Baca Materi Edukasi</button>
          <button class="btn btn-primary btn-sm" id="btn-tentang-chat">Mulai Bercerita</button>
        </div>
      </section>

    </div>
  `;

  const btnBantuan = container.querySelector('#btn-tentang-bantuan');
  if (btnBantuan) {
    btnBantuan.addEventListener('click', () => navigate('#bantuan'));
  }

  const btnEdukasi = container.querySelector('#btn-tentang-edukasi');
  if (btnEdukasi) {
    btnEdukasi.addEventListener('click', () => navigate('#edukasi'));
  }

  const btnChat = container.querySelector('#btn-tentang-chat');
  if (btnChat) {
    btnChat.addEventListener('click', () => navigate('#chat'));
  }
}
