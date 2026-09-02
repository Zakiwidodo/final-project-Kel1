// frontend/src/pages/Edukasi.js
// Halaman edukasi kesehatan mental — memenuhi kebutuhan PRD FR-7
// Isinya psikoedukasi ringan yang bisa dibaca user tanpa perlu login.

/**
 * Data kondisi umum yang sering dialami.
 * Sengaja dipisah jadi data supaya gampang ditambah/diubah tanpa nyentuh HTML.
 */
const KONDISI_UMUM = [
  {
    ikon: '😰',
    nama: 'Kecemasan (Anxiety)',
    deskripsi:
      'Rasa khawatir berlebihan yang sulit dikendalikan, sering disertai jantung berdebar, napas pendek, atau otot tegang. Wajar muncul sesekali, perlu perhatian kalau mengganggu aktivitas sehari-hari.',
  },
  {
    ikon: '🌧️',
    nama: 'Suasana Hati Menurun',
    deskripsi:
      'Sedih berkepanjangan, kehilangan minat pada hal yang biasanya menyenangkan, merasa hampa atau tidak berharga. Berbeda dengan sedih biasa karena bertahan lama dan sulit hilang sendiri.',
  },
  {
    ikon: '🔋',
    nama: 'Burnout',
    deskripsi:
      'Kelelahan fisik dan emosional akibat tekanan yang berkepanjangan, biasanya dari pekerjaan atau kuliah. Ditandai rasa lelah yang tidak hilang meski sudah istirahat, dan menurunnya rasa mampu.',
  },
  {
    ikon: '😶‍🌫️',
    nama: 'Stres Akut',
    deskripsi:
      'Respons tubuh terhadap tekanan atau perubahan mendadak. Dalam kadar wajar justru membantu kita waspada, tapi kalau terus-menerus bisa mengganggu tidur, nafsu makan, dan konsentrasi.',
  },
  {
    ikon: '🌙',
    nama: 'Gangguan Tidur',
    deskripsi:
      'Sulit tidur, sering terbangun, atau tidur terlalu banyak. Sering jadi gejala awal sekaligus pemicu masalah kesehatan mental lain, jadi layak diperhatikan lebih dulu.',
  },
  {
    ikon: '🫂',
    nama: 'Kesepian',
    deskripsi:
      'Perasaan terputus dari orang lain, bisa muncul bahkan saat sedang berada di tengah keramaian. Berdampak nyata pada kesehatan mental maupun fisik kalau dibiarkan berlarut.',
  },
];

/**
 * Teknik self-help sederhana yang bisa langsung dicoba user.
 * Semua bersifat umum dan edukatif — bukan instruksi medis.
 */
const TEKNIK_SELF_HELP = [
  {
    nama: 'Pernapasan 4-7-8',
    durasi: '± 2 menit',
    langkah: [
      'Tarik napas lewat hidung sambil menghitung sampai 4',
      'Tahan napas sambil menghitung sampai 7',
      'Buang napas perlahan lewat mulut sambil menghitung sampai 8',
      'Ulangi 4 siklus, berhenti kalau terasa pusing',
    ],
    untuk: 'Menenangkan diri saat cemas atau panik',
  },
  {
    nama: 'Grounding 5-4-3-2-1',
    durasi: '± 3 menit',
    langkah: [
      'Sebutkan 5 benda yang kamu lihat',
      'Sebutkan 4 benda yang bisa kamu sentuh',
      'Sebutkan 3 suara yang kamu dengar',
      'Sebutkan 2 aroma yang kamu cium',
      'Sebutkan 1 rasa yang kamu kecap',
    ],
    untuk: 'Menarik perhatian kembali ke saat ini ketika pikiran kacau',
  },
  {
    nama: 'Menulis Jurnal',
    durasi: '± 10 menit',
    langkah: [
      'Tulis apa yang kamu rasakan tanpa menyensor diri',
      'Tidak perlu rapi, tidak perlu dibaca orang lain',
      'Tutup dengan satu hal yang kamu syukuri hari ini',
    ],
    untuk: 'Menguraikan pikiran yang menumpuk agar lebih jelas',
  },
  {
    nama: 'Higiene Tidur',
    durasi: 'kebiasaan harian',
    langkah: [
      'Tidur dan bangun di jam yang sama setiap hari',
      'Jauhkan layar 30 menit sebelum tidur',
      'Hindari kafein setelah sore hari',
      'Buat kamar gelap, sejuk, dan tenang',
    ],
    untuk: 'Memperbaiki kualitas tidur yang memengaruhi suasana hati',
  },
];

/**
 * Mitos yang masih sering beredar, dipasangkan dengan faktanya.
 */
