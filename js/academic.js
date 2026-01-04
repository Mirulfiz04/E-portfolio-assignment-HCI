// js/academic.js  ✅ (Academic Timeline + Filter + Expand + Theme + Toast)

const root = document.documentElement;
const themeBtn = document.getElementById("themeBtn");
const toastEl = document.getElementById("toast");
const timelineEl = document.getElementById("timeline");
const filtersEl = document.getElementById("filters");

function toast(msg) {
  if (!toastEl) return;
  toastEl.textContent = msg;
  toastEl.classList.add("show");
  clearTimeout(window.__t);
  window.__t = setTimeout(() => toastEl.classList.remove("show"), 1600);
}

/* ---------------------------
   THEME (same behavior as others)
---------------------------- */
const saved = localStorage.getItem("theme");
if (saved) root.setAttribute("data-theme", saved);
if (themeBtn) {
  themeBtn.textContent =
    root.getAttribute("data-theme") === "light" ? "☀️" : "🌙";

  themeBtn.addEventListener("click", () => {
    const cur = root.getAttribute("data-theme") || "dark";
    const next = cur === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    themeBtn.textContent = next === "light" ? "☀️" : "🌙";
    toast(`Theme: ${next}`);
  });
}

/* ---------------------------
   ACADEMIC DATA (edit images/links here)
   ✅ IMPORTANT: Ensure these image paths exist in your repo
---------------------------- */
const academic = [
  {
    id: "deg",
    level: "Degree",
    title: "Bachelor of Computer Science (Software Development)",
    place: "Universiti Teknikal Malaysia Melaka (UTeM)",
    year: "2023 – Present",
    img: "assets/logos/utem.png", // ✅ put this file
    details: [
      "Program: Software Development",
      "Focus: UI/UX, Web, Mobile, AI projects",
      "Activities: e-Portfolio, projects, teamwork"
    ]
  },
  {
    id: "matric",
    level: "Matriculation",
    title: "Matriculation Programme (CGPA 3.89)",
    place: "Kolej Matrikulasi Kejuruteraan Pahang (KMKPh)",
    year: "2022 – 2023",
    img: "assets/logos/kmkph.png", // ✅ put this file
    details: [
      "Foundation studies before degree",
      "Prepared for problem-solving and General Skills ",
      "Built discipline in learning"
    ]
  },
  {
    id: "spm",
    level: "SPM",
    title: "Sijil Pelajaran Malaysia (SPM) (5A 3B 1 C)",
    place: "Secondary School",
    year: "2016 – 2021",
    img: "assets/logos/smktpg.png", // ✅ put this file
    details: [
      "Core subjects + elective subjects",
      "Improve Communication and Personal Developments",
      "Completed SPM successfully"
    ]
  }
];

let activeFilter = "all";

/* ---------------------------
   RENDER
---------------------------- */
function render() {
  if (!timelineEl) return;
  timelineEl.innerHTML = "";

  const list =
    activeFilter === "all"
      ? academic
      : academic.filter((x) => x.level === activeFilter);

  list.forEach((item) => {
    const card = document.createElement("article");
    card.className = "tCard card";
    card.dataset.level = item.level;

    // ✅ This structure is what makes the hover image show nicely
    card.innerHTML = `
      <div class="tWrap">
        <div class="tMedia" aria-hidden="true">
          <div class="tImgBox">
            <img src="${item.img}" alt="${item.level} logo" loading="lazy"
              onerror="this.closest('.tMedia').style.display='none';" />
          </div>
          <div class="tYear">${item.year}</div>
        </div>

        <div class="tInfo">
          <div class="tBadge">${item.level}</div>
          <h3 class="tTitle">${item.title}</h3>
          <p class="tMeta">${item.place} • <span class="tMetaYear">${item.year}</span></p>

          <div class="tMore" hidden>
            <ul class="tList">
              ${(item.details || []).map((d) => `<li>${d}</li>`).join("")}
            </ul>
          </div>
        </div>

        <button class="tToggle" type="button" aria-expanded="false" title="Expand">
          +
        </button>
      </div>
    `;

    const toggle = card.querySelector(".tToggle");
    const more = card.querySelector(".tMore");

    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      toggle.textContent = open ? "+" : "–";
      if (more) more.hidden = open;
    });

    // click anywhere to expand too
    card.addEventListener("click", () => toggle.click());

    timelineEl.appendChild(card);
  });

  if (list.length === 0) {
    const empty = document.createElement("div");
    empty.className = "card";
    empty.style.padding = "18px";
    empty.innerHTML = `<b>No items</b><div class="muted">Try another filter.</div>`;
    timelineEl.appendChild(empty);
  }
}
render();

/* ---------------------------
   FILTERS
---------------------------- */
if (filtersEl) {
  filtersEl.addEventListener("click", (e) => {
    const btn = e.target.closest(".chip");
    if (!btn) return;

    document.querySelectorAll(".chip").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    activeFilter = btn.dataset.filter === "all" ? "all" : btn.dataset.filter;
    render();
    toast(`Filter: ${btn.textContent}`);
  });
}
