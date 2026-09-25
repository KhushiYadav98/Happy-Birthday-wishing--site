(function () {
  const landing = document.getElementById("landing");
  const startBtn = document.getElementById("startBtn");
  const confetti = landing.querySelector(".confetti");

  // Confetti colours picked to match the pink/cream theme
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

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    // initial burst so the screen isn't empty, then a steady drizzle
    for (let i = 0; i < 18; i++) setTimeout(spawnConfetti, i * 120);
    setInterval(spawnConfetti, 280);
  }

  // Button → go to the creator form (next page)
  startBtn.addEventListener("click", () => {
    if (navigator.vibrate) navigator.vibrate(20);
    landing.classList.add("is-leaving");
    setTimeout(() => {
      window.location.href = "create.html";
    }, 450);
  });
})();
