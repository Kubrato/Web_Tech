/**
 * Istanbul Cinema Tourism — Shared Application Logic
 *
 * Responsibilities:
 *   - narrative + location state (localStorage)
 *   - text variant state (brief/mid/long) + mode state (story/details)
 *   - theme state (cinematic/heritage) + DOM injection
 *   - Schema.org JSON-LD metadata injection (PDF p.16 RSTU requirement)
 *   - QR code helper (per-location, uses qrcode.js loaded on demand)
 *   - helpers: chapter color class, coord formatting, navigation
 */

const App = (() => {

  // ─── STATE ────────────────────────────────────────────────────────────────────
  const state = {
    activeNarrative:     localStorage.getItem("activeNarrative")     || "espionage",
    activeLocationIndex: parseInt(localStorage.getItem("activeLocationIndex") || "0", 10),
    textVariant:         localStorage.getItem("textVariant")         || "mid",   // brief | mid | long
    readingMode:         localStorage.getItem("readingMode")         || "story", // story | details
    theme:               localStorage.getItem("theme")               || "cinematic" // cinematic | heritage
  };

  // Ordered variant axis (used by Tell me more/less cycling)
  const VARIANT_ORDER = ["brief", "mid", "long"];

  // ─── NARRATIVE MANAGEMENT ─────────────────────────────────────────────────────
  function setNarrative(narrativeId) {
    state.activeNarrative = narrativeId;
    state.activeLocationIndex = 0;
    localStorage.setItem("activeNarrative", narrativeId);
    localStorage.setItem("activeLocationIndex", "0");
    document.dispatchEvent(new CustomEvent("narrativeChanged", { detail: { narrativeId } }));
  }
  function getNarrative() { return state.activeNarrative; }
  function getNarrativeData() { return APP_DATA.narratives.find(n => n.id === state.activeNarrative); }
  function getLocations() {
    return state.activeNarrative === "espionage"
      ? APP_DATA.espionageLocations
      : APP_DATA.timelineLocations;
  }

  // ─── LOCATION INDEX ──────────────────────────────────────────────────────────
  function setLocationIndex(index) {
    const locs = getLocations();
    state.activeLocationIndex = Math.max(0, Math.min(index, locs.length - 1));
    localStorage.setItem("activeLocationIndex", String(state.activeLocationIndex));
    document.dispatchEvent(new CustomEvent("locationChanged", { detail: { index: state.activeLocationIndex } }));
  }
  function getLocationIndex() { return state.activeLocationIndex; }
  function getActiveLocation() { return getLocations()[state.activeLocationIndex]; }

  // ─── TEXT VARIANT ────────────────────────────────────────────────────────────
  function setTextVariant(variant) {
    if (!VARIANT_ORDER.includes(variant)) return;
    state.textVariant = variant;
    localStorage.setItem("textVariant", variant);
    document.dispatchEvent(new CustomEvent("textVariantChanged", { detail: { variant } }));
  }
  function getTextVariant() { return state.textVariant; }
  function cycleTextVariant(direction) {
    const idx = VARIANT_ORDER.indexOf(state.textVariant);
    const next = Math.max(0, Math.min(VARIANT_ORDER.length - 1, idx + direction));
    if (next !== idx) setTextVariant(VARIANT_ORDER[next]);
  }

  // ─── READING MODE (Play/Details toggle from PDF p.15) ───────────────────────
  function setReadingMode(mode) {
    state.readingMode = mode;
    localStorage.setItem("readingMode", mode);
    document.dispatchEvent(new CustomEvent("readingModeChanged", { detail: { mode } }));
  }
  function getReadingMode() { return state.readingMode; }
  function toggleReadingMode() {
    setReadingMode(state.readingMode === "story" ? "details" : "story");
  }

  // ─── THEME MANAGEMENT ────────────────────────────────────────────────────────
  // Themes are applied by toggling data-theme on <html>. CSS cascades
  // per-theme tokens. Per PDF p.12: themes must differ beyond color —
  // they differ in type family, layout density, and overall look&feel.
  function setTheme(theme) {
    state.theme = theme;
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
    document.dispatchEvent(new CustomEvent("themeChanged", { detail: { theme } }));
  }
  function getTheme() { return state.theme; }
  function applyTheme() { document.documentElement.setAttribute("data-theme", state.theme); }

  // ─── NAVIGATION ──────────────────────────────────────────────────────────────
  function navigateTo(page) { window.location.href = page; }
  function goNext() {
    const locs = getLocations();
    if (state.activeLocationIndex < locs.length - 1) setLocationIndex(state.activeLocationIndex + 1);
  }
  function goPrev() {
    if (state.activeLocationIndex > 0) setLocationIndex(state.activeLocationIndex - 1);
  }

  // Ordered page sequence for site-wide prev/next (PDF p.18 requirement)
  const PAGE_ORDER = ["index.html", "map.html", "explore.html", "about.html", "docs.html", "disclaimer.html"];
  function currentPageName() {
    return window.location.pathname.split("/").pop() || "index.html";
  }
  function getPrevPage() {
    const i = PAGE_ORDER.indexOf(currentPageName());
    return i > 0 ? PAGE_ORDER[i - 1] : null;
  }
  function getNextPage() {
    const i = PAGE_ORDER.indexOf(currentPageName());
    return (i >= 0 && i < PAGE_ORDER.length - 1) ? PAGE_ORDER[i + 1] : null;
  }

  // ─── ACTIVE NAV HIGHLIGHT ────────────────────────────────────────────────────
  function highlightActiveNav() {
    const currentPage = currentPageName();
    document.querySelectorAll(".nav-link").forEach(link => {
      const href = link.getAttribute("href");
      link.classList.toggle("active", !!(href && href.includes(currentPage)));
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

  // ─── SCHEMA.ORG JSON-LD (PDF p.16 RSTU metadata requirement) ─────────────────
  // Injects structured metadata so the project satisfies "Uniform" and
  // "Tailored" metadata goals. Machine-readable, search-engine discoverable.
  function injectJSONLD(id, data) {
    // Remove existing block with the same id if present
    const existing = document.getElementById(id);
    if (existing) existing.remove();
    const s = document.createElement("script");
    s.type = "application/ld+json";
    s.id   = id;
    s.textContent = JSON.stringify(data, null, 2);
    document.head.appendChild(s);
  }

  function siteJSONLD() {
    return {
      "@context": "https://schema.org",
      "@type":    "WebSite",
      "name":     "Istanbul Cinema Tourism — LMML",
      "alternateName": "Istanbul: A Stage of Espionage and Global Conflict",
      "description": "A Live Museum of Movie Locations companion app exploring how Istanbul has been depicted in five international films (From Russia with Love, Topkapi, Taken 2, Skyfall, Inferno). Part of the Information Modeling and Web Technologies course at the University of Bologna.",
      "inLanguage":   "en",
      "creator": {
        "@type": "Person",
        "name":  "Kübra Topçuoğlu",
        "affiliation": {
          "@type": "CollegeOrUniversity",
          "name":  "Università di Bologna",
          "department": "Digital Humanities and Digital Knowledge"
        }
      },
      "about": { "@type": "City", "name": "Istanbul" },
      "educationalUse":   "academic project",
      "license":          "Academic fair use; typographic and layout design © 2026 Kübra Topçuoğlu",
      "dateModified":     "2026"
    };
  }

  // Build Schema.org Place + subjectOf Movie for a location entry.
  // Combines the Place (physical, Schema.org Place) with the CreativeWork
  // that uses it — a Tailored model (PDF p.16) for film-location metadata.
  function locationJSONLD(loc) {
    const filmRec = APP_DATA.films.find(f => f.title === loc.film) || {};
    return {
      "@context": "https://schema.org",
      "@type":    "Place",
      "name":     loc.name,
      "identifier": loc.id,
      "description": loc.texts ? loc.texts.mid : (loc.description || ""),
      "geo": {
        "@type":     "GeoCoordinates",
        "latitude":  loc.coordinates[0],
        "longitude": loc.coordinates[1]
      },
      "image": loc.images && loc.images.primary ? loc.images.primary.src : null,
      "photo": {
        "@type": "Photograph",
        "description": loc.camera ? loc.camera.angleNote : "",
        "additionalProperty": loc.camera ? [
          { "@type": "PropertyValue", "name": "cameraFacing",    "value": loc.camera.facing },
          { "@type": "PropertyValue", "name": "cameraElevation", "value": loc.camera.elevation },
          { "@type": "PropertyValue", "name": "focalLength",     "value": loc.camera.focalLength },
          { "@type": "PropertyValue", "name": "shotType",        "value": loc.camera.shotType }
        ] : []
      },
      "subjectOf": {
        "@type":          "Movie",
        "name":           loc.film,
        "datePublished":  String(loc.year),
        "director": { "@type": "Person", "name": loc.director },
        "sameAs": filmRec.sources ? [
          filmRec.sources.imdb,
          filmRec.sources.wikipedia
        ].filter(Boolean) : []
      }
    };
  }

  // Dataset-level descriptor listing every location the project documents.
  function datasetJSONLD() {
    const allLocs = [...APP_DATA.espionageLocations, ...APP_DATA.timelineLocations];
    return {
      "@context": "https://schema.org",
      "@type":    "Dataset",
      "name":     "Istanbul Film Locations — LMML Dataset",
      "description": "Curated dataset of 15 cinematic locations in Istanbul across two narratives (Espionage & Pursuit; Istanbul Through Time in Cinema).",
      "keywords":    ["Istanbul", "film locations", "cinema tourism", "Digital Humanities", "LMML"],
      "creator":     { "@type": "Person", "name": "Kübra Topçuoğlu" },
      "license":     "Academic fair use — University of Bologna",
      "spatialCoverage": { "@type": "Place", "name": "Istanbul, Turkey" },
      "variableMeasured": [
        "location coordinates", "film reference", "camera orientation",
        "narrative chapter", "text variants (brief/mid/long)"
      ],
      "hasPart": allLocs.map(l => ({
        "@type": "Place",
        "name":  l.name,
        "geo": {
          "@type": "GeoCoordinates",
          "latitude":  l.coordinates[0],
          "longitude": l.coordinates[1]
        }
      }))
    };
  }

  // ─── QR CODE HELPER (PDF p.8 requirement) ────────────────────────────────────
  // Each location requires a QR code "leading to more information".
  // We generate a QR encoding the deep-link URL (explore.html with state).
  // Library: qrcode.js (MIT) loaded via CDN on explore page only.
  function generateLocationQR(container, location) {
    if (!window.QRCode) {
      container.textContent = "QR unavailable";
      return null;
    }
    const deepLink = `${window.location.origin}${window.location.pathname.replace(/[^/]*$/, "")}explore.html?loc=${encodeURIComponent(location.id)}&n=${state.activeNarrative}`;
    container.innerHTML = "";
    return new window.QRCode(container, {
      text:   deepLink,
      width:  112,
      height: 112,
      colorDark:  "#0a0a12",
      colorLight: "#e8ddd0",
      correctLevel: window.QRCode.CorrectLevel.M
    });
  }

  // Parse ?loc= + &n= from URL and set state (used for QR deep-links)
  function consumeDeepLink() {
    const params = new URLSearchParams(window.location.search);
    const locId  = params.get("loc");
    const narrId = params.get("n");
    if (narrId && (narrId === "espionage" || narrId === "timeline")) {
      state.activeNarrative = narrId;
      localStorage.setItem("activeNarrative", narrId);
    }
    if (locId) {
      const locs = getLocations();
      const idx  = locs.findIndex(l => l.id === locId);
      if (idx !== -1) {
        state.activeLocationIndex = idx;
        localStorage.setItem("activeLocationIndex", String(idx));
      }
    }
  }

  // ─── INIT ─────────────────────────────────────────────────────────────────────
  function init() {
    applyTheme();
    // Consume deep-link if present (must run before location rendering)
    consumeDeepLink();
    // Ensure saved index is still valid for current narrative
    const locs = getLocations();
    if (state.activeLocationIndex >= locs.length) {
      state.activeLocationIndex = 0;
      localStorage.setItem("activeLocationIndex", "0");
    }
    highlightActiveNav();
    // Always inject the site-wide JSON-LD on every page.
    injectJSONLD("jsonld-site", siteJSONLD());
  }

  return {
    state,
    // narrative
    setNarrative, getNarrative, getNarrativeData, getLocations,
    // location
    setLocationIndex, getLocationIndex, getActiveLocation,
    // text variants
    setTextVariant, getTextVariant, cycleTextVariant, VARIANT_ORDER,
    // reading mode
    setReadingMode, getReadingMode, toggleReadingMode,
    // theme
    setTheme, getTheme, applyTheme,
    // navigation
    navigateTo, goNext, goPrev, getPrevPage, getNextPage,
    // nav UI
    highlightActiveNav,
    // utilities
    chapterColorClass, formatCoords,
    // JSON-LD
    injectJSONLD, siteJSONLD, locationJSONLD, datasetJSONLD,
    // QR
    generateLocationQR, consumeDeepLink,
    // init
    init
  };

})();

// Apply theme ASAP (before DOM paint) to avoid flash of unstyled theme
(function earlyTheme() {
  const saved = localStorage.getItem("theme") || "cinematic";
  document.documentElement.setAttribute("data-theme", saved);
})();

document.addEventListener("DOMContentLoaded", () => App.init());
