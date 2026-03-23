import gsap from "gsap";

export function initialFX() {
  document.body.style.overflowY = "auto";
  document.getElementsByTagName("main")[0].classList.add("main-active");
  gsap.to("body", {
    backgroundColor: "#0a0e17",
    duration: 0.5,
    delay: 1,
  });

  gsap.fromTo(
    ".landing-intro h2, .landing-intro h1, .landing-info h3",
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 1.2, delay: 0.3, stagger: 0.1 }
  );

  // Simple Loop without SplitText
  const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.5 });
  tl.to(".role-analyst", { opacity: 0, y: -20, duration: 0.6, ease: "power2.in" }, 2)
    .fromTo(".role-engineer", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, ">")
    .to(".role-engineer", { opacity: 0, y: -20, duration: 0.6, ease: "power2.in" }, "+=2")
    .fromTo(".role-analyst", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, ">");

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

  gsap.fromTo(
    ".landing-h2-info-1",
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 1.2, delay: 0.5 }
  );
}

// LoopText removed as it relied on SplitText trial functionality
