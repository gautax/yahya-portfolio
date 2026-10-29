const root = document.documentElement;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const themeButton = document.querySelector(".theme-toggle");

function setTheme(theme) {
  root.dataset.theme = theme === "dark" ? "dark" : "light";
  const label = root.dataset.theme === "dark" ? "Switch to light mode" : "Switch to dark mode";
  themeButton.setAttribute("aria-label", label);
  themeButton.title = label;
  document.querySelector('meta[name="theme-color"]').content = root.dataset.theme === "dark" ? "#111a16" : "#f7f9f8";
  try { localStorage.setItem("theme", root.dataset.theme); } catch {}
  root.dispatchEvent(new Event("themechange"));
}
setTheme(root.dataset.theme);
themeButton.addEventListener("click", () => setTheme(root.dataset.theme === "dark" ? "light" : "dark"));

const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".main-nav");
const resumeMenu = document.querySelector(".resume-menu");
function closeMenu() {
  navigation.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open menu");
}
menuButton.addEventListener("click", () => {
  const open = navigation.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Close menu" : "Open menu");
});
navigation.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("click", (event) => {
  if (!event.target.closest(".resume-menu")) resumeMenu.open = false;
  if (!event.target.closest(".site-header")) closeMenu();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") { closeMenu(); resumeMenu.open = false; }
});

