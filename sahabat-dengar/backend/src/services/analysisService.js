// src/services/analysisService.js
// Ekstraksi gejala dan pembuatan ringkasan sesi menggunakan LLM

const llmService = require('./llmService');

const SYMPTOM_EXTRACTION_PROMPT = `Kamu adalah sistem analisis internal. Tugasmu HANYA menganalisis transkrip 
percakapan dan menghasilkan output JSON. 

ATURAN KETAT:
- Output HANYA JSON murni, tanpa teks tambahan, tanpa markdown, tanpa backtick
- Jangan menambahkan preamble atau penjelasan apa pun
- Jika transkrip kosong atau tidak cukup data, tetap kembalikan JSON dengan nilai null/empty

FORMAT OUTPUT WAJIB:
{
  "gejala_terdeteksi": ["string", "..."],
  "tingkat_risiko": "rendah" | "sedang" | "tinggi",
  "mood_dominan": "string (mis: cemas, sedih, marah, lelah, bingung)",
  "tema_utama": ["string", "..."],
  "ringkasan_kondisi": "1-2 kalimat tentang kondisi emosional user",
  "rekomendasi_untuk_user": "saran singkat yang bisa ditampilkan ke user",
  "catatan_admin": "observasi tambahan untuk admin, bisa lebih teknis"
}`;

const SESSION_SUMMARY_PROMPT = `Kamu adalah sistem ringkasan sesi. Berdasarkan transkrip percakapan berikut,
buat ringkasan hangat dan supportif untuk user tentang sesi mereka hari ini.

FORMAT OUTPUT — hanya teks biasa, bukan JSON:
1. Sapaan pembuka yang hangat (1 kalimat)
2. Ringkasan singkat apa yang dibicarakan (2-3 kalimat, tanpa menyebut diagnosis)
3. Hal positif yang kamu amati dari user (1-2 kalimat)
4. Satu saran kecil untuk dibawa pulang (1 kalimat)
5. Penutup yang encouraging (1 kalimat)

Tone: hangat, supportif, non-judgmental. Gunakan "kamu" bukan "Anda".`;

const CHATBOT_SYSTEM_PROMPT = `Kamu adalah "Sahabat Dengar", pendamping kesehatan mental berbasis AI 
yang bertugas sebagai pendengar empatik — BUKAN terapis atau psikiater.

KEPRIBADIAN:
- Hangat, tidak menghakimi, sabar
- Menggunakan bahasa Indonesia yang natural dan mudah dimengerti
- Validatif terhadap perasaan user — jangan minimalisir perasaan mereka
- Tidak memberi ceramah atau nasihat generik berulang

YANG BOLEH DILAKUKAN:
- Mendengarkan dan merespons dengan empati
- Mengajukan pertanyaan terbuka untuk mendorong user bercerita
- Merefleksikan perasaan user ("Kedengarannya kamu merasa...")
- Memberikan psikoedukasi ringan jika relevan
- Menyarankan self-care sederhana yang kontekstual

YANG DILARANG:
- Memberikan diagnosis klinis apa pun
- Menyebut nama disorder secara definitif ("kamu mengalami depresi")
- Memberikan resep, dosis, atau instruksi medis
- Melakukan roleplay di luar peran pendamping
- Memaksa user bercerita jika mereka enggan

PENANGANAN KRISIS (WAJIB DIPATUHI):
Jika user menyebut ide bunuh diri, self-harm, atau situasi bahaya langsung:
1. Respons dengan nada tenang dan validasi perasaannya terlebih dahulu
2. Sertakan info berikut di pesan yang SAMA (jangan tunda):
   - "Layanan Sejiwa: 119 ext 8 (24 jam)"
   - "Atau pergi ke IGD rumah sakit terdekat"
3. Tanyakan apakah mereka aman saat ini

PANJANG RESPONS:
- Sesuaikan konteks — jangan template
- Jika user baru memulai: sambut dengan hangat, tanya apa yang ingin mereka ceritakan
- Jika user sedang dalam emosi berat: respons lebih pendek, lebih validatif
- Hindari bullet point berlebihan; gunakan paragraf percakapan

PENUTUP IMPLISIT:
Di setiap sesi, secara natural dorong user untuk mempertimbangkan bantuan profesional 
jika keluhannya berat atau berkelanjutan — tapi jangan memaksa.`;

const analysisService = {
  CHATBOT_SYSTEM_PROMPT,

  /**
   * Mengubah array of messages menjadi format string transkrip
   */
  formatTranscript(messages) {
    if (!messages || messages.length === 0) return 'Transkrip kosong.';
    return messages
      .map((msg) => `${msg.role === 'user' ? 'User' : 'Sahabat Dengar'}: ${msg.content}`)
      .join('\n');
  },

  /**
   * Ekstraksi gejala dan risiko dari riwayat chat
   */
  async extractSymptoms(messages) {
    const transcript = this.formatTranscript(messages);
    const systemPrompt = `${SYMPTOM_EXTRACTION_PROMPT}\n\nTRANSKRIP:\n${transcript}`;

    try {
      const response = await llmService.sendMessage(
        [{ role: 'user', content: 'Lakukan analisis terhadap transkrip di atas.' }],
        systemPrompt
      );

      let cleanJson = response.content.trim();
      // Bersihkan markdown backtick jika ada
      if (cleanJson.startsWith('```')) {
        cleanJson = cleanJson.replace(/^```(json)?\n?/, '').replace(/\n?```$/, '').trim();
      }

      const parsed = JSON.parse(cleanJson);
      return parsed;
    } catch (err) {
      console.error('Error parsing symptom extraction JSON:', err.message);
      // Fallback object jika JSON parse gagal
      return {
        gejala_terdeteksi: [],
        tingkat_risiko: 'rendah',
        mood_dominan: 'netral',
        tema_utama: ['percakapan umum'],
        ringkasan_kondisi: 'Pengguna telah menyelesaikan sesi percakapan dengan Sahabat Dengar.',
        rekomendasi_untuk_user: 'Tetap jaga kesehatan fisik dan luangkan waktu untuk istirahat.',
        catatan_admin: `Fallback extraction: ${err.message}`,
      };
    }
  },

  /**
   * Menghasilkan teks ringkasan akhir sesi untuk ditampilkan ke user
   */
  async generateUserSummary(messages) {
    const transcript = this.formatTranscript(messages);
    const systemPrompt = `${SESSION_SUMMARY_PROMPT}\n\nTRANSKRIP:\n${transcript}`;

    const response = await llmService.sendMessage(
      [{ role: 'user', content: 'Buatkan ringkasan sesi ramah untuk user.' }],
      systemPrompt
    );

    return response.content;
  },
};

module.exports = analysisService;
