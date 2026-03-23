import {
  FaInstagram,
  FaLinkedinIn,
  FaGithub,
} from "react-icons/fa6";
import "./styles/SocialIcons.css";
import { TbNotes } from "react-icons/tb";
import { useEffect } from "react";
import HoverLinks from "./HoverLinks";

const SocialIcons = () => {
  useEffect(() => {
    const social = document.getElementById("social") as HTMLElement;
    if (!social) return;

    const cleanup: (() => void)[] = [];

    social.querySelectorAll("span").forEach((item) => {
      const elem = item as HTMLElement;
      const link = elem.querySelector("a") as HTMLElement;
      if (!link) return;

      // Start centered (50px span -> 25px center)
      let mouseX = 25;
      let mouseY = 25;
      let currentX = 25;
      let currentY = 25;
      let rafId: number;

      const updatePosition = () => {
        currentX += (mouseX - currentX) * 0.1;
        currentY += (mouseY - currentY) * 0.1;

        link.style.setProperty("--siLeft", `${currentX}px`);
        link.style.setProperty("--siTop", `${currentY}px`);

        rafId = requestAnimationFrame(updatePosition);
      };

      const onMouseMove = (e: MouseEvent) => {
        const rect = elem.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Original "vintage" bounds
        if (x < 40 && x > 10 && y < 40 && y > 5) {
          mouseX = x;
          mouseY = y;
        } else {
          mouseX = 25;
          mouseY = 25;
        }
      };

      document.addEventListener("mousemove", onMouseMove);
      updatePosition();

      cleanup.push(() => {
        document.removeEventListener("mousemove", onMouseMove);
        cancelAnimationFrame(rafId);
      });
    });

    return () => {
      cleanup.forEach((cb) => cb());
    };
  }, []);

  return (
    <div className="icons-section">
      <div className="social-icons" data-cursor="icons" id="social">
        <span>
          <a href="https://www.linkedin.com/in/ksmalik" target="_blank">
            <FaLinkedinIn />
          </a>
        </span>
        <span>
          <a href="https://www.instagram.com/iamyamraj" target="_blank">
            <FaInstagram />
          </a>
        </span>
        <span>
          <a href="https://github.com/iamyamraj" target="_blank">
            <FaGithub />
          </a>
        </span>
      </div>
      <a className="resume-button" href="/resume/Kuldeep_Singh_Resume.pdf" download="Kuldeep_Singh_Resume.pdf">
        <HoverLinks text="RESUME" />
        <span>
          <TbNotes />
        </span>
      </a>
    </div>
  );
};

export default SocialIcons;
