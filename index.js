const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// ✅ Hardcoded OpenRouter API key
const OPENROUTER_API_KEY = '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';
const MODEL = 'mistralai/mistral-7b-instruct';

// 🧪 Debug log to confirm key is loading
console.log('Using API key:', OPENROUTER_API_KEY);

app.get('/', (req, res) => {
  res.send('Your AI proxy server is running!');
});

app.post('/ask', async (req, res) => {
  const question = req.body.question;
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: 'user', content: question }]
      })
    });

    const data = await response.json();
    console.log('OpenRouter response:', data);

    const answer = data.choices?.[0]?.message?.content || 'No response';
    console.log('Final answer:', answer);
    res.json({ answer });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log('Proxy server running on port 3000'));
