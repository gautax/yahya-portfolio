const revealItems = document.querySelectorAll(".reveal");
const neuralCanvas = document.querySelector(".neural-bg");
const glow = document.querySelector(".cursor-glow");
const menuToggle = document.querySelector(".menu-toggle");
const themeToggle = document.querySelector(".theme-toggle");
const themeLabel = document.querySelector(".theme-label");
const navLinks = document.querySelectorAll(".nav-links a");
const root = document.documentElement;

const setTheme = (theme) => {
  root.dataset.theme = theme;
  localStorage.setItem("theme", theme);
  const isDark = theme === "dark";
  themeToggle?.setAttribute("aria-pressed", String(isDark));
  themeToggle?.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  if (themeLabel) themeLabel.textContent = isDark ? "Dark" : "Light";
};

setTheme(localStorage.getItem("theme") || "dark");

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const startNeuralBackground = () => {
  if (!neuralCanvas || prefersReducedMotion.matches) return;

  const ctx = neuralCanvas.getContext("2d");
  const nodes = [];
  const pointer = { x: -9999, y: -9999 };
  let width = 0;
  let height = 0;
  let animationFrame;

  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    neuralCanvas.width = Math.floor(width * ratio);
    neuralCanvas.height = Math.floor(height * ratio);
    neuralCanvas.style.width = `${width}px`;
    neuralCanvas.style.height = `${height}px`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    nodes.length = 0;
    const count = Math.min(78, Math.max(34, Math.floor((width * height) / 22000)));
    for (let i = 0; i < count; i += 1) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        radius: Math.random() * 1.7 + 1.1
      });
    }
  };

  const draw = () => {
    ctx.clearRect(0, 0, width, height);
    const ink = getComputedStyle(root).getPropertyValue("--node").trim() || "rgba(155, 214, 231, 0.35)";
    const lineDistance = width < 720 ? 110 : 150;

    nodes.forEach((node) => {
      node.x += node.vx;
      node.y += node.vy;

      if (node.x < -20) node.x = width + 20;
      if (node.x > width + 20) node.x = -20;
      if (node.y < -20) node.y = height + 20;
      if (node.y > height + 20) node.y = -20;

      const dx = pointer.x - node.x;
      const dy = pointer.y - node.y;
      const distance = Math.hypot(dx, dy);
      if (distance < 150) {
        node.x -= dx * 0.0014;
        node.y -= dy * 0.0014;
      }
    });

    for (let i = 0; i < nodes.length; i += 1) {
      for (let j = i + 1; j < nodes.length; j += 1) {
        const first = nodes[i];
        const second = nodes[j];
        const distance = Math.hypot(first.x - second.x, first.y - second.y);
        if (distance < lineDistance) {
          ctx.globalAlpha = (1 - distance / lineDistance) * 0.42;
          ctx.strokeStyle = ink;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(first.x, first.y);
          ctx.lineTo(second.x, second.y);
          ctx.stroke();
        }
      }
    }

    nodes.forEach((node) => {
      ctx.globalAlpha = 0.78;
      ctx.fillStyle = ink;
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.globalAlpha = 1;
    animationFrame = window.requestAnimationFrame(draw);
  };

  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", (event) => {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
  });
  window.addEventListener("pointerleave", () => {
    pointer.x = -9999;
    pointer.y = -9999;
  });

  resize();
  draw();

  prefersReducedMotion.addEventListener("change", () => {
    window.cancelAnimationFrame(animationFrame);
    ctx.clearRect(0, 0, width, height);
    if (!prefersReducedMotion.matches) {
      resize();
      draw();
    }
  });
};

startNeuralBackground();

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index * 55, 260)}ms`;
  observer.observe(item);
});

window.addEventListener("pointermove", (event) => {
  if (!glow) return;
  glow.style.left = `${event.clientX}px`;
  glow.style.top = `${event.clientY}px`;
});

menuToggle?.addEventListener("click", () => {
  const isOpen = document.body.classList.toggle("menu-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

themeToggle?.addEventListener("click", () => {
  setTheme(root.dataset.theme === "dark" ? "light" : "dark");
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    document.body.classList.remove("menu-open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});
