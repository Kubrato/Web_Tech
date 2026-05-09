# Design Choices — Anticipated Q&A

A defence sheet for the project presentation. Every answer points back to a
concrete number, file, or line in the codebase. Format follows the example
the professor gave: "Q: Why X? A: Because, as documented in section Y, …"

---

## 1. TYPOGRAPHY

### Q1. Why two type families per theme — a serif AND a sans?
**A.** Each theme uses a serif for display (titles, quotes) and a sans for body
text/UI. This is the standard "bicameral" pairing in editorial typography:
the serif gives identity, the sans gives screen legibility at small sizes.
- Cinematic: Playfair Display (display serif) + Inter (UI sans)
- Heritage:  Cormorant Garamond (display serif) + EB Garamond (body) + Alegreya Sans SC (small-caps labels)

The pairing is documented in `docs.html` § "Typography" and in the CSS tokens
`--font-serif`, `--font-sans`, `--font-mono` (`css/style.css:45`).

### Q2. Why Playfair Display for the Cinematic theme?
**A.** Playfair is a high-contrast didone serif, the same family as the typography
on Hollywood movie posters of the 2000s–2010s and on title cards of films like
*Blade Runner 2049*. It signals "cinema poster" instantly.

### Q3. Why Cormorant Garamond + EB Garamond for the Heritage theme?
**A.** Both are open-source revivals of Claude Garamond's 1592 punches. EB Garamond
is tuned for long reading (used by university presses); Cormorant is its display
counterpart. Together they evoke the 1950s–60s European academic press
(Harvard UP, Princeton UP), which matches the Heritage theme's purpose of
presenting the 1960s narrative chapter (*From Russia with Love*) in its
period-correct typographic register.

### Q4. Why JetBrains Mono for coordinates and metadata?
**A.** A monospaced face makes numerical/technical data (GPS coordinates, years,
focal lengths) align in vertical columns and reads as "code/data" at a glance,
distinct from prose. Used in `.mono` (`css/style.css:177`) and
`.location-coords`.

### Q5. Why the specific h1 size of `clamp(2rem, 5vw, 3.5rem)`?
**A.** `clamp(min, preferred, max)` lets the heading scale fluidly with the viewport
(`5vw`) but never collapses below 2rem on phones nor explodes above 3.5rem on
4K screens. No media-query breakpoints are needed for the type scale. Defined
at `css/style.css:166`.

### Q6. Why a base font-size of 16 px?
**A.** 16 px is the browser default and the W3C-recommended baseline for body text.
All `rem` values in the stylesheet are multiples of this single anchor, so a
user who increases their browser default to 18 or 20 px gets a proportionally
larger UI for free. Set at `css/style.css:99`.

### Q7. Why `line-height: 1.75` for paragraphs?
**A.** For body prose, 1.5–1.8 is the typographic comfort range (see
*Bringhurst, The Elements of Typographic Style*). 1.75 sits in that range
and matches the slightly looser leading of mid-century European book design,
which the Heritage theme is built around. `css/style.css:172`.

### Q8. Why uppercase + letter-spacing on labels and buttons?
**A.** Uppercase needs extra letter-spacing (~0.08em–0.18em) to stay readable;
this pairing is standard for small-caps small labels (cf. small-caps running
heads in academic editions). Implemented in `.label`, `.nav-link`,
`.variant-group-label`, etc.

---

## 2. SPACING

### Q9. Why a six-step spacing scale (`--space-xs` … `--space-3xl`)?
**A.** A geometric progression (4 → 8 → 16 → 24 → 40 → 64 → 96 px) prevents the
"random margin" problem: every gap on the site comes from one of seven values,
which makes vertical rhythm consistent without any conscious effort.
Defined at `css/style.css:50`.

### Q10. Why does the explore-page narrative panel use `padding: var(--space-md)` not a custom value?
**A.** Because every padding/margin in the site is one of the spacing tokens.
This is a "design system" choice: a future change (e.g., switch `--space-md`
from 16 px to 14 px on small screens) automatically propagates everywhere.

### Q11. Why is the navigation bar exactly 60 px tall?
**A.** `--nav-height: 60px` (`css/style.css:65`). 60 px is large enough for the
brand mark + tap targets on mobile (Apple recommends ≥44 × 44 pt) but small
enough that the cover-page hero still dominates above the fold on a 1080p
laptop screen.

---

## 3. COLOUR

