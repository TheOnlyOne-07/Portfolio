# Interactive 3D Developer Portfolio

A full-stack interactive 3D developer portfolio built with **React**, **TypeScript**, **Three.js**, **GSAP + ScrollTrigger**, **Lenis**, **Chess.js**, and **Express**.

## Quick Start

```bash
npm install
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3001` (`/api/chat`, `/api/health`)

## Production Build & Run

```bash
npm run build
npm start
```

## Customization

Edit `src/config/portfolio.ts` to update:
- Your name, initials, title, hero roles, bio, and location
- Email & social links
- Experience timeline & skills
- Projects & custom images/videos
- Tech stack icons
- Optional `.glb` 3D character model, `.hdr` environment, `.webm` video, or `resume.pdf`

## 3D Character Rig

The hero and *What I Do* sections feature a custom articulated Three.js voxel Minecraft-style developer character with specs (`src/components/Character/minecraftCharacter.ts`), pixel-art canvas textures, cursor head tracking, typing animations, blinking eyelids, and a desk/monitor reveal. You can also drop any custom `.glb` avatar into `public/models/` and set `media.characterModelUrl` in `src/config/portfolio.ts`.

## Optional LLM Chat Key

Copy `.env.example` to `.env` and add either `GEMINI_API_KEY` or `OPENAI_API_KEY` to power `/api/chat` on the `/play` page with a live LLM. Without a key, `/api/chat` runs the built-in portfolio assistant automatically.

