// js/works.js
const root = document.documentElement;
const themeBtn = document.getElementById("themeBtn");
const toastEl = document.getElementById("toast");

function toast(msg){
  toastEl.textContent = msg;
  toastEl.classList.add("show");
  clearTimeout(window.__t);
  window.__t = setTimeout(()=>toastEl.classList.remove("show"), 1600);
}

// Theme
const saved = localStorage.getItem("theme");
if(saved) root.setAttribute("data-theme", saved);
themeBtn.textContent = (root.getAttribute("data-theme")==="light") ? "☀️" : "🌙";

themeBtn.addEventListener("click", ()=>{
  const cur = root.getAttribute("data-theme") || "dark";
  const next = cur === "dark" ? "light" : "dark";
  root.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
  themeBtn.textContent = next === "light" ? "☀️" : "🌙";
  toast(`Theme: ${next}`);
});

/**
 * ✅ IMPORTANT FIXES:
 * 1) categories use consistent lowercase (web, mobile, ai, report)
 * 2) allow multiple categories using array `cats`
 * 3) modal buttons auto render only when links exist
 */
const projects = [
  {
    id: 1,
    title: "IPetro Visual Inspection Report",
    cats: ["web"],
    desc: "Inventory tracking + low stock alerts + role dashboards.",
    tags: ["Laravel", "Inertia", "MySQL"],
    img: "assets/project1.png",
    links: {
      demo: "",     // put your demo URL
      github: "https://github.com/Haikal097/IPetro-Visual-Inspection-Report.git",   // put your github URL
      report: ""    // put PDF/report URL
    }
  },
  {
    id: 2,
    title: "SULAM PROJECT",
    cats: ["web", "mobile"],
    desc: "Ordering, Announcement, Delivery, Products.",
    tags: ["Flutter", "GUI", "API", "Database"],
    img: "assets/project2.png",
    links: {
      demo: "https://www.youtube.com/watch?si=S5SwdQa1P1xfcge2&v=Zkb5oBkfVlA&feature=youtu.be",
      github: "https://github.com/Mirulfiz04/SULAM-PROJECT-NANADASH.git",
      report: "https://sites.google.com/view/nanadash/home"
    }
  },
  {
    id: 3,
    title: "Fruit & Vegetable Disease Classifier",
    cats: ["ai"],
    desc: "Keras model + Tkinter GUI + camera input and history.",
    tags: ["Python", "Keras", "Tkinter"],
    img: "assets/project3.png",
    links: {
      demo: "",
      github: "https://github.com/Mirulfiz04/Fruit-and-Vegetable-Disease-AI-Project.git",
      report: "assets/reports/FarmIntel-Fruit & Vegetable Disease Detector Group 28.pdf"
    }
  },
  {
    id: 4,
    title: "Event Management System",
    cats: ["web"],
    desc: "Analysis + Run whole program + Save Data to the Database.",
    tags: ["Python", "C++", "Database"],
    img: "assets/project4.png",
    links: {
      demo: "",
      github: "https://github.com/Mirulfiz04/Event-Management-System-workshop1.git",
      report: "assets/reports/Final Report AMIRUL HAFIZ BIN ANUAR B032310657.pdf"
    }
  }
];

const cardsEl = document.getElementById("cards");
const qEl = document.getElementById("q");
let activeCat = "all";

function prettyCat(c){
  return ({web:"Web", mobile:"Mobile", ai:"AI", report:"Docs"})[c] || "Project";
}

