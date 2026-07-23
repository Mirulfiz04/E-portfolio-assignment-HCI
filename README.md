# Amirul Hafiz — Personal Portfolio

A premium, single-page personal portfolio built with **plain HTML, CSS & JavaScript** —
no build step, no frameworks. Dark theme by default with a light/dark toggle,
glassmorphism cards, smooth scroll animations, project filtering, an expandable
project modal, animated counters, a typing hero, and a validated contact form.

**Live:** https://mirulfiz04.github.io/E-portfolio-assignment-HCI/

---

## 📁 Folder structure

```
E-portfolio-assignment-main/
├── index.html            ← the whole page lives here (semantic sections)
├── css/
│   └── style.css         ← design system + all styling (edit colours here)
├── js/
│   └── script.js         ← all interactions (theme, filter, modal, form…)
├── assets/
│   ├── avatar.png        ← YOUR PROFILE PHOTO  (replace this)
│   ├── cv/
│   │   └── Amirul-Hafiz-CV.pdf   ← ADD YOUR CV HERE (see below)
│   └── projects/         ← OPTIONAL project screenshots (see below)
│       ├── meds.png
│       ├── finsafe.png
│       ├── savings.png
│       └── portfolio.png
└── README.md
```

> The older multi-page files (`about.html`, `works.html`, etc.) are left in the repo
> for reference. The new experience is the single `index.html`. You can delete the
> old pages once you're happy with the redesign.

---

## ✏️ How to personalise (5 quick edits)

Everything you need to change is marked with the word **`EDIT`** in `index.html`.

### 1. Replace the profile image
- Drop your photo in `assets/` and name it **`avatar.png`** (a square-ish portrait,
  ideally **800×840px** or larger, JPG/PNG).
- Prefer a different name/path? Update the `src` on the hero `<img>` in `index.html`
  (search for `assets/avatar.png`) and the two `og:image` / `twitter:image` meta tags.
- If the image is missing, the site shows a clean **“AH”** monogram automatically.

### 2. Add your CV / résumé (Download CV button)
- Export your CV as a PDF and save it as
  **`assets/cv/Amirul-Hafiz-CV.pdf`**.
- The **Download CV** button in the navbar already points there.
- Using a different filename? Update the `href` on the `.cv-btn` link in `index.html`.

### 3. GitHub & LinkedIn links
Update these in **two** places (hero social row + Contact section). Search `index.html` for:
- `https://github.com/Mirulfiz04`
- `https://www.linkedin.com/in/mirulfiz040428/`
- `mailto:amirul.hafiz73@gmail.com`

### 4. Project links & screenshots
Each project card (`<article class="project">`) has:
- a **GitHub** / **Live Demo** `<a>` — replace the placeholder `https://github.com/Mirulfiz04`
  with the real repo URL (marked with `EDIT`).
- an optional cover image `assets/projects/<name>.png`. Add a screenshot with the
  matching name and it appears automatically; if it's missing, an elegant gradient
  cover with an icon is shown instead (nothing breaks).

### 5. Contact details
In the **Contact** section update email, LinkedIn, GitHub and location as needed.

---

## 📨 Making the contact form send real emails

By default the form **validates input** and then opens the visitor's email client
with a pre-filled message (`mailto:`) — perfect for a static site with zero setup.

To receive submissions directly, connect a free form backend (no server needed):
1. Create a form at **[Formspree](https://formspree.io)** (or Getform / Web3Forms).
2. In `index.html`, add `action="https://formspree.io/f/XXXX"` and `method="POST"`
   to `<form id="contactForm">`.
3. In `js/script.js`, inside the submit handler, replace the `mailto` block with a
   `fetch(form.action, { method: "POST", body: new FormData(form) })` call.

---

## 🎨 Changing the colours

Open `css/style.css` → the `:root` block at the top. Edit these tokens:

```css
--blue: #3b82f6;  --cyan: #22d3ee;  --purple: #8b5cf6;  --pink: #ec4899;
```

Light-theme values live in the `:root[data-theme="light"]` block just below.

---

## ▶️ Running locally

It's a static site — just open `index.html` in a browser. For best results
(fonts, relative paths) run a tiny local server:

```bash
# Python 3
python -m http.server 5500
# then visit http://localhost:5500
```

---

## ✅ Built-in features

- Sticky navbar with active-link **scroll spy** + mobile menu
- **Dark / light** theme (saved to `localStorage`, no flash on load)
- Hero **typing animation**, animated **counters**, scroll **reveal**
- Project **filtering** (All / Mobile / Web / AI / UI/UX) + **modal** case studies
- Subtle **tilt** on cards, animated background **particles** + gradient orbs
- Validated **contact form** with toast notifications
- **Scroll-to-top** button
- **SEO**, **Open Graph**, **Twitter** and **JSON-LD** metadata
- Semantic HTML, alt text, keyboard accessible, **reduced-motion** support
- Fully **responsive** (desktop / tablet / mobile)
