// frontend/src/pages/Bantuan.js
// Halaman kontak bantuan krisis — memenuhi kebutuhan PRD FR-7.2
// Sengaja dibuat sebagai halaman tersendiri yang selalu bisa diakses dari navbar,
// bukan hanya muncul saat sistem mendeteksi krisis.
//
// PENTING UNTUK TIM: nomor dan nama layanan di bawah WAJIB diverifikasi ulang
// sebelum aplikasi dipakai user sungguhan. Kontak yang sudah tidak aktif lebih
// berbahaya daripada tidak menampilkan kontak sama sekali.

/**
 * Kontak darurat utama. Ditaruh terpisah dari daftar lain supaya
 * bisa ditampilkan paling menonjol di halaman.
 */
const KONTAK_DARURAT = {
  nama: 'Layanan SEJIWA — Kementerian Kesehatan RI',
  kontak: '119 ext 8',
  jam: 'Tersedia 24 jam',
  keterangan:
    'Layanan konseling melalui telepon untuk masyarakat yang mengalami masalah kesehatan jiwa, termasuk kondisi krisis.',
};

/**
 * Jalur bantuan lain. Sengaja tidak semuanya berupa nomor telepon,
 * karena akses tiap orang berbeda-beda.
 */
const JALUR_BANTUAN = [
  {
    ikon: '🏥',
    nama: 'IGD Rumah Sakit Terdekat',
    keterangan:
      'Untuk kondisi yang butuh pertolongan segera, termasuk percobaan menyakiti diri sendiri. Datang langsung atau minta diantar orang terdekat.',
    catatan: 'Pilihan tercepat saat keadaan mendesak',
  },
  {
    ikon: '🩺',
    nama: 'Puskesmas dengan Layanan Kesehatan Jiwa',
    keterangan:
      'Banyak puskesmas sudah memiliki program kesehatan jiwa dan bisa merujuk ke psikolog atau psikiater. Biayanya terjangkau dan sebagian ditanggung BPJS.',
    catatan: 'Titik awal yang mudah dijangkau',
  },
  {
    ikon: '🎓',
    nama: 'Unit Konseling Kampus',
    keterangan:
      'Sebagian besar perguruan tinggi menyediakan layanan konseling gratis untuk mahasiswa. Cek bagian kemahasiswaan atau fakultas psikologi kampusmu.',
    catatan: 'Gratis untuk mahasiswa',
  },
  {
    ikon: '👨‍⚕️',
    nama: 'Psikolog atau Psikiater Berlisensi',
    keterangan:
      'Untuk penanganan berkelanjutan. Pastikan praktiknya terdaftar resmi — psikolog klinis memiliki nomor SIPP, psikiater memiliki STR.',
    catatan: 'Untuk penanganan jangka panjang',
  },
];

/**
 * Panduan praktis saat mendampingi orang lain yang sedang dalam krisis.
 */
const CARA_MENDAMPINGI = [
  {
    lakukan: true,
    isi: 'Dengarkan tanpa memotong dan tanpa langsung memberi solusi',
  },
  {
    lakukan: true,
    isi: 'Tanyakan langsung dan tenang apakah ia berpikir untuk mengakhiri hidup — bertanya tidak akan menanamkan ide itu',
  },
  {
    lakukan: true,
    isi: 'Temani dan bantu menghubungi layanan bantuan atau keluarga',
  },
  {
    lakukan: true,
    isi: 'Jauhkan benda yang berpotensi membahayakan bila memungkinkan',
  },
  {
    lakukan: false,
    isi: 'Menghakimi, menceramahi, atau membandingkan dengan penderitaan orang lain',
  },
  {
    lakukan: false,
    isi: 'Mengatakan "cuma gitu doang" atau "yang sabar aja" tanpa benar-benar mendengarkan',
  },
  {
    lakukan: false,
    isi: 'Berjanji merahasiakan kalau nyawanya sedang dalam bahaya',
  },
];

