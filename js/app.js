// app.js — shared variables and functions for all pages
// I keep things in localStorage so the choices stay after a reload.


// ----- 1. Read saved choices -----
// If nothing was saved before, I use a default value.

var activeNarrative     = localStorage.getItem("activeNarrative")     || "pursuit";
var activeLocationIndex = parseInt(localStorage.getItem("activeLocationIndex") || "0");
var textVariant         = localStorage.getItem("textVariant")         || "adult";   // young / adult / scholar
var textLength          = localStorage.getItem("textLength")          || "medium";  // short / medium
var readingMode         = localStorage.getItem("readingMode")         || "story";   // story / details
var theme               = localStorage.getItem("theme")               || "cinematic"; // cinematic / heritage

// audience levels in order
var VARIANT_ORDER = ["young", "adult", "scholar"];


// ----- 2. Narrative (pursuit / timeline) -----
function setNarrative(id) {
  activeNarrative = id;
  activeLocationIndex = 0;
  localStorage.setItem("activeNarrative", id);
  localStorage.setItem("activeLocationIndex", "0");
  // tell other parts of the page that the narrative changed
  document.dispatchEvent(new CustomEvent("narrativeChanged"));
}

function getNarrative() {
  return activeNarrative;
}

function getNarrativeData() {
  // find the narrative object that has this id
  for (var i = 0; i < APP_DATA.narratives.length; i++) {
    if (APP_DATA.narratives[i].id === activeNarrative) {
      return APP_DATA.narratives[i];
    }
  }
}

function getLocations() {
  if (activeNarrative === "pursuit") {
    return APP_DATA.pursuitLocations;
  } else {
    return APP_DATA.timelineLocations;
  }
}


// ----- 3. Active location index -----
function setLocationIndex(i) {
  var locs = getLocations();
  // keep the index inside the valid range
  if (i < 0) i = 0;
  if (i > locs.length - 1) i = locs.length - 1;
  activeLocationIndex = i;
  localStorage.setItem("activeLocationIndex", String(i));
  document.dispatchEvent(new CustomEvent("locationChanged"));
}

function getLocationIndex() {
  return activeLocationIndex;
}

function getActiveLocation() {
  var locs = getLocations();
  return locs[activeLocationIndex];
}


// ----- 4. Text variant (Young / Adult / Scholar) -----
function setTextVariant(v) {
  // only accept valid values
  if (v !== "young" && v !== "adult" && v !== "scholar") return;
  textVariant = v;
  localStorage.setItem("textVariant", v);
  document.dispatchEvent(new CustomEvent("textVariantChanged"));
}

function getTextVariant() {
  return textVariant;
}

// "Too simple" button: go one step harder
function nudgeVariantHarder() {
  if (textVariant === "young")  setTextVariant("adult");
  else if (textVariant === "adult") setTextVariant("scholar");
}

// "Too difficult" button: go one step easier
function nudgeVariantEasier() {
  if (textVariant === "scholar") setTextVariant("adult");
  else if (textVariant === "adult") setTextVariant("young");
}


// ----- 5. Text length (short / medium) -----
function setTextLength(len) {
  if (len !== "short" && len !== "medium") return;
  textLength = len;
  localStorage.setItem("textLength", len);
  document.dispatchEvent(new CustomEvent("textLengthChanged"));
}

function getTextLength() {
  return textLength;
}

function tellMeMore() { setTextLength("medium"); }
function tellMeLess() { setTextLength("short"); }


// ----- 6. Reading mode (story / details) -----
function setReadingMode(mode) {
  if (mode !== "story" && mode !== "details") return;
  readingMode = mode;
  localStorage.setItem("readingMode", mode);
  document.dispatchEvent(new CustomEvent("readingModeChanged"));
}

function getReadingMode() {
  return readingMode;
}


// ----- 7. Theme (cinematic / heritage) -----
// I just put a data-theme attribute on <html> and the CSS does the rest.
function setTheme(t) {
  theme = t;
  localStorage.setItem("theme", t);
  document.documentElement.setAttribute("data-theme", t);
}

function getTheme() {
  return theme;
}

function applyTheme() {
  document.documentElement.setAttribute("data-theme", theme);
}


// ----- 8. Previous / Next location -----
function goNext() {
  var locs = getLocations();
  if (activeLocationIndex < locs.length - 1) {
    setLocationIndex(activeLocationIndex + 1);
  }
}

