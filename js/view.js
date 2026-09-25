import { loadCard as fetchCard } from "./card-data.js";

(function () {
  const loadingState = document.getElementById("loadingState");
  const errorState = document.getElementById("errorState");
  const card = document.getElementById("card");
  const confetti = document.querySelector(".confetti");

  const COLORS = ["#ff4f8b", "#ff8fb3", "#ffc2d4", "#f7b733", "#c9c9d6", "#ffffff", "#e8436f"];
  const SHAPES = ["", "confetti__piece--circle", "confetti__piece--strip"];

  function spawnConfetti() {
    const el = document.createElement("span");
    const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    el.className = "confetti__piece " + shape;
    el.style.left = Math.random() * 100 + "%";
    el.style.background = COLORS[Math.floor(Math.random() * COLORS.length)];
    el.style.animationDuration = 5 + Math.random() * 4 + "s";
    el.style.setProperty("--sway", 10 + Math.random() * 25 + "px");
    el.style.setProperty("--spin", (Math.random() < 0.5 ? -1 : 1) * (360 + Math.random() * 540) + "deg");
    confetti.appendChild(el);
    el.addEventListener("animationend", () => el.remove());
  }

  function celebrate() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    for (let i = 0; i < 24; i++) setTimeout(spawnConfetti, i * 90);
  }

  async function loadCard() {
    const params = new URLSearchParams(window.location.search);
    const cardId = params.get("id");

    if (!cardId) {
      showError();
      return;
    }

    try {
      const data = await fetchCard(cardId);
      if (!data) {
        showError();
        return;
      }
      renderCard(data);
    } catch (err) {
      console.error(err);
      showError();
    }
  }

  function showError() {
    loadingState.hidden = true;
    errorState.hidden = false;
  }

  function renderCard(data) {
    document.getElementById("cardName").textContent = data.name || "";
    document.getElementById("cardMessage").textContent = data.message || "";

    const photo = document.getElementById("cardPhoto");
    if (data.photo) {
      photo.src = data.photo;
    } else {
      photo.remove();
    }

    const memoriesEl = document.getElementById("cardMemories");
    (data.memories || []).forEach((url) => {
      const img = document.createElement("img");
      img.className = "view__memory";
      img.src = url;
      img.alt = "";
      memoriesEl.appendChild(img);
    });

    loadingState.hidden = true;
    card.hidden = false;
    celebrate();
  }

  loadCard();
})();
