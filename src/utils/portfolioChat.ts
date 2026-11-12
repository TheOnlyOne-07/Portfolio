import { portfolioConfig } from "../config/portfolio.js";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChessBoardContext {
  statusText: string;
  moveCount: number;
  lastMoveSan?: string;
  turn: "w" | "b";
  isGameOver: boolean;
  isCheck: boolean;
}

export const SUGGESTED_CHAT_PROMPTS = [
  "Crop patent?",
  "Embedded & IoT",
  "Startups",
  "Cold Outreach",
  "Chess hint?",
  "Contact",
];

export function buildPortfolioSystemPrompt(board?: ChessBoardContext): string {
  const {
    developer,
    education,
    honors,
    social,
    projects,
    experiences,
    contact,
    play,
  } = portfolioConfig;

  const boardLine = board
    ? `\nLive Chess Match:\n- Status: ${board.statusText}\n- Plies played: ${board.moveCount}${
        board.lastMoveSan ? `\n- Last move: ${board.lastMoveSan}` : ""
      }`
    : "";

  return `You are the portfolio chat persona for ${developer.fullName}. Speak in ${developer.name}'s first-person voice ("I", "my", "me") in simple, clear, friendly English. Avoid em dashes. Emphasize that I am focused on Electronics & Telecommunication Engineering (B.E. EnTC, AI minor, Embedded & IoT, microcontrollers, Verilog), and also build backend systems, full-stack web/Android apps, and applied AI. Be honest: use only the facts below and say when something is not known. Never claim a patent for TERRA. The patent application filed under the Indian Patents Act is specifically for the Crop Disease Detection System.

Profile:
- Name: ${developer.fullName}; based in ${social.location}.
- Education: ${education.degree} at ${education.institution} (${education.period}). Coursework: ${education.coursework}.
- Role: ${developer.title}.
- Languages: ${developer.languages.join(", ")}.
- Honors & Athletics: ${honors.join("; ")}.

Experience & Ventures:
${experiences
  .map((e) => `- ${e.position} at ${e.company} (${e.period}): ${e.description}`)
  .join("\n")}

Projects:
${projects
  .map((p) => `- ${p.title} (${p.category}): ${p.description} [${p.technologies}]`)
  .join("\n")}

Contact:
- Email: ${contact.email}${contact.phone ? `\n- Phone: ${contact.phone}` : ""}
- GitHub: ${contact.github}
- LinkedIn: ${contact.linkedin}
- Instagram: ${contact.instagram}
- Chess engine: ${play.opponentRating}${boardLine}`;
}

