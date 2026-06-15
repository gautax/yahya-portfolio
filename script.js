const revealItems = document.querySelectorAll(".reveal");
const neuralCanvas = document.querySelector(".neural-bg");
const glow = document.querySelector(".cursor-glow");
const menuToggle = document.querySelector(".menu-toggle");
const themeToggle = document.querySelector(".theme-toggle");
const themeLabel = document.querySelector(".theme-label");
const navLinks = document.querySelectorAll(".nav-links a");
const mapShell = document.querySelector(".map-shell");
const mapNodes = document.querySelectorAll(".map-node");
const mapLinks = document.querySelectorAll(".map-lines path");
const mapInsight = document.querySelector(".map-insight");
const projectCards = document.querySelectorAll("[data-project-card]");
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

const systemMap = {
  weather: {
    label: "Forecasting system",
    title: "Weather Forecasting turns raw station data into 24-hour predictions.",
    text: "This project connects Python, feature engineering, XGBoost and deep-learning forecasting models with MAE/RMSE evaluation.",
    nodes: ["weather", "forecasting", "xgboost", "python"],
    links: ["forecasting-weather", "xgboost-weather", "python-weather"],
    projects: ["weather"]
  },
  agents: {
    label: "Multi-agent healthcare app",
    title: "Medical Agents show your product-minded LLM engineering side.",
    text: "CrewAI, Gemini and Streamlit work together to produce diagnosis support, treatment plans, specialist referrals and appointment email drafts.",
    nodes: ["agents", "gemini", "crewai", "streamlit", "python"],
    links: ["gemini-agents", "crewai-agents", "streamlit-agents", "python-agents"],
    projects: ["agents"]
  },
  symptom: {
    label: "Graph + vector RAG",
    title: "Symptom Checker is the strongest proof of your knowledge-systems profile.",
    text: "It combines Neo4j graph search, Qdrant semantic retrieval, PubMed data and Gemini responses for contextual medical insights.",
    nodes: ["symptom", "rag-skill", "graph", "vector", "gemini", "flask", "python"],
    links: ["rag-symptom", "graph-symptom", "vector-symptom", "gemini-symptom", "flask-symptom"],
    projects: ["symptom"]
  },
  rag: {
    label: "Agentic RAG exploration",
    title: "Agentic RAG connects retrieval quality with tool orchestration.",
    text: "This node represents your experimentation with knowledge-enhanced applications, retrieval pipelines and agentic reasoning patterns.",
    nodes: ["rag", "rag-skill", "vector", "python"],
    links: ["rag-rag"],
    projects: ["rag"]
  },
  prescription: {
    label: "Cloud AI product",
    title: "Prescription Reader AI proves cloud deployment and applied OCR.",
    text: "Google Cloud Vision, Firestore, Cloud Storage, translation APIs and Docker come together in a user-facing prescription analysis workflow.",
    nodes: ["prescription", "cloud", "ocr", "docker", "streamlit", "python"],
    links: ["cloud-prescription", "ocr-prescription", "docker-prescription", "streamlit-prescription", "python-prescription"],
    projects: ["prescription"]
  },
  forecasting: {
    label: "Skill connection",
    title: "Forecasting anchors your ML research identity.",
    text: "It points to the weather project: preprocessing, lag features, rolling statistics and 24-hour-ahead model comparison.",
    nodes: ["forecasting", "weather", "python", "xgboost"],
    links: ["forecasting-weather", "python-weather", "xgboost-weather"],
    projects: ["weather"]
  },
  xgboost: {
    label: "Skill connection",
    title: "XGBoost is part of your practical forecasting toolkit.",
    text: "It supports the weather forecasting work alongside statistical and deep-learning models.",
    nodes: ["xgboost", "weather", "forecasting"],
    links: ["xgboost-weather", "forecasting-weather"],
    projects: ["weather"]
  },
  gemini: {
    label: "Skill connection",
    title: "Gemini appears across your LLM healthcare systems.",
    text: "It connects your medical agents and symptom checker, showing generative AI used inside real workflows rather than as a standalone demo.",
    nodes: ["gemini", "agents", "symptom", "crewai", "rag-skill"],
    links: ["gemini-agents", "gemini-symptom", "crewai-agents", "rag-symptom"],
    projects: ["agents", "symptom"]
  },
  crewai: {
    label: "Skill connection",
    title: "CrewAI shows you can decompose LLM apps into specialist roles.",
    text: "The medical assistant uses agents for diagnosis, treatment planning, referrals and appointment coordination.",
    nodes: ["crewai", "agents", "gemini", "streamlit"],
    links: ["crewai-agents", "gemini-agents", "streamlit-agents"],
    projects: ["agents"]
  },
  streamlit: {
    label: "Skill connection",
    title: "Streamlit is your fast path from model logic to usable product.",
    text: "It powers the medical agents interface and the prescription reader upload workflow.",
    nodes: ["streamlit", "agents", "prescription", "python"],
    links: ["streamlit-agents", "streamlit-prescription", "python-agents", "python-prescription"],
    projects: ["agents", "prescription"]
  },
  flask: {
    label: "Skill connection",
    title: "Flask supports your web API and chatbot delivery layer.",
    text: "In the symptom checker, Flask exposes the chat interface that coordinates extraction, graph search, vector retrieval and response generation.",
    nodes: ["flask", "symptom", "python"],
    links: ["flask-symptom"],
    projects: ["symptom"]
  },
  "rag-skill": {
    label: "Skill connection",
    title: "RAG is the center of your AI engineering story.",
    text: "It connects the symptom checker and agentic RAG work through retrieval, grounding and knowledge-enhanced responses.",
    nodes: ["rag-skill", "symptom", "rag", "vector", "graph", "gemini"],
    links: ["rag-symptom", "rag-rag", "vector-symptom", "graph-symptom", "gemini-symptom"],
    projects: ["symptom", "rag"]
  },
  graph: {
    label: "Skill connection",
    title: "Neo4j makes your profile stand out as graph-aware AI engineering.",
    text: "The symptom checker uses graph relationships and Cypher generation to reason over medical concepts.",
    nodes: ["graph", "symptom", "rag-skill", "python"],
    links: ["graph-symptom", "rag-symptom"],
    projects: ["symptom"]
  },
  vector: {
    label: "Skill connection",
    title: "Qdrant vector search grounds your RAG work in semantic retrieval.",
    text: "It links symptoms to medical literature and gives your LLM workflows stronger context.",
    nodes: ["vector", "symptom", "rag", "rag-skill", "python"],
    links: ["vector-symptom", "rag-rag", "rag-symptom"],
    projects: ["symptom", "rag"]
  },
  cloud: {
    label: "Skill connection",
    title: "Google Cloud shows you can ship AI beyond a notebook.",
    text: "Cloud Vision, Firestore, Cloud Storage, Secret Manager and Cloud Run appear in your prescription reader deployment story.",
    nodes: ["cloud", "prescription", "ocr", "docker"],
    links: ["cloud-prescription", "ocr-prescription", "docker-prescription"],
    projects: ["prescription"]
  },
  ocr: {
    label: "Skill connection",
    title: "OCR gives your portfolio a concrete applied-AI use case.",
    text: "The prescription reader extracts handwritten medication text, matches it against Firestore records and supports translation.",
    nodes: ["ocr", "prescription", "cloud", "docker"],
    links: ["ocr-prescription", "cloud-prescription", "docker-prescription"],
    projects: ["prescription"]
  },
  docker: {
    label: "Skill connection",
    title: "Docker completes the deployment story.",
    text: "It connects your prescription reader to cloud deployment practices and reproducible application packaging.",
    nodes: ["docker", "prescription", "cloud"],
    links: ["docker-prescription", "cloud-prescription"],
    projects: ["prescription"]
  },
  python: {
    label: "Core language",
    title: "Python is the backbone across your AI systems.",
    text: "It appears across forecasting, agents, graph/vector RAG and cloud OCR workflows, tying research and product delivery together.",
    nodes: ["python", "weather", "agents", "symptom", "prescription", "rag"],
    links: ["python-weather", "python-agents", "python-prescription"],
    projects: ["weather", "agents", "symptom", "prescription", "rag"]
  }
};

