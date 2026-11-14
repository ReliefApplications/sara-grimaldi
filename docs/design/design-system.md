# Design system: Sara Grimaldi website

Version 2.4, 2026-11-14. Owner: designer. Replaces every 1.x version: the
look is new, the structure (routes, content, legal, accessibility) is kept.
This file is the single source of truth for the build. If something is not
specified here, ask the designer rather than guessing.

This document is self-sufficient. The design takes its level of ambition
from two reference sites (see the internal brief, which is not part of the
repository); nothing from them is reused. Draft legal copy is in
`legal-copy.md`.

Contents: 1 Principles, 2 Colour, 3 Typography, 4 Spacing and grid,
5 Breakpoints, 6 Shape, focus, motion, 7 Images, 8 Shell and components,
9 Home page, 10 Other pages, 11 Accessibility, 12 SEO, 13 Content model,
14 Dependencies and defaults, 15 Build order.

---

## 1. Principles

1. **Image first.** The first screen is a film image, edge to edge.
2. **One loud voice.** Very wide, very heavy uppercase type for the name,
   titles and labels. Everything else is quiet.
3. **Three colours.** Off-white, black, vermilion. Sections alternate between
   them as full-width fields.
4. **Two motifs, used everywhere.** The **record dot** (a solid vermilion
   circle) marks labels and separates items. The **highlight** (a vermilion
   block behind black text) marks emphasis, hover and the current item.
5. **A moving band** of territories and roles, and a second one of press
   names. Pausable, and still under reduced motion.
6. **Proof before work.** Collaborators' logos come before the films, and
   press mastheads run in the second band. Only logos Sara is cleared to use
   are shown; any organisation without one appears as its name in the site's
   type (8.15).
7. **Little prose on the home page.** Labels, names, titles, one statement.

---

## 2. Colour

Palette A "brun + terracotta" chosen by Sara on 2026-11-14 (softer than the
first black + orange); the home Films section now sits on ground.

| Token | Value | Use |
|---|---|---|
| `--color-ground` | `#F4F0E8` | Default page background; text on ink and on images |
| `--color-ink` | `#2A2623` | Text; dark sections; rules; borders |
| `--color-accent` | `#D97A55` | Record dot, highlight, accent sections (footer, press band) |
| `--color-muted` | `#5F5952` | Secondary text on ground |
| `--color-muted-on-ink` | `#B3ACA3` | Secondary text on ink |
| `--color-rule-on-ink` | `#4A443F` | Hairlines on ink |
| `--color-placeholder` | `#D9D7D0` | Image placeholder; `<mark>` background |

Contrast (WCAG 2.1, calculated):

| Foreground | Background | Ratio | Use allowed |
|---|---|---|---|
| ink | ground | 13.2:1 | All text |
| ground | ink | 13.2:1 | All text |
| ink | accent | 4.9:1 | All text |
| accent | ink | 4.9:1 | All text |
| muted | ground | 6.1:1 | All text |
| muted-on-ink | ink | 6.7:1 | All text |
| ink | placeholder | 10.4:1 | All text |
| accent | ground | 2.7:1 | **Not for text or control boundaries.** Decoration only (dots, bars) |
| ground | accent | 2.7:1 | **Not allowed for text** |

Rules:
- On accent, text is always ink. On ground, accent is never text.
- Text over a photograph is allowed only in the hero and only over the scrim
  specified in 9.1.
- Three surface types: `ground` (ink text), `ink` (ground text), `accent`
  (ink text). Each component below states its surface.

---

## 3. Typography

### 3.1 Families (both SIL Open Font License 1.1)

| Role | Family | File | Axes used |
|---|---|---|---|
| Everything except the accent word and quotes | **Archivo** (variable) | 1 woff2, roman | `wght` 400 to 900, `wdth` 62 to 125 |
| Accent word, pull quotes, inline film titles | **Fraunces** (variable) | 1 woff2, italic | `wght` 400, `opsz` auto |

Two font files in total. Inter and Fraunces roman are removed from the
project.

Where to get them:
- Archivo: the variable font `Archivo[wdth,wght].ttf` in the `ofl/archivo`
  folder of the `google/fonts` repository on GitHub (upstream:
  Omnibus-Type/Archivo), licence file `OFL.txt` alongside it. Needed as
  woff2, Latin subset. The Google Fonts CSS API serves that subset as a
  variable woff2 when requested with a current browser user agent
  (`family=Archivo:wdth,wght@62..125,100..900`); with a generic client it
  returns static files instead, which are not wanted. Download once and
  self-host; no font CDN at runtime.
- Fraunces italic: the file already in the project.
- Subset must include `é è ê ë à â ç î ï ô ù û œ Œ É È À Ç « » ’ – ●` and
  Italian `ì ò`. If `●` is missing from the subset, draw dots in CSS (they
  are specified as CSS shapes below anyway).
- `font-display: swap`. Preload both files. Keep the licence texts in the
  repository next to the fonts.
- Fallbacks: `--font-sans: "Archivo", "Arial Black", "Helvetica Neue", Arial,
  sans-serif;` `--font-serif: "Fraunces", Georgia, "Times New Roman", serif;`
- Widths are set with `font-stretch` (125%, 100%, 62%), weights with
  `font-weight`. No synthetic bold or italic: `font-synthesis: none`.

### 3.2 Styles

"Wide" = `font-stretch: 125%`. "Normal" = 100%. "Narrow" = 62%. Fluid sizes
run from a 360 px to a 1280 px viewport and are fixed outside it.

