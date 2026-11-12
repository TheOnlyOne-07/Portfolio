import React from "react";

interface HoverLinksProps {
  text: string;
  cursor?: boolean;
}

const HoverLinks: React.FC<HoverLinksProps> = ({ text, cursor }) => {
  return (
    <div className="hover-link" data-cursor={!cursor ? "disable" : undefined}>
      <div className="hover-in">
        {text} <div>{text}</div>
      </div>
    </div>
  );
};

export default HoverLinks;
