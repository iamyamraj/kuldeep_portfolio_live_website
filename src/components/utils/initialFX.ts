import gsap from "gsap";

export function initialFX() {
  document.body.style.overflowY = "auto";
  document.getElementsByTagName("main")[0].classList.add("main-active");
  gsap.to("body", {
    backgroundColor: "#0a0e17",
    duration: 0.5,
    delay: 1,
  });

  const manualSplit = (selector: string) => {
    const elements = document.querySelectorAll(selector);
    let allSpans: HTMLElement[] = [];
    elements.forEach(el => {
      if (el.getAttribute("data-split")) {
        allSpans = [...allSpans, ...Array.from(el.querySelectorAll("span"))] as HTMLElement[];
        return;
      }
      const text = el.textContent || "";
      el.innerHTML = "";
      [...text].forEach(char => {
        const span = document.createElement("span");
        span.textContent = char === " " ? "\u00A0" : char;
        span.style.display = "inline-block";
        el.appendChild(span);
        allSpans.push(span);
      });
      el.setAttribute("data-split", "true");
    });
    return allSpans;
  };

  manualSplit(".landing-intro h2, .landing-intro h1 .name-line, .landing-info h3");
  gsap.fromTo(
    ".landing-intro h2 span, .landing-intro h1 span, .landing-info h3 span",
    { opacity: 0, y: 30, filter: "blur(5px)" },
    {
      opacity: 1,
      duration: 0.8,
      filter: "blur(0px)",
      ease: "power3.out",
      y: 0,
      stagger: 0.02,
      delay: 0.3,
    }
  );

  function SetupLoop(selector1: string, selector2: string) {
    const chars1 = manualSplit(selector1);
    const chars2 = manualSplit(selector2);
    
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });
    const delay = 4;
    const delay2 = delay * 2 + 1;

    tl.set(chars1, { opacity: 1, y: 0, filter: "blur(0px)" })
      .set(chars2, { opacity: 0, y: 80, filter: "blur(5px)" });

    tl.fromTo(chars2, { opacity: 0, y: 80, filter: "blur(5px)" }, { opacity: 1, duration: 1.2, ease: "power3.inOut", y: 0, filter: "blur(0px)", stagger: 0.1, delay: delay }, 0)
      .fromTo(chars1, { y: 80, filter: "blur(5px)" }, { duration: 1.2, ease: "power3.inOut", y: 0, filter: "blur(0px)", stagger: 0.1, delay: delay2 }, 1)
      .fromTo(chars1, { y: 0, filter: "blur(0px)" }, { y: -80, opacity: 0, filter: "blur(5px)", duration: 1.2, ease: "power3.inOut", stagger: 0.1, delay: delay }, 0)
      .to(chars2, { y: -80, opacity: 0, filter: "blur(5px)", duration: 1.2, ease: "power3.inOut", stagger: 0.1, delay: delay2 }, 1);
  }

  SetupLoop(".landing-role-1", ".landing-role-2");

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
}

// LoopText removed as it relied on SplitText trial functionality
