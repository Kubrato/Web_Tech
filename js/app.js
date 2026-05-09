/*
  app.js — shared logic for every page.

  Keeps user choices (narrative, location, audience, length, mode, theme)
  in localStorage so they survive a page reload.

  All UI updates go through CustomEvents so each page can react in its
  own script without knowing the others.
*/

const App = (() => {

  // ---- 1. Read saved values from localStorage ----
  const state = {
    activeNarrative:     localStorage.getItem("activeNarrative")     || "pursuit",
    activeLocationIndex: parseInt(localStorage.getItem("activeLocationIndex") || "0", 10),
    textVariant:         localStorage.getItem("textVariant")         || "adult",   // young | adult | scholar
    textLength:          localStorage.getItem("textLength")          || "medium",  // short | medium
    readingMode:         localStorage.getItem("readingMode")         || "story",   // story | details
    theme:               localStorage.getItem("theme")               || "cinematic" // cinematic | heritage
  };

  // Audience levels in order (used by the easier/harder buttons)
  const VARIANT_ORDER = ["young", "adult", "scholar"];
  const VALID_LENGTHS = ["short", "medium"];
  const VALID_MODES   = ["story", "details"];


  // ---- 2. Narrative (pursuit / timeline) ----
  function setNarrative(id) {
    state.activeNarrative = id;
    state.activeLocationIndex = 0;
    localStorage.setItem("activeNarrative", id);
    localStorage.setItem("activeLocationIndex", "0");
    document.dispatchEvent(new CustomEvent("narrativeChanged", { detail: { narrativeId: id } }));
  }
  function getNarrative()     { return state.activeNarrative; }
  function getNarrativeData() { return APP_DATA.narratives.find(n => n.id === state.activeNarrative); }
  function getLocations() {
    if (state.activeNarrative === "pursuit") return APP_DATA.pursuitLocations;
    return APP_DATA.timelineLocations;
  }


  // ---- 3. Active location index ----
  function setLocationIndex(i) {
    const locs = getLocations();
    if (i < 0) i = 0;
    if (i > locs.length - 1) i = locs.length - 1;
    state.activeLocationIndex = i;
    localStorage.setItem("activeLocationIndex", String(i));
    document.dispatchEvent(new CustomEvent("locationChanged", { detail: { index: i } }));
  }
  function getLocationIndex()  { return state.activeLocationIndex; }
  function getActiveLocation() { return getLocations()[state.activeLocationIndex]; }


  // ---- 4. Text variant (audience: young / adult / scholar) ----
  function setTextVariant(v) {
    if (!VARIANT_ORDER.includes(v)) return;
    state.textVariant = v;
    localStorage.setItem("textVariant", v);
    document.dispatchEvent(new CustomEvent("textVariantChanged", { detail: { variant: v } }));
  }
  function getTextVariant() { return state.textVariant; }

  // "Too simple" / "Too difficult" buttons step the audience up or down.
  function nudgeVariantHarder() {
    const i = VARIANT_ORDER.indexOf(state.textVariant);
    if (i < VARIANT_ORDER.length - 1) setTextVariant(VARIANT_ORDER[i + 1]);
  }
  function nudgeVariantEasier() {
    const i = VARIANT_ORDER.indexOf(state.textVariant);
    if (i > 0) setTextVariant(VARIANT_ORDER[i - 1]);
  }


  // ---- 5. Text length (short / medium) ----
  function setTextLength(len) {
    if (!VALID_LENGTHS.includes(len)) return;
    state.textLength = len;
    localStorage.setItem("textLength", len);
    document.dispatchEvent(new CustomEvent("textLengthChanged", { detail: { length: len } }));
  }
  function getTextLength() { return state.textLength; }
  function tellMeMore()    { setTextLength("medium"); }
  function tellMeLess()    { setTextLength("short"); }


  // ---- 6. Reading mode (story / details) ----
  function setReadingMode(mode) {
    if (!VALID_MODES.includes(mode)) return;
    state.readingMode = mode;
    localStorage.setItem("readingMode", mode);
    document.dispatchEvent(new CustomEvent("readingModeChanged", { detail: { mode } }));
  }
  function getReadingMode()    { return state.readingMode; }
  function toggleReadingMode() {
    setReadingMode(state.readingMode === "story" ? "details" : "story");
  }


  // ---- 7. Theme (cinematic / heritage) ----
  // The theme is set by adding a data-theme attribute to <html>.
  // CSS uses this attribute to switch colors, fonts, and spacing.
  function setTheme(theme) {
    state.theme = theme;
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
    document.dispatchEvent(new CustomEvent("themeChanged", { detail: { theme } }));
  }
  function getTheme()   { return state.theme; }
  function applyTheme() { document.documentElement.setAttribute("data-theme", state.theme); }


  // ---- 8. Navigation helpers ----
  function navigateTo(page) { window.location.href = page; }

  function goNext() {
    const locs = getLocations();
    if (state.activeLocationIndex < locs.length - 1) {
      setLocationIndex(state.activeLocationIndex + 1);
    }
  }
  function goPrev() {
    if (state.activeLocationIndex > 0) {
      setLocationIndex(state.activeLocationIndex - 1);
    }
  }

  // Site-wide page order for prev/next links between pages.
  const PAGE_ORDER = ["index.html", "map.html", "explore.html", "about.html", "docs.html", "disclaimer.html"];
  function currentPageName() {
    return window.location.pathname.split("/").pop() || "index.html";
  }
  function getPrevPage() {
    const i = PAGE_ORDER.indexOf(currentPageName());
    if (i > 0) return PAGE_ORDER[i - 1];
    return null;
  }
  function getNextPage() {
    const i = PAGE_ORDER.indexOf(currentPageName());
    if (i >= 0 && i < PAGE_ORDER.length - 1) return PAGE_ORDER[i + 1];
    return null;
  }


  // ---- 9. Highlight the active link in the top nav ----
  function highlightActiveNav() {
    const page = currentPageName();
    document.querySelectorAll(".nav-link").forEach(link => {
      const href = link.getAttribute("href");
      const isActive = href && href.includes(page);
      link.classList.toggle("active", !!isActive);
    });
  }


  // ---- 10. Small helpers ----
  function chapterColorClass(chapter) {
    const map = {
      "Surveillance":  "chapter-surveillance",
      "The Chase":     "chapter-chase",
      "The Search":    "chapter-search",
      "Confrontation": "chapter-confrontation",
      "1960s":         "chapter-1960s",
      "2012":          "chapter-2012",
      "2014":          "chapter-2014",
      "2016":          "chapter-2016"
    };
    return map[chapter] || "chapter-default";
  }

  function formatCoords(coords) {
    if (!coords) return "";
    return coords[0].toFixed(4) + "°N, " + coords[1].toFixed(4) + "°E";
  }


  // ---- 11. QR code for each location (links to Wikipedia) ----
  // Uses a free public API so we don't need a JS library.
  function getWikipediaUrl(location) {
    const sources = (location.meta && location.meta.sources) || [];
    const wiki = sources.find(s => /wikipedia/i.test(s.label || ""));
    if (wiki && wiki.url) return wiki.url;
    if (sources[0] && sources[0].url) return sources[0].url;
    return null;
  }

  function generateLocationQR(container, location) {
    const url = getWikipediaUrl(location);
    if (!url) {
      container.textContent = "Wikipedia link unavailable";
      return;
    }
    const qrSrc = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" + encodeURIComponent(url);
    container.innerHTML =
      '<a href="' + url + '" target="_blank" rel="noopener noreferrer">' +
        '<img src="' + qrSrc + '" alt="QR code for ' + (location.name || "") + '" width="112" height="112">' +
      '</a>';
  }


  // ---- 12. Init (runs once per page) ----
  function init() {
    applyTheme();

    // Make sure the saved index is still valid for the current narrative.
    const locs = getLocations();
    if (state.activeLocationIndex >= locs.length) {
      state.activeLocationIndex = 0;
      localStorage.setItem("activeLocationIndex", "0");
    }

    highlightActiveNav();
  }


  // ---- 13. Public API ----
  return {
    state,
    // narrative
    setNarrative, getNarrative, getNarrativeData, getLocations,
    // location
    setLocationIndex, getLocationIndex, getActiveLocation,
    // text variant
    setTextVariant, getTextVariant, VARIANT_ORDER,
    nudgeVariantHarder, nudgeVariantEasier,
    // text length
    setTextLength, getTextLength, tellMeMore, tellMeLess, VALID_LENGTHS,
    // reading mode
    setReadingMode, getReadingMode, toggleReadingMode, VALID_MODES,
    // theme
    setTheme, getTheme, applyTheme,
    // navigation
    navigateTo, goNext, goPrev, getPrevPage, getNextPage,
    // nav UI
    highlightActiveNav,
    // utilities
    chapterColorClass, formatCoords,
    // QR
    generateLocationQR,
    // init
    init
  };

})();


// Apply the saved theme as early as possible to avoid a color flash on load.
(function earlyTheme() {
  const saved = localStorage.getItem("theme") || "cinematic";
  document.documentElement.setAttribute("data-theme", saved);
})();

document.addEventListener("DOMContentLoaded", () => App.init());
