import { handlePortfolioChat } from "../server/chatHandler.js";

interface ServerlessReq {
  method?: string;
  body?: unknown;
}

interface ServerlessRes {
  status: (code: number) => ServerlessRes;
  json: (data: unknown) => void;
  setHeader: (name: string, value: string) => void;
}

/** Vercel serverless endpoint for POST /api/chat. */
export default async function handler(req: ServerlessReq, res: ServerlessRes) {
  if (req.method === "OPTIONS") {
    res.setHeader("Allow", "POST, OPTIONS");
    res.status(204).json({});
    return;
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const rawBody =
      typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const result = await handlePortfolioChat(rawBody);
    res.status(result.status).json(result.body);
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ error: "Failed to generate response" });
  }
}