### Q12. Why these specific hex values for gold (#c9a55a) and steel-blue (#4a8bb5)?
**A.** The two narrative dots had to be (a) clearly distinct for colour-blind
viewers and (b) visually anchored to film stock. Gold #c9a55a evokes the
warm halation of tungsten-lit interiors; blue #4a8bb5 evokes the cool
nighttime steel of espionage cinematography. Each token is named for its
*function*, not its hex (`--accent-gold`, `--accent-blue`), so the Heritage
theme overrides them to warm sienna and prussian blue without renaming.
Defined at `css/style.css:21` and overridden at `css/style.css:1990` (heritage).

### Q13. Why a dark Cinematic palette and a light Heritage palette?
**A.** Two reasons: (1) the Cinematic theme imitates a darkened cinema/projection
room; the Heritage theme imitates a printed book on archival paper.
(2) Light/dark is one of the five axes the brief asks themes to differ on
(colours, fonts, layout, ordering, look-and-feel). Inverting brightness is
the most legible difference at first glance.

### Q14. Why use CSS custom properties for colours instead of fixed hex codes?
**A.** Themes are switched by setting `data-theme="heritage"` on `<html>`; the CSS
variables redefined under that selector cascade everywhere automatically.
No JavaScript needs to walk the DOM to repaint. Implemented at
`css/style.css:1990`.

