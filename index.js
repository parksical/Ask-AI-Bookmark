const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Active OpenRouter API key
const OPENROUTER_API_KEY = "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";

app.use(cors({ origin: '*' }));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Ask Parker is alive and ready!');
});

app.post('/ask', async (req, res) => {
  const question = req.body.question;
  console.log("📩 Received question:", question);
  console.log("🔑 Using API key:", OPENROUTER_API_KEY?.slice(0, 10) + "...");

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [{ role: "user", content: question }]
      })
    });

    const data = await response.json();
    console.log("📦 OpenRouter response:", JSON.stringify(data, null, 2));

    if (data.error) {
      console.error("❌ OpenRouter error:", data.error);
      return res.json({ answer: "⚠️ OpenRouter error: " + data.error.message });
    }

    const answer = data.choices?.[0]?.message?.content;
    res.json({ answer: answer || "⚠️ OpenRouter gave no answer." });
  } catch (error) {
    console.error("🚨 Error talking to OpenRouter:", error);
    res.json({ answer: "🚨 Error reaching OpenRouter." });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
