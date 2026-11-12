import gsap from "gsap";
import { TextSplitter } from "./textSplitter";
import { getLenisInstance } from "./lenisStore";

function LoopText(Text1: TextSplitter, Text2: TextSplitter) {
  gsap.set(Text1.chars, { opacity: 1, y: 0 });
  gsap.set(Text2.chars, { opacity: 0, y: 24 });

  const tl = gsap.timeline({ repeat: -1 });
  const hold = 3.4;

  tl.to(
    Text1.chars,
    {
      opacity: 0,
      y: -24,
      duration: 0.4,
      ease: "power2.in",
      stagger: 0.012,
    },
    hold
  )
    .fromTo(
      Text2.chars,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power3.out",
        stagger: 0.018,
        immediateRender: false,
      },
      hold + 0.65
    )
    .to(
      Text2.chars,
      {
        opacity: 0,
        y: -24,
        duration: 0.4,
        ease: "power2.in",
        stagger: 0.012,
      },
      hold * 2 + 1.2
    )
    .fromTo(
      Text1.chars,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power3.out",
        stagger: 0.018,
        immediateRender: false,
      },
      hold * 2 + 1.85
    );
}

export function initialFX() {
  document.body.style.overflowY = "auto";
  getLenisInstance()?.start();

  const mainEl = document.getElementsByTagName("main")[0];
  mainEl?.classList.add("main-active");

  gsap.to("body", {
    backgroundColor: "#0b080c",
    duration: 0.5,
    delay: 1,
  });

  const introElements = [
    ".landing-info .article-1",
    ".landing-intro h2",
    ".landing-intro h1",
  ].flatMap((selector) =>
    Array.from(document.querySelectorAll<HTMLElement>(selector))
  );

  if (introElements.length > 0) {
    const landingText = new TextSplitter(introElements, {
      type: "chars,lines",
      linesClass: "split-line",
    });

    gsap.fromTo(
      landingText.chars,
      { opacity: 0, y: 60, filter: "blur(3px)" },
      {
        opacity: 1,
        duration: 0.85,
        filter: "blur(0px)",
        ease: "power3.out",
        y: 0,
        stagger: 0.015,
        delay: 0.1,
      }
    );
  }

  const h2SplitConfig = { type: "chars,lines", linesClass: "split-h2" };
  const landingText2 = new TextSplitter(".landing-h2-info", h2SplitConfig);

  gsap.fromTo(
    ".landing-info",
    { opacity: 0, y: 18 },
    {
      opacity: 1,
      duration: 0.9,
      ease: "power2.out",
      y: 0,
      delay: 0.25,
    }
  );

  gsap.fromTo(
    [".header", ".icons-section", ".nav-fade"],
    { opacity: 0 },
    {
      opacity: 1,
      duration: 1.2,
      ease: "power1.inOut",
      delay: 0.1,
    }
  );

  const article1 = new TextSplitter(".article-1", h2SplitConfig);
  const article2 = new TextSplitter(".article-2", h2SplitConfig);
  const landingText3 = new TextSplitter(".landing-h2-info-1", h2SplitConfig);
  const landingText4 = new TextSplitter(".landing-h2-1", h2SplitConfig);
  const landingText5 = new TextSplitter(".landing-h2-2", h2SplitConfig);

  if (article1.chars.length && article2.chars.length) {
    LoopText(article1, article2);
  }
  if (landingText2.chars.length && landingText3.chars.length) {
    LoopText(landingText2, landingText3);
  }
  if (landingText4.chars.length && landingText5.chars.length) {
    LoopText(landingText4, landingText5);
  }
}
