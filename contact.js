// contact.js (contact page only)

window.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;
  if (page !== "contact") return;

  initContactPage();
});

function initContactPage() {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("contact-status");
  const openBtn = document.getElementById("open-email");

  if (!form || !status || !openBtn) return;

  ensureEmailHintExists();
  ensureMessageCounterExists();

  restoreFormFromStorage();
  // updateEmailHint();
  updateMessageCounter();
  updateButtonsState(openBtn);

  wireLiveValidation(form, status, openBtn);

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = readFormData();
    const errors = validateContactData(data);

    if (errors.length > 0) {
      showStatus(status, errors.join("\n"), true);
      animateIn(status);
      updateButtonsState(openBtn);
      return;
    }

    const draft = buildEmailDraft(data);
    showStatus(status, draft.preview, false);
    animateIn(status);

    saveDraftToStorage(data, draft);
    updateButtonsState(openBtn);
  });

  openBtn.addEventListener("click", () => {
    const data = readFormData();
    const errors = validateContactData(data);

    if (errors.length > 0) {
      showStatus(
        status,
        "Fill in the form first so I can generate a proper email.\n" + errors.join("\n"),
        true
      );
      animateIn(status);
      updateButtonsState(openBtn);
      return;
    }

    const draft = buildEmailDraft(data);
    saveDraftToStorage(data, draft);

    const mailtoUrl = buildMailtoUrl({
      to: "arindamtrip@gmail.com",
      subject: draft.subject,
      body: draft.body
    });

    window.location.href = mailtoUrl;
  });

  // Initial counter update
  updateMessageCounter();
}

/* ---------------- Live validation UI ---------------- */

function wireLiveValidation(form, status, openBtn) {
  const nameEl = document.getElementById("contact-name");
  const emailEl = document.getElementById("contact-email");
  const topicEl = document.getElementById("contact-topic");
  const msgEl = document.getElementById("contact-message");

  const inputs = [nameEl, emailEl, topicEl, msgEl].filter(Boolean);

  inputs.forEach((el) => {
    el.addEventListener("input", () => {
      // Save continuously
      const data = readFormData();
      localStorage.setItem("contactFormDraft", JSON.stringify(data));

      // Live hints
      updateEmailHint();
      updateMessageCounter();
      updateButtonsState(openBtn);
    });
  });

emailEl?.addEventListener("blur", () => {
  updateEmailHint();          // show “Looks good ✅” or the error hint
  updateButtonsState(openBtn);
});

}

function ensureEmailHintExists() {
  const emailEl = document.getElementById("contact-email");
  if (!emailEl) return;

  if (document.getElementById("email-hint")) return;

  const hint = document.createElement("div");
  hint.id = "email-hint";
  hint.setAttribute("aria-live", "polite");
  hint.style.whiteSpace = "pre-wrap";
  hint.style.fontSize = "0.95em";
  hint.style.marginTop = "6px";

  emailEl.insertAdjacentElement("afterend", hint);
}

// function updateEmailHint() {
//   const emailEl = document.getElementById("contact-email");
//   const hint = document.getElementById("email-hint");
//   if (!emailEl || !hint) return;

//   const email = (emailEl.value || "").trim();

//   if (!email) {
//     hint.textContent = "";
//     hint.dataset.state = "";
//     return;
//   }

//   if (isValidEmail(email)) {
//     hint.textContent = "Looks good ✅";
//     hint.dataset.state = "ok";
//     animateIn(hint);
//   } else {
//     hint.textContent = "That email looks off — double-check the format (name@example.com).";
//     hint.dataset.state = "error";
//     animateIn(hint);
//   }
// }

/* ---------------- Character counter ---------------- */

function ensureMessageCounterExists() {
  // If you added <div id="message-counter"> in HTML, this will find it.
  // If not, we create it right after the textarea automatically.
  const msgEl = document.getElementById("contact-message");
  if (!msgEl) return;

  if (document.getElementById("message-counter")) return;

  const counter = document.createElement("div");
  counter.id = "message-counter";
  counter.setAttribute("aria-live", "polite");
  counter.style.whiteSpace = "pre-wrap";
  counter.style.fontSize = "0.95em";
  counter.style.marginTop = "6px";

  msgEl.insertAdjacentElement("afterend", counter);
}

