import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { portfolioConfig } from "../config/portfolio";
import "../styles/MyWorks.css";

const MyWorks: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(portfolioConfig.projects.map((p) => p.category))
    );
    return ["All", ...unique];
  }, []);

  const filteredProjects = useMemo(() => {
    if (selectedCategory === "All") return portfolioConfig.projects;
    return portfolioConfig.projects.filter(
      (p) => p.category === selectedCategory
    );
  }, [selectedCategory]);

  return (
    <div className="myworks-page">
      <div className="myworks-header">
        <Link to="/" className="back-button" data-cursor="disable">
          &larr; Back to Home
        </Link>
        <h1>
          All <span>Works</span>
        </h1>
        <p>A collection of all my projects and creations</p>
      </div>

      <div className="myworks-filters">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`myworks-filter-btn ${
              selectedCategory === cat ? "active" : ""
            }`}
            onClick={() => setSelectedCategory(cat)}
            data-cursor="disable"
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="myworks-grid">
        {filteredProjects.map((project, index) => {
          const isInternal = Boolean(project.link?.startsWith("/"));
          const content = (
            <>
              <div className="myworks-card-number">0{index + 1}</div>
              <div className="myworks-card-image">
                <img
                  src={project.image}
                  alt={project.title}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="myworks-card-info">
                <h3>{project.title}</h3>
                <p className="myworks-card-category">{project.category}</p>
                <p className="myworks-card-description">{project.description}</p>
                <p className="myworks-card-tech">{project.technologies}</p>
              </div>
            </>
          );

          if (isInternal) {
            return (
              <Link
                key={project.id}
                className="myworks-card"
                to={project.link}
                data-cursor="disable"
              >
                {content}
              </Link>
            );
          }

          return (
            <a
              key={project.id}
              className="myworks-card"
              href={project.link || undefined}
              target={project.link ? "_blank" : undefined}
              rel={project.link ? "noopener noreferrer" : undefined}
              data-cursor="disable"
            >
              {content}
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default MyWorks;
