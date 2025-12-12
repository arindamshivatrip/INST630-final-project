// tools.js (tools page only)

window.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;
  if (page !== "tools") return;

  initSleepCoffeeTool();
  initEarthFactsTool();
});

/* ---------------- 1) Sleep -> Coffee Calculator ---------------- */

function initSleepCoffeeTool() {
  const form = document.getElementById("sleep-form");
  const input = document.getElementById("sleep-hours");
  const result = document.getElementById("sleep-result");

  if (!form || !input || !result) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const hours = Number(input.value);

    if (!Number.isFinite(hours) || hours < 0 || hours > 24) {
      showResult(
        result,
        "Give me a real number between 0 and 24 hours. (Unless you discovered time travel.)",
        true
      );
      return;
    }

    const output = computeCoffeeRecommendation(hours);
    showResult(result, output.message, false);
    input.blur();
  });
}

function computeCoffeeRecommendation(hoursSlept) {
  const ideal = 8;
  const debt = Math.max(0, Math.min(ideal - hoursSlept, 8)); // cap at 8
  let cups = Math.ceil(debt / 2);

  let tone;
  if (hoursSlept >= 8) {
    cups = 0;
    tone = "You’re functioning like a responsible adult. Respect.";
  } else if (hoursSlept >= 6) {
    tone = "Not terrible. A little caffeine and vibes and you’re fine.";
  } else if (hoursSlept >= 4) {
    tone = "We’re in the danger zone. Proceed carefully and avoid deep conversations.";
  } else if (hoursSlept > 0) {
    tone = "Okay bestie… today is about survival, not excellence.";
  } else {
    cups = 4;
    tone = "Zero hours? That’s not ‘productive,’ that’s a cry for help. Drink water too.";
  }

  cups = Math.min(cups, 4);
  const cupWord = cups === 1 ? "cup" : "cups";

  return {
    cups,
    message:
      `You slept ${hoursSlept} hours.\n` +
      `Recommended coffee: ${cups} ${cupWord} ☕\n` +
      tone
  };
}

/* ---------------- 2) Earth Fun Facts (Bootprint API) ---------------- */
/*
  Random Image & Fact:
  GET https://api.bootprint.space/all/earth

  Response includes at least:
  - fact (string)
  - image (url)
*/

function initEarthFactsTool() {
  const btn = document.getElementById("get-earth-fact");
  const status = document.getElementById("earth-status");
  const img = document.getElementById("earth-image");
  const caption = document.getElementById("earth-fact");

  if (!btn || !status || !img || !caption) return;

  // Clear initial content
  img.removeAttribute("src");
  img.alt = "";
  caption.textContent = "";

  btn.addEventListener("click", async () => {
    setEarthLoadingState(btn, status, true);

    // Animate old content out (if any), then fetch + animate in
    await animateEarthOutIfNeeded(img, caption);

    try {
      const res = await fetch("https://api.bootprint.space/all/earth", { cache: "no-store" });
      if (!res.ok) throw new Error(`Bootprint failed (status ${res.status})`);

      const data = await res.json();

      const fact = data?.fact;
      const imageUrl = data?.image;

      if (!fact || !imageUrl) throw new Error("Unexpected Bootprint response shape");

      caption.textContent = fact;
      img.src = imageUrl;
      img.alt = "Random Earth image from Bootprint";

      status.textContent = "";
      animateEarthIn(img, caption);
    } catch (err) {
      console.error(err);
      status.textContent = "Couldn’t fetch an Earth fact right now. Try again in a moment.";
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


/* ---------------- 3) Animations (“slotting in”) ---------------- */

function showResult(resultEl, text, isError) {
  resultEl.textContent = text;
  resultEl.dataset.state = isError ? "error" : "ok";

  if (window.jQuery) {
    $(resultEl)
      .stop(true, true)
      .css({ opacity: 0, marginLeft: "16px" })
      .animate({ opacity: 1, marginLeft: "0px" }, 180);
  }
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
