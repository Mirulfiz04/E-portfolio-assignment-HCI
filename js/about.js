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

// Story slider
const slides = Array.from(document.querySelectorAll(".slide"));
const dotsWrap = document.getElementById("dots");
let idx = 0;

function buildDots(){
  dotsWrap.innerHTML = "";
  slides.forEach((_, i)=>{
    const d = document.createElement("div");
    d.className = "dot" + (i===idx ? " active":"");
    d.addEventListener("click", ()=>{
      idx=i; render();
      toast(`Story: ${i+1}/${slides.length}`);
    });
    dotsWrap.appendChild(d);
  });
}
function render(){
  slides.forEach((s,i)=>s.classList.toggle("active", i===idx));
  buildDots();
}
render();

document.getElementById("prev").addEventListener("click", ()=>{
  idx = (idx - 1 + slides.length) % slides.length;
  render();
});
document.getElementById("next").addEventListener("click", ()=>{
  idx = (idx + 1) % slides.length;
  render();
});

// Copy email (use your real email)
document.getElementById("copyBtn").addEventListener("click", async ()=>{
  const email = "amirul.hafiz73@gmail.com";
  try{
    await navigator.clipboard.writeText(email);
    toast("Email copied!");
  }catch{
    toast("Clipboard blocked (use HTTPS / Live Server).");
  }
});

// Animate skill bars (small wow)
window.addEventListener("load", ()=>{
  document.querySelectorAll(".bar span").forEach((el)=>{
    const w = el.style.width;
    el.style.width = "0";
    setTimeout(()=>{ el.style.width = w; }, 150);
  });
});
