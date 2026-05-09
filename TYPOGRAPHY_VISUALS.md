# Typography — Visual References to Add

The course brief requires visual examples of real publications justifying
each typographic choice. The current `docs.html` § Typography describes the
fonts in prose but shows no images. This file lists what to source and
where to slot it in.

## What to add (per theme)

### Cinematic theme — Playfair Display + Inter + JetBrains Mono

| Reference                    | Why it justifies our choice                                | Suggested file name          |
|------------------------------|------------------------------------------------------------|------------------------------|
| *The Hollywood Reporter* magazine cover (any 2015+ issue) | Display Didone serifs same family as Playfair, used for film-industry titling | `img/refs/holly-reporter.jpg` |
| *Vanity Fair* "Hollywood Issue" cover  | Didone display serif on cover stories about cinema | `img/refs/vanity-fair.jpg` |
| *Blade Runner 2049* (2017) main-title card | Modern cinema title typography in the same display-serif family | `img/refs/br2049-title.jpg` |
| Netflix Originals title card (e.g., *Mindhunter*) | Inter / similar geometric sans for streaming UI | `img/refs/netflix-mindhunter.jpg` |
| GitHub or Stripe documentation site | Inter as the default modern UI sans for technical interfaces | `img/refs/github-docs.png` |
| JetBrains IDE screenshot      | JetBrains Mono in its native habitat (code editor)           | `img/refs/jetbrains-ide.png` |

### Heritage theme — Cormorant Garamond + EB Garamond + Alegreya Sans SC

| Reference                              | Why it justifies our choice                              | Suggested file name        |
|----------------------------------------|----------------------------------------------------------|----------------------------|
| Penguin Classics paperback (1960s, Tschichold redesign) | Asymmetric centred title page, Garamond-family text | `img/refs/penguin-1960s.jpg` |
| Harvard University Press scholarly monograph (interior page) | EB Garamond / similar Garamond revival, long-form reading | `img/refs/harvard-up.jpg` |
| Princeton University Press cover or interior page | Same scholarly tradition we're imitating | `img/refs/princeton-up.jpg` |
| *From Russia with Love* (1963) main title sequence | The actual film our 1960s chapter is built around | `img/refs/frwl-titles.jpg` |
| *Topkapi* (1964) film poster           | Mid-1960s "tourist Istanbul" film typography             | `img/refs/topkapi-poster.jpg` |
| Ottoman ebru (Turkish marbled paper) sample | Background-pattern justification for the heritage body | `img/refs/ebru-paper.jpg` |
| Mid-XX-century academic edition with small-caps running head | Justifies Alegreya Sans SC for nav/labels | `img/refs/small-caps-running-head.jpg` |

## How to source images responsibly

- For **book covers** and **film posters**: low-resolution (≤ 600 px wide)
  reproductions used for *educational commentary* are routinely accepted as
  fair-dealing in academic contexts. Cite the publisher / studio / year next
  to each image.
- For **magazine spreads**: prefer official publisher publicity shots over
  fan-uploaded scans; otherwise cite the issue.
- For **ebru paper**: many museums (Pera Museum, Sakıp Sabancı) publish
  CC-licensed images of their collection.
- For **book interior pages**: Google Books "preview" pages or Internet
  Archive's *Open Library* (CC0 or public-domain reprints).

Always add the source line to the disclaimer page (`disclaimer.html`).

## Where to put them in `docs.html`

Section structure already exists; just add an `<img>` block after each
`.doc-grid-item` that describes a font. Suggested mark-up (drop into the
typography sub-sections of `docs.html`):

```html
<figure class="type-ref">
  <img src="img/refs/penguin-1960s.jpg"
       alt="Penguin Classics 1960s redesign cover by Jan Tschichold">
  <figcaption>
    Penguin Classics, 1960s — Tschichold redesign. Centred title-page layout
    in a Garamond-family transitional serif. The Heritage theme inherits
    this convention.
  </figcaption>
</figure>
```

A small CSS block (already absent) would round it out — drop into
`style.css` § "29. Small helpers":

```css
/* Typography reference figures */
.type-ref {
  margin: var(--space-md) 0 var(--space-lg);
  padding: var(--space-md);
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 4px;
}
.type-ref img {
  width: 100%;
  max-width: 320px;
  height: auto;
  display: block;
  margin: 0 auto var(--space-sm);
  border: 1px solid var(--border);
}
.type-ref figcaption {
  font-size: 0.78rem;
  color: var(--text-muted);
  line-height: 1.55;
  text-align: center;
  font-style: italic;
}
```

## Minimum to satisfy the brief

If time is short, **two images per theme** (so four total) are enough to
say "yes, I document my typographic choices visually": one period reference
and one modern usage example. The first row of each table above is the
minimum-viable set.
