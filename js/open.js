(function () {
  const open = document.getElementById("open");
  const envelopeBtn = document.getElementById("envelopeBtn");
  const musicBtn = document.getElementById("musicBtn");

  const params = new URLSearchParams(window.location.search);
  if (!params.get("id")) {
    window.location.href = "index.html";
    return;
  }

  // ---------- Birthday music ----------
  // This page stays alive for the whole receiver flow (the next pages load
  // inside a frame below), so the song keeps looping across page changes.
  const music = new Audio("Audio/the_mountain-happy-birthday-508020.mp3");
  music.loop = true;
  music.preload = "auto";
  music.volume = 0.7;

  let musicOn = false;

  function playMusic() {
    music.play().catch(() => {
      // blocked by the browser – show it as off so one tap on the button starts it
      musicOn = false;
      musicBtn.classList.add("is-muted");
      musicBtn.setAttribute("aria-pressed", "false");
      musicBtn.setAttribute("aria-label", "Play music");
    });
  }

  function setMusic(on) {
    musicOn = on;
    musicBtn.classList.toggle("is-muted", !on);
    musicBtn.setAttribute("aria-pressed", String(on));
    musicBtn.setAttribute("aria-label", on ? "Mute music" : "Play music");
    if (on) playMusic();
    else music.pause();
  }

  musicBtn.addEventListener("click", () => setMusic(!musicOn));

  // pause when the phone is locked / tab is switched, resume when back
  document.addEventListener("visibilitychange", () => {
    if (!musicOn) return;
    if (document.hidden) music.pause();
    else playMusic();
  });

  // ---------- Next pages load inside a frame ----------
  function showSurprise() {
    const frame = document.createElement("iframe");
    frame.className = "open__frame";
    frame.title = "Your birthday surprise";
    frame.src = "photo.html" + window.location.search;
    frame.addEventListener(
      "load",
      () => {
        frame.classList.add("is-visible");
        open.hidden = true;
      },
      { once: true }
    );
    document.body.appendChild(frame);
  }

  envelopeBtn.addEventListener("click", () => {
    if (navigator.vibrate) navigator.vibrate(20);
    // start inside the tap itself – browsers only allow sound after a tap
    setMusic(true);
    musicBtn.hidden = false;

    open.classList.add("is-leaving");
    setTimeout(showSurprise, 450);
  });
})();
