export type ApiProvider = 'gemini' | 'openai' | 'anthropic';

export const DEFAULT_MODELS: Record<ApiProvider, string> = {
  gemini: 'gemini-2.5-flash',
  openai: 'gpt-4o',
  anthropic: 'claude-sonnet-5-5'
};

const MAX_OUTPUT_TOKENS = 12000;
const TIMEOUT_MS = 120_000;

async function postJson(url: string, headers: Record<string, string>, body: unknown, label: string): Promise<any> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify(body),
      signal: controller.signal,
      referrerPolicy: 'no-referrer',
      credentials: 'omit'
    });
    const text = await res.text();
    let data: any = null;
    try { data = JSON.parse(text); } catch { /* non-JSON error body */ }
    if (!res.ok) {
      const detail = data?.error?.message ?? data?.message ?? text.slice(0, 200);
      throw new Error(`${label} error ${res.status}: ${detail}`);
    }
    return data;
  } catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError') throw new Error(`${label} request timed out`);
    if (e instanceof TypeError) throw new Error(`${label} request failed (network or CORS). Check your connection.`);
    throw e;
  } finally {
    clearTimeout(timer);
  }
}

/** Calls the provider directly from the browser. The key only ever goes to the provider's own API host. */
export async function callLLM(provider: ApiProvider, apiKey: string, model: string, prompt: string): Promise<string> {
  const key = apiKey.trim();
  if (provider === 'gemini') {
    const data = await postJson(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
      { 'x-goog-api-key': key },
      {
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: MAX_OUTPUT_TOKENS, responseMimeType: 'application/json' }
      },
      'Gemini'
    );
    const text = data?.candidates?.[0]?.content?.parts?.map((p: any) => p.text ?? '').join('');
    if (!text) throw new Error('Gemini returned no content (possibly blocked or empty).');
    return text;
  }
  if (provider === 'openai') {
    const data = await postJson(
      'https://api.openai.com/v1/chat/completions',
      { Authorization: `Bearer ${key}` },
      {
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: MAX_OUTPUT_TOKENS,
        response_format: { type: 'json_object' }
      },
      'OpenAI'
    );
    const text = data?.choices?.[0]?.message?.content;
    if (!text) throw new Error('OpenAI returned no content.');
    return text;
  }
  const data = await postJson(
    'https://api.anthropic.com/v1/messages',
    {
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    { model, max_tokens: MAX_OUTPUT_TOKENS, messages: [{ role: 'user', content: prompt }] },
    'Anthropic'
  );
  const text = data?.content?.map((c: any) => c.text ?? '').join('');
  if (!text) throw new Error('Anthropic returned no content.');
  return text;
}
