// Tools page only

window.addEventListener("DOMContentLoaded", () => {
  if (document.body.dataset.page !== "tools") return;

  initSleepCoffeeTool();
  initEarthFactsTool();
});

// Sleep → Coffee

function initSleepCoffeeTool() {
  const form = document.getElementById("sleep-form");
  const input = document.getElementById("sleep-hours");
  const result = document.getElementById("sleep-result");

  if (!form || !input || !result) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const raw = input.value.trim();
    const hours = Number(raw);

    const output = computeCoffeeRecommendation(hours);

    showResult(result, output.message, output.isError);
    if (!output.isError) input.blur();
  });
}

function computeCoffeeRecommendation(hoursSlept) {
  const h = Number(hoursSlept);

  if (!Number.isFinite(h) || h < 0) {
    return {
      cups: 0,
      isError: true,
      message:
        "Bestie… be serious for a sec.\n" +
        "Hours slept = a real number between 0 and 24 pls.",
    };
  }

  if (h > 24) {
    return {
      cups: 0,
      isError: true,
      message:
        `You slept ${h} hours.\n` +
        "Congrats, you bent spacetime.\n" +
        "Try again without breaking physics.",
    };
  }

  if (h === 24) {
    return {
      cups: 0,
      isError: false,
      message:
        "You slept 24 hours.\n" +
        "Coffee: 0 cups ☕\n" +
        "That wasn’t rest, that was a factory reset.",
    };
  }

  const ideal = 8;
  const debt = Math.max(0, Math.min(ideal - h, 12));
  let cups = Math.ceil(debt / 1.5);
  cups = Math.min(Math.max(cups, 0), 6);

  let vibe;
  if (h >= 9.5) vibe = "Emotionally stable. Mentally powerful. Scary.";
  else if (h >= 8) vibe = "Fully functional human behavior.";
  else if (h >= 7) vibe = "You’re fine. Don’t overthink it.";
  else if (h >= 6) vibe = "Okay but be gentle with yourself today.";
  else if (h >= 5) vibe = "Today runs on vibes, not discipline.";
  else if (h >= 4) vibe = "You’re awake on vibes and audacity.";
  else if (h > 0) vibe = "Survival mode. One task. One thought.";
  else {
    cups = 6;
    vibe = "Zero sleep?? Bestie please drink water.";
  }

  const cupWord = cups === 1 ? "cup" : "cups";
  const cupEmojis = cups > 0 ? "☕".repeat(cups) : "☕";

  return {
    cups,
    isError: false,
    message:
      `You slept ${h} hours.\n` +
      `Coffee: ${cups} ${cupWord} ${cupEmojis}\n` +
      vibe,
  };
}

// Earth facts (Bootprint)

function initEarthFactsTool() {
  const btn = document.getElementById("get-earth-fact");
  const status = document.getElementById("earth-status");
  const img = document.getElementById("earth-image");
  const caption = document.getElementById("earth-fact");

  if (!btn || !status || !img || !caption) return;

  img.removeAttribute("src");
  img.alt = "";
  caption.textContent = "";

  btn.addEventListener("click", async () => {
    setEarthLoadingState(btn, status, true);

    // Animate old content out (if any), then fetch + animate in.
    await animateEarthOutIfNeeded(img, caption);

    try {
      const res = await fetch("https://api.bootprint.space/all/earth", {
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`Bootprint failed (status ${res.status})`);

      const data = await res.json();
      const fact = data?.fact;
      const imageUrl = data?.image;

      if (!fact || !imageUrl) throw new Error("Unexpected response shape");

      caption.textContent = fact;
      img.src = imageUrl;
      img.alt = "Random Earth image from Bootprint";

      status.textContent = "";
      animateEarthIn(img, caption);
    } catch (err) {
      console.error(err);
      status.textContent =
        "Couldn’t fetch an Earth fact right now. Try again in a moment.";
    } finally {
      setEarthLoadingState(btn, status, false);
    }
  });
}

function setEarthLoadingState(btn, statusEl, isLoading) {
  btn.disabled = isLoading;
  btn.textContent = isLoading ? "Fetching..." : "Get Earth fact";

  if (isLoading) {
    statusEl.textContent = "Loading Earth fact…";
    statusEl.dataset.state = "loading";
  } else {
    statusEl.textContent = "";
    statusEl.dataset.state = "";
  }
}

// Animations

function showResult(resultEl, text, isError) {
  resultEl.textContent = text;
  resultEl.dataset.state = isError ? "error" : "ok";

  if (!window.jQuery) return;

  $(resultEl)
    .stop(true, true)
    .css({ opacity: 0, marginLeft: "16px" })
    .animate({ opacity: 1, marginLeft: "0px" }, 180);
}

function animateEarthIn(imgEl, captionEl) {
  if (!window.jQuery) return;

  $(imgEl)
    .stop(true, true)
    .css({ opacity: 0, marginLeft: "24px" })
    .animate({ opacity: 1, marginLeft: "0px" }, 220);

  $(captionEl)
    .stop(true, true)
    .css({ opacity: 0, marginLeft: "24px" })
    .delay(60)
    .animate({ opacity: 1, marginLeft: "0px" }, 220);
}

function animateEarthOutIfNeeded(imgEl, captionEl) {
  return new Promise((resolve) => {
    if (!window.jQuery) return resolve();

    const hasImage = !!imgEl.getAttribute("src");
    const hasText = !!captionEl.textContent.trim();
    if (!hasImage && !hasText) return resolve();

    let done = 0;
    const finish = () => {
      done += 1;
      if (done === 2) resolve();
    };

    $(imgEl)
      .stop(true, true)
      .animate({ opacity: 0, marginLeft: "-24px" }, 140, finish);

    $(captionEl)
      .stop(true, true)
      .animate({ opacity: 0, marginLeft: "-24px" }, 140, finish);
  });
}
