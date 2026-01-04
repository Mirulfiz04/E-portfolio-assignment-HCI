// js/contact.js
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

// Copy email
const myEmail = "amirul.hafiz73@gmail.com";
const copyEmailBtn = document.getElementById("copyEmail");
if(copyEmailBtn){
  copyEmailBtn.addEventListener("click", async ()=>{
    try{
      await navigator.clipboard.writeText(myEmail);
      toast("Email copied!");
    }catch(e){
      toast("Copy failed. Please copy manually.");
    }
  });
}

// Open mail link
const openMail = document.getElementById("openMail");
if(openMail){
  openMail.addEventListener("click", (e)=>{
    e.preventDefault();
    window.location.href = `mailto:${myEmail}?subject=Portfolio%20Contact&body=Hi%20Amirul,%0A%0A`;
  });
}

// Form validation
const form = document.getElementById("form");
const clearBtn = document.getElementById("clear");

const nameEl = document.getElementById("name");
const emailEl = document.getElementById("email");
const msgEl = document.getElementById("msg");

const eName = document.getElementById("eName");
const eEmail = document.getElementById("eEmail");
const eMsg = document.getElementById("eMsg");

function setErr(el, msg){
  el.textContent = msg || "";
}

function validEmail(v){
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

function validate(){
  let ok = true;

  const n = (nameEl.value || "").trim();
  const em = (emailEl.value || "").trim();
  const m = (msgEl.value || "").trim();

  if(n.length < 2){ setErr(eName, "Please enter at least 2 characters."); ok = false; }
  else setErr(eName, "");

  if(!validEmail(em)){ setErr(eEmail, "Please enter a valid email."); ok = false; }
  else setErr(eEmail, "");

  if(m.length < 8){ setErr(eMsg, "Message must be at least 8 characters."); ok = false; }
  else setErr(eMsg, "");

  return ok;
}

if(form){
  form.addEventListener("submit", (e)=>{
    e.preventDefault();
    if(validate()){
      toast("Message validated (prototype).");
      // Prototype only: you can connect to Google Form / Email service later
      form.reset();
      setErr(eName,""); setErr(eEmail,""); setErr(eMsg,"");
    }else{
      toast("Please fix the errors.");
    }
  });
}

if(clearBtn){
  clearBtn.addEventListener("click", ()=>{
    form.reset();
    setErr(eName,""); setErr(eEmail,""); setErr(eMsg,"");
    toast("Cleared.");
  });
}

// Live validation
[nameEl, emailEl, msgEl].forEach(el=>{
  if(!el) return;
  el.addEventListener("input", ()=>validate());
});
