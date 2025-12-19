// Shared

window.addEventListener("DOMContentLoaded", async () => {
  await injectNavbar();
  await injectFooter();
  initTheme(); // must run after navbar exists
});

// Navbar / footer

async function injectNavbar() {
  const slot = document.getElementById("nav-slot");
  if (!slot) return;

  try {
    const res = await fetch("partials/nav.html");
    if (!res.ok) throw new Error("Failed to load navbar");
    slot.innerHTML = await res.text();
  } catch (e) {
    console.warn("Navbar load failed:", e);
  }
}

async function injectFooter() {
  const slot = document.getElementById("footer-slot");
  if (!slot) return;

  try {
    const res = await fetch("partials/footer.html");
    if (!res.ok) throw new Error("Failed to load footer");
    slot.innerHTML = await res.text();

    const y = document.getElementById("footer-year");
    if (y) y.textContent = String(new Date().getFullYear());
  } catch (e) {
    console.warn("Footer load failed:", e);
  }
}

// Theme

function initTheme() {
  const btn = document.getElementById("theme-toggle");
  const saved = localStorage.getItem("theme"); // "light" | "dark" | null

  applyTheme(saved === "dark" ? "dark" : "light");

  if (!btn) return;

  // Keep aria-checked in sync for accessibility.
  btn.setAttribute(
    "aria-checked",
    document.documentElement.dataset.theme === "dark" ? "true" : "false"
  );

  btn.addEventListener("click", () => {
    const current = document.documentElement.dataset.theme || "light";
    const next = current === "dark" ? "light" : "dark";

    applyTheme(next);
    localStorage.setItem("theme", next);
    btn.setAttribute("aria-checked", next === "dark" ? "true" : "false");
  });
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
}
