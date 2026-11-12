import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import {
  buildPortfolioChatReply,
  buildPortfolioSystemPrompt,
  ChatMessage,
  ChessBoardContext,
} from "../src/utils/portfolioChat.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

async function callGemini(messages: ChatMessage[], apiKey: string): Promise<string> {
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const systemMsg = messages.find((m) => m.role === "system")?.content || "";

  const nonSystem = messages.filter((m) => m.role !== "system");
  // Gemini requires conversation contents to begin with a user turn
  while (nonSystem.length > 0 && nonSystem[0].role !== "user") {
    nonSystem.shift();
  }

  const contents: Array<{ role: "user" | "model"; parts: Array<{ text: string }> }> = [];
  for (const m of nonSystem) {
    const mappedRole = m.role === "assistant" ? "model" : "user";
    const last = contents[contents.length - 1];
    if (last && last.role === mappedRole) {
      last.parts[0].text += `\n${m.content}`;
    } else {
      contents.push({ role: mappedRole, parts: [{ text: m.content }] });
    }
  }

  const resp = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
      model
    )}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        ...(systemMsg
          ? { systemInstruction: { parts: [{ text: systemMsg }] } }
          : {}),
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 512,
        },
      }),
    }
  );

  if (!resp.ok) {
    throw new Error(`Gemini API returned ${resp.status}`);
  }
  const data = (await resp.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  if (!text) throw new Error("Empty Gemini response");
  return text;
}

async function callOpenAI(messages: ChatMessage[], apiKey: string): Promise<string> {
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const resp = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 512,
    }),
  });

  if (!resp.ok) {
    throw new Error(`OpenAI API returned ${resp.status}`);
  }
  const data = (await resp.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error("Empty OpenAI response");
  return text;
}

app.get("/api/health", (_req, res) => {
  const mode = process.env.GEMINI_API_KEY
    ? "gemini"
    : process.env.OPENAI_API_KEY
    ? "openai"
    : "local-portfolio-assistant";
  res.json({ ok: true, mode });
});

app.post("/api/chat", async (req, res) => {
  try {
    const body = req.body as {
      messages?: ChatMessage[];
      boardContext?: ChessBoardContext;
    };
    const rawMessages = Array.isArray(body?.messages) ? body.messages : [];
    const boardContext = body?.boardContext;
    const chatTurns = rawMessages
      .filter(
        (m): m is ChatMessage =>
          Boolean(m) &&
          (m.role === "user" || m.role === "assistant") &&
          typeof m.content === "string" &&
          m.content.trim().length > 0
      )
      .slice(-20)
      .map((m) => ({ role: m.role, content: m.content.trim().slice(0, 1000) }));

    if (chatTurns.length === 0) {
      res.status(400).json({ error: "messages array is required" });
      return;
    }

    const authoritativeMessages: ChatMessage[] = [
      { role: "system", content: buildPortfolioSystemPrompt(boardContext) },
      ...chatTurns,
    ];

    let reply: string;
    if (process.env.GEMINI_API_KEY) {
      try {
        reply = await callGemini(authoritativeMessages, process.env.GEMINI_API_KEY);
      } catch {
        reply = buildPortfolioChatReply(chatTurns, boardContext);
      }
    } else if (process.env.OPENAI_API_KEY) {
      try {
        reply = await callOpenAI(authoritativeMessages, process.env.OPENAI_API_KEY);
      } catch {
        reply = buildPortfolioChatReply(chatTurns, boardContext);
      }
    } else {
      // Simulate brief natural typing feel when using built-in assistant
      await new Promise((r) => setTimeout(r, 240));
      reply = buildPortfolioChatReply(chatTurns, boardContext);
    }

    res.json({
      choices: [
        {
          message: {
            role: "assistant",
            content: reply,
          },
        },
      ],
    });
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ error: "Failed to generate response" });
  }
});

// Serve built production frontend if dist exists
const distDir = path.resolve(__dirname, "..", "dist");
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.use((req, res, next) => {
    if (req.method !== "GET" || req.path.startsWith("/api/")) {
      next();
      return;
    }
    res.sendFile("index.html", { root: distDir });
  });
}

app.listen(PORT, () => {
  console.log(`Portfolio API server running on http://localhost:${PORT}`);
});