function render(){
  const q = (qEl.value || "").trim().toLowerCase();
  cardsEl.innerHTML = "";

  const filtered = projects.filter(p=>{
    const okCat =
      activeCat === "all"
        ? true
        : (p.cats || []).includes(activeCat);

    const okQ = !q
      ? true
      : (p.title + p.desc + (p.tags || []).join(" ")).toLowerCase().includes(q);

    return okCat && okQ;
  });

  filtered.forEach(p=>{
    const el = document.createElement("article");
    el.className = "card pCard";

    const catsLabel = (p.cats || []).map(prettyCat).join(" + ");

    el.innerHTML = `
      <div class="pTop">
        <h3 class="pTitle">${p.title}</h3>
        <span class="pCat">${catsLabel || "Project"}</span>
      </div>
      <p class="pDesc">${p.desc}</p>
      <div class="tags">${(p.tags || []).map(t=>`<span class="tag">${t}</span>`).join("")}</div>
    `;

    el.addEventListener("click", ()=>openModal(p));
    cardsEl.appendChild(el);
  });

  if(filtered.length === 0){
    const empty = document.createElement("div");
    empty.className = "card pCard";
    empty.innerHTML = `<h3 class="pTitle">No results</h3><p class="pDesc">Try another keyword or category.</p>`;
    cardsEl.appendChild(empty);
  }
}
render();

// Filters
document.getElementById("filters").addEventListener("click", (e)=>{
  const btn = e.target.closest(".chip");
  if(!btn) return;
  document.querySelectorAll(".chip").forEach(b=>b.classList.remove("active"));
  btn.classList.add("active");
  activeCat = btn.dataset.cat;
  render();
  toast(`Category: ${btn.textContent}`);
});

qEl.addEventListener("input", render);

// Modal
const modal = document.getElementById("modal");
const closeBtn = document.getElementById("close");
const mImg = document.getElementById("mImg");
const mTitle = document.getElementById("mTitle");
const mDesc = document.getElementById("mDesc");
const mTags = document.getElementById("mTags");
const mLinks = document.getElementById("mLinks");

function isValidLink(url){
  return typeof url === "string" && url.trim() !== "" && url.trim() !== "#";
}

function buildLinkButton(label, url, kind){
  const a = document.createElement("a");
  a.className = "linkBtn " + (kind === "demo" ? "primary" : "ghost");
  a.href = url;
  a.target = "_blank";
  a.rel = "noopener";

  const iconMap = {
    demo: "🔗",
    github: "💻",
    report: "📄"
  };

  a.innerHTML = `<span class="ico">${iconMap[kind] || "🔗"}</span>${label}`;
  return a;
}

function openModal(p){
  mTitle.textContent = p.title;
  mDesc.textContent = p.desc;
  mTags.innerHTML = (p.tags || []).map(t=>`<span class="tag">${t}</span>`).join("");

  // Image
  mImg.innerHTML = "";
  if(p.img){
    const img = document.createElement("img");
    img.src = p.img;
    img.alt = p.title;
    img.onerror = ()=>{ mImg.textContent = "Preview image not found (optional)."; };
    mImg.appendChild(img);
  }else{
    mImg.textContent = "No image (optional). Add screenshots in assets folder.";
  }

  // Links (auto show only if provided)
  mLinks.innerHTML = "";
  const links = p.links || {};

  if(isValidLink(links.demo))   mLinks.appendChild(buildLinkButton("Open Demo", links.demo, "demo"));
  if(isValidLink(links.github)) mLinks.appendChild(buildLinkButton("GitHub", links.github, "github"));
  if(isValidLink(links.report)) mLinks.appendChild(buildLinkButton("View Report", links.report, "report"));

  // If no links exist, show a small note
  if(mLinks.children.length === 0){
    const note = document.createElement("div");
    note.className = "muted";
    note.textContent = "No link available yet (optional).";
    mLinks.appendChild(note);
  }

  modal.classList.add("show");
  modal.setAttribute("aria-hidden","false");
  toast("Opened preview");
}

function closeModal(){
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden","true");
}

closeBtn.addEventListener("click", closeModal);
modal.addEventListener("click", (e)=>{ if(e.target === modal) closeModal(); });
document.addEventListener("keydown", (e)=>{ if(e.key === "Escape") closeModal(); });
