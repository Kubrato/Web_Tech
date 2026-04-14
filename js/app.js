/**
 * Istanbul Cinema Tourism — Shared Application Logic
 * Handles: navigation state, narrative selection, shared utilities
 */

const App = (() => {

  // ─── STATE ────────────────────────────────────────────────────────────────────
  const state = {
    activeNarrative: localStorage.getItem("activeNarrative") || "espionage",
    activeLocationIndex: parseInt(localStorage.getItem("activeLocationIndex") || "0", 10)
  };

  // ─── NARRATIVE MANAGEMENT ─────────────────────────────────────────────────────
  function setNarrative(narrativeId) {
    state.activeNarrative = narrativeId;
    state.activeLocationIndex = 0;
    localStorage.setItem("activeNarrative", narrativeId);
    localStorage.setItem("activeLocationIndex", "0");
    document.dispatchEvent(new CustomEvent("narrativeChanged", { detail: { narrativeId } }));
  }

  function getNarrative() {
    return state.activeNarrative;
  }

  function getNarrativeData() {
    return APP_DATA.narratives.find(n => n.id === state.activeNarrative);
  }

  function getLocations() {
    return state.activeNarrative === "espionage"
      ? APP_DATA.espionageLocations
      : APP_DATA.timelineLocations;
  }

  // ─── LOCATION INDEX MANAGEMENT ───────────────────────────────────────────────
  function setLocationIndex(index) {
    const locs = getLocations();
    state.activeLocationIndex = Math.max(0, Math.min(index, locs.length - 1));
    localStorage.setItem("activeLocationIndex", String(state.activeLocationIndex));
    document.dispatchEvent(new CustomEvent("locationChanged", { detail: { index: state.activeLocationIndex } }));
  }

  function getLocationIndex() {
    return state.activeLocationIndex;
  }

  function getActiveLocation() {
    return getLocations()[state.activeLocationIndex];
  }

  // ─── NAVIGATION ───────────────────────────────────────────────────────────────
  function navigateTo(page) {
    window.location.href = page;
  }

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

  // ─── ACTIVE NAV LINK ─────────────────────────────────────────────────────────
  function highlightActiveNav() {
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-link").forEach(link => {
      const href = link.getAttribute("href");
      if (href && href.includes(currentPage)) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  // ─── UTILITY ─────────────────────────────────────────────────────────────────
  function chapterColorClass(chapter) {
    const map = {
      "Surveillance": "chapter-surveillance",
      "Escape":       "chapter-escape",
      "Hideouts":     "chapter-hideouts",
      "Confrontation":"chapter-confrontation",
      "1960s":        "chapter-1960s",
      "2012":         "chapter-2012",
      "2016":         "chapter-2016"
    };
    return map[chapter] || "chapter-default";
  }

  function formatCoords(coords) {
    if (!coords) return "";
    return `${coords[0].toFixed(4)}°N, ${coords[1].toFixed(4)}°E`;
  }

  // ─── INIT ─────────────────────────────────────────────────────────────────────
  function init() {
    // Ensure saved index is still valid for current narrative
    const locs = getLocations();
    if (state.activeLocationIndex >= locs.length) {
      state.activeLocationIndex = 0;
      localStorage.setItem("activeLocationIndex", "0");
    }
    highlightActiveNav();
  }

  return {
    state,
    setNarrative,
    getNarrative,
    getNarrativeData,
    getLocations,
    setLocationIndex,
    getLocationIndex,
    getActiveLocation,
    navigateTo,
    goNext,
    goPrev,
    highlightActiveNav,
    chapterColorClass,
    formatCoords,
    init
  };

})();

// Run init when DOM is ready
document.addEventListener("DOMContentLoaded", () => App.init());
