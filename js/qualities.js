const root = document.documentElement;
const themeBtn = document.getElementById("themeBtn");
const toastEl = document.getElementById("toast");

function toast(msg){
  toastEl.textContent = msg;
  toastEl.classList.add("show");
  clearTimeout(window.__t);
  window.__t = setTimeout(()=>toastEl.classList.remove("show"), 1600);
}

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

// Badge picker
const badges = document.getElementById("badges");
const note = document.getElementById("note");

badges.addEventListener("click", (e)=>{
  const b = e.target.closest(".badge");
  if(!b) return;
  document.querySelectorAll(".badge").forEach(x=>x.classList.remove("active"));
  b.classList.add("active");
  note.textContent = b.dataset.text;
  toast(`Selected: ${b.textContent.trim()}`);
});

// Animate skill bars when visible
const skills = document.querySelectorAll(".skill");
const obs = new IntersectionObserver((entries)=>{
  entries.forEach(en=>{
    if(!en.isIntersecting) return;
    const box = en.target;
    const val = box.dataset.val || "0";
    box.querySelector(".bar i").style.width = `${val}%`;
    obs.unobserve(box);
  });
},{threshold:.35});

skills.forEach(s=>obs.observe(s));
