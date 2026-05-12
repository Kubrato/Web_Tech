// explore.js — code for the Explore page
// I wait until the page is ready, then set everything up.

document.addEventListener("DOMContentLoaded", function() {
// All the code below runs only after the HTML is fully parsed.

  // ===== 1. Get all the page elements I need =====
  // I just grab everything once at the start so I can use them later.
  // It is faster than calling getElementById again and again.

  var toggleEspionage    = document.getElementById("toggleEspionage");
  // The "Pursuit & Passage" toggle button.
  var toggleTimeline     = document.getElementById("toggleTimeline");
  // The "Through Time" toggle button.

  var chapterStrip          = document.getElementById("chapterStrip");
  // The strip of chapter buttons at the top.
  var chapterIntroBanner    = document.getElementById("chapterIntroBanner");
  // The banner that shows when you enter a new chapter.
  var chapterIntroChap      = document.getElementById("chapterIntroChapter");
  // The chapter name inside the banner.
  var chapterIntroText      = document.getElementById("chapterIntroText");
  // The chapter intro text inside the banner.
  var chapterTransitionLine = document.getElementById("chapterTransitionLine");
  // The transition line shown between two chapters.
  var chapterTransitionText = document.getElementById("chapterTransitionText");
  // The text of the transition line.
  var locationDirections    = document.getElementById("locationDirections");
  // The "Walk to next" directions area.

  var btnPrev          = document.getElementById("btnPrev");
  // Previous location button.
  var btnNext          = document.getElementById("btnNext");
  // Next location button.
  var progressText     = document.getElementById("progressText");
  // The "X / Y" text in the progress bar area.
  var progressFill     = document.getElementById("progressFill");
  // The coloured fill inside the progress bar.
  var counterFraction  = document.getElementById("counterFraction");
  // The "X / Y" text near the navigation buttons.

  // location display
  var locationImagePlaceholder = document.getElementById("locationImagePlaceholder");
  // The container around the image.
  var locationImageEl          = document.getElementById("locationImage");
  // The <img> element for the location.
  var locationImageIcon        = document.getElementById("locationImageIcon");
  // The fallback icon (shown when there is no image).
  var locationFilmTag          = document.getElementById("locationFilmTag");
  // The film label in the top-left corner.
  var locationTypeTag          = document.getElementById("locationTypeTag");
  // The media-type label (Film Still / Real Location / Video) in the bottom-right corner.
  var locationName             = document.getElementById("locationName");
  // The h1 with the location name.
  var locationScene            = document.getElementById("locationScene");
  // The scene context line under the name.
  var locationChapterBadge     = document.getElementById("locationChapterBadge");
  // The chapter badge.

  // image gallery
  var galleryNav     = document.getElementById("galleryNav");
  // The container with prev/next arrow buttons + counter.
  var galleryPrev    = document.getElementById("galleryPrev");
  // The ← arrow button.
  var galleryNext    = document.getElementById("galleryNext");
  // The → arrow button.
  var galleryCounter = document.getElementById("galleryCounter");
  // The "1 / 4" counter between the arrows.
  var galleryCaption = document.getElementById("galleryCaption");
  // The caption under the gallery.
  var galleryItems   = [];
  // Flat list of all media for the current location, in order: film stills, real-location photos, then videos.
  var galleryIndex   = 0;
  // Position in galleryItems. The arrow buttons move this index.

  // narrative panel
  var narrativeQuote     = document.getElementById("narrativeQuote");
  // The blockquote element.
  var narrativeBody      = document.getElementById("narrativeBody");
  // The main narrative paragraph.
  var narrativeNoteBlock = document.getElementById("narrativeNoteBlock");
  // The "Narrative Note" box.
  var narrativeNoteText  = document.getElementById("narrativeNoteText");
  // The text inside the note box.

  // audience / length / mode buttons
  var btnModeStory     = document.getElementById("btnModeStory");
  // "Story" mode button.
  var btnModeDetails   = document.getElementById("btnModeDetails");
  // "Details & QR" mode button.
  var variantIndicator = document.getElementById("variantIndicator");
  // The label that shows the current audience (Young / Adult / Scholar).
  var btnLenLess       = document.getElementById("btnLenLess");
  // "Tell me less" button.
  var btnLenMore       = document.getElementById("btnLenMore");
  // "Tell me more" button.
  var lengthIndicator  = document.getElementById("lengthIndicator");
  // The label that shows the current length (BRIEF / STANDARD).
  var btnEasier        = document.getElementById("btnEasier");
  // "Too difficult" button (steps down).
  var btnHarder        = document.getElementById("btnHarder");
  // "Too simple" button (steps up).

  // details panel
  var detailsPanel = document.getElementById("detailsPanel");
  // The big details panel (hidden by default).
  var detailsQRBox = document.getElementById("detailsQRBox");
  // The QR code container.
  var camFacing    = document.getElementById("camFacing");
  var camElevation = document.getElementById("camElevation");
  var camFocal     = document.getElementById("camFocal");
  var camShotType  = document.getElementById("camShotType");
  var camNote      = document.getElementById("camNote");
  // Camera info cells.

  // metadata table
  var metaBlock     = document.getElementById("metaBlock");
  // The whole metadata block.
  var metaTableBody = document.getElementById("metaTableBody");
  // The <tbody> where the rows go.
  var metaSources   = document.getElementById("metaSources");
  // The sources footnote under the table.


  // ===== 2. Icon and colour for each chapter =====
  // I use a simple object as a lookup table.
  // An object in JavaScript is like a dictionary: key -> value.

  var chapterIcons = {
    "Surveillance":  "◎",
    "The Chase":     "↗",
    "The Search":    "✧",
    "Confrontation": "✦",
    // Pursuit chapter icons.
    "1960s":         "◇",
    "2012":          "◆",
    "2014":          "◈",
    "2016":          "◉"
    // Timeline era icons.
  };

  var chapterColorMap = {
    "Surveillance":  "rgba(74,139,181,0.15)",
    "The Chase":     "rgba(154,106,42,0.15)",
    "The Search":    "rgba(106,58,122,0.15)",
    "Confrontation": "rgba(154,53,53,0.15)",
    // rgba(R, G, B, alpha) — alpha is transparency (0 = invisible, 1 = solid).
    "1960s":         "rgba(90,138,90,0.15)",
    "2012":          "rgba(74,139,181,0.15)",
    "2014":          "rgba(176,106,106,0.15)",
    "2016":          "rgba(201,165,90,0.15)"
  };


  // ===== 3. Narrative toggle (Pursuit / Timeline) =====
  function updateNarrativeToggle() {
  // This function makes sure the right toggle button looks active.
    var id = App.getNarrative();
    // Get the current narrative id.

    if (id === "pursuit") {
      toggleEspionage.classList.add("active");
      toggleTimeline.classList.remove("active");
    } else {
      toggleEspionage.classList.remove("active");
      toggleTimeline.classList.add("active");
    }
  }

  toggleEspionage.addEventListener("click", function() {
    if (App.getNarrative() !== "pursuit") App.setNarrative("pursuit");
    // Only change if it is not already "pursuit". This avoids extra work.
  });
  toggleTimeline.addEventListener("click", function() {
    if (App.getNarrative() !== "timeline") App.setNarrative("timeline");
  });


  // ===== 4. Chapter strip (the row of chapter buttons on top) =====
  function buildChapterStrip() {
    chapterStrip.innerHTML = "";
    // Remove any old content from the strip.
    var locs = App.getLocations();

    // get the list of chapters in the order they appear
    var chapters = [];
    for (var i = 0; i < locs.length; i++) {
      var c = locs[i].chapter;
      if (c && chapters.indexOf(c) === -1) {
      // Add the chapter to the list only if it is not already there. This removes duplicates while keeping the order.
        chapters.push(c);
      }
    }

    for (var j = 0; j < chapters.length; j++) {
      var chapter = chapters[j];

      // add a "/" between chapters (but not before the first)
      if (j > 0) {
        var sep = document.createElement("span");
        sep.className = "chapter-strip-sep";
        sep.textContent = "/";
        chapterStrip.appendChild(sep);
      }

      var item = document.createElement("button");
      item.className = "chapter-strip-item";
      var icon = chapterIcons[chapter] || "·";
      // Look up the icon. If the chapter is unknown, use a dot.
      item.textContent = icon + " " + chapter;
      item.setAttribute("data-chapter", chapter);
      // Save the chapter name in a data attribute for the click handler.

      // when clicked, jump to the first location of this chapter
      item.addEventListener("click", goToChapter);
      chapterStrip.appendChild(item);
    }
  }

  // helper for chapter button click
  function goToChapter(e) {
    var chapter = e.currentTarget.getAttribute("data-chapter");
    // Read the chapter name from data-chapter.
    var locs = App.getLocations();
    for (var i = 0; i < locs.length; i++) {
      if (locs[i].chapter === chapter) {
        App.setLocationIndex(i);
        // Jump to the first location of that chapter.
        return;
      }
    }
  }

  function updateChapterStrip() {
  // Mark the active chapter visually.
    var current = App.getActiveLocation();
    var items = document.querySelectorAll(".chapter-strip-item");
    for (var i = 0; i < items.length; i++) {
      if (current && items[i].getAttribute("data-chapter") === current.chapter) {
        items[i].classList.add("active");
      } else {
        items[i].classList.remove("active");
      }
    }
  }

  // Show the chapter intro banner only on the first location of a chapter.
  // If we are entering a new chapter, also show the transition line.
  function updateChapterIntro() {
    var loc  = App.getActiveLocation();
    var locs = App.getLocations();
    var idx  = App.getLocationIndex();

    var isFirstOfChapter = (idx === 0) || (locs[idx - 1].chapter !== loc.chapter);
    // First location overall, OR the previous location was in a different chapter.

    var narrative   = App.getNarrativeData();
    var intros      = narrative.chapterIntros      || {};
    var transitions = narrative.chapterTransitions || {};
    // Default to empty objects so we can safely access keys later.

    if (isFirstOfChapter && intros[loc.chapter]) {
      chapterIntroChap.textContent = loc.chapter;
      chapterIntroText.textContent = intros[loc.chapter];

      // transition only when there is a previous chapter
      if (idx > 0 && transitions[loc.chapter]) {
        chapterTransitionText.textContent = transitions[loc.chapter];
        chapterTransitionLine.classList.remove("hidden");
      } else {
        chapterTransitionLine.classList.add("hidden");
      }

      chapterIntroBanner.classList.remove("hidden");
    } else {
      chapterIntroBanner.classList.add("hidden");
      chapterTransitionLine.classList.add("hidden");
    }
  }


  // ===== 5. Walking direction to next location =====
  // The text for each step is written by hand in data.js (loc.nextDirection).
  function updateDirections() {
    if (!locationDirections) return;
    // Defensive: stop if the element is missing.

    var loc = App.getActiveLocation();

    if (!loc || !loc.nextDirection) {
      locationDirections.textContent = "";
      locationDirections.classList.add("hidden");
      return;
      // No direction for this location (e.g. the last one). Hide the line.
    }

    locationDirections.classList.remove("hidden");
    locationDirections.innerHTML =
      '<span class="directions-label">Walk to next</span> ' +
      '<span class="directions-arrow">→</span> ' +
      loc.nextDirection;
  }


  // ===== 6. Progress bar + prev/next buttons =====
  function updateProgress() {
    var locs = App.getLocations();
    var idx  = App.getLocationIndex();
    var pct  = ((idx + 1) / locs.length) * 100;
    // Calculate the percentage. We use idx+1 because indexes start at 0.

    progressFill.style.width = pct + "%";
    // Set the CSS width of the fill bar.

    progressText.textContent    = (idx + 1) + " / " + locs.length;
    counterFraction.textContent = (idx + 1) + " / " + locs.length;
    // Show "5 / 12" style text in two places.
  }

  function updateNavButtons() {
    var locs = App.getLocations();
    var idx  = App.getLocationIndex();
    btnPrev.disabled = idx <= 0;
    // Disable "Previous" if we are at the first location.
    btnNext.disabled = idx >= locs.length - 1;
    // Disable "Next" if we are at the last one.
  }

  btnPrev.addEventListener("click", function() { App.goPrev(); });
  btnNext.addEventListener("click", function() { App.goNext(); });


  // ===== 7. Audience, length and reading-mode buttons =====
  if (btnEasier) btnEasier.addEventListener("click", function() { App.nudgeVariantEasier(); });
  if (btnHarder) btnHarder.addEventListener("click", function() { App.nudgeVariantHarder(); });
  // The "if (btnEasier)" check is defensive: it makes sure the button exists before we attach a listener.

  if (btnLenLess) btnLenLess.addEventListener("click", function() { App.tellMeLess(); });
  if (btnLenMore) btnLenMore.addEventListener("click", function() { App.tellMeMore(); });

  btnModeStory.addEventListener("click",   function() { App.setReadingMode("story"); });
  btnModeDetails.addEventListener("click", function() { App.setReadingMode("details"); });

  // close button on the details panel
  var detailsCloseBtn = document.getElementById("detailsCloseBtn");
  if (detailsCloseBtn) {
    detailsCloseBtn.addEventListener("click", function() {
      App.setReadingMode("story");
      // Clicking × goes back to story mode.
    });
  }

  function updateVariantUI() {
  // Update all the buttons + indicators to match the current state.
    var v      = App.getTextVariant();
    var length = App.getTextLength();
    var mode   = App.getReadingMode();

    // audience indicator label
    if (v === "young")        variantIndicator.textContent = "Young";
    else if (v === "adult")   variantIndicator.textContent = "Adult";
    else if (v === "scholar") variantIndicator.textContent = "Scholar";

    // disable buttons at the ends of the audience range
    if (btnEasier) btnEasier.disabled = (v === "young");
    // Cannot go easier than "young".
    if (btnHarder) btnHarder.disabled = (v === "scholar");
    // Cannot go harder than "scholar".

    // length indicator + buttons
    if (lengthIndicator) {
      lengthIndicator.textContent = (length === "short") ? "BRIEF" : "STANDARD";
      // Ternary: "short" -> "BRIEF", otherwise "STANDARD".
    }
    if (btnLenLess) {
      if (length === "short") {
        btnLenLess.classList.add("active");
      } else {
        btnLenLess.classList.remove("active");
      }
    }
    if (btnLenMore) {
      if (length === "medium") {
        btnLenMore.classList.add("active");
      } else {
        btnLenMore.classList.remove("active");
      }
    }

    // mode buttons
    if (mode === "story") {
      btnModeStory.classList.add("active");
      btnModeDetails.classList.remove("active");
    } else {
      btnModeStory.classList.remove("active");
      btnModeDetails.classList.add("active");
    }

    // show/hide the details panel
    if (mode === "details") {
      detailsPanel.classList.remove("hidden");
    } else {
      detailsPanel.classList.add("hidden");
    }
  }


  // ===== 8. Image gallery =====
  // All media (film stills + real-location photos + videos) is flattened into
  // one list. The user steps through it with the ← → buttons. A small badge
  // in the bottom-right corner of the image says what type the current item is.

  // Remove the YouTube iframe so the audio stops when leaving a video item.
  function clearVideoFrame() {
    var placeholder = locationImageEl && locationImageEl.parentNode;
    // && short-circuit: if locationImageEl is null, do not try to access parentNode.
    if (!placeholder) return;
    var existing = placeholder.querySelector(".location-video");
    if (existing) existing.remove();
    // Remove the iframe from the DOM. This also stops the YouTube audio.
  }

  // Build the flat media list for a location. Each entry carries its type
  // label so we can show it in the corner badge without extra lookups.
  function buildGalleryItems(loc) {
    var items = [];
    if (!loc || !loc.images) return items;

    var filmImgs = loc.images.film     || [];
    var locImgs  = loc.images.location || [];
    var videos   = loc.images.video    || [];
    // || [] fallback: if the array is missing, use an empty one.

    for (var i = 0; i < filmImgs.length; i++) {
      items.push({ kind: "image", label: "Film Still",    data: filmImgs[i] });
    }
    for (var j = 0; j < locImgs.length; j++) {
      items.push({ kind: "image", label: "Real Location", data: locImgs[j] });
    }
    for (var k = 0; k < videos.length; k++) {
      items.push({ kind: "video", label: "Video",         data: videos[k] });
    }
    return items;
  }

  function renderGallery(loc) {
    galleryItems = buildGalleryItems(loc);

    if (galleryItems.length === 0) {
    // No media at all: clear everything and hide the nav.
      galleryCaption.textContent = "";
      locationImageEl.style.display = "none";
      locationTypeTag.textContent = "";
      locationTypeTag.style.display = "none";
      galleryNav.style.display = "none";
      clearVideoFrame();
      return;
    }

    if (galleryIndex >= galleryItems.length) galleryIndex = 0;
    // Stay in range when the new location has fewer items.

    // Show the nav only when there is more than one item to step through.
    galleryNav.style.display = (galleryItems.length > 1) ? "flex" : "none";
    galleryCounter.textContent = (galleryIndex + 1) + " / " + galleryItems.length;

    var current = galleryItems[galleryIndex];
    locationTypeTag.textContent = current.label;
    locationTypeTag.style.display = "block";

    if (current.kind === "video") {
      renderVideoItem(loc, current.data);
    } else {
      renderImageItem(loc, current.data);
    }
  }

  function renderImageItem(loc, img) {
    clearVideoFrame();
    // Make sure no leftover video frame is around.

    locationImageEl.src = img.src;
    locationImageEl.alt = img.alt || loc.name;
    // Set the src and alt. If alt is missing, use the location name (for accessibility).

    locationImageEl.onload  = function() { locationImageEl.style.display = "block"; };
    locationImageEl.onerror = function() { locationImageEl.style.display = "none"; };

    galleryCaption.textContent = img.caption || "";
  }

  function renderVideoItem(loc, video) {
    // hide the still image, then build (or reuse) the iframe
    locationImageEl.style.display = "none";
    var placeholder = locationImageEl.parentNode;
    var frame = placeholder.querySelector(".location-video");
    if (!frame) {
    // No frame yet — create it.
      frame = document.createElement("iframe");
      frame.className = "location-video";
      frame.setAttribute("allow", "accelerometer; encrypted-media; picture-in-picture");
      // "allow" lists which browser features the iframe is allowed to use.
      frame.setAttribute("allowfullscreen", "");
      frame.setAttribute("loading", "lazy");
      // Lazy-load the iframe — better performance.
      placeholder.appendChild(frame);
    }
    var newSrc = "https://www.youtube.com/embed/" + encodeURIComponent(video.youtubeId) + "?rel=0&modestbranding=1";
    if (frame.src !== newSrc) frame.src = newSrc;
    // Only change src if it is different (avoids restarting the video).
    frame.title = video.title || (loc.name + " — video");

    // caption + a fallback link in case the embed gets blocked
    var watchUrl = "https://www.youtube.com/watch?v=" + encodeURIComponent(video.youtubeId);
    galleryCaption.innerHTML = "";
    if (video.caption) {
      galleryCaption.appendChild(document.createTextNode(video.caption + " "));
      // createTextNode is a safe way to add plain text (no HTML).
    }
    var link = document.createElement("a");
    link.href = watchUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.className = "gallery-video-link";
    link.textContent = "Open on YouTube ↗";
    galleryCaption.appendChild(link);
  }

  // ← / → button wiring. Both wrap around the ends of the list.
  galleryPrev.addEventListener("click", function() {
    if (galleryItems.length === 0) return;
    galleryIndex = (galleryIndex - 1 + galleryItems.length) % galleryItems.length;
    // Add length before % so the result stays positive (JS modulo of a negative is negative).
    renderGallery(App.getActiveLocation());
  });
  galleryNext.addEventListener("click", function() {
    if (galleryItems.length === 0) return;
    galleryIndex = (galleryIndex + 1) % galleryItems.length;
    renderGallery(App.getActiveLocation());
  });


  // ===== 9. Pick the right text version =====
  // Six versions per location (3 audiences × 2 lengths). If the short
  // version is missing, I use the medium one as a fallback.
  function pickText(loc) {
    var audience = App.getTextVariant();
    var length   = App.getTextLength();
    var longTexts  = loc.texts || {};
    var shortTexts = loc.textsShort || {};

    if (length === "short" && shortTexts[audience]) {
      return shortTexts[audience];
      // Return the short version if it exists.
    }
    return longTexts[audience] || longTexts.adult || loc.description || "";
    // Fallback chain: requested audience -> adult -> description -> empty string.
  }


  // ===== 10. Details panel (camera + QR + metadata table) =====
  function renderDetailsPanel(loc) {
    // camera info
    if (loc.camera) {
      camFacing.textContent    = loc.camera.facing      || "—";
      camElevation.textContent = loc.camera.elevation   || "—";
      camFocal.textContent     = loc.camera.focalLength || "—";
      camShotType.textContent  = loc.camera.shotType    || "—";
      camNote.textContent      = loc.camera.angleNote   || "";
      // "—" is an em-dash, shown when the value is missing.
    }

    // QR code (only when the panel is open, to save work)
    if (App.getReadingMode() === "details") {
      App.generateLocationQR(detailsQRBox, loc);
    }

    renderMetaTable(loc);
  }

  // small helper: add one row to the metadata table
  function addRow(group, vocab, label, value) {
    if (value === undefined || value === null || value === "") return;
    // Do not add rows with empty values.

    var tr = document.createElement("tr");
    tr.setAttribute("data-group", group);
    tr.setAttribute("data-vocab", vocab);
    // Save group and vocab as data attributes (could be used by CSS filters).

    var td1 = document.createElement("td");
    td1.className = "meta-key";
    td1.innerHTML = '<span class="meta-vocab-tag" title="Vocabulary: ' + vocab + '">' + vocab + '</span> ' + label;
    // The key cell shows the vocabulary name + the human label.

    var td2 = document.createElement("td");
    td2.className = "meta-val";
    if (value instanceof Array) {
    // instanceof checks the type. If value is an array, join the items with ", ".
      td2.textContent = value.join(", ");
    } else {
      td2.textContent = String(value);
      // Otherwise convert to string.
    }

    tr.appendChild(td1);
    tr.appendChild(td2);
    metaTableBody.appendChild(tr);
  }

  // small helper: add a section header row
  function addHead(label) {
    var tr = document.createElement("tr");
    tr.className = "meta-section";
    var th = document.createElement("th");
    th.colSpan = 2;
    // colSpan = 2 means this cell takes the width of two columns.
    th.textContent = label;
    tr.appendChild(th);
    metaTableBody.appendChild(tr);
  }

  function renderMetaTable(loc) {
    if (!metaTableBody) return;
    metaTableBody.innerHTML = "";
    // Clear the table before re-rendering.
    if (metaSources) metaSources.innerHTML = "";

    if (!loc.meta) {
      var tr = document.createElement("tr");
      tr.innerHTML = '<td colspan="2" class="meta-empty">Catalogue metadata pending for this location.</td>';
      metaTableBody.appendChild(tr);
      if (metaBlock) metaBlock.classList.add("meta-empty-state");
      return;
    }
    if (metaBlock) metaBlock.classList.remove("meta-empty-state");
    var m = loc.meta;
    // Shorter alias for loc.meta.

    // ---- Section 1: Location ----
    addHead("Location");
    addRow("location", "schema:streetAddress",   "Address",     m.address);
    addRow("location", "schema:postalCode",      "Postal code", m.postal_code);
    addRow("location", "schema:addressLocality", "District",    m.district);
    addRow("location", "schema:addressLocality", "City",        m.city);
    addRow("location", "schema:addressCountry",  "Country",     m.country);
    // Each row uses a schema.org property name as the vocab tag.

    if (loc.coordinates) {
      addRow("location", "schema:GeoCoordinates", "Lat / Lon",
        loc.coordinates[0].toFixed(4) + "°N, " + loc.coordinates[1].toFixed(4) + "°E");
    }
    if (m.wikidata) {
      // wikidata cell needs a link, so I build it by hand
      var trW = document.createElement("tr");
      trW.setAttribute("data-group", "location");
      trW.setAttribute("data-vocab", "wikidata");
      var k = document.createElement("td");
      k.className = "meta-key";
      k.innerHTML = '<span class="meta-vocab-tag" title="Vocabulary: wikidata">wikidata</span> Wikidata Q-ID';
      var v = document.createElement("td");
      v.className = "meta-val";
      v.innerHTML = '<a href="https://www.wikidata.org/wiki/' + m.wikidata + '" target="_blank" rel="noopener">' + m.wikidata + ' ↗</a>';
      trW.appendChild(k);
      trW.appendChild(v);
      metaTableBody.appendChild(trW);
    }
    addRow("location", "geonames:geonameId", "GeoNames", m.geonames);

    // ---- Section 2: Heritage ----
    if (m.building_type || m.year_built || m.architects || m.period || m.style || m.unesco) {
    // Only add the section if at least one field is present.
      addHead("Heritage");
      addRow("heritage", "schema:additionalType",     "Building type", m.building_type);
      addRow("heritage", "schema:dateCreated",        "Year built",    m.year_built);
      addRow("heritage", "schema:architect",          "Architect(s)",  m.architects);
      addRow("heritage", "dcterms:temporal",          "Period",        m.period);
      addRow("heritage", "schema:architecturalStyle", "Style",         m.style);
      addRow("heritage", "dcterms:isPartOf",          "UNESCO",        m.unesco);
    }

    // ---- Section 3: Scene ----
    addHead("Scene");
    if (loc.scene)  addRow("scene", "schema:Episode", "Scene description", loc.scene);
    if (loc.camera) {
      addRow("scene", "lmml:cameraFacing",    "Camera orientation", loc.camera.facing);
      addRow("scene", "lmml:cameraElevation", "Elevation",          loc.camera.elevation);
      addRow("scene", "lmml:focalLength",     "Focal length",       loc.camera.focalLength);
      addRow("scene", "lmml:shotType",        "Shot type",          loc.camera.shotType);
      // "lmml:" is a project-specific vocabulary (Live Museum of Movie Locations).
    }
    if (loc.images && loc.images.film && loc.images.film[0]) {
      addRow("scene", "schema:image", "Screenshot ref", loc.images.film[0].src);
    }
    addRow("scene", "lmml:filmRole",     "Film role",   m.film_role);
    addRow("scene", "lmml:shotDuration", "Screen time", m.shot_duration);

    // ---- Section 4: Tourism ----
    if (m.visit_duration || m.accessibility_notes || m.recommended_time_of_day || m.ticket) {
      addHead("Tourism");
      addRow("tourism", "schema:duration",             "Visit duration",   m.visit_duration);
      addRow("tourism", "schema:accessibilityFeature", "Accessibility",    m.accessibility_notes);
      addRow("tourism", "schema:availableTime",        "Best time of day", m.recommended_time_of_day);
      addRow("tourism", "schema:offers/price",         "Ticket",           m.ticket);
    }

    // ---- Section 5: Project ----
    addHead("Project");
    // Check which narrative this location belongs to.
    var inPursuit  = false;
    var inTimeline = false;
    for (var i = 0; i < APP_DATA.pursuitLocations.length; i++) {
      if (APP_DATA.pursuitLocations[i].id === loc.id) { inPursuit = true; break; }
    }
    for (var i = 0; i < APP_DATA.timelineLocations.length; i++) {
      if (APP_DATA.timelineLocations[i].id === loc.id) { inTimeline = true; break; }
    }
    var cats = [];
    if (inPursuit)  cats.push("Pursuit & Passage");
    if (inTimeline) cats.push("Through Time");
    addRow("project", "dcterms:subject",  "Narrative category", cats);
    addRow("project", "dcterms:modified", "Last updated",       m.last_updated);
    addRow("project", "dcterms:rights",   "Rights",             m.rights);
    addRow("project", "dcterms:language", "Language",           m.language);

    // sources line
    if (m.sources && m.sources.length && metaSources) {
      var html = '<span class="meta-vocab-tag">dcterms:source</span> ';
      for (var k = 0; k < m.sources.length; k++) {
        var s = m.sources[k];
        if (k > 0) html += " · ";
        html += '<a href="' + s.url + '" target="_blank" rel="noopener">' + s.label + ' ↗</a>';
      }
      metaSources.innerHTML = html;
    }
  }


  // ===== 11. Render the active location =====
  function renderLocation() {
  // This is the big function that fills the page with the data of the current location.
    var loc = App.getActiveLocation();
    if (!loc) return;

    var isTimeline = (App.getNarrative() === "timeline");

    // image placeholder colour and icon
    var locColor = chapterColorMap[loc.chapter] || "rgba(74,139,181,0.1)";
    locationImagePlaceholder.style.setProperty("--location-color", locColor);
    // setProperty sets a CSS custom property (variable). The CSS uses var(--location-color).
    locationImageIcon.textContent = chapterIcons[loc.chapter] || "◉";

    // reset gallery to the first media item when changing location
    galleryIndex = 0;
    renderGallery(loc);

    locationFilmTag.textContent = loc.filmTag;

    // info panel
    locationName.textContent = loc.name;
    locationScene.innerHTML  = "<strong>" + loc.film + "</strong> · " + loc.scene;

    var chClass = App.chapterColorClass(loc.chapter);
    locationChapterBadge.className = "chapter-badge " + chClass;
    locationChapterBadge.textContent = loc.chapter || "Featured";

    // narrative text
    narrativeQuote.className = "narrative-quote" + (isTimeline ? " timeline" : "");
    // Add the " timeline" class only in timeline mode (for a different color).
    narrativeQuote.textContent = loc.quote;

    narrativeBody.textContent = pickText(loc);

    narrativeNoteBlock.className = "narrative-note-block" + (isTimeline ? " timeline" : "");
    narrativeNoteText.textContent = loc.narrativeNote || "";

    renderDetailsPanel(loc);
    updateChapterIntro();

    updateChapterStrip();
    updateProgress();
    updateNavButtons();
    updateDirections();
  }


  // ===== 12. React to App state changes =====
  // app.js fires custom events; here I listen for them and redraw.
  // This is a simple "event-based" architecture: state lives in one place (app.js), and views update when state changes.

  document.addEventListener("narrativeChanged", function() {
    updateNarrativeToggle();
    buildChapterStrip();
    renderLocation();
    // When the narrative changes, redraw everything that depends on it.
  });

  document.addEventListener("locationChanged", function() {
    renderLocation();
    // Only the location-dependent things need to redraw.
  });

  document.addEventListener("textVariantChanged", function() {
    var loc = App.getActiveLocation();
    if (!loc) return;
    narrativeBody.textContent = pickText(loc);
    // Only the text body changes — pick a new version.
    updateVariantUI();
  });

  document.addEventListener("textLengthChanged", function() {
    var loc = App.getActiveLocation();
    if (!loc) return;
    narrativeBody.textContent = pickText(loc);
    updateVariantUI();
  });

  document.addEventListener("readingModeChanged", function() {
    updateVariantUI();
    var loc = App.getActiveLocation();
    if (loc && App.getReadingMode() === "details") {
      App.generateLocationQR(detailsQRBox, loc);
      // Only generate the QR when the user actually opens the details panel (saves work).
    }
  });


  // ===== 13. First-time setup when the page loads =====
  updateNarrativeToggle();
  buildChapterStrip();
  updateVariantUI();
  renderLocation();
  // Initial render so the page is not empty.

});
