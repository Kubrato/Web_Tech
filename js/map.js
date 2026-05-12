// map.js — code for the interactive Map page
// I use Leaflet.js (a free map library) and CARTO's free dark map tiles.

document.addEventListener("DOMContentLoaded", function() {
// Wait until the HTML is ready before running this code.

  // ===== 1. Set up the map =====
  // If Leaflet did not load (no internet, etc.), show a message and stop.
  if (typeof L === "undefined") {
  // "L" is the global object that Leaflet creates. typeof L returns "undefined" if Leaflet did not load.
    document.getElementById("map").innerHTML =
      '<div class="map-unavailable">' +
        '<span class="map-unavailable-icon">◉</span>' +
        '<span>Map unavailable — check your internet connection and reload.</span>' +
      '</div>';
    // Put a friendly error message in the map area.
    return;
    // Stop the function: no point continuing without Leaflet.
  }

  // Create the map and centre it on Istanbul.
  var map = L.map("map", {
  // L.map("map", ...) creates a Leaflet map inside the element with id="map".
    center: [41.0082, 28.9784],
    // The map starts centered on Istanbul (latitude, longitude).
    zoom: 14,
    // The starting zoom level. Higher number = more zoomed in.
    zoomControl: false
    // Hide the default zoom buttons. We will add them in a different position.
  });

  // Move the zoom buttons to the bottom-right corner.
  L.control.zoom({ position: "bottomright" }).addTo(map);
  // L.control.zoom() creates the +/- buttons. addTo(map) puts them on the map.

  // Add the dark tile layer (CARTO Dark Matter — free, no API key).
  L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
  // L.tileLayer loads the map images (tiles). The URL has placeholders: {s}=subdomain, {z}=zoom, {x}/{y}=tile coordinates, {r}=retina suffix.
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" style="color:#c9a55a">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions" style="color:#c9a55a">CARTO</a>',
    // Required by the licence: show credit for OpenStreetMap and CARTO at the bottom of the map.
    subdomains: "abcd",
    // The {s} part of the URL can be a, b, c, or d. The browser uses different subdomains to load tiles in parallel.
    maxZoom: 19
    // The deepest zoom level allowed.
  }).addTo(map);
  // Add the layer to the map.


  // ===== 2. Marker style =====
  // Every marker uses the same gold colour, regardless of narrative.

  var MARKER_COLOR = "#c9a55a";
  // Single hex colour for all markers (matches the site accent).

 

  // ===== 3. Sidebar detail panel =====
  var detailPanel = document.getElementById("mapLocationDetail"); // The whole detail panel.
  var detailName  = document.getElementById("detailName");  // The h2 for the location name.
  var detailFilm  = document.getElementById("detailFilm"); // The film label.
  var detailTags  = document.getElementById("detailNarrativeTags");  // The container for the narrative tags.
  var detailLink  = document.getElementById("detailExploreLink");  // The "Explore this location" link.

  function showLocationDetail(locData) { //Daha sonra locData selectLocation(id) functionı ile APP_DATA.mapLocations objeleri ile dolar.
  // This function fills the sidebar with the data of one location.

    detailName.textContent = locData.name;
    // Set the name text. textContent is safer than innerHTML (no HTML parsing).

    detailFilm.textContent = locData.films.join(" · ");
    // Join the films array into a string separated by " · ".

    // narrative tags
    detailTags.innerHTML = "";
    // Clear old tags before we add new ones.

    for (var k = 0; k < locData.narratives.length; k++) {
      var n = locData.narratives[k];
      var tag = document.createElement("span");
      // Create a new <span> for each tag.
      tag.className = "popup-tag " + n;
      // Two classes: "popup-tag" + the narrative name (so CSS can style each color).
      tag.textContent = (n === "pursuit") ? "◈ Pursuit" : "◇ Timeline";
      // Ternary operator: condition ? value-if-true : value-if-false.
      detailTags.appendChild(tag);
    }
//--------- "Explore this Location" button: set the narrative + index, then go to explore.html
    detailLink.onclick = function(e) {
    // Assign a click handler. We assign instead of addEventListener so a previous handler is replaced.
      e.preventDefault();
      // Stop the default link behavior. We will navigate manually after setting state.

      if (locData.narratives.length > 0) {
        var narrativeId = locData.narratives[0];
        // Take the first narrative this location is in.
        App.setNarrative(narrativeId);
        // Tell the App to use this narrative.

        var locs = App.getLocations();
        for (var m = 0; m < locs.length; m++) {
          if (locs[m].name === locData.name) {
          // Find the matching location in the new narrative.
            App.setLocationIndex(m);
            // Set the active index in the App state.
            break;
          }
        }
      }
      window.location.href = "explore.html";
      // Now go to the Explore page. It will open with the correct narrative and location.
    };

    detailPanel.classList.remove("hidden");
    // Show the detail panel (remove the hidden class).
  }

  function hideLocationDetail() {
    detailPanel.classList.add("hidden");
    // Hide the panel.
  }


  // ===== 4. Sidebar list of locations =====
  var locationList = document.getElementById("mapLocationList");
  // The empty container in the HTML.

  function buildSidebarList() {
  // Build the full list of locations. No filtering: every location is shown.

    locationList.innerHTML = "";
    // Clear the old list.

    for (var i = 0; i < APP_DATA.mapLocations.length; i++) {
      var loc = APP_DATA.mapLocations[i];

// My note: I generate the sidebar items in JavaScript
// because the same location data also drives the map markers,
// so keeping it in data.js as a single source of truth
// lets me sort and sync the list with the map without duplicating content in the HTML.
      var item = document.createElement("div");
      item.className = "map-location-item";
      item.setAttribute("role", "listitem");
      // Mark this item as a list item.
      item.setAttribute("data-id", loc.id);
      // Save the location id in a data attribute so the click handler can read it.

      item.innerHTML =
        '<div class="map-location-name">' + loc.name + '</div>' +
        '<div class="map-location-films">' + loc.films.join(" · ") + '</div>';
      // Inner HTML: name + films.

      item.addEventListener("click", sidebarItemClicked);
      // Add a click event. The function is defined below.

      locationList.appendChild(item);
      // Add the item to the list.
    }
  }

  function sidebarItemClicked(e) {
    selectLocation(e.currentTarget.getAttribute("data-id"));
    // e.currentTarget = the element with the listener (the item div). Read its data-id.
  }

  function updateSidebarActive(id) {
  // Mark only one item as active in the sidebar list.
    var items = document.querySelectorAll(".map-location-item");
    for (var i = 0; i < items.length; i++) {
      if (items[i].getAttribute("data-id") === id) {
        items[i].classList.add("active");
      } else {
        items[i].classList.remove("active");
      }
    }
  }

  var markers = {};   // I store markers by location id
  // An empty object. We will add keys like markers["hagia-sophia"] = {...}.

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
    // If we did not find it, stop.

    updateSidebarActive(id);
    // Update the sidebar visual.
    showLocationDetail(locData);
    // Fill the detail panel.
  }


  // ===== 6. Add a marker for every location =====
  function addMarkers() {
    // remove old markers first
    for (var key in markers) {
      map.removeLayer(markers[key].marker);
    }
    markers = {};

    for (let i = 0; i < APP_DATA.mapLocations.length; i++) {
      let loc = APP_DATA.mapLocations[i];
      // We use "let" (not "var") so each loop turn has its own "loc".
// Without "let", every marker's click handler would use the LAST loc
// — so every click would open the same location. "let" fixes this.

      let marker = L.circleMarker(loc.coordinates, {
        radius: 7,
        color: "#ffffff",
        weight: 2,
        fillColor: MARKER_COLOR,
        fillOpacity: 0.95
      }).addTo(map);

      // popup with the name and film
      let popupHtml =
        '<div class="popup-location-name">' + loc.name + '</div>' +
        '<div class="popup-film-tag">' + loc.films.join(" · ") + '</div>';
      marker.bindPopup(popupHtml, { maxWidth: 280, className: "cinema-popup" });

      // when the user clicks the marker, update the sidebar + detail panel
      marker.on("click", function() { selectLocation(loc.id); });

      markers[loc.id] = { marker: marker, data: loc };
    }
  }

  buildSidebarList();
  // Build the sidebar with every location.
  addMarkers();
  // Add a marker for every location to the map.

});
