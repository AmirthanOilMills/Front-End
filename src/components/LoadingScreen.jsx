import React from "react";
import Logo from "../assets/images/LogoCut.png"; // your logo

export default function LoadingScreen() {
  return (
    <div className="loading-wrapper">
      <div className="blur-bg"></div>

      <div className="loader-container">
        <div className="oil-drop-reveal">
          <img src={Logo} alt="logo" className="logo-main" />
        </div>
      </div>
    </div>
  );
}
