import { loadCard } from "./card-data.js";

(function () {
  const loadingState = document.getElementById("loadingState");
  const errorState = document.getElementById("errorState");
  const reveal = document.getElementById("reveal");
  const photoEl = document.getElementById("cardPhoto");
  const nameEl = document.getElementById("cardName");
  const confetti = document.querySelector(".confetti");

  const params = new URLSearchParams(window.location.search);
  const cardId = params.get("id");

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

  function showError() {
    loadingState.hidden = true;
    errorState.hidden = false;
  }

  function goNext() {
    if (navigator.vibrate) navigator.vibrate(20);
    window.location.href = "collage.html" + window.location.search;
  }

  async function init() {
    if (!cardId) {
      showError();
      return;
    }

    try {
      const data = await loadCard(cardId);
      if (!data || !data.photo) {
        showError();
        return;
      }
      photoEl.src = data.photo;
      nameEl.textContent = data.name || "";
      loadingState.hidden = true;
      reveal.hidden = false;
      celebrate();
    } catch (err) {
      console.error(err);
      showError();
    }
  }

  reveal.addEventListener("click", goNext);
  reveal.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      goNext();
    }
  });

  init();
})();
