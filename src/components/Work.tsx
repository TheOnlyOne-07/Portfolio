import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import WorkImage from "./WorkImage";
import { portfolioConfig } from "../config/portfolio";

gsap.registerPlugin(ScrollTrigger);

const Work: React.FC = () => {
  useEffect(() => {
    if (window.innerWidth <= 768) return;

    let translateX = 0;
    const boxes = document.getElementsByClassName("work-box");
    const workContainer = document.querySelector(".work-container");

    if (boxes.length > 0 && workContainer) {
      const rectLeft = workContainer.getBoundingClientRect().left;
      const boxRect = boxes[0].getBoundingClientRect();
      const parentWidth =
        boxes[0].parentElement?.getBoundingClientRect().width || 0;
      const padding = parseInt(window.getComputedStyle(boxes[0]).padding, 10) / 2 || 0;
      translateX = boxRect.width * boxes.length - (rectLeft + parentWidth) + padding;
    }

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".work-section",
        start: "top top",
        end: `+=${Math.max(translateX, 400)}`,
        scrub: 1,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        id: "work",
        invalidateOnRefresh: true,
      },
    });

    timeline.to(".work-flex", {
      x: -Math.max(translateX, 0),
      ease: "none",
    });

    ScrollTrigger.refresh();

    return () => {
      timeline.kill();
      ScrollTrigger.getById("work")?.kill();
    };
  }, []);

  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          My <span>Work</span>
        </h2>
        <div className="work-flex">
          {portfolioConfig.projects.slice(0, 5).map((project, index) => (
            <div className="work-box" key={project.id}>
              <div className="work-info">
                <div className="work-title">
                  <h3>0{index + 1}</h3>
                  <div>
                    <h4>{project.title}</h4>
                    <p>{project.category}</p>
                  </div>
                </div>
                <h4>Tools and features</h4>
                <p>{project.technologies}</p>
              </div>
              <WorkImage
                image={project.image}
                alt={project.title}
                link={project.link}
                video={project.video}
              />
            </div>
          ))}

          <div className="work-box work-box-cta">
            <div className="see-all-works">
              <h3>Want to see more?</h3>
              <p>Explore all of my projects and creations</p>
              <Link to="/myworks" className="see-all-btn" data-cursor="disable">
                See All Works &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Work;