const projects = {
  outreach: {
    title: "AI Job Discovery & Outreach Platform",
    category: "Workflow automation / Recent project",
    categories: ["automation", "genai", "cloud"],
    description: "A coordinated system for company discovery, contact research and evidence-grounded outreach, with a human in control of every send.",
    flow: ["Discover", "Qualify", "Research", "Review & send"],
    stages: [[0, 1, 2, 3], [0], [1, 2], [3], [1, 3], [3], [0, 1, 2, 3], [2]],
    proof: "12 connected workflows",
    evidence: [["12", "n8n workflows"], ["5", "dashboard views"]],
    preview: { kind: "image", label: "Repository screenshot", caption: "Company qualification / n8n workflow", source: "assets/outreach-company-qualification.png" },
    links: [
      ["Explore GitHub", "https://github.com/gautax/ai-job-outreach-platform", "github"],
      ["Watch demo", "https://youtu.be/knn3NYxtOrQ", "video"]
    ],
    stack: [
      ["n8n", "Twelve workflows coordinate discovery, qualification, contact research and outreach. Conditional routing and validated state changes keep drafting separate from approval to send."],
      ["FastAPI", "A dedicated Scrapling service exposes discovery and article-detail endpoints, with bounded pagination, URL validation and structured results for n8n."],
      ["Vertex AI", "Model nodes analyze company fit, extract contact evidence and generate outreach drafts. Structured outputs and validation constrain unsupported claims."],
      ["Streamlit", "Five dashboard views support opportunity review, manual contacts, editable drafts, follow-ups and replies through authenticated webhooks."],
      ["Google Sheets", "Four datasets store companies, qualifications, opportunities and contact candidates. Bulk reads and normalized keys reduce API calls and prevent duplicates."],
      ["Gmail API", "The sender rechecks approval, recipient confidence and previous send state. Reply monitoring uses thread IDs and timestamps to update campaign state."],
      ["Docker / GCP", "The original deployment isolated n8n, Streamlit and FastAPI on a Google Cloud VM, with Docker networking and private administration through Tailscale."],
      ["Brave / Hunter", "Brave Search supplies contact and company evidence. Hunter finds or verifies email addresses before candidates are scored and reviewed."]
    ]
  },
  weather: {
    title: "24-Hour Weather Forecasting",
    category: "Machine learning / Time-series research",
    categories: ["ml"],
    description: "An end-to-end temperature forecasting pipeline built from five years of weather-station observations, comparing boosted trees and temporal neural networks.",
    flow: ["Clean data", "Engineer features", "Train & compare", "Forecast 24h"],
    stages: [[0, 1], [2, 3], [2, 3], [2, 3], [2, 3], [2], [3]],
    evidence: [["43k+", "hourly observations"], ["24h", "forecast horizon"]],
    preview: { kind: "forecast", label: "Repository forecast sample", caption: "Predicted temperature / next 24 hours", source: "https://github.com/gautax/Weather-Forcasting-Using-ML/blob/main/models/sample_output.csv" },
    proof: "43k+ observations / 43 features",
    links: [
      ["Explore GitHub", "https://github.com/gautax/Weather-Forcasting-Using-ML", "github"],
      ["Read article", "https://medium.com/@yahya.menkari/from-raw-weather-station-data-to-24-hour-forecasts-building-an-end-to-end-ai-forecasting-system-c73472605fa1", "article"]
    ],
    stack: [
      ["Python", "Processed 43,000+ hourly observations and expanded 19 original variables into 43 predictive features with cyclical encodings, lags and rolling statistics."],
      ["XGBoost", "Benchmarked gradient-boosted trees on engineered weather features against neural forecasting models, then optimized the selected model."],
      ["GRU", "Used recurrent models to learn temporal dependencies in weather sequences for 24-hour-ahead temperature prediction."],
      ["CNN-LSTM / GRU", "Compared hybrid convolutional-recurrent models that combine local sequence patterns with longer temporal dependencies."],
      ["TCN", "Benchmarked temporal convolutional networks as an alternative to recurrent architectures for sequence forecasting."],
      ["MAE / RMSE", "Evaluated forecasting error on unseen observations. Optimized XGBoost achieved MAE 2.34, RMSE 3.05 and R-squared 0.91."],
      ["Flask", "Served the final forecasting application: upload raw or engineered station data, preprocess it, run multi-output XGBoost inference and return a 24-hour forecast for the dashboard."]
    ]
  },
  symptom: {
    title: "AI-Powered Symptom Checker",
    category: "Healthcare AI / Graph & vector RAG",
    categories: ["genai"],
    description: "A medical-information prototype combining symptom relationships, biomedical semantic search and PubMed literature before generating a contextual response.",
    flow: ["Extract symptoms", "Graph + vectors", "Retrieve evidence", "Generate reply"],
    stages: [[1], [1, 2], [0, 1], [2], [3], [0, 3]],
    proof: "Graph + vector + literature retrieval",
    evidence: [["3", "retrieval sources"], ["768D", "biomedical embeddings"]],
    preview: { kind: "retrieval", label: "System architecture", caption: "Graph, vectors and literature / one response", source: "https://github.com/gautax/AI-Powered-Symptom-Checker" },
    links: [["Explore GitHub", "https://github.com/gautax/AI-Powered-Symptom-Checker", "github"]],
    stack: [
      ["Neo4j", "Executed generated Cypher queries against symptom and disease relationships, returning structured candidates for the response pipeline."],
      ["Qdrant", "Created a cosine-similarity collection, stored article payloads and searched for the top biomedical text matches."],
      ["SapBERT", "Generated 768-dimensional embeddings with SapBERT-from-PubMedBERT to represent user symptoms and medical article abstracts."],
      ["PubMed", "Used Entrez search and batch article retrieval, normalized titles and abstracts, and indexed retrieved evidence in Qdrant."],
      ["Gemini", "Combined retrieved graph results, vector matches and PubMed articles into a conversational response based on the supplied context."],
      ["Flask", "Exposed a POST chat route with message validation, JSON responses and error handling; the same processing pipeline also supports a CLI."]
    ]
  },
  agents: {
    title: "Medical AI Assistant with Agents",
    category: "Healthcare AI / Multi-agent workflows",
    categories: ["genai", "automation"],
    description: "A prototype that coordinates diagnosis support, treatment planning, specialist referral and appointment email drafting through dedicated AI agents.",
    flow: ["Patient intake", "Agent tasks", "Referral search", "Report & draft"],
    stages: [[1, 2], [1], [0, 3], [2], [3]],
    proof: "4 specialist agent roles",
    evidence: [["4", "specialist agent roles"], ["DOCX", "downloadable reports"]],
    preview: { kind: "agents", label: "Agent architecture", caption: "Patient context / specialist tasks", source: "https://github.com/gautax/medical-ai-app-with-agents" },
    links: [["Explore GitHub", "https://github.com/gautax/medical-ai-app-with-agents", "github"]],
    stack: [
      ["CrewAI", "Defined diagnostician, treatment advisor, referral and appointment agents, with sequential tasks passing patient context and earlier outputs."],
      ["Gemini", "Provided the language-model layer for context-aware agent tasks, with role definitions and expected outputs in the prompts."],
      ["Streamlit", "Built patient forms, result panels, sidebar navigation and session state so users can move from an assessment to specialist referral."],
      ["Serper", "Connected a search tool to support information retrieval and location-based specialist research within the agent workflows."],
      ["python-docx", "Generated downloadable Word reports containing patient context, assessment, treatment output and a medical disclaimer."]
    ]
  },
  prescription: {
    title: "Prescription Reader AI",
    category: "Cloud AI / OCR application",
    categories: ["cloud"],
    description: "A prescription-image workflow that extracts medication text, looks up drug information in Firestore and translates the results in a Streamlit interface.",
    flow: ["Upload image", "Extract text", "Match medication", "Translate results"],
    stages: [[1], [2], [0], [3], [0, 3], [0, 1, 2, 3]],
    proof: "OCR to multilingual medication details",
    evidence: [["OCR", "prescription text"], ["6", "translation languages"]],
    preview: { kind: "document", label: "Processing architecture", caption: "Image input / translated medication details", source: "https://github.com/gautax/cloud-deployment-app" },
    links: [["Explore GitHub", "https://github.com/gautax/cloud-deployment-app", "github"]],
    stack: [
      ["Cloud Vision", "Submitted uploaded prescription images to Google's OCR service and passed extracted text into the medication-matching workflow."],
      ["Firestore", "Loaded medication names, matched extracted tokens and retrieved dosage, conditions and side effects from cloud records."],
      ["Cloud Storage", "Uploaded prescription images with unique object names before processing the image through the cloud workflow."],
      ["Translate API", "Translated medication details into a selected language, including French, Arabic, Spanish, German, Chinese or Hindi."],
      ["Streamlit", "Provided file upload, image preview, language selection, processing progress and result display with error states."],
      ["Docker / Cloud Run", "Packaged the Python application in a container and documented image builds and deployment to Google Cloud Run."]
    ]
  },
  rag: {
    title: "Agentic RAG Exploration",
    category: "Generative AI / Notebook exploration",
    categories: ["genai"],
    description: "A notebook project exploring retrieval pipelines and tool orchestration for applications that combine language models with external knowledge.",
    flow: ["Question", "Retrieve", "Provide context", "Generate"],
    stages: [[1, 2, 3], [1, 3], [0, 1, 2, 3]],
    proof: "Exploratory notebook project",
    evidence: [["RAG", "retrieval patterns"], ["Notebook", "exploratory project"]],
    preview: { kind: "concept", label: "Retrieval concept", caption: "Knowledge-enhanced generation / exploration", source: "https://github.com/gautax/Agentic_RAG" },
    links: [["Explore GitHub", "https://github.com/gautax/Agentic_RAG", "github"]],
    stack: [
      ["RAG", "Exploration of retrieval-augmented workflows that provide an LLM with external context when answering a question."],
      ["Tool orchestration", "Investigation of how retrieval and generation can be coordinated within an agentic application workflow."],
      ["Jupyter", "Notebook-based experimentation and documentation of retrieval and orchestration ideas."]
    ]
  }
};

