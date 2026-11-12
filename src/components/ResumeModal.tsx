import React, { useEffect } from "react";
import { portfolioConfig } from "../config/portfolio";
import "../styles/ResumeModal.css";

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const {
    developer,
    education,
    honors,
    social,
    about,
    experiences,
    projects,
    skills,
    contact,
  } = portfolioConfig;

  const handlePrintPdf = () => {
    const printWin = window.open("", "_blank", "width=900,height=1050");
    if (!printWin) return;
    const expHtml = experiences
      .slice(0, 4)
      .map(
        (exp) => `
      <div class="item">
        <div class="row"><strong>${exp.position}, ${exp.company}</strong><span>${exp.period}</span></div>
        <p>${exp.description}</p>
        <ul>${exp.responsibilities.map((r) => `<li>${r}</li>`).join("")}</ul>
      </div>`
      )
      .join("");

    const projHtml = projects
      .slice(0, 4)
      .map(
        (p) => `
      <div class="item">
        <div class="row"><strong>${p.title} (${p.category})</strong><span>${p.technologies}</span></div>
        <p>${p.description}</p>
      </div>`
      )
      .join("");

    printWin.document.write(`<!DOCTYPE html>
<html>
<head>
  <title>${developer.fullName} - Resume</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; color: #111; max-width: 820px; margin: 32px auto; padding: 0 24px; line-height: 1.45; }
    header { display: flex; justify-content: space-between; border-bottom: 2px solid #5400ff; padding-bottom: 12px; margin-bottom: 18px; }
    h1 { margin: 0 0 4px; font-size: 26px; }
    .role { color: #5400ff; font-weight: 600; font-size: 14px; }
    .meta { text-align: right; font-size: 12px; color: #444; }
    h2 { font-size: 13px; text-transform: uppercase; letter-spacing: 1.2px; color: #5400ff; border-bottom: 1px solid #ddd; padding-bottom: 4px; margin: 18px 0 10px; }
    .item { margin-bottom: 12px; }
    .row { display: flex; justify-content: space-between; gap: 12px; font-size: 13px; }
    p { margin: 4px 0; font-size: 12.5px; color: #222; }
    ul { margin: 4px 0 0; padding-left: 18px; font-size: 12px; color: #333; }
    @media print { body { margin: 0; } }
  </style>
</head>
<body>
  <header>
    <div>
      <h1>${developer.fullName}</h1>
      <div class="role">${developer.title}</div>
    </div>
    <div class="meta">
      <div>${contact.email}</div>
      ${contact.phone ? `<div>${contact.phone}</div>` : ""}
      <div>${social.location}</div>
      <div>${contact.github}</div>
    </div>
  </header>
  <p>${about.description}</p>
  <h2>Education</h2>
  <div class="item">
    <div class="row"><strong>${education.institution}</strong><span>${education.period}</span></div>
    <p>${education.degree} (${education.location})</p>
    <p>Coursework: ${education.coursework}</p>
  </div>
  <h2>Professional Experience</h2>
  ${expHtml}
  <h2>Selected Projects</h2>
  ${projHtml}
  <h2>Core Skills &amp; Honors</h2>
  <p><strong>${skills.develop.title}:</strong> ${skills.develop.tools.join(", ")}</p>
  <p><strong>${skills.design.title}:</strong> ${skills.design.tools.join(", ")}</p>
  <p><strong>Languages:</strong> ${developer.languages.join(", ")}</p>
  <ul>${honors.map((h) => `<li>${h}</li>`).join("")}</ul>
</body>
</html>`);
    printWin.document.close();
    printWin.focus();
    setTimeout(() => printWin.print(), 250);
  };

  return (
    <div
      className="resume-modal-backdrop"
      onClick={onClose}
      data-cursor="disable"
    >
      <div
        className="resume-modal-shell"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Resume Preview"
      >
        <div className="resume-modal-toolbar">
          <h3>Resume // {developer.fullName}</h3>
          <div className="resume-modal-actions">
            <button
              type="button"
              className="resume-action-btn primary"
              onClick={handlePrintPdf}
            >
              Download / Print PDF
            </button>
            <button
              type="button"
              className="resume-action-btn"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>

        <div className="resume-sheet">
          <div className="resume-sheet-header">
            <div>
              <h1>{developer.fullName}</h1>
              <div className="resume-role">{developer.title}</div>
            </div>
            <div className="resume-contact-list">
              <span>{contact.email}</span>
              {contact.phone && <span>{contact.phone}</span>}
              <span>{social.location}</span>
              <span>github.com/{social.githubHandle}</span>
            </div>
          </div>

          <div className="resume-section">
            <h4>Summary</h4>
            <p style={{ margin: 0, fontSize: "14px", color: "#ffffffd9" }}>
              {about.description}
            </p>
          </div>

          <div className="resume-section">
            <h4>Education</h4>
            <div className="resume-entry">
              <div className="resume-entry-head">
                <span>{education.institution}</span>
                <span style={{ color: "var(--accentCyan)", fontSize: "13px" }}>
                  {education.period}
                </span>
              </div>
              <div className="resume-entry-sub">
                {education.degree} • {education.location}
              </div>
              <p
                style={{
                  margin: "4px 0 0",
                  fontSize: "12.5px",
                  color: "#ffffffb8",
                }}
              >
                Relevant coursework: {education.coursework}
              </p>
            </div>
          </div>

          <div className="resume-section">
            <h4>Professional Experience</h4>
            {experiences.slice(0, 4).map((exp, idx) => (
              <div className="resume-entry" key={idx}>
                <div className="resume-entry-head">
                  <span>{exp.position}</span>
                  <span style={{ color: "var(--accentColor)", fontSize: "13px" }}>
                    {exp.period}
                  </span>
                </div>
                <div className="resume-entry-sub">
                  {exp.company} • {exp.location}
                </div>
                <ul>
                  {exp.responsibilities.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="resume-section">
            <h4>Selected Projects</h4>
            {projects.slice(0, 4).map((proj) => (
              <div className="resume-entry" key={proj.id}>
                <div className="resume-entry-head">
                  <span>{proj.title}</span>
                  <span style={{ color: "var(--accentCyan)", fontSize: "12px" }}>
                    {proj.category}
                  </span>
                </div>
                <p
                  style={{
                    margin: "4px 0",
                    fontSize: "13px",
                    color: "#ffffffcc",
                  }}
                >
                  {proj.description}
                </p>
                <span style={{ fontSize: "12px", color: "#ffffff80" }}>
                  Stack: {proj.technologies}
                </span>
              </div>
            ))}
          </div>

          <div className="resume-section">
            <h4>Core Competencies &amp; Honors</h4>
            <div className="resume-skills-grid">
              <div className="resume-skill-box">
                <strong>{skills.develop.title}</strong>
                <span>{skills.develop.tools.join(" • ")}</span>
              </div>
              <div className="resume-skill-box">
                <strong>{skills.design.title}</strong>
                <span>{skills.design.tools.join(" • ")}</span>
              </div>
            </div>
            <ul style={{ marginTop: "12px", paddingLeft: "18px", fontSize: "13px", color: "#ffffffcc" }}>
              {honors.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
              <li>Languages: {developer.languages.join(", ")}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeModal;
