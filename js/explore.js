/*
  explore.js — logic for the Explore page.

  Each section below builds or updates one part of the page:
    1. element references
    2. icon/colour maps for chapters
    3. narrative toggle (Pursuit / Timeline)
    4. chapter strip + chapter intro banner
    5. walking directions to the next location
    6. dot navigation + progress + prev/next buttons
    7. audience, length, and reading mode controls
    8. image gallery
    9. text picker (audience x length)
    10. details panel (camera + QR + metadata table)
    11. main location renderer
    12. event listeners + init
*/

document.addEventListener("DOMContentLoaded", () => {

  // ============================================================
  // 1. Element references
  // ============================================================
  const toggleEspionage    = document.getElementById("toggleEspionage");
  const toggleTimeline     = document.getElementById("toggleTimeline");

  const chapterStrip          = document.getElementById("chapterStrip");
  const chapterIntroBanner    = document.getElementById("chapterIntroBanner");
  const chapterIntroChap      = document.getElementById("chapterIntroChapter");
  const chapterIntroText      = document.getElementById("chapterIntroText");
  const chapterTransitionLine = document.getElementById("chapterTransitionLine");
  const chapterTransitionText = document.getElementById("chapterTransitionText");
  const locationDirections    = document.getElementById("locationDirections");

  const locationDots     = document.getElementById("locationDots");
  const btnPrev          = document.getElementById("btnPrev");
  const btnNext          = document.getElementById("btnNext");
  const progressText     = document.getElementById("progressText");
  const progressFill     = document.getElementById("progressFill");
  const counterFraction  = document.getElementById("counterFraction");

  // Location display
  const locationImagePlaceholder = document.getElementById("locationImagePlaceholder");
  const locationImageEl          = document.getElementById("locationImage");
  const locationImageIcon        = document.getElementById("locationImageIcon");
  const locationFilmTag          = document.getElementById("locationFilmTag");
  const locationCoords           = document.getElementById("locationCoords");
  const locationName             = document.getElementById("locationName");
  const locationScene            = document.getElementById("locationScene");
  const locationChapterBadge     = document.getElementById("locationChapterBadge");

  // Image gallery
  const galleryTabs    = document.getElementById("galleryTabs");
  const galleryThumbs  = document.getElementById("galleryThumbs");
  const galleryCaption = document.getElementById("galleryCaption");
  let   galleryType    = "film";  // "film" | "location"
  let   galleryIndex   = 0;

  // Narrative panel
  const narrativeQuote     = document.getElementById("narrativeQuote");
  const narrativeBody      = document.getElementById("narrativeBody");
  const narrativeNoteBlock = document.getElementById("narrativeNoteBlock");
  const narrativeNoteText  = document.getElementById("narrativeNoteText");

  // Audience / length / mode controls
  const btnModeStory     = document.getElementById("btnModeStory");
  const btnModeDetails   = document.getElementById("btnModeDetails");
  const variantIndicator = document.getElementById("variantIndicator");
  const btnLenLess       = document.getElementById("btnLenLess");
  const btnLenMore       = document.getElementById("btnLenMore");
  const lengthIndicator  = document.getElementById("lengthIndicator");
  const btnEasier        = document.getElementById("btnEasier");
  const btnHarder        = document.getElementById("btnHarder");

  // Details panel (QR + camera info)
  const detailsPanel = document.getElementById("detailsPanel");
  const detailsQRBox = document.getElementById("detailsQRBox");
  const camFacing    = document.getElementById("camFacing");
  const camElevation = document.getElementById("camElevation");
  const camFocal     = document.getElementById("camFocal");
  const camShotType  = document.getElementById("camShotType");
  const camNote      = document.getElementById("camNote");

  // Metadata table
  const metaBlock     = document.getElementById("metaBlock");
  const metaTableBody = document.getElementById("metaTableBody");
  const metaSources   = document.getElementById("metaSources");


  // ============================================================
  // 2. Icon and colour maps for chapters
  // ============================================================
  const chapterIcons = {
    "Surveillance":  "◎",
    "The Chase":     "↗",
    "The Search":    "✧",
    "Confrontation": "✦",
    "1960s":         "◇",
    "2012":          "◆",
    "2014":          "◈",
    "2016":          "◉"
  };

  const chapterColorMap = {
    "Surveillance":  "rgba(74,139,181,0.15)",
    "The Chase":     "rgba(154,106,42,0.15)",
    "The Search":    "rgba(106,58,122,0.15)",
    "Confrontation": "rgba(154,53,53,0.15)",
    "1960s":         "rgba(90,138,90,0.15)",
    "2012":          "rgba(74,139,181,0.15)",
    "2014":          "rgba(176,106,106,0.15)",
    "2016":          "rgba(201,165,90,0.15)"
  };


  // ============================================================
  // 3. Narrative toggle (Pursuit / Timeline)
  // ============================================================
  function updateNarrativeToggle() {
    const id = App.getNarrative();
    const isPursuit = id === "pursuit";

    toggleEspionage.classList.toggle("active", isPursuit);
    toggleTimeline.classList.toggle("active", !isPursuit);
    toggleEspionage.setAttribute("aria-pressed", String(isPursuit));
    toggleTimeline.setAttribute("aria-pressed", String(!isPursuit));
  }

  toggleEspionage.addEventListener("click", () => {
    if (App.getNarrative() !== "pursuit") App.setNarrative("pursuit");
  });
  toggleTimeline.addEventListener("click", () => {
    if (App.getNarrative() !== "timeline") App.setNarrative("timeline");
  });


  // ============================================================
  // 4. Chapter strip + chapter intro banner
  // ============================================================
  function buildChapterStrip() {
    chapterStrip.innerHTML = "";
    const locs = App.getLocations();

    // Collect unique chapters in order they first appear.
    const chapters = [];
    const seen = new Set();
    locs.forEach(loc => {
      if (loc.chapter && !seen.has(loc.chapter)) {
        seen.add(loc.chapter);
        chapters.push(loc.chapter);
      }
    });

    chapters.forEach((chapter, i) => {
      // Add a slash separator between chapters (except before the first).
      if (i > 0) {
        const sep = document.createElement("span");
        sep.className = "chapter-strip-sep";
        sep.textContent = "/";
        sep.setAttribute("aria-hidden", "true");
        chapterStrip.appendChild(sep);
      }

      const item = document.createElement("button");
      item.className = "chapter-strip-item";
      item.textContent = (chapterIcons[chapter] || "·") + " " + chapter;
      item.setAttribute("aria-label", "Go to chapter: " + chapter);
      item.dataset.chapter = chapter;

      item.addEventListener("click", () => {
        const idx = locs.findIndex(l => l.chapter === chapter);
        if (idx !== -1) App.setLocationIndex(idx);
      });

      chapterStrip.appendChild(item);
    });
  }

  function updateChapterStrip() {
    const current = App.getActiveLocation();
    document.querySelectorAll(".chapter-strip-item").forEach(item => {
      const isActive = current && item.dataset.chapter === current.chapter;
      item.classList.toggle("active", isActive);
    });
  }

  // Show the chapter intro banner only on the first location of each chapter.
  // If we're entering a new chapter (not the very first one), also show the
  // transition line that bridges from the previous chapter.
  function updateChapterIntro() {
    const loc  = App.getActiveLocation();
    const locs = App.getLocations();
    const idx  = App.getLocationIndex();

    const isFirstOfChapter = idx === 0 || locs[idx - 1].chapter !== loc.chapter;
    const narrative   = App.getNarrativeData();
    const intros      = narrative.chapterIntros      || {};
    const transitions = narrative.chapterTransitions || {};

    if (isFirstOfChapter && intros[loc.chapter]) {
      chapterIntroChap.textContent = loc.chapter;
      chapterIntroText.textContent = intros[loc.chapter];

      const transitionFromPrev = idx > 0 ? transitions[loc.chapter] : null;
      if (transitionFromPrev) {
        chapterTransitionText.textContent = transitionFromPrev;
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


  // ============================================================
  // 5. Walking directions to the next location
  // ============================================================
  // Distance between two [lat, lon] points in metres (Haversine formula).
  function haversineMeters(a, b) {
    const R = 6371000; // Earth radius in metres
    const toRad = deg => deg * Math.PI / 180;
    const dLat = toRad(b[0] - a[0]);
    const dLon = toRad(b[1] - a[1]);
    const lat1 = toRad(a[0]);
    const lat2 = toRad(b[0]);
    const h = Math.sin(dLat / 2) ** 2
            + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  }

  // Compass direction from point a to point b ("N", "NE", "E", ...).
  function compassPoint(a, b) {
    const toRad = deg => deg * Math.PI / 180;
    const toDeg = rad => rad * 180 / Math.PI;
    const lat1 = toRad(a[0]);
    const lat2 = toRad(b[0]);
    const dLon = toRad(b[1] - a[1]);
    const y = Math.sin(dLon) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2)
            - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
    const bearing = (toDeg(Math.atan2(y, x)) + 360) % 360;
    const points = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    return points[Math.round(bearing / 45) % 8];
  }

  function formatDistance(metres) {
    if (metres < 1000) return Math.round(metres / 10) * 10 + " m";
    return (metres / 1000).toFixed(1) + " km";
  }

  function updateDirections() {
    if (!locationDirections) return;
    const locs = App.getLocations();
    const idx  = App.getLocationIndex();
    const here = locs[idx];
    const next = locs[idx + 1];

    // Hide the line on the last location (no "next" point).
    if (!next || !here || !here.coordinates || !next.coordinates) {
      locationDirections.textContent = "";
      locationDirections.classList.add("hidden");
      return;
    }

    const distance  = haversineMeters(here.coordinates, next.coordinates);
    const direction = compassPoint(here.coordinates, next.coordinates);

    locationDirections.classList.remove("hidden");
    locationDirections.innerHTML =
        '<span class="directions-label">Walk to next</span> '
      + '<span class="directions-arrow">→</span> '
      + '<strong>' + formatDistance(distance) + '</strong> '
      + '<span class="directions-bearing">' + direction + '</span> '
      + '<span class="directions-target">to ' + next.name + '</span>';
  }


  // ============================================================
  // 6. Dot navigation + progress + prev/next buttons
  // ============================================================
  function buildDots() {
    locationDots.innerHTML = "";
    const locs = App.getLocations();
    locs.forEach((loc, i) => {
      const dot = document.createElement("button");
      dot.className = "location-dot";
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", "Location " + (i + 1) + ": " + loc.name);
      dot.addEventListener("click", () => App.setLocationIndex(i));
      locationDots.appendChild(dot);
    });
  }

  function updateDots() {
    const idx = App.getLocationIndex();
    document.querySelectorAll(".location-dot").forEach((dot, i) => {
      dot.classList.toggle("active", i === idx);
      dot.setAttribute("aria-selected", String(i === idx));
    });
  }

  function updateProgress() {
    const locs = App.getLocations();
    const idx  = App.getLocationIndex();
    const pct  = ((idx + 1) / locs.length) * 100;

    progressFill.style.width = pct + "%";
    progressFill.parentElement.setAttribute("aria-valuenow", Math.round(pct));
    progressText.textContent    = (idx + 1) + " / " + locs.length;
    counterFraction.textContent = (idx + 1) + " / " + locs.length;
  }

  function updateNavButtons() {
    const locs = App.getLocations();
    const idx  = App.getLocationIndex();
    btnPrev.disabled = idx <= 0;
    btnNext.disabled = idx >= locs.length - 1;
  }

  btnPrev.addEventListener("click", () => App.goPrev());
  btnNext.addEventListener("click", () => App.goNext());

  // Arrow keys move between locations (skip when typing in a form field).
  document.addEventListener("keydown", (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      if (!btnNext.disabled) App.goNext();
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      if (!btnPrev.disabled) App.goPrev();
    }
  });


  // ============================================================
  // 7. Audience, length, and reading mode controls
  // ============================================================
  if (btnEasier) btnEasier.addEventListener("click", () => App.nudgeVariantEasier());
  if (btnHarder) btnHarder.addEventListener("click", () => App.nudgeVariantHarder());

  if (btnLenLess) btnLenLess.addEventListener("click", () => App.tellMeLess());
  if (btnLenMore) btnLenMore.addEventListener("click", () => App.tellMeMore());

  btnModeStory.addEventListener("click",   () => App.setReadingMode("story"));
  btnModeDetails.addEventListener("click", () => App.setReadingMode("details"));

  // Close button on the details panel goes back to story.
  const detailsCloseBtn = document.getElementById("detailsCloseBtn");
  if (detailsCloseBtn) {
    detailsCloseBtn.addEventListener("click", () => App.setReadingMode("story"));
  }

  // Escape also closes the details panel.
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && App.getReadingMode() !== "story") {
      App.setReadingMode("story");
    }
  });

  const VARIANT_LABELS = { young: "Young", adult: "Adult", scholar: "Scholar" };

  function updateVariantUI() {
    const v      = App.getTextVariant();
    const length = App.getTextLength();
    const mode   = App.getReadingMode();

    // Audience indicator (read-only display).
    variantIndicator.textContent = VARIANT_LABELS[v] || v;

    // Disable the easier/harder buttons at the ends of the audience range.
    if (btnEasier) btnEasier.disabled = (v === "young");
    if (btnHarder) btnHarder.disabled = (v === "scholar");

    // Length indicator + buttons.
    if (lengthIndicator) lengthIndicator.textContent = length === "short" ? "BRIEF" : "STANDARD";
    if (btnLenLess) {
      btnLenLess.classList.toggle("active", length === "short");
      btnLenLess.setAttribute("aria-pressed", String(length === "short"));
    }
    if (btnLenMore) {
      btnLenMore.classList.toggle("active", length === "medium");
      btnLenMore.setAttribute("aria-pressed", String(length === "medium"));
    }

    // Mode buttons.
    btnModeStory.classList.toggle("active", mode === "story");
    btnModeDetails.classList.toggle("active", mode === "details");
    btnModeStory.setAttribute("aria-pressed",   String(mode === "story"));
    btnModeDetails.setAttribute("aria-pressed", String(mode === "details"));

    // Show/hide the details panel.
    detailsPanel.classList.toggle("hidden", mode !== "details");
  }


  // ============================================================
  // 8. Image gallery (Real Location vs Film Still vs Video)
  // ============================================================
  // Remove the YouTube iframe from the placeholder (called when leaving the
  // video tab or moving to a location without videos) so audio doesn't keep
  // playing after the user navigates away.
  function clearVideoFrame() {
    const placeholder = locationImageEl && locationImageEl.parentNode;
    if (!placeholder) return;
    const existing = placeholder.querySelector(".location-video");
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

    const locImgs  = Array.isArray(loc.images.location) ? loc.images.location : [];
    const filmImgs = Array.isArray(loc.images.film)     ? loc.images.film     : [];
    const videos   = Array.isArray(loc.images.video)    ? loc.images.video    : [];

    // If the chosen tab is empty for this location, fall back to the next one
    // that has content. Order of preference: film → location → video.
    const hasFilm = filmImgs.length > 0;
    const hasLoc  = locImgs.length  > 0;
    const hasVid  = videos.length   > 0;
    if (galleryType === "film"     && !hasFilm) galleryType = hasLoc ? "location" : (hasVid ? "video" : "film");
    if (galleryType === "location" && !hasLoc)  galleryType = hasFilm ? "film"    : (hasVid ? "video" : "location");
    if (galleryType === "video"    && !hasVid)  galleryType = hasFilm ? "film"    : (hasLoc ? "location" : "video");

    // Build tab buttons.
    galleryTabs.innerHTML = "";
    function buildTab(type, label, count) {
      const btn = document.createElement("button");
      btn.className = "gallery-tab" + (galleryType === type ? " active" : "");
      btn.setAttribute("role", "tab");
      btn.setAttribute("aria-selected", String(galleryType === type));
      btn.innerHTML = label + ' <span class="gallery-tab-count">' + count + '</span>';
      btn.addEventListener("click", () => {
        if (galleryType !== type) {
          galleryType = type;
          galleryIndex = 0;
          renderGallery(loc);
        }
      });
      galleryTabs.appendChild(btn);
    }
    if (hasFilm) buildTab("film",     "Film Still",    filmImgs.length);
    if (hasLoc)  buildTab("location", "Real Location", locImgs.length);
    if (hasVid)  buildTab("video",    "Video",         videos.length);

    // ── Video tab ─────────────────────────────────────────────────
    if (galleryType === "video") {
      if (galleryIndex >= videos.length) galleryIndex = 0;
      const current = videos[galleryIndex];

      // Hide the still image and inject (or update) the iframe.
      // Note: youtube.com/embed (not -nocookie) is used because the latter
      // returns "Player error 153" when the page is opened over file:// or
      // when the browser sends no referrer.
      locationImageEl.style.display = "none";
      const placeholder = locationImageEl.parentNode;
      let frame = placeholder.querySelector(".location-video");
      if (!frame) {
        frame = document.createElement("iframe");
        frame.className = "location-video";
        frame.setAttribute("allow", "accelerometer; encrypted-media; picture-in-picture");
        frame.setAttribute("allowfullscreen", "");
        frame.setAttribute("loading", "lazy");
        placeholder.appendChild(frame);
      }
      const newSrc = "https://www.youtube.com/embed/" + encodeURIComponent(current.youtubeId) + "?rel=0&modestbranding=1";
      if (frame.src !== newSrc) frame.src = newSrc;
      frame.title = current.title || (loc.name + " — video");

      // Always render a "Open on YouTube" fallback link in the caption so
      // the video is reachable even if the embed is blocked (region/referrer).
      const watchUrl = "https://www.youtube.com/watch?v=" + encodeURIComponent(current.youtubeId);
      galleryCaption.innerHTML = "";
      if (current.caption) {
        galleryCaption.appendChild(document.createTextNode(current.caption + " "));
      }
      const link = document.createElement("a");
      link.href = watchUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.className = "gallery-video-link";
      link.textContent = "Open on YouTube ↗";
      galleryCaption.appendChild(link);

      // Thumbnails for additional videos use YouTube's hqdefault still.
      galleryThumbs.innerHTML = "";
      if (videos.length > 1) {
        videos.forEach((v, i) => {
          const thumb = document.createElement("button");
          thumb.className = "gallery-thumb" + (i === galleryIndex ? " active" : "");
          const thumbUrl = "https://img.youtube.com/vi/" + encodeURIComponent(v.youtubeId) + "/hqdefault.jpg";
          thumb.style.backgroundImage = 'url("' + thumbUrl + '")';
          thumb.title = v.caption || v.title || "";
          thumb.setAttribute("role", "listitem");
          thumb.setAttribute("aria-label", "Video " + (i + 1) + " of " + videos.length);
          thumb.addEventListener("click", () => {
            galleryIndex = i;
            renderGallery(loc);
          });
          galleryThumbs.appendChild(thumb);
        });
      }
      return;
    }

    // ── Image tabs (location / film) ──────────────────────────────
    clearVideoFrame();

    const activeImgs = galleryType === "film" ? filmImgs : locImgs;
    if (activeImgs.length === 0) {
      galleryThumbs.innerHTML = "";
      galleryCaption.textContent = "";
      locationImageEl.style.display = "none";
      return;
    }
    if (galleryIndex >= activeImgs.length) galleryIndex = 0;
    const current = activeImgs[galleryIndex];

    // Main image.
    locationImageEl.src = current.src;
    locationImageEl.alt = current.alt || loc.name;
    locationImageEl.onload  = () => { locationImageEl.style.display = "block"; };
    locationImageEl.onerror = () => { locationImageEl.style.display = "none"; };

    // Caption.
    galleryCaption.textContent = current.caption || "";

    // Thumbnails (only when there is more than one image).
    galleryThumbs.innerHTML = "";
    if (activeImgs.length > 1) {
      activeImgs.forEach((img, i) => {
        const thumb = document.createElement("button");
        thumb.className = "gallery-thumb" + (i === galleryIndex ? " active" : "");
        thumb.style.backgroundImage = 'url("' + img.src.replace(/"/g, '\\"') + '")';
        thumb.title = img.caption || "";
        thumb.setAttribute("role", "listitem");
        thumb.setAttribute("aria-label", "Image " + (i + 1) + " of " + activeImgs.length);
        thumb.addEventListener("click", () => {
          galleryIndex = i;
          renderGallery(loc);
        });
        galleryThumbs.appendChild(thumb);
      });
    }
  }


  // ============================================================
  // 9. Pick the right text (audience x length)
  // ============================================================
  // Two lengths x three audiences = up to 6 versions per location.
  // If a short version is missing for the chosen audience, we fall back
  // to the medium version so the page never goes blank.
  function pickText(loc) {
    const audience = App.getTextVariant();
    const length   = App.getTextLength();
    const longTexts  = loc.texts || {};
    const shortTexts = loc.textsShort || {};

    if (length === "short" && shortTexts[audience]) {
      return shortTexts[audience];
    }
    return longTexts[audience] || longTexts.adult || loc.description || "";
  }


  // ============================================================
  // 10. Details panel (camera + QR + metadata table)
  // ============================================================
  function renderDetailsPanel(loc) {
    // Camera info.
    if (loc.camera) {
      camFacing.textContent    = loc.camera.facing      || "—";
      camElevation.textContent = loc.camera.elevation   || "—";
      camFocal.textContent     = loc.camera.focalLength || "—";
      camShotType.textContent  = loc.camera.shotType    || "—";
      camNote.textContent      = loc.camera.angleNote   || "";
    }

    // QR code (only build it when the panel is open).
    if (App.getReadingMode() === "details") {
      App.generateLocationQR(detailsQRBox, loc);
    }

    renderMetaTable(loc);
  }

  // Build the metadata table from loc.meta.
  // The table is split into 5 sections: Location, Heritage, Scene, Tourism, Project.
  function renderMetaTable(loc) {
    if (!metaTableBody) return;
    metaTableBody.innerHTML = "";
    if (metaSources) metaSources.innerHTML = "";

    if (!loc.meta) {
      const tr = document.createElement("tr");
      tr.innerHTML = '<td colspan="2" class="meta-empty">Catalogue metadata pending for this location.</td>';
      metaTableBody.appendChild(tr);
      if (metaBlock) metaBlock.classList.add("meta-empty-state");
      return;
    }
    if (metaBlock) metaBlock.classList.remove("meta-empty-state");
    const m = loc.meta;

    // Helper: add one row (key + value).
    function row(group, vocab, label, value) {
      if (value === undefined || value === null || value === "") return;
      const tr = document.createElement("tr");
      tr.dataset.group = group;
      tr.dataset.vocab = vocab;

      const td1 = document.createElement("td");
      td1.className = "meta-key";
      td1.innerHTML = '<span class="meta-vocab-tag" title="Vocabulary: ' + vocab + '">' + vocab + '</span> ' + label;

      const td2 = document.createElement("td");
      td2.className = "meta-val";
      td2.textContent = Array.isArray(value) ? value.join(", ") : String(value);

      tr.appendChild(td1);
      tr.appendChild(td2);
      metaTableBody.appendChild(tr);
    }

    // Helper: add a section header row.
    function head(label) {
      const tr = document.createElement("tr");
      tr.className = "meta-section";
      const th = document.createElement("th");
      th.colSpan = 2;
      th.textContent = label;
      tr.appendChild(th);
      metaTableBody.appendChild(tr);
    }

    // ---- Section 1: Location ----
    head("Location");
    row("location", "schema:streetAddress",   "Address",     m.address);
    row("location", "schema:postalCode",      "Postal code", m.postal_code);
    row("location", "schema:addressLocality", "District",    m.district);
    row("location", "schema:addressLocality", "City",        m.city);
    row("location", "schema:addressCountry",  "Country",     m.country);
    if (loc.coordinates) {
      row("location", "schema:GeoCoordinates", "Lat / Lon",
          loc.coordinates[0].toFixed(4) + "°N, " + loc.coordinates[1].toFixed(4) + "°E");
    }
    if (m.wikidata) {
      // Wikidata row contains a link, so build it manually.
      const tr = document.createElement("tr");
      tr.dataset.group = "location";
      tr.dataset.vocab = "wikidata";

      const td1 = document.createElement("td");
      td1.className = "meta-key";
      const tag = document.createElement("span");
      tag.className = "meta-vocab-tag";
      tag.title = "Vocabulary: wikidata";
      tag.textContent = "wikidata";
      td1.appendChild(tag);
      td1.appendChild(document.createTextNode(" Wikidata Q-ID"));

      const td2 = document.createElement("td");
      td2.className = "meta-val";
      const a = document.createElement("a");
      a.href = "https://www.wikidata.org/wiki/" + m.wikidata;
      a.target = "_blank";
      a.rel = "noopener";
      a.textContent = m.wikidata + " ↗";
      td2.appendChild(a);

      tr.appendChild(td1);
      tr.appendChild(td2);
      metaTableBody.appendChild(tr);
    }
    row("location", "geonames:geonameId", "GeoNames", m.geonames);

    // ---- Section 2: Heritage ----
    if (m.building_type || m.year_built || m.architects || m.period || m.style || m.unesco) {
      head("Heritage");
      row("heritage", "schema:additionalType",     "Building type", m.building_type);
      row("heritage", "schema:dateCreated",        "Year built",    m.year_built);
      row("heritage", "schema:architect",          "Architect(s)",  m.architects);
      row("heritage", "dcterms:temporal",          "Period",        m.period);
      row("heritage", "schema:architecturalStyle", "Style",         m.style);
      row("heritage", "dcterms:isPartOf",          "UNESCO",        m.unesco);
    }

    // ---- Section 3: Scene ----
    head("Scene");
    if (loc.scene)  row("scene", "schema:Episode", "Scene description", loc.scene);
    if (loc.camera) {
      row("scene", "lmml:cameraFacing",    "Camera orientation", loc.camera.facing);
      row("scene", "lmml:cameraElevation", "Elevation",          loc.camera.elevation);
      row("scene", "lmml:focalLength",     "Focal length",       loc.camera.focalLength);
      row("scene", "lmml:shotType",        "Shot type",          loc.camera.shotType);
    }
    if (loc.images && loc.images.film && loc.images.film[0]) {
      row("scene", "schema:image", "Screenshot ref", loc.images.film[0].src);
    }
    row("scene", "lmml:filmRole",     "Film role",   m.film_role);
    row("scene", "lmml:shotDuration", "Screen time", m.shot_duration);

    // ---- Section 4: Tourism ----
    if (m.visit_duration || m.accessibility_notes || m.recommended_time_of_day || m.ticket) {
      head("Tourism");
      row("tourism", "schema:duration",             "Visit duration",   m.visit_duration);
      row("tourism", "schema:accessibilityFeature", "Accessibility",    m.accessibility_notes);
      row("tourism", "schema:availableTime",        "Best time of day", m.recommended_time_of_day);
      row("tourism", "schema:offers/price",         "Ticket",           m.ticket);
    }

    // ---- Section 5: Project ----
    head("Project");
    const inPursuit  = APP_DATA.pursuitLocations.some(l => l.id === loc.id);
    const inTimeline = APP_DATA.timelineLocations.some(l => l.id === loc.id);
    const cats = [];
    if (inPursuit)  cats.push("Pursuit & Passage");
    if (inTimeline) cats.push("Through Time");
    row("project", "dcterms:subject",  "Narrative category", cats);
    row("project", "dcterms:modified", "Last updated",       m.last_updated);
    row("project", "dcterms:rights",   "Rights",             m.rights);
    row("project", "dcterms:language", "Language",           m.language);

    // Sources line.
    if (m.sources && m.sources.length && metaSources) {
      const links = m.sources
        .map(s => '<a href="' + s.url + '" target="_blank" rel="noopener">' + s.label + ' ↗</a>')
        .join(" · ");
      metaSources.innerHTML = '<span class="meta-vocab-tag">dcterms:source</span> ' + links;
    }
  }


  // ============================================================
  // 11. Main location renderer
  // ============================================================
  function renderLocation(animate = true) {
    const loc = App.getActiveLocation();
    if (!loc) return;

    const isTimeline = App.getNarrative() === "timeline";
    const content    = document.getElementById("narrativeContent");
    const visual     = document.getElementById("locationVisual");

    // Quick fade-out before swapping content.
    if (animate) {
      content.style.opacity = "0";
      content.style.transform = "translateY(10px)";
      visual.style.opacity = "0.6";
    }

    setTimeout(() => {
      // Image placeholder colour + icon.
      const locColor = chapterColorMap[loc.chapter] || "rgba(74,139,181,0.1)";
      locationImagePlaceholder.style.setProperty("--location-color", locColor);
      locationImagePlaceholder.setAttribute("data-location", loc.name);
      locationImageIcon.textContent = chapterIcons[loc.chapter] || "◉";

      // Reset gallery to film tab when changing location.
      galleryType = "film";
      galleryIndex = 0;
      renderGallery(loc);

      locationFilmTag.textContent = loc.filmTag;
      locationCoords.textContent  = App.formatCoords(loc.coordinates);

      // Info panel.
      locationName.textContent = loc.name;
      locationScene.innerHTML  = "<strong>" + loc.film + "</strong> · " + loc.scene;

      const chClass = App.chapterColorClass(loc.chapter);
      locationChapterBadge.className = "chapter-badge " + chClass;
      locationChapterBadge.textContent = loc.chapter || "Featured";

      // Narrative text.
      narrativeQuote.className = "narrative-quote" + (isTimeline ? " timeline" : "");
      narrativeQuote.textContent = loc.quote;

      narrativeBody.textContent = pickText(loc);

      narrativeNoteBlock.className = "narrative-note-block" + (isTimeline ? " timeline" : "");
      narrativeNoteText.textContent = loc.narrativeNote || "";

      renderDetailsPanel(loc);
      updateChapterIntro();

      // Fade back in.
      if (animate) {
        content.style.transition = "opacity 0.35s ease, transform 0.35s ease";
        content.style.opacity    = "1";
        content.style.transform  = "translateY(0)";
        visual.style.transition  = "opacity 0.3s ease";
        visual.style.opacity     = "1";
        setTimeout(() => {
          content.style.transition = "";
          visual.style.transition  = "";
        }, 400);
      }
    }, animate ? 80 : 0);

    updateChapterStrip();
    updateDots();
    updateProgress();
    updateNavButtons();
    updateDirections();
  }


  // ============================================================
  // 12. Event listeners + init
  // ============================================================
  document.addEventListener("narrativeChanged", () => {
    updateNarrativeToggle();
    buildChapterStrip();
    buildDots();
    renderLocation(true);
  });

  document.addEventListener("locationChanged", () => {
    renderLocation(true);
  });

  document.addEventListener("textVariantChanged", () => {
    const loc = App.getActiveLocation();
    if (!loc) return;
    narrativeBody.textContent = pickText(loc);
    updateVariantUI();
  });

  document.addEventListener("textLengthChanged", () => {
    const loc = App.getActiveLocation();
    if (!loc) return;
    narrativeBody.textContent = pickText(loc);
    updateVariantUI();
  });

  document.addEventListener("readingModeChanged", () => {
    updateVariantUI();
    const loc = App.getActiveLocation();
    if (loc && App.getReadingMode() === "details") {
      App.generateLocationQR(detailsQRBox, loc);
    }
  });

  function init() {
    updateNarrativeToggle();
    buildChapterStrip();
    buildDots();
    updateVariantUI();
    renderLocation(false);
  }

  init();

});