const tabs = [...document.querySelectorAll("[data-project]")];
const filterButtons = [...document.querySelectorAll("[data-filter]")];
const panel = document.querySelector("#project-panel");
const stackContainer = document.querySelector("#project-stack");
const detail = document.querySelector("#stack-detail");
const tabList = document.querySelector(".project-tabs");
const projectPicker = document.querySelector("#project-picker");
const narrowExplorer = window.matchMedia("(max-width: 800px)");
const selectedTools = new Map();
let selectedProject = "outreach";
let forecastHour = 1;

// Actual values from Weather-Forcasting-Using-ML/models/sample_output.csv.
const sampleForecast = [25.155895, 24.129873, 23.669823, 22.943052, 20.781652, 18.901459, 16.976904, 16.131338, 16.236612, 15.2522955, 14.614417, 14.989515, 14.504942, 14.107281, 14.312616, 16.721613, 19.557991, 20.520939, 21.201319, 22.60783, 22.572548, 23.022682, 23.257122, 23.722075];

const iconMarkup = (name) => '<svg class="icon" aria-hidden="true"><use href="#i-' + name + '" /></svg>';

function forecastPoint(index) {
  return [32 + index * 12, 12 + (28 - sampleForecast[index]) / 16 * 100];
}

function updateForecast(hour) {
  forecastHour = Math.max(1, Math.min(24, Number(hour)));
  const [x, y] = forecastPoint(forecastHour - 1);
  document.querySelectorAll("[data-forecast-preview]").forEach((preview) => {
    preview.querySelector("input").value = forecastHour;
    preview.querySelector("output").textContent = "t+" + forecastHour + " / " + sampleForecast[forecastHour - 1].toFixed(1) + " C";
    preview.querySelector(".forecast-marker").setAttribute("cx", x);
    preview.querySelector(".forecast-marker").setAttribute("cy", y);
    const guide = preview.querySelector(".forecast-guide");
    guide.setAttribute("x1", x);
    guide.setAttribute("x2", x);
  });
}

