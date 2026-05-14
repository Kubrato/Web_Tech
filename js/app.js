// app.js — shared variables and functions for all pages
// I keep things in localStorage so the choices stay after a reload.
// localStorage is a small storage in the browser. Data stays even after the user closes the tab.


// ----- 1. Read saved choices -----
// If nothing was saved before, I use a default value.
// The OR operator (||) takes the first "truthy" value. If localStorage returns null, we use the default.

// I use different names for the JS variable and the localStorage key.
// The variable is plain camelCase (textVariant). The storage key wraps the
// same name with a "localS_" prefix and a "_key" suffix (localS_textVariant_key).
// This way it is easy to see in the code which name lives "in memory"
// and which name lives "in the browser storage".

var activeNarrative     = localStorage.getItem("localS_activeNarrative_key")     || "pursuit";
// "var" declares a variable. localStorage.getItem reads a saved value (a string). The default is "pursuit".

var activeLocationIndex = parseInt(localStorage.getItem("localS_activeLocationIndex_key") || "0");
// localStorage only stores strings, so we use parseInt to turn it into a number.

var textVariant         = localStorage.getItem("localS_textVariant_key")         || "adult";   // young / adult / scholar
// The audience level for the text. Three options: young, adult, scholar.

var textLength          = localStorage.getItem("localS_textLength_key")          || "medium";  // short / medium
// The text length. Two options: short, medium.

var readingMode         = localStorage.getItem("localS_readingMode_key")         || "story";   // story / details
// The reading mode. Two options: story (narrative text) or details (QR + metadata).

var theme               = localStorage.getItem("localS_theme_key")               || "cinematic"; // cinematic / heritage
// The visual theme. Two options: cinematic, heritage.

// audience levels in order
var VARIANT_ORDER = ["young", "adult", "scholar"];
// An array with the three audience levels. UPPER_CASE name shows this is a constant.


// ----- 2. Narrative (pursuit / timeline) -----
function setNarrative(id) { // the "id" parameter holds the narrative the user clicked ("pursuit" or "timeline" in explore.js) 
// This function changes the active narrative. The parameter "id" is "pursuit" or "timeline".

  activeNarrative = id;
  // Update the variable.

  activeLocationIndex = 0;
  // When we change the narrative, we start at location 0 (the first one).

  localStorage.setItem("localS_activeNarrative_key", id);
  // setItem takes two arguments: the storage key (left) and the value (right).
  // The key here is "localS_activeNarrative_key"; the value is the parameter "id".
  // Save to localStorage so the choice stays after a reload.

  localStorage.setItem("localS_activeLocationIndex_key", "0");
  // Save the index too (it must be a string).

  // tell other parts of the page that the narrative changed
  document.dispatchEvent(new CustomEvent("narrativeChanged"));
  // CustomEvent is a way to send our own events. Other parts of the page listen with addEventListener("narrativeChanged", ...).

}

function getNarrative() {
  return activeNarrative;
  // Just return the current narrative id.
}

function getNarrativeData() {
  // find the narrative object that has this id
  for (var i = 0; i < APP_DATA.narratives.length; i++) {
    // Loop over all narratives in the data file.
    if (APP_DATA.narratives[i].id === activeNarrative) {
    // === is "strict equal": same value AND same type. Safer than ==.
      return APP_DATA.narratives[i];
      // Return the matching narrative object (it has title, chapters, etc.).
    }
  }
}

function getLocations() {
  if (activeNarrative === "pursuit") {
    return APP_DATA.pursuitLocations;
    // Return the array of locations for the pursuit narrative.
  } else {
    return APP_DATA.timelineLocations;
    // Return the array of locations for the timeline narrative.
  }
}


// ----- 3. Active location index -----
function setLocationIndex(i) {
  var locs = getLocations();
  // Get the array of locations for the current narrative.

  // keep the index inside the valid range
  if (i < 0) i = 0;
  // If the index is smaller than 0, set it to 0.
  if (i > locs.length - 1) i = locs.length - 1;
  // If the index is too big, set it to the last position.

  activeLocationIndex = i;
  localStorage.setItem("localS_activeLocationIndex_key", String(i));
  // Save the new index. String() turns the number into a string.

  document.dispatchEvent(new CustomEvent("locationChanged"));
  // Tell other parts of the page that the location changed.
}

