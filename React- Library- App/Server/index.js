
import express from "express";
import cors from "cors";
import "dotenv/config";

const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.use(
  cors({
    origin: (process.env.CORS_ORIGIN || "http://localhost:5173")
      .split(",")
      .map((origin) => origin.trim()),
  })
);

app.use(express.json({ limit: "10kb" }));

const requests = new Map();
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 10;

app.post("/api/summarize", async (req, res) => {
  const ip = req.ip;
  const now = Date.now();
  const previous = requests.get(ip);

  if (previous && now - previous.startedAt < WINDOW_MS) {
    if (previous.count >= MAX_REQUESTS) {
      return res.status(429).json({
        error: "Too many summary requests. Please try again shortly.",
      });
    }
    previous.count += 1;
  } else {
    requests.set(ip, { startedAt: now, count: 1 });
  }

  const { title, author } = req.body || {};

  if (
    typeof title !== "string" ||
    typeof author !== "string" ||
    !title.trim() ||
    !author.trim() ||
    title.length > 300 ||
    author.length > 200
  ) {
    return res.status(400).json({
      error: "A valid book title and author are required.",
    });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(503).json({
      error: "AI summarization is not configured on the server.",
    });
  }

  const model = process.env.GEMINI_MODEL || "gemini-3.8-flash";
  const endpoint =
    `https://generativelanguage.googleapis.com/v1beta/models/` +
    `${encodeURIComponent(model)}:generateContent`;

  const prompt = `
You are a careful book-identification and summarization assistant.

Identify the specific work using only the title and author supplied below.
Do not claim that you accessed or read the original book text.

If you cannot reliably identify the work, or multiple works could match,
return known=false and explain the uncertainty. Do not invent plot points,
characters, chapters, arguments, quotations, or conclusions.

If you can identify it reliably:
- For fiction, summarize the storyline, important developments, and themes.
- Label significant spoilers clearly.
- For nonfiction, summarize the thesis, major concepts, arguments, and
  conclusions.
- Do not fabricate details to fill gaps.

Title: ${JSON.stringify(title.trim())}
Author: ${JSON.stringify(author.trim())}
`;

  try {
    const response = await fetch(`${endpoint}?key=${process.env.GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              known: { type: "BOOLEAN" },
              summary: { type: "STRING" },
              reason: { type: "STRING" },
            },
            required: ["known", "summary", "reason"],
          },
        },
      }),
    });

    if (!response.ok) {
      // Do not forward provider response bodies or secrets to the client.
      console.error("Gemini request failed with status:", response.status);
      return res.status(502).json({
        error: "The AI provider could not generate a summary. Please retry.",
      });
    }

    const result = await response.json();
    const text = result.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || "")
      .join("");

    if (!text) {
      return res.status(502).json({
        error: "The AI returned an empty response. Please retry.",
      });
    }

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      return res.status(502).json({
        error: "The AI returned an invalid response. Please retry.",
      });
    }

    if (
      typeof parsed.known !== "boolean" ||
      typeof parsed.summary !== "string" ||
      typeof parsed.reason !== "string"
    ) {
      return res.status(502).json({
        error: "The AI returned an invalid response. Please retry.",
      });
    }

    if (!parsed.known) {
      return res.status(200).json({
        summary:
          parsed.reason.trim() ||
          "I cannot reliably identify this book from its title and author.",
        uncertain: true,
      });
    }

    if (!parsed.summary.trim()) {
      return res.status(502).json({
        error: "The AI could not produce a useful summary. Please retry.",
      });
    }

    return res.json({
      summary: parsed.summary.trim(),
      uncertain: false,
    });
  } catch (error) {
    console.error("Summary endpoint error:", error.message);
    return res.status(500).json({
      error: "An unexpected error occurred. Please try again.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Summary API listening on port ${PORT}`);
});
