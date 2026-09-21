document.documentElement.classList.add("js");

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const header = document.querySelector("[data-header]");
const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".primary-navigation");

document.querySelectorAll("[data-year]").forEach((element) => {
    element.textContent = new Date().getFullYear();
});

const updateHeader = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 16);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const closeMenu = () => {
    if (!menuButton || !navigation) return;
    menuButton.setAttribute("aria-expanded", "false");
    navigation.classList.remove("is-open");
    document.body.classList.remove("menu-open");
};

menuButton?.addEventListener("click", () => {
    const willOpen = menuButton.getAttribute("aria-expanded") !== "true";
    menuButton.setAttribute("aria-expanded", String(willOpen));
    navigation?.classList.toggle("is-open", willOpen);
    document.body.classList.toggle("menu-open", willOpen);
});

navigation?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeMenu();
        menuButton?.focus();
    }
});

window.addEventListener("resize", () => {
    if (window.innerWidth > 768) closeMenu();
});

const revealItems = [...document.querySelectorAll("[data-reveal]")];

if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            });
        },
        { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
}

const sectionItems = [...document.querySelectorAll('.primary-navigation a[href^="#"]')]
    .map((link) => ({
        id: link.getAttribute("href").slice(1),
        link,
        section: document.getElementById(link.getAttribute("href").slice(1)),
    }))
    .filter((item) => item.section);

const setActiveSection = (activeId) => {
    sectionItems.forEach(({ id, link }) => {
        const isActive = id === activeId;
        link.classList.toggle("is-active", isActive);
        if (isActive) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
    });
};

let scrollSpyQueued = false;
const updateActiveSection = () => {
    scrollSpyQueued = false;
    const headerOffset = header?.offsetHeight ?? 0;
    const marker = window.scrollY + headerOffset + Math.min(window.innerHeight * 0.28, 220);
    const atPageEnd = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 8;
    let activeId = null;

    sectionItems.forEach(({ id, section }) => {
        if (section.offsetTop <= marker) activeId = id;
    });

    if (atPageEnd && sectionItems.length) {
        activeId = sectionItems[sectionItems.length - 1].id;
    }

    setActiveSection(activeId);
};

const requestScrollSpy = () => {
    if (scrollSpyQueued) return;
    scrollSpyQueued = true;
    window.requestAnimationFrame(updateActiveSection);
};

window.addEventListener("scroll", requestScrollSpy, { passive: true });
window.addEventListener("resize", requestScrollSpy);
window.addEventListener("hashchange", requestScrollSpy);
updateActiveSection();

const terminalExamples = {
    housing: {
        name: "Housing Markets",
        sql: {
            file: "housing_market_intelligence_platform.sql",
            html: '<span class="code-keyword">SELECT</span> COUNT(*) <span class="code-keyword">AS</span> markets,\n       ROUND(AVG(avg_sale_price)) <span class="code-keyword">AS</span> avg_price,\n       ROUND(AVG(avg_rent)) <span class="code-keyword">AS</span> avg_rent\n<span class="code-keyword">FROM</span> market_map_2024;',
            headers: ["markets", "avg_price", "avg_rent"],
            rows: [["375", "$349,983", "$1,499"]],
            summary: "The selected sample shows a SQL market profile across 375 housing markets.",
        },
        python: {
            file: "geography_integration.py",
            html: 'market_map = (\n    zillow.merge(geo_bridge, on=<span class="code-string">"zillow_region_id"</span>)\n          .merge(redfin, on=[<span class="code-string">"redfin_region_id"</span>, <span class="code-string">"month"</span>])\n          .merge(census, on=<span class="code-string">"parent_metro_code"</span>)\n)\nmarket_map = market_map.drop_duplicates([<span class="code-string">"geo_id"</span>, <span class="code-string">"month"</span>])',
            headers: ["validated output", "markets"],
            rows: [["complete market map", "375"]],
            summary: "The selected sample shows Pandas merges used to build a validated map of 375 housing markets.",
        },
    },
    salary: {
        name: "Salary Intelligence",
        sql: {
            file: "salary_intelligence_project.sql",
            html: '<span class="code-keyword">SELECT</span> COUNT(*) <span class="code-keyword">AS</span> total_records,\n       COUNT(DISTINCT data_source) <span class="code-keyword">AS</span> data_sources\n<span class="code-keyword">FROM</span> combined_salary_data;',
            headers: ["total_records", "data_sources"],
            rows: [["51,939", "3"]],
            summary: "The selected sample validates 51,939 salary records combined from three data sources.",
        },
        python: {
            file: "salary_data_cleaning.ipynb",
            html: 'combined_salary_data = pd.concat([\n    set1_standardized,\n    set2_standardized,\n    set3_standardized\n], ignore_index=<span class="code-keyword">True</span>)\n\ncombined_salary_data[<span class="code-string">"work_setting"</span>] = (\n    combined_salary_data[<span class="code-string">"remote_ratio"</span>]\n        .map({0: <span class="code-string">"In-person"</span>, 50: <span class="code-string">"Hybrid"</span>, 100: <span class="code-string">"Remote"</span>})\n)',
            headers: ["rows", "sources"],
            rows: [["51,939", "3"]],
            summary: "The selected sample shows Pandas standardization and concatenation for 51,939 salary records.",
        },
    },
    citibike: {
        name: "Citi Bike",
        sql: {
            file: "citibike_analysis.sql",
            html: '<span class="code-keyword">SELECT</span> rideable_type,\n       COUNT(*) <span class="code-keyword">AS</span> rides,\n       ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 1) <span class="code-keyword">AS</span> share_pct\n<span class="code-keyword">FROM</span> trips\n<span class="code-keyword">GROUP BY</span> rideable_type\n<span class="code-keyword">ORDER BY</span> rides DESC;',
            headers: ["rideable_type", "rides", "share_pct"],
            rows: [["electric_bike", "27,497", "68.7%"], ["classic_bike", "12,547", "31.3%"]],
            summary: "The selected sample shows that electric bikes account for 68.7 percent of 40,044 Citi Bike trips.",
        },
        python: {
            file: "exploration.py",
            html: 'rides[<span class="code-string">"started_at"</span>] = pd.to_datetime(rides[<span class="code-string">"started_at"</span>])\nrides[<span class="code-string">"ended_at"</span>] = pd.to_datetime(rides[<span class="code-string">"ended_at"</span>])\nrides[<span class="code-string">"ride_duration"</span>] = (\n    (rides[<span class="code-string">"ended_at"</span>] - rides[<span class="code-string">"started_at"</span>])\n    .dt.total_seconds().div(60).round(2)\n)\nsummary = rides.groupby(<span class="code-string">"member_casual"</span>)[<span class="code-string">"ride_duration"</span>].mean()',
            headers: ["rider type", "avg minutes"],
            rows: [["casual", "15.4"], ["member", "13.4"]],
            summary: "The selected sample compares average ride duration for casual riders and Citi Bike members.",
        },
    },
};