| Token | Width, weight, case | 360 | 1280 | `font-size` | Line height | Tracking |
|---|---|---|---|---|---|---|
| `mega` | Wide 900, uppercase | see 9.1 | see 9.1 | viewport-fitted | 0.86 | -0.01em |
| `giant` | Wide 900, uppercase | 34 px | 120 px | `clamp(2.125rem, 0.022rem + 9.348vw, 7.5rem)` | 0.92 | -0.01em |
| `display` | Wide 900, uppercase | 26 px | 72 px | `clamp(1.625rem, 0.5rem + 5vw, 4.5rem)` | 0.98 | -0.005em |
| `title` | Wide 800, uppercase | 19 px | 32 px | `clamp(1.1875rem, 0.87rem + 1.413vw, 2rem)` | 1.08 | 0 |
| `band` | see 8.5, uppercase | 26 px | 46 px | `clamp(1.625rem, 1.136rem + 2.174vw, 2.875rem)` | 1 | 0 |
| `label` | Wide 800, uppercase | 12 px | 14 px | `0.75rem`, `0.875rem` from lg | 1.3 | 0.03em |
| `nav` | Wide 700, uppercase | 13 px | 13 px | `0.8125rem` | 1.2 | 0.04em |
| `lead` | Normal 400 | 20 px | 26 px | `clamp(1.25rem, 1.103rem + 0.652vw, 1.625rem)` | 1.4 | 0 |
| `body` | Normal 400 | 17 px | 18 px from md | `1.0625rem`, `1.125rem` | 1.6 | 0 |
| `small` | Normal 400 | 15 px | 15 px | `0.9375rem` | 1.5 | 0 |
| `quote` | Fraunces italic 400 | 26 px | 44 px | `clamp(1.625rem, 1.185rem + 1.957vw, 2.75rem)` | 1.2 | -0.01em |

Rules:
- Uppercase is applied with CSS (`text-transform`), never typed in content.
  French capitals keep their accents.
- Wide uppercase words are long. Every `giant`, `display` and `title` block
  has `overflow-wrap: anywhere` and `hyphens: none`; nothing may cause
  horizontal scroll at 320 px.
- Headings: `text-wrap: balance`. Body measure: max `66ch`.
- Emphasis in body text: weight 700. No italic sans.
- **Accent word.** Where a phrase is marked for emphasis inside a `display`
  or `giant` text (the home statement), it is set in Fraunces italic 400,
  **not uppercase**, at 1.08 times the surrounding size, as a highlight (6.4).
- **Inline film titles** in prose: content convention `*Title*`, rendered as
  `<cite>` in Fraunces italic 400 at 1.05 times the surrounding size. No
  nesting, no other syntax; an unpaired asterisk prints as is. Built as text
  and elements, never by injecting HTML.
- **Placeholder marking**: a segment starting `[à compléter` or
  `[to be completed` up to the next `]` is wrapped in `<mark>`: background
  `--color-placeholder`, ink text, padding 0 4 px. The build warns while any
  remains.
- Numbers in meta lines: `font-variant-numeric: tabular-nums`.
- One `h1` per page; heading levels are never skipped; visual tokens are
  independent of heading level.
- Typographic characters live in content: `’`, `« »` with non-breaking
  spaces in French, `“ ”` in English, `–`.

---

## 4. Spacing and grid

Spacing scale (only these values): 4, 8, 12, 16, 24, 32, 48, 64, 96, 128,
160 px (`--space-1` to `--space-11`).

| | Base (below 768) | md (768 to 1279) | lg (1280 and above) |
|---|---|---|---|
| Columns | 4 | 8 | 12 |
| Gutter | 16 px | 24 px | 24 px |
| Side margin | 20 px | 32 px | 40 px |
| Container | fluid | fluid | fluid up to 1360 px content (1440 px viewport), then centred |

"Full-bleed" = the element ignores the container and touches both viewport
edges. Section backgrounds are always full-bleed; their content sits in the
container unless stated.

Section vertical padding (`--section-pad`): 64 px base, 96 px md, 128 px lg.

---

## 5. Breakpoints

| Name | Media query | Checked at |
|---|---|---|
| base | none | 360 px |
| `md` | `(min-width: 48rem)` | 768 px |
| `lg` | `(min-width: 80rem)` | 1280 px |

---

## 6. Shape, focus, motion

6.1 **Shape.** Radius 0 everywhere except the record dot (circle). No
shadows, no gradients except the hero scrim.

6.2 **Rules.** Major rule: 2 px solid ink (on ink surfaces: 1 px
`--color-rule-on-ink`). Minor rule between rows: 1 px solid ink.

6.3 **Record dot.** A CSS circle, `0.5em` wide and high, `border-radius:
50%`, `display: inline-block`, vertically centred on the cap height
(`vertical-align: 0.08em`), `aria-hidden`. Colour: accent on ground and ink
surfaces, ink on accent surfaces.
- Before a section label: dot, then `0.6em` gap, then the label.
- As a separator in a line of items: `0.7em` margin each side. The dot is
  bound to the item before it (no line may start with a dot).

6.4 **Highlight.** Black text on a vermilion block: `background:
var(--color-accent); color: var(--color-ink); padding: 0 0.12em;
box-decoration-break: clone`. Used for: the accent word, link hover, the
current navigation item, hover on film titles. On accent surfaces the
highlight inverts: `background: var(--color-ink); color:
var(--color-accent)`.

6.5 **Focus.** `outline: 3px solid; outline-offset: 3px` on
`:focus-visible`, colour ink on ground and accent surfaces, ground on ink
surfaces and over the hero. Never removed, except the route-change `h1`
(section 11).

6.6 **Targets.** 44 × 44 px minimum for every link or button outside a
paragraph.

6.7 **Motion.**
- Transitions: 150 ms ease-out on `color`, `background-color`,
  `border-color`.
- Film tiles: image `transform: scale(1.03)` over 400 ms ease-out on hover or
  focus (image is clipped by its tile).
- Bands move (8.5). Nothing else moves. No scroll-triggered animation, no
  parallax, no page transitions.
- `prefers-reduced-motion: reduce`: no transitions, no scale, bands static,
  `scroll-behavior: auto`.

---

## 7. Images

7.1 **Two treatments.** The films' existing images are uneven: a few clean
frames, and posters with titles and festival laurels printed on them. Each
image declares how it is shown (`fit`):

| `fit` | For | How |
|---|---|---|
| `cover` | Clean frames; images whose printed title can be cropped away | Fills its tile, `object-fit: cover`, `object-position` from the image's `focus` value (default `50% 50%`) |
| `poster` | Posters and any image with a title printed across it | The tile is an ink field. The whole image is shown uncropped, centred, `object-fit: contain`, at 84% of the tile height (max 84% width), like a poster in a lightbox |

A poster is never cropped into a fake still. A `cover` crop must not cut
through printed lettering: either the lettering is entirely outside the crop
or the image is `poster`.