function renderPreview(container, project) {
  const kind = project.preview.kind;
  if (kind === "image") {
    container.innerHTML = '<img src="assets/outreach-company-qualification.png" alt="Actual n8n company qualification workflow with website scanning and career page routing" width="1309" height="466" />';
  } else if (kind === "forecast") {
    const line = sampleForecast.map((_, i) => forecastPoint(i).join(",")).join(" ");
    container.innerHTML = `
      <div data-forecast-preview>
        <svg class="forecast-chart" viewBox="0 0 330 150" role="img" aria-label="24 sample hourly temperature predictions, falling from about 25 to 14 Celsius before rising to 24 Celsius">
          <path class="chart-grid" d="M32 12H308M32 62H308M32 112H308" fill="none" />
          <text x="1" y="16">28 C</text><text x="1" y="66">20 C</text><text x="1" y="116">12 C</text>
          <text x="32" y="140">t+1</text><text x="160" y="140">t+12</text><text x="282" y="140">t+24</text>
          <polyline class="forecast-line" points="${line}" />
          <line class="forecast-guide" y1="12" y2="112" /><circle class="forecast-marker" r="4" />
        </svg>
        <div class="forecast-controls"><input type="range" min="1" max="24" step="1" value="${forecastHour}" aria-label="Forecast hour" /><output aria-live="polite"></output></div>
        <a class="forecast-source" href="${project.preview.source}" target="_blank" rel="noreferrer">Source: repository sample output</a>
      </div>`;
    container.querySelector("input").addEventListener("input", (event) => updateForecast(event.target.value));
    updateForecast(forecastHour);
  } else if (kind === "retrieval") {
    container.innerHTML = `
      <div class="diagram">
        <div class="diagram-node" data-preview-stage="0">Natural-language symptoms</div>
        <div class="diagram-branches"><div class="diagram-node" data-preview-stage="1"><small>GRAPH</small>Neo4j</div><div class="diagram-node" data-preview-stage="1"><small>VECTORS</small>Qdrant</div><div class="diagram-node" data-preview-stage="2"><small>LITERATURE</small>PubMed</div></div>
        <div class="diagram-node" data-preview-stage="3">Gemini <small>Contextual response</small></div>
      </div>`;
  } else if (kind === "agents") {
    container.innerHTML = `
      <div class="diagram">
        <span class="diagram-label">CrewAI / shared patient context</span>
        <div class="agent-grid"><div class="diagram-node" data-preview-stage="1"><small>01 / ASSESS</small>Diagnostician</div><div class="diagram-node" data-preview-stage="1"><small>02 / PLAN</small>Treatment advisor</div><div class="diagram-node" data-preview-stage="2"><small>03 / REFER</small>Specialist referral</div><div class="diagram-node" data-preview-stage="3"><small>04 / COORDINATE</small>Appointment draft</div></div>
      </div>`;
  } else if (kind === "document") {
    container.innerHTML = `
      <div class="diagram document-diagram"><div class="diagram-node" data-preview-stage="0"><small>01</small>Prescription image</div><div class="diagram-node" data-preview-stage="1"><small>02</small>Cloud Vision / OCR</div><div class="diagram-node" data-preview-stage="2"><small>03</small>Firestore / medication lookup</div><div class="diagram-node" data-preview-stage="3"><small>04</small>Translated drug details</div></div>`;
  } else {
    container.innerHTML = `
      <div class="diagram retrieval-concept"><span class="diagram-label">Exploration / retrieval-augmented generation</span><div class="diagram-node" data-preview-stage="0">Question <code>query</code></div><div class="diagram-node" data-preview-stage="1">Retrieve knowledge <code>context</code></div><div class="diagram-node" data-preview-stage="3">Generate response <code>query + context</code></div></div>`;
  }
}