function getLocationIndex() {
  return activeLocationIndex;
}

function getActiveLocation() {
  var locs = getLocations();
  return locs[activeLocationIndex];
  // Return the location object at the current index.
}

// ----- 8. Previous / Next location -----
function goNext() {
  var locs = getLocations();
  if (activeLocationIndex < locs.length - 1) {
    // Only go forward if we are not at the last location.
    setLocationIndex(activeLocationIndex + 1);
  }
}

function goPrev() {
  if (activeLocationIndex > 0) {
    // Only go back if we are not at the first location.
    setLocationIndex(activeLocationIndex - 1);
  }
}

// ----- 4. Text variant (Young / Adult / Scholar) -----
function setTextVariant(v) {
  // only accept valid values
  if (v !== "young" && v !== "adult" && v !== "scholar") return;
  // If the value is not one of the three valid ones, exit the function.

  textVariant = v;
  localStorage.setItem("localS_textVariant_key", v);
  document.dispatchEvent(new CustomEvent("textVariantChanged"));
  // Send a custom event.
}

function getTextVariant() {
  return textVariant;
}

// "Too simple" button: go one step harder
function nudgeVariantHarder() {//ilk başta bu explore sayfasındaki to simple butona tıklayınca bu fonksiyon triggerlanıyor.
  if (textVariant === "young")  setTextVariant("adult"); //burası text vari
  else if (textVariant === "adult") setTextVariant("scholar"); 
  //ilk kez başlanıyorsa textVariat burada adult olur.
  //var textVariant = localStorage.getItem("localS_textVariant_key")         || "adult";
  //çünkü local storage localstarage.getItem tuttuğu keydan bir şey dönmez ve adult olur.
  //steTextVariant fonksiyonun aldığı v variablenı scholar yap der.
  //böylelikle textVariantChanged triggerlanmış olur.
  //If we are already at scholar, do nothing (no else branch).
}

// "Too difficult" button: go one step easier
function nudgeVariantEasier() {
  if (textVariant === "scholar") setTextVariant("adult");
  else if (textVariant === "adult") setTextVariant("young");
  // If we are already at young, do nothing.
}


// ----- 5. Text length (short / medium) -----
function setTextLength(len) {
  if (len !== "short" && len !== "medium") return;
  // Only accept "short" or "medium".

  textLength = len;
  localStorage.setItem("localS_textLength_key", len);
  document.dispatchEvent(new CustomEvent("textLengthChanged"));
}

function getTextLength() {
  return textLength;
}

function tellMeMore() { setTextLength("medium"); }
// Short helper: switch to the longer text.
function tellMeLess() { setTextLength("short"); }
// Short helper: switch to the shorter text.


// ----- 6. Reading mode (story / details) -----
function setReadingMode(mode) {
  if (mode !== "story" && mode !== "details") return;
  // Only accept "story" or "details".

  readingMode = mode;
  localStorage.setItem("localS_readingMode_key", mode);
  document.dispatchEvent(new CustomEvent("readingModeChanged"));
}

function getReadingMode() {
  return readingMode;
}


// ----- 7. Theme (cinematic / heritage) -----
// I just put a data-theme attribute on <html> and the CSS does the rest.
function setTheme(t) {
  theme = t;
  localStorage.setItem("localS_theme_key", t);
  document.documentElement.setAttribute("data-theme", t);
  // document.documentElement is the <html> element. We set data-theme="cinematic" or "heritage". The CSS uses [data-theme="..."] to change colors.
}

function getTheme() {
  return theme;
}

function applyTheme() {
  document.documentElement.setAttribute("data-theme", theme);
  // Set the data-theme attribute again (used after page reload, for example).
}


