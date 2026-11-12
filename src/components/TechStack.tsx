import React, { useEffect, useRef } from "react";
import { portfolioConfig } from "../config/portfolio";

const TechStack: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hasVideo = Boolean(portfolioConfig.media.techStackVideoUrl);

  useEffect(() => {
    if (hasVideo) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = canvas.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.offsetHeight || window.innerHeight);

    const particles = Array.from({ length: 95 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 2 + Math.floor(Math.random() * 4),
      vx: (Math.random() - 0.5) * 0.35,
      vy: -0.15 - Math.random() * 0.45,
      alpha: 0.22 + Math.random() * 0.58,
      hue:
        Math.random() > 0.45
          ? "194, 164, 255"
          : Math.random() > 0.5
          ? "168, 85, 247"
          : "232, 121, 249",
    }));

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth || window.innerWidth;
      height = canvas.height = canvas.offsetHeight || window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    let t = 0;
    let rafId = 0;

    const drawObsidianBlock = (
      bx: number,
      by: number,
      bs: number,
      seed: number
    ) => {
      ctx.fillStyle = "rgba(18, 12, 27, 0.9)";
      ctx.fillRect(bx, by, bs, bs);

      // Subtle purple-obsidian pixel speckles
      const sub = Math.max(4, Math.floor(bs / 4));
      for (let sy = 0; sy < 4; sy++) {
        for (let sx = 0; sx < 4; sx++) {
          const h = ((seed * 31 + sx * 17 + sy * 13) % 19) / 19;
          if (h > 0.72) {
            ctx.fillStyle = "rgba(58, 34, 88, 0.55)";
            ctx.fillRect(bx + sx * sub, by + sy * sub, sub, sub);
          } else if (h < 0.22) {
            ctx.fillStyle = "rgba(8, 5, 13, 0.75)";
            ctx.fillRect(bx + sx * sub, by + sy * sub, sub, sub);
          }
        }
      }

      ctx.strokeStyle = "rgba(147, 51, 234, 0.16)";
      ctx.lineWidth = 1;
      ctx.strokeRect(bx + 0.5, by + 0.5, bs - 1, bs - 1);
    };

    const render = () => {
      t += 0.014;
      ctx.fillStyle = "#0b080c";
      ctx.fillRect(0, 0, width, height);

      const cx = width * 0.5;
      const cy = height * 0.5;

      // Ambient Nether aura behind portal
      const aura = ctx.createRadialGradient(
        cx,
        cy,
        60,
        cx,
        cy,
        Math.max(width, height) * 0.58
      );
      aura.addColorStop(0, "rgba(147, 51, 234, 0.28)");
      aura.addColorStop(0.5, "rgba(126, 34, 206, 0.14)");
      aura.addColorStop(1, "rgba(11, 8, 12, 0)");
      ctx.fillStyle = aura;
      ctx.fillRect(0, 0, width, height);

      // Large Minecraft Nether Portal framing the entire Tech Stack + title
      const blockSize = Math.max(
        26,
        Math.min(44, Math.round(Math.min(width, height) * 0.05))
      );
      const targetW = Math.min(width * 0.92, 1180);
      const targetH = Math.min(height * 0.9, 760);
      const cols = Math.max(10, Math.floor(targetW / blockSize));
      const rows = Math.max(8, Math.floor(targetH / blockSize));
      const portalW = cols * blockSize;
      const portalH = rows * blockSize;
      const px = Math.round(cx - portalW / 2);
      const py = Math.round(cy - portalH / 2);

      const innerX = px + blockSize;
      const innerY = py + blockSize;
      const innerW = portalW - blockSize * 2;
      const innerH = portalH - blockSize * 2;

      // Swirling purple portal core
      const coreGrad = ctx.createRadialGradient(
        cx + Math.sin(t * 0.7) * 24,
        cy + Math.cos(t * 0.6) * 16,
        20,
        cx,
        cy,
        Math.max(innerW, innerH) * 0.62
      );
      coreGrad.addColorStop(0, "rgba(192, 132, 252, 0.25)");
      coreGrad.addColorStop(0.55, "rgba(147, 51, 234, 0.17)");
      coreGrad.addColorStop(1, "rgba(59, 7, 100, 0.08)");
      ctx.fillStyle = coreGrad;
      ctx.fillRect(innerX, innerY, innerW, innerH);

      // Animated pixel vortex tiles inside the Nether Portal
      const cell = Math.max(14, Math.floor(blockSize * 0.55));
      for (let y = innerY; y < innerY + innerH; y += cell) {
        const gy = (y - innerY) / cell;
        for (let x = innerX; x < innerX + innerW; x += cell) {
          const gx = (x - innerX) / cell;
          const wave =
            Math.sin(gx * 0.42 + t * 1.9) * Math.cos(gy * 0.42 - t * 1.5) +
            Math.sin((gx + gy) * 0.28 - t * 1.2) * 0.5;
          const norm = Math.max(0, Math.min(1, (wave + 1.5) / 3));
          const cw = Math.min(cell, innerX + innerW - x);
          const ch = Math.min(cell, innerY + innerH - y);
          ctx.fillStyle = `rgba(${
            norm > 0.58 ? "196, 132, 252" : "147, 51, 234"
          }, ${(0.03 + norm * 0.14).toFixed(3)})`;
          ctx.fillRect(x, y, cw, ch);
        }
      }

      // Soft inner glow edge instead of hard UI line
      const edgeGlow = ctx.createLinearGradient(px, py, px, py + portalH);
      edgeGlow.addColorStop(0, "rgba(168, 85, 247, 0.16)");
      edgeGlow.addColorStop(0.5, "rgba(192, 132, 252, 0.08)");
      edgeGlow.addColorStop(1, "rgba(168, 85, 247, 0.16)");
      ctx.strokeStyle = edgeGlow;
      ctx.lineWidth = 4;
      ctx.strokeRect(innerX, innerY, innerW, innerH);

      // Obsidian voxel frame (top, bottom, left, right columns)
      for (let c = 0; c < cols; c++) {
        drawObsidianBlock(px + c * blockSize, py, blockSize, c + 1);
        drawObsidianBlock(
          px + c * blockSize,
          py + (rows - 1) * blockSize,
          blockSize,
          c + 41
        );
      }
      for (let r = 1; r < rows - 1; r++) {
        drawObsidianBlock(px, py + r * blockSize, blockSize, r + 83);
        drawObsidianBlock(
          px + (cols - 1) * blockSize,
          py + r * blockSize,
          blockSize,
          r + 127
        );
      }

      // Square Minecraft Nether portal particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx + Math.sin(t + i) * 0.15;
        p.y += p.vy;
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.fillStyle = `rgba(${p.hue}, ${p.alpha})`;
        ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
      }

      rafId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
    };
  }, [hasVideo]);

  return (
    <div className="techstack-new">
      <div className="techstack-video-container">
        {hasVideo ? (
          <video autoPlay loop muted playsInline className="techstack-video">
            <source
              src={portfolioConfig.media.techStackVideoUrl}
              type="video/webm"
            />
          </video>
        ) : (
          <canvas ref={canvasRef} className="techstack-video" />
        )}
        <div className="techstack-overlay" />
      </div>

      <div className="techstack-content">
        <h2>Tech Stack</h2>
        <div className="techstack-pyramid">
          {portfolioConfig.techStack.map((row, rowIndex) => (
            <div className="techstack-row" key={rowIndex}>
              {row.map((tech, techIndex) => (
                <a
                  key={techIndex}
                  href={tech.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="techstack-item"
                  title={tech.name}
                  data-cursor="disable"
                >
                  <img
                    src={tech.icon}
                    alt={tech.name}
                    loading="lazy"
                    decoding="async"
                  />
                  <span>{tech.name}</span>
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TechStack;
