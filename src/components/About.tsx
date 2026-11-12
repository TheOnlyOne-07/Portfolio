import React from "react";
import { portfolioConfig } from "../config/portfolio";

const About: React.FC = () => {
  return (
    <div className="about-section" id="about">
      <div className="about-me">
        <h3 className="title">{portfolioConfig.about.title}</h3>
        <p className="para">{portfolioConfig.about.description}</p>
      </div>
    </div>
  );
};

export default About;