// ----- 9. Highlight the current page in the top nav -----
function highlightActiveNav() {
  // get the current file name from the URL
  var path = window.location.pathname;
  // pathname is like "/folder/index.html". window.location is the URL object.

  var pageName = path.split("/").pop();
  // split("/") cuts the path by "/" into an array. pop() returns the last item. So we get "index.html".

  if (!pageName) pageName = "index.html";
  // If the path ends with "/", pageName is empty. Default to index.html.

  var links = document.querySelectorAll(".nav-link");
  // Get all the menu links.

  for (var i = 0; i < links.length; i++) {
    var href = links[i].getAttribute("href");
    // Read the href attribute of each link.

    if (href && href.indexOf(pageName) !== -1) {
    // indexOf returns -1 if the text is not found. !== -1 means "found".
      links[i].classList.add("active");
      // Add the "active" class to the matching link.
    } else {
      links[i].classList.remove("active");
      // Remove it from the others.
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
  // The four pursuit chapters.

  if (chapter === "1960s")         return "chapter-1960s";
  if (chapter === "2012")          return "chapter-2012";
  if (chapter === "2014")          return "chapter-2014";
  if (chapter === "2016")          return "chapter-2016";
  // The four timeline eras.

  return "chapter-default";
  // Fallback if the chapter is unknown.
}

// turn a [lat, lon] into a nice string
function formatCoords(coords) {
  if (!coords) return "";
  // If coords is null/undefined, return an empty string.

  return coords[0].toFixed(4) + "°N, " + coords[1].toFixed(4) + "°E";
  // toFixed(4) rounds the number to 4 decimal places and returns a string. Example: "41.0086°N, 28.9802°E".
}


// ----- 11. QR code (uses a free public API) -----
function generateLocationQR(container, location) {
// container = the HTML element where we put the QR image.
// location = the location object.

  // find a Wikipedia link in the metadata sources
  var url = null;
  if (location.meta && location.meta.sources) {
  // Defensive check: make sure meta and sources exist before we read them.

    for (var i = 0; i < location.meta.sources.length; i++) {
      var s = location.meta.sources[i];
      if (s.label && s.label.toLowerCase().indexOf("wikipedia") !== -1) {
      // toLowerCase() so "Wikipedia" and "WIKIPEDIA" both match.
        url = s.url;
        break;
        // break exits the for loop once we found one.
      }
    }
    // if no wikipedia, just use the first source
    if (!url && location.meta.sources[0]) {
      url = location.meta.sources[0].url;
    }
  }

  if (!url) {
    container.textContent = "Wikipedia link unavailable";
    // textContent sets text safely (no HTML parsing). If there is no link, show this message.
    return;
  }

  // build the QR image URL
  var qrSrc = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" + encodeURIComponent(url);
  // encodeURIComponent makes the URL safe (special characters become %XX).

  container.innerHTML =
    '<a href="' + url + '" target="_blank" rel="noopener noreferrer">' +
      '<img src="' + qrSrc + '" alt="QR code for ' + location.name + '" width="112" height="112">' +
    '</a>';
  // Build the HTML: a link that opens in a new tab + an image inside it.
  // target="_blank" opens in new tab. rel="noopener noreferrer" is for security.
}


// ----- 12. Group everything into a single App object -----
// other files use App.setNarrative, App.getLocations, etc.
var App = {
// This is a JavaScript object. The keys (left side) are names; the values (right side) are functions.

  setNarrative:        setNarrative,
  getNarrative:        getNarrative,
  getNarrativeData:    getNarrativeData,
  getLocations:        getLocations,

  setLocationIndex:    setLocationIndex,
  getLocationIndex:    getLocationIndex,
  getActiveLocation:   getActiveLocation,

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
// Now App is a global object. Other files (explore.js, map.js, inline scripts) call App.setTheme(...), App.getLocations(), etc.


// ----- 13. Apply the saved theme as soon as possible -----
// I do this immediately (before DOMContentLoaded) so the page does not
// flash with the wrong theme colours on load.
document.documentElement.setAttribute("data-theme", theme);
// Important: this runs at the top level (not inside any function), so it runs as soon as app.js is loaded. The <html> tag exists at this point even if the rest of the body is not loaded yet.


// ----- 14. When the page is ready, do the basic setup -----
document.addEventListener("DOMContentLoaded", function() {
// DOMContentLoaded fires when the HTML is fully parsed (images do not need to be loaded).

  // make sure the saved index is still inside the current narrative range
  var locs = getLocations();
  if (activeLocationIndex >= locs.length) {
    // If a saved index is too big for the new narrative (for example, the user changed narrative), reset to 0.
    activeLocationIndex = 0;
    localStorage.setItem("localS_activeLocationIndex_key", "0");
  }
  highlightActiveNav();
  // Highlight the current page in the top menu.
});
