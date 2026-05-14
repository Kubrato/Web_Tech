/*
  data.js — application data (read-only).
  =============================================================================

  HOW TO READ THIS FILE
  ---------------------
  This file is mostly DATA, not logic. It defines three big JS objects and
  one big array, then groups them together into a single global called
  APP_DATA. The HTML pages and the other JS files read from APP_DATA, but
  no one writes to it.

  Object structure:

   1) LOC_META    →  catalogue metadata, one entry per location.
                     Keyed by slug (e.g. "hagia-sophia").

   2) LOC_IMG     →  the image gallery for each location.
                     Two lists per location: "location" (real photos)
                     and "film" (movie stills).

   3) APP_DATA    →  the final object that the rest of the app uses.
                     Inside it:
                       narratives[]        narrative definitions and chapter intros
                       pursuitLocations[]  12 stops for "Pursuit & Passage"
                       timelineLocations[] 16 stops for "Through Time"
                       mapLocations[]      16 unique physical locations (for the map)
                       films[]             5 films featured in the project

  Each location object has:
    - camera         exact shot info (facing, elevation, focal length, shot type)
    - images         from LOC_IMG (the gallery shown in Explore)
    - texts          long versions: { young, adult, scholar }
    - textsShort     short versions: { young, adult, scholar }
    - quote          short atmospheric pull-quote
    - narrativeNote  editorial annotation by the author
    - meta           catalogue metadata (from LOC_META below)

  LOC_META splits each catalogue record into 5 groups:
    LOCATION (address, GPS, district), HERITAGE (year built, architect),
    SCENE (film, scene description, camera), TOURISM (visit time, ticket),
    PROJECT (rights, language, sources, last_updated).

  Vocabularies used by the metadata table on Explore:
    - f (schema:*)        Place / TouristAttraction / etc.
    - Dublin Core (dcterms:*)      source, rights, language, dates
    - Wikidata Q-IDs               authority control (one global ID per place)
    - GeoNames                     city / country hierarchy

  KEY JAVASCRIPT TECHNIQUES YOU WILL SEE IN THIS FILE
  ---------------------------------------------------
   - const NAME = {...}     →  declare a constant. Cannot be reassigned.
   - Object.freeze(obj)     →  makes the object read-only (cannot add/change keys).
   - { ..._META_COMMON,     →  the "..." is the SPREAD operator. It copies all
       address: "..." }        keys from _META_COMMON into the new object.
                               So we do not write city / country / rights every time.
   - "key-with-dashes":     →  keys can be strings. Required when the key has
       value                    a dash or a space (like "hagia-sophia").
   - Arrays of objects      →  [...], each element { ... } is one record.

  =============================================================================
*/


// Country, language and rights are the same for every record, so we
// define them once and spread them into each record below.
//
// Object.freeze(...) prevents any code from modifying this object after it is
// created. This is a defensive choice: if any line later tried to write
// _META_COMMON.city = "Ankara", that line would silently fail (or throw an
// error in strict mode). We want shared constants to STAY constant.
const _META_COMMON = Object.freeze({
  city:         "Istanbul",
  country:      "Türkiye",
  language:     "en",
  rights:       "Editorial selection © 2026 Kübra Topçuoğlu — academic use",
  last_updated: "2026-05-07"
});


// LOC_META  →  the big metadata dictionary.
// Keys are location slugs (URL-safe ids like "hagia-sophia").
// Each value is one full catalogue record.
// Inside each record we use { ..._META_COMMON, ... } to copy the shared fields
// (city, country, language, rights, last_updated) and then add the specific
// fields. This is the SPREAD pattern: it reduces repetition.
const LOC_META = {

  // ── 1. HAGIA SOPHIA ───────────────────────────────────────────────────────
  "hagia-sophia": {
    ..._META_COMMON,
    address:        "Sultan Ahmet, Ayasofya Meydanı No: 1",
    postal_code:    "34122",
    district:       "Sultanahmet, Fatih",
    wikidata:       "Q12506",
    geonames:       "745042",
    building_type:  "Former cathedral / mosque / museum",
    architects:     ["Anthemius of Tralles", "Isidore of Miletus"],
    year_built:     537,
    period:         "Byzantine (Justinian I)",
    style:          "Byzantine architecture",
    unesco:         "World Heritage 1985 — Historic Areas of Istanbul (ref. 356)",
    film_role:      "Decoded-clue location — heritage as readable text",
    shot_duration:  "≈ 6 min screen time across Inferno (2016)",
    visit_duration:          "60–90 min",
    accessibility_notes:     "Step-free access via the north (Imperial) door; modest dress required (active mosque); audio-guide rentals available.",
    recommended_time_of_day: "Early morning (08:30–09:30) or late afternoon — avoid the five daily prayer times.",
    ticket:                  "Free outside prayer hours; donation box at exit.",
    sources: [
      { label: "Wikipedia: Hagia Sophia", url: "https://en.wikipedia.org/wiki/Hagia_Sophia" },
      { label: "UNESCO WHC 356",          url: "https://whc.unesco.org/en/list/356" },
      { label: "Wikidata Q12506",         url: "https://www.wikidata.org/wiki/Q12506" }
    ]
  },

  // ── 2. BASILICA CISTERN ───────────────────────────────────────────────────
  "basilica-cistern": {
    ..._META_COMMON,
    address:        "Alemdar, Yerebatan Cd. 1/3",
    postal_code:    "34110",
    district:       "Sultanahmet, Fatih",
    wikidata:       "Q189301",
    geonames:       "745042",
    building_type:  "Byzantine cistern (museum)",
    architects:     ["Built under Emperor Justinian I"],
    year_built:     532,
    period:         "Byzantine (Justinian I)",
    style:          "Byzantine vaulted hypostyle (recycled spolia columns)",
    unesco:         "World Heritage 1985 — Historic Areas of Istanbul (ref. 356)",
    film_role:      "Climax / final-confrontation underground stage",
    shot_duration:  "≈ 12 min screen time in Inferno (2016)",
    visit_duration:          "30–45 min",
    accessibility_notes:     "Recently restored boardwalks; stairs at entrance, no lift; can be slippery.",
    recommended_time_of_day: "Late afternoon — atmospheric uplighting reads best after 16:00.",
    ticket:                  "Paid (foreign visitor rate); separate after-dark Nights tour also available.",
    sources: [
      { label: "Wikipedia: Basilica Cistern",         url: "https://en.wikipedia.org/wiki/Basilica_Cistern" },
      { label: "Istanbul Tourist Pass — Yerebatan",    url: "https://yerebatan.com/" },
      { label: "Wikidata Q189301",                     url: "https://www.wikidata.org/wiki/Q189301" }
    ]
  },

  // ── 3. SULTAN AHMET MOSQUE (Blue Mosque) ──────────────────────────────────
  "sultan-ahmet-mosque": {
    ..._META_COMMON,
    address:        "Binbirdirek, Atmeydanı Cd. 7",
    postal_code:    "34122",
    district:       "Sultanahmet, Fatih",
    wikidata:       "Q170825",
    geonames:       "745042",
    building_type:  "Imperial Ottoman mosque (active)",
    architects:     ["Sedefkâr Mehmed Ağa"],
    year_built:     1617,
    period:         "Ottoman classical (Ahmed I)",
    style:          "Ottoman classical with İznik tilework (≈ 20,000 tiles)",
    unesco:         "World Heritage 1985 — Historic Areas of Istanbul (ref. 356)",
    film_role:      "Sacred contemplative space — search chapter",
    shot_duration:  "≈ 5 min screen time in The Water Diviner (2014)",
    visit_duration:          "30–45 min",
    accessibility_notes:     "Step-free access via the south courtyard; shoes removed at entrance; head-cover required for women.",
    recommended_time_of_day: "Mid-morning between prayer times (≈ 09:30 or 11:00).",
    ticket:                  "Free; donation box.",
    sources: [
      { label: "Wikipedia: Sultan Ahmed Mosque",  url: "https://en.wikipedia.org/wiki/Sultan_Ahmed_Mosque" },
      { label: "Wikidata Q170825",                 url: "https://www.wikidata.org/wiki/Q170825" }
    ]
  },

  // ── 4. GRAND BAZAAR ───────────────────────────────────────────────────────
  "grand-bazaar": {
    ..._META_COMMON,
    address:        "Beyazıt, Kalpakçılar Cd.",
    postal_code:    "34126",
    district:       "Beyazıt, Fatih",
    wikidata:       "Q189142",
    geonames:       "745042",
    building_type:  "Covered market complex (61 streets, ≈ 4,000 shops)",
    architects:     ["Initial core under Sultan Mehmed II (Fatih)"],
    year_built:     1461,
    period:         "Early Ottoman (post-conquest)",
    style:          "Ottoman vaulted bazaar (kapalıçarşı)",
    unesco:         "Located within UNESCO Historic Areas of Istanbul buffer zone",
    film_role:      "Action arena — kinetic chase geography",
    shot_duration:  "≈ 7 min screen time in Skyfall (2012); briefly seen in From Russia with Love (1963)",
    visit_duration:          "60–120 min",
    accessibility_notes:     "Mostly step-free indoors; crowded; pickpocket-aware zones near gates.",
    recommended_time_of_day: "Tuesday–Friday before 11:00 (less crowded; more merchants open).",
    ticket:                  "Free entry; bargaining culture for purchases.",
    sources: [
      { label: "Wikipedia: Grand Bazaar",  url: "https://en.wikipedia.org/wiki/Grand_Bazaar,_Istanbul" },
      { label: "Wikidata Q189142",          url: "https://www.wikidata.org/wiki/Q189142" }
    ]
  },

  // ── 5. GRAND BAZAAR ROOFTOP ───────────────────────────────────────────────
  "skyfall-rooftop": {
    ..._META_COMMON,
    address:        "Lead-covered roofs above Kalpakçılar Cd.",
    postal_code:    "34126",
    district:       "Beyazıt, Fatih",
    wikidata:       "Q189142",                 // shares Wikidata with Grand Bazaar
    geonames:       "745042",
    building_type:  "Ottoman lead-roof terrain over the Grand Bazaar (≈ 12 m elevation)",
    architects:     ["Original 15th-century Ottoman builders; layered restorations"],
    year_built:     1461,
    period:         "Early Ottoman (post-conquest)",
    style:          "Ottoman lead-sheathed dome cluster",
    unesco:         "Located within UNESCO Historic Areas of Istanbul buffer zone",
    film_role:      "Vertical chase geography — first major rooftop sequence over Istanbul in international cinema",
    shot_duration:  "≈ 2 min screen time in Skyfall (2012)",
    visit_duration:          "Not publicly accessible — view from Nuruosmaniye courtyard or drone-permit only",
    accessibility_notes:     "No public access; visible from adjacent Nuruosmaniye Mosque courtyard.",
    recommended_time_of_day: "Late afternoon (golden hour over the lead roofs).",
    ticket:                  "N/A — closed surface, viewing from below only.",
    sources: [
      { label: "Wikipedia: Skyfall — Production",  url: "https://en.wikipedia.org/wiki/Skyfall#Production" },
      { label: "Wikidata Q189142",                  url: "https://www.wikidata.org/wiki/Q189142" }
    ]
  },

  // ── 6. SPICE BAZAAR ───────────────────────────────────────────────────────
  "spice-bazaar": {
    ..._META_COMMON,
    address:        "Rüstem Paşa, Erzak Ambarı Sk. 92",
    postal_code:    "34116",
    district:       "Eminönü, Fatih",
    wikidata:       "Q1124673",
    geonames:       "745042",
    building_type:  "Covered market (88 vaulted shops in two arcades)",
    architects:     ["Mustafa Ağa (chief Ottoman architect under Mehmed IV)"],
    year_built:     1664,
    period:         "Ottoman classical (Mehmed IV)",
    style:          "L-shaped Ottoman covered market integrated with the New Mosque complex",
    unesco:         "Within UNESCO Historic Areas of Istanbul buffer zone",
    film_role:      "Surveillance environment — controlled, dense, exit-rich",
    shot_duration:  "≈ 4 min screen time in Taken 2 (2012)",
    visit_duration:          "30–60 min",
    accessibility_notes:     "Step-free entrances at both gates; aisles wide enough for wheelchair until peak hours.",
    recommended_time_of_day: "Weekday mornings 09:00–11:00 (locals' shopping window).",
    ticket:                  "Free entry; merchant price negotiation expected.",
    sources: [
      { label: "Wikipedia: Spice Bazaar",  url: "https://en.wikipedia.org/wiki/Spice_Bazaar" },
      { label: "Wikidata Q1124673",         url: "https://www.wikidata.org/wiki/Q1124673" }
    ]
  },

  // ── 7. EMINÖNÜ SQUARE ─────────────────────────────────────────────────────
  "eminonu": {
    ..._META_COMMON,
    address:        "Rüstem Paşa, Yeni Cami Cd.",
    postal_code:    "34116",
    district:       "Eminönü, Fatih",
    wikidata:       "Q1340519",
    geonames:       "745042",
    building_type:  "Public square + ferry terminal (Şehir Hatları piers 1913–1958)",
    architects:     ["Multiple — early-Republican civic redesign"],
    year_built:     1958,                                 // ferry terminal complete
    period:         "Late Ottoman → early Republican",
    style:          "Civic waterfront — modernist piers next to 1664 New Mosque",
    unesco:         "Adjacent to UNESCO Historic Areas of Istanbul",
    film_role:      "Waterfront escape vector — three-direction departure",
    shot_duration:  "≈ 3 min screen time in Taken 2 (2012)",
    visit_duration:          "20–30 min (plus ferry ride: 90 min Bosphorus tour)",
    accessibility_notes:     "Wide pavements; tactile paving at tram crossings; ferry ramps step-free.",
    recommended_time_of_day: "Sunset (skyline of Sultanahmet behind the New Mosque).",
    ticket:                  "Square free; ferry tickets via Istanbulkart.",
    sources: [
      { label: "Wikipedia: Eminönü",   url: "https://en.wikipedia.org/wiki/Emin%C3%B6n%C3%BC" },
      { label: "Wikidata Q1340519",     url: "https://www.wikidata.org/wiki/Q1340519" }
    ]
  },

  // ── 8. GALATA BRIDGE ──────────────────────────────────────────────────────
  "galata-bridge": {
    ..._META_COMMON,
    address:        "Galata Köprüsü (over the Golden Horn)",
    postal_code:    "34116",
    district:       "Eminönü ↔ Karaköy",
    wikidata:       "Q1146092",
    geonames:       "745042",
    building_type:  "Two-level bascule bridge (490 m span)",
    architects:     ["Thyssenkrupp / STFA consortium (current bridge)"],
    year_built:     1994,                                 // current bridge
    period:         "Late 20th-century engineering (5th iteration)",
    style:          "Steel bascule — upper deck traffic + tram, lower deck restaurants",
    unesco:         "Crosses into UNESCO Historic Areas buffer zone on the south side",
    film_role:      "Crossing-as-decision — line between danger and brief safety",
    shot_duration:  "≈ 5 min screen time in Taken 2 (2012)",
    visit_duration:          "20–40 min walk + lower-deck meal optional",
    accessibility_notes:     "Pavements both sides; steep stair access between decks.",
    recommended_time_of_day: "Sunset for the silhouette of fishermen; midnight bascule openings (variable schedule).",
    ticket:                  "Free; lower-deck restaurants à la carte.",
    sources: [
      { label: "Wikipedia: Galata Bridge",  url: "https://en.wikipedia.org/wiki/Galata_Bridge" },
      { label: "Wikidata Q1146092",          url: "https://www.wikidata.org/wiki/Q1146092" }
    ]
  },

  // ── 9. LEGACY OTTOMAN HOTEL ───────────────────────────────────────────────
  "legacy-ottoman": {
    ..._META_COMMON,
    address:        "Hocapaşa Sk. 5",
    postal_code:    "34110",
    district:       "Sirkeci, Fatih",
    wikidata:       null,
    geonames:       "745042",
    building_type:  "Restored 19th-century neo-Ottoman hotel (active)",
    architects:     ["Original anonymous late-Ottoman builder; 2010s adaptive reuse"],
    year_built:     1890,                                 // approximate facade
    period:         "Late Ottoman (Tanzimat → early Republican)",
    style:          "Neo-Ottoman revival — courtyard + balconies",
    unesco:         "Within Historic Areas of Istanbul buffer zone",
    film_role:      "Family base / loss-trigger location — start of the search chapter",
    shot_duration:  "≈ 3 min screen time in Taken 2 (2012)",
    visit_duration:          "Lobby visit ≈ 15 min (hotel guests only beyond)",
    accessibility_notes:     "Step at main entrance; lift to upper floors.",
    recommended_time_of_day: "Late afternoon (courtyard light).",
    ticket:                  "N/A — paying hotel guests; café accessible.",
    sources: [
      { label: "Hotel official",  url: "https://www.legacyottoman.com/" }
    ]
  },

  // ── 10. DEUTSCHE ORIENTBANK HOTEL ─────────────────────────────────────────
  "deutsche-orientbank": {
    ..._META_COMMON,
    address:        "Bankalar Cd. 11",
    postal_code:    "34421",
    district:       "Karaköy, Beyoğlu",
    wikidata:       null,
    geonames:       "745042",
    building_type:  "Restored 1906 bank building (now luxury hotel)",
    architects:     ["Period German-Ottoman commercial architect (records partial)"],
    year_built:     1906,
    period:         "Late Ottoman (German economic expansion era)",
    style:          "Neoclassical European banking — restored interior banking hall",
    unesco:         "Outside designated UNESCO core zone (Karaköy district)",
    film_role:      "Quiet operational base for Bond character",
    shot_duration:  "≈ 2 min screen time in Skyfall (2012)",
    visit_duration:          "Lobby visit ≈ 10 min",
    accessibility_notes:     "Step-free from Bankalar Caddesi; lift access to all floors.",
    recommended_time_of_day: "Late morning (light through banking-hall fanlights).",
    ticket:                  "N/A — open to hotel guests + restaurant patrons.",
    sources: [
      { label: "Wikipedia: Bankalar Caddesi",  url: "https://en.wikipedia.org/wiki/Bankalar_Caddesi" }
    ]
  },

  // ── 11. SIRKECI RAILWAY STATION ───────────────────────────────────────────
  "sirkeci": {
    ..._META_COMMON,
    address:        "Hocapaşa, Hocapaşa Sk., Sirkeci Garı",
    postal_code:    "34110",
    district:       "Sirkeci, Fatih",
    wikidata:       "Q801345",
    geonames:       "745042",
    building_type:  "Historic railway terminus + Istanbul Railway Museum",
    architects:     ["August Jachmund"],
    year_built:     1890,
    period:         "Late Ottoman (Abdulhamid II)",
    style:          "Moorish revival — pointed arches, polychrome masonry, rose window",
    unesco:         "Within Historic Areas of Istanbul buffer zone",
    film_role:      "Departure — closing of the Pursuit & Passage narrative",
    shot_duration:  "≈ 6 min screen time across From Russia with Love (1963) climax",
    visit_duration:          "30–60 min (museum + platform walk)",
    accessibility_notes:     "Step-free Marmaray entrance; original Moorish hall has small steps.",
    recommended_time_of_day: "Afternoon (light through the rose window).",
    ticket:                  "Free; Istanbul Railway Museum free.",
    sources: [
      { label: "Wikipedia: Sirkeci",  url: "https://en.wikipedia.org/wiki/Sirkeci_railway_station" },
      { label: "Wikidata Q801345",     url: "https://www.wikidata.org/wiki/Q801345" }
    ]
  },

  // ── 12. MAIDEN'S TOWER ────────────────────────────────────────────────────
  "maidens-tower": {
    ..._META_COMMON,
    address:        "Salacak, Üsküdar Sahili (offshore islet)",
    postal_code:    "34668",
    district:       "Üsküdar (Asian shore)",
    wikidata:       "Q1141280",
    geonames:       "745042",
    building_type:  "Defensive / lighthouse tower on Bosphorus islet",
    architects:     ["12th-century Byzantine origin; current Baroque-style 1763 + later restorations"],
    year_built:     1763,
    period:         "Ottoman Baroque (over Byzantine substructure)",
    style:          "Baroque tower over Byzantine masonry foundations",
    unesco:         "Outside UNESCO core zone — culturally protected by Üsküdar municipality",
    film_role:      "First Bosphorus image in international cinema; tourism-as-cover surveillance",
    shot_duration:  "≈ 2 min screen time in From Russia with Love (1963)",
    visit_duration:          "60–90 min (incl. boat transfer)",
    accessibility_notes:     "Boat-only access from Salacak or Kabataş piers; spiral stairs inside.",
    recommended_time_of_day: "Sunset — silhouette against the European shore.",
    ticket:                  "Paid — combined ferry + entry ticket.",
    sources: [
      { label: "Wikipedia: Maiden's Tower",  url: "https://en.wikipedia.org/wiki/Maiden%27s_Tower" },
      { label: "Wikidata Q1141280",           url: "https://www.wikidata.org/wiki/Q1141280" }
    ]
  },

  // ── 13. FIRUZ AGA MOSQUE ──────────────────────────────────────────────────
  "firuz-aga": {
    ..._META_COMMON,
    address:        "Binbirdirek, Divanyolu Cd.",
    postal_code:    "34122",
    district:       "Sultanahmet, Fatih",
    wikidata:       "Q3072829",
    geonames:       "745042",
    building_type:  "Single-domed Ottoman mosque (active)",
    architects:     ["Built for Firuz Bey, chief treasurer of Bayezid II"],
    year_built:     1491,
    period:         "Early Ottoman (Bayezid II)",
    style:          "Ottoman early-classical — single dome, single minaret, modest porch",
    unesco:         "Within Historic Areas of Istanbul buffer zone",
    film_role:      "Atmospheric backdrop — typical 1960s 'real-place' framing",
    shot_duration:  "≈ 1 min screen time in From Russia with Love (1963)",
    visit_duration:          "10–15 min",
    accessibility_notes:     "Small step at entrance; modest dress; shoes removed.",
    recommended_time_of_day: "Mid-morning between prayer times.",
    ticket:                  "Free.",
    sources: [
      { label: "Wikipedia: Firuz Ağa Mosque",  url: "https://en.wikipedia.org/wiki/Firuz_A%C4%9Fa_Mosque" },
      { label: "Wikidata Q3072829",             url: "https://www.wikidata.org/wiki/Q3072829" }
    ]
  },

  // ── 14. GÜLHANE PARK ──────────────────────────────────────────────────────
  "gulhane-park": {
    ..._META_COMMON,
    address:        "Cankurtaran, Kennedy Cd.",
    postal_code:    "34122",
    district:       "Sultanahmet, Fatih",
    wikidata:       "Q1153403",
    geonames:       "745042",
    building_type:  "Historic public park (former Topkapı outer gardens)",
    architects:     ["Originally laid out as Topkapı imperial gardens; opened to public 1912"],
    year_built:     1912,                                 // year of public opening
    period:         "Late Ottoman (Constitutional period)",
    style:          "Imperial Ottoman garden converted to civic park",
    unesco:         "Within UNESCO Historic Areas of Istanbul",
    film_role:      "Walkable everyday Istanbul — protagonist learning the city",
    shot_duration:  "≈ 3 min screen time in The Water Diviner (2014)",
    visit_duration:          "30–60 min",
    accessibility_notes:     "Mostly step-free paths; some inclines; benches throughout.",
    recommended_time_of_day: "Spring mornings (tulip festival, mid-April) or late afternoon.",
    ticket:                  "Free.",
    sources: [
      { label: "Wikipedia: Gülhane Park",  url: "https://en.wikipedia.org/wiki/G%C3%BClhane_Park" },
      { label: "Wikidata Q1153403",         url: "https://www.wikidata.org/wiki/Q1153403" }
    ]
  },

  // ── 15. HAYDARPAŞA TRAIN STATION ──────────────────────────────────────────
  "haydarpasa": {
    ..._META_COMMON,
    address:        "Haydarpaşa Garı, Rıhtım Cd.",
    postal_code:    "34716",
    district:       "Kadıköy (Asian shore)",
    wikidata:       "Q798842",
    geonames:       "745042",
    building_type:  "Historic terminal station (currently inactive for commercial rail)",
    architects:     ["Otto Ritter", "Helmut Cuno"],
    year_built:     1908,
    period:         "Late Ottoman (Berlin–Baghdad railway era)",
    style:          "German neo-Renaissance on > 1,000 wooden Bosphorus piles",
    unesco:         "Outside UNESCO core zone; locally protected industrial heritage",
    film_role:      "Departure for Anatolia — only Asian-shore location in the dataset",
    shot_duration:  "≈ 4 min screen time in The Water Diviner (2014)",
    visit_duration:          "20–30 min (exterior + quay walk)",
    accessibility_notes:     "Step-free quay approach; interior partially closed since 2010 fire.",
    recommended_time_of_day: "Morning ferry from Karaköy → arrival framing the facade from the sea.",
    ticket:                  "Free exterior; interior tours intermittent.",
    sources: [
      { label: "Wikipedia: Haydarpaşa",  url: "https://en.wikipedia.org/wiki/Haydarpa%C5%9Fa_railway_station" },
      { label: "Wikidata Q798842",        url: "https://www.wikidata.org/wiki/Q798842" }
    ]
  },

  // ── 16. ISTANBUL UNIVERSITY ───────────────────────────────────────────────
  "istanbul-uni": {
    ..._META_COMMON,
    address:        "Beyazıt Meydanı (main gate)",
    postal_code:    "34452",
    district:       "Beyazıt, Fatih",
    wikidata:       "Q629161",
    geonames:       "745042",
    building_type:  "Historic university campus (main gate 1866)",
    architects:     ["Ottoman state architects (main gate 1866); subsequent additions"],
    year_built:     1866,                                 // famous main gate
    period:         "Late Ottoman (Tanzimat reform)",
    style:          "Late-Ottoman public-architecture — monumental main gate",
    unesco:         "Within UNESCO Historic Areas of Istanbul buffer zone",
    film_role:      "Reading-the-city scene — heritage as decodable text",
    shot_duration:  "≈ 2 min screen time in Inferno (2016)",
    visit_duration:          "30–45 min (gate, square, library exterior)",
    accessibility_notes:     "Public access to Beyazıt Meydanı; campus interior requires registration outside academic terms.",
    recommended_time_of_day: "Late morning (students crossing the gate).",
    ticket:                  "Free.",
    sources: [
      { label: "Wikipedia: Istanbul University",  url: "https://en.wikipedia.org/wiki/Istanbul_University" },
      { label: "Wikidata Q629161",                 url: "https://www.wikidata.org/wiki/Q629161" }
    ]
  }
};

