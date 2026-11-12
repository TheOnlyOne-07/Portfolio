import React from "react";
import { portfolioConfig } from "../config/portfolio";

interface LandingProps {
  children?: React.ReactNode;
}

function getIndefiniteArticle(phrase: string): "A" | "An" {
  const clean = phrase.replace(/^[^a-zA-Z]+/, "");
  return /^[aeiou]/i.test(clean) ? "An" : "A";
}

const Landing: React.FC<LandingProps> = ({ children }) => {
  const nameParts = portfolioConfig.developer.fullName.split(" ");
  const firstName = nameParts[0] || portfolioConfig.developer.name;
  const lastName = nameParts.slice(1).join(" ") || "";
  const [role1, role2, role3, role4] = portfolioConfig.developer.heroRoles;
  const art1 = getIndefiniteArticle(role1);
  const art2 = getIndefiniteArticle(role2);

  return (
    <div className="landing-section" id="landingDiv">
      <div className="landing-container">
        <div className="landing-intro">
          <h2>Hello! I'm</h2>
          <h1>
            {firstName.toUpperCase()}
            {lastName && (
              <>
                {" "}
                <br />
                <span>{lastName.toUpperCase()}</span>
              </>
            )}
          </h1>
        </div>

        <div className="landing-info">
          <h3 className="landing-article">
            <span className="article-1">{art1}</span>
            {art2 !== art1 && <span className="article-2">{art2}</span>}
          </h3>
          <h2 className="landing-info-h2">
            <div className="landing-h2-1">{role1}</div>
            <div className="landing-h2-2">{role2}</div>
          </h2>
          <h2>
            <div className="landing-h2-info">{role3}</div>
            <div className="landing-h2-info-1">{role4}</div>
          </h2>
        </div>

        <div className="mobile-photo">
          <img
            src={portfolioConfig.media.avatarImage}
            alt={portfolioConfig.developer.fullName}
            loading="eager"
            decoding="async"
          />
        </div>
      </div>
      {children}
    </div>
  );
};

export default Landing;