function updatePreviewHighlights(project, index) {
  document.querySelectorAll("[data-preview-stage]").forEach((node) => {
    node.classList.toggle("is-active", project.stages[index].includes(Number(node.dataset.previewStage)));
  });
}

function syncProjectPicker() {
  const visible = tabs.filter((tab) => !tab.hidden);
  projectPicker.replaceChildren(...visible.map((tab) => {
    const option = document.createElement("option");
    option.value = tab.dataset.project;
    option.textContent = projects[option.value].title;
    return option;
  }));
  projectPicker.value = selectedProject;
  const index = visible.findIndex((tab) => tab.dataset.project === selectedProject) + 1;
  document.querySelector("#project-position").textContent = String(index).padStart(2, "0") + " / " + String(visible.length).padStart(2, "0");
}

function selectTool(index) {
  const project = projects[selectedProject];
  selectedTools.set(selectedProject, index);
  [...stackContainer.children].forEach((button, i) => button.setAttribute("aria-pressed", String(i === index)));
  const [name, explanation] = project.stack[index];
  [...document.querySelector("#project-flow").children].forEach((step, i) => {
    const active = project.stages[index].includes(i);
    step.classList.toggle("active", active);
    step.setAttribute("aria-label", project.flow[i] + (active ? " - uses " + name : ""));
  });
  detail.querySelector(".stack-detail-label").textContent = "Implementation / " + name;
  detail.querySelector("p").textContent = explanation;
  updatePreviewHighlights(project, index);
}

