// map.js — code for the interactive Map page
// I use Leaflet.js (a free map library) and CARTO's free dark map tiles.

document.addEventListener("DOMContentLoaded", function() {

  // ===== 1. Set up the map =====
  // If Leaflet did not load (no internet, etc.), show a message and stop.
  if (typeof L === "undefined") {
    document.getElementById("map").innerHTML =
      '<div class="map-unavailable">' +
        '<span class="map-unavailable-icon">◉</span>' +
        '<span>Map unavailable — check your internet connection and reload.</span>' +
      '</div>';
    return;
  }

  // Create the map and centre it on Istanbul.
  var map = L.map("map", {
    center: [41.0082, 28.9784],
    zoom: 14,
    zoomControl: false
  });

  // Move the zoom buttons to the bottom-right corner.
  L.control.zoom({ position: "bottomright" }).addTo(map);

  // Add the dark tile layer (CARTO Dark Matter — free, no API key).
  L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" style="color:#c9a55a">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions" style="color:#c9a55a">CARTO</a>',
    subdomains: "abcd",
    maxZoom: 19
  }).addTo(map);


  // ===== 2. Marker style =====
  // Each marker is a simple coloured circle.
  // Blue for Pursuit, gold for Timeline, and a mid-tone for locations
  // that appear in both narratives.

  var NARR_BLUE = "#4a8bb5";
  var NARR_GOLD = "#c9a55a";
  var NARR_BOTH = "#8a8a6a";

  var activeMarkerId = null;
  var markers = {};   // I store markers by location id

  // Pick a colour for a marker based on which narratives it is in.
  function getMarkerColor(narratives) {
    var hasPursuit  = narratives.indexOf("pursuit") !== -1;
    var hasTimeline = narratives.indexOf("timeline") !== -1;
    if (hasPursuit && hasTimeline) return NARR_BOTH;
    if (hasPursuit) return NARR_BLUE;
    return NARR_GOLD;
  }


  // ===== 3. Sidebar detail panel =====
  var detailPanel = document.getElementById("mapLocationDetail");
  var detailName  = document.getElementById("detailName");
  var detailFilm  = document.getElementById("detailFilm");
  var detailDesc  = document.getElementById("detailDesc");
  var detailTags  = document.getElementById("detailNarrativeTags");
  var detailLink  = document.getElementById("detailExploreLink");

  function showLocationDetail(locData) {
    detailName.textContent = locData.name;
    detailFilm.textContent = locData.films.join(" · ");

    // find a short description from one of the two narratives
    var desc = "";
    if (locData.narratives.indexOf("pursuit") !== -1) {
      for (var i = 0; i < APP_DATA.pursuitLocations.length; i++) {
        var p = APP_DATA.pursuitLocations[i];
        if (p.name === locData.name && p.texts) {
          desc = p.texts.brief;
          break;
        }
      }
    }
    if (!desc && locData.narratives.indexOf("timeline") !== -1) {
      for (var j = 0; j < APP_DATA.timelineLocations.length; j++) {
        var t = APP_DATA.timelineLocations[j];
        if (t.name === locData.name && t.texts) {
          desc = t.texts.brief;
          break;
        }
      }
    }
    detailDesc.textContent = desc || "A key filming location in Istanbul's cinematic geography.";

    // narrative tags
    detailTags.innerHTML = "";
    for (var k = 0; k < locData.narratives.length; k++) {
      var n = locData.narratives[k];
      var tag = document.createElement("span");
      tag.className = "popup-tag " + n;
      tag.textContent = (n === "pursuit") ? "◈ Pursuit" : "◇ Timeline";
      detailTags.appendChild(tag);
    }

    // "Open in Explore" button: set the narrative + index, then go to explore.html
    detailLink.onclick = function(e) {
      e.preventDefault();
      if (locData.narratives.length > 0) {
        var narrativeId = locData.narratives[0];
        App.setNarrative(narrativeId);
        var locs = App.getLocations();
        for (var m = 0; m < locs.length; m++) {
          if (locs[m].name === locData.name) {
            App.setLocationIndex(m);
            break;
          }
        }
      }
      window.location.href = "explore.html";
    };

    detailPanel.classList.remove("hidden");
  }

  function hideLocationDetail() {
    detailPanel.classList.add("hidden");
  }


  // ===== 4. Sidebar list of locations =====
  var locationList = document.getElementById("mapLocationList");

  function buildSidebarList(filter) {
    locationList.innerHTML = "";
    for (var i = 0; i < APP_DATA.mapLocations.length; i++) {
      var loc = APP_DATA.mapLocations[i];
      // skip locations that don't match the filter
      if (filter !== "all" && loc.narratives.indexOf(filter) === -1) continue;

      var item = document.createElement("div");
      item.className = "map-location-item";
      item.setAttribute("role", "listitem");
      item.dataset.id = loc.id;
      item.innerHTML =
        '<div class="map-location-name">' + loc.name + '</div>' +
        '<div class="map-location-films">' + loc.films.join(" · ") + '</div>';

      item.addEventListener("click", sidebarItemClicked);
      locationList.appendChild(item);
    }
  }

  function sidebarItemClicked(e) {
    selectLocation(e.currentTarget.dataset.id);
  }

  function updateSidebarActive(id) {
    var items = document.querySelectorAll(".map-location-item");
    for (var i = 0; i < items.length; i++) {
      if (items[i].dataset.id === id) {
        items[i].classList.add("active");
      } else {
        items[i].classList.remove("active");
      }
    }
  }


  // ===== 5. Select / activate a location =====
  function selectLocation(id) {
    // find the location by id
    var locData = null;
    for (var i = 0; i < APP_DATA.mapLocations.length; i++) {
      if (APP_DATA.mapLocations[i].id === id) {
        locData = APP_DATA.mapLocations[i];
        break;
      }
    }
    if (!locData) return;

    // reset the previously active marker
    if (activeMarkerId && markers[activeMarkerId]) {
      markers[activeMarkerId].marker.setStyle({ radius: 7 });
    }

    // highlight + center on the new one
    if (markers[id]) {
      markers[id].marker.setStyle({ radius: 11 });
      var newZoom = Math.max(map.getZoom(), 15);
      map.setView(locData.coordinates, newZoom, { animate: true });
      markers[id].marker.openPopup();
    }

    activeMarkerId = id;
    updateSidebarActive(id);
    showLocationDetail(locData);
  }


  // ===== 6. Add markers for the chosen filter =====
  function addMarkers(filter) {
    // remove old markers first
    for (var key in markers) {
      map.removeLayer(markers[key].marker);
    }
    markers = {};

    for (var i = 0; i < APP_DATA.mapLocations.length; i++) {
      var loc = APP_DATA.mapLocations[i];
      if (filter !== "all" && loc.narratives.indexOf(filter) === -1) continue;

      var color    = getMarkerColor(loc.narratives);
      var isActive = (loc.id === activeMarkerId);

      var marker = L.circleMarker(loc.coordinates, {
        radius: isActive ? 11 : 7,
        color: "#ffffff",
        weight: 2,
        fillColor: color,
        fillOpacity: 0.95
      }).addTo(map);

      // build the popup HTML
      var popupHtml =
        '<div>' +
          '<div class="popup-location-name">' + loc.name + '</div>' +
          '<div class="popup-film-tag">' + loc.films.join(" · ") + '</div>' +
          '<div class="popup-narrative-tags">';
      for (var j = 0; j < loc.narratives.length; j++) {
        var n = loc.narratives[j];
        var label = (n === "pursuit") ? "◈ Pursuit" : "◇ Timeline";
        popupHtml += '<span class="popup-tag ' + n + '">' + label + '</span>';
      }
      popupHtml += '</div></div>';

      marker.bindPopup(popupHtml, { maxWidth: 280, className: "cinema-popup" });

      // attach the click handler — wrap in a closure so each marker remembers its id
      (function(thisId) {
        marker.on("click", function() { selectLocation(thisId); });
      })(loc.id);

      markers[loc.id] = { marker: marker, data: loc };
    }
  }


  // ===== 7. Filter buttons =====
  var filterAll       = document.getElementById("filterAll");
  var filterEspionage = document.getElementById("filterEspionage");  // = "pursuit"
  var filterTimeline  = document.getElementById("filterTimeline");

  function clearFilterActive() {
    filterAll.className       = "map-filter-pill";
    filterEspionage.className = "map-filter-pill";
    filterTimeline.className  = "map-filter-pill";
  }

  function applyFilter(name, button, activeClass) {
    clearFilterActive();
    button.className = "map-filter-pill " + activeClass;
    addMarkers(name);
    buildSidebarList(name);
    hideLocationDetail();
    activeMarkerId = null;
  }

  filterAll.addEventListener("click", function() {
    applyFilter("all", filterAll, "active-all");
  });
  filterEspionage.addEventListener("click", function() {
    applyFilter("pursuit", filterEspionage, "active-espionage");
  });
  filterTimeline.addEventListener("click", function() {
    applyFilter("timeline", filterTimeline, "active-timeline");
  });


  // ===== 8. First-time setup =====
  buildSidebarList("all");
  addMarkers("all");

  // After 600ms, auto-select the first location so the sidebar has something to show.
  setTimeout(function() {
    if (APP_DATA.mapLocations.length > 0) {
      selectLocation(APP_DATA.mapLocations[0].id);
    }
  }, 600);

  // Recalculate the map size if the user resizes the window. Leaflet sometimes
  // mis-sizes itself inside flex containers, so I also call invalidateSize once.
  window.addEventListener("resize", function() { map.invalidateSize(); });
  setTimeout(function() { map.invalidateSize(); }, 100);

});
