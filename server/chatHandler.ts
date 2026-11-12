import {
  buildPortfolioChatReply,
  buildPortfolioSystemPrompt,
  ChatMessage,
  ChessBoardContext,
} from "../src/utils/portfolioChat.js";

export interface ChatRequestBody {
  messages?: ChatMessage[];
  boardContext?: ChessBoardContext;
}

export interface ChatResult {
  status: number;
  body:
    | { choices: Array<{ message: { role: "assistant"; content: string } }> }
    | { error: string };
}

export function getChatMode(): string {
  if (process.env.GEMINI_API_KEY) return "gemini";
  if (process.env.OPENAI_API_KEY) return "openai";
  return "local-portfolio-assistant";
}

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

/** Handles portfolio chat requests for both Express and Vercel serverless routes. */
export async function handlePortfolioChat(rawBody: unknown): Promise<ChatResult> {
  const body = (rawBody ?? {}) as ChatRequestBody;
  const rawMessages = Array.isArray(body.messages) ? body.messages : [];
  const boardContext = body.boardContext;

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
    return { status: 400, body: { error: "messages array is required" } };
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
    reply = buildPortfolioChatReply(chatTurns, boardContext);
  }

  return {
    status: 200,
    body: {
      choices: [
        {
          message: {
            role: "assistant",
            content: reply,
          },
        },
      ],
    },
  };
}
