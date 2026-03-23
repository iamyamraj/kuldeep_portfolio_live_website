import { PropsWithChildren, useEffect } from "react";
import "./styles/Landing.css";
import { initialFX } from "./utils/initialFX";

const Landing = ({ children }: PropsWithChildren) => {
  useEffect(() => {
    initialFX();
  }, []);

  return (
    <>
      <div className="landing-section" id="landingDiv">
        <div className="landing-container">
          <div className="landing-intro">
            <h2>Hello! I'm</h2>
            <h1>
              <div className="name-line">KULDEEP</div>
              <div className="name-line">SINGH</div>
            </h1>
          </div>
          <div className="landing-info">
            <h3>A Data</h3>
            <h2 className="landing-info-h2">
              <div className="landing-h2-1">Analyst</div>
              <div className="landing-h2-2">Engineer</div>
            </h2>
            <h2>
              <div className="landing-h2-info">Engineer</div>
              <div className="landing-h2-info-1">Analyst</div>
            </h2>
          </div>
        </div>
        {children}
      </div>
    </>
  );
};

export default Landing;
