const categories = [
  { name: "校内信息门户", icon: "landmark" },
  { name: "实用工具", icon: "tool" },
  { name: "其他网址导航", icon: "compass" },
];

const fallbackSites = [
  {
    url: "https://ehall.whu.edu.cn/",
    name: "智慧珞珈",
    description: "武汉大学统一办事与校内服务入口，适合集中处理常用校园事务。",
    category: "校内信息门户",
    tags: ["办事大厅", "校内服务", "统一入口"],
  },
  {
    url: "https://www.whu.edu.cn/",
    name: "武汉大学官网",
    description: "学校新闻、通知公告、机构信息与公开资料的官方入口。",
    category: "校内信息门户",
    tags: ["官网", "公告", "学校信息"],
  },
  {
    url: "https://news.whu.edu.cn/",
    name: "武大新闻网",
    description: "查看学校要闻、学术动态、人物报道与校园专题。",
    category: "校内信息门户",
    tags: ["新闻", "校园动态", "专题"],
  },
  {
    url: "https://lib.whu.edu.cn/",
    name: "武汉大学图书馆",
    description: "馆藏检索、数据库访问、空间预约与图书馆服务入口。",
    category: "校内信息门户",
    tags: ["图书馆", "文献", "数据库"],
  },
  {
    url: "https://mail.whu.edu.cn/",
    name: "武汉大学邮箱",
    description: "学校邮箱登录入口，用于收发校内通知与学术往来邮件。",
    category: "实用工具",
    tags: ["邮箱", "通知", "账号"],
  },
  {
    url: "https://vpn.whu.edu.cn/",
    name: "校园 VPN",
    description: "校外访问校内资源与数据库时常用的安全接入服务。",
    category: "实用工具",
    tags: ["VPN", "校外访问", "资源"],
  },
  {
    url: "https://www.deepl.com/translator",
    name: "DeepL 翻译",
    description: "适合阅读论文、邮件与网页内容时使用的多语言翻译工具。",
    category: "实用工具",
    tags: ["翻译", "论文", "写作"],
  },
  {
    url: "https://www.wolframalpha.com/",
    name: "WolframAlpha",
    description: "数学、物理、统计与工程计算的知识计算引擎。",
    category: "实用工具",
    tags: ["计算", "数学", "查询"],
  },
  {
    url: "https://github.com/",
    name: "GitHub",
    description: "代码托管、项目协作、开源检索与个人作品集维护平台。",
    category: "其他网址导航",
    tags: ["代码", "开源", "协作"],
  },
  {
    url: "https://www.zhihu.com/",
    name: "知乎",
    description: "面向学习、生活经验与专业讨论的中文问答社区。",
    category: "其他网址导航",
    tags: ["问答", "经验", "社区"],
  },
  {
    url: "https://www.bilibili.com/",
    name: "哔哩哔哩",
    description: "课程视频、技术分享、校园生活内容与综合视频社区。",
    category: "其他网址导航",
    tags: ["视频", "课程", "社区"],
  },
  {
    url: "https://www.runoob.com/",
    name: "菜鸟教程",
    description: "编程语言、Web 技术与开发工具的快速入门参考。",
    category: "其他网址导航",
    tags: ["编程", "教程", "参考"],
  },
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
  if (window.location.protocol === "file:") {
    state.sites = fallbackSites;
    renderCategories();
    renderSites();
    return;
  }

  try {
    const response = await fetch("./data/sites.json");

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    state.sites = await response.json();
    renderCategories();
    renderSites();
  } catch (error) {
    state.sites = fallbackSites;
    renderCategories();
    renderSites();
    console.warn("Using fallback site data:", error);
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
