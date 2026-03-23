import { PropsWithChildren, useEffect } from "react";
import "./styles/Landing.css";

const Landing = ({ children }: PropsWithChildren) => {
  useEffect(() => {
    import("./utils/initialFX").then((module) => {
      if (module.initialFX) {
        module.initialFX();
      }
    });
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
              <div className="landing-role-1">Analyst</div>
              <div className="landing-role-2">Engineer</div>
            </h2>
          </div>
        </div>
        {children}
      </div>
    </>
  );
};

export default Landing;
