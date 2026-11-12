import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { getChatMode, handlePortfolioChat } from "./chatHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, mode: getChatMode() });
});

app.post("/api/chat", async (req, res) => {
  try {
    const result = await handlePortfolioChat(req.body);
    res.status(result.status).json(result.body);
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