function goPrev() {
  if (activeLocationIndex > 0) {
    setLocationIndex(activeLocationIndex - 1);
  }
}


// ----- 9. Highlight the current page in the top nav -----
function highlightActiveNav() {
  // get the current file name from the URL
  var path = window.location.pathname;
  var pageName = path.split("/").pop();
  if (!pageName) pageName = "index.html";

  var links = document.querySelectorAll(".nav-link");
  for (var i = 0; i < links.length; i++) {
    var href = links[i].getAttribute("href");
    if (href && href.indexOf(pageName) !== -1) {
      links[i].classList.add("active");
    } else {
      links[i].classList.remove("active");
    }
  }
}


// ----- 10. Helpers -----

// returns a CSS class name based on the chapter
function chapterColorClass(chapter) {
  if (chapter === "Surveillance")  return "chapter-surveillance";
  if (chapter === "The Chase")     return "chapter-chase";
  if (chapter === "The Search")    return "chapter-search";
  if (chapter === "Confrontation") return "chapter-confrontation";
  if (chapter === "1960s")         return "chapter-1960s";
  if (chapter === "2012")          return "chapter-2012";
  if (chapter === "2014")          return "chapter-2014";
  if (chapter === "2016")          return "chapter-2016";
  return "chapter-default";
}

// turn a [lat, lon] into a nice string
function formatCoords(coords) {
  if (!coords) return "";
  return coords[0].toFixed(4) + "°N, " + coords[1].toFixed(4) + "°E";
}


// ----- 11. QR code (uses a free public API) -----
function generateLocationQR(container, location) {
  // find a Wikipedia link in the metadata sources
  var url = null;
  if (location.meta && location.meta.sources) {
    for (var i = 0; i < location.meta.sources.length; i++) {
      var s = location.meta.sources[i];
      if (s.label && s.label.toLowerCase().indexOf("wikipedia") !== -1) {
        url = s.url;
        break;
      }
    }
    // if no wikipedia, just use the first source
    if (!url && location.meta.sources[0]) {
      url = location.meta.sources[0].url;
    }
  }

  if (!url) {
    container.textContent = "Wikipedia link unavailable";
    return;
  }

  // build the QR image URL
  var qrSrc = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" + encodeURIComponent(url);
  container.innerHTML =
    '<a href="' + url + '" target="_blank" rel="noopener noreferrer">' +
      '<img src="' + qrSrc + '" alt="QR code for ' + location.name + '" width="112" height="112">' +
    '</a>';
}


// ----- 12. Group everything into a single App object -----
// other files use App.setNarrative, App.getLocations, etc.
var App = {
  setNarrative:        setNarrative,
  getNarrative:        getNarrative,
  getNarrativeData:    getNarrativeData,
  getLocations:        getLocations,

  setLocationIndex:    setLocationIndex,
  getLocationIndex:    getLocationIndex,
  getActiveLocation:   getActiveLocation,

  setTextVariant:      setTextVariant,
  getTextVariant:      getTextVariant,
  VARIANT_ORDER:       VARIANT_ORDER,
  nudgeVariantHarder:  nudgeVariantHarder,
  nudgeVariantEasier:  nudgeVariantEasier,

  setTextLength:       setTextLength,
  getTextLength:       getTextLength,
  tellMeMore:          tellMeMore,
  tellMeLess:          tellMeLess,

  setReadingMode:      setReadingMode,
  getReadingMode:      getReadingMode,

  setTheme:            setTheme,
  getTheme:            getTheme,
  applyTheme:          applyTheme,

  goNext:              goNext,
  goPrev:              goPrev,

  highlightActiveNav:  highlightActiveNav,
  chapterColorClass:   chapterColorClass,
  formatCoords:        formatCoords,
  generateLocationQR:  generateLocationQR
};


// ----- 13. Apply the saved theme as soon as possible -----
// I do this immediately (before DOMContentLoaded) so the page does not
// flash with the wrong theme colours on load.
document.documentElement.setAttribute("data-theme", theme);


// ----- 14. When the page is ready, do the basic setup -----
document.addEventListener("DOMContentLoaded", function() {
  // make sure the saved index is still inside the current narrative range
  var locs = getLocations();
  if (activeLocationIndex >= locs.length) {
    activeLocationIndex = 0;
    localStorage.setItem("activeLocationIndex", "0");
  }
  highlightActiveNav();
});
