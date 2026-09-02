// src/services/llmService.js
// Proxy ke LLM API (Mendukung Google Gemini, OpenAI, Groq, OpenRouter, dll.) dengan automatic multi-model fallback

const env = require('../config/env');

const GEMINI_FALLBACK_MODELS = [
  env.LLM_MODEL || 'gemini-2.5-flash-lite',
  'gemini-2.5-flash-lite',
  'gemini-3.1-flash-lite',
  'gemini-3.5-flash-lite',
  'gemini-3.7-flash',
  'gemini-flash-latest',
];

const llmService = {
  /**
   * Kirim pesan ke LLM API
   * @param {Array} messages - Array of { role, content }
   * @param {string} systemPrompt - System prompt
   * @returns {{ content: string, usage: object }}
   */
  async sendMessage(messages, systemPrompt) {
    const isGemini =
      env.LLM_MODEL?.toLowerCase().includes('gemini') ||
      env.LLM_BASE_URL?.includes('generativelanguage.googleapis.com') ||
      env.LLM_API_KEY?.startsWith('AQ.') ||
      env.LLM_API_KEY?.startsWith('AIza');

    if (isGemini) {
      return this.sendWithGeminiFallback(messages, systemPrompt);
    }

    // Standard OpenAI compatible call
    return this.sendOpenAICompatible(messages, systemPrompt, env.LLM_MODEL);
  },

  /**
   * Coba panggil Gemini Native API dengan beberapa model alternatif jika ada 503 / 404 / 429
   */
  async sendWithGeminiFallback(messages, systemPrompt) {
    let lastError = null;

    // Filter unique models
    const modelsToTry = [...new Set(GEMINI_FALLBACK_MODELS)];

    for (const model of modelsToTry) {
      try {
        console.log(`🤖 Memanggil Gemini Model: ${model}...`);
        const result = await this.sendNativeGemini(messages, systemPrompt, model);
        return result;
      } catch (err) {
        console.warn(`⚠️ Model ${model} gagal (${err.message}), mencoba alternatif berikutnya...`);
        lastError = err;
      }
    }

    throw lastError || new Error('Semua model Gemini sedang sibuk. Silakan coba sesaat lagi.');
  },

  /**
   * Panggilan langsung ke Native Google Gemini GenerateContent API
   */
  async sendNativeGemini(messages, systemPrompt, modelName) {
    const model = modelName || env.LLM_MODEL || 'gemini-flash-latest';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${env.LLM_API_KEY}`;

    const contents = [
      {
        role: 'user',
        parts: [{ text: `[INSTRUKSI SISTEM / PANDUAN PENTING]:\n${systemPrompt}` }],
      },
      ...messages.map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      })),
    ];

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API Error (${response.status}): ${errText}`);
    }

    const data = await response.json();
    const candidate = data.candidates?.[0];
    const text = candidate?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error('Gemini API returned empty response');
    }

    return {
      content: text,
      usage: data.usageMetadata || null,
    };
  },

  /**
   * Standard OpenAI-compatible Chat Completions
   */
  async sendOpenAICompatible(messages, systemPrompt, modelName) {
    const baseUrl = env.LLM_BASE_URL.replace(/\/+$/, '');
    const endpoint = baseUrl.endsWith('/chat/completions')
      ? baseUrl
      : `${baseUrl}/chat/completions`;

    const payload = {
      model: modelName || env.LLM_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map((m) => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: m.content,
        })),
      ],
      temperature: 0.7,
      max_tokens: 1024,
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.LLM_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`LLM API error: ${response.status} — ${errorBody}`);
    }

    const data = await response.json();
    const choice = data.choices?.[0];

    if (!choice || !choice.message) {
      throw new Error('LLM API returned no choices');
    }

    return {
      content: choice.message.content,
      usage: data.usage || null,
    };
  },
};

module.exports = llmService;
