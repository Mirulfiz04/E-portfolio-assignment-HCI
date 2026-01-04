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

themeBtn?.addEventListener("click", ()=>{
  const current = root.getAttribute("data-theme") || "dark";
  const next = current === "dark" ? "light" : "dark";
  root.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
  themeBtn.textContent = next === "light" ? "☀️" : "🌙";
  toast(`Theme: ${next}`);
});

document.getElementById("year").textContent = new Date().getFullYear();
document.getElementById("toTop").addEventListener("click", ()=>window.scrollTo({top:0, behavior:"smooth"}));

const counters = document.querySelectorAll("[data-counter]");
const animateCounter = (el)=>{
  const target = Number(el.dataset.counter || "0");
  let val = 0;
  const step = Math.max(1, Math.floor(target / 40));
  const t = setInterval(()=>{
    val += step;
    if(val >= target){ val = target; clearInterval(t); }
    el.textContent = String(val);
  }, 18);
};

const counterObs = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      animateCounter(e.target);
      counterObs.unobserve(e.target);
    }
  });
},{threshold:.5});
counters.forEach(c=>counterObs.observe(c));

const chipText = document.getElementById("chipText");
const chipBox = document.getElementById("chipBox");
const chipMap = {
  "UI/UX":"Designing smooth interfaces with clear structure and feedback.",
  "Web":"Building responsive web apps with clean layouts and interactions.",
  "Mobile":"Creating mobile-friendly experiences and app workflows.",
  "AI":"Exploring practical AI features like classification and automation."
};

chipBox?.addEventListener("click", (e)=>{
  const btn = e.target.closest(".chip");
  if(!btn) return;
  document.querySelectorAll(".chip").forEach(b=>b.classList.remove("active"));
  btn.classList.add("active");
  chipText.textContent = chipMap[btn.dataset.chip] || "Focused on building good experiences.";
  toast(`Focus: ${btn.dataset.chip}`);
});

const rev = document.querySelectorAll(".reveal");
const revObs = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting) e.target.classList.add("show");
  });
},{threshold:.15});
rev.forEach(r=>revObs.observe(r));

const avatar = document.querySelector(".avatar");

if (avatar) {
  // Get sources
  const original = avatar.getAttribute("src");
  const alt1 = avatar.dataset.alt1;
  const alt2 = avatar.dataset.alt2;

  // Build click cycle list
  const cycle = [original, alt1, alt2].filter(Boolean);
  let i = 0;

  // Smooth swap helper
  const swapTo = (src) => {
    if (!src) return;
    avatar.style.opacity = 0;
    setTimeout(() => {
      avatar.setAttribute("src", src);
      avatar.style.opacity = 1;
    }, 150);
  };

 const isTouch = window.matchMedia("(hover: none)").matches;

if (!isTouch) {
  avatar.addEventListener("mouseenter", () => {
    if (alt1) {
      i = cycle.indexOf(alt1);   // ✅ sync click index
      swapTo(alt1);
    }
  });

  avatar.addEventListener("mouseleave", () => {
    i = cycle.indexOf(original); // ✅ sync back
    swapTo(original);
  });
}


  // Click: cycle through available images
  avatar.addEventListener("click", () => {
    i = (i + 1) % cycle.length;
    swapTo(cycle[i]);
  });
}
