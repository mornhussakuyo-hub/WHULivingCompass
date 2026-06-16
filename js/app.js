const categories = [
  { name: "校内信息门户", icon: "landmark" },
  { name: "课程学习平台", icon: "book" },
  { name: "实用工具", icon: "tool" },
  { name: "其他网址导航", icon: "compass" },
];

const icons = {
  landmark: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 10h18" />
      <path d="M5 10 12 4l7 6" />
      <path d="M6 10v8M10 10v8M14 10v8M18 10v8" />
      <path d="M4 20h16" />
    </svg>
  `,
  book: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 3H20v18H6.5A2.5 2.5 0 0 1 4 18.5v-13A2.5 2.5 0 0 1 6.5 3Z" />
      <path d="M8 7h8" />
    </svg>
  `,
  tool: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M14.7 6.3a4 4 0 0 0-5.3 5.3l-5.7 5.7a2.1 2.1 0 0 0 3 3l5.7-5.7a4 4 0 0 0 5.3-5.3l-2.9 2.9-2.1-2.1 2.9-2.9Z" />
    </svg>
  `,
  compass: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2.1 4.9-4.9 2.1 2.1-4.9 4.9-2.1Z" />
    </svg>
  `,
  link: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M10 13a5 5 0 0 0 7.07 0l2.12-2.12a5 5 0 0 0-7.07-7.07L11 4.93" />
      <path d="M14 11a5 5 0 0 0-7.07 0L4.8 13.12a5 5 0 0 0 7.07 7.07L13 19.07" />
    </svg>
  `,
  external: `
    <svg class="external-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 17 17 7" />
      <path d="M9 7h8v8" />
    </svg>
  `,
};

const state = {
  sites: [],
  activeCategory: categories[0].name,
  query: "",
};

const els = {
  root: document.documentElement,
  categoryNav: document.querySelector("#categoryNav"),
  categoryCount: document.querySelector("#categoryCount"),
  categoryTitle: document.querySelector("#categoryTitle"),
  resultCount: document.querySelector("#resultCount"),
  siteGrid: document.querySelector("#siteGrid"),
  siteSearch: document.querySelector("#siteSearch"),
  themeToggle: document.querySelector("#themeToggle"),
  emptyState: document.querySelector("#emptyState"),
};

initTheme();
bindEvents();
loadSites();

function bindEvents() {
  els.themeToggle.addEventListener("click", toggleTheme);
  els.siteSearch.addEventListener("input", (event) => {
    state.query = event.target.value.trim().toLowerCase();
    renderSites();
  });
}

async function loadSites() {
  try {
    const response = await fetch("./data/sites.json");

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    state.sites = await response.json();
    renderCategories();
    renderSites();
  } catch (error) {
    els.siteGrid.innerHTML = "";
    els.emptyState.hidden = false;
    els.emptyState.querySelector("p").textContent = "数据加载失败";
    console.error("Failed to load site data:", error);
  }
}

function renderCategories() {
  els.categoryCount.textContent = categories.length;
  els.categoryNav.innerHTML = categories
    .map((category) => {
      const size = state.sites.filter((site) => site.category === category.name).length;
      const activeClass = category.name === state.activeCategory ? " is-active" : "";

      return `
        <button class="category-button${activeClass}" type="button" data-category="${escapeHtml(category.name)}">
          <span class="category-icon">${icons[category.icon]}</span>
          <span class="category-name">${escapeHtml(category.name)}</span>
          <span class="category-size">${size}</span>
        </button>
      `;
    })
    .join("");

  els.categoryNav.querySelectorAll(".category-button").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeCategory = button.dataset.category;
      renderCategories();
      renderSites();
    });
  });
}

function renderSites() {
  const filteredSites = state.sites.filter((site) => {
    const matchesCategory = site.category === state.activeCategory;
    const searchableText = [site.name, site.description, site.category, ...(site.tags || [])]
      .join(" ")
      .toLowerCase();
    const matchesQuery = !state.query || searchableText.includes(state.query);

    return matchesCategory && matchesQuery;
  });

  els.categoryTitle.textContent = state.activeCategory;
  els.resultCount.textContent = `${filteredSites.length} 个网站`;
  els.emptyState.hidden = filteredSites.length > 0;

  els.siteGrid.innerHTML = filteredSites.map(renderSiteCard).join("");
}

function renderSiteCard(site) {
  const tags = (site.tags || [])
    .map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`)
    .join("");

  return `
    <a class="site-card" href="${escapeAttribute(site.url)}" target="_blank" rel="noreferrer">
      <span class="card-top">
        <span class="card-icon">${icons.link}</span>
        ${icons.external}
      </span>
      <span>
        <h2>${escapeHtml(site.name)}</h2>
        <p>${escapeHtml(site.description)}</p>
      </span>
      <span class="tag-list">${tags}</span>
    </a>
  `;
}

function initTheme() {
  const savedTheme = localStorage.getItem("whu-compass-theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = savedTheme || (prefersDark ? "dark" : "light");

  els.root.dataset.theme = theme;
}

function toggleTheme() {
  const nextTheme = els.root.dataset.theme === "dark" ? "light" : "dark";
  els.root.dataset.theme = nextTheme;
  localStorage.setItem("whu-compass-theme", nextTheme);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  const safeValue = String(value || "#");

  if (!/^https?:\/\//i.test(safeValue)) {
    return "#";
  }

  return escapeHtml(safeValue);
}
