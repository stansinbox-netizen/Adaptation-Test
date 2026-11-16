// Amazing Animal Adaptations - loads animals.json and builds the page

const main = document.getElementById("habitats");
const filter = document.getElementById("habitat-filter");
const modal = document.getElementById("modal");
const closeBtn = document.getElementById("close-btn");
let lastFocused = null;

fetch("animals.json")
  .then((res) => {
    if (!res.ok) throw new Error("Could not load animals.json");
    return res.json();
  })
  .then((data) => {
    buildFilter(data.habitats);
    buildHabitats(data.habitats);
    buildCredits(data.credits || []);
  })
  .catch(() => {
    main.innerHTML =
      '<p class="error">Oops! The animals could not load.<br>' +
      "Please open this website through a web server (for example GitHub Pages or VS Code Live Server).</p>";
  });

function buildFilter(habitats) {
  const all = makeButton("🌍 All", "all");
  all.classList.add("active");
  filter.appendChild(all);
  habitats.forEach((h) => filter.appendChild(makeButton(`${h.emoji} ${h.name}`, h.id)));
}

function makeButton(label, id) {
  const btn = document.createElement("button");
  btn.textContent = label;
  btn.addEventListener("click", () => {
    filter.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    document.querySelectorAll(".habitat").forEach((section) => {
      section.hidden = id !== "all" && section.dataset.id !== id;
    });
  });
  return btn;
}

function buildHabitats(habitats) {
  main.innerHTML = "";
  habitats.forEach((habitat) => {
    const section = document.createElement("section");
    section.className = "habitat";
    section.dataset.id = habitat.id;
    section.innerHTML = `
      <h2>${habitat.emoji} ${habitat.name}</h2>
      <p class="habitat-desc">${habitat.description}</p>
      <div class="animal-grid"></div>`;

    const grid = section.querySelector(".animal-grid");
    habitat.animals.forEach((animal) => {
      const card = document.createElement("button");
      card.className = "animal-card";
      card.style.setProperty("--i", grid.children.length);
      card.innerHTML = `<span class="photo"><img src="${animal.image}" alt="${animal.name}" loading="lazy"></span><span class="name"><span class="mini">${animal.emoji}</span> ${animal.name}</span>`;
      card.addEventListener("pointermove", tilt);
      card.addEventListener("pointerleave", () => card.style.removeProperty("transform"));
      card.addEventListener("click", () => openModal(animal, habitat));
      grid.appendChild(card);
    });

    main.appendChild(section);
  });
}

function openModal(animal, habitat) {
  lastFocused = document.activeElement;
  const pic = document.getElementById("modal-emoji");
  pic.innerHTML = `<img src="${animal.image}" alt="${animal.name}"><span class="badge-emoji">${animal.emoji}</span>`;
  sparkleBurst();
  document.getElementById("modal-title").textContent = animal.name;
  document.getElementById("modal-habitat").textContent = `${habitat.emoji} ${habitat.name}`;
  document.getElementById("modal-env").textContent = animal.environment;
  document.getElementById("modal-wonder").textContent = animal.wonder;

  const list = document.getElementById("modal-list");
  list.innerHTML = "";
  animal.adaptations.forEach((a) => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${a.feature}</strong>${a.why}`;
    list.appendChild(li);
  });

  modal.hidden = false;
  closeBtn.focus();
}

function closeModal() {
  modal.hidden = true;
  if (lastFocused) lastFocused.focus();
}

closeBtn.addEventListener("click", closeModal);
modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !modal.hidden) closeModal(); });

// ---------- Magic ✨ ----------
const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function tilt(e) {
  if (calm) return;
  const r = this.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width - 0.5;
  const y = (e.clientY - r.top) / r.height - 0.5;
  this.style.transform = `perspective(700px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateY(-6px)`;
  this.style.setProperty("--mx", `${(x + 0.5) * 100}%`);
  this.style.setProperty("--my", `${(y + 0.5) * 100}%`);
}

function sparkleBurst() {
  if (calm) return;
  const box = document.querySelector(".modal-box");
  for (let i = 0; i < 18; i++) {
    const s = document.createElement("span");
    s.className = "burst";
    s.textContent = ["✨", "⭐", "✦", "💫"][i % 4];
    const a = (Math.PI * 2 * i) / 18;
    s.style.setProperty("--dx", `${Math.cos(a) * (120 + Math.random() * 80)}px`);
    s.style.setProperty("--dy", `${Math.sin(a) * (120 + Math.random() * 80)}px`);
    box.appendChild(s);
    setTimeout(() => s.remove(), 1100);
  }
}

// Floating sparkles in the background
(function sparkles() {
  if (calm) return;
  const layer = document.getElementById("sparkles");
  for (let i = 0; i < 28; i++) {
    const s = document.createElement("span");
    s.textContent = i % 3 ? "✦" : "✧";
    s.style.left = Math.random() * 100 + "%";
    s.style.fontSize = 8 + Math.random() * 16 + "px";
    s.style.animationDuration = 10 + Math.random() * 14 + "s";
    s.style.animationDelay = -Math.random() * 20 + "s";
    layer.appendChild(s);
  }
})();

function buildCredits(credits) {
  const list = document.getElementById("credits-list");
  credits.forEach((c) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = c.source; a.target = "_blank"; a.rel = "noopener";
    a.textContent = c.animal;
    li.append(a, ` — ${c.author} (${c.license})`);
    list.appendChild(li);
  });
}
