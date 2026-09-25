(function () {
  const open = document.getElementById("open");
  const envelopeBtn = document.getElementById("envelopeBtn");

  const params = new URLSearchParams(window.location.search);
  if (!params.get("id")) {
    window.location.href = "index.html";
    return;
  }

  envelopeBtn.addEventListener("click", () => {
    if (navigator.vibrate) navigator.vibrate(20);
    open.classList.add("is-leaving");
    setTimeout(() => {
      window.location.href = "photo.html" + window.location.search;
    }, 450);
  });
})();
