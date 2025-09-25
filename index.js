const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Ask Parker is alive and ready!');
});

app.post('/ask', async (req, res) => {
  const question = req.body.question;
  console.log("Received question:", question);
  console.log("Using API key:", OPENROUTER_API_KEY?.slice(0, 10) + "...");

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "mistral/mistral-7b-instruct",
        messages: [{ role: "user", content: question }]
      })
    });

    const data = await response.json();
    console.log("OpenRouter response:", JSON.stringify(data, null, 2));

    const answer = data.choices?.[0]?.message?.content;
    if (answer) {
      res.json({ answer });
    } else {
      res.json({ answer: "OpenRouter gave no answer." });
    }
  } catch (error) {
    console.error("Error talking to OpenRouter:", error);
    res.json({ answer: "Error reaching OpenRouter." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
