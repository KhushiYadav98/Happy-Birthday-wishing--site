import { db } from "./firebase.js";
import {
  doc,
  collection,
  setDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

(function () {
  const form = document.getElementById("createForm");
  const nameInput = document.getElementById("nameInput");
  const messageInput = document.getElementById("messageInput");
  const toast = document.getElementById("toast");

  // Photos are stored as base64 text directly in the Firestore doc, which
  // caps a whole card at 1MB — so they're shrunk hard to leave lots of margin.
  const MAX_PHOTO_SIZE = 600; // px, longest side, main photo
  const MAX_MEMORY_SIZE = 400; // px, longest side, memory thumbnails
  const PHOTO_QUALITY = 0.7;
  const MAX_CARD_BYTES = 900000; // stay well under Firestore's 1MB/doc limit

  const photos = { main: null, m1: null, m2: null, m3: null };

  // ---------- Toast ----------
  let toastTimer;
  function showToast(text) {
    toast.textContent = text;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2400);
  }

  // ---------- Photo uploads ----------
  function resizeImage(file, maxSize) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        // JPEG has no alpha channel — fill white first so transparent
        // source images (e.g. PNG stickers) don't turn black on export.
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
        resolve(canvas.toDataURL("image/jpeg", PHOTO_QUALITY));
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Could not read image"));
      };
      img.src = url;
    });
  }

  document.querySelectorAll(".field__upload input[type=file]").forEach((input) => {
    input.addEventListener("change", async () => {
      const file = input.files && input.files[0];
      if (!file) return;

      const box = input.closest(".field__upload");
      const preview = box.querySelector(".field__preview");
      box.classList.add("is-loading");

      try {
        const slot = input.dataset.slot;
        const maxSize = slot === "main" ? MAX_PHOTO_SIZE : MAX_MEMORY_SIZE;
        const dataUrl = await resizeImage(file, maxSize);
        photos[slot] = dataUrl;
        preview.src = dataUrl;
        box.classList.add("has-image");
        box.closest(".field").classList.remove("is-invalid");
      } catch (err) {
        showToast("Oops, that photo couldn't be opened 😕");
      } finally {
        box.classList.remove("is-loading");
        input.value = ""; // allow picking the same file again
      }
    });
  });

  // ---------- Validation ----------
  [nameInput, messageInput].forEach((el) =>
    el.addEventListener("input", () => el.closest(".field").classList.remove("is-invalid"))
  );

  function markInvalid(el) {
    const field = el.closest(".field");
    field.classList.remove("is-invalid");
    void field.offsetWidth; // restart shake animation
    field.classList.add("is-invalid");
  }

  // ---------- Submit ----------
  const submitBtn = form.querySelector(".create__submit");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const message = messageInput.value.trim();

    if (!name) {
      markInvalid(nameInput);
      nameInput.focus();
      showToast("Tell us who's celebrating 🎂");
      return;
    }
    if (!message) {
      markInvalid(messageInput);
      messageInput.focus();
      showToast("Add a little message 💌");
      return;
    }
    if (!photos.main) {
      markInvalid(document.querySelector(".field__upload--main"));
      showToast("Add their photo 📸");
      return;
    }

    const card = {
      name,
      message,
      photo: photos.main,
      memories: [photos.m1, photos.m2, photos.m3].filter(Boolean),
    };

    if (JSON.stringify(card).length > MAX_CARD_BYTES) {
      showToast("Those photos are too big together – try fewer or smaller ones 😕");
      return;
    }

    submitBtn.disabled = true;
    showToast("Wrapping up their surprise… ✨");

    try {
      const cardRef = doc(collection(db, "cards"));
      await setDoc(cardRef, { ...card, createdAt: serverTimestamp() });

      if (navigator.vibrate) navigator.vibrate(20);
      window.location.href = `share.html?id=${cardRef.id}`;
    } catch (err) {
      console.error(err);
      showToast("Couldn't save that – check your connection and try again 😕");
      submitBtn.disabled = false;
    }
  });
})();