const MITOS_FAKTA = [
  {
    mitos: 'Masalah mental itu tanda orang lemah iman atau kurang bersyukur.',
    fakta:
      'Kesehatan mental dipengaruhi banyak faktor: biologis, psikologis, dan sosial. Sama seperti sakit fisik, ini bukan soal kuat atau lemahnya seseorang.',
  },
  {
    mitos: 'Kalau cerita ke orang lain, nanti dianggap cari perhatian.',
    fakta:
      'Bercerita adalah langkah awal yang sehat. Memendam sendirian justru memperbesar beban dan memperlambat pemulihan.',
  },
  {
    mitos: 'Ke psikolog itu cuma buat orang yang "gila".',
    fakta:
      'Psikolog membantu banyak hal sehari-hari: stres kuliah, konflik keluarga, kecemasan, sampai kebingungan mengambil keputusan. Tidak harus menunggu parah dulu.',
  },
  {
    mitos: 'Waktu akan menyembuhkan semuanya, tidak perlu ditangani.',
    fakta:
      'Sebagian keluhan memang mereda sendiri, tapi sebagian lain menetap dan memburuk. Kalau sudah mengganggu aktivitas lebih dari dua minggu, sebaiknya dicari bantuan.',
  },
];

export function renderEdukasi(container, navigate) {
  container.innerHTML = `
    <div style="max-width: 1000px; margin: 0 auto; padding: 3rem 1.5rem; display: flex; flex-direction: column; gap: 3.5rem;">

      <!-- Header -->
      <section style="text-align: center; display: flex; flex-direction: column; align-items: center; gap: 1rem;">
        <div style="display: inline-flex; align-items: center; gap: 8px; background: rgba(99, 102, 241, 0.12); border: 1px solid rgba(99, 102, 241, 0.3); padding: 0.4rem 1rem; border-radius: var(--radius-full); font-size: 0.88rem; color: #a5b4fc; font-weight: 500;">
          <span>📚</span> Pusat Edukasi
        </div>
        <h1 style="font-size: clamp(2rem, 4.5vw, 3rem); line-height: 1.2; font-weight: 800; color: var(--text-primary); max-width: 720px;">
          Mengenali Apa yang Sedang Kamu Rasakan
        </h1>
        <p style="font-size: 1.05rem; color: var(--text-secondary); max-width: 640px; line-height: 1.7;">
          Memahami kondisi diri adalah langkah pertama yang menenangkan. Halaman ini berisi penjelasan sederhana tentang kesehatan mental, teknik yang bisa langsung kamu coba, dan tanda kapan sebaiknya mencari bantuan profesional.
        </p>
      </section>

      <!-- Kondisi Umum -->
      <section>
        <div style="margin-bottom: 1.75rem;">
          <h2 style="font-size: 1.6rem; margin-bottom: 0.4rem;">Kondisi yang Umum Dialami</h2>
          <p style="color: var(--text-secondary); font-size: 0.95rem;">
            Penjelasan berikut bersifat umum dan <strong>bukan alat diagnosis</strong>. Mengenali istilahnya membantu kamu menamai perasaan, bukan melabeli diri.
          </p>
        </div>

        <div class="cards-grid">
          ${KONDISI_UMUM.map(
            (k) => `
            <div class="glass-panel" style="padding: 1.6rem;">
              <div style="font-size: 1.8rem; margin-bottom: 0.85rem;">${k.ikon}</div>
              <h3 style="font-size: 1.08rem; margin-bottom: 0.5rem;">${k.nama}</h3>
              <p style="color: var(--text-secondary); font-size: 0.9rem; line-height: 1.6;">${k.deskripsi}</p>
            </div>
          `
          ).join('')}
        </div>
      </section>

      <!-- Teknik Self-Help -->
      <section>
        <div style="margin-bottom: 1.75rem;">
          <h2 style="font-size: 1.6rem; margin-bottom: 0.4rem;">Teknik yang Bisa Kamu Coba Sekarang</h2>
          <p style="color: var(--text-secondary); font-size: 0.95rem;">
            Latihan sederhana yang tidak butuh alat apa pun. Kalau salah satu terasa tidak nyaman, hentikan saja.
          </p>
        </div>

        <div style="display: flex; flex-direction: column; gap: 1rem;">
          ${TEKNIK_SELF_HELP.map(
            (t) => `
            <div class="glass-panel" style="padding: 1.6rem; display: flex; flex-direction: column; gap: 0.9rem;">
              <div style="display: flex; align-items: baseline; justify-content: space-between; gap: 1rem; flex-wrap: wrap;">
                <h3 style="font-size: 1.1rem;">${t.nama}</h3>
                <span class="badge" style="background: var(--primary-light); color: var(--primary); font-size: 0.78rem; padding: 0.25rem 0.7rem; border-radius: var(--radius-full);">${t.durasi}</span>
              </div>
              <ol style="margin: 0; padding-left: 1.2rem; display: flex; flex-direction: column; gap: 0.4rem; color: var(--text-secondary); font-size: 0.92rem; line-height: 1.55;">
                ${t.langkah.map((l) => `<li>${l}</li>`).join('')}
              </ol>
              <div style="font-size: 0.85rem; color: var(--text-muted); border-top: 1px solid var(--border-subtle); padding-top: 0.75rem;">
                Cocok untuk: ${t.untuk}
              </div>
            </div>
          `
          ).join('')}
        </div>
      </section>

      <!-- Mitos vs Fakta -->
      <section>
        <div style="margin-bottom: 1.75rem;">
          <h2 style="font-size: 1.6rem; margin-bottom: 0.4rem;">Mitos &amp; Fakta</h2>
          <p style="color: var(--text-secondary); font-size: 0.95rem;">
            Stigma sering membuat orang menunda mencari bantuan. Beberapa yang paling sering terdengar:
          </p>
        </div>

        <div style="display: flex; flex-direction: column; gap: 0.85rem;">
          ${MITOS_FAKTA.map(
            (m) => `
            <div class="glass-panel" style="padding: 1.4rem 1.6rem; display: flex; flex-direction: column; gap: 0.85rem;">
              <div style="display: flex; gap: 0.75rem; align-items: flex-start;">
                <span style="color: var(--risk-high); font-weight: 600; font-size: 0.8rem; letter-spacing: 0.06em; padding-top: 0.15rem; flex-shrink: 0;">MITOS</span>
                <p style="color: var(--text-secondary); font-size: 0.93rem; line-height: 1.6; margin: 0;">${m.mitos}</p>
              </div>
              <div style="display: flex; gap: 0.75rem; align-items: flex-start; border-top: 1px solid var(--border-subtle); padding-top: 0.85rem;">
                <span style="color: var(--risk-low); font-weight: 600; font-size: 0.8rem; letter-spacing: 0.06em; padding-top: 0.15rem; flex-shrink: 0;">FAKTA</span>
                <p style="color: var(--text-primary); font-size: 0.93rem; line-height: 1.6; margin: 0;">${m.fakta}</p>
              </div>
            </div>
          `
          ).join('')}
        </div>
      </section>

      <!-- Kapan Cari Bantuan -->
      <section style="background: var(--risk-medium-bg); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: var(--radius-lg); padding: 1.75rem 2rem;">
        <h2 style="font-size: 1.3rem; margin-bottom: 0.75rem; color: var(--risk-medium);">
          Kapan Sebaiknya Mencari Bantuan Profesional?
        </h2>
        <p style="color: var(--text-secondary); font-size: 0.93rem; margin-bottom: 1rem; line-height: 1.6;">
          Pertimbangkan menemui psikolog atau psikiater kalau kamu mengalami salah satu dari ini:
        </p>
        <ul style="margin: 0; padding-left: 1.2rem; display: flex; flex-direction: column; gap: 0.5rem; color: var(--text-secondary); font-size: 0.93rem; line-height: 1.55;">
          <li>Keluhan bertahan lebih dari dua minggu dan tidak membaik</li>
          <li>Sudah mengganggu kuliah, pekerjaan, atau hubungan dengan orang terdekat</li>
          <li>Pola tidur atau nafsu makan berubah drastis</li>
          <li>Menarik diri dari orang-orang yang biasanya dekat denganmu</li>
          <li>Muncul pikiran untuk menyakiti diri sendiri atau mengakhiri hidup</li>
        </ul>
        <p style="color: var(--text-primary); font-size: 0.93rem; margin-top: 1rem; line-height: 1.6;">
          Poin terakhir tidak perlu ditunggu dua minggu — cari bantuan segera.
        </p>
        <div style="margin-top: 1.25rem; display: flex; gap: 0.75rem; flex-wrap: wrap;">
          <button class="btn btn-primary btn-sm" id="btn-edukasi-bantuan">Lihat Kontak Bantuan</button>
          <button class="btn btn-secondary btn-sm" id="btn-edukasi-chat">Ceritakan ke Sahabat Dengar</button>
        </div>
      </section>

      <!-- Disclaimer -->
      <section style="background: rgba(30, 41, 59, 0.4); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 1.4rem 1.8rem; text-align: center;">
        <p style="font-size: 0.85rem; color: var(--text-muted); max-width: 760px; margin: 0 auto; line-height: 1.6;">
          Materi di halaman ini bersifat edukatif dan umum, <strong>bukan diagnosis maupun anjuran medis</strong>. Untuk penilaian kondisimu secara tepat, temui tenaga kesehatan mental berlisensi.
        </p>
      </section>

    </div>
  `;

  const btnBantuan = container.querySelector('#btn-edukasi-bantuan');
  if (btnBantuan) {
    btnBantuan.addEventListener('click', () => navigate('#bantuan'));
  }

  const btnChat = container.querySelector('#btn-edukasi-chat');
  if (btnChat) {
    btnChat.addEventListener('click', () => navigate('#chat'));
  }
}
