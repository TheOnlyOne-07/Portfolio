import React, { useEffect, useState } from "react";
import HoverLinks from "./HoverLinks";
import ResumeModal from "./ResumeModal";
import { portfolioConfig } from "../config/portfolio";

const GithubIcon = () => (
  <svg viewBox="0 0 496 512" width="1em" height="1em" fill="currentColor">
    <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8z" />
  </svg>
);

const LinkedinIcon = () => (
  <svg viewBox="0 0 448 512" width="1em" height="1em" fill="currentColor">
    <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 512 512" width="1em" height="1em" fill="currentColor">
    <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 448 512" width="1em" height="1em" fill="currentColor">
    <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
  </svg>
);

const ResumeDocIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 3m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z" />
    <path d="M9 7l6 0" />
    <path d="M9 11l6 0" />
    <path d="M9 15l4 0" />
  </svg>
);

const SocialIcons: React.FC = () => {
  const [resumeOpen, setResumeOpen] = useState(false);

  useEffect(() => {
    const social = document.getElementById("social");
    if (!social) return;

    const cleanups: Array<() => void> = [];

    social.querySelectorAll("span").forEach((elem) => {
      const link = elem.querySelector("a");
      if (!link) return;

      const rect = elem.getBoundingClientRect();
      let mouseX = rect.width / 2;
      let mouseY = rect.height / 2;
      let currentX = 0;
      let currentY = 0;
      let rafId = 0;

      const updatePosition = () => {
        currentX += (mouseX - currentX) * 0.1;
        currentY += (mouseY - currentY) * 0.1;
        link.style.setProperty("--siLeft", `${currentX}px`);
        link.style.setProperty("--siTop", `${currentY}px`);
        rafId = requestAnimationFrame(updatePosition);
      };

      const onMouseMove = (e: MouseEvent) => {
        const box = elem.getBoundingClientRect();
        const x = e.clientX - box.left;
        const y = e.clientY - box.top;
        if (x < 40 && x > 10 && y < 40 && y > 5) {
          mouseX = x;
          mouseY = y;
        } else {
          mouseX = box.width / 2;
          mouseY = box.height / 2;
        }
      };

      document.addEventListener("mousemove", onMouseMove);
      rafId = requestAnimationFrame(updatePosition);

      cleanups.push(() => {
        cancelAnimationFrame(rafId);
        document.removeEventListener("mousemove", onMouseMove);
      });
    });

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, []);

  const handleResumeClick = (e: React.MouseEvent) => {
    if (portfolioConfig.media.resumePdfUrl) {
      return;
    }
    e.preventDefault();
    setResumeOpen(true);
  };

  return (
    <>
      <div className="icons-section">
        <div className="social-icons" data-cursor="icons" id="social">
          {portfolioConfig.contact.github && (
            <span>
              <a
                href={portfolioConfig.contact.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <GithubIcon />
              </a>
            </span>
          )}
          {portfolioConfig.contact.linkedin && (
            <span>
              <a
                href={portfolioConfig.contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <LinkedinIcon />
              </a>
            </span>
          )}
          {portfolioConfig.contact.twitter && (
            <span>
              <a
                href={portfolioConfig.contact.twitter}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X Twitter"
              >
                <XIcon />
              </a>
            </span>
          )}
          {portfolioConfig.contact.instagram && (
            <span>
              <a
                href={portfolioConfig.contact.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <InstagramIcon />
              </a>
            </span>
          )}
        </div>

        <a
          className="resume-button"
          href={portfolioConfig.media.resumePdfUrl || "#resume"}
          target={portfolioConfig.media.resumePdfUrl ? "_blank" : undefined}
          rel={
            portfolioConfig.media.resumePdfUrl
              ? "noopener noreferrer"
              : undefined
          }
          onClick={handleResumeClick}
        >
          <HoverLinks text="RESUME" />
          <span>
            <ResumeDocIcon />
          </span>
        </a>
      </div>

      <ResumeModal isOpen={resumeOpen} onClose={() => setResumeOpen(false)} />
    </>
  );
};

export default SocialIcons;
