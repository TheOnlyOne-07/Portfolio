import React from "react";
import { portfolioConfig } from "../config/portfolio";

const Career: React.FC = () => {
  const formatPeriod = (period: string) => {
    if (period.includes("Present")) return "NOW";
    if (period.includes(" - ")) return period.split(" - ")[0];
    return period;
  };

  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My career <span>&amp;</span>
          <br />
          experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot" />
          </div>
          {portfolioConfig.experiences.map((exp, index) => (
            <div className="career-info-box" key={index}>
              <div className="career-info-in">
                <div className="career-role">
                  <h4>{exp.position}</h4>
                  <h5>{exp.company}</h5>
                </div>
                <h3>{formatPeriod(exp.period)}</h3>
              </div>
              <p>{exp.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Career;
