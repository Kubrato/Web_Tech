/*
  map.js — interactive map page.

  Uses Leaflet.js with a free CARTO Dark Matter tile layer (no API key).
  Sections:
    1. map setup
    2. marker styling
    3. sidebar detail panel
    4. sidebar list of locations
    5. select / activate one location
    6. dashed line that connects locations in narrative order
    7. add markers for the chosen filter
    8. filter buttons (All / Pursuit / Timeline)
    9. init
*/

document.addEventListener("DOMContentLoaded", () => {

  // ============================================================
  // 1. Map setup
  // ============================================================
  // If Leaflet failed to load, show a friendly message and stop.
  if (typeof L === "undefined") {
    document.getElementById("map").innerHTML =
      '<div class="map-unavailable">' +
        '<span class="map-unavailable-icon">◉</span>' +
        '<span>Map unavailable — check your internet connection and reload.</span>' +
      '</div>';
    buildSidebarList("all");
    return;
  }

  const map = L.map("map", {
    center: [41.0082, 28.9784], // Istanbul city center
    zoom: 14,
    zoomControl: false,
    attributionControl: true
  });

  L.control.zoom({ position: "bottomright" }).addTo(map);

  L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" style="color:#c9a55a">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions" style="color:#c9a55a">CARTO</a>',
    subdomains: "abcd",
    maxZoom: 19
  }).addTo(map);


  // ============================================================
  // 2. Marker styling
  // ============================================================
  let activeFilter = "all";
  let activeMarkerId = null;
  let markers = {}; // id -> { marker, data }

  const NARR_BLUE = "#4a8bb5";
  const NARR_GOLD = "#c9a55a";

  // A location can belong to one narrative or both. Pick a class accordingly.
  function getMarkerClass(narratives) {
    if (narratives.includes("pursuit") && narratives.includes("timeline")) return "both";
    if (narratives.includes("pursuit")) return "pursuit";
    return "timeline";
  }

  function getMarkerBackground(cls) {
    if (cls === "timeline") return NARR_GOLD;
    if (cls === "both") {
      return "linear-gradient(135deg, " + NARR_BLUE + " 0%, " + NARR_BLUE + " 50%, " + NARR_GOLD + " 50%, " + NARR_GOLD + " 100%)";
    }
    return NARR_BLUE;
  }

  function getMarkerGlow(cls) {
    if (cls === "timeline" || cls === "both") return NARR_GOLD;
    return NARR_BLUE;
  }

  // Build a teardrop-shaped marker as an HTML element (no image needed).
  function createMarkerIcon(cls, isActive) {
    const bg   = getMarkerBackground(cls);
    const glow = getMarkerGlow(cls);
    const size = isActive ? 36 : 28;

    const html =
      '<div style="' +
        'width:' + size + 'px;height:' + size + 'px;' +
        'border-radius:50% 50% 50% 0;' +
        'transform:rotate(-45deg);' +
        'background:' + bg + ';' +
        'border:2px solid rgba(255,255,255,' + (isActive ? 0.5 : 0.2) + ');' +
        'box-shadow:0 4px 12px rgba(0,0,0,0.5)' + (isActive ? ',0 0 0 3px ' + glow + '44' : '') + ';' +
        'display:flex;align-items:center;justify-content:center;' +
        'transition:all 0.2s ease;">' +
        '<div style="transform:rotate(45deg);color:white;font-size:' + (isActive ? 12 : 10) + 'px;line-height:1;text-shadow:0 1px 2px rgba(0,0,0,0.6);">◉</div>' +
      '</div>';

    return L.divIcon({
      html,
      className: "",
      iconSize:    [size, size],
      iconAnchor:  [size / 2, size],
      popupAnchor: [0, -size]
    });
  }


  // ============================================================
  // 3. Sidebar detail panel
  // ============================================================
  const detailPanel = document.getElementById("mapLocationDetail");
  const detailName  = document.getElementById("detailName");
  const detailFilm  = document.getElementById("detailFilm");
  const detailDesc  = document.getElementById("detailDesc");
  const detailTags  = document.getElementById("detailNarrativeTags");
  const detailLink  = document.getElementById("detailExploreLink");

  function showLocationDetail(locData) {
    detailName.textContent = locData.name;
    detailFilm.textContent = locData.films.join(" · ");

    // Find the short description from pursuit or timeline data.
    let desc = "";
    if (locData.narratives.includes("pursuit")) {
      const pLoc = APP_DATA.pursuitLocations.find(l => l.name === locData.name);
      if (pLoc && pLoc.texts) desc = pLoc.texts.brief;
    }
    if (!desc && locData.narratives.includes("timeline")) {
      const tLoc = APP_DATA.timelineLocations.find(l => l.name === locData.name);
      if (tLoc && tLoc.texts) desc = tLoc.texts.brief;
    }
    detailDesc.textContent = desc || "A key filming location in Istanbul's cinematic geography.";

    // Narrative tags.
    detailTags.innerHTML = "";
    locData.narratives.forEach(n => {
      const tag = document.createElement("span");
      tag.className = "popup-tag " + n;
      tag.textContent = n === "pursuit" ? "◈ Pursuit" : "◇ Timeline";
      detailTags.appendChild(tag);
    });

    // "Open in Explore" link: set the narrative + index, then go.
    detailLink.addEventListener("click", (e) => {
      e.preventDefault();
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


  // ============================================================
  // 4. Sidebar list of locations
  // ============================================================
  const locationList = document.getElementById("mapLocationList");

  function buildSidebarList(filter) {
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
      item.innerHTML =
        '<div class="map-location-name">' + loc.name + '</div>' +
        '<div class="map-location-films">' + loc.films.join(" · ") + '</div>';
      item.addEventListener("click", () => selectLocation(loc.id));
      locationList.appendChild(item);
    });
  }

  function updateSidebarActive(id) {
    document.querySelectorAll(".map-location-item").forEach(item => {
      item.classList.toggle("active", item.dataset.id === id);
    });
  }


  // ============================================================
  // 5. Select / activate one location
  // ============================================================
  function selectLocation(id) {
    const locData = APP_DATA.mapLocations.find(l => l.id === id);
    if (!locData) return;

    // Reset the previously active marker (if any).
    if (activeMarkerId && markers[activeMarkerId]) {
      const prev = markers[activeMarkerId];
      prev.marker.setIcon(createMarkerIcon(getMarkerClass(prev.data.narratives), false));
    }

    // Highlight + center on the new one.
    if (markers[id]) {
      markers[id].marker.setIcon(createMarkerIcon(getMarkerClass(locData.narratives), true));
      map.setView(locData.coordinates, Math.max(map.getZoom(), 15), { animate: true });
      markers[id].marker.openPopup();
    }

    activeMarkerId = id;
    updateSidebarActive(id);
    showLocationDetail(locData);
  }


  // ============================================================
  // 6. Dashed line that connects locations in narrative order
  // ============================================================
  // Pursuit goes 1 -> 12, Timeline goes 1 -> 16. The "all" filter mixes
  // both narratives so there is no single order — the line is hidden.
  let routeLine = null;

  function drawRoute(filter) {
    if (routeLine) {
      map.removeLayer(routeLine);
      routeLine = null;
    }
    if (filter !== "pursuit" && filter !== "timeline") return;

    const ordered = filter === "pursuit"
      ? APP_DATA.pursuitLocations
      : APP_DATA.timelineLocations;
    const path  = ordered.map(l => l.coordinates);
    const color = filter === "pursuit" ? NARR_BLUE : NARR_GOLD;

    routeLine = L.polyline(path, {
      color,
      weight: 3,
      opacity: 0.65,
      dashArray: "6 8",
      lineCap: "round",
      lineJoin: "round",
      interactive: false
    }).addTo(map);
    routeLine.bringToBack();
  }


  // ============================================================
  // 7. Add markers for the chosen filter
  // ============================================================
  function addMarkers(filter) {
    // Remove old markers first.
    Object.values(markers).forEach(({ marker }) => map.removeLayer(marker));
    markers = {};

    const filtered = APP_DATA.mapLocations.filter(loc => {
      if (filter === "all") return true;
      return loc.narratives.includes(filter);
    });

    filtered.forEach(loc => {
      const cls      = getMarkerClass(loc.narratives);
      const isActive = loc.id === activeMarkerId;
      const icon     = createMarkerIcon(cls, isActive);

      const marker = L.marker(loc.coordinates, { icon, title: loc.name }).addTo(map);

      const popupContent =
        '<div>' +
          '<div class="popup-location-name">' + loc.name + '</div>' +
          '<div class="popup-film-tag">' + loc.films.join(" · ") + '</div>' +
          '<div class="popup-narrative-tags">' +
            loc.narratives.map(n =>
              '<span class="popup-tag ' + n + '">' + (n === "pursuit" ? "◈ Pursuit" : "◇ Timeline") + '</span>'
            ).join("") +
          '</div>' +
        '</div>';

      marker.bindPopup(popupContent, { maxWidth: 280, className: "cinema-popup" });
      marker.on("click", () => selectLocation(loc.id));

      markers[loc.id] = { marker, data: loc };
    });
  }


  // ============================================================
  // 8. Filter buttons (All / Pursuit / Timeline)
  // ============================================================
  const filterAll       = document.getElementById("filterAll");
  const filterEspionage = document.getElementById("filterEspionage"); // filters on "pursuit"
  const filterTimeline  = document.getElementById("filterTimeline");

  function clearFilterActive() {
    filterAll.className       = "map-filter-pill";
    filterEspionage.className = "map-filter-pill";
    filterTimeline.className  = "map-filter-pill";
  }

  function applyFilter(name, button, activeClass) {
    clearFilterActive();
    button.className = "map-filter-pill " + activeClass;
    activeFilter = name;
    addMarkers(name);
    drawRoute(name);
    buildSidebarList(name);
    hideLocationDetail();
    activeMarkerId = null;
  }

  filterAll.addEventListener("click",       () => applyFilter("all",      filterAll,       "active-all"));
  filterEspionage.addEventListener("click", () => applyFilter("pursuit",  filterEspionage, "active-espionage"));
  filterTimeline.addEventListener("click",  () => applyFilter("timeline", filterTimeline,  "active-timeline"));


  // ============================================================
  // 9. Init
  // ============================================================
  buildSidebarList("all");
  addMarkers("all");
  drawRoute("all");

  // Auto-select the first location after a short delay so the sidebar
  // panel has something to show on first paint.
  setTimeout(() => {
    if (APP_DATA.mapLocations.length > 0) {
      selectLocation(APP_DATA.mapLocations[0].id);
    }
  }, 600);

  // Recalculate map size on window resize and once after layout settles
  // (Leaflet sometimes mis-sizes when placed inside flex containers).
  window.addEventListener("resize", () => map.invalidateSize());
  setTimeout(() => map.invalidateSize(), 100);

});