const setMapState = (nodeId) => {
  const data = systemMap[nodeId];
  if (!data || !mapShell) return;

  const activeNodes = new Set(data.nodes);
  const activeLinks = new Set(data.links);
  const activeProjects = new Set(data.projects);

  mapNodes.forEach((node) => {
    const isActive = activeNodes.has(node.dataset.node);
    node.classList.toggle("active", isActive);
    node.classList.toggle("dimmed", !isActive);
  });

  mapLinks.forEach((link) => {
    link.classList.toggle("active", activeLinks.has(link.dataset.link));
  });

  projectCards.forEach((card) => {
    card.classList.toggle("project-highlight", activeProjects.has(card.dataset.projectCard));
  });

  if (mapInsight) {
    mapInsight.innerHTML = `
      <span class="map-insight-label">${data.label}</span>
      <h3>${data.title}</h3>
      <p>${data.text}</p>
    `;
  }
};

const resetMapState = () => {
  mapNodes.forEach((node) => node.classList.remove("active", "dimmed"));
  mapLinks.forEach((link) => link.classList.remove("active"));
  projectCards.forEach((card) => card.classList.remove("project-highlight"));
  if (mapInsight) {
    mapInsight.innerHTML = `
      <span class="map-insight-label">Start here</span>
      <h3>Hover a skill or project</h3>
      <p>The graph will light up the systems where that capability appears, from forecasting pipelines to medical RAG and cloud-deployed OCR.</p>
    `;
  }
};

mapNodes.forEach((node) => {
  const activate = () => setMapState(node.dataset.node);
  node.addEventListener("mouseenter", activate);
  node.addEventListener("focus", activate);
  node.addEventListener("click", activate);
  node.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      activate();
    }
  });
});

mapShell?.addEventListener("mouseleave", resetMapState);

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