// ============================================================================
// IMAGE GALLERY MAP
// ============================================================================
// Centralised so a single physical location can be referenced from both
// narratives without duplicating the image list. For example, "grand-bazaar"
// appears in both Pursuit (under the chase chapter) and Through Time (under
// 2012). Both pull their gallery from LOC_IMG["grand-bazaar"], so updating an
// image in one place updates it in both narratives.
//
// Structure for each location:
//   location[]  →  real-location photographs (img/locations/...)
//   film[]      →  stills taken from the actual film (img/films/...)
//
// Each image record has:  src (path), alt (for screen readers), caption (text).
const LOC_IMG = {
  "spice-bazaar": {
    location: [
      { src: "img/locations/Taken2/spicebazaarTaken2.jpg",   alt: "Spice Bazaar interior arcade",     caption: "Spice Bazaar — interior arcade, near Hamidiye Gate" },
      { src: "img/locations/Taken2/taken2_SpiceBazaar.webp", alt: "Spice Bazaar shop fronts",         caption: "Spice Bazaar — shop fronts and stalls" }
    ],
    film: [
      { src: "img/films/Taken2/SpiceBazaarTaken2.jpg",       alt: "Spice Bazaar in Taken 2",          caption: "Taken 2 (2012) — Mills surveys the bazaar" },
      { src: "img/films/Taken2/taken-2-Spicebazaar.webp",    alt: "Spice Bazaar Taken 2 alternate",   caption: "Taken 2 (2012) — interior surveillance, alternate angle" }
    ]
  },
  "maidens-tower": {
    location: [
      { src: "img/locations/RussiawithLove/MaidenTowerRussia.jpg",  alt: "Maiden's Tower from the water", caption: "Maiden's Tower — Üsküdar shore" },
      { src: "img/locations/RussiawithLove/MaidenTowerRussia.webp", alt: "Maiden's Tower close view",     caption: "Maiden's Tower — close view from the Bosphorus ferry" }
    ],
    film: [
            { src: "img/films/FromRussiawithLove/MaidenTower-FromRussiawithLove.webp",    alt: "Maiden's Tower 1963 alternate",            caption: "From Russia with Love (1963) — alternate framing" },
      { src: "img/films/FromRussiawithLove/Maiden Tower From RussiawithLove.jpg",   alt: "Maiden's Tower in From Russia with Love", caption: "From Russia with Love (1963) — Bosphorus tour" }
    ]
  },
  "grand-bazaar": {
    location: [
      { src: "img/locations/Skyfall/GrandBazaarSkyfall.webp", alt: "Grand Bazaar main corridor", caption: "Grand Bazaar — Kalpakçılar Caddesi corridor" }
    ],
    film: [
            { src: "img/films/Skyfall/SkyfallGrandBazaar.webp", alt: "Skyfall bazaar still",   caption: "Skyfall (2012) — bazaar interior shot" },
      { src: "img/films/Skyfall/SkyfallGrandBazaar.jpeg", alt: "Skyfall bazaar chase",   caption: "Skyfall (2012) — opening motorcycle chase" }
    ]
  },
  "skyfall-rooftop": {
    location: [
      { src: "img/locations/Skyfall/skyfallRooftop.jpg", alt: "Grand Bazaar rooftop today", caption: "Grand Bazaar rooftop — lead-covered roof terrain" }
    ],
    film: [
      { src: "img/films/Skyfall/skyfallRooftop.jpg", alt: "Skyfall rooftop chase", caption: "Skyfall (2012) — rooftop motorcycle finale" }
    ]
  },
  "deutsche-orientbank": {
    location: [
      { src: "img/locations/Skyfall/Orientbank Istanbul hotelSkyfall.jpg", alt: "Deutsche Orientbank Hotel today", caption: "Deutsche Orientbank Hotel — Bankalar Caddesi, Karaköy" }
    ],
    film: [
      { src: "img/films/Skyfall/Orientbank Istanbul hotelSkyfall.png", alt: "Skyfall hotel scene", caption: "Skyfall (2012) — Bond's Istanbul base" }
    ]
  },
  "galata-bridge": {
    location: [
      { src: "img/locations/Taken2/Taken2GalataBridge.jpeg",        alt: "Galata Bridge with fishermen", caption: "Galata Bridge — upper deck, looking north toward Karaköy" },
      { src: "img/locations/Taken2/Taken2GalateBridgeTaken2.jpg",   alt: "Galata Bridge alternate view", caption: "Galata Bridge — span across the Golden Horn" }
    ],
    film: [
            { src: "img/films/Taken2/2GalataBridgeTaken2.jpg", alt: "Galata Bridge Taken 2 alternate", caption: "Taken 2 (2012) — second bridge angle" },
      { src: "img/films/Taken2/GalataBridgeTaken2.jpg",  alt: "Galata Bridge in Taken 2",      caption: "Taken 2 (2012) — bridge crossing" }
    ]
  },
  "eminonu": {
    location: [
      { src: "img/locations/Taken2/EminönüTaken2.jpg", alt: "Eminönü Square today", caption: "Eminönü Square — facing the ferry piers" }
    ],
    film: [
      { src: "img/films/Taken2/taken-2-eminönü.jpg",                       alt: "Eminönü in Taken 2",     caption: "Taken 2 (2012) — waterfront escape" },
    ]
  },
  "legacy-ottoman": {
    location: [
      { src: "img/locations/Taken2/taken-2-OttomanHotelreal.jpg",   alt: "Legacy Ottoman Hotel exterior", caption: "Legacy Ottoman Hotel — Sirkeci, neo-Ottoman facade" },
      { src: "img/locations/Taken2/taken-2-OttomanHotelreal 2.jpg", alt: "Legacy Ottoman Hotel detail",   caption: "Legacy Ottoman Hotel — second view" }
    ],
    film: [
      { src: "img/films/Taken2/taken-2-OttomanHotel3.jpg", alt: "Hotel scene 3 in Taken 2", caption: "Taken 2 (2012) — corridor pursuit" },
      { src: "img/films/Taken2/taken-2-OttomanHotel1.jpg", alt: "Hotel scene 1 in Taken 2", caption: "Taken 2 (2012) — family arrival" },
      { src: "img/films/Taken2/taken-2-OttomanHotel2.jpg", alt: "Hotel scene 2 in Taken 2", caption: "Taken 2 (2012) — hotel interior" }
    ]
  },
  "sultan-ahmet-mosque": {
    location: [
      { src: "img/locations/thewater/sultanAhmet.jpg", alt: "Sultan Ahmet Mosque exterior", caption: "Sultan Ahmet Mosque (Blue Mosque) — exterior" }
    ],
    film: [
            { src: "img/films/theWaterDiviner/sultanAhmet.jpg",   alt: "Water Diviner Sultan Ahmet 4", caption: "The Water Diviner (2014) — Connor near the mosque" },
                  { src: "img/films/theWaterDiviner/SultanAhmet3.jpg",  alt: "Water Diviner Sultan Ahmet 3", caption: "The Water Diviner (2014) — courtyard scene" },
      { src: "img/films/theWaterDiviner/Sultan Ahmet2.jpg", alt: "Water Diviner Sultan Ahmet 2", caption: "The Water Diviner (2014) — interior contemplation" },
            { src: "img/films/theWaterDiviner/SultanAhmed.jpg",   alt: "Water Diviner Sultan Ahmet 1", caption: "The Water Diviner (2014) — Connor outside the mosque" }
    ]
  },
  "haydarpasa": {
    location: [
      { src: "img/locations/thewater/Haydarpaşareal 23.53.13.jpg", alt: "Haydarpaşa Train Station today", caption: "Haydarpaşa Train Station — main facade from the sea" }
    ],
    film: [
      { src: "img/films/theWaterDiviner/Haydarpasa.jpg",  alt: "Water Diviner Haydarpaşa 1", caption: "The Water Diviner (2014) — train departure" },
      { src: "img/films/theWaterDiviner/Haydarpasa2.jpg", alt: "Water Diviner Haydarpaşa 2", caption: "The Water Diviner (2014) — platform scene" },
      { src: "img/films/theWaterDiviner/Haydarpaşa1.jpg", alt: "Water Diviner Haydarpaşa 3", caption: "The Water Diviner (2014) — station facade" }
    ]
  },
  "hagia-sophia": {
    location: [
      { src: "img/locations/Inferno/Hagia_Sophia.jpg", alt: "Hagia Sophia interior", caption: "Hagia Sophia — main dome, view from the floor" }
    ],
    film: [
      { src: "img/films/Inferno/AyaSofiaInferno.jpg", alt: "Inferno Hagia Sophia",          caption: "Inferno (2016) — Langdon decoding the clue" },
      { src: "img/films/Inferno/AyaSofiaInferno.png", alt: "Inferno Hagia Sophia alternate", caption: "Inferno (2016) — alternate framing" }
    ]
  },
  "basilica-cistern": {
    location: [
      { src: "img/locations/Inferno/Basilica_Cistern.jpg", alt: "Basilica Cistern columns", caption: "Basilica Cistern — column forest (532 AD)" }
    ],
    film: [
      { src: "img/films/Inferno/BasilicaCistern.png",  alt: "Inferno cistern climax",     caption: "Inferno (2016) — the underground climax" },
      { src: "img/films/Inferno/BasilicaCistern2.png", alt: "Inferno cistern alternate",  caption: "Inferno (2016) — alternate angle" }
    ]
  },
  "sirkeci": {
    location: [
      { src: "img/locations/RussiawithLove/SirkeciRailwayStationRussia.JPG", alt: "Sirkeci Station facade", caption: "Sirkeci Station — Moorish-revival facade (1890)" },
      { src: "img/locations/RussiawithLove/SirkeciStationInsideRussia.webp", alt: "Sirkeci Station platform", caption: "Sirkeci Station — interior platform" }
    ],
    film: [
      { src: "img/films/FromRussiawithLove/SirkeciRailwaySTation.jpg",     alt: "FRWL Sirkeci alt 1",                       caption: "From Russia with Love (1963) — station hall" },
      { src: "img/films/FromRussiawithLove/SirkeciRailwayFromRussion.jpg", alt: "FRWL Sirkeci alt 2",                       caption: "From Russia with Love (1963) — station exterior" },
      { src: "img/films/FromRussiawithLove/SirkeciRailwayFroRussion.jpg",  alt: "FRWL Sirkeci alt 3",                       caption: "From Russia with Love (1963) — platform" },
      { src: "img/films/FromRussiawithLove/SirkeciStationInsideRussia.jpg", alt: "From Russia with Love Sirkeci interior", caption: "From Russia with Love (1963) — Orient Express boarding" }
    ]
  },
  "firuz-aga": {
    location: [
      { src: "img/locations/RussiawithLove/FiruzAga.jpg", alt: "Firuz Aga Mosque today", caption: "Firuz Aga Mosque — Divanyolu Avenue, Sultanahmet" }
    ],
    film: [
      { src: "img/films/FromRussiawithLove/FiruzAga.jpg",  alt: "FRWL Firuz Aga 1", caption: "From Russia with Love (1963) — Sultanahmet surveillance" },
      { src: "img/films/FromRussiawithLove/FiruzAga1.jpg", alt: "FRWL Firuz Aga 2", caption: "From Russia with Love (1963) — Divanyolu Avenue" },
      { src: "img/films/FromRussiawithLove/FiruzAga3.jpg", alt: "FRWL Firuz Aga 3", caption: "From Russia with Love (1963) — alternate angle" }
    ]
  },
  "gulhane-park": {
    location: [
      { src: "img/locations/thewater/gülhane.jpg", alt: "Gülhane Park today", caption: "Gülhane Park — lower paths, near the Topkapı outer wall" }
    ],
    film: [
      { src: "img/films/theWaterDiviner/GulhanePark.jpg", alt: "Water Diviner Gülhane", caption: "The Water Diviner (2014) — Connor walking in the park" }
    ]
  },
  "istanbul-uni": {
    location: [
      { src: "img/locations/Inferno/İSTANBULUNİ.jpg", alt: "Istanbul University main gate", caption: "Istanbul University — main gate, Beyazıt Square (1866)" }
    ],
    film: [
      { src: "img/films/Inferno/İStanbulUniversity.png", alt: "Inferno university scene", caption: "Inferno (2016) — Langdon's research" }
    ]
  }
};