7.2 **Tile ratios.** Home lead film 16:9 (4:3 at base). Home secondary films
4:3. Films index 16:9. Film page lead 16:9. Gallery 16:9. Portrait of Sara
4:5. Open Graph 1200 × 630.

7.3 **Hero image.** The poster frame of Sara's showreel video: a dancer in a
pale dress against black, 1920 × 1080, `fit: cover`, `focus: 55% 30%` at
every breakpoint. Its black ground merges with the band beneath it, so the
figure, the name and the red dots are the whole first screen. The showreel
(`reel` in home.json) plays over it on click: see 7.5. Caption optional. Alt text describes the frame in both languages. On
screens wider than 1920 px the image is upscaled, which the dark frame
tolerates.

7.3b **Frames with lettering.** A frame that carries printed text in part of
the picture is exported as a crop that excludes all of it, then used as
`cover`. If no crop of the needed ratio is free of lettering, the image is
`poster`.

7.4 **Delivery.** WebP, quality about 78, widths 480, 768, 1280, 1920 (hero
and full-bleed) or 480, 768, 1152 (tiles); `srcset` and `sizes` matching the
layout; `width` and `height` set; `loading="lazy"` and `decoding="async"`
except the hero and a film page's lead image (`loading="eager"`,
`fetchpriority="high"`). Placeholder colour while loading:
`--color-placeholder` (ink for `poster` tiles). Every image has alt text in
both languages.

