// script.js (shared across all pages)

window.addEventListener("DOMContentLoaded", function () {
  initTheme();
});

/* ---------------- THEME TOGGLE + localStorage ---------------- */

function initTheme() {
  const btn = document.getElementById("theme-toggle");
  const saved = localStorage.getItem("theme"); // "light" | "dark" | null

  // Apply saved theme (default: light)
  applyTheme(saved === "dark" ? "dark" : "light");

  // If this page doesn't have a theme button, we're done.
  if (!btn) return;

  // Sync accessibility state for the switch UI
  btn.setAttribute(
    "aria-checked",
    document.documentElement.dataset.theme === "dark" ? "true" : "false"
  );

  btn.addEventListener("click", function () {
    const current = document.documentElement.dataset.theme || "light";
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem("theme", next);

    // Keep switch state in sync (no text changes)
    btn.setAttribute("aria-checked", next === "dark" ? "true" : "false");
  });
}

function applyTheme(theme) {
  // Store theme as an attribute. (CSS can style later.)
  document.documentElement.dataset.theme = theme;
}
