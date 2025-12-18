// projects.js (projects page only) — with jQuery animations

let allItems = [];
let activeFilter = "all";

window.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;
  if (page !== "projects") return;

  initProjectsPage().catch((err) => {
    console.error(err);
    showStatusMessage(
      "Could not load projects. If you're opening the HTML file directly, use Live Server or a local web server."
    );
  });
});

async function initProjectsPage() {
  wireUpFilters();
  await loadProjectsData();
  renderProjects(allItems, { animate: true });
}

/* ---------------- Data Loading ---------------- */

async function loadProjectsData() {
  const res = await fetch("data/projects.json", { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch data/projects.json (status ${res.status})`);

  const data = await res.json();
  if (!data || !Array.isArray(data.items)) {
    throw new Error("Invalid JSON structure: expected { items: [...] }");
  }

  allItems = data.items;
}

/* ---------------- Filtering ---------------- */

function wireUpFilters() {
  const filtersEl = document.getElementById("filters");
  if (!filtersEl) return;

  filtersEl.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-filter]");
    if (!btn) return;

    // Update active state (visual + a11y)
    filtersEl.querySelectorAll("button[data-filter]").forEach((b) => {
      const isActive = b === btn;
      b.classList.toggle("is-active", isActive);
      b.setAttribute("aria-pressed", isActive ? "true" : "false");
    });

    activeFilter = btn.dataset.filter;
    const filtered = applyFilter(allItems, activeFilter);

    animateSwap(() => renderProjects(filtered, { animate: true }));
  });
}

function applyFilter(items, filter) {
  if (filter === "all") return items;

  if (filter === "work" || filter === "project") {
    return items.filter((item) => item.kind === filter);
  }

  return items.filter((item) => Array.isArray(item.domains) && item.domains.includes(filter));
}

/* ---------------- Rendering ---------------- */

function renderProjects(items, { animate } = { animate: false }) {
  const grid = document.getElementById("projects-grid");
  if (!grid) return;

  grid.innerHTML = "";

  if (!items.length) {
    showStatusMessage("No items match this filter.");
    return;
  }

  const frag = document.createDocumentFragment();
  items.forEach((item) => frag.appendChild(createCard(item)));
  grid.appendChild(frag);

  // jQuery card entrance animation (staggered)
  if (animate) {
    animateCardsIn();
  }
}

function createCard(item) {
  const card = document.createElement("article");
  card.className = "project-card";
  card.dataset.kind = item.kind || "";
  card.dataset.colorkey = item.colorKey || "";
  card.dataset.domains = Array.isArray(item.domains) ? item.domains.join(",") : "";

  const title = document.createElement("h3");
  title.textContent = item.title || "Untitled";

  const meta = document.createElement("p");
  meta.className = "project-meta";
  const org = item.org ? `${item.org}` : "";
  const role = item.role ? ` · ${item.role}` : "";
  const date = item.dateRange ? ` · ${item.dateRange}` : "";
  meta.textContent = `${org}${role}${date}`.trim();

const chips = document.createElement("div");
chips.className = "chips";

const domains = Array.isArray(item.domains) ? item.domains : [];
if (domains.length) {
  const domainRow = document.createElement("div");
  domainRow.className = "chip-row chip-row--domains";
  domains.forEach((d) => domainRow.appendChild(makeChip(d, "domain")));
  chips.appendChild(domainRow);
}

const tech = Array.isArray(item.tech) ? item.tech : [];
if (tech.length) {
  const techRow = document.createElement("div");
  techRow.className = "chip-row chip-row--tech";
  tech.slice(0, 6).forEach((t) => techRow.appendChild(makeChip(t, "tech")));
  chips.appendChild(techRow);
}

  const ul = document.createElement("ul");
  ul.className = "highlights";
  const highlights = Array.isArray(item.highlights) ? item.highlights : [];
  highlights.slice(0, 3).forEach((h) => {
    const li = document.createElement("li");
    li.textContent = h;
    ul.appendChild(li);
  });

  const metrics = Array.isArray(item.metrics) ? item.metrics : [];
  let metricsWrap = null;
  if (metrics.length) {
    metricsWrap = document.createElement("div");
    metricsWrap.className = "metrics";
    metrics.slice(0, 4).forEach((m) => {
      const badge = document.createElement("span");
      badge.className = "metric-badge";
      badge.textContent = `${m.label}: ${m.value}`;
      metricsWrap.appendChild(badge);
    });
  }

  card.appendChild(title);
  if (meta.textContent) card.appendChild(meta);
  if (chips.childNodes.length) card.appendChild(chips);
  if (ul.childNodes.length) card.appendChild(ul);
  if (metricsWrap) card.appendChild(metricsWrap);

  return card;
}

function makeChip(text, type) {
  const chip = document.createElement("span");
  chip.className = `chip chip-${type}`;
  chip.textContent = text;
  return chip;
}

/* ---------------- jQuery Animations ---------------- */

function animateCardsIn() {
  if (typeof window.jQuery === "undefined") return;

  const $cards = $(".project-card");

  // Start cards slightly off to the right + invisible
  $cards.each(function (i) {
    $(this)
      .css({ opacity: 0, marginLeft: "24px" })
      .delay(i * 70)
      .animate(
        { opacity: 1, marginLeft: "0px" },
        220
      );
  });
}

function animateSwap(renderFn) {
  if (typeof window.jQuery === "undefined") {
    renderFn();
    return;
  }

  const $grid = $("#projects-grid");
  const $cards = $grid.find(".project-card");

  if ($cards.length === 0) {
    renderFn();
    return;
  }

  // Slide existing cards out to the left, then re-render, then slide new ones in
  let done = 0;
  $cards.each(function () {
    $(this).animate(
      { opacity: 0, marginLeft: "-24px" },
      140,
      function () {
        done += 1;
        if (done === $cards.length) {
          renderFn(); // this will call animateCardsIn()
        }
      }
    );
  });
}

/* ---------------- Status ---------------- */

function showStatusMessage(msg) {
  const grid = document.getElementById("projects-grid");
  if (!grid) return;

  grid.innerHTML = "";
  const p = document.createElement("p");
  p.textContent = msg;
  grid.appendChild(p);
}
