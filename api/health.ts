import { getChatMode } from "../server/chatHandler.js";

interface ServerlessRes {
  status: (code: number) => ServerlessRes;
  json: (data: unknown) => void;
}

/** Vercel serverless healthcheck endpoint for GET /api/health. */
export default function handler(_req: unknown, res: ServerlessRes) {
  res.status(200).json({ ok: true, mode: getChatMode() });
}