export function buildPortfolioChatReply(
  messages: ChatMessage[],
  board?: ChessBoardContext
): string {
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  const query = (lastUser?.content || "").trim();
  const q = query.toLowerCase();
  const {
    developer,
    education,
    honors,
    about,
    projects,
    experiences,
    skills,
    contact,
    social,
    play,
  } = portfolioConfig;

  if (!q) {
    return `Hey! I'm ${developer.fullName}. Ask me about my patent-filed Crop Disease Detection System, Embedded & IoT work, TERRA, my startups, or challenge me on the chess board!`;
  }

  // Greetings & courtesy
  if (
    /^(hi|hello|hey|yo|hola|sup|namaste|good\s*(morning|afternoon|evening)|howdy)\b[!?. ]*$/i.test(
      q
    )
  ) {
    return `Hey there! I'm ${developer.name}. Make your move on the board or ask me about my electronics and embedded work, my filed patent, projects, or startups.`;
  }
  if (/how are you|what's up|whats up|how's it going/i.test(q)) {
    return `Doing well, thanks for asking! Always tinkering with embedded hardware, backend APIs, and applied AI. How is the chess game going, or what would you like to check out?`;
  }
  if (/^(thanks|thank you|thx|cool|awesome|nice|great|gg)\b[!?. ]*$/i.test(q)) {
    return `Glad to help! Let me know if you want details on any project, my contact info, or tips for our chess match.`;
  }

  // Live chess state & strategy
  if (
    /\b(chess|elo|engine|opening|checkmate|stalemate|hint|move|board|turn|stockfish|minimax|alpha-beta|status|game)\b/i.test(
      q
    )
  ) {
    const liveSummary =
      board && board.moveCount > 0
        ? ` Right now we are ${board.moveCount} half-moves in (${board.statusText}${
            board.lastMoveSan ? `, last move ${board.lastMoveSan}` : ""
          }).`
        : " Right now the board is fresh on move 1 (White's turn).";
    const tip = board?.isCheck
      ? "Watch the check closely and check all escapes or captures."
      : "Try fighting for center squares (d4/e4/d5/e5), developing knights before bishops, and castling early.";
    return `You are playing against my in-browser ${play.opponentRating} Web Worker engine powered by alpha-beta pruning and chess.js rules.${liveSummary} Tip: ${tip}`;
  }

  // Portfolio website & 3D Minecraft character
  if (
    /\b(minecraft|3d|avatar|character|specs|glasses|voxel|three\.?js|gsap|portfolio\s*site|this\s*site)\b/i.test(
      q
    )
  ) {
    return `I built the portfolio's interactive 3D hero with Three.js and GSAP ScrollTrigger. It features an articulated voxel Minecraft-style developer character with specs, pixel textures, cursor head-tracking, blinking animations, and a desk transition when you scroll.`;
  }

  // Patent / Invention (explicitly Crop Disease Detection System, never TERRA)
  if (/\b(patent|ip|invention|crop)\b/i.test(q)) {
    return `I filed a patent under the Indian Patents Act for my Crop Disease Detection System. It detects 39 plant diseases from leaf images using PyTorch and TensorFlow CNN models, paired with a camera rover, a React/Django web platform, and Google Maps API.`;
  }

  // Badminton / Honors / Achievements
  if (
    /\b(badminton|sport|sports|award|awards|honor|honors|achievement|achievements)\b/i.test(
      q
    )
  ) {
    return `Outside engineering, I compete in District-level Badminton! On the technical side, I filed a patent application under the Indian Patents Act for my Crop Disease Detection System.`;
  }

  // Education / Coursework / Languages
  if (
    /\b(education|college|degree|university|aissms|entc|cgpa|coursework|languages?|speak|graduation)\b/i.test(
      q
    )
  ) {
    return `I am studying ${education.degree} at ${education.institution} (${education.period}, ${education.location}). Key coursework includes ${education.coursework}. I speak ${developer.languages.join(
      ", "
    )}.`;
  }

  // Contact / Social / Resume
  if (
    /\b(contact|email|mail|phone|number|call|hire|reach|linkedin|github|instagram|insta|resume|cv|social)\b/i.test(
      q
    )
  ) {
    const phonePart = contact.phone ? ` or ${contact.phone}` : "";
    return `You can reach me at ${contact.email}${phonePart}.\n- GitHub: ${contact.github}\n- LinkedIn: ${contact.linkedin}\n- Instagram: ${contact.instagram}\nYou can also open my Resume from the RESUME button on the home page.`;
  }

  // Startups & Experience
  if (
    /\b(vayu|run\s*club|dotblackmedia|agency|ieee|tesa|co-founder|founder|intern|startup|ventures?)\b/i.test(
      q
    )
  ) {
    const expList = experiences
      .slice(0, 4)
      .map((e) => `- ${e.position}, ${e.company} (${e.period}): ${e.description}`)
      .join("\n");
    return `Here are my ventures and roles:\n${expList}`;
  }

  // Score specific projects by title, category, technologies, and keywords
  const tokens = q.split(/[^a-z0-9+.#-]+/).filter((t) => t.length >= 3);
  let bestProject: (typeof projects)[number] | null = null;
  let bestScore = 0;

  for (const project of projects) {
    const titleLower = project.title.toLowerCase();
    const haystack = `${titleLower} ${project.category.toLowerCase()} ${project.technologies.toLowerCase()} ${project.description.toLowerCase()}`;
    let score = 0;
    if (q.includes(titleLower)) score += 10;
    for (const tok of tokens) {
      if (titleLower.includes(tok)) score += 4;
      else if (haystack.includes(tok)) score += 1;
    }
    if (score > bestScore) {
      bestScore = score;
      bestProject = project;
    }
  }

  const specificProjectRequested =
    bestProject &&
    (bestScore >= 4 ||
      /\b(terra|crop|plant|rover|outreach|lead|email|ration|delivery|gps|h3)\b/i.test(
        q
      ));

  if (bestProject && specificProjectRequested) {
    const linkNote = bestProject.link
      ? bestProject.link.startsWith("/")
        ? " You are trying it right now on this page!"
        : ` GitHub: ${bestProject.link}`
      : "";
    return `${bestProject.title} (${bestProject.category}): ${bestProject.description} Built with ${bestProject.technologies}.${linkNote}`;
  }

  // Projects overview
  if (/\b(projects?|works?|portfolio|built|build|apps?|repos?)\b/i.test(q)) {
    const summary = projects
      .slice(0, 5)
      .map((p) => `- ${p.title} (${p.category}): ${p.technologies}`)
      .join("\n");
    return `Here are the main systems I have built:\n${summary}\n\nVisit /myworks to browse all projects, or ask me about any specific one!`;
  }

  // Skills / Electronics / Embedded / Tech stack
  if (
    /\b(skills?|stack|tech|technologies|frameworks?|tools?|electronics|hardware|embedded|iot|pic18f|verilog|pcb|pwm|sensor|mpu6050|hc-05|python|node|django|react|ai|ml|cnn|pytorch|tensorflow|supabase|capacitor|aws)\b/i.test(
      q
    )
  ) {
    return `I work across Electronics & Embedded IoT as well as Backend, Full-Stack, and Applied AI:\n- ${skills.develop.title}: ${skills.develop.tools.join(
      ", "
    )}\n- ${skills.design.title}: ${skills.design.tools.join(", ")}`;
  }

  // About / Bio / Career / Location
  if (
    /(who are you|\babout\b|\bbio\b|\bbackground\b|\bexperience\b|\bcareer\b|work history|\blocation\b|where are you|pune|kharadi)/i.test(
      q
    )
  ) {
    return `I am ${developer.fullName} in ${social.location} (${education.degree}, ${education.period}). ${about.description}\n\nHighlights: ${honors.join(
      " | "
    )}.`;
  }

  // Coding / general help
  if (/\b(code|debug|typescript|api|optimize|help me)\b/i.test(q)) {
    return `Happy to chat through code! I build with Python, Django, Node.js, React, Capacitor, PyTorch, TensorFlow, Verilog, and PIC18F microcontrollers. Tell me what you are working on.`;
  }

  return `I am ${developer.fullName} (${developer.title}) in ${social.location}. Try asking about my Crop Disease Detection patent, Embedded & IoT coursework, TERRA, Cold Outreach, Vayu Run Club, dotblackmedia, or our live chess game!`;
}
