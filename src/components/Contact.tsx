import React, { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { portfolioConfig } from "../config/portfolio";

gsap.registerPlugin(ScrollTrigger);

const ArrowOutwardIcon = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor">
    <path fill="none" d="M0 0h24v24H0z" />
    <path d="M6 6v2h8.59L5 17.59 6.41 19 16 9.41V18h2V6z" />
  </svg>
);

const CopyrightIcon = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor">
    <path fill="none" d="M0 0h24v24H0z" />
    <path d="M11.88 9.14c1.28.06 1.61 1.15 1.63 1.66h1.79c-.08-1.98-1.49-3.19-3.45-3.19C9.64 7.61 8 9 8 12.14c0 1.94.93 4.24 3.84 4.24 2.22 0 3.41-1.65 3.44-2.95h-1.79c-.03.59-.45 1.38-1.63 1.44-1.31-.04-1.86-1.06-1.86-2.73 0-2.89 1.28-2.98 1.88-3zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
  </svg>
);

const Contact: React.FC = () => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".contact-section",
        start: "top 80%",
        end: "bottom center",
        toggleActions: "play none none none",
      },
    });

    tl.fromTo(
      ".contact-section h3",
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    ).fromTo(
      ".contact-box",
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: "power3.out" },
      "-=0.4"
    );

    return () => {
      tl.kill();
    };
  }, []);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(portfolioConfig.contact.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback ignored
    }
  };

  const socialItems = [
    { label: "Github", url: portfolioConfig.contact.github },
    { label: "Linkedin", url: portfolioConfig.contact.linkedin },
    { label: "Twitter", url: portfolioConfig.contact.twitter },
    { label: "Facebook", url: portfolioConfig.contact.facebook },
    { label: "Instagram", url: portfolioConfig.contact.instagram },
  ].filter((item) => Boolean(item.url));

  return (
    <div className="contact-section section-container" id="contact">
      <div className="contact-container">
        <h3>{portfolioConfig.developer.fullName}</h3>
        <div className="contact-flex">
          <div className="contact-box">
            <h4>Email</h4>
            <p className="contact-email-row">
              <a
                href={`mailto:${portfolioConfig.contact.email}`}
                data-cursor="disable"
              >
                {portfolioConfig.contact.email}
              </a>
              <button
                type="button"
                className="copy-email-btn"
                onClick={handleCopyEmail}
                data-cursor="disable"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </p>
            {portfolioConfig.contact.phone && (
              <>
                <h4>Phone</h4>
                <p>
                  <a
                    href={`tel:${portfolioConfig.contact.phone.replace(/\s+/g, "")}`}
                    data-cursor="disable"
                  >
                    {portfolioConfig.contact.phone}
                  </a>
                </p>
              </>
            )}
            <h4>Location</h4>
            <p>
              <span>{portfolioConfig.social.location}</span>
            </p>
          </div>

          <div className="contact-box">
            <h4>Social</h4>
            {socialItems.map((item) => (
              <a
                key={item.label}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="disable"
                className="contact-social"
              >
                {item.label} <ArrowOutwardIcon />
              </a>
            ))}
          </div>

          <div className="contact-box">
            <h2>
              Designed and Developed <br /> by{" "}
              <span>{portfolioConfig.developer.fullName}</span>
            </h2>
            <h5>
              <CopyrightIcon /> {new Date().getFullYear()}
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
