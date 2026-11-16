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
      card.innerHTML = `<span class="emoji">${animal.emoji}</span><span class="name">${animal.name}</span>`;
      card.addEventListener("click", () => openModal(animal, habitat));
      grid.appendChild(card);
    });

    main.appendChild(section);
  });
}

function openModal(animal, habitat) {
  lastFocused = document.activeElement;
  document.getElementById("modal-emoji").textContent = animal.emoji;
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