function updateMessageCounter() {
  const msgEl = document.getElementById("contact-message");
  const counter = document.getElementById("message-counter");
  if (!msgEl || !counter) return;

  const max = Number(msgEl.getAttribute("maxlength")) || 1000;
  const len = (msgEl.value || "").length;
  const remaining = max - len;

  counter.textContent = `${len}/${max} characters (${remaining} remaining)`;
  counter.dataset.state = remaining < 0 ? "error" : "ok";
}

/* ---------------- Button state ---------------- */

function updateButtonsState(openBtn) {
  const data = readFormData();
  const errors = validateContactData(data);
  openBtn.disabled = errors.length > 0;
}

/* ---------------- Form helpers ---------------- */

function readFormData() {
  return {
    name: (document.getElementById("contact-name")?.value || "").trim(),
    email: (document.getElementById("contact-email")?.value || "").trim(),
    topic: (document.getElementById("contact-topic")?.value || "").trim(),
    message: (document.getElementById("contact-message")?.value || "").trim()
  };
}

function validateContactData(data) {
  const errors = [];

  if (!data.name || data.name.length < 2) errors.push("• Name must be at least 2 characters.");
  if (!data.email || !isValidEmail(data.email)) errors.push("• Enter a valid email address.");
  if (!data.topic) errors.push("• Pick a topic.");
  if (!data.message || data.message.length < 10) errors.push("• Message must be at least 10 characters.");

  return errors;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ---------------- Draft generation ---------------- */

function buildEmailDraft(data) {
  const topicLabel = topicToLabel(data.topic);

  const subject = `[Portfolio] ${topicLabel} — from ${data.name}`;

  const body =
`Hi Ari,

${data.message}

—
${data.name}
${data.email}
`;

  const preview =
`Email draft generated ✅

Subject:
${subject}

Body:
${body}`;

  return { subject, body, preview };
}

function topicToLabel(topicValue) {
  switch (topicValue) {
    case "project": return "Project / Collaboration";
    case "job": return "Job / Internship";
    case "feedback": return "Portfolio feedback";
    default: return "Message";
  }
}

/* ---------------- Mailto ---------------- */

function buildMailtoUrl({ to, subject, body }) {
  const params = new URLSearchParams();
  params.set("subject", subject);
  params.set("body", body);
  return `mailto:${encodeURIComponent(to)}?${params.toString()}`;
}

/* ---------------- localStorage ---------------- */

function saveDraftToStorage(data, draft) {
  localStorage.setItem("contactFormDraft", JSON.stringify(data));
  localStorage.setItem("contactEmailDraft", JSON.stringify(draft));
}

function restoreFormFromStorage() {
  try {
    const raw = localStorage.getItem("contactFormDraft");
    if (raw) {
      const data = JSON.parse(raw);

      const nameEl = document.getElementById("contact-name");
      const emailEl = document.getElementById("contact-email");
      const topicEl = document.getElementById("contact-topic");
      const msgEl = document.getElementById("contact-message");

      if (nameEl && typeof data.name === "string") nameEl.value = data.name;
      if (emailEl && typeof data.email === "string") emailEl.value = data.email;
      if (topicEl && typeof data.topic === "string") topicEl.value = data.topic;
      if (msgEl && typeof data.message === "string") msgEl.value = data.message;
    }

    const status = document.getElementById("contact-status");
    const draftRaw = localStorage.getItem("contactEmailDraft");
    if (status && draftRaw) {
      const draft = JSON.parse(draftRaw);
      if (draft?.preview) {
        showStatus(status, "Restored your last draft:\n\n" + draft.preview, false);
      }
    }
  } catch (err) {
    console.warn("Could not restore contact draft:", err);
  }
}

/* ---------------- UI helpers ---------------- */

function showStatus(statusEl, text, isError) {
  statusEl.textContent = text;
  statusEl.dataset.state = isError ? "error" : "ok";
}

function animateIn(el) {
  if (window.jQuery) {
    $(el)
      .stop(true, true)
      .css({ opacity: 0, marginLeft: "12px" })
      .animate({ opacity: 1, marginLeft: "0px" }, 160);
  }
}