function selectProject(id, animate = true) {
  const project = projects[id];
  if (!project) return;
  selectedProject = id;
  tabs.forEach((tab) => {
    const selected = tab.dataset.project === id;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });
  panel.setAttribute("aria-labelledby", "tab-" + id);
  document.querySelector("#project-title").textContent = project.title;
  document.querySelector("#project-category").textContent = project.category;
  document.querySelector("#project-description").textContent = project.description;
  document.querySelector("#project-proof").textContent = project.proof;
  document.querySelector("#project-evidence").replaceChildren(...project.evidence.map(([value, label]) => {
    const entry = document.createElement("div");
    const term = document.createElement("dt");
    const figure = document.createElement("dd");
    term.textContent = label;
    figure.textContent = value;
    entry.append(term, figure);
    return entry;
  }));
  document.querySelector("#preview-kind").textContent = project.preview.label;
  document.querySelector("#preview-caption").textContent = project.preview.caption;
  document.querySelector(".preview-expand").setAttribute("aria-label", "Expand " + project.title + " preview");
  renderPreview(document.querySelector("#project-preview"), project);
  const flow = document.querySelector("#project-flow");
  flow.replaceChildren(...project.flow.map((step, i) => {
    const item = document.createElement("li");
    const number = document.createElement("span");
    number.textContent = String(i + 1).padStart(2, "0");
    item.append(number, document.createTextNode(step));
    return item;
  }));
  document.querySelector("#stack-count").textContent = project.stack.length + " technologies";
  stackContainer.replaceChildren(...project.stack.map(([name], i) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "stack-tool";
    button.textContent = name;
    button.setAttribute("aria-controls", "stack-detail");
    button.setAttribute("aria-pressed", "false");
    button.addEventListener("click", () => selectTool(i));
    return button;
  }));
  selectTool(selectedTools.get(id) ?? 0);
  document.querySelector("#project-links").replaceChildren(...project.links.map(([name, href, type]) => {
    const link = document.createElement("a");
    link.href = href;
    link.target = "_blank";
    link.rel = "noreferrer";
    link.className = type === "video" ? "demo-link" : "text-link";
    link.innerHTML = type === "video" ? iconMarkup("play") + name : name + iconMarkup("arrow");
    return link;
  }));
  document.querySelector(".project-status").textContent = project.title + " selected.";
  syncProjectPicker();
  updateOrientation();
  if (animate && !reducedMotion.matches) {
    panel.getAnimations().forEach((animation) => animation.cancel());
    panel.animate([{ opacity: 0.65, transform: "translateY(4px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 180, easing: "ease-out" });
  }
}

function filterProjects(filter) {
  filterButtons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.filter === filter)));
  const visible = tabs.filter((tab) => {
    tab.hidden = filter !== "all" && !projects[tab.dataset.project].categories.includes(filter);
    return !tab.hidden;
  });
  document.querySelector("#project-count").textContent = String(visible.length).padStart(2, "0");
  if (!visible.some((tab) => tab.dataset.project === selectedProject)) selectProject(visible[0].dataset.project);
  syncProjectPicker();
  document.querySelector(".project-status").textContent = visible.length + " projects shown. " + projects[selectedProject].title + " selected.";
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => selectProject(tab.dataset.project));
  tab.addEventListener("keydown", (event) => {
    const visible = tabs.filter((item) => !item.hidden);
    const current = visible.indexOf(tab);
    const nextKey = "ArrowDown";
    const previousKey = "ArrowUp";
    let next;
    if (event.key === nextKey) next = visible[(current + 1) % visible.length];
    if (event.key === previousKey) next = visible[(current - 1 + visible.length) % visible.length];
    if (event.key === "Home") next = visible[0];
    if (event.key === "End") next = visible[visible.length - 1];
    if (next) {
      event.preventDefault();
      selectProject(next.dataset.project);
      next.focus({ preventScroll: true });
    }
  });
});
filterButtons.forEach((button) => button.addEventListener("click", () => filterProjects(button.dataset.filter)));
projectPicker.addEventListener("change", () => selectProject(projectPicker.value));
document.querySelectorAll("[data-project-link]").forEach((link) => link.addEventListener("click", () => {
  filterProjects("all");
  selectProject(link.dataset.projectLink);
}));
function updateOrientation() {
  if (narrowExplorer.matches) {
    panel.removeAttribute("aria-labelledby");
    panel.setAttribute("aria-label", projects[selectedProject].title);
  } else {
    panel.removeAttribute("aria-label");
    panel.setAttribute("aria-labelledby", "tab-" + selectedProject);
  }
}
narrowExplorer.addEventListener("change", updateOrientation);
updateOrientation();
selectProject(selectedProject, false);

const previewDialog = document.querySelector("#preview-dialog");
document.querySelector(".preview-expand").addEventListener("click", () => {
  const project = projects[selectedProject];
  document.querySelector("#preview-title").textContent = project.preview.caption;
  document.querySelector("#dialog-kind").textContent = project.preview.label;
  document.querySelector("#preview-source").href = project.preview.source;
  renderPreview(document.querySelector("#dialog-preview"), project);
  updatePreviewHighlights(project, selectedTools.get(selectedProject) ?? 0);
  previewDialog.showModal();
});
document.querySelector(".close-dialog").addEventListener("click", () => previewDialog.close());
previewDialog.addEventListener("click", (event) => {
  const bounds = previewDialog.getBoundingClientRect();
  if (event.target === previewDialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) previewDialog.close();
});

const activeSectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navigation.querySelectorAll("a").forEach((link) => {
      if (link.hash === "#" + entry.target.id) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  });
}, { rootMargin: "-15% 0px -55% 0px", threshold: 0 });
document.querySelectorAll("main > section").forEach((section) => activeSectionObserver.observe(section));

// Render only while the hero is visible; reduced motion keeps a static network.
function initHeroNetwork() {
  const canvas = document.querySelector("#hero-network");
  const hero = document.querySelector(".hero");
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  let width = 0, height = 0, frame = 0, time = 0, lastTime = 0;
  let visible = true;
  let ink = getComputedStyle(root).getPropertyValue("--accent").trim();
  const pointer = { x: -1000, y: -1000 };
  const points = Array.from({ length: 30 }, (_, i) => ({
    x: 0.48 + (i % 6) * 0.105,
    y: 0.08 + Math.floor(i / 6) * 0.19,
    phase: i * 1.67
  }));
  function draw(now = 0) {
    frame = 0;
    time += Math.min(now - lastTime, 40) / 1000;
    lastTime = now;
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = ink;
    ctx.fillStyle = ink;
    const nodes = points.map((point) => {
      let x = point.x * width + Math.sin(time * 0.23 + point.phase) * 15;
      let y = point.y * height + Math.cos(time * 0.2 + point.phase) * 12;
      const distance = Math.hypot(pointer.x - x, pointer.y - y);
      if (distance < 170) {
        x += (pointer.x - x) * 0.045;
        y += (pointer.y - y) * 0.045;
      }
      return { x, y };
    });
    nodes.forEach((node, i) => {
      const opacity = Math.max(0, Math.min(1, (node.x / width - 0.45) * 1.8));
      for (let j = i + 1; j < nodes.length; j++) {
        const other = nodes[j];
        const distance = Math.hypot(node.x - other.x, node.y - other.y);
        if (distance < width * 0.145) {
          ctx.globalAlpha = opacity * 0.11 * (1 - distance / (width * 0.18));
          ctx.lineWidth = 0.8;
          ctx.beginPath(); ctx.moveTo(node.x, node.y); ctx.lineTo(other.x, other.y); ctx.stroke();
        }
      }
      ctx.globalAlpha = opacity * 0.25;
      ctx.beginPath(); ctx.arc(node.x, node.y, i % 5 === 0 ? 2.5 : 1.4, 0, Math.PI * 2); ctx.fill();
    });
    ctx.globalAlpha = 1;
    if (visible && !document.hidden && !reducedMotion.matches) frame = requestAnimationFrame(draw);
  }
  function refresh() {
    cancelAnimationFrame(frame);
    frame = 0;
    lastTime = 0;
    draw();
  }
  new ResizeObserver(() => {
    width = hero.clientWidth;
    height = hero.clientHeight;
    const ratio = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    refresh();
  }).observe(hero);
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) refresh();
    else { cancelAnimationFrame(frame); frame = 0; }
  }).observe(hero);
  hero.addEventListener("pointermove", (event) => {
    const bounds = hero.getBoundingClientRect();
    pointer.x = event.clientX - bounds.left;
    pointer.y = event.clientY - bounds.top;
  });
  hero.addEventListener("pointerleave", () => { pointer.x = -1000; pointer.y = -1000; });
  root.addEventListener("themechange", () => { ink = getComputedStyle(root).getPropertyValue("--accent").trim(); refresh(); });
  reducedMotion.addEventListener("change", refresh);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) { cancelAnimationFrame(frame); frame = 0; }
    else if (visible) refresh();
  });
}
initHeroNetwork();
