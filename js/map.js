/**
 * Istanbul Cinema Tourism — Interactive Map
 * Uses Leaflet.js with CARTO Dark Matter tiles (no API key required)
 */

document.addEventListener("DOMContentLoaded", () => {

  // ─── MAP INIT ────────────────────────────────────────────────────────────────
  // Bail out clearly if Leaflet didn't load
  if (typeof L === "undefined") {
    document.getElementById("map").innerHTML =
      '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#9090a8;font-size:0.9rem;flex-direction:column;gap:12px;">' +
      '<span style="font-size:2rem;">◉</span>' +
      '<span>Map unavailable — check your internet connection and reload.</span></div>';
    buildSidebarList("all");
    return;
  }

  const map = L.map("map", {
    center: [41.0082, 28.9784],  // Istanbul city center
    zoom: 14,
    zoomControl: false,
    attributionControl: true
  });

  // Add zoom control in a better position
  L.control.zoom({ position: "bottomright" }).addTo(map);

  // Dark tile layer (CARTO Dark Matter — free, no API key)
  L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" style="color:#c9a55a">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions" style="color:#c9a55a">CARTO</a>',
    subdomains: "abcd",
    maxZoom: 19
  }).addTo(map);

  // ─── STATE ───────────────────────────────────────────────────────────────────
  let activeFilter = "all";
  let activeMarkerId = null;
  let markers = {};  // id → { marker, data }

  // ─── MARKER CREATION ─────────────────────────────────────────────────────────
  function getMarkerClass(narratives) {
    if (narratives.includes("espionage") && narratives.includes("timeline")) return "both";
    if (narratives.includes("espionage")) return "espionage";
    return "timeline";
  }

  function getMarkerColor(narrativeClass) {
    const colors = {
      espionage: "#4a8bb5",
      timeline:  "#c9a55a",
      both:      "#8a7a9a"
    };
    return colors[narrativeClass] || "#4a8bb5";
  }

  function createMarkerIcon(narrativeClass, isActive = false) {
    const color = getMarkerColor(narrativeClass);
    const size  = isActive ? 36 : 28;
    const html  = `
      <div style="
        width:${size}px;height:${size}px;
        border-radius:50% 50% 50% 0;
        transform:rotate(-45deg);
        background:${color};
        border:2px solid rgba(255,255,255,${isActive ? 0.5 : 0.2});
        box-shadow:0 4px 12px rgba(0,0,0,0.5)${isActive ? ",0 0 0 3px " + color + "44" : ""};
        display:flex;align-items:center;justify-content:center;
        transition:all 0.2s ease;
      ">
        <div style="transform:rotate(45deg);color:white;font-size:${isActive ? 12 : 10}px;line-height:1;">◉</div>
      </div>`;
    return L.divIcon({
      html,
      className: "",
      iconSize:   [size, size],
      iconAnchor: [size / 2, size],
      popupAnchor: [0, -size]
    });
  }

  // ─── SIDEBAR DETAIL PANEL ─────────────────────────────────────────────────────
  const detailPanel   = document.getElementById("mapLocationDetail");
  const detailName    = document.getElementById("detailName");
  const detailFilm    = document.getElementById("detailFilm");
  const detailDesc    = document.getElementById("detailDesc");
  const detailTags    = document.getElementById("detailNarrativeTags");
  const detailLink    = document.getElementById("detailExploreLink");

  function showLocationDetail(locData) {
    detailName.textContent = locData.name;
    detailFilm.textContent = locData.films.join(" · ");

    // Find description from espionage or timeline data
    let desc = "";
    if (locData.narratives.includes("espionage")) {
      const espLoc = APP_DATA.espionageLocations.find(l => {
        return l.name === locData.name;
      });
      if (espLoc) desc = espLoc.description.substring(0, 180) + "…";
    }
    if (!desc && locData.narratives.includes("timeline")) {
      const timeLoc = APP_DATA.timelineLocations.find(l => l.name === locData.name);
      if (timeLoc) desc = timeLoc.description.substring(0, 180) + "…";
    }
    detailDesc.textContent = desc || "A key filming location in Istanbul's cinematic geography.";

    // Narrative tags
    detailTags.innerHTML = "";
    locData.narratives.forEach(n => {
      const tag = document.createElement("span");
      tag.className = `popup-tag ${n}`;
      tag.textContent = n === "espionage" ? "◈ Espionage" : "◇ Timeline";
      detailTags.appendChild(tag);
    });

    // Update explore link — try to set the right narrative + location index
    detailLink.addEventListener("click", (e) => {
      e.preventDefault();
      // Set to first narrative that has this location
      if (locData.narratives.length > 0) {
        const narrativeId = locData.narratives[0];
        App.setNarrative(narrativeId);
        const locs = App.getLocations();
        const idx  = locs.findIndex(l => l.name === locData.name);
        if (idx !== -1) App.setLocationIndex(idx);
      }
      window.location.href = "explore.html";
    }, { once: true });

    detailPanel.classList.remove("hidden");
  }

  function hideLocationDetail() {
    detailPanel.classList.add("hidden");
  }

  // ─── POPULATE SIDEBAR LIST ────────────────────────────────────────────────────
  const locationList = document.getElementById("mapLocationList");

  function buildSidebarList(filter = "all") {
    locationList.innerHTML = "";
    const filtered = APP_DATA.mapLocations.filter(loc => {
      if (filter === "all") return true;
      return loc.narratives.includes(filter);
    });

    filtered.forEach(loc => {
      const item = document.createElement("div");
      item.className = "map-location-item";
      item.setAttribute("role", "listitem");
      item.dataset.id = loc.id;
      item.innerHTML = `
        <div class="map-location-name">${loc.name}</div>
        <div class="map-location-films">${loc.films.join(" · ")}</div>
      `;
      item.addEventListener("click", () => selectLocation(loc.id));
      locationList.appendChild(item);
    });
  }

  function updateSidebarActive(id) {
    document.querySelectorAll(".map-location-item").forEach(item => {
      item.classList.toggle("active", item.dataset.id === id);
    });
  }

  // ─── SELECT LOCATION ─────────────────────────────────────────────────────────
  function selectLocation(id) {
    const locData = APP_DATA.mapLocations.find(l => l.id === id);
    if (!locData) return;

    // Update active marker
    if (activeMarkerId && markers[activeMarkerId]) {
      const prev = markers[activeMarkerId];
      prev.marker.setIcon(createMarkerIcon(getMarkerClass(prev.data.narratives), false));
    }

    if (markers[id]) {
      markers[id].marker.setIcon(createMarkerIcon(getMarkerClass(locData.narratives), true));
      map.setView(locData.coordinates, Math.max(map.getZoom(), 15), { animate: true });
      markers[id].marker.openPopup();
    }

    activeMarkerId = id;
    updateSidebarActive(id);
    showLocationDetail(locData);
  }

  // ─── ADD MARKERS ─────────────────────────────────────────────────────────────
  function addMarkers(filter = "all") {
    // Clear existing
    Object.values(markers).forEach(({ marker }) => map.removeLayer(marker));
    markers = {};

    const filtered = APP_DATA.mapLocations.filter(loc => {
      if (filter === "all") return true;
      return loc.narratives.includes(filter);
    });

    filtered.forEach(loc => {
      const narrativeClass = getMarkerClass(loc.narratives);
      const isActive = loc.id === activeMarkerId;
      const icon     = createMarkerIcon(narrativeClass, isActive);

      const marker = L.marker(loc.coordinates, { icon, title: loc.name }).addTo(map);

      // Popup content
      const popupContent = `
        <div>
          <div class="popup-location-name">${loc.name}</div>
          <div class="popup-film-tag">${loc.films.join(" · ")}</div>
          <div class="popup-narrative-tags">
            ${loc.narratives.map(n =>
              `<span class="popup-tag ${n}">${n === "espionage" ? "◈ Espionage" : "◇ Timeline"}</span>`
            ).join("")}
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        maxWidth: 280,
        className: "cinema-popup"
      });

      marker.on("click", () => selectLocation(loc.id));

      markers[loc.id] = { marker, data: loc };
    });
  }

  // ─── FILTER CONTROLS ─────────────────────────────────────────────────────────
  const filterAll       = document.getElementById("filterAll");
  const filterEspionage = document.getElementById("filterEspionage");
  const filterTimeline  = document.getElementById("filterTimeline");

  function clearFilterActive() {
    filterAll.className       = "map-filter-pill";
    filterEspionage.className = "map-filter-pill";
    filterTimeline.className  = "map-filter-pill";
  }

  filterAll.addEventListener("click", () => {
    clearFilterActive();
    filterAll.className = "map-filter-pill active-all";
    activeFilter = "all";
    addMarkers("all");
    buildSidebarList("all");
    hideLocationDetail();
    activeMarkerId = null;
  });

  filterEspionage.addEventListener("click", () => {
    clearFilterActive();
    filterEspionage.className = "map-filter-pill active-espionage";
    activeFilter = "espionage";
    addMarkers("espionage");
    buildSidebarList("espionage");
    hideLocationDetail();
    activeMarkerId = null;
  });

  filterTimeline.addEventListener("click", () => {
    clearFilterActive();
    filterTimeline.className = "map-filter-pill active-timeline";
    activeFilter = "timeline";
    addMarkers("timeline");
    buildSidebarList("timeline");
    hideLocationDetail();
    activeMarkerId = null;
  });

  // ─── INIT ────────────────────────────────────────────────────────────────────
  buildSidebarList("all");
  addMarkers("all");

  // If a narrative is already selected, highlight filter
  const currentNarrative = App.getNarrative();
  if (currentNarrative === "espionage") {
    // Don't auto-filter, just note it
  }

  // Auto-select first location after a short delay for UX
  setTimeout(() => {
    if (APP_DATA.mapLocations.length > 0) {
      selectLocation(APP_DATA.mapLocations[0].id);
    }
  }, 600);

  // Invalidate map size on window resize (fixes Leaflet tile issues)
  window.addEventListener("resize", () => map.invalidateSize());

  // Force size recalculation after layout settles (fixes flex-container height bug)
  setTimeout(() => map.invalidateSize(), 100);

});
