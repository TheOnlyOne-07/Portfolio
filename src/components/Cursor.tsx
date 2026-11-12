import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const Cursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let hover = false;
    const cursor = cursorRef.current;
    if (!cursor) return;

    const mousePos = { x: -100, y: -100 };
    const cursorPos = { x: -100, y: -100 };
    let rafId = 0;

    const onMouseMove = (e: MouseEvent) => {
      mousePos.x = e.clientX;
      mousePos.y = e.clientY;
    };

    document.addEventListener("mousemove", onMouseMove);

    const loop = () => {
      if (!hover && cursor) {
        const delay = 6;
        cursorPos.x += (mousePos.x - cursorPos.x) / delay;
        cursorPos.y += (mousePos.y - cursorPos.y) / delay;
        gsap.to(cursor, {
          x: cursorPos.x,
          y: cursorPos.y,
          duration: 0.1,
        });
      }
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    const onMouseOver = (e: Event) => {
      const target = (e.target as HTMLElement | null)?.closest<HTMLElement>(
        "[data-cursor]"
      );
      if (!target || !cursor) return;
      const mode = target.dataset.cursor;
      const rect = target.getBoundingClientRect();

      if (mode === "icons") {
        cursor.classList.add("cursor-icons");
        gsap.to(cursor, {
          x: rect.left,
          y: rect.top,
          duration: 0.1,
        });
        cursor.style.setProperty("--cursorH", `${rect.height}px`);
        hover = true;
      } else if (mode === "disable") {
        cursor.classList.add("cursor-disable");
      }
    };

    const onMouseOut = (e: Event) => {
      const target = (e.target as HTMLElement | null)?.closest<HTMLElement>(
        "[data-cursor]"
      );
      if (!target || !cursor) return;
      cursor.classList.remove("cursor-disable", "cursor-icons");
      hover = false;
    };

    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
    };
  }, []);

  return <div className="cursor-main" ref={cursorRef} />;
};

export default Cursor;
