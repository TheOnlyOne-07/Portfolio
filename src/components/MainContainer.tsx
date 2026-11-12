import React, { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Cursor from "./Cursor";
import Navbar from "./Navbar";
import SocialIcons from "./SocialIcons";
import Landing from "./Landing";
import About from "./About";
import WhatIDo from "./WhatIDo";
import Career from "./Career";
import Work from "./Work";
import TechStack from "./TechStack";
import CallToAction from "./CallToAction";
import Contact from "./Contact";
import { TextSplitter } from "../utils/textSplitter";
import { useLoading } from "../context/LoadingProvider";
import "../styles/MainContainer.css";

gsap.registerPlugin(ScrollTrigger);

interface SplitElement extends HTMLElement {
  split?: TextSplitter;
  anim?: gsap.core.Tween;
}

function setSplitText() {
  ScrollTrigger.config({ ignoreMobileResize: true });
  if (window.innerWidth < 900) return;

  const paras = document.querySelectorAll<SplitElement>(".para");
  const titles = document.querySelectorAll<SplitElement>(".title");
  const startPos = window.innerWidth <= 1024 ? "top 60%" : "20% 60%";
  const toggleActions = "play pause resume reverse";

  paras.forEach((para) => {
    para.classList.add("visible");
    if (para.anim) {
      para.anim.progress(1).kill();
      para.split?.revert();
    }
    para.split = new TextSplitter(para, {
      type: "lines,words",
      linesClass: "split-line",
    });
    para.anim = gsap.fromTo(
      para.split.words,
      { autoAlpha: 0, y: 80 },
      {
        autoAlpha: 1,
        scrollTrigger: {
          trigger: para.parentElement?.parentElement || para,
          toggleActions,
          start: startPos,
        },
        duration: 1,
        ease: "power3.out",
        y: 0,
        stagger: 0.02,
      }
    );
  });

  titles.forEach((title) => {
    if (title.anim) {
      title.anim.progress(1).kill();
      title.split?.revert();
    }
    title.split = new TextSplitter(title, {
      type: "chars,lines",
      linesClass: "split-line",
    });
    title.anim = gsap.fromTo(
      title.split.chars,
      { autoAlpha: 0, y: 80, rotate: 10 },
      {
        autoAlpha: 1,
        scrollTrigger: {
          trigger: title.parentElement?.parentElement || title,
          toggleActions,
          start: startPos,
        },
        duration: 0.8,
        ease: "power2.inOut",
        y: 0,
        rotate: 0,
        stagger: 0.03,
      }
    );
  });
}

const MainContainer: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const [isDesktopView, setIsDesktopView] = useState(
    () => window.innerWidth > 1024
  );
  const [isMobile] = useState(() => window.innerWidth <= 768);
  const [shouldLoad3D, setShouldLoad3D] = useState(false);
  const { setLoading } = useLoading();

  useEffect(() => {
    const onResize = () => {
      setSplitText();
      setIsDesktopView(window.innerWidth > 1024);
    };

    onResize();
    ScrollTrigger.addEventListener("refresh", setSplitText);
    window.addEventListener("resize", onResize);

    return () => {
      ScrollTrigger.removeEventListener("refresh", setSplitText);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    if (window.innerWidth <= 768) {
      setLoading(100);
      let cancelled = false;
      import("../utils/initialFX").then(({ initialFX }) => {
        if (!cancelled && !document.querySelector(".landing-h2-1 .split-char")) {
          requestAnimationFrame(() => {
            if (!cancelled && !document.querySelector(".landing-h2-1 .split-char")) {
              initialFX();
            }
          });
        }
      });
      return () => {
        cancelled = true;
      };
    }

    if (window.innerWidth <= 1024) {
      setLoading(100);
      return;
    }
    let timeoutId: number | undefined;

    const load = () => setShouldLoad3D(true);
    timeoutId = window.setTimeout(load, 50);

    return () => {
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);

  return (
    <div className="container-main">
      <Cursor />
      <Navbar />
      <SocialIcons />
      {isDesktopView && !isMobile && shouldLoad3D && children}
      <div className="container-main">
        <Landing />
        <About />
        <WhatIDo />
        <Career />
        <Work />
        <TechStack />
        <CallToAction />
        <Contact />
      </div>
    </div>
  );
};

export default MainContainer;
