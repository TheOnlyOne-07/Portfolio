import React, { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HoverLinks from "./HoverLinks";
import { portfolioConfig } from "../config/portfolio";
import { setLenisInstance } from "../utils/lenisStore";
import "../styles/Navbar.css";

gsap.registerPlugin(ScrollTrigger);

const Navbar: React.FC = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.7,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.7,
      touchMultiplier: 2,
      infinite: false,
    });

    setLenisInstance(lenis);
    lenis.on("scroll", ScrollTrigger.update);

    let rafId = 0;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    const links = document.querySelectorAll<HTMLAnchorElement>(".header ul a");
    const handleClick = (e: Event) => {
      if (window.innerWidth > 1024) {
        e.preventDefault();
        const anchor = e.currentTarget as HTMLAnchorElement;
        const targetSelector = anchor.getAttribute("data-href");
        if (targetSelector) {
          const section = document.querySelector<HTMLElement>(targetSelector);
          if (section) {
            lenis.scrollTo(section, { offset: 0, duration: 1.5 });
          }
        }
      }
    };

    links.forEach((el) => el.addEventListener("click", handleClick));

    const handleResize = () => lenis.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(rafId);
      links.forEach((el) => el.removeEventListener("click", handleClick));
      window.removeEventListener("resize", handleResize);
      lenis.destroy();
      setLenisInstance(null);
    };
  }, []);

  return (
    <>
      <div className="header">
        <a href="/#" className="navbar-title" data-cursor="disable">
          {portfolioConfig.developer.initials}
        </a>
        <a
          href={`mailto:${portfolioConfig.contact.email}`}
          className="navbar-connect"
          data-cursor="disable"
        >
          {portfolioConfig.contact.email}
        </a>
        <ul>
          <li>
            <a data-href="#about" href="#about">
              <HoverLinks text="ABOUT" />
            </a>
          </li>
          <li>
            <a data-href="#work" href="#work">
              <HoverLinks text="WORK" />
            </a>
          </li>
          <li>
            <a data-href="#contact" href="#contact">
              <HoverLinks text="CONTACT" />
            </a>
          </li>
        </ul>
      </div>

      <div className="landing-circle1" />
      <div className="landing-circle2" />
      <div className="nav-fade" />
    </>
  );
};

export default Navbar;
