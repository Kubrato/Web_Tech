// explore.js — code for the Explore page
// I wait until the page is ready, then set everything up.

document.addEventListener("DOMContentLoaded", function() {

  // ===== 1. Get all the page elements I need =====
  // I just grab everything once at the start so I can use them later.

  var toggleEspionage    = document.getElementById("toggleEspionage");
  var toggleTimeline     = document.getElementById("toggleTimeline");

  var chapterStrip          = document.getElementById("chapterStrip");
  var chapterIntroBanner    = document.getElementById("chapterIntroBanner");
  var chapterIntroChap      = document.getElementById("chapterIntroChapter");
  var chapterIntroText      = document.getElementById("chapterIntroText");
  var chapterTransitionLine = document.getElementById("chapterTransitionLine");
  var chapterTransitionText = document.getElementById("chapterTransitionText");
  var locationDirections    = document.getElementById("locationDirections");

  var btnPrev          = document.getElementById("btnPrev");
  var btnNext          = document.getElementById("btnNext");
  var progressText     = document.getElementById("progressText");
  var progressFill     = document.getElementById("progressFill");
  var counterFraction  = document.getElementById("counterFraction");

  // location display
  var locationImagePlaceholder = document.getElementById("locationImagePlaceholder");
  var locationImageEl          = document.getElementById("locationImage");
  var locationImageIcon        = document.getElementById("locationImageIcon");
  var locationFilmTag          = document.getElementById("locationFilmTag");
  var locationCoords           = document.getElementById("locationCoords");
  var locationName             = document.getElementById("locationName");
  var locationScene            = document.getElementById("locationScene");
  var locationChapterBadge     = document.getElementById("locationChapterBadge");

  // image gallery
  var galleryTabs    = document.getElementById("galleryTabs");
  var galleryThumbs  = document.getElementById("galleryThumbs");
  var galleryCaption = document.getElementById("galleryCaption");
  var galleryType    = "film";   // "film", "location" or "video"
  var galleryIndex   = 0;

  // narrative panel
  var narrativeQuote     = document.getElementById("narrativeQuote");
  var narrativeBody      = document.getElementById("narrativeBody");
  var narrativeNoteBlock = document.getElementById("narrativeNoteBlock");
  var narrativeNoteText  = document.getElementById("narrativeNoteText");

  // audience / length / mode buttons
  var btnModeStory     = document.getElementById("btnModeStory");
  var btnModeDetails   = document.getElementById("btnModeDetails");
  var variantIndicator = document.getElementById("variantIndicator");
  var btnLenLess       = document.getElementById("btnLenLess");
  var btnLenMore       = document.getElementById("btnLenMore");
  var lengthIndicator  = document.getElementById("lengthIndicator");
  var btnEasier        = document.getElementById("btnEasier");
  var btnHarder        = document.getElementById("btnHarder");

  // details panel
  var detailsPanel = document.getElementById("detailsPanel");
  var detailsQRBox = document.getElementById("detailsQRBox");
  var camFacing    = document.getElementById("camFacing");
  var camElevation = document.getElementById("camElevation");
  var camFocal     = document.getElementById("camFocal");
  var camShotType  = document.getElementById("camShotType");
  var camNote      = document.getElementById("camNote");

  // metadata table
  var metaBlock     = document.getElementById("metaBlock");
  var metaTableBody = document.getElementById("metaTableBody");
  var metaSources   = document.getElementById("metaSources");


  // ===== 2. Icon and colour for each chapter =====
  // I use a simple object as a lookup table.

  var chapterIcons = {
    "Surveillance":  "◎",
    "The Chase":     "↗",
    "The Search":    "✧",
    "Confrontation": "✦",
    "1960s":         "◇",
    "2012":          "◆",
    "2014":          "◈",
    "2016":          "◉"
  };

  var chapterColorMap = {
    "Surveillance":  "rgba(74,139,181,0.15)",
    "The Chase":     "rgba(154,106,42,0.15)",
    "The Search":    "rgba(106,58,122,0.15)",
    "Confrontation": "rgba(154,53,53,0.15)",
    "1960s":         "rgba(90,138,90,0.15)",
    "2012":          "rgba(74,139,181,0.15)",
    "2014":          "rgba(176,106,106,0.15)",
    "2016":          "rgba(201,165,90,0.15)"
  };


  // ===== 3. Narrative toggle (Pursuit / Timeline) =====
  function updateNarrativeToggle() {
    var id = App.getNarrative();
    if (id === "pursuit") {
      toggleEspionage.classList.add("active");
      toggleTimeline.classList.remove("active");
      toggleEspionage.setAttribute("aria-pressed", "true");
      toggleTimeline.setAttribute("aria-pressed", "false");
    } else {
      toggleEspionage.classList.remove("active");
      toggleTimeline.classList.add("active");
      toggleEspionage.setAttribute("aria-pressed", "false");
      toggleTimeline.setAttribute("aria-pressed", "true");
    }
  }

  toggleEspionage.addEventListener("click", function() {
    if (App.getNarrative() !== "pursuit") App.setNarrative("pursuit");
  });
  toggleTimeline.addEventListener("click", function() {
    if (App.getNarrative() !== "timeline") App.setNarrative("timeline");
  });


  // ===== 4. Chapter strip (the row of chapter buttons on top) =====
  function buildChapterStrip() {
    chapterStrip.innerHTML = "";
    var locs = App.getLocations();

    // get the list of chapters in the order they appear
    var chapters = [];
    for (var i = 0; i < locs.length; i++) {
      var c = locs[i].chapter;
      if (c && chapters.indexOf(c) === -1) {
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
      item.textContent = icon + " " + chapter;
      item.setAttribute("aria-label", "Go to chapter: " + chapter);
      item.dataset.chapter = chapter;

      // when clicked, jump to the first location of this chapter
      item.addEventListener("click", goToChapter);
      chapterStrip.appendChild(item);
    }
  }

  // helper for chapter button click
  function goToChapter(e) {
    var chapter = e.currentTarget.dataset.chapter;
    var locs = App.getLocations();
    for (var i = 0; i < locs.length; i++) {
      if (locs[i].chapter === chapter) {
        App.setLocationIndex(i);
        return;
      }
    }
  }

  function updateChapterStrip() {
    var current = App.getActiveLocation();
    var items = document.querySelectorAll(".chapter-strip-item");
    for (var i = 0; i < items.length; i++) {
      if (current && items[i].dataset.chapter === current.chapter) {
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
    var narrative   = App.getNarrativeData();
    var intros      = narrative.chapterIntros      || {};
    var transitions = narrative.chapterTransitions || {};

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
    var loc = App.getActiveLocation();

    if (!loc || !loc.nextDirection) {
      locationDirections.textContent = "";
      locationDirections.classList.add("hidden");
      return;
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

    progressFill.style.width = pct + "%";
    progressFill.parentElement.setAttribute("aria-valuenow", Math.round(pct));
    progressText.textContent    = (idx + 1) + " / " + locs.length;
    counterFraction.textContent = (idx + 1) + " / " + locs.length;
  }

  function updateNavButtons() {
    var locs = App.getLocations();
    var idx  = App.getLocationIndex();
    btnPrev.disabled = idx <= 0;
    btnNext.disabled = idx >= locs.length - 1;
  }

  btnPrev.addEventListener("click", function() { App.goPrev(); });
  btnNext.addEventListener("click", function() { App.goNext(); });


  // ===== 7. Audience, length and reading-mode buttons =====
  if (btnEasier) btnEasier.addEventListener("click", function() { App.nudgeVariantEasier(); });
  if (btnHarder) btnHarder.addEventListener("click", function() { App.nudgeVariantHarder(); });

  if (btnLenLess) btnLenLess.addEventListener("click", function() { App.tellMeLess(); });
  if (btnLenMore) btnLenMore.addEventListener("click", function() { App.tellMeMore(); });

  btnModeStory.addEventListener("click",   function() { App.setReadingMode("story"); });
  btnModeDetails.addEventListener("click", function() { App.setReadingMode("details"); });

  // close button on the details panel
  var detailsCloseBtn = document.getElementById("detailsCloseBtn");
  if (detailsCloseBtn) {
    detailsCloseBtn.addEventListener("click", function() {
      App.setReadingMode("story");
    });
  }

  function updateVariantUI() {
    var v      = App.getTextVariant();
    var length = App.getTextLength();
    var mode   = App.getReadingMode();

    // audience indicator label
    if (v === "young")        variantIndicator.textContent = "Young";
    else if (v === "adult")   variantIndicator.textContent = "Adult";
    else if (v === "scholar") variantIndicator.textContent = "Scholar";

    // disable buttons at the ends of the audience range
    if (btnEasier) btnEasier.disabled = (v === "young");
    if (btnHarder) btnHarder.disabled = (v === "scholar");

    // length indicator + buttons
    if (lengthIndicator) {
      lengthIndicator.textContent = (length === "short") ? "BRIEF" : "STANDARD";
    }
    if (btnLenLess) {
      if (length === "short") {
        btnLenLess.classList.add("active");
        btnLenLess.setAttribute("aria-pressed", "true");
      } else {
        btnLenLess.classList.remove("active");
        btnLenLess.setAttribute("aria-pressed", "false");
      }
    }
    if (btnLenMore) {
      if (length === "medium") {
        btnLenMore.classList.add("active");
        btnLenMore.setAttribute("aria-pressed", "true");
      } else {
        btnLenMore.classList.remove("active");
        btnLenMore.setAttribute("aria-pressed", "false");
      }
    }

    // mode buttons
    if (mode === "story") {
      btnModeStory.classList.add("active");
      btnModeDetails.classList.remove("active");
      btnModeStory.setAttribute("aria-pressed", "true");
      btnModeDetails.setAttribute("aria-pressed", "false");
    } else {
      btnModeStory.classList.remove("active");
      btnModeDetails.classList.add("active");
      btnModeStory.setAttribute("aria-pressed", "false");
      btnModeDetails.setAttribute("aria-pressed", "true");
    }

    // show/hide the details panel
    if (mode === "details") {
      detailsPanel.classList.remove("hidden");
    } else {
      detailsPanel.classList.add("hidden");
    }
  }


  // ===== 8. Image gallery =====
  // Three tabs: Real Location / Film Still / Video.
  // Each tab shows one image (or a YouTube video) plus thumbnails.

  // Remove the YouTube iframe so the audio stops when the user leaves the tab.
  function clearVideoFrame() {
    var placeholder = locationImageEl && locationImageEl.parentNode;
    if (!placeholder) return;
    var existing = placeholder.querySelector(".location-video");
    if (existing) existing.remove();
  }

  function renderGallery(loc) {
    if (!loc || !loc.images) {
      galleryTabs.innerHTML = "";
      galleryThumbs.innerHTML = "";
      galleryCaption.textContent = "";
      locationImageEl.style.display = "none";
      clearVideoFrame();
      return;
    }

    // pick the right arrays (or empty if missing)
    var locImgs  = loc.images.location ? loc.images.location : [];
    var filmImgs = loc.images.film     ? loc.images.film     : [];
    var videos   = loc.images.video    ? loc.images.video    : [];

    var hasFilm = filmImgs.length > 0;
    var hasLoc  = locImgs.length  > 0;
    var hasVid  = videos.length   > 0;

    // if the chosen tab is empty, switch to the next available one
    if (galleryType === "film"     && !hasFilm) galleryType = hasLoc ? "location" : (hasVid ? "video" : "film");
    if (galleryType === "location" && !hasLoc)  galleryType = hasFilm ? "film"    : (hasVid ? "video" : "location");
    if (galleryType === "video"    && !hasVid)  galleryType = hasFilm ? "film"    : (hasLoc ? "location" : "video");

    // build the tab buttons
    galleryTabs.innerHTML = "";
    if (hasFilm) addGalleryTab("film",     "Film Still",    filmImgs.length, loc);
    if (hasLoc)  addGalleryTab("location", "Real Location", locImgs.length,  loc);
    if (hasVid)  addGalleryTab("video",    "Video",         videos.length,   loc);

    // render the active tab
    if (galleryType === "video") {
      renderVideoTab(loc, videos);
    } else {
      var imgs = (galleryType === "film") ? filmImgs : locImgs;
      renderImageTab(loc, imgs);
    }
  }

  function addGalleryTab(type, label, count, loc) {
    var btn = document.createElement("button");
    btn.className = "gallery-tab" + (galleryType === type ? " active" : "");
    btn.setAttribute("role", "tab");
    btn.setAttribute("aria-selected", String(galleryType === type));
    btn.innerHTML = label + ' <span class="gallery-tab-count">' + count + '</span>';
    btn.addEventListener("click", function() {
      if (galleryType !== type) {
        galleryType = type;
        galleryIndex = 0;
        renderGallery(loc);
      }
    });
    galleryTabs.appendChild(btn);
  }

  function renderImageTab(loc, imgs) {
    clearVideoFrame();

    if (imgs.length === 0) {
      galleryThumbs.innerHTML = "";
      galleryCaption.textContent = "";
      locationImageEl.style.display = "none";
      return;
    }
    if (galleryIndex >= imgs.length) galleryIndex = 0;
    var current = imgs[galleryIndex];

    // main image
    locationImageEl.src = current.src;
    locationImageEl.alt = current.alt || loc.name;
    locationImageEl.onload  = function() { locationImageEl.style.display = "block"; };
    locationImageEl.onerror = function() { locationImageEl.style.display = "none"; };

    // caption
    galleryCaption.textContent = current.caption || "";

    // thumbnails (only when there is more than one image)
    galleryThumbs.innerHTML = "";
    if (imgs.length > 1) {
      for (var i = 0; i < imgs.length; i++) {
        var thumb = document.createElement("button");
        thumb.className = "gallery-thumb" + (i === galleryIndex ? " active" : "");
        thumb.style.backgroundImage = 'url("' + imgs[i].src + '")';
        thumb.title = imgs[i].caption || "";
        thumb.setAttribute("role", "listitem");
        thumb.setAttribute("aria-label", "Image " + (i + 1) + " of " + imgs.length);
        thumb.dataset.idx = i;
        thumb.addEventListener("click", thumbClicked);
        galleryThumbs.appendChild(thumb);
      }
    }
  }

  function thumbClicked(e) {
    galleryIndex = parseInt(e.currentTarget.dataset.idx);
    renderGallery(App.getActiveLocation());
  }

  function renderVideoTab(loc, videos) {
    if (galleryIndex >= videos.length) galleryIndex = 0;
    var current = videos[galleryIndex];

    // hide the still image, then build (or reuse) the iframe
    locationImageEl.style.display = "none";
    var placeholder = locationImageEl.parentNode;
    var frame = placeholder.querySelector(".location-video");
    if (!frame) {
      frame = document.createElement("iframe");
      frame.className = "location-video";
      frame.setAttribute("allow", "accelerometer; encrypted-media; picture-in-picture");
      frame.setAttribute("allowfullscreen", "");
      frame.setAttribute("loading", "lazy");
      placeholder.appendChild(frame);
    }
    var newSrc = "https://www.youtube.com/embed/" + encodeURIComponent(current.youtubeId) + "?rel=0&modestbranding=1";
    if (frame.src !== newSrc) frame.src = newSrc;
    frame.title = current.title || (loc.name + " — video");

    // caption + a fallback link in case the embed gets blocked
    var watchUrl = "https://www.youtube.com/watch?v=" + encodeURIComponent(current.youtubeId);
    galleryCaption.innerHTML = "";
    if (current.caption) {
      galleryCaption.appendChild(document.createTextNode(current.caption + " "));
    }
    var link = document.createElement("a");
    link.href = watchUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.className = "gallery-video-link";
    link.textContent = "Open on YouTube ↗";
    galleryCaption.appendChild(link);

    // thumbnails for the other videos
    galleryThumbs.innerHTML = "";
    if (videos.length > 1) {
      for (var i = 0; i < videos.length; i++) {
        var v = videos[i];
        var thumb = document.createElement("button");
        thumb.className = "gallery-thumb" + (i === galleryIndex ? " active" : "");
        var thumbUrl = "https://img.youtube.com/vi/" + encodeURIComponent(v.youtubeId) + "/hqdefault.jpg";
        thumb.style.backgroundImage = 'url("' + thumbUrl + '")';
        thumb.title = v.caption || v.title || "";
        thumb.setAttribute("role", "listitem");
        thumb.setAttribute("aria-label", "Video " + (i + 1) + " of " + videos.length);
        thumb.dataset.idx = i;
        thumb.addEventListener("click", thumbClicked);
        galleryThumbs.appendChild(thumb);
      }
    }
  }


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
    }
    return longTexts[audience] || longTexts.adult || loc.description || "";
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
    var tr = document.createElement("tr");
    tr.dataset.group = group;
    tr.dataset.vocab = vocab;

    var td1 = document.createElement("td");
    td1.className = "meta-key";
    td1.innerHTML = '<span class="meta-vocab-tag" title="Vocabulary: ' + vocab + '">' + vocab + '</span> ' + label;

    var td2 = document.createElement("td");
    td2.className = "meta-val";
    if (value instanceof Array) {
      td2.textContent = value.join(", ");
    } else {
      td2.textContent = String(value);
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
    th.textContent = label;
    tr.appendChild(th);
    metaTableBody.appendChild(tr);
  }

  function renderMetaTable(loc) {
    if (!metaTableBody) return;
    metaTableBody.innerHTML = "";
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

    // ---- Section 1: Location ----
    addHead("Location");
    addRow("location", "schema:streetAddress",   "Address",     m.address);
    addRow("location", "schema:postalCode",      "Postal code", m.postal_code);
    addRow("location", "schema:addressLocality", "District",    m.district);
    addRow("location", "schema:addressLocality", "City",        m.city);
    addRow("location", "schema:addressCountry",  "Country",     m.country);
    if (loc.coordinates) {
      addRow("location", "schema:GeoCoordinates", "Lat / Lon",
        loc.coordinates[0].toFixed(4) + "°N, " + loc.coordinates[1].toFixed(4) + "°E");
    }
    if (m.wikidata) {
      // wikidata cell needs a link, so I build it by hand
      var trW = document.createElement("tr");
      trW.dataset.group = "location";
      trW.dataset.vocab = "wikidata";
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
    var loc = App.getActiveLocation();
    if (!loc) return;

    var isTimeline = (App.getNarrative() === "timeline");

    // image placeholder colour and icon
    var locColor = chapterColorMap[loc.chapter] || "rgba(74,139,181,0.1)";
    locationImagePlaceholder.style.setProperty("--location-color", locColor);
    locationImagePlaceholder.setAttribute("data-location", loc.name);
    locationImageIcon.textContent = chapterIcons[loc.chapter] || "◉";

    // reset gallery to film tab when changing location
    galleryType = "film";
    galleryIndex = 0;
    renderGallery(loc);

    locationFilmTag.textContent = loc.filmTag;
    locationCoords.textContent  = App.formatCoords(loc.coordinates);

    // info panel
    locationName.textContent = loc.name;
    locationScene.innerHTML  = "<strong>" + loc.film + "</strong> · " + loc.scene;

    var chClass = App.chapterColorClass(loc.chapter);
    locationChapterBadge.className = "chapter-badge " + chClass;
    locationChapterBadge.textContent = loc.chapter || "Featured";

    // narrative text
    narrativeQuote.className = "narrative-quote" + (isTimeline ? " timeline" : "");
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

  document.addEventListener("narrativeChanged", function() {
    updateNarrativeToggle();
    buildChapterStrip();
    renderLocation();
  });

  document.addEventListener("locationChanged", function() {
    renderLocation();
  });

  document.addEventListener("textVariantChanged", function() {
    var loc = App.getActiveLocation();
    if (!loc) return;
    narrativeBody.textContent = pickText(loc);
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
    }
  });


  // ===== 13. First-time setup when the page loads =====
  updateNarrativeToggle();
  buildChapterStrip();
  updateVariantUI();
  renderLocation();

});
