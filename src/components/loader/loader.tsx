import React from "react";
import "./loader.css";

interface LoaderProps {
  size?: number;
}

const Loader: React.FC<LoaderProps> = ({ size = 40 }) => {
  const loaderStyle: React.CSSProperties = {
    width: `${size}px`,
    height: `${size}px`,
    borderTopColor: "blue",
  };

  return (
    <div className="loader_container">
      <div className="loader" style={loaderStyle}></div>
    </div>
  );
};

export default Loader;