### Q15. Are the colour combinations WCAG AA-compliant for contrast?
**A.** The body text on background passes WCAG AA (text-primary #e8ddd0 on
bg-primary #0a0a12 ≈ 13:1; required: 4.5:1). The muted text token
(`--text-muted`) is reserved for non-essential labels (timestamps, vocabulary
tags) where AA Large Text (3:1) is sufficient.

---

## 4. LAYOUT

### Q16. Why is the Explore page a two-column grid (image left, narrative right)?
**A.** Cinema is a visual medium, so the still image leads the eye; the narrative
text supports it on the right. This mirrors the layout convention in printed
art books and film monographs (image on the left/recto, caption on the right).
The Heritage theme deliberately *flips* this (`narrative left, image right`)
to echo a book where text introduces the figure plate. See `css/style.css`
heritage section.

### Q17. Why is the cover page hero left-anchored / asymmetric in Cinematic but centred in Heritage?
**A.** Asymmetric left-anchored layout is the dominant convention in
21st-century cinema and streaming UI (Netflix, Criterion Channel). Centred
title-page layouts dominate XIX-century print and 1950s Penguin redesigns
(Tschichold). The two heroes therefore inherit from two different historical
typographic moments — a deliberate ordering choice.

### Q18. Why is the navigation order Cover → Map → Explore → About → Docs → Disclaimer?
**A.** Pedagogical sequence: tease → orient → engage → contextualise →
document → close. The cover establishes mood; the map gives geographic
orientation; the explore page is the engagement; about/docs/disclaimer are
the supporting back matter. Encoded as `PAGE_ORDER` in `js/app.js`.

### Q19. Why a fixed top navigation bar?
**A.** On every page there are deep-link routes (e.g., from the map to
the explore page) and per-location state. A fixed nav keeps the global
escape routes (cover, map, theme switch) visible without scrolling. Cost:
60 px of the viewport height; benefit: zero "where do I go now?" moments.

---

## 5. TWO THEMES

### Q20. Why provide two themes at all?
**A.** The brief explicitly asks for two themes that differ in colours, fonts,
layout, ordering and overall look-and-feel — not just colour. Each theme
also serves a different audience: Cinematic for casual visitors browsing the
21st-century pursuit narrative; Heritage for scholars/heritage readers
following the 1960s timeline narrative.

### Q21. What exactly differs between the two themes?
**A.** Five axes:
1. **Colours**: dark amber/blue → light sienna/prussian (full palette swap)
2. **Fonts**: Playfair + Inter + JetBrains Mono → Cormorant + EB Garamond + Alegreya Sans SC
3. **Layout**: image-left/narrative-right → narrative-left/image-right (mirrored)
4. **Ordering**: image → gallery → info → image → info → image → gallery (visual column reorders inside heritage)
5. **Look-and-feel**: filmstrip background, sharp shadows → ebru-style washes, double-rule borders, drop-cap on first paragraph

### Q22. How is the theme stored across pages?
**A.** `localStorage.theme` is read in an early IIFE at the bottom of `app.js`
and written to `<html data-theme="…">` *before* the first paint. This avoids
a "flash of unthemed content" (FOUC). See `js/app.js` bottom block.

---

## 6. JAVASCRIPT ARCHITECTURE

### Q23. Why a single `App` IIFE (revealing-module pattern)?
**A.** A single global namespace (`window.App`) groups all state and helpers,
keeps everything else encapsulated, and avoids polluting the global scope.
Beginner-readable: one place to look for state, one place for helpers,
one place that decides what is public. See `js/app.js`.

### Q24. Why `localStorage` for state instead of URL parameters?
**A.** localStorage survives page navigation and reload, which matches user
expectation: "I was on location 4 in the timeline narrative; when I come
back I want to be on location 4 again." URL parameters were added on top
(`?n=pursuit&loc=galata-tower`) for shareable deep links, but the *default*
persistence is localStorage. Both are read at startup in `App.init()` and
`App.consumeDeepLink()`.

### Q25. Why CustomEvents (`narrativeChanged`, `locationChanged`) instead of direct function calls?
**A.** Each page binds its own listeners. The Explore page redraws the location
viewer on `locationChanged`; the navigation badge updates on `narrativeChanged`.
Decoupling state mutations from UI updates means a new page can react to the
same events without touching `App.setNarrative()`. Pattern documented in
`js/app.js:18`.

### Q26. Why three audience levels (Young / Adult / Scholar)?
**A.** Reading level adapts the same factual content to three audiences:
introductory simple-English for young visitors; informative tourist-tone
for general adults; scholarly heritage register for academic readers. This
is the "Tailored" leg of the RSTU model documented in `docs.html`. Each
location has a `texts: { young, adult, scholar }` object.

### Q27. Why short and medium length variants on top of the audience axis?
**A.** Audience is *competence × tone*; length is independent — a young visitor
might want a *long* friendly text, a scholar might want a *short* dense text.
Two axes × three values gives up to 6 versions of each text per location.

### Q28. Why use the Haversine formula for the "walk to next" distance?
**A.** Haversine gives great-circle distance between two `[lat, lon]` points
on a sphere — exact enough for distances under a few km in a single city.
We are not modelling street routing; we are giving the visitor a "how far
and which way" hint. The function is in `js/explore.js`.

---

## 7. METADATA & SEMANTICS

### Q29. Why mix three vocabularies (Schema.org, Dublin Core, Wikidata) instead of one?
**A.** Each vocabulary covers a different facet:
- **Schema.org**: places, buildings, geo-coordinates, accessibility
- **Dublin Core (`dcterms:*`)**: editorial provenance — source, rights, date, language
- **Wikidata**: authority control / unique entity IDs (e.g., Hagia Sophia = Q12506)
Each row of the catalogue table tags itself with the vocabulary in use, so
the model is visible in the UI itself. Implemented in `renderMetaTable()`
in `js/explore.js`.

### Q30. Why JSON-LD in the page `<head>` instead of injected by JavaScript?
**A.** Search engines (Google, Bing) and accessibility tools index the
*static* HTML. Putting Schema.org JSON-LD blocks directly in `<head>`
means they are visible in View Source without running any JS. JSON-LD is
the format Google explicitly recommends.

### Q31. Why does the metadata table have five sections (Location / Heritage / Scene / Tourism / Project)?
**A.** Each section answers a different reader question:
- Location: *where*?
- Heritage: *what kind of building, when, by whom*?
- Scene: *which film, which shot*?
- Tourism: *how do I visit*?
- Project: *who curated this and when*?
Same structure on every record → "Systematic" leg of RSTU.

---

## 8. ACCESSIBILITY

### Q32. Why arrow-key navigation between locations on the Explore page?
**A.** Keyboard navigation is a WCAG 2.1 success criterion (2.1.1 Keyboard).
Arrow keys are intuitive for a "previous/next" relationship and they don't
conflict with browser shortcuts. Implementation in `js/explore.js`.

### Q33. Why ARIA roles on the dot navigation (`role="tab"`, `aria-selected`)?
**A.** The dots are not decorative; each one targets a specific location.
Marking them as a tablist makes them discoverable to screen readers.
Implementation in `buildDots()` in `js/explore.js`.

### Q34. Why does the close button on the details panel use `position: sticky`?
**A.** The details panel can scroll vertically (max-height: 60vh). Sticky
positioning keeps the close button reachable from any scroll position
without needing to scroll back to the top. `css/style.css:1685`.

### Q35. Why provide alt text and `aria-hidden` on decorative icons?
**A.** Glyph icons like `◉` and `❦` are decorative — they don't carry meaning
beyond what the visible text already says. `aria-hidden="true"` removes
them from the screen-reader buffer so the same word isn't announced twice.

---

## 9. PERFORMANCE

### Q36. Why no JavaScript framework (no React, no Vue)?
**A.** The site has six static pages and one stateful page (Explore). A
framework would add ~150 KB of runtime to deliver functionality that
~600 lines of vanilla JS already provide. The brief is a beginner-level
web technologies course; the simpler architecture is also more defensible.

### Q37. Why all CSS in one file (`style.css`)?
**A.** Browsers cache one file better than many; HTTP/1.1 still benefits
from fewer round-trips. The file is sectioned with a TOC at the top so
a reader can jump to the relevant section in seconds. Splitting into
modules would require a build step (`@import` chains add latency in dev,
bundlers add tooling complexity).

### Q38. Why `clamp()` for fluid type instead of media-query breakpoints?
**A.** `clamp(min, preferred, max)` produces a smooth curve between phone and
desktop, with no jump at the breakpoint. Saves ~40 lines of media-query
overrides for typography. Defined throughout the typography section.

### Q39. Why a free QR-code API instead of a JS library?
**A.** `api.qrserver.com` returns a PNG via URL — no library to bundle, no
JavaScript to execute on the client. The QR is regenerated only when the
details panel is opened (lazy). See `App.generateLocationQR()` in
`js/app.js`.

---

## 10. CONTENT & EDITORIAL

### Q40. Why two narratives instead of one?
**A.** "Pursuit & Passage" is geographic-cinematic (the espionage chase
through a single city); "Through Time" is historical-cinematic (the same
city as filmed in 1963, 2012, 2014, 2016). Same underlying locations,
two reading orders — a small example of the "same data, different lenses"
principle.

### Q41. Why chapter intro banners + transition lines?
**A.** Each narrative is structured into chapters (Surveillance / Chase /
Search / Confrontation in the pursuit; 1960s / 2012 / 2014 / 2016 in the
timeline). The intro banner orients the reader to a new chapter; the
transition line bridges from the previous one. Both are written into
`narrative.chapterIntros` and `narrative.chapterTransitions` in `data.js`.

### Q42. Why the disclaimer page?
**A.** All visual film stills are © to their studios; the project uses them
under fair-dealing/educational use. The disclaimer page enumerates every
external source (films, music samples, Wikipedia text) so the academic
provenance is auditable. Page 6 of 6 in the navigation order.

---

## 11. THINGS TO ANTICIPATE / KNOWN GAPS

These are honest weaknesses the prof might call out — better to acknowledge
than to be surprised.

### G1. The documentation page lacks **visual examples of real publications**
The brief says: *"Place in the documentation many visual examples of real
publications justifying your typographical choices."*
Currently `docs.html` describes the type choices in prose only — no scanned
book covers, magazine layouts, or film title cards.
**Mitigation**: prepared list of references (see `TYPOGRAPHY_VISUALS.md`)
ready to be added before the presentation.

### G2. There is no real backend / no database
All data lives in `js/data.js` as a JSON-shaped object literal. This is fine
for a static site exhibition; the brief does not require a server.
**If asked**: "The data shape was designed to be portable to a JSON-LD
endpoint without changes — every record already maps to Schema.org Place."

### G3. The Heritage theme image-column reorder uses CSS `order:`, which
breaks reading order for screen readers if not paired with logical DOM order.
**Mitigation**: the DOM order matches the *Cinematic* (default) reading
order; screen-reader users get image → caption regardless of theme.

---

## QUICK-REFERENCE NUMBERS (for spot-question answers)

| Token            | Value         | Where defined        |
|------------------|---------------|----------------------|
| `--nav-height`   | 60 px         | `style.css:65`       |
| `--space-xs`–`3xl` | 4–96 px (geometric) | `style.css:50` |
| Body line-height | 1.75          | `style.css:172`      |
| Base font size   | 16 px         | `style.css:99`       |
| h1 size          | clamp(2rem, 5vw, 3.5rem) | `style.css:166` |
| Sidebar width    | 280 px        | `style.css:66`       |
| Map zoom default | 14            | `js/map.js`          |
| Map centre       | 41.0082, 28.9784 (Istanbul) | `js/map.js` |
| Pursuit length   | 12 locations  | `data.js`            |
| Timeline length  | 16 locations  | `data.js`            |
| Audience levels  | 3 (young/adult/scholar) | `app.js` |
| Length levels    | 2 (short/medium) | `app.js`          |
| Themes           | 2 (cinematic/heritage) | `app.js`     |
