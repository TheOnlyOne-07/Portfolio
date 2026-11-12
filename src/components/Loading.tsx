import React, { useEffect, useState } from "react";
import { useLoading } from "../context/LoadingProvider";
import { portfolioConfig } from "../config/portfolio";

interface LoadingProps {
  percent: number;
}

const Loading: React.FC<LoadingProps> = ({ percent }) => {
  const { setIsLoading } = useLoading();
  const [loaded, setLoaded] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    if (percent < 100 || loaded) return;
    const t1 = window.setTimeout(() => {
      setLoaded(true);
    }, 350);
    return () => window.clearTimeout(t1);
  }, [percent, loaded]);

  useEffect(() => {
    if (!loaded || isLoaded) return;
    const t2 = window.setTimeout(() => {
      setIsLoaded(true);
    }, 550);
    return () => window.clearTimeout(t2);
  }, [loaded, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    let cancelled = false;
    let revealTimer: number | undefined;

    import("../utils/initialFX").then((mod) => {
      if (cancelled) return;
      setClicked(true);
      revealTimer = window.setTimeout(() => {
        if (cancelled) return;
        mod.initialFX();
        setIsLoading(false);
      }, 900);
    });

    return () => {
      cancelled = true;
      if (revealTimer !== undefined) {
        window.clearTimeout(revealTimer);
      }
    };
  }, [isLoaded, setIsLoading]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const { currentTarget: target } = e;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    target.style.setProperty("--mouse-x", `${x}px`);
    target.style.setProperty("--mouse-y", `${y}px`);
  }

  const roles = portfolioConfig.developer.marqueeRoles;

  return (
    <>
      <div className="loading-header">
        <a href="/#" className="loader-title" data-cursor="disable">
          {portfolioConfig.developer.brandName}
        </a>
        <div className={`loaderGame ${clicked ? "loader-out" : ""}`}>
          <div className="loaderGame-container">
            <div className="loaderGame-in">
              {[...Array(27)].map((_, index) => (
                <div className="loaderGame-line" key={index} />
              ))}
            </div>
            <div className="loaderGame-ball" />
          </div>
        </div>
      </div>

      <div className="loading-screen">
        <div className="loading-marquee">
          <div className="marquee-track">
            {[...roles, ...roles, ...roles, ...roles].map((role, idx) => (
              <span key={idx}>&nbsp; {role} &nbsp;</span>
            ))}
          </div>
        </div>

        <div
          className={`loading-wrap ${clicked ? "loading-clicked" : ""}`}
          onMouseMove={handleMouseMove}
          onClick={() => {
            if (loaded && !isLoaded) setIsLoaded(true);
          }}
          style={{ cursor: loaded ? "pointer" : "default" }}
        >
          <div className="loading-hover" />
          <div className={`loading-button ${loaded ? "loading-complete" : ""}`}>
            <div className="loading-container">
              <div className="loading-content">
                <div className="loading-content-in">
                  Loading <span>{Math.min(percent, 100)}%</span>
                </div>
              </div>
              <div className="loading-box" />
            </div>
            <div className="loading-content2">
              <span>Welcome</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Loading;