7.5 **Video.** Home showreel (since 2026-11-14): the photo first; after
`ambientDelay` seconds (4) on the first screen, the showreel plays muted,
looping and without controls behind the scrim and the name (Vimeo
`background=1&dnt=1`, cropped to fill, fading in once loaded). Not started
with `prefers-reduced-motion`, Save-Data, or after "Arrêter la vidéo" in
this visit. Controls in the hero (bottom left on small screens, above the
name on the right from lg): a ground play circle, "Voir la bande démo · 1:50"
(then "Voir avec le son" while the muted reel plays) opening the full player
with sound over the hero, and "Arrêter la vidéo" (WCAG 2.2.2). Film pages: click-to-load facade (a `<button>`
over the lead image with a centred 96 px ink circle and a ground triangle;
hover: circle accent, triangle ink), provider iframe inserted only on click
(`player.vimeo.com/video/{id}?dnt=1&autoplay=1` or
`youtube-nocookie.com/embed/{id}?autoplay=1`). Watch modes per film: `full`,
`trailer`, `external` (button linking out), `none` (line "Film disponible
sur demande" / "Available on request" linking to Contact).

---

## 8. Shell and components

### 8.1 Skip link

First focusable element. "Aller au contenu" / "Skip to content". Off-screen
until focused; then fixed top 8 px, left 8 px, accent background, ink text,
`nav` style, padding 12 px 16 px. Targets `<main id="contenu">`.

### 8.2 Header

Two variants.

**Standard (every page except home).** Surface ground. Height 64 px base,
72 px md and lg. 2 px ink rule under it. Not sticky.
- Left: wordmark "Sara Grimaldi", Wide 900 uppercase, a fixed 14 px at base
  and 20 px at md and lg (never scaled to the space left), ink, at least
  12 px clear of the language switcher. Below a 340 px viewport it breaks
  into two lines, "Sara" / "Grimaldi". Link to home, accessible name "Sara Grimaldi – Accueil" /
  "– Home".
- Right, lg: nav links in `nav` style, 28 px apart: Films, Presse, À propos,
  Contact (EN Films, Press, About, Contact); then 28 px; then the language
  switcher.
- Right, below lg: language switcher, 12 px, Menu button.

**Home.** Same content and positions, but: `position: absolute` over the top
of the hero, no background, no rule, text in ground, and **no wordmark** (the
name is the hero). The left slot is empty.

Nav link states (standard; home in brackets):

| State | Style |
|---|---|
| Default | ink (ground) |
| Hover | highlight (6.4) |
| Focus-visible | ring (6.5) |
| Current page | highlight, `aria-current="page"`. On a film page, Films is current |

### 8.3 Language switcher

"FR" and "EN" in `nav` style, separated by `/`. Current language: plain
text, weight 800, `aria-current="true"`, plus visually hidden " – langue
actuelle" / " – current language". Other language: link to the same page in
the other language, `lang` and `hreflang`, visible code followed by visually
hidden " – English version" / " – version française" (no `aria-label`).
Hover: highlight. Wrapped in `<nav aria-label="Langue / Language">`. 44 px
hit areas.

### 8.4 Mobile menu (below lg)

- Button: "Menu" in `nav` style inside a 2 px border (ink; ground on home),
  height 44 px, padding 0 12 px. `aria-expanded`, `aria-controls`.
- Panel: native `<dialog>` opened with `showModal()`, reset to fill the
  viewport, transparent `::backdrop`. Surface **ink**. Top row: wordmark
  (ground), language switcher, "Fermer" / "Close" button (same box style,
  ground), `autofocus`.
- Links: the four nav items stacked, `display` style, ground, each row
  min-height 72 px, 1 px `--color-rule-on-ink` between rows, starting 24 px
  under the top row. Hover and current: highlight.
- Bottom, pinned 24 px from the bottom edge: email as a link, `small`,
  ground.
- Behaviour: focus trapped by the dialog; `Esc` closes; focus returns to the
  Menu button; page scroll locked (`overflow: hidden` on the root); choosing
  a link closes it. Appears and disappears without animation.

### 8.5 Band (moving)

A full-bleed strip of large uppercase items that scrolls horizontally.

| | Base | md | lg |
|---|---|---|---|
| Height | 56 px | 72 px | 88 px |
| Type | `band` token | | |

Items sit on one line, vertically centred, separated by record dots (6.3).

Two variants:

| Variant | Surface | Items | Dot colour | Direction, duration |
|---|---|---|---|---|
| `roles` | ink, ground text | The three film families and the role labels, interleaved: family, role, family, role, family, role | accent | right to left, 36 s per loop |
| `press` | accent, ink | Press outlets, unique, in press order: each as its logo (8.15, band size) or, without one, its name in type | ink | left to right, 48 s per loop |

Type inside the band:
- Families (variant `roles`) and outlet names shown as text (variant
  `press`): Wide 900.
- Logos in the `press` band: black artwork on the accent surface, shown as
  supplied (no filter). Separator dots have 1em margin each side in this
  variant.
- Role labels: **Narrow 700**, tracking 0.02em. The alternation of very wide
  and very narrow words at the same height is the band's signature.

Links: in `roles`, each family is a link to `/{lang}/films#{family}`; hover
and focus: highlight. Role labels and press names are plain text.

Mechanics:
- The track holds the item list twice; the second copy is `aria-hidden` and
  its links have `tabindex="-1"`. Animation: `transform: translateX(0)` to
  `translateX(-50%)` (reversed for `press`), linear, infinite.
- The first copy is a `<ul>`; the `roles` band is wrapped in
  `<nav aria-label="Familles de films / Film families">`.
- **Pause** (WCAG 2.2.2): the animation pauses while the pointer is over the
  band, while focus is inside it, and when the pause button is pressed.
- Pause button: at the right end of the band, above the track, 44 × 44 px,
  same surface colour as the band with a 2 px rule on its left edge (ground
  on ink band, ink on accent band). Icon drawn in CSS: two bars (pause) or a
  triangle (play), 14 px high, in the band's text colour. `aria-pressed`;
  accessible name "Mettre le défilement en pause" / "Pause the scrolling
  text", and when paused "Reprendre le défilement" / "Resume the scrolling
  text". One press pauses **both** bands; the state lasts for the page view
  and is not stored.
- **Reduced motion:** no animation, no second copy, no pause button; the band
  becomes a static strip: `height: auto`, items wrap, 12 px vertical padding,
  left-aligned in the container.

### 8.6 Section label

Record dot + text in `label` style. Ink on ground, ground on ink, ink on
accent. It is the section's `h2` unless a larger heading follows.

### 8.7 Links and buttons

**Text link (in prose):** ink, underline 2 px, offset 3 px. Hover:
highlight, no underline. External links in reference lists (press, socials)
open in a new tab with a trailing `↗` (`aria-hidden`) and visually hidden
"(nouvelle fenêtre)" / "(new window)".

**Arrow link:** text in `nav` style followed by ` →`, min-height 44 px,
underline 2 px, offset 6 px. Hover: highlight. Colour follows the surface.

**Block button:** full width of its column, height 64 px base and 72 px from
md, 2 px border, `title` style text left and `→` right, padding 0 24 px.

| Surface | Default | Hover and focus |
|---|---|---|
| ground | border and text ink, transparent | background ink, text ground |
| ink | border and text ground | background accent, text ink, border accent |
| accent | border and text ink | background ink, text accent |

No disabled states on this site.

### 8.8 Film tile

A link wrapping the image tile and the title.

1. Image tile at the ratio given by its context (7.2), treatment `cover` or
   `poster` (7.1), clipped.
2. 16 px.
3. Row: index number ("01", from display order) in `label`, muted; then the
   title; then the meta in `label`: family, dot, year, dot, duration. The
   meta sits to the right of the title, right-aligned, on full-width tiles
   from md and on half-width tiles from lg; otherwise it sits under the
   title, 8 px below, aligned with the title's left edge. A title must never
   be squeezed into breaking inside a word.
4. Title: `display` for the home lead film, `title` elsewhere.

| State | Style |
|---|---|
| Hover, focus-visible | Image scales (6.7); title becomes a highlight |
| Focus-visible | Ring around the whole tile |

### 8.9 Name wall (About page)

Collaborators' names with their roles, as rows. Used on the About page
only, always in its detailed form; the home page uses the logo grid (8.16).

- Each row: name in `title` style on the left; role in `small`
  (muted-on-ink) on the right, optional. Row min-height 64 px base, 80 px
  from md; 1 px `--color-rule-on-ink` above each row and below the last;
  content vertically centred. At base the role sits under the name (4 px
  gap, row padding 16 px vertical).
- Columns: 1 at base, 2 at md (48 px column gap), 3 at lg (48 px gap). Rows
  fill column by column.
- From md, the role sits beside the name only when both fit on one line;
  otherwise under it, as at base.
- Surface ink. Names are not links.
- A compact form (home) omits the roles; the detailed form (About) shows
  them.

### 8.10 Press row

Whole row is a link when the item has a URL or scan (new tab, `↗`).
- Publication: its logo (8.15, row size), left-aligned, when it has one;
  otherwise its name in `title` style.
- Description: `body`.
- Meta: `label`, muted, nowrap: year, dot, country, and when the article
  language differs from the page language, dot and its two-letter code,
  followed by visually hidden " – article en italien" / " – article in
  French".
- Base and md: stacked, 6 px gaps, 20 px vertical padding. lg: one row,
  publication cols 1–4, description cols 5–9, meta cols 10–12 right-aligned,
  first baselines aligned, 24 px vertical padding. 1 px ink rule between
  rows.
- Hover (linked rows): the publication name becomes a highlight.

### 8.11 Pull quote

Surface as its section. A 6 px accent bar on the left (ink on accent
surfaces), 24 px gap, text in `quote`, with the quotation marks of the
language. Attribution under it, 16 px, in `label`. Max width cols 1–10 at
lg.

### 8.12 Data list

A `<dl>` of rows: `dt` in `label`, muted; `dd` in `body`. 1 px ink rule
above each row and below the last, 12 px vertical padding. `dt` above `dd`
at base; from md, `dt` in a 160 px column, `dd` beside it.

### 8.13 Footer

Surface **accent**, ink text. Padding 64 px top, 24 px bottom (base); 128 px
and 32 px (lg).

1. Section label "Contact" (dot in ink).
2. 24 px. Invitation in `giant` (draft: "Un projet ? Parlons-en." / "A
   project? Let's talk."). Omitted on the Contact page.
3. 32 px (48 px lg). Email link in `title` style but **not uppercase**
   (`text-transform: none`), underline 3 px, offset 6 px,
   `overflow-wrap: anywhere`. Hover: highlight (inverted, 6.4).
4. 64 px (96 px lg). 2 px ink rule. 16 px.
5. Bottom row in `nav` style, three groups: copyright "© {year} Sara
   Grimaldi"; legal links in `<nav aria-label="Informations légales / Legal
   information">` ("Mentions légales", "Confidentialité" / "Legal notice",
   "Privacy"); social links as text ("Instagram", "Vimeo", new tab). Links:
   hover highlight (inverted). 44 px hit areas, 24 px between links.
   DOM order everywhere: legal links, social links, copyright. Base and md:
   stacked in that order, 4 px apart. lg: one line, with the copyright
   placed visually first at the left (it is not focusable, so keyboard order
   is unaffected), legal links 48 px after it, social links at the right
   edge.

No phone number in the footer or the menu.

### 8.14 Privacy notice

Behaviour unchanged from the built version; only the look changes.

- Content: `enabled`, `version`, `text`, `linkLabel`, `dismissLabel`,
  `regionLabel`. Copy: "Ce site n'utilise ni cookies ni outil de suivi." /
  "This site uses no cookies and no tracking tools."; link "Confidentialité"
  / "Privacy"; button "J'ai compris" / "Got it".
- `<aside aria-label>`; not a dialog; no focus trap, no focus move, no
  `aria-live`. In the DOM directly after the skip link.
- Fixed at the bottom: base 12 px from left, right and bottom; md and lg
  bottom-left, 24 px inset, 420 px wide.
- Look: surface ground, 2 px ink border, padding 16 px (20 px from md). Text
  `small`. One row under it, 12 px gap: text link (8.7) left, button right.
  Button: height 44 px, 2 px ink border, `nav` style, padding 0 16 px; hover:
  background ink, text ground. At 360 px in both languages: max 160 px tall,
  text max two lines, link and button on one row.
- While visible: `scroll-padding-bottom` on the root and extra bottom padding
  on the footer, both = notice height + 24 px.
- Dismissal: `localStorage` key `sg-privacy-notice` = `version`; nothing else
  stored; in memory only if storage is unavailable. If focus was inside,
  move it to the page `h1`.
- Rendered in the browser only, after reading storage; never in prerendered
  HTML. No animation. Hidden in print. `enabled: false`: not rendered,
  storage untouched.
- Without JavaScript: no notice. Only `404.html` has a `<noscript>` block
  (name, one sentence in both languages saying this page needs JavaScript,
  link to home, email).

### 8.15 Logo

The logos are small raster files of uneven shape and colour, with no vector
versions. Rules that make them sit together:

- **Only cleared logos.** An organisation has a logo only if the file is one
  Sara is allowed to use. Otherwise it is shown as its name (fallback
  below). Never fetch a logo from elsewhere.
- **Box, not height.** Each logo is fitted inside a box with `object-fit:
  contain`, centred, so wide wordmarks and tall emblems get comparable
  visual weight:

  | Size | Box (max width × max height) base | md | lg | Used in |
  |---|---|---|---|---|
  | grid | 112 × 36 px | 132 × 48 px | 156 × 56 px | Logo grid (8.16) |
  | band | 180 × 30 px | 220 × 36 px | 260 × 42 px | `press` band (8.5) |
  | row | 180 × 30 px | 200 × 34 px | 220 × 36 px | Press rows (8.10) |

- **Optical correction.** An optional `scale` per logo in content (0.7 to
  1.3, default 1) multiplies the box, to even out marks that look too heavy
  or too light. Start at 1 for all and adjust by eye.
- **Never upscale** a file beyond its pixel size at 1x. The boxes above stay
  within the files' sizes; on high-density screens some will be slightly
  soft, which is accepted until better files are supplied.
- **Colour treatment.**
  - On the **ground** surface (logo grid): logos keep **their own colours**;
    no grayscale or other filter. `mix-blend-mode: multiply` only, which
    makes any white box around a logo disappear into the ground, so
    transparent backgrounds are not assumed. A coloured box that belongs to a
    mark stays. No hover effect. The grid's black rules and even cells are
    what hold the different colours together.
  - On the **accent** surface (`press` band) and in press rows on ground:
    black artwork as supplied, no filter. A logo that is not black-only is
    not used on accent; show the name instead.
  - Logos are **never placed on the ink surface** (many are black) and never
    recoloured or inverted.
- **Alt text** is the organisation's name, nothing more. In the band's
  hidden second copy the alt is empty.
- **Fallback (no logo):** the name in Wide 800 uppercase, ink, centred in the
  same box area: 13 px (base), 14 px (md), 16 px (lg) in the grid, allowed to
  wrap to two lines; `band` token in the band; `title` in press rows.
- Stray edge lines left by cutting the files are cleaned at export.

### 8.16 Logo grid

Surface ground. A grid of equal cells, each holding one logo (8.15, grid
size) or one fallback name, centred both ways.

| | Base | md | lg |
|---|---|---|---|
| Columns | 2 | 5 | 5 |
| Cell height | 72 px | 112 px | 136 px |

- A logo or name never comes closer than 16 px to a cell edge; the box of
  8.15 shrinks if needed to keep that margin.
- Order: organisations with a logo first, then those shown as names, so the
  names form the end of the grid and never sit among the logos.
- Thin or pale marks that read too faintly get `scale` 1.3; heavy black
  marks stay at 1 or go down to 0.85.
- At base, when the number of items is odd, the last cell spans both
  columns, so no empty cell is left.

- 1 px ink rules between cells (inner lines only, none around the outside);
  2 px ink rule above and below the grid.
- Marked up as a `<ul>`; cells are not links.
- Order from content. If the last row is incomplete, its empty cells stay
  empty (rules still drawn).

---

## 9. Home page (`/fr`, `/en`)

Order: hero, band `roles`, statement, collaborations, films, band `press`,
footer. Surfaces in that order: image, ink, ground, ground, ink, accent
(then a ground row), accent. DOM order is the same at every breakpoint.

### 9.1 Hero and first screen

The first screen is the hero plus the `roles` band, exactly filling the
viewport.

- Hero height: `calc(100svh - {band height})`, min 480 px, max 1000 px.
  Full-bleed. Surface: image.
- Image: 7.3, covering the hero.
- **Scrim** (over the image, under the text), two layers:
  - bottom: `linear-gradient(to top, rgba(14,14,14,0.90) 0%,
    rgba(14,14,14,0.60) 30%, rgba(14,14,14,0) 65%)`;
  - top: `linear-gradient(to bottom, rgba(14,14,14,0.65) 0,
    rgba(14,14,14,0) 180px)`.
  All hero text is ground on this scrim.
- Header (home variant, 8.2) at the top.
- **Bottom block**, in the container, bottom padding 20 px base, 28 px md,
  32 px lg:
  1. Role line in `label`, ground: role labels separated by record dots
     (accent). May wrap; no line starts with a dot.
  2. 12 px (16 px lg).
  3. `h1` "Sara Grimaldi" in `mega`, ground.
  4. Image credit, `small`, solid ground (no reduced opacity): draft
     "Image : {title of the film}" / "Image: {title}". Rendered only when
     the caption field is filled. Base and md: 12 px under
     the name. lg: on the role line's row, right-aligned.

**The name (`mega`).**

| | Lines | Starting `font-size` | Target |
|---|---|---|---|
| Base | 2: "Sara" / "Grimaldi" (forced break) | `15vw` | The line "GRIMALDI" spans the container width |
| md | 1 | `9.2vw` | The line "SARA GRIMALDI" spans the container width |
| lg | 1 | `9.2vw`, capped at `132px` from 1440 px | Same |

The values are starting points from estimated glyph widths. Measure in the
browser with the real font and adjust the `vw` factor so the longest line is
between 96% and 100% of the container width at 360, 768 and 1280 px. It must
never overflow, including with the fallback font: the `h1` has
`overflow: hidden` and `white-space: nowrap` per line as a safety net.

Left-aligned. No statement, button or other text in the hero.

Band `roles` (8.5) directly under the hero, full-bleed.

### 9.2 Statement

Surface ground: the first light field after the dark first screen. Padding
`--section-pad` at the top, 48 px at the bottom (64 px lg), because the
collaborations section follows on the same surface.

- The statement in `display`, ink, as a `<p>` (not a heading). Draft: "Je
  travaille l'émotion, quel que soit le format." / "I work with emotion,
  whatever the format." The emphasised phrase ("l'émotion" / "emotion") is
  the accent word (3.2): Fraunces italic, not uppercase, highlight.
- 32 px (48 px lg).
- Intro, 2 to 3 sentences, `lead`.
- Arrow link "À propos" / "About".

| | Statement | Intro | Arrow link |
|---|---|---|---|
| Base | full width | full width | 24 px under the intro |
| md | cols 1–8 | cols 1–6 | 24 px under the intro |
| lg | cols 1–11 | cols 1–7 | cols 9–12, aligned to the last line of the intro, right-aligned |

### 9.3 Collaborations

Surface **ground**. Padding 0 at the top (it continues the statement's
field), `--section-pad` at the bottom.

- Section label "Collaborations".
- 32 px (48 px lg).
- Logo grid (8.16) of the organisations flagged for home: logos where
  cleared files exist, names in type otherwise. **Exactly 15**, so the grid
  is three full rows from md, with no empty cell. Client organisations only;
  press outlets are in the band.
- 32 px. One sentence in `small`, muted (draft: "Films, portraits et
  campagnes pour des marques, des médias, des associations et des
  fondations." / EN equivalent), max cols 1–6 at lg.

### 9.4 Films

Surface **ink**: the films are shown in a dark room. Titles ground, index
numbers and meta muted-on-ink, block button in its ink variant. Padding
`--section-pad`.

- Section label "Films choisis" / "Selected films". 32 px (48 px lg).
- Up to three film tiles (8.8), in the order of the home content list.

| | Film 1 (lead) | Films 2 and 3 |
|---|---|---|
| Base | full container width, tile 4:3, title `display` | stacked, full width, tile 4:3, title `title`; 48 px between films |
| md | full width, tile 16:9 | side by side, 4 cols each, tile 4:3; 64 px above |
| lg | full width (12 cols), tile 16:9 | side by side, 6 cols each, tile 4:3; 96 px above |

With only two films: the second is full width like the first. With one: just
the lead.
- 48 px (64 px lg). Block button (8.7) "Tous les films" / "All films", full
  container width.

### 9.5 Press band

Band `press` (8.5), full-bleed, directly after the films section (no gap).
Rendered only when there is at least one press item.

Under it, surface ground, a row in the container with 24 px vertical
padding: arrow link "Toute la presse" / "All press", right-aligned at md and
lg, left-aligned at base.

### 9.6 Footer

8.13, directly after.

---

## 10. Other pages

Every page: skip link, privacy notice, header (standard), `<main>`, footer.
Page head pattern unless stated: surface ground, padding 48 px top (72 px
md, 96 px lg) and 32 px bottom (48 px lg); `h1` in `giant`; 2 px ink rule
full-bleed under the head.

### 10.1 Films index (`/fr/films`, `/en/films`)

1. Page head: `h1` "Films". Under it, 24 px, one sentence in `lead`
   (cols 1–7 at lg).
2. Family navigation: three anchor links ("Fiction", "Documentaire",
   "Campagnes à impact" / "Fiction", "Documentary", "Impact campaigns") as
   bordered boxes: height 44 px, 2 px ink border, `nav` style, padding
   0 16 px, 8 px apart, wrapping; hover: background ink, text ground.
   `<nav aria-label="Familles de films / Film families">`. 32 px above,
   48 px below.
3. One section per family with at least one published film, ids `fiction`,
   `documentaire`, `impact`:
   - Heading row: `h2` family name in `display`; count in `label`, muted,
     right-aligned on the same baseline from md (under the name at base).
     2 px ink rule above the row, 24 px padding above the name, 32 px below.
   - Film tiles (8.8), 16:9, newest first. Base: 1 column, 48 px apart. md
     and lg: 2 columns, row gap 64 px. A lone film stays in the left column.
   - `--section-pad` between family sections.

### 10.2 Film page (`/fr/films/:slug`, `/en/films/:slug`)

1. Head (no rule, no `giant`): back link "← Films" (arrow link reversed);
   24 px; `h1` title in `display`, with the `lang` of its original language;
   16 px; data line in `label`: family, year, duration, roles, separated by
   record dots.
2. Lead image: **full-bleed**, 16:9, max-height `80svh`, treatment `cover`
   or `poster`; 32 px above. With video later: facade (7.5).
3. Pull quote (8.11) if the film has one: container, 64 px above and below
   (96 px lg).
4. Body. lg: left cols 1–7, right cols 9–12; below lg: stacked, 48 px
   apart.
   - Left: `h2` "Synopsis" as section label, then prose (`body`, first
     paragraph `lead`); 48 px; `h2` "Note d'intention" / "Director's
     statement" as section label, then prose.
   - Right: data list (8.12): Année, Durée, Genre, Pays, Langue(s), Format,
     Production, Avec le soutien de, Diffusion (only rows with content).
     Watch line or external button under it when relevant. In this narrow
     column the block button is 56 px high with its text in `nav` style, so
     its label stays on one or two lines.
5. Stills, if two or more: full container, 2 columns from md (16 px gap), 1
   at base; not links.
6. Selections and awards: section label; summary in `title` (e.g. "17
   sélections, 13 prix") if provided; list in 2 columns from md, `body`,
   1 px ink rules, awards in weight 700. More than 12: the rest in a native
   `<details>`.
7. Credits: section label; groups with `label` headings; rows role (`small`,
   muted) and name (`body`), 2 columns from md.
8. Press about this film: section label; press rows (8.10).
9. Previous / next: full-bleed, two halves side by side from md (stacked at
   base), surface **ink**, each a link: `label` "Film précédent" / "Film
   suivant" (muted-on-ink), 12 px, title in `title`, ground; padding 48 px
   (64 px lg); 1 px `--color-rule-on-ink` between halves. Hover: half turns
   accent with ink text. Order follows the index; wraps around.

Sections 4 to 8 are separated by `--section-pad` and a 2 px ink rule at the
top of each.

### 10.3 Press (`/fr/presse`, `/en/press`)

Page head: `h1` "Presse" / "Press". Then press rows (8.10), newest first,
grouped by year: each year is an `h2` in `display`, muted, 64 px above, 16 px
below, with a 2 px ink rule above the first row of the group.

### 10.4 About (`/fr/a-propos`, `/en/about`)

1. Head: `h1` "À propos" / "About" as section label; 24 px; the opening
   sentence (max 90 characters, three lines at lg) in `display`, cols 1–11 at lg. No rule.
2. 48 px (64 px lg). Portrait 4:5, `cover`: base full width; md cols 1–4;
   lg cols 1–5. Biography beside it (md cols 5–8, lg cols 7–12; under it at
   base, 32 px): first paragraph `lead`, rest `body`.
3. Career: section label "Parcours" / "Career"; data list (8.12), `dt` =
   period.
4. Collaborations: section label; logo grid (8.16) of all organisations;
   then, 64 px under it, a full-bleed ink section with the name wall (8.9)
   giving each collaborator's role. An optional credential badge (image from
   content, max 320 × 56 px, own colours and multiply as in 8.15, alt = its
   wording) may sit under the career list.
5. In development (only if items): section label "En développement" / "In
   development"; rows: title in `title`, format and status in `label` muted,
   optional sentence in `body`; 1 px ink rules.
6. Two block buttons side by side from md (stacked at base, 16 px): "Voir
   les films" / "View the films", "Contact".

Sections separated by `--section-pad`.

### 10.5 Contact (`/fr/contact`, `/en/contact`)

1. Page head: `h1` "Contact" in `giant`; 24 px; one sentence in `lead`.
2. 48 px. Email: section label "E-mail"; 12 px; address as a link,
   `font-size: clamp(1.25rem, 0.3rem + 4.2vw, 3.5rem)` (20 px at 360, 56 px
   from 1280), so the address stays on one line at 360 px, **not
   uppercase**, Wide 800, underline 3 px, offset 8 px,
   `overflow-wrap: anywhere`; hover: highlight.
3. 48 px. Three groups, each a section label then the value in `title`
   style: "Téléphone" / "Phone" (`tel:` link, international format; the only
   place the number appears; not rendered when empty), "Basée à" / "Based
   in", "Réseaux" / "Social" (text links, new tab). Base: stacked, 32 px
   apart. md and lg: three columns.
4. Optional secondary contact (content flag, off by default): section
   label from content, name and email in `body`.
5. Footer without its invitation line.

No form.

### 10.6 Legal pages

Routes: `/fr/mentions-legales`, `/en/legal-notice`, `/fr/confidentialite`,
`/en/privacy`. Linked from the footer and from each other; the privacy
policy also from the notice. Not in the navigation. `noindex`.

- Head: `h1` in `display`; 16 px; "Dernière mise à jour : {date}" / "Last
  updated: {date}" in `label`, muted (placeholder marker when empty);
  optional intro in `body`. 2 px ink rule.
- Body, 48 px under the head, cols 1–8 at lg, max `66ch`: sections in
  content order. Section heading: `h2` in `title` style at a fixed 20 px
  (22 px lg), 48 px above (none above the first), 12 px below, with an `id`.
  Paragraphs `body`, 16 px apart. Lists: disc, muted marker, padding-left
  20 px, 8 px between items. Order inside a section: paragraphs, list,
  `after` paragraphs, links (one text link per line). No inline code:
  technical names in the quotation marks of the language. Sections with
  `published: false` are not rendered.
- 48 px, 2 px ink rule, 24 px: one arrow link to the other legal page.

Section headings and draft copy: `legal-copy.md`.

### 10.7 Not found

Surface ground, `--section-pad` twice. `h1` "404" in `giant`; 16 px; "Cette
page n'existe pas." / "This page does not exist." in `lead`; 32 px; block
button "Retour à l'accueil" / "Back to home", max width 6 cols at lg.

---

## 11. Accessibility (WCAG 2.1 AA)

- `<html lang>` follows the page language; film titles and foreign-language
  text carry their own `lang`.
- Landmarks: `header`, labelled `nav`s, `main`, `footer`. One `h1` per page
  (home: the name).
- Route change: focus moves to the `h1` (`tabindex="-1"`, no outline on that
  programmatic focus only), title updates, scroll to top except for anchors.
  Not on first load.
- Keyboard: everything operable; visible focus (6.5); bands pause on focus.
- Moving content: bands are pausable by a visible control and stop under
  reduced motion (8.5).
- Text over the hero image only on the scrim (9.1). Check the name and role
  line against the darkest and lightest parts of the image: minimum 4.5:1
  for the role line and credit, 3:1 for the name.
- Colour pairs only as allowed in section 2. Never accent text on ground.
- Uppercase is CSS only, so screen readers read normal words.
- Hover never reveals information unavailable otherwise.
- Zoom to 200% and reflow at 320 px without loss or horizontal scroll.
- Targets 44 × 44 px. Alt text required in both languages (build warns).
- New-tab links say so. Reduced motion honoured (6.7).

---

## 12. SEO and sharing

| Page | `<title>` |
|---|---|
| Home | "Sara Grimaldi – Réalisatrice et scénariste" / "Sara Grimaldi – Director and screenwriter" |
| Films | "Films – Sara Grimaldi" |
| Film | "{Titre} ({année}) – Sara Grimaldi" |
| Press | "Presse – Sara Grimaldi" / "Press – Sara Grimaldi" |
| About | "À propos – Sara Grimaldi" / "About – Sara Grimaldi" |
| Contact | "Contact – Sara Grimaldi" |
| Legal notice | "Mentions légales – Sara Grimaldi" / "Legal notice – Sara Grimaldi" (`noindex`) |
| Privacy policy | "Confidentialité – Sara Grimaldi" / "Privacy – Sara Grimaldi" (`noindex`) |

Meta descriptions from content. Open Graph and Twitter card on every page
(`og:title`, `og:description`, `og:image` 1200 × 630 with `og:image:alt`,
`og:locale`, `og:type`). `hreflang` alternates (`fr`, `en`, `x-default` to
French) and canonical from one configurable base URL. Default Open Graph
image: a still from *Immunity*; tag omitted until the file exists.

Theme colour: `#2A2623`.

Favicon: the record dot. One SVG, exactly:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" fill="#2A2623"/>
  <circle cx="16" cy="16" r="8" fill="#D97A55"/>
</svg>
```

---

## 13. Content model

Unchanged from the built model except the additions marked **new**. Every
text field is bilingual.

- **Site:** name; role labels (list); statement; statement emphasis; intro;
  email; phone (Contact only; may be empty); location; socials; secondary
  contact (heading, name, email, `show`, default off); footer invitation;
  legal link labels; default meta description; default OG image; navigation
  labels; UI strings, including **new**: band pause and resume labels, film
  index number is generated (no field).
- **Home:** featured films (ordered list of references, up to 3). **New:**
  hero image (`src`, `width`, `height`, `alt`, `focus`, optional `caption`).
- **Image (everywhere an image is referenced). New fields:** `fit`
  (`cover` | `poster`, default `cover`) and `focus` (CSS `object-position`,
  default `50% 50%`).
- **Film:** slug; title; title language; family (`fiction` | `documentaire`
  | `impact`); year; duration; roles; logline; synopsis; statement;
  statement quote; proof line; data rows; credits groups; selections;
  selections summary; `watch` (mode, provider, id, external label and URL);
  lead image; stills; poster; `published`; order.
- **Press item:** publication; description; year; country; article language;
  URL or scan; related film. The `press` band lists unique publication names
  in press order.
- **Organisation (new, replaces Collaboration):** name; optional logo
  (`src`, `width`, `height`, optional `scale`); kind (`client` | `press`);
  optional role and description (shown in the name wall); order; `home`
  flag. Alt text is the name. Press items refer to their organisation.
- **In-development item:** title; format and status; description.
- **About:** opening sentence; biography (paragraphs); portrait; career
  rows.
- **Privacy notice:** `enabled`; `version`; `text`; `linkLabel`;
  `dismissLabel`; `regionLabel`.
- **Legal page:** title; meta description; `updated`; intro; sections (`id`,
  heading, paragraphs, list, `after`, links, `published`); cross-link label.

Per-film values live in the content files, not here.

---

## 14. Dependencies and defaults

No dependency is required: no UI framework, icon set, animation or carousel
library, video SDK or font package. Glyphs used as text: `→ ← ↗`. Dots,
pause and play icons are CSS shapes.

| When this is missing | Use |
|---|---|
| Final wording | Draft copy, marked as draft in content |
| A clean frame for a film | Its poster, `fit: poster` |
| A cleared logo for an organisation | Its name in type (8.15) |
| The hero image | An ink field; the name and band still fill the screen |
| A film's watch link | Mode `none` |
| Default Open Graph image | No `og:image` tag |
| Phone number | Fictional placeholder, or empty (not rendered) |
| Any legal fact | A visible placeholder marker; never an invented value |
| Optional blocks | Not rendered |

---

## 15. Build order

1. Tokens, fonts, shell (header, menu, footer), band.
2. Home page.
3. Films index, film page.
4. Press, About, Contact, legal pages, 404, privacy notice restyle.

## Change log

- 2.4 (2026-11-14): client logos in their own colours, not grayscale; the
  About badge follows (8.15, 10.4); last cell spans two columns at base when
  the count is odd (8.16).
- 2.3 (2026-11-14), after the full v2 build: `display` starts at 26 px so
  single long words fit at 360 px (3.2); wordmark fixed at 14 px at base
  (8.2); logo grid in 2 columns at base, logos before names, 16 px cell
  margin, exactly 15 on home (8.15, 8.16, 9.3); name wall role placement
  (8.9); About opening sentence max 90 characters (10.4); Contact email size
  (10.5); external button in the film page column (10.2).
- 2.2 (2026-11-14), after the first v2 build: hero is the showreel poster
  frame (7.3); statement back on ground, collaborations continue its field
  (9.2, 9.3); footer bottom row order (8.13); film tile caption rule (8.8);
  hero max height 1000 px (9.1).
- 2.1 (2026-11-14): logos for collaborators and press (8.15, 8.16, 8.5,
  8.10, 9.3, 10.4, 13); statement and films sections on ink (9.2, 9.4); hero
  image changed and rule for frames with lettering (7.3).
- 2.0 (2026-11-14): complete visual redesign (colour, type, imagery, shell,
  band, all page layouts). Routes, content model, legal pages, privacy
  notice behaviour and accessibility rules carried over from 1.6.
- 1.0 to 1.6 (2026-11-14): first direction, superseded.
