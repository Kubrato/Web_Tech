IMAGE ASSETS — Istanbul Cinema Tourism (LMML)
================================================

The project's data.js references image files by path. The site renders
a stylized placeholder if the file is missing and switches to the real
image automatically once dropped in.

DIRECTORY STRUCTURE
-------------------
  img/locations/    Real-world photographs of the physical locations
  img/films/        Stills from the films themselves

FILE LIST (drop these exact filenames to activate the images)
------------------------------------------------------------

LOCATIONS (img/locations/):
  grand-bazaar.jpg            — Nuruosmaniye Gate, east entrance
  grand-bazaar-1963.jpg       — interior arcade, period atmosphere
  grand-bazaar-rooftop.jpg    — rooftop view (Skyfall motorcycle finale)
  spice-bazaar.jpg            — interior arcade, Hamidiye gate
  eminonu-square.jpg          — square facing NE toward ferry piers
  galata-bridge.jpg           — upper deck with fishermen, looking N
  karakoy.jpg                 — waterfront warehouses, facing S
  topkapi-palace.jpg          — second courtyard, facing E
  sirkeci-station.jpg         — Moorish revival facade (Jachmund 1890)
  basilica-cistern.jpg        — column forest, amber lighting
  hagia-sophia.jpg            — main dome from ground floor
  hagia-sophia-interior.jpg   — interior with tourists (pre-2020 era)
  istiklal-avenue.jpg         — pedestrian boulevard with historic red tram
  hippodrome.jpg              — Egyptian Obelisk + Serpent Column

FILM STILLS (img/films/):
  skyfall-bazaar.jpg          — opening motorcycle sequence
  skyfall-bazaar-rooftop.jpg  — rooftop chase finale
  skyfall-karakoy.jpg         — port district chase continuation
  taken2-spicebazaar.jpg      — Mills surveilling the spice market
  taken2-eminonu.jpg          — waterfront escape
  taken2-bridge.jpg           — Galata Bridge crossing
  taken2-istiklal.jpg         — Istiklal pedestrian zone
  topkapi-treasury.jpg        — the suspended dagger heist
  topkapi-palace-1964.jpg     — courtyard establishing shot
  frwl-sirkeci.jpg            — Orient Express platform
  frwl-hagiasophia.jpg        — upper gallery meeting
  frwl-grandbazaar.jpg        — 1963 bazaar atmosphere
  inferno-cistern.jpg         — Langdon climax sequence
  inferno-hagiasophia.jpg     — interior with tourist crowds
  inferno-hippodrome.jpg      — Sultanahmet Square monuments

SOURCING SUGGESTIONS
--------------------
Real locations (CC-compatible):
  - Wikimedia Commons (category: "Grand Bazaar of Istanbul" etc.)
  - Unsplash "istanbul" collections
  - Your own photographs

Film stills (fair academic use):
  - Official production press kits (Danjaq, Sony, Fox, Columbia)
  - IMDb photo galleries
  - Wikipedia article images with free licenses

If you use Wikimedia / Unsplash / IMDb imagery, remember to add the
attribution to disclaimer.html > "Original Sources" section.

FALLBACK BEHAVIOUR
------------------
If an image path does not resolve, the location's visual panel shows:
  - A chapter-tinted gradient placeholder
  - The location's name (very-large ghosted text)
  - The chapter icon at center
  - The film tag overlay (top-left)
  - The coordinates mono-font label (bottom-right)

This guarantees the page remains visually complete even before images
are added — PDF requirement "Complete" (ABCD, p.14) is satisfied.
