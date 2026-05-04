/**
 * Istanbul Cinema Tourism — Explore Page Logic
 *
 * Handles:
 *   - narrative switching (Espionage ↔ Timeline)
 *   - location navigation (prev/next, dots, chapter strip)
 *   - text variant switching (brief/mid/long) — PDF p.15 length+competence
 *   - reading mode toggle (story/details) — PDF p.15 play/details
 *   - chapter intro banner rendering — PDF p.9 transition texts
 *   - QR code generation per location — PDF p.8
 *   - camera/shot metadata rendering — PDF p.8 (exact location + orientation)
 *   - JSON-LD per-location metadata injection
 */

document.addEventListener("DOMContentLoaded", () => {

  // ─── ELEMENT REFS ─────────────────────────────────────────────────────────────
  const toggleEspionage    = document.getElementById("toggleEspionage");
  const toggleTimeline     = document.getElementById("toggleTimeline");
  const chapterStrip       = document.getElementById("chapterStrip");
  const chapterIntroBanner = document.getElementById("chapterIntroBanner");
  const chapterIntroChap   = document.getElementById("chapterIntroChapter");
  const chapterIntroText   = document.getElementById("chapterIntroText");

  const locationDots       = document.getElementById("locationDots");
  const btnPrev            = document.getElementById("btnPrev");
  const btnNext            = document.getElementById("btnNext");
  const progressText       = document.getElementById("progressText");
  const progressFill       = document.getElementById("progressFill");
  const counterFraction    = document.getElementById("counterFraction");
  const navNarrativeDot    = document.getElementById("navNarrativeDot");
  const navNarrativeName   = document.getElementById("navNarrativeName");

  // Location display
  const locationImagePlaceholder = document.getElementById("locationImagePlaceholder");
  const locationImageEl          = document.getElementById("locationImage");
  const locationImageIcon        = document.getElementById("locationImageIcon");
  const locationFilmTag          = document.getElementById("locationFilmTag");
  const locationCoords           = document.getElementById("locationCoords");
  const locationName             = document.getElementById("locationName");
  const locationScene            = document.getElementById("locationScene");
  const locationChapterBadge     = document.getElementById("locationChapterBadge");

  // Narrative panel
  const narrativeQuote     = document.getElementById("narrativeQuote");
  const narrativeBody      = document.getElementById("narrativeBody");
  const narrativeNoteBlock = document.getElementById("narrativeNoteBlock");
  const narrativeNoteText  = document.getElementById("narrativeNoteText");

  // Variant + mode controls
  const btnTellLess    = document.getElementById("btnTellLess");
  const btnTellMore    = document.getElementById("btnTellMore");
  const btnSimpler     = document.getElementById("btnSimpler");
  const btnHarder      = document.getElementById("btnHarder");
  const btnModeStory   = document.getElementById("btnModeStory");
  const btnModeDetails = document.getElementById("btnModeDetails");
  const variantIndicator = document.getElementById("variantIndicator");

  // Details panel (QR + camera)
  const detailsPanel = document.getElementById("detailsPanel");
  const detailsQRBox = document.getElementById("detailsQRBox");
  const camFacing    = document.getElementById("camFacing");
  const camElevation = document.getElementById("camElevation");
  const camFocal     = document.getElementById("camFocal");
  const camShotType  = document.getElementById("camShotType");
  const camNote      = document.getElementById("camNote");

  // ─── ICON MAPS ─────────────────────────────────────────────────────────────────
  const chapterIcons = {
    "Surveillance":  "◎",
    "Escape":        "↗",
    "Hideouts":      "◈",
    "Confrontation": "✦",
    "1960s":         "◇",
    "2012":          "◆",
    "2016":          "◉"
  };

  const chapterColorMap = {
    "Surveillance":  "rgba(74,139,181,0.15)",
    "Escape":        "rgba(154,106,42,0.15)",
    "Hideouts":      "rgba(106,58,122,0.15)",
    "Confrontation": "rgba(154,53,53,0.15)",
    "1960s":         "rgba(90,138,90,0.15)",
    "2012":          "rgba(74,139,181,0.15)",
    "2016":          "rgba(201,165,90,0.15)"
  };

  // ─── NARRATIVE TOGGLE ──────────────────────────────────────────────────────────
  function updateNarrativeToggle() {
    const id = App.getNarrative();
    toggleEspionage.classList.toggle("active", id === "espionage");
    toggleTimeline.classList.toggle("active",  id === "timeline");
    toggleEspionage.setAttribute("aria-pressed", String(id === "espionage"));
    toggleTimeline.setAttribute("aria-pressed",  String(id === "timeline"));

    navNarrativeDot.classList.toggle("timeline", id === "timeline");
    navNarrativeName.textContent = id === "espionage" ? "Espionage & Pursuit" : "Through Time";
  }

  toggleEspionage.addEventListener("click", () => {
    if (App.getNarrative() !== "espionage") App.setNarrative("espionage");
  });
  toggleTimeline.addEventListener("click", () => {
    if (App.getNarrative() !== "timeline") App.setNarrative("timeline");
  });

  // ─── CHAPTER STRIP ────────────────────────────────────────────────────────────
  function buildChapterStrip() {
    chapterStrip.innerHTML = "";
    const locs = App.getLocations();
    const seen = new Set();
    const chapters = [];
    locs.forEach(loc => {
      if (loc.chapter && !seen.has(loc.chapter)) {
        seen.add(loc.chapter);
        chapters.push(loc.chapter);
      }
    });
    chapters.forEach((chapter, i) => {
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
      item.setAttribute("aria-label", `Go to chapter: ${chapter}`);
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
      item.classList.toggle("active", item.dataset.chapter === current?.chapter);
    });
  }

  // Chapter intro banner — shows only on the FIRST location of each chapter.
  function updateChapterIntro() {
    const loc  = App.getActiveLocation();
    const locs = App.getLocations();
    const idx  = App.getLocationIndex();
    const isFirstOfChapter = idx === 0 || locs[idx - 1].chapter !== loc.chapter;
    const intros = App.getNarrativeData().chapterIntros || {};
    if (isFirstOfChapter && intros[loc.chapter]) {
      chapterIntroChap.textContent = loc.chapter;
      chapterIntroText.textContent = intros[loc.chapter];
      chapterIntroBanner.classList.remove("hidden");
    } else {
      chapterIntroBanner.classList.add("hidden");
    }
  }

  // ─── DOTS NAVIGATION ─────────────────────────────────────────────────────────
  function buildDots() {
    locationDots.innerHTML = "";
    const locs = App.getLocations();
    locs.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.className = "location-dot";
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", `Location ${i + 1}: ${locs[i].name}`);
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

  // ─── PROGRESS ────────────────────────────────────────────────────────────────
  function updateProgress() {
    const locs = App.getLocations();
    const idx  = App.getLocationIndex();
    const pct  = ((idx + 1) / locs.length) * 100;
    progressFill.style.width = `${pct}%`;
    progressFill.parentElement.setAttribute("aria-valuenow", Math.round(pct));
    progressText.textContent    = `${idx + 1} / ${locs.length}`;
    counterFraction.textContent = `${idx + 1} / ${locs.length}`;
  }

  // ─── NAV BUTTONS ──────────────────────────────────────────────────────────────
  function updateNavButtons() {
    const locs = App.getLocations();
    const idx  = App.getLocationIndex();
    btnPrev.disabled = idx <= 0;
    btnNext.disabled = idx >= locs.length - 1;
  }
  btnPrev.addEventListener("click", () => App.goPrev());
  btnNext.addEventListener("click", () => App.goNext());

  // Keyboard navigation — arrows advance location
  document.addEventListener("keydown", (e) => {
    // Skip if user is typing in a form control
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      if (!btnNext.disabled) App.goNext();
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      if (!btnPrev.disabled) App.goPrev();
    }
  });

  // ─── VARIANT + MODE CONTROLS ─────────────────────────────────────────────────
  // Length axis: brief → mid → long
  btnTellMore.addEventListener("click", () => App.cycleTextVariant(+1));
  btnTellLess.addEventListener("click", () => App.cycleTextVariant(-1));
  // Competence axis mapped onto same 3-variant scale (the variants are diagonal
  // on the length × competence grid: brief=intro/young, long=scholar/advanced).
  btnSimpler.addEventListener("click", () => App.cycleTextVariant(-1));
  btnHarder.addEventListener("click",  () => App.cycleTextVariant(+1));

  btnModeStory.addEventListener("click", () => App.setReadingMode("story"));
  btnModeDetails.addEventListener("click", () => App.setReadingMode("details"));

  function updateVariantUI() {
    const v    = App.getTextVariant();
    const mode = App.getReadingMode();
    const idx  = App.VARIANT_ORDER.indexOf(v);

    variantIndicator.textContent = v.toUpperCase();
    btnTellLess.disabled = idx <= 0;
    btnTellMore.disabled = idx >= App.VARIANT_ORDER.length - 1;
    btnSimpler.disabled  = idx <= 0;
    btnHarder.disabled   = idx >= App.VARIANT_ORDER.length - 1;

    btnModeStory.classList.toggle("active",   mode === "story");
    btnModeDetails.classList.toggle("active", mode === "details");
    btnModeStory.setAttribute("aria-pressed",   String(mode === "story"));
    btnModeDetails.setAttribute("aria-pressed", String(mode === "details"));

    detailsPanel.classList.toggle("hidden", mode !== "details");
  }

  // ─── DETAILS PANEL (QR + camera) ─────────────────────────────────────────────
  function renderDetailsPanel(loc) {
    // Camera specs
    if (loc.camera) {
      camFacing.textContent    = loc.camera.facing    || "—";
      camElevation.textContent = loc.camera.elevation || "—";
      camFocal.textContent     = loc.camera.focalLength || "—";
      camShotType.textContent  = loc.camera.shotType  || "—";
      camNote.textContent      = loc.camera.angleNote || "";
    }
    // QR code — regenerated per location
    if (App.getReadingMode() === "details") {
      App.generateLocationQR(detailsQRBox, loc);
    }
  }

  // ─── LOCATION DISPLAY ────────────────────────────────────────────────────────
  function renderLocation(animate = true) {
    const loc = App.getActiveLocation();
    if (!loc) return;

    const isTimeline = App.getNarrative() === "timeline";
    const content    = document.getElementById("narrativeContent");
    const visual     = document.getElementById("locationVisual");

    if (animate) {
      content.style.opacity = "0";
      content.style.transform = "translateY(10px)";
      visual.style.opacity   = "0.6";
    }

    setTimeout(() => {
      // ── Image placeholder / real image ──
      const locColor = chapterColorMap[loc.chapter] || "rgba(74,139,181,0.1)";
      locationImagePlaceholder.style.setProperty("--location-color", locColor);
      locationImagePlaceholder.setAttribute("data-location", loc.name);
      locationImageIcon.textContent = chapterIcons[loc.chapter] || "◉";

      // If images.primary.src resolves to an existing file, swap in; otherwise fallback.
      if (loc.images && loc.images.primary && loc.images.primary.src) {
        locationImageEl.src = loc.images.primary.src;
        locationImageEl.alt = loc.images.primary.alt || loc.name;
        locationImageEl.onload  = () => { locationImageEl.style.display = "block"; };
        locationImageEl.onerror = () => { locationImageEl.style.display = "none"; };
      } else {
        locationImageEl.style.display = "none";
      }

      locationFilmTag.textContent = loc.filmTag;
      locationCoords.textContent  = App.formatCoords(loc.coordinates);

      // ── Info panel ──
      locationName.textContent = loc.name;
      locationScene.innerHTML  = `<strong>${loc.film}</strong> · ${loc.scene}`;

      const chClass = App.chapterColorClass(loc.chapter);
      locationChapterBadge.className = `chapter-badge ${chClass}`;
      locationChapterBadge.textContent = loc.chapter || "Featured";

      // ── Narrative panel: pick text variant per App state ──
      narrativeQuote.className = `narrative-quote${isTimeline ? " timeline" : ""}`;
      narrativeQuote.textContent = loc.quote;

      const variant = App.getTextVariant();
      const texts = loc.texts || {};
      narrativeBody.textContent = texts[variant] || texts.mid || loc.description || "";

      narrativeNoteBlock.className = `narrative-note-block${isTimeline ? " timeline" : ""}`;
      narrativeNoteText.textContent = loc.narrativeNote || "";

      // ── Details panel ──
      renderDetailsPanel(loc);

      // ── Chapter intro banner ──
      updateChapterIntro();

      // ── Inject per-location JSON-LD ──
      App.injectJSONLD("jsonld-location", App.locationJSONLD(loc));

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
  }

  // ─── EVENT LISTENERS ──────────────────────────────────────────────────────────
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
    // Re-render just the body text + variant indicator
    const loc = App.getActiveLocation();
    if (!loc) return;
    const v = App.getTextVariant();
    narrativeBody.textContent = (loc.texts && loc.texts[v]) || loc.description || "";
    updateVariantUI();
  });

  document.addEventListener("readingModeChanged", () => {
    updateVariantUI();
    const loc = App.getActiveLocation();
    if (loc && App.getReadingMode() === "details") {
      App.generateLocationQR(detailsQRBox, loc);
    }
  });

  // ─── INIT ─────────────────────────────────────────────────────────────────────
  function init() {
    updateNarrativeToggle();
    buildChapterStrip();
    buildDots();
    updateVariantUI();
    renderLocation(false);
  }

  init();

});
