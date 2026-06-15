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
let lockedMapNode = null;

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
    title: "Built a 24-hour temperature forecasting pipeline from raw station data.",
    text: "Cleaned 43k+ hourly observations, engineered cyclical time features, lag variables and rolling statistics, then compared XGBoost, GRU, CNN-LSTM, CNN-GRU and TCN models with MAE/RMSE.",
    nodes: ["weather", "forecasting", "xgboost", "python"],
    links: ["forecasting-weather", "xgboost-weather", "python-weather"],
    projects: ["weather"]
  },
  agents: {
    label: "Multi-agent healthcare app",
    title: "Designed a multi-agent medical assistant around real patient workflows.",
    text: "Used CrewAI agents for diagnosis, treatment planning, specialist referral and appointment coordination, wrapped in a Streamlit interface with patient forms, session state and downloadable DOCX reports.",
    nodes: ["agents", "gemini", "crewai", "streamlit", "python"],
    links: ["gemini-agents", "crewai-agents", "streamlit-agents", "python-agents"],
    projects: ["agents"]
  },
  symptom: {
    label: "Graph + vector RAG",
    title: "Combined graph search, vector retrieval and PubMed evidence for symptom analysis.",
    text: "Built a Flask chatbot that extracts symptoms, generates Cypher for Neo4j, searches Qdrant with SapBERT/PubMedBERT embeddings, fetches PubMed articles and composes a Gemini response.",
    nodes: ["symptom", "rag-skill", "graph", "vector", "gemini", "flask", "python"],
    links: ["rag-symptom", "graph-symptom", "vector-symptom", "gemini-symptom", "flask-symptom"],
    projects: ["symptom"]
  },
  rag: {
    label: "Agentic RAG exploration",
    title: "Explored agentic RAG patterns for retrieval-aware reasoning.",
    text: "Focused on how agents decide when to retrieve, how retrieved context is routed into generation, and how knowledge-enhanced workflows can move beyond a single prompt-response chain.",
    nodes: ["rag", "rag-skill", "vector", "python"],
    links: ["rag-rag"],
    projects: ["rag"]
  },
  prescription: {
    label: "Cloud AI product",
    title: "Shipped an OCR prescription reader with cloud services behind it.",
    text: "Processed uploaded prescription images, ran Google Cloud Vision OCR, uploaded files to Cloud Storage, matched medication names from Firestore, translated drug details and packaged the app with Docker for Cloud Run.",
    nodes: ["prescription", "cloud", "ocr", "docker", "streamlit", "python"],
    links: ["cloud-prescription", "ocr-prescription", "docker-prescription", "streamlit-prescription", "python-prescription"],
    projects: ["prescription"]
  },
  forecasting: {
    label: "Skill connection",
    title: "Forecasting: built supervised time-series datasets from weather history.",
    text: "Created prediction-ready features from timestamped observations: cyclical encodings, lags, rolling windows and 24-hour-ahead targets for model benchmarking.",
    nodes: ["forecasting", "weather", "python", "xgboost"],
    links: ["forecasting-weather", "python-weather", "xgboost-weather"],
    projects: ["weather"]
  },
  xgboost: {
    label: "Skill connection",
    title: "XGBoost: used as a strong tabular baseline for forecasting.",
    text: "Applied gradient-boosted trees to engineered weather features and compared its error profile against recurrent and temporal deep-learning architectures.",
    nodes: ["xgboost", "weather", "forecasting"],
    links: ["xgboost-weather", "forecasting-weather"],
    projects: ["weather"]
  },
  gemini: {
    label: "Skill connection",
    title: "Gemini: used for reasoning and response generation inside healthcare apps.",
    text: "Integrated Gemini into agent workflows and symptom-checking responses, using retrieved context and structured prompts instead of relying on isolated chatbot answers.",
    nodes: ["gemini", "agents", "symptom", "crewai", "rag-skill"],
    links: ["gemini-agents", "gemini-symptom", "crewai-agents", "rag-symptom"],
    projects: ["agents", "symptom"]
  },
  crewai: {
    label: "Skill connection",
    title: "CrewAI: split a healthcare workflow into cooperating specialist agents.",
    text: "Defined agent roles, goals and sequential tasks for diagnostician, treatment advisor, specialist referral and appointment coordination logic.",
    nodes: ["crewai", "agents", "gemini", "streamlit"],
    links: ["crewai-agents", "gemini-agents", "streamlit-agents"],
    projects: ["agents"]
  },
  streamlit: {
    label: "Skill connection",
    title: "Streamlit: turned AI logic into usable interfaces.",
    text: "Built patient intake forms, file upload flows, progress states, result panels, download buttons and sidebar navigation for AI prototypes that users can actually try.",
    nodes: ["streamlit", "agents", "prescription", "python"],
    links: ["streamlit-agents", "streamlit-prescription", "python-agents", "python-prescription"],
    projects: ["agents", "prescription"]
  },
  flask: {
    label: "Skill connection",
    title: "Flask: exposed the symptom checker as a web chatbot API.",
    text: "Implemented routes for chat messages, validation, error handling and orchestration between symptom extraction, Neo4j querying, Qdrant search, PubMed retrieval and LLM output.",
    nodes: ["flask", "symptom", "python"],
    links: ["flask-symptom"],
    projects: ["symptom"]
  },
  "rag-skill": {
    label: "Skill connection",
    title: "RAG: grounded LLM answers with graph, vector and article retrieval.",
    text: "Designed flows where user input is transformed into retrieval queries, relevant medical context is collected, and the LLM response is generated from that evidence.",
    nodes: ["rag-skill", "symptom", "rag", "vector", "graph", "gemini"],
    links: ["rag-symptom", "rag-rag", "vector-symptom", "graph-symptom", "gemini-symptom"],
    projects: ["symptom", "rag"]
  },
  graph: {
    label: "Skill connection",
    title: "Neo4j: modeled medical relationships for symptom-to-disease lookup.",
    text: "Connected symptoms, diseases and relationships in a graph database, then used generated Cypher queries to retrieve structured medical candidates.",
    nodes: ["graph", "symptom", "rag-skill", "python"],
    links: ["graph-symptom", "rag-symptom"],
    projects: ["symptom"]
  },
  vector: {
    label: "Skill connection",
    title: "Qdrant: searched PubMed-style medical text by semantic similarity.",
    text: "Generated 768-dimensional biomedical embeddings, created/search Qdrant collections and stored article payloads for retrieval-augmented symptom analysis.",
    nodes: ["vector", "symptom", "rag", "rag-skill", "python"],
    links: ["vector-symptom", "rag-rag", "rag-symptom"],
    projects: ["symptom", "rag"]
  },
  cloud: {
    label: "Skill connection",
    title: "Google Cloud: connected OCR, storage, database and deployment services.",
    text: "Used Cloud Vision for text extraction, Firestore for medication data, Cloud Storage for image uploads, Secret Manager for credentials and Cloud Run/Docker for deployment.",
    nodes: ["cloud", "prescription", "ocr", "docker"],
    links: ["cloud-prescription", "ocr-prescription", "docker-prescription"],
    projects: ["prescription"]
  },
  ocr: {
    label: "Skill connection",
    title: "OCR: extracted medication text from prescription images.",
    text: "Built the image-processing flow around Google Cloud Vision, then matched extracted tokens against verified medication names and returned dosage, conditions and side effects.",
    nodes: ["ocr", "prescription", "cloud", "docker"],
    links: ["ocr-prescription", "cloud-prescription", "docker-prescription"],
    projects: ["prescription"]
  },
  docker: {
    label: "Skill connection",
    title: "Docker: packaged the prescription reader for reproducible cloud deployment.",
    text: "Created a containerized app flow that can run locally or be pushed to Google Cloud Run with environment-based service credentials.",
    nodes: ["docker", "prescription", "cloud"],
    links: ["docker-prescription", "cloud-prescription"],
    projects: ["prescription"]
  },
  python: {
    label: "Core language",
    title: "Python: the implementation layer across your AI portfolio.",
    text: "Used Python for ML pipelines, Streamlit/Flask apps, CrewAI orchestration, Neo4j/Qdrant clients, PubMed ingestion, OCR workflows, cloud APIs and DOCX report generation.",
    nodes: ["python", "weather", "agents", "symptom", "prescription", "rag"],
    links: ["python-weather", "python-agents", "python-prescription"],
    projects: ["weather", "agents", "symptom", "prescription", "rag"]
  }
};

