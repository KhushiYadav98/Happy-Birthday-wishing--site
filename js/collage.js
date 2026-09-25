import { loadCard } from "./card-data.js";

(function () {
  const loadingState = document.getElementById("loadingState");
  const errorState = document.getElementById("errorState");
  const reveal = document.getElementById("reveal");
  const messageEl = document.getElementById("cardMessage");
  const photoEls = [
    document.getElementById("memPhoto1"),
    document.getElementById("memPhoto2"),
    document.getElementById("memPhoto3"),
  ];

  const params = new URLSearchParams(window.location.search);
  const cardId = params.get("id");

  function showError() {
    loadingState.hidden = true;
    errorState.hidden = false;
  }

  async function init() {
    if (!cardId) {
      showError();
      return;
    }

    try {
      const data = await loadCard(cardId);
      if (!data) {
        showError();
        return;
      }

      messageEl.textContent = data.message || "";

      const memories = data.memories || [];
      photoEls.forEach((el, i) => {
        if (memories[i]) {
          el.src = memories[i];
        } else {
          el.remove();
        }
      });

      loadingState.hidden = true;
      reveal.hidden = false;
    } catch (err) {
      console.error(err);
      showError();
    }
  }

  init();
})();
