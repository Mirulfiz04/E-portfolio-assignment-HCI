// js/academic.js
const root = document.documentElement;
const themeBtn = document.getElementById("themeBtn");
const toastEl = document.getElementById("toast");

function toast(msg){
  if(!toastEl) return;
  toastEl.textContent = msg;
  toastEl.classList.add("show");
  clearTimeout(window.__t);
  window.__t = setTimeout(()=>toastEl.classList.remove("show"), 1600);
}

// Theme
const saved = localStorage.getItem("theme");
if(saved) root.setAttribute("data-theme", saved);
if(themeBtn){
  themeBtn.textContent = (root.getAttribute("data-theme")==="light") ? "☀️" : "🌙";
  themeBtn.addEventListener("click", ()=>{
    const cur = root.getAttribute("data-theme") || "dark";
    const next = cur === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    themeBtn.textContent = next === "light" ? "☀️" : "🌙";
    toast(`Theme: ${next}`);
  });
}

// ✅ Academic timeline data (edit these)
const academicData = [
  {
    level: "Degree",
    title: "Bachelor of Computer Science (Software Development)",
    place: "Universiti Teknikal Malaysia Melaka (UTeM)",
    year: "2023 – Present",
    details: [
      "Focus: Software Engineering, UI/UX, Web & Mobile development",
      "Projects: e-Portfolio, SIMS, AI Classifier, etc."
    ]
  },
  {
    level: "Matriculation",
    title: "Matriculation Programme",
    place: "Kolej Matrikulasi",
    year: "2022 – 2023",
    details: [
      "Stream: (Edit your stream here)",
      "Built strong foundation in computing & mathematics"
    ]
  },
  {
    level: "SPM",
    title: "Sijil Pelajaran Malaysia (SPM)",
    place: "Secondary School (Edit your school name)",
    year: "2021",
    details: [
      "Activities: (Edit your activities)",
      "Results: (Optional)"
    ]
  }
];

const timelineEl = document.getElementById("timeline");
const filtersEl = document.getElementById("filters");

function render(filter="all"){
  if(!timelineEl) return;
  timelineEl.innerHTML = "";

  const items = academicData.filter(item => filter === "all" ? true : item.level === filter);

  items.forEach((item)=>{
    const card = document.createElement("article");
    card.className = "card tCard";
    card.innerHTML = `
      <div class="tTop">
        <div class="tLeft">
          <span class="tPill">${item.level}</span>
          <h3 class="tTitle">${item.title}</h3>
          <p class="tMeta">${item.place} • <b>${item.year}</b></p>
        </div>
        <button class="tToggle" type="button" aria-expanded="false">+</button>
      </div>

      <div class="tMore" hidden>
        <ul class="tList">
          ${(item.details || []).map(d=>`<li>${d}</li>`).join("")}
        </ul>
      </div>
    `;

    const btn = card.querySelector(".tToggle");
    const more = card.querySelector(".tMore");

    btn.addEventListener("click", (e)=>{
      e.stopPropagation();
      const isOpen = !more.hasAttribute("hidden");
      if(isOpen){
        more.setAttribute("hidden", "");
        btn.textContent = "+";
        btn.setAttribute("aria-expanded","false");
      }else{
        more.removeAttribute("hidden");
        btn.textContent = "–";
        btn.setAttribute("aria-expanded","true");
      }
    });

    // Click card also toggles
    card.addEventListener("click", ()=>{
      btn.click();
    });

    timelineEl.appendChild(card);
  });

  if(items.length === 0){
    const empty = document.createElement("div");
    empty.className = "card tCard";
    empty.innerHTML = `<h3 class="tTitle">No results</h3><p class="muted">Try another filter.</p>`;
    timelineEl.appendChild(empty);
  }
}

render("all");

// Filters
if(filtersEl){
  filtersEl.addEventListener("click", (e)=>{
    const btn = e.target.closest(".chip");
    if(!btn) return;
    document.querySelectorAll(".chip").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    const filter = btn.dataset.filter;
    render(filter);
    toast(`Filter: ${filter}`);
  });
}