const terminal = document.querySelector("[data-terminal]");
const projectButtons = terminal ? [...terminal.querySelectorAll("[data-project]")] : [];
const languageTabs = terminal ? [...terminal.querySelectorAll("[data-language]")] : [];
const codePanel = terminal?.querySelector("#code-panel");
const codeFile = terminal?.querySelector("[data-code-file]");
const codeContext = terminal?.querySelector("[data-code-context]");
const codeOutput = terminal?.querySelector("[data-code-output]");
const resultBlock = terminal?.querySelector("[data-result-block]");
const terminalSummary = terminal?.querySelector("[data-terminal-summary]");
let activeProject = "housing";
let activeLanguage = "sql";

const renderTerminalExample = () => {
    const project = terminalExamples[activeProject];
    const example = project?.[activeLanguage];
    const activeTab = languageTabs.find((tab) => tab.dataset.language === activeLanguage);
    if (!example || !codeFile || !codeContext || !codeOutput || !resultBlock || !codePanel) return;

    projectButtons.forEach((button) => {
        button.setAttribute("aria-pressed", String(button.dataset.project === activeProject));
    });
    languageTabs.forEach((tab) => {
        const isActive = tab.dataset.language === activeLanguage;
        tab.setAttribute("aria-selected", String(isActive));
        tab.tabIndex = isActive ? 0 : -1;
    });

    codePanel.setAttribute("aria-labelledby", activeTab?.id ?? "sql-tab");
    codeFile.textContent = example.file;
    codeContext.textContent = project.name + " · " + (activeLanguage === "sql" ? "SQL" : "Python / Pandas");
    codeOutput.innerHTML = example.html;
    resultBlock.innerHTML = "";
    resultBlock.style.setProperty("--result-columns", "repeat(" + example.headers.length + ", minmax(0, 1fr))");

    [example.headers, ...example.rows].forEach((row, rowIndex) => {
        const rowElement = document.createElement("div");
        rowElement.className = "result-row" + (rowIndex === 0 ? " result-header" : "");
        row.forEach((value) => {
            const cell = document.createElement("span");
            cell.textContent = value;
            rowElement.appendChild(cell);
        });
        resultBlock.appendChild(rowElement);
    });

    if (terminalSummary) terminalSummary.textContent = example.summary;
};

projectButtons.forEach((button) => {
    button.addEventListener("click", () => {
        activeProject = button.dataset.project;
        renderTerminalExample();
    });
});

languageTabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {
        activeLanguage = tab.dataset.language;
        renderTerminalExample();
    });
    tab.addEventListener("keydown", (event) => {
        if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        let nextIndex = index;
        if (event.key === "ArrowRight") nextIndex = (index + 1) % languageTabs.length;
        if (event.key === "ArrowLeft") nextIndex = (index - 1 + languageTabs.length) % languageTabs.length;
        if (event.key === "Home") nextIndex = 0;
        if (event.key === "End") nextIndex = languageTabs.length - 1;
        activeLanguage = languageTabs[nextIndex].dataset.language;
        renderTerminalExample();
        languageTabs[nextIndex].focus();
    });
});

renderTerminalExample();
