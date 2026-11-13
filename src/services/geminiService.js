/**
 * Optional Gemini API Integration for custom AI rewriting
 * Works alongside the built-in offline heuristic engine
 */

export async function callGeminiCustomEnhance(apiKey, prompt, systemInstruction = '') {
  if (!apiKey) {
    throw new Error('No Gemini API key provided. Please configure it in Settings.');
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const payload = {
    contents: [
      {
        parts: [
          {
            text: systemInstruction ? `${systemInstruction}\n\nTask:\n${prompt}` : prompt
          }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.3,
      topP: 0.8,
      maxOutputTokens: 2048
    }
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || `API request failed with status ${response.status}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  
  if (!text) {
    throw new Error('Received empty response from Gemini API.');
  }

  return text;
}
