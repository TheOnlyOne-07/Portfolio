import React, { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { portfolioConfig } from "../config/portfolio";

function toggleWhatActive(container: HTMLDivElement) {
  container.classList.toggle("what-content-active");
  container.classList.remove("what-sibling");
  if (container.parentElement) {
    Array.from(container.parentElement.children).forEach((sibling) => {
      if (sibling !== container) {
        sibling.classList.remove("what-content-active");
        sibling.classList.toggle("what-sibling");
      }
    });
  }
}

const WhatIDo: React.FC = () => {
  const containerRefs = useRef<Array<HTMLDivElement | null>>([]);

  const setRef = (el: HTMLDivElement | null, index: number) => {
    containerRefs.current[index] = el;
  };

  useEffect(() => {
    const handlers: Array<{ el: HTMLDivElement; fn: () => void }> = [];
    if (ScrollTrigger.isTouch) {
      containerRefs.current.forEach((el) => {
        if (el) {
          el.classList.remove("what-noTouch");
          const fn = () => toggleWhatActive(el);
          el.addEventListener("click", fn);
          handlers.push({ el, fn });
        }
      });
    }
    return () => {
      handlers.forEach(({ el, fn }) => el.removeEventListener("click", fn));
    };
  }, []);

  const { develop, design } = portfolioConfig.skills;

  return (
    <div className="whatIDO">
      <div className="what-box">
        <h2 className="title">
          W<span className="hat-h2">HAT</span>
          <div>
            &nbsp;I<span className="do-h2"> DO</span>
          </div>
        </h2>
      </div>

      <div className="what-box">
        <div className="what-box-in">
          <div className="what-border2">
            <svg width="100%">
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="100%"
                stroke="white"
                strokeWidth="2"
                strokeDasharray="7,7"
              />
              <line
                x1="100%"
                y1="0"
                x2="100%"
                y2="100%"
                stroke="white"
                strokeWidth="2"
                strokeDasharray="7,7"
              />
            </svg>
          </div>

          <div
            className="what-content what-noTouch"
            ref={(el) => setRef(el, 0)}
          >
            <div className="what-border1">
              <svg height="100%">
                <line
                  x1="0"
                  y1="0"
                  x2="100%"
                  y2="0"
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray="6,6"
                />
                <line
                  x1="0"
                  y1="100%"
                  x2="100%"
                  y2="100%"
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray="6,6"
                />
              </svg>
            </div>
            <div className="what-corner" />
            <div className="what-content-in">
              <h3>{develop.title}</h3>
              <h4>{develop.description}</h4>
              <p>{develop.details}</p>
              <h5>Skillset &amp; tools</h5>
              <div className="what-content-flex">
                {develop.tools.map((tool, index) => (
                  <div className="what-tags" key={index}>
                    {tool}
                  </div>
                ))}
              </div>
              <div className="what-arrow" />
            </div>
          </div>

          <div
            className="what-content what-noTouch"
            ref={(el) => setRef(el, 1)}
          >
            <div className="what-border1">
              <svg height="100%">
                <line
                  x1="0"
                  y1="100%"
                  x2="100%"
                  y2="100%"
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray="6,6"
                />
              </svg>
            </div>
            <div className="what-corner" />
            <div className="what-content-in">
              <h3>{design.title}</h3>
              <h4>{design.description}</h4>
              <p>{design.details}</p>
              <h5>Skillset &amp; tools</h5>
              <div className="what-content-flex">
                {design.tools.map((tool, index) => (
                  <div className="what-tags" key={index}>
                    {tool}
                  </div>
                ))}
              </div>
              <div className="what-arrow" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatIDo;
