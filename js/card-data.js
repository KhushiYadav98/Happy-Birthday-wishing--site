import { db } from "./firebase.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

// Cached per tab so the multi-page reveal (photo -> view, etc.) only
// reads the card from Firestore once.
export async function loadCard(cardId) {
  const cacheKey = "card:" + cardId;
  try {
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) return JSON.parse(cached);
  } catch (err) {
    // ignore storage errors, fall through to a network fetch
  }

  const snap = await getDoc(doc(db, "cards", cardId));
  if (!snap.exists()) return null;

  const data = snap.data();
  try {
    sessionStorage.setItem(cacheKey, JSON.stringify(data));
  } catch (err) {
    // storage full/unavailable — not fatal, just skip caching
  }
  return data;
}
