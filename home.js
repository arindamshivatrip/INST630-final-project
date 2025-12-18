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

  // Controlled-chaos: pick one from each bucket so it feels intentional.
  const lines = {
    opener: [
      "Hi.",
      "Welcome.",
      "Oh hey.",
      "You made it.",
      "Hello there."
    ],
    role: [
      "I design and build human-centered systems.",
      "I work at the intersection of data, design, and technology.",
      "I turn messy problems into usable interfaces.",
      "I build things that try to respect users’ time.",
      "I make prototypes and then politely argue with them until they behave."
    ],
    aside: [
      "Sometimes with AI. Always with opinions.",
      "Usually after too many sticky notes.",
      "With fewer dark patterns than average.",
      "So users don’t have to think too hard.",
      "If something feels effortless, I probably suffered for it."
    ],
    extra: [
      "Scroll if you’re curious.",
      "This is the portfolio version of me.",
      "No buzzwords, I promise (mostly).",
      "Yes, this was intentionally designed.",
      "If you’re here to judge the vibes, fair."
    ]
  };

  // Time-aware line that comes right after the intro lines
  const timeAware = getTimeAwareLine(hour);

  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  // Render as multi-line for rhythm. (No random soup.)
  greetingEl.innerHTML = `
    <p>${pick(lines.opener)}</p>
    <p>${pick(lines.role)}</p>
    <p class="muted">${pick(lines.aside)}</p>
    <p class="muted">${timeAware}</p>
    <p class="muted small">${pick(lines.extra)}</p>
  `;
}

function getTimeAwareLine(hour) {
  if (hour < 5) {
    return "It’s currently late-night goblin hours. Respectfully, go drink water.";
  }
  if (hour < 12) {
    return "Morning mode: optimism is high, inbox is ignored (for now).";
  }
  if (hour < 17) {
    return "Afternoon mode: productivity is a spectrum and I’m somewhere on it.";
  }
  if (hour < 22) {
    return "Evening mode: I’m either wrapping up… or starting something I’ll regret.";
  }
  return "Night mode: I will call it “one more tweak” and that will be a lie.";
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

  const durationMs = 1200;
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