export function renderBantuan(container, navigate) {
  container.innerHTML = `
    <div style="max-width: 900px; margin: 0 auto; padding: 3rem 1.5rem; display: flex; flex-direction: column; gap: 3rem;">

      <!-- Header -->
      <section style="text-align: center; display: flex; flex-direction: column; align-items: center; gap: 1rem;">
        <div style="display: inline-flex; align-items: center; gap: 8px; background: var(--risk-high-bg); border: 1px solid rgba(239, 68, 68, 0.35); padding: 0.4rem 1rem; border-radius: var(--radius-full); font-size: 0.88rem; color: #fca5a5; font-weight: 500;">
          <span>🆘</span> Kontak Bantuan
        </div>
        <h1 style="font-size: clamp(1.9rem, 4.5vw, 2.8rem); line-height: 1.2; font-weight: 800; color: var(--text-primary); max-width: 660px;">
          Kamu Tidak Harus Menghadapinya Sendirian
        </h1>
        <p style="font-size: 1.05rem; color: var(--text-secondary); max-width: 600px; line-height: 1.7;">
          Meminta bantuan bukan tanda menyerah. Halaman ini berisi jalur bantuan yang bisa kamu hubungi, untuk dirimu sendiri maupun untuk orang yang kamu sayangi.
        </p>
      </section>

      <!-- Kontak Darurat Utama -->
      <section style="background: var(--risk-high-bg); border: 1px solid rgba(239, 68, 68, 0.4); border-radius: var(--radius-lg); padding: 2rem;">
        <div style="font-size: 0.8rem; letter-spacing: 0.08em; color: #fca5a5; font-weight: 600; margin-bottom: 0.75rem;">
          DALAM KRISIS ATAU BUTUH BANTUAN SEGERA
        </div>
        <div style="font-size: clamp(2rem, 6vw, 3rem); font-weight: 800; color: var(--text-primary); line-height: 1.1; margin-bottom: 0.5rem; font-variant-numeric: tabular-nums;">
          ${KONTAK_DARURAT.kontak}
        </div>
        <div style="font-size: 1.05rem; color: var(--text-primary); font-weight: 600; margin-bottom: 0.3rem;">
          ${KONTAK_DARURAT.nama}
        </div>
        <div style="font-size: 0.9rem; color: var(--risk-low); margin-bottom: 0.9rem;">
          ${KONTAK_DARURAT.jam}
        </div>
        <p style="color: var(--text-secondary); font-size: 0.93rem; line-height: 1.6; margin: 0;">
          ${KONTAK_DARURAT.keterangan}
        </p>
      </section>

      <!-- Jalur Bantuan Lain -->
      <section>
        <div style="margin-bottom: 1.5rem;">
          <h2 style="font-size: 1.6rem; margin-bottom: 0.4rem;">Jalur Bantuan Lainnya</h2>
          <p style="color: var(--text-secondary); font-size: 0.95rem;">
            Kalau menelepon terasa berat, masih ada pilihan lain yang bisa kamu tempuh.
          </p>
        </div>

        <div style="display: flex; flex-direction: column; gap: 0.9rem;">
          ${JALUR_BANTUAN.map(
            (j) => `
            <div class="glass-panel" style="padding: 1.5rem 1.7rem; display: flex; gap: 1.1rem; align-items: flex-start;">
              <div style="font-size: 1.7rem; flex-shrink: 0; line-height: 1;">${j.ikon}</div>
              <div style="display: flex; flex-direction: column; gap: 0.45rem;">
                <h3 style="font-size: 1.05rem; margin: 0;">${j.nama}</h3>
                <p style="color: var(--text-secondary); font-size: 0.91rem; line-height: 1.6; margin: 0;">${j.keterangan}</p>
                <span style="font-size: 0.8rem; color: var(--primary);">${j.catatan}</span>
              </div>
            </div>
          `
          ).join('')}
        </div>
      </section>

      <!-- Cara Mendampingi -->
      <section>
        <div style="margin-bottom: 1.5rem;">
          <h2 style="font-size: 1.6rem; margin-bottom: 0.4rem;">Kalau yang Membutuhkan Adalah Orang Lain</h2>
          <p style="color: var(--text-secondary); font-size: 0.95rem;">
            Kehadiranmu berarti banyak. Ini yang membantu, dan yang sebaiknya dihindari.
          </p>
        </div>

        <div class="glass-panel" style="padding: 1.7rem; display: flex; flex-direction: column; gap: 0.8rem;">
          ${CARA_MENDAMPINGI.map(
            (c) => `
            <div style="display: flex; gap: 0.75rem; align-items: flex-start;">
              <span style="color: ${c.lakukan ? 'var(--risk-low)' : 'var(--risk-high)'}; flex-shrink: 0; font-weight: 600;">
                ${c.lakukan ? '✓' : '✕'}
              </span>
              <span style="color: var(--text-secondary); font-size: 0.92rem; line-height: 1.6;">${c.isi}</span>
            </div>
          `
          ).join('')}
        </div>
      </section>

      <!-- Penutup -->
      <section style="background: rgba(30, 41, 59, 0.4); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 1.6rem 2rem; text-align: center;">
        <p style="font-size: 0.9rem; color: var(--text-secondary); max-width: 700px; margin: 0 auto 1.25rem; line-height: 1.7;">
          Sahabat Dengar bisa menemanimu bercerita, tapi tidak bisa menggantikan pertolongan langsung. Kalau keadaannya mendesak, hubungi nomor di atas lebih dulu.
        </p>
        <div style="display: flex; gap: 0.7rem; flex-wrap: wrap; justify-content: center;">
          <button class="btn btn-secondary btn-sm" id="btn-bantuan-tentang">Batasan Layanan Ini</button>
          <button class="btn btn-primary btn-sm" id="btn-bantuan-chat">Ceritakan ke Sahabat Dengar</button>
        </div>
      </section>

    </div>
  `;

  const btnTentang = container.querySelector('#btn-bantuan-tentang');
  if (btnTentang) {
    btnTentang.addEventListener('click', () => navigate('#tentang'));
  }

  const btnChat = container.querySelector('#btn-bantuan-chat');
  if (btnChat) {
    btnChat.addEventListener('click', () => navigate('#chat'));
  }
}