// ============================================================================
// APP_DATA  →  the single top-level object that the rest of the app reads.
// ============================================================================
// The other JS files (app.js, map.js, explore.js) only read from APP_DATA.
// They never read from LOC_META or LOC_IMG directly; the values are pulled
// into the per-location records below using  meta: LOC_META["..."]  and
// images: LOC_IMG["..."].
//
// This separation matters:
//   - LOC_META is shaped like a database (one row per location).
//   - APP_DATA.pursuitLocations and APP_DATA.timelineLocations are shaped like
//     a story (an ordered list with chapters, transitions, and rich text).
//   - Same location appears in both lists with the SAME metadata, but
//     different ordering, different chapter and different narrative notes.
const APP_DATA = {

  // ─── NARRATIVES ──────────────────────────────────────────────────────────────
  // narratives[]  →  two records that describe each narrative (id, title,
  // chapters, accent color, chapter intros, transition lines).
  // app.js calls getNarrativeData() to read these strings.
  narratives: [
    {
      id: "pursuit",
      title: "Pursuit & Passage",
      subtitle: "Action-Driven Cinematic Journey",
      description: "Walk in the footsteps of spies, fugitives and seekers. Five international films use Istanbul's streets, bridges and waterways as a stage for chase, escape and quiet searching. From a covered bazaar to an underground cistern, the city becomes both the path and the prize.",
      theme: "spy",
      chapters: ["Surveillance", "The Chase", "The Search", "Confrontation"],
      accentColor: "#4a8bb5",
      icon: "◈",
      chapterIntros: {
        "Surveillance":  "Every story of pursuit starts with watching. In this first chapter, characters learn the city by reading its crowds and counting its exits. The bazaars become their classrooms, the Bosphorus their mirror.",
        "The Chase":     "Watching turns into running. The Golden Horn cuts the city in two, and bridges, rooftops and ferries become the geography of escape. This is Istanbul at full speed.",
        "The Search":    "Not every pursuit is loud. A father looks for his abducted wife, another father looks for his lost sons, and the city slows down around them. Hotels, mosques and old train stations carry a different kind of urgency — the search for someone missing.",
        "Confrontation": "Every chase ends at a threshold. A 6th-century church, a Byzantine cistern and the platform of the Orient Express each become the stage for a final scene. Istanbul does not just witness these endings; it shapes them."
      },
      // Transition lines shown on the FIRST location of a new chapter, ABOVE the
      // chapter intro. Keyed by destination chapter (the chapter being entered).
      // The first chapter has no transition — there is nothing to leave behind yet.
      chapterTransitions: {
        "The Chase":     "From quiet observation, the city sharpens into motion — the surveillance is over, and the streets begin to move.",
        "The Search":    "The chase falls away. What remains is absence, and a slower kind of attention paid to rooms, mosques and platforms.",
        "Confrontation": "The search has led downward and inward. Every road through Istanbul converges on a single chamber where the story will end."
      }
    },
    {
      id: "timeline",
      title: "Istanbul Through Time in Cinema",
      subtitle: "Analytical Comparative Journey",
      description: "Trace how Istanbul has been filmed from the Cold War to today. The same domes and bridges return again and again, but the camera changes. From the slow, atmospheric gaze of 1963 to the kinetic chases of 2012, the post-war memory of 2014, and the puzzle-solving of 2016, this journey shows how cinema's relationship with the city has evolved.",
      theme: "historical",
      chapters: ["1960s", "2012", "2014", "2016"],
      accentColor: "#c9a55a",
      icon: "◇",
      chapterIntros: {
        "1960s": "In 1963, Istanbul reached global cinema for the first time as a serious location. From Russia with Love filmed mosques, ferries and train stations with documentary care. The city became the very atmosphere of Cold War espionage.",
        "2012":  "Half a century later, two films arrive in the same year. Skyfall and Taken 2 turn the same streets into kinetic action geography. Where the 1960s camera lingered, the 2012 camera chases. The buildings are unchanged; the gaze is not.",
        "2014":  "The Water Diviner brings a quieter Istanbul to the screen. Four years after the centenary of Gallipoli was approaching, an Australian father walks through Sultanahmet, Gülhane Park and Haydarpaşa Station looking for the truth about his missing sons. The city becomes a place of memory.",
        "2016":  "Inferno closes the arc. Hagia Sophia, the Basilica Cistern and Istanbul University are now read as texts to be decoded. Smartphones and audio guides appear in the background. The exotic mystery of the 1960s has become accessible heritage."
      },
      // Transition lines shown on the FIRST location of a new chapter, ABOVE the
      // chapter intro. Keyed by destination chapter (the era being entered).
      chapterTransitions: {
        "2012": "Forty-nine years pass. The same buildings remain, but the camera trades atmosphere for adrenaline.",
        "2014": "Two years on, the camera quiets again. Action gives way to memory and grief.",
        "2016": "Two more years — and Istanbul becomes a text to be decoded, no longer just looked at or run through."
      }
    }
  ],

  // ─── NARRATIVE 1: PURSUIT & PASSAGE (12 locations) ───────────────────────────
  // An ordered array of 12 location objects. The order matters: the Explore
  // page steps through them in this exact sequence.
  // Each object has:
  //   id           unique slug, lower-case with dashes (kebab-case).
  //   name         human-readable location name.
  //   coordinates  [latitude, longitude] in decimal degrees. Used by Leaflet
  //                map and by formatCoords() in app.js to show the GPS overlay.
  //   chapter      one of: Surveillance / The Chase / The Search / Confrontation.
  //                Used to group locations into chapters and pick the badge color.
  //   film, year, director, scene, filmTag  →  film attribution.
  //   camera       sub-object: facing, elevation, focalLength, shotType, angleNote.
  //   images       LOC_IMG["..."]    (gallery, see definition above).
  //   meta         LOC_META["..."]   (catalogue metadata, see definition above).
  //   quote        short atmospheric pull-quote shown above the body text.
  //   texts        { young, adult, scholar }  →  long versions of the text.
  //   textsShort   { young, adult, scholar }  →  brief versions of the text.
  //   narrativeNote  short editorial comment by the author.
  //   nextDirection  human walking instruction to the next stop (e.g. "Walk 2.9 km").
  pursuitLocations: [
    {
      id: "spice-bazaar",
      name: "Spice Bazaar",
      coordinates: [41.0165, 28.9704],
      chapter: "Surveillance",
      film: "Taken 2",
      year: 2012,
      director: "Olivier Megaton",
      scene: "The Surveillance Sequence",
      filmTag: "TAKEN 2 (2012)",
      camera: {
        facing: "W → interior arcade",
        elevation: "Street level",
        focalLength: "50mm (POV); 85mm (face close-ups)",
        shotType: "Handheld POV tracking",
        angleNote: "Best shot point: L-shaped intersection near the Hamidiye Gate. The camera follows Mills' point of view through the arcade."
      },
      images: LOC_IMG["spice-bazaar"],
      meta:   LOC_META["spice-bazaar"],
      quote: "In a crowd this thick, every face is a maybe.",
      texts: {
        young: "In Taken 2, the dad in the movie walks around the old Spice Bazaar. He is not buying anything — he is looking for the bad guys. The market is 360 years old and very busy. Easy to hide in!",
        adult: "In Taken 2 (2012), Bryan Mills (Liam Neeson) enters the Spice Bazaar with a calm face but careful eyes. He notes every door, camera and corner. Built in 1664 next to the New Mosque, the bazaar has an L-shaped plan with two main gates. For a former spy, this layout is ideal: it is easy to watch and easy to leave. Director Olivier Megaton never explains what Mills is doing. The camera just shows it — slow, watchful, professional.",
        scholar: "The Spice Bazaar opened in 1664 as part of the New Mosque complex. Its Turkish name, Mısır Çarşısı, means 'Egyptian Bazaar' because the spices once arrived by ship from Cairo. Today the building has 88 vaulted shops along two long halls that meet at a right angle. In Taken 2 (2012), director Olivier Megaton shoots Bryan Mills here in close-up. Mills walks past sumac, saffron and dried peppers, but the camera follows his eyes, not the spices. He is reading the room. This kind of careful watching fits the place well: spice merchants traded news as well as goods for hundreds of years. Ottoman, Venetian and British agents all passed through these halls. The film does not explain that history, but it uses it. The bazaar is loud, dense and full of strangers, which is exactly what makes it the best place to watch and not be watched."
      },
      textsShort: {
        young:   "Bryan Mills walks through the 360-year-old Spice Bazaar, scanning the crowd for kidnappers. The market is so busy and full of smells that bad guys can hide easily!",
        adult:   "In Taken 2 (2012), Liam Neeson's Bryan Mills enters the 1664 Spice Bazaar with the careful eyes of a former spy, reading the L-shaped Ottoman arcade for exits and threats.",
        scholar: "Olivier Megaton's POV handheld camera reads the 1664 Mısır Çarşısı as tactical terrain — a layered Ottoman vaulted space whose 88-shop L-plan has historically favored exactly the kind of intelligence work the film stages."
      },
      narrativeNote: "Crowded markets are classic spy territory. The noise and the crowd make electronic surveillance almost impossible. Mills' careful walk is a quiet echo of four centuries of intelligence work in this exact building.",
      nextDirection: "Walk 2.9 km E to Maiden's Tower."
    },
    {
      id: "maidens-tower",
      name: "Maiden's Tower",
      coordinates: [41.0211, 29.0042],
      chapter: "Surveillance",
      film: "From Russia with Love",
      year: 1963,
      director: "Terence Young",
      scene: "Bosphorus Tour Surveillance",
      filmTag: "FROM RUSSIA WITH LOVE (1963)",
      camera: {
        facing: "E → Maiden's Tower from ferry deck",
        elevation: "Bosphorus ferry deck (sea level)",
        focalLength: "35mm (Bond + Tania); 85mm (tower against horizon)",
        shotType: "Static deck + slow drift past the tower",
        angleNote: "Best shot point: aboard a Bosphorus ferry passing the tower on the south. Sean Connery photographs Daniela Bianchi while the tower drifts in the background."
      },
      images: LOC_IMG["maidens-tower"],
      meta:   LOC_META["maidens-tower"],
      quote: "A spy on holiday is still a spy.",
      texts: {
        young: "James Bond takes a boat trip with a girl. He pretends to take holiday photos of her. But really he is a spy — and the little tower in the water behind them is the first time many people ever saw Istanbul in a movie!",
        adult: "From Russia with Love (1963) shows James Bond on a Bosphorus boat tour with Tania, the Soviet defector. He takes photographs of her with a small camera, and the iconic Maiden's Tower drifts in the background. The scene looks like simple tourism. In fact, it is surveillance disguised as a holiday. The Maiden's Tower has stood on its small island near the Asian shore since the 12th century in different forms. For Western audiences in 1963, it was their first glimpse of the Bosphorus on screen. The film uses the tower as both atmosphere and cover.",
        scholar: "The Maiden's Tower (Kız Kulesi in Turkish, Leandros in older Greek sources) sits on a small islet just off Üsküdar on the Asian shore of the Bosphorus. A defensive tower has stood here since at least the 12th century, with the current Baroque-style structure dating to 1763 and later restorations. Many legends are attached to it, including the story of a Byzantine princess hidden here to escape a fatal prophecy. In From Russia with Love (1963), Terence Young uses the tower as a quiet backdrop for one of cinema's earliest 'tourist Istanbul' moments. Sean Connery, playing James Bond, takes photographs of Daniela Bianchi (Tania) on the deck of a ferry as the tower passes behind them. The framing is deliberate: the tower anchors the image, the actors fill the frame, and a small camera in Bond's hands quietly does the spy work. For 1960s Western audiences, this was their first cinematic Bosphorus. For the narrative of Pursuit & Passage, it is a key beat: surveillance hidden inside leisure, a passage across water that is also a passage across information."
      },
      textsShort: {
        young:   "Bond pretends to take holiday photos of a girl on a boat, but he is really spying. Behind them stands the little Maiden's Tower in the water.",
        adult:   "From Russia with Love (1963) makes the 12th-century Maiden's Tower one of the first Bosphorus images in international cinema, framing it as quiet cover for Bond's surveillance of Tania.",
        scholar: "Ted Moore's available-light camera treats the 1763 Baroque-era tower as atmospheric anchor: a real place rather than a postcard, locating Bond's surveillance inside an 800-year history of Bosphorus crossings."
      },
      narrativeNote: "This was one of the first times a Western film treated the Bosphorus as a real place rather than an idea. The Maiden's Tower became a cinematic shorthand for Istanbul that later films (including The Water Diviner) would also use.",
      nextDirection: "Walk 3.2 km W to Grand Bazaar."
    },
    {
      id: "grand-bazaar-skyfall",
      name: "Grand Bazaar",
      coordinates: [41.0107, 28.9681],
      chapter: "Surveillance",
      film: "Skyfall",
      year: 2012,
      director: "Sam Mendes",
      scene: "The Bazaar Chase Begins",
      filmTag: "SKYFALL (2012)",
      camera: {
        facing: "NE → central hall",
        elevation: "Street level; rooftop for finale",
        focalLength: "24mm wide (chase); 35mm (inserts)",
        shotType: "Steadicam tracking + motorcycle mount",
        angleNote: "Best shot point: Nuruosmaniye Gate (east entrance). The opening tracking shot follows Bond NE into the Kalpakçılar Caddesi corridor."
      },
      images: LOC_IMG["grand-bazaar"],
      meta:   LOC_META["grand-bazaar"],
      quote: "The maze never shows you all its exits at once.",
      texts: {
        young: "James Bond is chasing a bad guy who stole a computer chip. They run into the Grand Bazaar — a giant indoor shopping street with 4,000 shops! It is so big and busy that even people who live there get lost.",
        adult: "Skyfall (2012) opens with a long chase that explodes through the Grand Bazaar. James Bond pursues a man carrying a stolen hard drive — motorcycles weaving between merchants and tourists, smashing through covered streets. Sam Mendes got special permission from the bazaar's merchant association to film inside. The market's confusing geography becomes the perfect surveillance trap: every exit is contested, every sight line is broken. Even locals get lost in this 15th-century Ottoman maze of more than 31,000 square meters. This is where surveillance ends and the chase begins.",
        scholar: "Skyfall (2012) opens with what is now one of the most famous Istanbul chase sequences in modern cinema. Sam Mendes worked with cinematographer Roger Deakins and second-unit director Alexander Witt to stage a motorcycle pursuit through the real Grand Bazaar. Production negotiated for over eighteen months with the bazaar's merchant associations. Individual shop owners were paid and their stalls re-dressed for the cameras. The 61 covered streets and 4,000+ shops were originally built by Sultan Mehmed II in the 15th century. The space is genuinely confusing: locals still get lost in it. In spy work, crowded markets are classic locations for hidden meetings, because the noise and crowd make electronic surveillance almost impossible. The film uses this fact. The chase climbs from the floor of the bazaar all the way up onto the rooftops, then to the Nuruosmaniye Bridge nearby. The film never gives the viewer a wide map of the space. We are pulled along with Bond, never sure which corridor leads where — exactly the experience of being inside the real bazaar."
      },
      textsShort: {
        young:   "James Bond chases a thief on a motorbike through the world's biggest indoor shopping street — 4,000 shops crowded into 61 covered streets!",
        adult:   "Skyfall (2012) launches its iconic motorcycle pursuit through the 15th-century Grand Bazaar, Sam Mendes converting the merchant maze into the most famous Istanbul chase in modern cinema.",
        scholar: "Mendes and Deakins negotiate eighteen months with the merchant guild to stage their motorcycle Steadicam through Mehmed II's 31,000 m² covered market — a chase that exploits the building's intentionally disorienting Ottoman commercial geometry."
      },
      narrativeNote: "This is the only location in Pursuit & Passage that bridges two chapters. The Grand Bazaar opens as surveillance and ends as a chase. Mendes uses the bazaar's confusing layout to make watching and running feel like the same thing.",
      nextDirection: "Walk 50 m NE to Grand Bazaar Rooftop."
    },
    {
      id: "skyfall-rooftop",
      name: "Grand Bazaar Rooftop",
      coordinates: [41.0110, 28.9685],
      chapter: "The Chase",
      film: "Skyfall",
      year: 2012,
      director: "Sam Mendes",
      scene: "Motorcycle Rooftop Finale",
      filmTag: "SKYFALL (2012)",
      camera: {
        facing: "Aerial N + tracking E along the lead roofs",
        elevation: "Rooftop (~12m above the bazaar floor); helicopter aerial",
        focalLength: "14mm (GoPro mounts); 24mm (motorcycle); 85mm (Bond)",
        shotType: "Motorcycle-mount + helicopter aerial + Steadicam",
        angleNote: "Best shot point: the lead roofs above Kalpakçılar Caddesi, near the Nuruosmaniye Mosque dome. The chase ends on the bridge that connects to the mosque courtyard."
      },
      images: LOC_IMG["skyfall-rooftop"],
      meta:   LOC_META["skyfall-rooftop"],
      quote: "The city has a second floor. Most people never see it.",
      texts: {
        young: "Bond drives his motorbike right up onto the roof of the big market! Up there, you can see all of Istanbul at once — round mosque tops, tall thin towers, and the blue water in the distance. Most people never get to see the city this way.",
        adult: "After the chase floods through the inside of the Grand Bazaar, Skyfall (2012) sends Bond's motorcycle up onto the rooftops. Roger Deakins shoots the sequence with a mix of motorcycle-mount cameras, helicopter aerial shots and steadicam. From up here, Istanbul opens up: the lead roofs of the bazaar, the dome of the Nuruosmaniye Mosque, and the Bosphorus in the distance. The chase ends with Bond jumping the bike onto a moving train. This rooftop world is rarely shown in tourism — it is workers' territory, accessed only with permission. For two minutes, Skyfall makes it global cinema's most famous Istanbul image.",
        scholar: "The lead-covered rooftops of the Grand Bazaar are one of Istanbul's most distinctive vertical surfaces. Built up over centuries on top of the original 15th-century structure, they are normally accessed only by maintenance workers and a small number of antenna technicians. Skyfall (2012) made them famous. After the chase climbs out of the corridors below, Bond's motorcycle bursts up onto the roofs. Cinematographer Roger Deakins used a combination of small motorcycle-mounted cameras, helicopter aerials, and traditional steadicam to capture the sequence. The composition is striking: the dull silver of the lead roofs, the blue-green dome of the Nuruosmaniye Mosque (1755), and far away the Bosphorus. The chase ends on a small stone bridge that spans the gap between the bazaar and the Nuruosmaniye complex. Bond jumps the bike onto a passing train, and the Istanbul sequence transitions into the train fight that follows. For a film that runs about 143 minutes, the Istanbul rooftop is on screen only briefly, but it became one of the most recognised images of the city in 21st-century international cinema."
      },
      textsShort: {
        young:   "Bond drives his motorbike up onto the roof of the Grand Bazaar and zooms past mosque domes in the sunshine!",
        adult:   "Skyfall's rooftop sequence reveals the lead-covered upper world of the Grand Bazaar — a normally invisible vertical city of merchants and pigeons, suddenly on global screens.",
        scholar: "Deakins's combination of motorcycle GoPros, helicopter aerials and Steadicam transforms the lead roofs above Kalpakçılar Caddesi into legible geography, making the bazaar's previously unfilmed upper surface part of 21st-century international visual culture."
      },
      narrativeNote: "The bazaar's rooftops are normally invisible to tourists. Skyfall briefly shows global audiences what merchants, restorers and pigeons have always known: there is a second city above the first.",
      nextDirection: "Walk 830 m NE to Galata Bridge."
    },
    {
      id: "galata-bridge",
      name: "Galata Bridge",
      coordinates: [41.0173, 28.9738],
      chapter: "The Chase",
      film: "Taken 2",
      year: 2012,
      director: "Olivier Megaton",
      scene: "The Bridge Crossing",
      filmTag: "TAKEN 2 (2012)",
      camera: {
        facing: "N (Eminönü → Karaköy); reverse shots look S",
        elevation: "Upper deck; lower deck for insert shots",
        focalLength: "18mm wide; 200mm tele (fishermen foreground)",
        shotType: "Tracking car-mount + tripod inserts",
        angleNote: "Best shot point: midspan upper deck, facing N. The two-level bridge gives the camera unusual vertical compositions."
      },
      images: LOC_IMG["galata-bridge"],
      meta:   LOC_META["galata-bridge"],
      quote: "Every crossing is a small decision.",
      texts: {
        young: "The Galata Bridge is a very cool bridge with two floors! Cars drive on the top. Restaurants are on the bottom. And the whole way along, people stand and fish! In Taken 2, the dad runs across this bridge to get away from the bad guys.",
        adult: "The Galata Bridge connects old Istanbul (Eminönü) with the Galata side. In Taken 2 (2012), Bryan Mills crosses it in the middle of the chase. The current bridge opened in 1994 after the previous one burned down. It has two levels: traffic above and restaurants below. Hundreds of fishermen lean on the railings every day, indifferent to whatever is happening around them. For an action film, this is gold. The bridge is both an obstacle and a witness — a 490-meter line that the camera follows for almost the entire chase.",
        scholar: "The current Galata Bridge is the fifth bridge to span the Golden Horn at this point. It opened in December 1994, replacing the previous bridge that burned in a 1992 accident. It is 490 meters long and has a central drawbridge that opens at night for larger ships to pass. Its most distinctive feature is the two-level design: six lanes of traffic and a tram line above, and a row of restaurants and cafes opening onto the water below. In Taken 2 (2012), Olivier Megaton's cinematographer Romain Lacourbas uses this two-level structure for unusual compositions — multiple stories stacked into a single architectural envelope. The bridge is also a key crossing point in the city's mental map: from the historic peninsula of Sultanahmet (Ottoman, Byzantine) to the European quarter of Galata-Karaköy (Genoese, modern). For Mills, crossing the bridge is both a literal escape and a symbolic shift. The fishermen who line the railings barely react to the chase. They have been here since 1994; nothing surprises them anymore. That indifference is the point. For the chase, the bridge is a crisis. For everyone else on it, it is an ordinary Tuesday."
      },
      textsShort: {
        young:   "Bryan Mills runs across a busy two-floor bridge in his big chase! Cars zoom above; restaurants and fishermen line the lower deck.",
        adult:   "Taken 2 (2012) uses the 1994 Galata Bridge as a long, narrow chase corridor between continents — its two-level deck offering Romain Lacourbas vertical compositions rare in action filmmaking.",
        scholar: "Lacourbas exploits the bridge's deliberate two-tier engineering to stack multiple action plates inside a single 490-meter envelope, with the indifferent fishermen along the upper deck functioning as a quiet civil chorus."
      },
      narrativeNote: "The bridge is both a moment of pure speed and a marker of the city's geography. Every Istanbul story has to cross this water at some point — Mills, Bond, even Connor in The Water Diviner. The Golden Horn defines the dramatic structure of the city.",
      nextDirection: "Walk 60 m SE to Eminönü Square."
    },
    {
      id: "eminonu-square",
      name: "Eminönü Square",
      coordinates: [41.0168, 28.9742],
      chapter: "The Chase",
      film: "Taken 2",
      year: 2012,
      director: "Olivier Megaton",
      scene: "The Waterfront Escape",
      filmTag: "TAKEN 2 (2012)",
      camera: {
        facing: "N → Galata, NE → ferry piers",
        elevation: "Street + rooftop (ferry terminal)",
        focalLength: "28mm wide; 135mm compression",
        shotType: "Crane + handheld chase",
        angleNote: "Best shot point: in front of the New Mosque steps, facing the ferry piers. The square's openness forces the chase into a clear, legible space."
      },
      images: LOC_IMG["eminonu"],
      meta:   LOC_META["eminonu"],
      quote: "Where land meets water, the rules change.",
      texts: {
        young: "Eminönü is a busy square right by the water. Lots of ferry boats leave from here, going in many different directions. In Taken 2, the dad runs to the boats — because if you do not know which boat someone took, you cannot follow them!",
        adult: "Eminönü sits where the Golden Horn meets the Bosphorus — the city's main maritime crossroads since Byzantine times. In Taken 2 (2012), the ferry terminal becomes a key escape point. The square is wide and open, with the New Mosque on one side, the Galata Bridge ahead, and the ferry piers on the right. For a fugitive, water gives options that streets cannot: many boats, many destinations, and unclear pursuit. Olivier Megaton uses fast cuts but keeps the geography readable. Istanbul's two-continent location means its waterfronts are both entry and exit points — a fact every spy film has used since 1963.",
        scholar: "Eminönü has been the commercial hinge of Istanbul since the Byzantine period, when the nearby Neorion harbor served as the empire's main customs station. The square was rebuilt in the early 20th century, and the ferry terminals were constructed between 1913 and 1958 in stages. In Taken 2 (2012), Olivier Megaton uses what we might call the 'honest geography' of the space. Unlike the Spice Bazaar nearby, which works on disorientation, the waterfront chase works on clarity. The camera returns again and again to three anchors: the New Mosque (1664) to the west, the Galata Bridge to the north, and the ferry piers to the east. Strategically, Eminönü has been an escape vector for every regime that has controlled this city. Byzantine admirals kept reserve fleets in this small harbor because the meeting of the Golden Horn and the Bosphorus allows departure in three directions at once. Ottoman customs records document hundreds of years of fugitive departures by hired boat. Mills' tactical instinct here is sound in a way that goes back a thousand years. No other single square in Europe offers as many escape routes."
      },
      textsShort: {
        young:   "Mills runs to the busy ferry square by the water — where boats leave for many places, so it is hard to know which one a runaway took.",
        adult:   "In Taken 2 (2012), Eminönü Square — Istanbul's main ferry hub since Byzantine times — becomes the chase's escape valve, where streets give way to boats and pursuit becomes ambiguous.",
        scholar: "Megaton anchors the chase on the legible triangle of New Mosque (1664), Galata Bridge and the 1913–58 ferry piers, exploiting the same maritime escape geometry that has defined this customs hinge since the Byzantine Neorion harbor."
      },
      narrativeNote: "The waterfront has always been Istanbul's release valve. Empires have changed, ferries have replaced caiques, but the basic logic is the same: when the streets close in, you head for the water.",
      nextDirection: "Walk 130 m S to Legacy Ottoman Hotel."
    },
    {
      id: "legacy-ottoman",
      name: "Legacy Ottoman Hotel",
      coordinates: [41.0156, 28.9742],
      chapter: "The Search",
      film: "Taken 2",
      year: 2012,
      director: "Olivier Megaton",
      scene: "Where the Search Begins",
      filmTag: "TAKEN 2 (2012)",
      camera: {
        facing: "Interior corridor + courtyard balcony",
        elevation: "Ground floor + 4th-floor balcony",
        focalLength: "28mm interiors; 50mm dialogue",
        shotType: "Static interior + handheld pursuit",
        angleNote: "Best shot point: the inner courtyard balcony, looking down. The hotel's neo-Ottoman architecture provides layered framings ideal for a sudden attack."
      },
      images: LOC_IMG["legacy-ottoman"],
      meta:   LOC_META["legacy-ottoman"],
      quote: "A search begins the moment someone is missing.",
      texts: {
        young: "The dad in Taken 2 comes to Istanbul on holiday with his family. They stay in this beautiful old hotel. But then bad guys come and take his wife! From this moment on, the whole movie is about finding her.",
        adult: "In Taken 2 (2012), the Mills family uses the Legacy Ottoman Hotel as their base in Istanbul. It is a real hotel in Sirkeci, in a restored 19th-century neo-Ottoman building. Bryan Mills, his ex-wife Lenore and their daughter Kim arrive looking forward to a calm holiday. Then the kidnapping begins, and Lenore is taken. From this moment, Mills' job is no longer surveillance, no longer chase — it is search. The hotel is where his pursuit changes nature: he is now looking for a missing person. The same chapter holds Connor's search for his lost sons in The Water Diviner. Two fathers, two missing loved ones, the same emotional gravity.",
        scholar: "The Legacy Ottoman Hotel sits on Hamidiye Caddesi in Sirkeci, just north of the Sirkeci railway station. The building dates from the late 19th century, when the Ottoman state was investing in modern infrastructure for the new Rumeli Railway terminus across the street. The hotel was carefully restored and reopened with the 'Legacy Ottoman' name in the 2010s. In Taken 2 (2012), it serves as the home base for Bryan Mills, his ex-wife Lenore (Famke Janssen), and their daughter Kim (Maggie Grace). The film shoots the interior courtyard and the upper-floor balconies, using the layered neo-Ottoman architecture to create a sense of multiple sight lines and possible threats. For most of the first act, the hotel feels safe — until it is not. From the moment Lenore is abducted from the surrounding streets, the entire architecture of the film shifts. Mills is no longer in surveillance mode and not yet in chase mode. He is in search mode. This emotional gear shift is what makes the Legacy Ottoman the natural opening of the Search chapter. The Pursuit & Passage narrative pairs Mills' loss with Joshua Connor's search for his missing sons in The Water Diviner. Two fathers, two missing loved ones, two completely different cinematic styles, but the same fundamental drive."
      },
      textsShort: {
        young:   "Mills' family stays in this lovely old hotel in Istanbul. But then bad guys take his wife — and the search begins.",
        adult:   "Taken 2 (2012) inverts thriller convention by making the restored neo-Ottoman Legacy Ottoman Hotel the site of loss rather than safety, opening the Search chapter with absence.",
        scholar: "The film stages its emotional pivot inside a precisely 2010s Istanbul object: a late-19th-century Sirkeci hotel that survived neglect and reopened in the boutique-restoration wave, its layered courtyard architecture used by Megaton for sudden-threat sight-lines."
      },
      narrativeNote: "Hotels are usually the safest space in a thriller. Taken 2 turns this convention upside down — the hotel becomes the place where the loss happens. The Search chapter begins not with action, but with absence.",
      nextDirection: "Walk 1.2 km S to Sultan Ahmet Mosque."
    },
    {
      id: "sultan-ahmet-mosque",
      name: "Sultan Ahmet Mosque",
      coordinates: [41.0054, 28.9768],
      chapter: "The Search",
      film: "The Water Diviner",
      year: 2014,
      director: "Russell Crowe",
      scene: "Connor in Sultanahmet",
      filmTag: "THE WATER DIVINER (2014)",
      camera: {
        facing: "S → mosque facade; interior dome up",
        elevation: "Courtyard ground level + interior",
        focalLength: "24mm wide (architecture); 50mm (Connor)",
        shotType: "Slow dolly + static contemplative",
        angleNote: "Best shot point: the outer courtyard, facing south toward the main entrance. Connor is framed small against the building — a foreigner in a sacred space."
      },
      images: LOC_IMG["sultan-ahmet-mosque"],
      meta:   LOC_META["sultan-ahmet-mosque"],
      quote: "A foreign building can still feel like a place to grieve.",
      texts: {
        young: "An Australian dad comes to Istanbul to look for his three sons, who went missing in a big war. He visits the giant Blue Mosque. He has never been in a mosque before, but he takes off his shoes and sits quietly. Sad places feel the same in every country.",
        adult: "In The Water Diviner (2014), Joshua Connor (Russell Crowe) travels to Istanbul in 1919 to find what happened to his three sons, who were lost at Gallipoli four years earlier. Director-actor Crowe films Connor in the Sultan Ahmet Mosque (the Blue Mosque, finished in 1617). Connor is a Christian Australian farmer in a 17th-century Ottoman imperial mosque. He removes his shoes, looks up at the dome, and sits quietly. The film does not explain what he prays for — it just lets him sit. For the Pursuit & Passage narrative, this is the emotional core of the Search chapter: a different kind of looking, a slower kind of love.",
        scholar: "The Sultan Ahmet Mosque, popularly known in English as the Blue Mosque for its 20,000 İznik tiles, was completed in 1617 by Sultan Ahmed I. It was designed by Sedefkâr Mehmed Ağa, a student of the great Ottoman architect Sinan. The mosque has six minarets — an unusual number that briefly caused a religious controversy with Mecca, only resolved by sending a seventh minaret to the Ka'ba complex. In The Water Diviner (2014), Russell Crowe directs himself as Joshua Connor, an Australian water-diviner who travels to Istanbul in 1919 to find what happened to his three sons, killed (he believes) at the Battle of Gallipoli in 1915. Crowe shoots Connor inside the mosque with quiet reverence. There is no dialogue for long stretches; the camera lingers on Connor's face and on the cascading half-domes. This is not a tourist scene. The film treats the mosque as a serious sacred space, and treats Connor as a foreigner who recognises that. The Sultan Ahmet Mosque sequence pairs with Bryan Mills' loss at the Legacy Ottoman Hotel. Both men are searching. One is loud and tactical. The other is quiet and grieving. The Pursuit & Passage narrative holds both at once, because both are real."
      },
      textsShort: {
        young:   "An Australian dad walks into the Blue Mosque looking for peace. He is sad about his lost sons, and the quiet old mosque welcomes him in.",
        adult:   "The Water Diviner (2014) places its grieving Australian father (Russell Crowe) inside the 1617 Sultan Ahmet Mosque with extended silence — Hollywood's first major reverent treatment of an Istanbul mosque interior.",
        scholar: "Crowe's slow dolly through Sedefkâr Mehmed Ağa's six-minareted imperial mosque refuses exoticization: Connor's Christian foreigner sits inside a working sacred space, and the film treats his grief as commensurable with the building's own."
      },
      narrativeNote: "This was one of the first major international films to take Turkish religious heritage seriously rather than as exotic background. Russell Crowe's reverence for the space is part of the film's argument: that the Anzac and Ottoman dead share a battlefield and a memory.",
      nextDirection: "Walk 3.7 km E to Haydarpaşa Train Station."
    },
    {
      id: "haydarpasa-station",
      name: "Haydarpaşa Train Station",
      coordinates: [40.9967, 29.0192],
      chapter: "The Search",
      film: "The Water Diviner",
      year: 2014,
      director: "Russell Crowe",
      scene: "Train to Anatolia",
      filmTag: "THE WATER DIVINER (2014)",
      camera: {
        facing: "S → main facade from quay; W → platform interior",
        elevation: "Quay + platform; brief overhead for train departure",
        focalLength: "35mm (facade); 85mm (Connor on platform)",
        shotType: "Dolly + tripod with departing-train motion",
        angleNote: "Best shot point: the front quay, facing south toward the main facade. The station's German neo-Renaissance design dominates the frame."
      },
      images: LOC_IMG["haydarpasa"],
      meta:   LOC_META["haydarpasa"],
      quote: "Some searches require a train.",
      texts: {
        young: "The Australian dad gets on a train to keep looking for his sons. The train station is on the Asian side of Istanbul, right next to the sea. With its two clock towers, it looks like a small palace floating on the water!",
        adult: "Haydarpaşa is a grand train station on the Asian side of Istanbul, opened in 1908 as the start of the Anatolian Railway. In The Water Diviner (2014), Joshua Connor boards a train here to travel east toward the old Gallipoli battlefield. The film treats the building with care: its German neo-Renaissance facade (designed by Otto Ritter and Helmut Cuno) faces the Bosphorus, almost looking like a small palace floating on the water. For the Pursuit & Passage narrative, Haydarpaşa is the moment when the search becomes physical motion. The chapter ends here as Connor steps onto the train — a passage in the most literal sense.",
        scholar: "Haydarpaşa Train Station was opened in 1908 as the western terminus of the Chemin de fer Ottoman d'Anatolie (the Ottoman Anatolian Railway), which ran east through Eskişehir, Konya, and eventually reached Baghdad as part of the famous Berlin-Baghdad Railway project. The building was designed by the German architects Otto Ritter and Helmut Cuno in a neo-Renaissance style adapted to its difficult site: the entire station is built on more than a thousand wooden piles driven into the soft seabed at the foot of the Asian shore. Its iconic main facade, with two clock towers, faces directly onto the Bosphorus. In The Water Diviner (2014), Russell Crowe uses the station for one of the film's most romantic visual sequences: Joshua Connor's departure for Anatolia. The camera takes time with the building — wide shots of the facade from the water, slow tracking along the platform — because the film knows that the station itself carries meaning. Haydarpaşa was the gateway to the Anatolian war fronts during the First World War. Thousands of Ottoman soldiers boarded trains here on their way to Gallipoli, the Caucasus, and Mesopotamia. Connor's 1919 departure follows their route in reverse, going east to find what they left behind. The station suffered a serious roof fire in 2010, four years before the film was made; the production captures it in a state of partial restoration. Today the building is no longer in regular use as an active train station, but its symbolic weight has only grown."
      },
      textsShort: {
        young:   "Connor takes a train to keep looking for his lost sons. The station looks like a small palace floating right next to the sea!",
        adult:   "The Water Diviner (2014) stages Connor's eastward search from the 1908 Haydarpaşa Station — the Berlin–Baghdad Railway's neo-Renaissance terminal that physically embodies foreign architects working on Ottoman infrastructure.",
        scholar: "Crowe's slow tracking past Ritter and Cuno's facade locates the film's grief inside layered imperial geographies: a German neo-Renaissance station built on a thousand piles for an Anatolian Railway carrying Ottoman conscripts to fronts that took foreign sons."
      },
      narrativeNote: "Haydarpaşa is the only major Istanbul building constructed by foreign architects on the Asian shore for an Ottoman state project. The film places Connor's grief in this complex history: a foreign architecture for a foreign passenger searching for his foreign-soldier sons.",
      nextDirection: "Walk 3.5 km W to Hagia Sophia."
    },
    {
      id: "hagia-sophia-inferno",
      name: "Hagia Sophia",
      coordinates: [41.0086, 28.9802],
      chapter: "Confrontation",
      film: "Inferno",
      year: 2016,
      director: "Ron Howard",
      scene: "Decoding the Clue",
      filmTag: "INFERNO (2016)",
      camera: {
        facing: "E → apse with Islamic calligraphic roundels visible; up → main dome",
        elevation: "Ground floor + upper gallery",
        focalLength: "16mm wide (full interior); 35mm (tourist crowds); 85mm (Langdon)",
        shotType: "Steadicam + static contemplative",
        angleNote: "Best shot point: beneath the main dome, facing east. The same anchor as From Russia with Love (1963) — Howard deliberately echoes Young's framing 53 years later."
      },
      images: LOC_IMG["hagia-sophia"],
      meta:   LOC_META["hagia-sophia"],
      quote: "A thousand years of prayer leaves a residue.",
      texts: {
        young: "In the movie Inferno, a smart professor goes inside Hagia Sophia to find a secret clue. This building is almost 1,500 years old! It was first a church, then a mosque, then a museum, and now a mosque again. Walls that old know lots of secrets.",
        adult: "In Inferno (2016), Harvard professor Robert Langdon (Tom Hanks) searches Hagia Sophia for a hidden clue. The building was completed in 537 AD as the cathedral of the Byzantine Empire. It was the largest interior space in the world for almost a thousand years. Today, its central dome (31 meters across) appears almost to float. Director Ron Howard uses the same camera angle as From Russia with Love (1963), but the scene around it is different: now the space is full of tourists, smartphones, audio guides. Hagia Sophia is no longer mysterious. It is a heritage destination, full of light. Langdon's job is not to fight here. It is to read.",
        scholar: "Hagia Sophia, dedicated on 27 December 537 AD, was designed by the mathematicians Anthemius of Tralles and Isidore of Miletus for the Byzantine Emperor Justinian. It replaced an earlier church destroyed in the Nika Riots of 532. For nearly a thousand years it stood as the largest interior space in the world. Its central dome — 31.25 meters across, suspended on four pendentives in a structural system that had no precedent at this scale — appears to float. The building has been many things: Orthodox cathedral until 1453, Roman Catholic cathedral briefly under Latin occupation (1204–1261), imperial Ottoman mosque (1453–1934), state museum (1934–2020), and active mosque again since July 2020. In Inferno (2016), Ron Howard uses Hagia Sophia for one of the film's most important set pieces. Langdon walks through the same crossing under the main dome that Sean Connery walked through in From Russia with Love (1963). The framing is almost identical. But everything around it has changed. In 1963, Hagia Sophia received about 300,000 visitors a year. By 2016, that number was over 3.4 million. Howard's cinematographer Salvatore Totino fills the background with smartphones, tour groups, and audio-guide cables. The film treats the building less as a sacred space and more as an information system: Langdon is here to decode a clue, not to pray. For the Pursuit & Passage narrative, Hagia Sophia is the first beat of the final Confrontation. Langdon's quiet decoding here is the calm before the chase that ends in the Basilica Cistern."
      },
      textsShort: {
        young:   "Professor Langdon goes inside Hagia Sophia, almost 1,500 years old, to search for a hidden clue.",
        adult:   "Inferno (2016) sends Robert Langdon into the 537 AD Hagia Sophia not to fight but to read, framing Justinian's cathedral-mosque-museum as a decodable information system.",
        scholar: "Howard's Steadicam reframes the same anchor under Anthemius and Isidore's 31.25 m floating dome that Terence Young used in 1963, but the sacred space now reads as a tourist heritage venue with smartphones in every plate."
      },
      narrativeNote: "Inferno was filmed in 2015–2016, while Hagia Sophia was still operating as a state museum. After 2020, when the building was reconverted into an active mosque, this footage became unintentionally archival — a record of a version of the space that no longer exists in quite the same way.",
      nextDirection: "Walk 160 m W to Basilica Cistern."
    },
    {
      id: "basilica-cistern",
      name: "Basilica Cistern",
      coordinates: [41.0083, 28.9783],
      chapter: "Confrontation",
      film: "Inferno",
      year: 2016,
      director: "Ron Howard",
      scene: "The Underground Climax",
      filmTag: "INFERNO (2016)",
      camera: {
        facing: "SW (into the column forest); close-up N on Medusa heads",
        elevation: "Below grade (-9m); boardwalk level",
        focalLength: "14mm ultra-wide (column forest); 100mm macro (Medusa)",
        shotType: "Steadicam tracking through water + static atmospheric",
        angleNote: "Best shot point: the central boardwalk, two-thirds into the chamber, facing southwest. The Medusa columns are at the far northwest corner."
      },
      images: LOC_IMG["basilica-cistern"],
      meta:   LOC_META["basilica-cistern"],
      quote: "The oldest secrets wait beneath the city.",
      texts: {
        young: "Deep under Istanbul there is a giant underground room full of water and 336 huge stone columns. It was built almost 1,500 years ago to keep water for the city. In Inferno, the professor runs through this spooky place while the water rises around him!",
        adult: "The Basilica Cistern (Yerebatan Sarnıcı, 'Sunken Palace') is the largest of around 500 ancient cisterns under Istanbul. It was built in 532 AD by the Byzantine emperor Justinian to store water for the great palace and other buildings. The chamber is huge: 138 meters by 65 meters, with 336 marble columns in twelve rows. In Inferno (2016), Robert Langdon races through these columns as floodwaters rise around a hidden bioweapon. Ron Howard uses the existing amber lighting (installed in 1987) almost unchanged. The cistern reads on screen as genuinely vast and genuinely ancient — because it is. This is the climax of the entire Pursuit & Passage narrative.",
        scholar: "The Basilica Cistern was built under Byzantine Emperor Justinian I in 532 AD, the same year that the Nika Riots nearly destroyed his reign. It is the largest of around 500 ancient cisterns lying beneath the city of Istanbul. Its dimensions are cathedral-scale: 138 meters by 65 meters, with a storage capacity of 80,000 cubic meters of water, supported by 336 marble columns arranged in twelve rows of 28. The columns are architectural recycling — they were taken from earlier Roman and Hellenistic temples across the Empire. This explains their stylistic mix: Ionic, Corinthian and Doric capitals all appear, sometimes in the same row. The two most famous columns, in the northwest corner, rest on blocks carved with the head of Medusa: one upside-down, one on its side. Scholars believe these are recycled spolia rather than deliberate symbols, but their visual power is undeniable. The cistern was effectively forgotten in the Ottoman period until 1545, when the French scholar Petrus Gyllius rediscovered it after hearing that local residents were drawing water through holes in their floors. In Inferno (2016), Ron Howard turns this space into the climactic stage of the film. Robert Langdon races against rising water that threatens to release a global bioweapon — a plot device that uses the cistern's original function (water storage) against itself. The lighting is almost unchanged from the Istanbul Metropolitan Municipality's 1987 tourist installation. For the Pursuit & Passage narrative, this is the floor of the city: the deepest, oldest, darkest point of the entire journey. Everything has been heading here."
      },
      textsShort: {
        young:   "Deep underground, 336 stone columns hold up a giant water cave! Langdon has to wade through it before time runs out.",
        adult:   "Inferno (2016) builds its climax inside Justinian's 532 AD Basilica Cistern — 138 × 65 meters, 336 recycled marble columns — the deepest, oldest beat of the entire Pursuit & Passage narrative.",
        scholar: "Howard's wide lenses preserve Petrus Gyllius's 1545 sense of cathedral-scale subterranean discovery, and the bioweapon threat makes the cistern's original Byzantine water-storage function the dramatic engine of its own peril."
      },
      narrativeNote: "Inferno's biggest contribution to global cinema was bringing underground Istanbul to a worldwide audience. Most tourists used to stop at street level. After 2016, the Basilica Cistern's visitor numbers spiked — a textbook example of the Live Museum of Movie Locations effect.",
      nextDirection: "Walk 560 m N to Sirkeci Railway Station."
    },
    {
      id: "sirkeci-station",
      name: "Sirkeci Railway Station",
      coordinates: [41.0133, 28.9782],
      chapter: "Confrontation",
      film: "From Russia with Love",
      year: 1963,
      director: "Terence Young",
      scene: "Boarding the Orient Express",
      filmTag: "FROM RUSSIA WITH LOVE (1963)",
      camera: {
        facing: "W → platform; E → Moorish facade",
        elevation: "Platform + mezzanine balcony",
        focalLength: "32mm (atmosphere); 75mm (Bond + Tania)",
        shotType: "Dolly along platform + static Moorish arch framing",
        angleNote: "Best shot point: Platform 1, under the iron canopy, facing the Moorish entrance arch. Bond is framed against Jachmund's 1890 facade."
      },
      images: LOC_IMG["sirkeci"],
      meta:   LOC_META["sirkeci"],
      quote: "Some journeys begin here. Others end.",
      texts: {
        young: "Sirkeci was the last stop of the Orient Express, the most famous train in the world. The train ran from Paris all the way to Istanbul for 126 years! In the Bond movie, the spy hops on this train carrying a secret machine — and the adventure rolls away with him.",
        adult: "Sirkeci was the legendary final stop of the Orient Express, the most famous train in history. In From Russia with Love (1963), Bond boards here for Venice, carrying a stolen Soviet cipher machine and a defecting cryptographer. The station's Moorish-style architecture, designed by the German architect August Jachmund in 1890, gives the scene a perfect look: half European train station, half Ottoman gateway. The Orient Express ran from Paris to Istanbul from 1883 to 2009, and Sirkeci was always its final destination. Its last departure in 2009 closed a chapter of European history. For the Pursuit & Passage narrative, this is the closing image — pursuit ends, and the passage begins.",
        scholar: "Sirkeci Railway Station was designed by the German architect August Jachmund and opened on 3 November 1890 as the Istanbul terminus of the Rumeli Railway, which connected the Ottoman capital to the rest of Europe. Jachmund's design is an important example of late-19th-century Ottoman revivalism: a European rail station wrapped in a 'Moorish' architectural vocabulary — pointed arches, polychrome masonry, a rose window — that signals both modernity and Ottoman identity. The Orient Express operated in some form from 1883 to 2009, a 126-year run that made Sirkeci one of the most symbolically charged train stations in the world. It became associated with diplomatic espionage, European luxury tourism, and interwar refugee movement. Agatha Christie wrote much of Murder on the Orient Express while staying at the nearby Pera Palace Hotel. In From Russia with Love (1963), Terence Young, working with cinematographer Ted Moore, treats the station with unusual respect for a Bond film. The Sirkeci sequence is remarkable for its quietness: there are no explosions, no chases on the platform itself. It is a film of glances and timetables. The action will start once the train leaves. The station is still operating today as a suburban rail terminus, although international services ended in 2009. Part of the interior now houses the Istanbul Railway Museum. The continued working life of the building gives it a quality rare in heavily touristed Istanbul: it is still a real place, used by commuters who barely notice its history. For the entire Pursuit & Passage narrative, Sirkeci is the final image — the place where pursuit ends and passage begins."
      },
      textsShort: {
        young:   "The most famous train in the world — the Orient Express — used to end its long ride from Paris right here. Bond catches it as the adventure rolls away.",
        adult:   "From Russia with Love (1963) closes its Istanbul act at Jachmund's 1890 Sirkeci Station, a Moorish-revival terminal where pursuit yields to passage as the Orient Express pulls out.",
        scholar: "Young's restrained dolly along Platform 1 treats Sirkeci as 126 years of layered diplomatic and literary symbolism: end of European rail, beginning of Ottoman identity, station of Christie and the Cold War."
      },
      narrativeNote: "Placed at the end of the narrative, Sirkeci closes both meanings of the title. The pursuit ends with Bond boarding the train; the passage begins as the Orient Express leaves the platform. Every other location in the journey has been a step toward this departure."
    }
  ],

  // ─── NARRATIVE 2: ISTANBUL THROUGH TIME (16 locations) ───────────────────────
  // Same shape as pursuitLocations[], but ordered by FILM ERA (1963 → 2012 →
  // 2014 → 2016) instead of action chapter. The chapter field here is the era
  // year ("1960s", "2012", "2014", "2016"). Some locations appear in both
  // pursuit and timeline arrays, but with DIFFERENT chapter and DIFFERENT
  // narrative notes — the same place reads differently in each story.
  timelineLocations: [
    // ── 1960s — From Russia with Love (3) ──
    {
      id: "firuz-aga-1963",
      name: "Firuz Aga Mosque",
      coordinates: [41.0072, 28.9783],
      chapter: "1960s",
      film: "From Russia with Love",
      year: 1963,
      director: "Terence Young",
      scene: "Surveillance in Sultanahmet",
      filmTag: "FROM RUSSIA WITH LOVE (1963)",
      camera: {
        facing: "S → mosque entrance; reverse shots toward Hippodrome",
        elevation: "Street level (Divanyolu Avenue)",
        focalLength: "35mm + 50mm",
        shotType: "Static + slow dolly, no handheld",
        angleNote: "Best shot point: across Divanyolu, looking south toward the small mosque. The 1491 building anchors the frame; Bond and the Bulgarian agent move around it."
      },
      images: LOC_IMG["firuz-aga"],
      meta:   LOC_META["firuz-aga"],
      quote: "The smallest mosque can witness the largest things.",
      texts: {
        young: "This little mosque is more than 500 years old! In the old Bond movie from 1963, James Bond walks right past it while a sneaky agent follows him. The mosque is just there in the background, doing its job — and that is exactly how movies showed Istanbul back then: calm and quiet.",
        adult: "The Firuz Aga Mosque is a small, single-domed mosque built in 1491 on Divanyolu Avenue, in Sultanahmet. It is one of the few surviving early-Ottoman buildings of its size in central Istanbul. In From Russia with Love (1963), Bond walks down Divanyolu while a Bulgarian agent follows him. The mosque appears in the background of several wide shots. Director Terence Young uses the building the way 1960s Western cinema often used Istanbul: as atmospheric reality. There are no explanations and no establishing tourist shots. The mosque is just there, doing its job, while a quiet spy story passes by.",
        scholar: "Firuz Aga Mosque was built in 1491 by Firuz Bey, the chief treasurer of Sultan Bayezid II. It is a small, classically proportioned mosque with a single dome, a single minaret, and a modest porch. It sits on Divanyolu Avenue, the historic main road that crossed the Byzantine and Ottoman city center, connecting the imperial palaces to the city gates. Many later Ottoman tombs and small structures cluster around it. In From Russia with Love (1963), Terence Young filmed several Sultanahmet sequences along Divanyolu. Bond walks the avenue while a Bulgarian agent — working for SPECTRE — shadows him. The Firuz Aga Mosque appears in the background of several wide and medium shots. The film does not name the mosque or explain anything about it. Instead, it uses the building the way the rest of 1963 location cinema used Istanbul: as quiet, real, lived-in atmosphere. This was a very different approach from the studio-bound spy films of just a few years earlier. The 1960s 'serious location shoot' aesthetic would influence Bond films for the next two decades. For the Through Time narrative, the Firuz Aga Mosque is a small but important piece of evidence: this is what 1963 cinematic Istanbul looked like — domes in the background, agents in the foreground, and the camera trusting the city to be itself."
      },
      textsShort: {
        young:   "Bond strolls past this small 500-year-old mosque while a sneaky agent watches him from behind.",
        adult:   "From Russia with Love (1963) lets the small 1491 Firuz Aga Mosque sit quietly in the background of a Sultanahmet surveillance walk — atmosphere as 1960s cinema understood Istanbul.",
        scholar: "Terence Young uses Firuz Bey's modest single-domed mosque on Divanyolu as ambient real-world texture, exemplifying the 1960s 'serious location shoot' aesthetic that trusted unexplained Ottoman architecture to do its own narrative work."
      },
      narrativeNote: "1960s Istanbul cinema treated mosques as background atmosphere, not foreground subjects. Compare this to The Water Diviner (2014), which films the Sultan Ahmet Mosque interior with deep reverence. The same kind of building, two completely different cinematic approaches.",
      nextDirection: "Walk 2.7 km NE to Maiden's Tower."
    },
    {
      id: "maidens-tower-1963",
      name: "Maiden's Tower",
      coordinates: [41.0211, 29.0042],
      chapter: "1960s",
      film: "From Russia with Love",
      year: 1963,
      director: "Terence Young",
      scene: "Bosphorus Tour",
      filmTag: "FROM RUSSIA WITH LOVE (1963)",
      camera: {
        facing: "E → Maiden's Tower from ferry deck",
        elevation: "Bosphorus ferry deck",
        focalLength: "35mm (Bond + Tania); 85mm (tower)",
        shotType: "Static deck + slow drift past the tower",
        angleNote: "Best shot point: aboard a Bosphorus ferry passing the tower on the south side."
      },
      images: LOC_IMG["maidens-tower"],
      meta:   LOC_META["maidens-tower"],
      quote: "The first Bosphorus on global film.",
      texts: {
        young: "Bond and a girl take a slow boat tour. The little tower in the water passes behind them. In 1963, most people in the cinema had never seen Istanbul before — so this calm boat ride was their very first look at the city's beautiful waters!",
        adult: "From Russia with Love (1963) was one of the first major Western films to shoot extensively on the Bosphorus. Bond and Tania take a ferry tour, and the Maiden's Tower passes in the background. The tower has stood on its small islet near Üsküdar in different forms since at least the 12th century; the current Baroque-style structure dates to 1763. For 1963 audiences, this scene was their first cinematic Bosphorus. The framing is calm, unhurried — typical of how 1960s cinema treated Istanbul. There is no rush. The tower simply is.",
        scholar: "The Maiden's Tower (Kız Kulesi) sits on a small island just off Üsküdar on the Asian shore of the Bosphorus. A defensive structure has stood here since the Byzantine era, with the current Baroque-style tower dating to 1763 and undergoing several restorations since. The tower is wrapped in legends, including the famous Byzantine story of a princess hidden here to escape a fatal prophecy. From Russia with Love (1963) uses the tower in one of the very first Bosphorus tour sequences in international cinema. Sean Connery and Daniela Bianchi are filmed on the deck of a ferry as the tower slips past in the background. Cinematographer Ted Moore shoots the scene in available light, with no rapid cuts. The tower is treated as a real place, not a postcard. This calm, atmospheric approach defined 1960s Western cinema's relationship with Istanbul. The water and the buildings were not yet 'action geography.' They were settings for slow looking. In the Through Time narrative, this is one of the clearest baselines we have: 1963 cinema's gaze on Istanbul, before the kinetic transformation of the 2010s."
      },
      textsShort: {
        young:   "Bond and Tania take a slow boat tour past the little tower in the water. For 1963 audiences, this was their very first look at Istanbul!",
        adult:   "From Russia with Love (1963) shows global audiences their first cinematic Bosphorus, with the Baroque-era Maiden's Tower drifting calmly behind a static ferry deck.",
        scholar: "Ted Moore's available-light deck shots of the 1763 islet tower establish the 1960s baseline for Western Istanbul cinema: long takes, no rapid cuts, the architecture trusted to be itself."
      },
      narrativeNote: "Compare this to Skyfall's 2012 rooftop view of the Bosphorus from above — same water, same city, but the camera has changed dramatically. 1963 looks at the Bosphorus from sea level, in real time. 2012 flies over it.",
      nextDirection: "Walk 2.3 km W to Sirkeci Railway Station."
    },
    {
      id: "sirkeci-1963",
      name: "Sirkeci Railway Station",
      coordinates: [41.0133, 28.9782],
      chapter: "1960s",
      film: "From Russia with Love",
      year: 1963,
      director: "Terence Young",
      scene: "Orient Express Departure",
      filmTag: "FROM RUSSIA WITH LOVE (1963)",
      camera: {
        facing: "W → platform; E → Moorish facade",
        elevation: "Platform + mezzanine balcony",
        focalLength: "32mm (atmosphere); 75mm (Bond + Tania)",
        shotType: "Dolly along platform + static framing",
        angleNote: "Best shot point: Platform 1, under the wrought-iron canopy, facing the Moorish entrance arch."
      },
      images: LOC_IMG["sirkeci"],
      meta:   LOC_META["sirkeci"],
      quote: "The Orient Express was the most cinematic train in the world.",
      texts: {
        young: "This pretty train station has fancy pointed arches and a big round window. From 1890 to 2009, the world's most famous train — the Orient Express — finished its long trip from Paris right here. In 1963, Bond stepped onto its platform too!",
        adult: "Sirkeci Station opened on 3 November 1890 as the Istanbul terminus of the Rumeli Railway, the final link of the Orient Express. The German architect August Jachmund designed it in a Moorish-revival style: pointed arches, polychrome masonry, a rose window. From Russia with Love (1963) uses the station for one of the great quiet Bond sequences. There is no fight, no chase. There is just Bond, Tania, the platform, and the Orient Express. The film treats the building with full atmospheric respect — typical of 1960s location cinema's approach to historical architecture.",
        scholar: "Sirkeci Railway Station opened on 3 November 1890 as the Istanbul terminus of the Rumeli Railway, completing the route of the Orient Express, which had been operating from Paris since 1883. The German architect August Jachmund designed the building in a self-conscious Moorish-revival style: pointed arches, polychrome masonry banding, a large rose window over the main entrance. The choice was deliberate. The station was meant to feel European in function but Ottoman in identity — a building that announced Istanbul as a modern but distinct destination at the end of the European rail network. The Orient Express ran from Paris to Istanbul from 1883 to 2009, a 126-year run that made Sirkeci one of the most symbolically charged train stations in the world. Agatha Christie wrote much of Murder on the Orient Express while staying at the nearby Pera Palace Hotel. In From Russia with Love (1963), Terence Young films the station with unusual reverence for a Bond picture. There are no action set pieces inside the station. The actual fights happen later, on the moving train. Sirkeci is treated as atmosphere — exactly the way 1960s Western cinema treated all of Istanbul. For the Through Time narrative, the 1963 Sirkeci sequence is one of the clearest examples of the era's contemplative gaze: the camera trusts the architecture to do its own work."
      },
      textsShort: {
        young:   "Bond stands quietly on the platform of the world's most famous train station. Soon the Orient Express will leave for Paris, far away.",
        adult:   "From Russia with Love (1963) treats Jachmund's 1890 Moorish-revival Sirkeci Station with full atmospheric respect — the calm pre-train sequence that 1960s cinema preferred to action.",
        scholar: "Young's reverent dolly through the rose-windowed terminal records the late-Ottoman revivalist gesture as cinematic patrimony: a European rail function wrapped in deliberately Ottoman vocabulary, framed before the post-1977 decline of through-services."
      },
      narrativeNote: "The last regular Orient Express service from Sirkeci ran in 1977; the final international through-service ended in 2009. The building still functions as a suburban rail terminus, and part of its interior now houses the Istanbul Railway Museum. Sirkeci has aged with quiet dignity.",
      nextDirection: "Walk 900 m W to Grand Bazaar."
    },

    // ── 2012 — Skyfall (3) + Taken 2 (4) ──
    {
      id: "grand-bazaar-2012",
      name: "Grand Bazaar",
      coordinates: [41.0107, 28.9681],
      chapter: "2012",
      film: "Skyfall",
      year: 2012,
      director: "Sam Mendes",
      scene: "The Bazaar Chase",
      filmTag: "SKYFALL (2012)",
      camera: {
        facing: "NE corridor (Bond's chase line)",
        elevation: "Street level; rooftop for finale",
        focalLength: "24mm wide; 35mm inserts",
        shotType: "Steadicam + motorcycle mount",
        angleNote: "Best shot point: same Nuruosmaniye Gate as the 1963 film, but the camera is now kinetic, not contemplative. Deakins reframes the bazaar as motion."
      },
      images: LOC_IMG["grand-bazaar"],
      meta:   LOC_META["grand-bazaar"],
      quote: "The same corridors, an entirely different century.",
      texts: {
        young: "It is the same big indoor market that Bond walked through in 1963 — almost nothing has changed inside! But 49 years later, in Skyfall, Bond is not walking anymore. He is on a fast motorbike, chasing bad guys. Same place, totally different speed!",
        adult: "Skyfall (2012) returns to the Grand Bazaar 49 years after From Russia with Love. The bazaar has barely changed: same Ottoman vaulting, same merchant families, same 61 covered streets. But the camera has changed completely. Sam Mendes and cinematographer Roger Deakins shoot the space with motorcycle-mount cameras, helicopter aerial shots, and full action-film energy. Where the 1960s camera lingered in available light, the 2012 camera chases. The bazaar is no longer exotic mystery; it is a kinetic action arena. The buildings did not move — the gaze did.",
        scholar: "Skyfall (2012), the 23rd Bond film directed by Sam Mendes and shot by Roger Deakins, returns to the Grand Bazaar almost exactly 49 years after Terence Young's From Russia with Love. The physical bazaar has changed remarkably little in that time: minor electrical updates, improved fire safety, more tourists. The Ottoman vaulting, the merchant guild structure and the basic spatial logic remain 15th-century. What has changed completely is how international cinema sees the space. The comparison is striking: Young's 1963 treatment is atmospheric, contemplative, shot in available light with very little camera movement. Mendes's 2012 treatment is kinetic, adrenaline-fueled, shot with motorcycle-mounted cameras, helicopter aerials, and the full toolkit of contemporary action filmmaking. In 1963, the bazaar is presented as a real foreign place that Western audiences had rarely seen. In 2012, it is presented as a familiar international location, no more culturally specific than a Barcelona avenue or a Marrakesh souk. This change is not just cinematic. It tracks real shifts in Istanbul's status (NATO ally in 1963, EU candidate in 2012), in tourist infrastructure (about 100,000 international visitors a year in 1963 vs about 11.6 million in 2012), and in how familiar Western audiences are with the city. The 1963/2012 pairing is one of the cleanest natural experiments available in international cinema: same location, same architecture, completely different filmmaking conventions and cultural assumptions."
      },
      textsShort: {
        young:   "It is the same Grand Bazaar from the 1963 Bond movie — same vaulted streets, same shops! But now Bond is on a fast motorbike instead of walking.",
        adult:   "Skyfall (2012) returns to Mehmed II's 15th-century bazaar 49 years after From Russia with Love and finds the architecture unchanged but the camera completely transformed by motorcycle mounts and helicopter aerials.",
        scholar: "Mendes and Deakins's kinetic 2012 treatment of the same Ottoman corridors is one of the cleanest natural experiments in international cinema: identical 31,000 m² covered space, opposite filmmaking conventions, with the cultural register shifted from atmospheric foreignness to action-arena familiarity."
      },
      narrativeNote: "The Through Time narrative pairs this 2012 sequence with the 1963 Sirkeci sequence as the two anchor points of the project. Same city, two completely different cinematic registers, only 49 years apart.",
      nextDirection: "Walk 50 m NE to Grand Bazaar Rooftop."
    },
    {
      id: "skyfall-rooftop-timeline",
      name: "Grand Bazaar Rooftop",
      coordinates: [41.0110, 28.9685],
      chapter: "2012",
      film: "Skyfall",
      year: 2012,
      director: "Sam Mendes",
      scene: "Rooftop Motorcycle Chase",
      filmTag: "SKYFALL (2012)",
      camera: {
        facing: "Aerial N + tracking E along the lead roofs",
        elevation: "Rooftop + helicopter aerial",
        focalLength: "14mm GoPro; 24mm motorcycle; 85mm Bond",
        shotType: "Motorcycle-mount + helicopter aerial + Steadicam",
        angleNote: "Best shot point: lead roofs above Kalpakçılar Caddesi, near the Nuruosmaniye Mosque dome."
      },
      images: LOC_IMG["skyfall-rooftop"],
      meta:   LOC_META["skyfall-rooftop"],
      quote: "2012 cinema added a new floor to Istanbul.",
      texts: {
        young: "Did you know the giant market has a roof you can walk on? Old movies never showed it. But in 2012, Skyfall put a motorbike up there! For the first time, people around the world saw Istanbul from on top of its own buildings.",
        adult: "The lead-covered rooftops of the Grand Bazaar were almost invisible to international cinema before 2012. Skyfall changed that. Roger Deakins shot the motorcycle finale with a mix of motorcycle-mounts, helicopter aerials, and steadicam. The result is a kind of Istanbul that 1960s viewers never saw on screen: high, geometric, with the Bosphorus glittering in the distance. The vertical dimension belongs to 2012. It marks a clear before-and-after in how the city was imagined.",
        scholar: "Before Skyfall (2012), almost no major international film had used the upper surfaces of the Grand Bazaar as filmable architecture. The 1963 production of From Russia with Love had no rooftop access; helicopter aerials of dense old Istanbul were technically possible but creatively uncommon for the era. The vertical city — the lead roofs, the dome ridges, the small footbridges between mosque complexes — was effectively absent from international cinema's image of Istanbul for most of the 20th century. Skyfall changed this in roughly two minutes of screen time. Roger Deakins and his second-unit team mounted small cameras on the chase motorcycle, used helicopter aerials for wider geography, and pulled steadicam shots through the rooftop terrain at moments when actor performance had to be visible. The visual logic is striking: the dull silver of the lead roofs, the blue-green dome of the Nuruosmaniye Mosque (1755), and far away the Bosphorus. The chase ends on a small stone bridge between the bazaar and the mosque complex, where Bond jumps the bike onto a moving train. For the Through Time narrative, this 2012 sequence is the moment when the camera finally takes Istanbul's vertical dimension seriously. The bazaar had always had a roof; it took 49 years for international cinema to look up."
      },
      textsShort: {
        young:   "Before 2012, no big movie ever showed the Grand Bazaar's ROOF! Skyfall added a whole new top floor to cinematic Istanbul.",
        adult:   "Skyfall (2012) integrates the lead-covered Ottoman rooftops into international cinema for the first time, making the bazaar's previously invisible vertical surface part of the city's global image.",
        scholar: "Deakins's helicopter aerials, motorcycle GoPros and roof-line Steadicam mark the moment when 2010s action grammar finally annexed Istanbul's vertical dimension — a register that 1960s and 1970s production technology had practically excluded."
      },
      narrativeNote: "1960s and 1970s Istanbul cinema almost never used aerial shots. By 2012, drone and helicopter aerials had become part of the basic visual grammar of action films. This rooftop sequence shows that shift more clearly than almost any other Istanbul scene.",
      nextDirection: "Walk 1.5 km NE to Deutsche Orientbank Hotel."
    },
    {
      id: "deutsche-orientbank",
      name: "Deutsche Orientbank Hotel",
      coordinates: [41.0220, 28.9785],
      chapter: "2012",
      film: "Skyfall",
      year: 2012,
      director: "Sam Mendes",
      scene: "Bond's Istanbul Base",
      filmTag: "SKYFALL (2012)",
      camera: {
        facing: "Interior hallway + balcony shots",
        elevation: "Hotel interior; small rooftop establishing",
        focalLength: "35mm (interior); 85mm (Bond)",
        shotType: "Steadicam interior + static establishing",
        angleNote: "Best shot point: the hotel's restored neo-classical lobby. Bond walks through it briefly during the early Istanbul scenes."
      },
      images: LOC_IMG["deutsche-orientbank"],
      meta:   LOC_META["deutsche-orientbank"],
      quote: "Even spies need a quiet hallway.",
      texts: {
        young: "This building used to be a German bank, more than 100 years old! Today it is a fancy hotel. In Skyfall, Bond stays here when he is in Istanbul. A lot of old buildings in the city have new jobs now — banks become hotels, and shops become cafes.",
        adult: "The Deutsche Orientbank Hotel sits on Bankalar Caddesi (Banks Street) in Karaköy, in a building that originally housed the Deutsche Orientbank, founded in 1906 as part of the Deutsche Bank's expansion into the Ottoman empire. Skyfall (2012) uses the hotel as Bond's discrete Istanbul residence. The film's brief scenes here show its restored neo-classical interiors. For the Through Time narrative, this is a perfect example of 2010s Istanbul: a 19th-century European-style commercial building, surviving through restoration as a luxury hotel. Same building, different function — and 2012 cinema gives us the new version.",
        scholar: "Bankalar Caddesi (Banks Street) in Karaköy was, from the 1880s through the 1930s, the financial center of the late Ottoman Empire and the early Turkish Republic. Most of Istanbul's foreign and domestic banks built their headquarters along this single short street: Ottoman Bank (1892), Bank of Athens, Banca Commerciale Italiana, and the Deutsche Orientbank, founded in 1906 as part of Deutsche Bank's expansion into the Ottoman commercial sphere. After the financial center moved to other neighborhoods in the second half of the 20th century, many of these buildings were left in various states of preservation. Several were converted into restaurants, cultural centers, and (especially in the 2010s) luxury hotels. The Deutsche Orientbank building's neo-classical facade and ornate interior banking hall made it especially attractive for hotel adaptation. Skyfall (2012) uses the hotel briefly as Bond's Istanbul residence. The scenes are short — Bond passing through the lobby, talking on a balcony — but they show a side of contemporary Istanbul that 1960s Bond films could not have shown: the restored, repurposed European-style commercial fabric of late-Ottoman Galata. For the Through Time narrative, this hotel is a marker of what changed in the 2010s. The buildings were always there. What was new in 2012 was the global hotel market that turned them into international luxury destinations — and the Bond production that quietly used them as set."
      },
      textsShort: {
        young:   "Bond stays in a hotel that used to be a 100-year-old German bank! Lots of old buildings in Istanbul have new jobs now.",
        adult:   "Skyfall (2012) shoots Bond's Istanbul base in the restored Deutsche Orientbank building (1906), a typical 2010s heritage-hotel adaptation along Bankalar Caddesi's onetime Ottoman Wall Street.",
        scholar: "The film captures, without commentary, the late-2000s transformation of late-Ottoman foreign-bank stock into globally branded boutique hospitality — preserving neoclassical banking interiors as upmarket lobby architecture."
      },
      narrativeNote: "Karaköy's Bankalar Caddesi was Ottoman Wall Street. By 2012, it had become a heritage hotel district. Skyfall films one of these conversions without commentary, but the architectural history is doing real work in the background.",
      nextDirection: "Walk 800 m SW to Legacy Ottoman Hotel."
    },
    {
      id: "legacy-ottoman-timeline",
      name: "Legacy Ottoman Hotel",
      coordinates: [41.0156, 28.9742],
      chapter: "2012",
      film: "Taken 2",
      year: 2012,
      director: "Olivier Megaton",
      scene: "Family Hotel in Sirkeci",
      filmTag: "TAKEN 2 (2012)",
      camera: {
        facing: "Interior corridor + courtyard balcony",
        elevation: "Ground floor + balcony levels",
        focalLength: "28mm interiors; 50mm dialogue",
        shotType: "Static interior + handheld pursuit",
        angleNote: "Best shot point: the inner courtyard balcony. The hotel's neo-Ottoman architecture provides layered framings."
      },
      images: LOC_IMG["legacy-ottoman"],
      meta:   LOC_META["legacy-ottoman"],
      quote: "A second 2012 hotel — but the camera is different.",
      texts: {
        young: "Two big movies came out in the same year — 2012 — and each one chose a different hotel! Skyfall picked a fancy old bank turned into a hotel. Taken 2 picked this one, an old Ottoman-style hotel in the city center. Same city, two different ways to see it.",
        adult: "The Legacy Ottoman Hotel is a restored 19th-century neo-Ottoman building in Sirkeci, very close to the railway station. Taken 2 (2012) uses it as Bryan Mills' family hotel during their holiday. The choice is interesting: in the same year that Skyfall picked a European-style bank conversion in Karaköy, Taken 2 picked an Ottoman-revival hotel in old-Istanbul Sirkeci. Both are valid 2012 versions of the city, but they look completely different. For the Through Time narrative, this side-by-side gives us two versions of 2012 Istanbul on screen at the same time.",
        scholar: "Sirkeci's hotel district grew up at the end of the 19th century to serve the Orient Express passengers arriving at the new Sirkeci Station (1890). Many of the hotels were built in self-consciously 'Ottoman revival' or eclectic styles, with elaborate facades that signaled both European modernity and Ottoman cultural identity. After the station's role declined in the late 20th century, several of these hotels were closed, abandoned, or converted to other uses. Starting in the 2000s, a wave of careful restorations brought several of them back as boutique hotels for the rapidly growing international tourist market. The Legacy Ottoman Hotel is one of these revived buildings. Taken 2 (2012) uses it as the holiday base for the Mills family. The film's choice is significant in the Through Time comparative project: in the very same year, Skyfall used a European-style bank-conversion hotel in Karaköy (the Deutsche Orientbank). Both films are recording 2012 Istanbul, but they choose deliberately different aesthetics. Skyfall's hotel has restored 1900s European banking interiors; Taken 2's hotel has restored 1880s Ottoman-revival interiors. Two visions of the same city at the same moment. This kind of double evidence is exactly what the Through Time narrative is designed to surface."
      },
      textsShort: {
        young:   "Two big movies came out the same year — 2012 — but each picked a different Istanbul hotel, in totally different styles!",
        adult:   "Taken 2 (2012) chooses a restored Ottoman-revival hotel in Sirkeci, providing the Through Time narrative with a perfect contemporary contrast against Skyfall's Karaköy bank conversion.",
        scholar: "The same calendar year hosts two sharply opposed 2010s Istanbul aesthetics on screen: Skyfall's restored European banking neoclassicism vs Taken 2's restored late-19th-century Ottoman-revivalism — both genuine contemporary versions of the city."
      },
      narrativeNote: "Two 2012 productions, two completely different Istanbul hotels. Skyfall picks European modernity; Taken 2 picks Ottoman heritage. The same year, the same city, two different stories about what 'contemporary Istanbul' looks like.",
      nextDirection: "Walk 330 m W to Spice Bazaar."
    },
    {
      id: "spice-bazaar-timeline",
      name: "Spice Bazaar",
      coordinates: [41.0165, 28.9704],
      chapter: "2012",
      film: "Taken 2",
      year: 2012,
      director: "Olivier Megaton",
      scene: "POV Surveillance",
      filmTag: "TAKEN 2 (2012)",
      camera: {
        facing: "W → interior arcade",
        elevation: "Street level",
        focalLength: "50mm (POV); 85mm (close-ups)",
        shotType: "Handheld POV tracking",
        angleNote: "Best shot point: the L-shaped intersection near the Hamidiye Gate."
      },
      images: LOC_IMG["spice-bazaar"],
      meta:   LOC_META["spice-bazaar"],
      quote: "The 1664 building, the 2012 camera.",
      texts: {
        young: "The Spice Bazaar is a market full of yummy smells — saffron, dried peppers, sweet teas. It opened in 1664, more than 350 years ago! In Taken 2, the camera shows the market just like the dad sees it: looking everywhere, all at once, for danger.",
        adult: "The Spice Bazaar has been in continuous use since 1664. In Taken 2 (2012), Olivier Megaton films it from inside Bryan Mills' point of view: handheld, paranoid, scanning every corner for threats. This is a very different approach from how 1960s cinema would have filmed the same space. The 2012 camera is restless. It does not trust the architecture to do the work; it makes the architecture into something the protagonist must process actively. For the Through Time narrative, this is a clear example of how 2010s action cinema imposes its own logic on much older spaces.",
        scholar: "The Spice Bazaar (Mısır Çarşısı) was built in 1664 as part of the New Mosque complex commissioned by Turhan Sultan, mother of Sultan Mehmed IV. The bazaar's L-shaped plan, with two perpendicular arcaded halls of 88 vaulted bays, has been in continuous operation as a working market for 360 years. In Taken 2 (2012), Olivier Megaton uses the space in a way that 1960s cinema never would. The shooting style is handheld point-of-view: the camera adopts Bryan Mills' first-person vigilance, scanning the arcade for threats and exits. The 17th-century building is treated as an obstacle course for the protagonist's surveillance instincts. This is a profoundly different approach from the 1963 Bond film a few hundred meters away in Sultanahmet. Where 1963 cinema used Istanbul as atmospheric backdrop and trusted the architecture to convey meaning, 2012 cinema uses Istanbul as a tactical environment to be scanned, mapped, and processed. The bazaar itself is unchanged — same vaults, same merchant families, same goods. The change is entirely in the camera's relationship to the space. For the Through Time narrative, this is one of the most useful single comparisons available."
      },
      textsShort: {
        young:   "Same 1664 spice market, but now the camera is jumpy and worried — looking for danger everywhere.",
        adult:   "Taken 2 (2012) films Turhan Sultan's 360-year-old Spice Bazaar from inside a fugitive's POV, turning the same Ottoman vaulting that 1963 used as atmosphere into 21st-century tactical terrain.",
        scholar: "Megaton's first-person handheld restages the 88-bay 1664 arcade as obstacle-course geometry, making the camera's restless anxiety — not the architecture — the thing the audience reads."
      },
      narrativeNote: "Compare Olivier Megaton's POV handheld in 2012 to Terence Young's static dolly in 1963. The same kind of Ottoman vaulted space, treated as either ambient atmosphere (1963) or tactical terrain (2012). The buildings are constants; the cameras tell us about the era.",
      nextDirection: "Walk 300 m E to Galata Bridge."
    },
    {
      id: "galata-bridge-timeline",
      name: "Galata Bridge",
      coordinates: [41.0173, 28.9738],
      chapter: "2012",
      film: "Taken 2",
      year: 2012,
      director: "Olivier Megaton",
      scene: "Two-Level Bridge Action",
      filmTag: "TAKEN 2 (2012)",
      camera: {
        facing: "N (Eminönü → Karaköy)",
        elevation: "Upper deck + lower-deck inserts",
        focalLength: "18mm wide; 200mm tele",
        shotType: "Tracking car-mount + tripod inserts",
        angleNote: "Best shot point: midspan upper deck. The two-level bridge gives unusual vertical compositions."
      },
      images: LOC_IMG["galata-bridge"],
      meta:   LOC_META["galata-bridge"],
      quote: "The 1994 bridge meets the 2012 camera.",
      texts: {
        young: "Surprise — this bridge is younger than your parents! It opened in 1994, after the old bridge burned down. It has two floors stacked on top of each other, with cars above and restaurants below. Taken 2 used both floors at the same time for a really cool chase.",
        adult: "The Galata Bridge has spanned the Golden Horn in different forms since the Byzantine period. The current bridge opened in 1994 after the previous one burned in 1992. It has two levels: traffic and trams above, restaurants and cafes below. In Taken 2 (2012), Romain Lacourbas's camera takes advantage of this two-level design for unusual vertical compositions. Hundreds of fishermen lean on the railings every day, indifferent to the action around them. For 2010s Istanbul cinema, the Galata Bridge has become as iconic as the bazaars — a visual shorthand for the city.",
        scholar: "The current Galata Bridge is the fifth bridge to span the Golden Horn at this point. It opened in December 1994, replacing the previous bridge that burned in a fire in May 1992. It is 490 meters long, with a central drawbridge section that opens at night for larger ships to pass. Its most distinctive feature is the deliberate two-level design: an upper deck carrying six lanes of traffic and a tram line, and a lower deck of restaurants and cafes opening directly onto the water. In Taken 2 (2012), Olivier Megaton's cinematographer Romain Lacourbas uses this two-level structure to create vertical cinematography rare in action films of any era. The bridge is also a key crossing point in the city's mental map. Going north, you cross from the historic peninsula (Byzantine and Ottoman Sultanahmet) to the European quarter (Genoese-founded Galata, modern Karaköy). Going south, you reverse the journey across roughly 700 years of layered history. For the Through Time narrative, the Galata Bridge is interesting because the bridge itself is so recent (1994) compared to most of the project's locations. It is the most modern major piece of architecture in the entire dataset. And yet by 2012, it had already become an icon — fishermen, two levels, ferries below — that international cinema treated as eternal."
      },
      textsShort: {
        young:   "Surprise — this bridge is younger than your parents! It opened in 1994, after the old bridge burned down.",
        adult:   "Taken 2 (2012) uses the 1994 Galata Bridge as if it were eternal, even though it postdates From Russia with Love by 31 years — proof that cinematic Istanbul ages in odd ways.",
        scholar: "By 2012 international cinema treats the 18-year-old fifth Galata Bridge as iconic Ottoman shorthand, demonstrating how rapidly built heritage acquires the visual authority of much older architecture once major productions adopt it."
      },
      narrativeNote: "The bridge in Taken 2 looks like it has always been there, but it is younger than most of the audience. The 1994 structure has only existed for less than a third of the time since From Russia with Love. Cinematic Istanbul is in some places much newer than it appears.",
      nextDirection: "Walk 60 m SE to Eminönü Square."
    },
    {
      id: "eminonu-timeline",
      name: "Eminönü Square",
      coordinates: [41.0168, 28.9742],
      chapter: "2012",
      film: "Taken 2",
      year: 2012,
      director: "Olivier Megaton",
      scene: "Waterfront Pursuit",
      filmTag: "TAKEN 2 (2012)",
      camera: {
        facing: "N → Galata, NE → ferry piers",
        elevation: "Street + rooftop",
        focalLength: "28mm wide; 135mm compression",
        shotType: "Crane + handheld chase",
        angleNote: "Best shot point: in front of the New Mosque steps, facing the ferry piers."
      },
      images: LOC_IMG["eminonu"],
      meta:   LOC_META["eminonu"],
      quote: "Same square, every century, every camera.",
      texts: {
        young: "This big square next to the water has been busy for over 1,500 years! Boats have been coming and going forever. By 2012, so many movies had been filmed here that everybody knew the spot the moment they saw it on screen.",
        adult: "Eminönü Square sits where the Golden Horn meets the Bosphorus. It has been Istanbul's main port and customs area since Byzantine times. The current ferry terminals were built in stages between 1913 and 1958. In Taken 2 (2012), Olivier Megaton uses the square's natural geometry — the New Mosque on one side, the bridge ahead, the ferry piers to the right — as a clear stage for action. By 2012, Eminönü's visual identity was so familiar to international audiences that the film does not need to introduce it. We already know what it is.",
        scholar: "Eminönü has been the commercial and customs hinge of Istanbul since the Byzantine period, when the nearby Neorion harbor served as the empire's main customs station. The current square layout was rebuilt in the early 20th century, and the ferry terminals were constructed in stages between 1913 and 1958. In Taken 2 (2012), Olivier Megaton's camera uses what we might call the 'honest geography' of the space. Unlike the Spice Bazaar a few hundred meters away, which works through disorientation, the waterfront chase works through clarity. The camera anchors on three points: the New Mosque (1664) to the west, the Galata Bridge to the north, and the ferry piers to the east. By 2012, this triangular geography had become so familiar to international film audiences that no establishing shot was needed. The square reads instantly as 'Istanbul' to a 2010s viewer, in a way it would not have done in 1963. The change is partly Istanbul's increased visibility (about 11.6 million international visitors in 2012) and partly the cumulative effect of cinematic exposure: every Istanbul film of the previous twenty years had passed through this square in one form or another. By 2012, Eminönü was both a real place and a cinematic shorthand."
      },
      textsShort: {
        young:   "By 2012, this busy waterfront square was so famous from movies that you knew where you were the second you saw it!",
        adult:   "Taken 2 (2012) skips any establishing shot of Eminönü Square because by then the New Mosque–Galata Bridge–ferry pier triangle was already cinematic shorthand for Istanbul.",
        scholar: "Two decades of cumulative international film exposure had converted the Byzantine-era customs hinge into a self-evident 'Istanbul' cue, requiring no introduction — a literacy effect 1963 audiences could not yet have."
      },
      narrativeNote: "The square in 2012 has become so cinematically familiar that the film does not need to introduce it. Compare to 1963, when international audiences barely knew what Istanbul looked like at all. Visual literacy of a city is built up film by film.",
      nextDirection: "Walk 1.3 km S to Sultan Ahmet Mosque."
    },

    // ── 2014 — The Water Diviner (3) ──
    {
      id: "sultan-ahmet-timeline",
      name: "Sultan Ahmet Mosque",
      coordinates: [41.0054, 28.9768],
      chapter: "2014",
      film: "The Water Diviner",
      year: 2014,
      director: "Russell Crowe",
      scene: "A Foreigner in a Sacred Space",
      filmTag: "THE WATER DIVINER (2014)",
      camera: {
        facing: "S → mosque facade; interior dome up",
        elevation: "Courtyard + interior",
        focalLength: "24mm (architecture); 50mm (Connor)",
        shotType: "Slow dolly + static",
        angleNote: "Best shot point: outer courtyard, facing south. Connor framed small against the building."
      },
      images: LOC_IMG["sultan-ahmet-mosque"],
      meta:   LOC_META["sultan-ahmet-mosque"],
      quote: "2014 cinema knows how to be quiet inside a mosque.",
      texts: {
        young: "The Blue Mosque has six tall pointy towers and 20,000 blue tiles inside! For a long time, big Hollywood movies just used places like this as a pretty background. But in 2014, The Water Diviner was different — it filmed the mosque with real respect, like a place where people actually pray.",
        adult: "The Sultan Ahmet Mosque (the 'Blue Mosque') was completed in 1617 by Sultan Ahmed I. It has six minarets, more than 20,000 İznik tiles, and a complex of cascading half-domes. In The Water Diviner (2014), Russell Crowe directs himself as Joshua Connor, an Australian water-diviner who travels to Istanbul in 1919 to find what happened to his three sons at Gallipoli. Crowe shoots inside the mosque with quiet reverence — long silences, slow camera moves, no expository dialogue. This was a new approach for Hollywood. Earlier films had used Istanbul mosques as exotic backdrops; The Water Diviner uses this one as a serious religious space.",
        scholar: "The Sultan Ahmet Mosque, completed in 1617 for Sultan Ahmed I and designed by Sedefkâr Mehmed Ağa (a student of the great Ottoman architect Sinan), is one of the most architecturally ambitious mosques in the world. It has six minarets — an unusual number that briefly created a religious controversy with Mecca, only resolved when the Ottoman state funded a seventh minaret for the Ka'ba complex. The interior contains more than 20,000 hand-painted İznik ceramic tiles, predominantly blue (giving the mosque its English nickname). The Water Diviner (2014) is one of the first major international productions to use this building as a serious religious setting rather than as exotic background. Russell Crowe, directing his own film, places his character — an Australian Christian farmer searching for his sons four years after the Battle of Gallipoli (1915) — inside the mosque without any exoticist framing. There are long silences. The camera lingers on the architecture and on Connor's face. The film never makes Connor into a tourist; he is a grieving father in a working sacred space, and the building treats him with the same respect it treats every other visitor. For the Through Time narrative, this is a real shift. 1960s cinema (and most cinema before 2010) used Istanbul mosques as scenic dressing. The Water Diviner places one at the moral center of its film. The change is not only cinematic; it tracks broader shifts in how the international film industry handles non-Western religious heritage."
      },
      textsShort: {
        young:   "The Australian dad in The Water Diviner sits quietly inside the Blue Mosque. The movie shows the mosque with real respect.",
        adult:   "The Water Diviner (2014) treats the 1617 Sultan Ahmet Mosque as a working sacred space rather than exotic backdrop, marking a clear shift in how Hollywood handles non-Western religious architecture.",
        scholar: "Crowe's reverent interior dolly inside the six-minareted İznik-tiled imperial mosque exemplifies a post-2010 international-cinema convention: Ottoman religious heritage filmed for itself, not as scenic decoration."
      },
      narrativeNote: "Compare this 2014 reverent treatment of a mosque interior to From Russia with Love (1963), which used the small Firuz Aga Mosque as background atmosphere. The same kind of religious building, but the camera's relationship to it has been transformed.",
      nextDirection: "Walk 860 m NE to Gülhane Park."
    },
    {
      id: "gulhane-park",
      name: "Gülhane Park",
      coordinates: [41.0125, 28.9810],
      chapter: "2014",
      film: "The Water Diviner",
      year: 2014,
      director: "Russell Crowe",
      scene: "Connor's Walk",
      filmTag: "THE WATER DIVINER (2014)",
      camera: {
        facing: "Variable — through paths and toward Topkapı walls",
        elevation: "Ground level",
        focalLength: "35mm + 85mm",
        shotType: "Walking dolly + handheld observation",
        angleNote: "Best shot point: the lower paths near the Topkapı outer wall. The park's scale and tree cover are easy to film."
      },
      images: LOC_IMG["gulhane-park"],
      meta:   LOC_META["gulhane-park"],
      quote: "The imperial garden, now a public park.",
      texts: {
        young: "A long time ago, only the Sultan and his family could come here — it was the secret garden behind their palace! Then in 1912, the gates were opened and now anyone can visit. In The Water Diviner, the Australian dad walks here to take a quiet break.",
        adult: "Gülhane Park is one of Istanbul's oldest public parks. It was originally the outer garden of the Topkapı Palace, accessible only to the Sultan and his court. After the Ottoman state moved its main residence to Dolmabahçe in 1856, the gardens slowly fell into administrative gray zones. In 1912, the Ottoman government formally opened the park to the public. In The Water Diviner (2014), Joshua Connor walks here as part of his search. The park gives the film a chance to show ordinary Istanbul: trees, families, sellers, light. For the Through Time narrative, this is 2014's contribution to the project — a foreigner learning Istanbul on foot.",
        scholar: "Gülhane Park (Gülhane Parkı, 'Park of the Rose House') is the largest historic public park in central Istanbul and one of its oldest. It originally formed the outer gardens of the Topkapı Palace, accessible only to the Sultan, his household, and authorized court personnel. After the Ottoman dynasty moved its primary residence to Dolmabahçe Palace in 1856, the gardens entered a long period of administrative ambiguity. In 1912, under reforming pressure during the late Ottoman period, the park was formally opened to the public — a small but symbolically significant act of converting imperial space into civic space. The conversion completed under the early Turkish Republic. The park was extensively landscaped in the 20th century, and now contains the Istanbul Museum of the History of Science and Technology in Islam (founded 2008), as well as several memorial monuments. In The Water Diviner (2014), Russell Crowe films Joshua Connor walking through Gülhane Park as part of his early Istanbul reconnaissance. The scenes are quiet and observational. Connor watches families, children, and street sellers. He is learning the city — not as a tourist, but as a man trying to understand the place his sons may have died fighting. For the Through Time narrative, Gülhane in 2014 is a clear example of post-2010 cinematic Istanbul: the city as ordinary public space, walkable, livable, no longer primarily 'exotic.' The Water Diviner's gentle treatment of the park sits in clear contrast to the kinetic 2012 sequences and to the 1963 atmospheric reverence."
      },
      textsShort: {
        young:   "Long ago only the Sultan could come to this big garden. Today everyone walks here, and Connor visits to clear his head.",
        adult:   "The Water Diviner (2014) walks Connor through the once-imperial Gülhane Park, opened to the public in 1912 — 2014 cinema's image of Istanbul as ordinary, walkable civic space.",
        scholar: "Crowe's observational dolly through the former Topkapı outer gardens registers the post-2010 cinematic shift toward Istanbul-as-livable-city, contrasting with both 1960s atmospheric reverence and 2010s kinetic action geometry."
      },
      narrativeNote: "Gülhane is a useful test of cinematic mood. 1960s cinema would have likely framed the park's old trees against Topkapı walls in slow, atmospheric pans. 2012 action cinema would have run through it. 2014's The Water Diviner walks. Three different cameras, three different relationships to the same trees.",
      nextDirection: "Walk 3.7 km SE to Haydarpaşa Train Station."
    },
    {
      id: "haydarpasa-timeline",
      name: "Haydarpaşa Train Station",
      coordinates: [40.9967, 29.0192],
      chapter: "2014",
      film: "The Water Diviner",
      year: 2014,
      director: "Russell Crowe",
      scene: "The Anatolia Train",
      filmTag: "THE WATER DIVINER (2014)",
      camera: {
        facing: "S → main facade from quay; W → platform interior",
        elevation: "Quay + platform",
        focalLength: "35mm (facade); 85mm (Connor)",
        shotType: "Dolly + tripod with departing-train motion",
        angleNote: "Best shot point: the front quay, facing south toward the main facade."
      },
      images: LOC_IMG["haydarpasa"],
      meta:   LOC_META["haydarpasa"],
      quote: "Two stations, two centuries, one Istanbul.",
      texts: {
        young: "Istanbul has two halves! One half is in Europe, one half is in Asia. Almost every movie in our list only films the European side. But The Water Diviner is the only one that crosses the water and films a station in Asia — this beautiful old one, right by the sea.",
        adult: "Haydarpaşa Train Station opened in 1908 on the Asian shore, designed by the German architects Otto Ritter and Helmut Cuno. It was the western terminus of the Ottoman Anatolian Railway, eventually part of the Berlin-Baghdad Railway project. In The Water Diviner (2014), Joshua Connor boards a train here to travel east. This is the only film in this project that uses the Asian shore. For the Through Time narrative, that fact alone is significant: most international cinema since 1963 has stayed on the European peninsula. The Water Diviner crosses the water.",
        scholar: "Haydarpaşa Train Station opened in 1908 as the western terminus of the Chemin de fer Ottoman d'Anatolie (the Ottoman Anatolian Railway), designed by the German architects Otto Ritter and Helmut Cuno. The line ran east through Eskişehir and Konya, eventually planned to continue all the way to Baghdad as part of the famous late-Ottoman German Berlin-Baghdad Railway project. The station building sits on more than a thousand wooden piles driven into the soft Bosphorus seabed. Its main facade — neo-Renaissance with two clock towers — faces directly out onto the water. In The Water Diviner (2014), Russell Crowe gives the station a long, romantic visual treatment. Joshua Connor's departure for Anatolia in 1919 follows, in reverse, the route Ottoman soldiers took on their way to the front lines a few years earlier. This historical layer is part of the film's emotional weight. For the Through Time narrative, Haydarpaşa is the only Asian-shore location in the entire project. From Russia with Love, Skyfall, Taken 2, and Inferno all stay on the European peninsula. The Water Diviner crosses the water — a small but symbolically large move that reflects the film's broader ambition to show an Istanbul beyond the postcard view. A serious roof fire in 2010 damaged the building four years before the film was shot; the production captures Haydarpaşa in a state of partial restoration. Today, the station is no longer in active commercial use, but its symbolic and architectural weight has only grown."
      },
      textsShort: {
        young:   "Istanbul has a European side and an Asian side — and only this movie crosses to the Asian side to film a beautiful train station!",
        adult:   "The Water Diviner (2014) is the only film in this project to cross the Bosphorus, filming the 1908 Haydarpaşa Station on the Asian shore that other international productions reliably ignore.",
        scholar: "Crowe's romantic treatment of Ritter and Cuno's pile-driven neo-Renaissance terminal asserts an Istanbul beyond the European peninsula, refusing the standard 'historic-Istanbul-equals-Sultanahmet' equation that constrains most international productions."
      },
      narrativeNote: "This is the only Asian-shore location in the entire project. Every other film stays on the European peninsula. The Water Diviner crosses the Bosphorus visually as well as narratively, which is an important part of its overall argument about Istanbul.",
      nextDirection: "Walk 5.0 km W to Istanbul University."
    },

    // ── 2016 — Inferno (3) ──
    {
      id: "istanbul-university",
      name: "Istanbul University",
      coordinates: [41.0119, 28.9633],
      chapter: "2016",
      film: "Inferno",
      year: 2016,
      director: "Ron Howard",
      scene: "Langdon's Research",
      filmTag: "INFERNO (2016)",
      camera: {
        facing: "S → main gate facade; interior corridors",
        elevation: "Ground level + library interior",
        focalLength: "35mm (facade); 50mm (interior)",
        shotType: "Static establishing + steadicam interior",
        angleNote: "Best shot point: Beyazıt Square, facing the historic main gate (1866). The gate is one of the most photographed pieces of late-Ottoman public architecture."
      },
      images: LOC_IMG["istanbul-uni"],
      meta:   LOC_META["istanbul-uni"],
      quote: "2016 cinema reads Istanbul like a library.",
      texts: {
        young: "Istanbul has a really old university — its history goes back to 1453! In Inferno, the smart professor goes here to look up a clue in old books. The big stone front gate is the same one students have walked through since 1866.",
        adult: "Istanbul University (Istanbul Üniversitesi) traces its roots back to 1453, making it one of the oldest higher-education institutions in the country. The current main campus around Beyazıt Square was developed in the late 19th century, and the famous main gate dates from 1866. In Inferno (2016), Robert Langdon (Tom Hanks) visits the university to research a clue from Dante's Inferno. The scene is brief but signals an important shift: by 2016, international cinema treats Istanbul as a place full of decodable information, not just a backdrop for action. The city becomes a library.",
        scholar: "Istanbul University (Istanbul Üniversitesi) is one of the oldest universities in Turkey. Its institutional history is contested — some accounts trace it to the Ottoman conquest of 1453, others to the late-19th-century reforms — but in any case, it has been a serious institution of higher learning for well over a hundred years. The current main campus around Beyazıt Square in the historic peninsula contains buildings from several Ottoman and Republican periods. The most famous single structure is the imposing main gate (1866), one of the most photographed pieces of late-Ottoman public architecture in the world. In Inferno (2016), Ron Howard sends Robert Langdon to the university to research a clue connected to Dante's Inferno and its medieval reception in Byzantine and Ottoman scholarly circles. The scene is brief, but it signals a clear cinematic shift. Earlier Istanbul films treated the city primarily as a place to look at: bazaars, mosques, bridges, water. By 2016, Inferno treats the city as a place to read: a layered information system whose buildings, monuments, and inscriptions can be decoded by an attentive scholar. This is part of a broader 2010s trend — sometimes called 'intellectual thriller' cinema — that places intelligent protagonists in real cultural-heritage sites and dramatizes the act of interpretation. For the Through Time narrative, the Istanbul University sequence is a small but useful piece of evidence about how 2016 cinema imagined the city."
      },
      textsShort: {
        young:   "Professor Langdon goes to Istanbul University to look up clues. The big stone gate has welcomed students since 1866!",
        adult:   "Inferno (2016) sends Robert Langdon to Istanbul University's 1866 main gate, framing the city as a decodable library — the 2010s 'intellectual thriller' mode at work.",
        scholar: "Howard's brief university beat exemplifies the 2010s convention of placing scholar-protagonists inside genuine cultural-heritage sites, dramatizing interpretation rather than action and reading Istanbul as a layered textual archive."
      },
      narrativeNote: "1963 cinema saw Istanbul as atmospheric. 2012 cinema saw it as kinetic action geography. 2014 cinema saw it as a place of memory. 2016 cinema sees it as a text. Each era reads the same city differently, and Inferno's university scene is a textbook case of the latest mode.",
      nextDirection: "Walk 1.5 km E to Hagia Sophia."
    },
    {
      id: "hagia-sophia-2016",
      name: "Hagia Sophia",
      coordinates: [41.0086, 28.9802],
      chapter: "2016",
      film: "Inferno",
      year: 2016,
      director: "Ron Howard",
      scene: "Decoded Heritage",
      filmTag: "INFERNO (2016)",
      camera: {
        facing: "E → apse with calligraphic roundels; up → main dome",
        elevation: "Ground floor + upper gallery",
        focalLength: "16mm wide; 35mm (tourist crowds); 85mm (Langdon)",
        shotType: "Steadicam + static contemplative",
        angleNote: "Best shot point: beneath the main dome, facing east. Same anchor as From Russia with Love (1963)."
      },
      images: LOC_IMG["hagia-sophia"],
      meta:   LOC_META["hagia-sophia"],
      quote: "53 years later, the same camera angle, a different culture of looking.",
      texts: {
        young: "Here is something fun: Inferno (2016) and the old Bond movie (1963) film Hagia Sophia from the exact same spot! The building has not moved one bit. But in the new movie, you see lots of tourists holding up phones and taking pictures. The building stayed the same — but the people changed.",
        adult: "Inferno (2016) returns to Hagia Sophia 53 years after From Russia with Love. The physical space is unchanged: same 6th-century dome, same 13th-century mosaics, same 16th-century calligraphy. What has changed is everything around them. By 2016, Hagia Sophia received over 3.4 million visitors a year, more than ten times the 1963 number. Ron Howard films the building deliberately: smartphones in the foreground, tour groups in the middle ground, the dome of Justinian above. The same spot, two completely different cultures of looking.",
        scholar: "Hagia Sophia, dedicated in 537 AD, has stood for nearly 1,500 years through multiple religious and political identities: Byzantine cathedral (537–1453), brief Roman Catholic cathedral (1204–1261), imperial Ottoman mosque (1453–1934), state museum (1934–2020), and active mosque again since July 2020. The physical building has been remarkably stable through all of this; the dome, the structural geometry, and most of the major decorative programs survive in their original form. In Inferno (2016), Ron Howard films the building from the same anchor point that Terence Young used in From Russia with Love (1963): beneath the main dome, facing east. The camera angle is almost identical. But the world around it is different. By 2016, Hagia Sophia received over 3.4 million visitors annually (compared to about 300,000 in 1963). Howard's cinematographer Salvatore Totino fills the frame with smartphones, audio-guide cables, tour groups, and information signs. The building is treated as a 'readable text' rather than as 'mysterious atmosphere.' Robert Langdon does not pray here; he decodes. This is exactly the cinematic shift the Through Time narrative is designed to track. Same building, same camera angle, completely different culture of attention. For an additional layer of historical complication: the 2016 footage of Hagia Sophia as a state museum became unintentionally archival after 2020, when the building was reconverted to active mosque status. Inferno is the last major international film to show Hagia Sophia in its 1934–2020 form."
      },
      textsShort: {
        young:   "Same building, same camera angle, 53 years apart — but in 2016 the room is full of tourists and phones!",
        adult:   "Inferno (2016) films Hagia Sophia from the same anchor point that From Russia with Love used in 1963, but the foreground is now smartphones, audio guides, and 3.4 million annual visitors.",
        scholar: "Howard's restaging of Young's 537 AD dome shot 53 years later turns the building into the Through Time project's cleanest natural experiment: same architecture, same composition, transformed culture of visual attention — and unintentional archive of the 1934–2020 museum phase."
      },
      narrativeNote: "This is the most direct 1963/2016 comparison in the entire project. The same building, the same camera anchor, 53 years apart. Everything is in the people, the gadgets, and the way the camera assumes the audience now reads space.",
      nextDirection: "Walk 160 m W to Basilica Cistern."
    },
    {
      id: "basilica-cistern-timeline",
      name: "Basilica Cistern",
      coordinates: [41.0083, 28.9783],
      chapter: "2016",
      film: "Inferno",
      year: 2016,
      director: "Ron Howard",
      scene: "Underground Istanbul on Global Screens",
      filmTag: "INFERNO (2016)",
      camera: {
        facing: "SW (column forest); close-up N on Medusa heads",
        elevation: "Below grade (-9m)",
        focalLength: "14mm ultra-wide; 100mm macro",
        shotType: "Steadicam through water + static atmospheric",
        angleNote: "Best shot point: central boardwalk, two-thirds into the chamber. The Medusa columns are at the far northwest corner."
      },
      images: LOC_IMG["basilica-cistern"],
      meta:   LOC_META["basilica-cistern"],
      quote: "After 2016, the world looked at Istanbul from below.",
      texts: {
        young: "The old Bond movie peeked into this huge underground water room in 1963 — but only for a second. Then in 2016, Inferno made the whole big finale happen down here! After that movie came out, lots more people wanted to come and visit.",
        adult: "The Basilica Cistern was built in 532 AD by Emperor Justinian as a water reservoir for Constantinople. It is 138 meters by 65 meters, with 336 marble columns. It is also one of the few major Istanbul locations to appear in both 1960s and 2010s cinema. From Russia with Love (1963) used it briefly. Inferno (2016) turned it into the climactic stage of an entire film. After the film's release, visitor numbers spiked — a textbook example of cinema directly driving heritage tourism. For the Through Time narrative, the cistern is a quiet hero: it has waited 1,500 years for international cinema to take it seriously.",
        scholar: "The Basilica Cistern (Yerebatan Sarnıcı, 'Sunken Palace') was built under Byzantine Emperor Justinian I in 532 AD. It is the largest of around 500 ancient cisterns lying beneath the city of Istanbul. Its dimensions are cathedral-scale: 138 meters by 65 meters, 80,000 cubic meters of water capacity, 336 marble columns in twelve rows of 28. The columns were taken (recycled) from earlier Roman and Hellenistic temples; their stylistic mix of Ionic, Corinthian, and Doric capitals is part of the visual character. The two famous Medusa columns in the northwest corner rest on blocks carved with the head of the Gorgon: one upside-down, one on its side. The cistern was effectively forgotten in the Ottoman period until 1545, when the French scholar Petrus Gyllius rediscovered it after hearing that local residents were drawing water through holes in their floors. In From Russia with Love (1963), Terence Young used the cistern briefly for an atmospheric scene — establishing its existence in international cinema, but not its dramatic potential. In Inferno (2016), Ron Howard built an entire film climax inside the space. Robert Langdon races through the columns as floodwaters rise around a global bioweapon. The lighting (amber uplighting installed by the Istanbul Metropolitan Municipality in 1987) is used almost unchanged. After Inferno's release, the cistern's annual visitor numbers rose sharply. For the Through Time narrative, this is one of the cleanest examples of cinema directly producing heritage attention. The 1963 brief glimpse and the 2016 full sequence book-end the project's chronological arc, and demonstrate the underlying argument: Istanbul's old places are still being discovered by international film, even after 1,500 years."
      },
      textsShort: {
        young:   "Bond peeked at this huge underground water cave for a few seconds in 1963. Then in 2016, Inferno made it the BIG ending — and visitors poured in!",
        adult:   "Inferno (2016) turns Justinian's 532 AD Basilica Cistern into a global film climax — and visitor numbers spike afterward, a textbook example of cinema directly producing heritage tourism.",
        scholar: "Where Young's 1963 cistern was a brief atmospheric flash, Howard's 2016 climax weaponizes the building's original Byzantine water-storage function under 1987 amber uplighting — demonstrating in real time the LMML effect this project is designed to track."
      },
      narrativeNote: "The cistern is a quiet hero of the entire Through Time project. It appears in both 1963 and 2016, and its visibility tracks the larger transformation: from atmospheric backdrop to global climax space. The building itself has not changed — but the world's relationship to it has."
    }
  ],

  // ─── MAP LOCATIONS (16 unique physical locations) ─────────────────────────────
  // A FLAT list of every unique physical place — no duplicates. Used by map.js
  // to draw 16 markers on the Leaflet map. Each item is very small: just id,
  // name, coordinates, the films it appears in, and which narratives include it.
  // The "narratives" array drives the marker color:
  //   ["pursuit"]            →  blue marker.
  //   ["timeline"]           →  gold marker.
  //   ["pursuit", "timeline"] →  mid-tone (both).
  mapLocations: [
    { id: "grand-bazaar",        name: "Grand Bazaar",                  coordinates: [41.0107, 28.9681], films: ["Skyfall"],                                          narratives: ["pursuit", "timeline"] },
    { id: "skyfall-rooftop-loc", name: "Grand Bazaar Rooftop",          coordinates: [41.0110, 28.9685], films: ["Skyfall"],                                          narratives: ["pursuit", "timeline"] },
    { id: "spice-bazaar",        name: "Spice Bazaar",                  coordinates: [41.0165, 28.9704], films: ["Taken 2"],                                          narratives: ["pursuit", "timeline"] },
    { id: "eminonu",             name: "Eminönü Square",                coordinates: [41.0168, 28.9742], films: ["Taken 2"],                                          narratives: ["pursuit", "timeline"] },
    { id: "galata-bridge",       name: "Galata Bridge",                 coordinates: [41.0173, 28.9738], films: ["Taken 2"],                                          narratives: ["pursuit", "timeline"] },
    { id: "legacy-ottoman",      name: "Legacy Ottoman Hotel",          coordinates: [41.0156, 28.9742], films: ["Taken 2"],                                          narratives: ["pursuit", "timeline"] },
    { id: "deutsche-orientbank", name: "Deutsche Orientbank Hotel",     coordinates: [41.0220, 28.9785], films: ["Skyfall"],                                          narratives: ["timeline"] },
    { id: "sirkeci",             name: "Sirkeci Railway Station",       coordinates: [41.0133, 28.9782], films: ["From Russia with Love"],                            narratives: ["pursuit", "timeline"] },
    { id: "maidens-tower",       name: "Maiden's Tower",                coordinates: [41.0211, 29.0042], films: ["From Russia with Love"],                            narratives: ["pursuit", "timeline"] },
    { id: "firuz-aga",           name: "Firuz Aga Mosque",              coordinates: [41.0072, 28.9783], films: ["From Russia with Love"],                            narratives: ["timeline"] },
    { id: "hagia-sophia",        name: "Hagia Sophia",                  coordinates: [41.0086, 28.9802], films: ["Inferno"],                                          narratives: ["pursuit", "timeline"] },
    { id: "basilica-cistern",    name: "Basilica Cistern",              coordinates: [41.0083, 28.9783], films: ["Inferno"],                                          narratives: ["pursuit", "timeline"] },
    { id: "istanbul-uni",        name: "Istanbul University",           coordinates: [41.0119, 28.9633], films: ["Inferno"],                                          narratives: ["timeline"] },
    { id: "sultan-ahmet",        name: "Sultan Ahmet Mosque",           coordinates: [41.0054, 28.9768], films: ["The Water Diviner"],                                narratives: ["pursuit", "timeline"] },
    { id: "gulhane-park",        name: "Gülhane Park",                  coordinates: [41.0125, 28.9810], films: ["The Water Diviner"],                                narratives: ["timeline"] },
    { id: "haydarpasa",          name: "Haydarpaşa Train Station",      coordinates: [40.9967, 29.0192], films: ["The Water Diviner"],                                narratives: ["pursuit", "timeline"] }
  ],

  // ─── FILMS ────────────────────────────────────────────────────────────────────
  // The 5 films featured in the project. Used by:
  //   index.html  →  small "featured films" grid (only title, year, director).
  //   about.html  →  detailed film cards with synopsis and Istanbul role.
  // The sources sub-object holds the external links (IMDb, Wikipedia,
  // distributor) — these are used by the disclaimer page.
  films: [
    {
      id: "from-russia-with-love",
      title: "From Russia with Love",
      year: 1963,
      director: "Terence Young",
      genre: "Spy / Action",
      synopsis: "The second James Bond film, set largely in Istanbul during the Cold War. A stolen Soviet cipher machine pulls Bond into a deadly game between British intelligence and the criminal organization SPECTRE.",
      istanbulRole: "Istanbul appears as a quiet city of dual loyalties — NATO ally, eastern threshold. The film treats the city's geography and atmosphere with documentary care, rare in early-1960s Hollywood productions.",
      legacy: "Established Istanbul as a premier spy-film location and created many of the visual rules that later international productions would follow.",
      sources: {
        imdb: "https://www.imdb.com/title/tt0057076/",
        wikipedia: "https://en.wikipedia.org/wiki/From_Russia_with_Love_(film)",
        distributor: "United Artists / Eon Productions"
      }
    },
    {
      id: "taken-2",
      title: "Taken 2",
      year: 2012,
      director: "Olivier Megaton",
      genre: "Action Thriller",
      synopsis: "Bryan Mills and his family are targeted for revenge by the father of a kidnapper Mills killed in Paris. The pursuit unfolds across Istanbul's bazaars, bridges and rooftops.",
      istanbulRole: "Istanbul is used primarily as action geography. The city's hills, waterways, and dense urban fabric are treated as kinetic terrain rather than as cultural atmosphere.",
      legacy: "Brought Istanbul to a new generation of viewers and contributed to a measurable rise in international tourism. Showed that the city could serve contemporary action cinema as effectively as more contemplative uses.",
      sources: {
        imdb: "https://www.imdb.com/title/tt1397280/",
        wikipedia: "https://en.wikipedia.org/wiki/Taken_2",
        distributor: "20th Century Fox"
      }
    },
    {
      id: "skyfall",
      title: "Skyfall",
      year: 2012,
      director: "Sam Mendes",
      genre: "Spy / Action",
      synopsis: "The 23rd James Bond film opens with a long chase through Istanbul before moving to London and Scotland. Bond investigates a cyberterrorist who has obtained a list of NATO undercover agents.",
      istanbulRole: "The Grand Bazaar and the rooftop motorcycle finale establish the film's kinetic visual language. Istanbul appears briefly but powerfully — a compressed, high-intensity opening sequence.",
      legacy: "Skyfall's Istanbul opening is widely regarded as one of the finest action set-pieces in Bond history. The motorcycle chase across the Grand Bazaar's rooftops became an iconic image of contemporary Istanbul in global cinema.",
      sources: {
        imdb: "https://www.imdb.com/title/tt1074638/",
        wikipedia: "https://en.wikipedia.org/wiki/Skyfall",
        distributor: "Sony Pictures / Eon Productions"
      }
    },
    {
      id: "the-water-diviner",
      title: "The Water Diviner",
      year: 2014,
      director: "Russell Crowe",
      genre: "Historical Drama",
      synopsis: "An Australian father travels to Istanbul in 1919 to find what happened to his three sons, who fought (and were lost) at Gallipoli four years earlier. Russell Crowe's directorial debut.",
      istanbulRole: "Istanbul is treated as a place of memory, not action. Sultanahmet, Gülhane Park, and Haydarpaşa Station appear as serious cultural and emotional spaces. This was one of the first major international films to take Turkish religious and civic heritage as more than backdrop.",
      legacy: "Marked a clear shift in how Hollywood treated Turkish heritage: as full sacred space rather than exotic atmosphere. Released around the centenary of Gallipoli, it became part of broader Australian and Turkish reflection on shared memory.",
      sources: {
        imdb: "https://www.imdb.com/title/tt2179116/",
        wikipedia: "https://en.wikipedia.org/wiki/The_Water_Diviner",
        distributor: "Universal Pictures / Warner Bros."
      }
    },
    {
      id: "inferno",
      title: "Inferno",
      year: 2016,
      director: "Ron Howard",
      genre: "Mystery Thriller",
      synopsis: "Harvard professor Robert Langdon races through Istanbul, Florence and Venice to prevent a bioterrorism plot, following clues hidden inside Dante's Inferno.",
      istanbulRole: "The film's climax is set entirely in Istanbul. Hagia Sophia, the Basilica Cistern and Istanbul University are central — treated as readable texts rather than backdrops.",
      legacy: "Inferno was the most recent major international production to use Istanbul extensively, and introduced the Byzantine underground (especially the Basilica Cistern) to a wide global audience. It marked a new phase: Istanbul's hidden, ancient layers becoming as cinematically significant as its skyline.",
      sources: {
        imdb: "https://www.imdb.com/title/tt3062096/",
        wikipedia: "https://en.wikipedia.org/wiki/Inferno_(2016_film)",
        distributor: "Sony Pictures"
      }
    }
  ],

  // ─── TEAM / ABOUT ─────────────────────────────────────────────────────────────
  // Solo project, but the team[] array keeps a record of the academic context:
  // institution, supervisor, course name. The about.html page can read this to
  // build its institution card.
  team: [
    {
      name: "Project Team",
      role: "Digital Humanities & Digital Knowledge",
      institution: "University of Bologna",
      supervisor: "Prof. Fabio Vitali",
      course: "Information Modeling and Web Technologies"
    }
  ]

};
// End of APP_DATA. Because APP_DATA is declared with "const" at the top level
// of this file (no module wrapping), it becomes a GLOBAL variable. All other
// scripts in this project can access it as window.APP_DATA or just APP_DATA.