const setMapState = (nodeId, isLocked = false) => {
  const data = systemMap[nodeId];
  if (!data || !mapShell) return;

  const activeNodes = new Set(data.nodes);
  const activeLinks = new Set(data.links);
  const activeProjects = new Set(data.projects);

  mapNodes.forEach((node) => {
    const isActive = activeNodes.has(node.dataset.node);
    node.classList.toggle("active", isActive);
    node.classList.toggle("dimmed", !isActive);
    node.classList.toggle("locked", isLocked && node.dataset.node === nodeId);
  });

  mapLinks.forEach((link) => {
    link.classList.toggle("active", activeLinks.has(link.dataset.link));
  });

  projectCards.forEach((card) => {
    card.classList.toggle("project-highlight", activeProjects.has(card.dataset.projectCard));
  });

  if (mapInsight) {
    mapInsight.innerHTML = `
      <span class="map-insight-label">${isLocked ? "Selected" : data.label}</span>
      <h3>${data.title}</h3>
      <p>${data.text}</p>
      ${isLocked ? '<button class="map-clear" type="button">Clear selection</button>' : ""}
    `;
    mapInsight.querySelector(".map-clear")?.addEventListener("click", () => {
      lockedMapNode = null;
      resetMapState();
    });
  }
};

const resetMapState = () => {
  lockedMapNode = null;
  mapNodes.forEach((node) => node.classList.remove("active", "dimmed"));
  mapNodes.forEach((node) => node.classList.remove("locked"));
  mapLinks.forEach((link) => link.classList.remove("active"));
  projectCards.forEach((card) => card.classList.remove("project-highlight"));
  if (mapInsight) {
    mapInsight.innerHTML = `
      <span class="map-insight-label">Start here</span>
      <h3>Click a skill or project to lock it</h3>
      <p>Hover to preview connections, then click a node to keep its explanation visible while you read.</p>
    `;
  }
};

mapNodes.forEach((node) => {
  const preview = () => {
    if (!lockedMapNode) setMapState(node.dataset.node);
  };
  const lock = () => {
    lockedMapNode = node.dataset.node;
    setMapState(lockedMapNode, true);
  };
  node.addEventListener("mouseenter", preview);
  node.addEventListener("focus", preview);
  node.addEventListener("click", (event) => {
    event.stopPropagation();
    lock();
  });
  node.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      lock();
    }
  });
});

mapShell?.addEventListener("mouseleave", () => {
  if (!lockedMapNode) resetMapState();
});

mapShell?.addEventListener("click", (event) => {
  if (event.target === mapShell) resetMapState();
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lockedMapNode) resetMapState();
});

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
