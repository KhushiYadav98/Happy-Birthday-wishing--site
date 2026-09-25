(function () {
  const linkInput = document.getElementById("linkInput");
  const copyBtn = document.getElementById("copyBtn");
  const toast = document.getElementById("toast");

  const params = new URLSearchParams(window.location.search);
  const cardId = params.get("id");

  if (!cardId) {
    window.location.href = "create.html";
    return;
  }

  const shareUrl = `${window.location.origin}${window.location.pathname.replace(
    "share.html",
    "open.html"
  )}?id=${cardId}`;
  linkInput.value = shareUrl;

  let toastTimer;
  function showToast(text) {
    toast.textContent = text;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2400);
  }

  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch (err) {
      linkInput.select();
      document.execCommand("copy");
    }
    if (navigator.vibrate) navigator.vibrate(20);
    showToast("Link copied! 💌");
  });
})();
