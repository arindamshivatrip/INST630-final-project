// home.js (home page only)

window.addEventListener("DOMContentLoaded", function () {
  initGreeting();
  initClock();
  animateUnderline();
});

/* ---------------- GREETING ---------------- */

function initGreeting() {
  const greetingEl = document.getElementById("greeting-message");
  if (!greetingEl) return;

  const now = new Date();
  const hour = now.getHours();

  let timeOfDay;
  if (hour < 5) timeOfDay = "up way too late 🥲";
  else if (hour < 12) timeOfDay = "morning";
  else if (hour < 17) timeOfDay = "afternoon";
  else if (hour < 22) timeOfDay = "evening";
  else timeOfDay = "night owl hours";

  greetingEl.textContent = `Good ${timeOfDay}! You’ve landed on my little corner of the internet.`;
}

/* ---------------- CLOCK ---------------- */

function initClock() {
  const clockEl = document.getElementById("clock");
  if (!clockEl) return;

  function tick() {
    const now = new Date();
    clockEl.textContent = now.toLocaleTimeString([], { hour12: true });
  }

  tick();
  setInterval(tick, 1000);
}

/* ---------------- SVG UNDERLINE ANIMATION ---------------- */

function animateUnderline() {
  const path = document.getElementById("underline-path");
  if (!path) return;

  // Slow down to 75% speed (i.e., duration increases by 1/0.75)
  const durationMs = 1200;

  // Start after the title finishes (title is ~867ms)
  const delayMs = 920;

  setTimeout(() => {
    const start = performance.now();

    function frame(t) {
      const elapsed = t - start;
      const progress = Math.min(elapsed / durationMs, 1);

      // Ease-out curve
      const eased = 1 - Math.pow(1 - progress, 3);

      const offset = 1 - eased;
      path.style.strokeDashoffset = String(offset);

      if (progress < 1) requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }, delayMs);
}
