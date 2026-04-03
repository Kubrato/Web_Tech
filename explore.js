/**
 * Istanbul Cinema Tourism — Explore Page Logic
 * Handles: narrative switching, location navigation, UI updates
 */

document.addEventListener("DOMContentLoaded", () => {

  // ─── ELEMENT REFS ─────────────────────────────────────────────────────────────
  const toggleEspionage    = document.getElementById("toggleEspionage");
  const toggleTimeline     = document.getElementById("toggleTimeline");
  const chapterStrip       = document.getElementById("chapterStrip");
  const locationDots       = document.getElementById("locationDots");
  const btnPrev            = document.getElementById("btnPrev");
  const btnNext            = document.getElementById("btnNext");
  const progressText       = document.getElementById("progressText");
  const progressFill       = document.getElementById("progressFill");
  const counterFraction    = document.getElementById("counterFraction");
  const navNarrativeDot    = document.getElementById("navNarrativeDot");
  const navNarrativeName   = document.getElementById("navNarrativeName");

  // Location display elements
  const locationImagePlaceholder = document.getElementById("locationImagePlaceholder");
  const locationImageIcon        = document.getElementById("locationImageIcon");
  const locationFilmTag          = document.getElementById("locationFilmTag");
  const locationCoords           = document.getElementById("locationCoords");
  const locationName             = document.getElementById("locationName");
  const locationScene            = document.getElementById("locationScene");
  const locationChapterBadge     = document.getElementById("locationChapterBadge");
  const narrativeQuote           = document.getElementById("narrativeQuote");
  const narrativeBody            = document.getElementById("narrativeBody");
  const narrativeNoteBlock       = document.getElementById("narrativeNoteBlock");
  const narrativeNoteText        = document.getElementById("narrativeNoteText");

  // ─── CHAPTER ICON MAP ──────────────────────────────────────────────────────────
  const chapterIcons = {
    "Surveillance":  "◎",
    "Escape":        "↗",
    "Hideouts":      "◈",
    "Confrontation": "✦",
    "1960s":         "◇",
    "2012":          "◆",
    "2016":          "◉"
  };

  const locationIcons = [
    "◎", "◈", "↗", "◉", "◆", "◇", "✦", "⊕", "◎", "◈", "◉"
  ];

  // ─── NARRATIVE TOGGLE ──────────────────────────────────────────────────────────
  function updateNarrativeToggle() {
    const id = App.getNarrative();
    toggleEspionage.classList.toggle("active", id === "espionage");
    toggleTimeline.classList.toggle("active",  id === "timeline");
    toggleEspionage.setAttribute("aria-pressed", String(id === "espionage"));
    toggleTimeline.setAttribute("aria-pressed",  String(id === "timeline"));

    // Update nav badge
    if (id === "espionage") {
      navNarrativeDot.classList.remove("timeline");
      navNarrativeName.textContent = "Espionage & Pursuit";
    } else {
      navNarrativeDot.classList.add("timeline");
      navNarrativeName.textContent = "Through Time";
    }
  }

  toggleEspionage.addEventListener("click", () => {
    if (App.getNarrative() !== "espionage") {
      App.setNarrative("espionage");
    }
  });

  toggleTimeline.addEventListener("click", () => {
    if (App.getNarrative() !== "timeline") {
      App.setNarrative("timeline");
    }
  });

  // ─── CHAPTER STRIP ────────────────────────────────────────────────────────────
  function buildChapterStrip() {
    chapterStrip.innerHTML = "";
    const locs = App.getLocations();
    const narrative = App.getNarrativeData();

    // Get unique chapters in order
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
        // Jump to first location of this chapter
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
    progressText.textContent   = `${idx + 1} / ${locs.length}`;
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

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      if (!btnNext.disabled) App.goNext();
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      if (!btnPrev.disabled) App.goPrev();
    }
  });

  // ─── LOCATION DISPLAY ────────────────────────────────────────────────────────
  const chapterColorMap = {
    "Surveillance":  "rgba(74,139,181,0.15)",
    "Escape":        "rgba(154,106,42,0.15)",
    "Hideouts":      "rgba(106,58,122,0.15)",
    "Confrontation": "rgba(154,53,53,0.15)",
    "1960s":         "rgba(90,138,90,0.15)",
    "2012":          "rgba(74,139,181,0.15)",
    "2016":          "rgba(201,165,90,0.15)"
  };

  function renderLocation(animate = true) {
    const loc = App.getActiveLocation();
    if (!loc) return;

    const isTimeline = App.getNarrative() === "timeline";

    // Animate out then in
    const content = document.getElementById("narrativeContent");
    const visual   = document.getElementById("locationVisual");

    if (animate) {
      content.style.opacity = "0";
      content.style.transform = "translateY(10px)";
      visual.style.opacity   = "0.6";
    }

    setTimeout(() => {
      // ── Image placeholder ──
      const locColor = chapterColorMap[loc.chapter] || "rgba(74,139,181,0.1)";
      locationImagePlaceholder.style.setProperty("--location-color", locColor);
      locationImagePlaceholder.setAttribute("data-location", loc.name);
      locationImageIcon.textContent = chapterIcons[loc.chapter] || "◉";

      locationFilmTag.textContent = loc.filmTag;
      locationCoords.textContent  = App.formatCoords(loc.coordinates);

      // ── Info panel ──
      locationName.textContent = loc.name;
      locationScene.innerHTML  = `<strong>${loc.film}</strong> · ${loc.scene}`;

      // Chapter badge
      const chClass = App.chapterColorClass(loc.chapter);
      locationChapterBadge.className = `chapter-badge ${chClass}`;
      locationChapterBadge.textContent = loc.chapter || "Featured";

      // ── Narrative panel ──
      narrativeQuote.className = `narrative-quote${isTimeline ? " timeline" : ""}`;
      narrativeQuote.textContent = loc.quote;

      narrativeBody.textContent = loc.description;

      narrativeNoteBlock.className = `narrative-note-block${isTimeline ? " timeline" : ""}`;
      narrativeNoteText.textContent = loc.narrativeNote;

      // Animate in
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

    // Update chapter strip, dots, progress, buttons
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

  // ─── INIT ─────────────────────────────────────────────────────────────────────
  function init() {
    updateNarrativeToggle();
    buildChapterStrip();
    buildDots();
    renderLocation(false);
  }

  init();

});
