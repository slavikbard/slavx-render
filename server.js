require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'web')));

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

app.post('/api/generate-news', async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: 'GEMINI_API_KEY not configured' });
  }

  const { hebrewText, category } = req.body;
  if (!hebrewText || !hebrewText.trim()) {
    return res.status(400).json({ error: 'Missing hebrewText' });
  }

  const categoryHint = category ? `\nПредпочтительная категория: ${category}` : '';

  const prompt = `Ты профессиональный русскоязычный новостной редактор медиа-издания для русскоязычной общины Израиля.
Твоя редакционная позиция — правоцентристская/консервативная, произраильская, аналитически строгая.
Тон — уверенный, профессиональный, не агрессивный. Ты обращаешься к русскоязычным израильтянам.

Исходный текст новости на иврите:
"${hebrewText.trim()}"
${categoryHint}

Создай JSON-объект со следующими полями:

1. "id" — короткий kebab-case ID на основе темы (латиницей)
2. "headline" — ёмкий заголовок на русском (макс. 60 символов). Прямой, активный залог.
3. "subheadline" — одно предложение контекста на русском (макс. 100 символов).
4. "bodyLines" — массив из 3-5 коротких предложений на русском (каждое макс. 80 символов).
   Они будут появляться по одному в видео. Требования:
   - Изложить основные факты чётко
   - Включить релевантные цифры/имена
   - Подходящий темп для TikTok (короткие, ударные фразы)
5. "category" — одно из: "ПОЛИТИКА", "БЕЗОПАСНОСТЬ", "ЭКОНОМИКА", "ОБЩЕСТВО", "БЛИЖНИЙ ВОСТОК", "ТЕХНОЛОГИИ"
6. "commentaryLine" — одно аналитическое предложение (макс. 120 символов) с правоцентристской израильской позицией:
   - Поддерживает позиции безопасности и суверенитета Израиля
   - Аналитический тон, не провокационный
   - Обращается именно к русско-израильской аудитории
   - Звучит как экспертный комментарий
7. "imagePrompt" — промпт на АНГЛИЙСКОМ для генерации изображения (DALL-E/Midjourney).
   Опиши фотожурналистскую сцену, соответствующую новости.
   Включи: освещение, композицию, настроение. НЕ включай текст в изображение.
   Стиль: "editorial photography, dramatic lighting, cinematic, 9:16 vertical aspect ratio"
8. "sourceDate" — сегодняшняя дата в формате YYYY-MM-DD
9. "originalHebrew" — верни исходный текст на иврите без изменений

ТАКЖЕ создай поле:
10. "tiktokScript" — полный сценарий для TikTok/Instagram Reels на русском.
    Формат:
    [ХУКЛАЙН] Первые 3 секунды — цепляющая фраза
    [ОСНОВА] 3-5 предложений — суть новости
    [КОММЕНТАРИЙ] 1 аналитическое предложение
    [CTA] Призыв к действию (подписка, комментарий)
    [ХЕШТЕГИ] 5-7 хештегов на русском

Верни ТОЛЬКО валидный JSON без markdown-обёрток и пояснений.`;

  try {
    const response = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 2048, temperature: 0.7 },
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error('Gemini API error:', response.status, errBody);
      return res.status(502).json({ error: 'Gemini API error' });
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return res.status(502).json({ error: 'Empty Gemini response' });
    }

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return res.status(502).json({ error: 'Could not parse JSON from Gemini response' });
    }

    const newsItem = JSON.parse(jsonMatch[0]);
    res.json(newsItem);
  } catch (err) {
    console.error('Server error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`News Generator running at http://localhost:${PORT}`);
  if (!process.env.GEMINI_API_KEY) {
    console.warn('  WARNING: GEMINI_API_KEY is not set');
  }
});
