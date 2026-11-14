# Design system: Sara Grimaldi website

Direction: **B, "Carnet de réalisatrice"**. Version 1.6, 2026-11-14.
Owner: designer. This file is the single source of truth for the build. If
something is not specified here, ask the designer rather than guessing.

This document is self-sufficient. The design brief behind it is an internal
working document and is not part of the repository. Draft legal copy is in
`legal-copy.md` in this folder.

Contents: 1 Principles, 2 Colour, 3 Typography, 4 Spacing and grid,
5 Breakpoints, 6 Shape, borders, motion, 7 Images and video, 8 Components,
9 Page layouts, 10 Accessibility, 11 SEO, 12 Content model implied by the
design, 13 Dependencies, 14 Defaults for missing content.

---

## 1. Principles

1. **Clear and professional structure first.** One column of reading, obvious
   hierarchy, no decorative layout.
2. **Her words lead.** The home page opens on a statement set as text, not on
   an image. Film pages open on a quote from her director statement.
3. **Warm paper, ink, one accent.** No gradients, no shadows, no second accent.
4. **Stills are generous but never full-bleed**: they sit in the page like
   plates in a printed catalogue.
5. **Names in type, never logo files**, for clients, broadcasters and press.
6. **Quiet motion.** Nothing moves unless the user acts.

No UI framework. Everything here is achievable with plain SCSS, CSS grid and
CSS custom properties.

---

## 2. Colour

### 2.1 Tokens

| Token | Value | Use |
|---|---|---|
| `--color-paper` | `#F6F1E8` | Page background |
| `--color-surface` | `#EAE2D3` | Alternate band background, image placeholder |
| `--color-ink` | `#1C1A17` | Text, headings, dark band background, focus ring on light |
| `--color-muted` | `#5E574D` | Secondary text, labels, captions |
| `--color-accent` | `#A23E1F` | Links, active states, quote rule, primary button background |
| `--color-accent-hover` | `#7F2F16` | Hover and active state of accent links and primary button |
| `--color-rule` | `#CFC5B3` | Decorative hairlines between rows and sections |
| `--color-border` | `#8A8171` | Borders that identify a control (secondary button, play button ring) |
| `--color-on-accent` | `#FFFFFF` | Text on accent background |
| `--color-dark-text` | `#F6F1E8` | Text on ink background |
| `--color-dark-muted` | `#B8AFA1` | Secondary text on ink background |
| `--color-dark-accent` | `#E9A083` | Links and hover on ink background |
| `--color-dark-rule` | `#3A362F` | Hairlines on ink background |

### 2.2 Contrast (WCAG 2.1 relative luminance, calculated)

| Foreground | Background | Ratio | Passes |
|---|---|---|---|
| ink | paper | 15.4:1 | AA and AAA text |
| ink | surface | 13.5:1 | AA and AAA text |
| muted | paper | 6.3:1 | AA text |
| muted | surface | 5.5:1 | AA text |
| accent | paper | 5.7:1 | AA text |
| accent | surface | 5.0:1 | AA text |
| on-accent | accent | 6.5:1 | AA text |
| border | paper | 3.4:1 | AA non-text (3:1) |
| dark-text | ink | 15.4:1 | AA and AAA text |
| dark-muted | ink | 8.0:1 | AA text |
| dark-accent | ink | 8.1:1 | AA text |

Rules:
- `--color-rule` is decorative only (1.6:1). Never use it for text or as the
  only boundary of a control.
- `--color-accent-hover` is darker than accent, so it passes wherever accent
  passes.
- Never place text directly on a photograph. Captions go under images.
- The developer should re-check these pairs with an automated tool at review.

### 2.3 Where the dark band is used

Only the site footer (section 8.5) uses the ink background. Nothing else.

---

## 3. Typography

### 3.1 Families (both SIL Open Font License 1.1)

| Role | Family | Format | Axes used |
|---|---|---|---|
| Display, quotes, film titles | **Fraunces** (variable) | woff2, roman + italic | `wght` 400 to 600, `opsz` automatic. Set `font-variation-settings: "SOFT" 0, "WONK" 0` |
| Text, labels, UI | **Inter** (variable) | woff2, roman only | `wght` 400 to 600 |

- Self-host the woff2 files in the app assets (downloaded from the official
  open-source releases). No font CDN at runtime, no npm font package.
- Subset: Latin (must include `é è ê ë à â ç î ï ô ù û œ Œ « » ’ –` and
  Italian accents `ì ò`). Three files in total: Fraunces roman, Fraunces
  italic, Inter roman.
- `font-display: swap`. Preload all three files. Fraunces italic is used
  above the fold in the largest text of the home page (the emphasised phrase
  of the `h1`) and of every film page (the title), so leaving it out causes a
  visible font swap in the main heading. The app has a single HTML document,
  so the preload cannot be limited to those pages.
- Fallback stacks:
  - `--font-display: "Fraunces", "Iowan Old Style", "Palatino Linotype", Georgia, serif;`
  - `--font-text: "Inter", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif;`
- `font-optical-sizing: auto` on everything set in Fraunces.
- Never use Inter italic (not loaded). Emphasis in body text uses weight 600.

### 3.2 Scale

Root font size 100% (16 px). Sizes scale fluidly between a 360 px and a
1280 px viewport and are fixed beyond those bounds.

| Token | Family, weight, style | Size at 360 | Size at 1280 | CSS `font-size` | Line height | Letter spacing |
|---|---|---|---|---|---|---|
| `display-xl` | Fraunces 400 | 40 px | 72 px | `clamp(2.5rem, 1.717rem + 3.478vw, 4.5rem)` | 1.08 | -0.02em |
| `display-l` | Fraunces 400 | 34 px | 56 px | `clamp(2.125rem, 1.587rem + 2.391vw, 3.5rem)` | 1.1 | -0.015em |
| `h2` | Fraunces 500 | 26 px | 36 px | `clamp(1.625rem, 1.380rem + 1.087vw, 2.25rem)` | 1.2 | -0.01em |
| `h3` | Fraunces 500 | 21 px | 24 px | `clamp(1.3125rem, 1.239rem + 0.326vw, 1.5rem)` | 1.3 | 0 |
| `quote` | Fraunces 400 italic | 24 px | 34 px | `clamp(1.5rem, 1.255rem + 1.087vw, 2.125rem)` | 1.3 | -0.005em |
| `lead` | Inter 400 | 19 px | 22 px | `clamp(1.1875rem, 1.114rem + 0.326vw, 1.375rem)` | 1.5 | 0 |
| `body` | Inter 400 | 17 px | 18 px (from 768) | `1.0625rem`, `1.125rem` from 768 | 1.6 | 0 |
| `small` | Inter 400 | 15 px | 15 px | `0.9375rem` | 1.5 | 0 |
| `label` | Inter 500, uppercase | 13 px | 13 px | `0.8125rem` | 1.4 | 0.08em |
| `nav` | Inter 500 | 16 px | 16 px | `1rem` | 1.25 | 0 |

Rules:
- **Film titles are always Fraunces italic**, at whatever size they appear
  (cards: `h3` italic 400; film page: `display-l` italic 400; inline in body
  text: Fraunces italic at the surrounding size).
- **Inline marking in content text.** Prose fields are plain strings (one
  string per paragraph), not Markdown. One convention only: text between two
  asterisks, `*Immunity*`, is a film or work title and is rendered as
  `<cite>` in Fraunces italic 400 at the surrounding size and colour
  (`font-style: italic` comes from the italic font file). No nesting, no
  other syntax, an unpaired asterisk is printed as is. This needs a
  few-line split function, not a parser or a dependency; build the output
  as text and elements, never by injecting the string as HTML. It applies to
  every prose field: biography, synopsis, statement, press descriptions,
  collaboration descriptions, career rows. The convention is valid Markdown
  emphasis, so it stays compatible with a Git-based CMS later.
- **Placeholder marking.** A fact that is not yet known is written in the
  content as a bracketed marker starting with `[à compléter` (French) or
  `[to be completed` (English), e.g. `[à compléter : adresse
  professionnelle]`. Wherever prose is rendered, such a segment (from the
  opening bracket to the next closing bracket) is wrapped in `<mark>` styled
  with background `--color-surface`, text ink, padding 0 4 px, no radius
  (ink on surface is 13.5:1). The same split function handles it. Nobody must
  be able to mistake a placeholder for real information; the build should
  warn while any marker remains in the content.
- Body text measure: maximum `68ch`.
- Paragraph spacing: `--space-4` (16 px) between paragraphs.
- Headings: `text-wrap: balance`. Body: `text-wrap: pretty`.
- Use real typographic characters: `’`, `« »` with non-breaking spaces in
  French, `“ ”` in English, `·` as separator in metadata lines, `–` for
  ranges. These live in the content files.
- Numbers in metadata lines: `font-variant-numeric: tabular-nums`.
- Semantic heading order is independent of the visual token: one `h1` per
  page, no skipped levels.

---

## 4. Spacing and grid

### 4.1 Spacing scale

| Token | px | rem |
|---|---|---|
| `--space-1` | 4 | 0.25 |
| `--space-2` | 8 | 0.5 |
| `--space-3` | 12 | 0.75 |
| `--space-4` | 16 | 1 |
| `--space-5` | 24 | 1.5 |
| `--space-6` | 32 | 2 |
| `--space-7` | 48 | 3 |
| `--space-8` | 64 | 4 |
| `--space-9` | 96 | 6 |
| `--space-10` | 128 | 8 |

Only these values are used for margins, padding and gaps.

### 4.2 Grid

| | Base (below 768) | md (768 to 1279) | lg (1280 and above) |
|---|---|---|---|
| Columns | 4 | 8 | 12 |
| Gutter | 16 px | 24 px | 32 px |
| Side margin | 20 px | 40 px | 64 px |
| Container max width | none | none | 1152 px content (1280 px including margins), centred |

Column positions in section 9 are written "cols 1–7" meaning grid lines 1 to
8 (`grid-column: 1 / 8`).

### 4.3 Vertical rhythm

| Token | Base | md | lg |
|---|---|---|---|
| `--section-gap` (between page sections) | 64 px | 96 px | 128 px |
| `--block-gap` (between blocks inside a section) | 32 px | 48 px | 48 px |
| Page top padding under header | 32 px | 48 px | 64 px |

---

## 5. Breakpoints

| Name | Media query | Designed and checked at |
|---|---|---|
| base | none (mobile first) | 360 px |
| `md` | `(min-width: 48rem)` | 768 px |
| `lg` | `(min-width: 80rem)` | 1280 px |

No other breakpoints. Between them, layouts are fluid. The site must not
scroll horizontally at 320 px.

---

## 6. Shape, borders, motion

- **Radius:** `0` everywhere (images, buttons, cards). Printed-matter feel.
- **Hairline:** 1 px solid `--color-rule`.
- **Shadows:** none.
- **Focus:** `outline: 2px solid var(--color-ink); outline-offset: 3px;` on
  `:focus-visible` for every interactive element. On the ink background the
  outline colour is `--color-dark-text`. Never remove outlines.
- **Minimum target size:** 44 × 44 px for every link or button that is not
  inside a paragraph.
- **Transitions:** `200ms ease-out` on `color`, `background-color`,
  `border-color`, `text-decoration-color`, `opacity`. Nothing else animates.
- **Image hover (cards):** image `opacity` 1 to 0.88. No zoom, no movement.
- **Page transitions, scroll-triggered animation, parallax, marquee:** none.
- **`prefers-reduced-motion: reduce`:** all transitions set to `0ms`;
  `scroll-behavior: auto`.
- **Scrolling:** `scroll-behavior: smooth` for in-page anchors only when
  motion is allowed. `scroll-margin-top: 96px` on anchor targets.

---

## 7. Images and video

### 7.1 Ratios

| Use | Ratio | Notes |
|---|---|---|
| Film still (cards, features, film page lead) | 16:9 | `object-fit: cover` |
| Film gallery stills | 16:9 | Same |
| Portrait of Sara (About) | 4:5 | |
| Poster (optional, film page aside) | 2:3 | |
| Press scan (optional) | free, max height 80vh | `object-fit: contain` |
| Open Graph image | 1200 × 630 | One default, plus one per film |

Always set `width` and `height` attributes (or `aspect-ratio`) so nothing
shifts on load. Placeholder background while loading: `--color-surface`.

### 7.2 Delivery

- Format: WebP, quality about 78, with widths **480, 768, 1152, 1600** px
  exported for each still (portrait: 480, 768, 960).
- `srcset` with those widths and these `sizes`:
  - Full-container image: `(min-width: 80rem) 1152px, calc(100vw - 40px)`
  - Feature image (7 of 12 cols): `(min-width: 80rem) 659px, (min-width: 48rem) calc(100vw - 80px), calc(100vw - 40px)`
  - Card in 2 columns: `(min-width: 80rem) 560px, (min-width: 48rem) calc(50vw - 52px), calc(100vw - 40px)`
- `loading="lazy"` and `decoding="async"` on every image except the lead
  image of a film page, which is `loading="eager"` with
  `fetchpriority="high"`.
- The home page has no image above the fold: its largest first paint is text.
- Every image has alt text in both languages in the content files. Purely
  decorative images do not exist in this design.

### 7.3 Video (no library)

A **click-to-load facade**: the page shows the still with a play button; the
provider iframe is inserted only after the user activates it. No third-party
request is made before that.

- Vimeo: `https://player.vimeo.com/video/{id}?dnt=1&autoplay=1`
- YouTube: `https://www.youtube-nocookie.com/embed/{id}?autoplay=1`
- iframe: `title` set to "{film title} – {Bande-annonce | Film}", `allow="autoplay; fullscreen; picture-in-picture"`, 16:9.

Watch modes per film (content field `watch.mode`):

| Mode | Shown on film page |
|---|---|
| `full` | Facade, label "Voir le film" / "Watch the film" |
| `trailer` | Facade, label "Voir la bande-annonce" / "Watch the trailer" |
| `external` | Still without play button, plus a button linking out (e.g. "Voir en VOD sur OpenDDB") |
| `none` | Still only. Under it, `small` muted: "Film disponible sur demande" / "Available on request" linking to Contact |

A film can combine `trailer` with an external link (Immunity: trailer plus
OpenDDB).

---

## 8. Components

Each component lists structure, exact styling and all states. "Label",
"body" and so on refer to the type tokens of section 3.2.

### 8.1 Skip link

First focusable element. Text: "Aller au contenu" / "Skip to content".
Hidden off-screen until focused; on focus: fixed at top 8 px, left 8 px,
background ink, text dark-text, `small` 500, padding 12 px 16 px. Targets
`<main id="contenu">`.

### 8.2 Header

- Not sticky. Background paper. Bottom hairline `--color-rule`.
- Height: 64 px base, 80 px from md. Content aligned to the grid container.
- **Left:** wordmark "Sara Grimaldi", Fraunces 500, 20 px base and 22 px from
  md, colour ink, no underline, links to home in the current language.
  `aria-label` "Sara Grimaldi – Accueil / Home".
- **Right, from lg:** nav links in `nav` style, gap 32 px, in this order:
  Films, Presse, À propos, Contact (EN: Films, Press, About, Contact), then a
  1 px × 16 px vertical rule `--color-rule` with 24 px either side, then the
  language switcher.
- **Right, below lg:** language switcher, then 16 px gap, then the Menu
  button.

Nav link states:

| State | Style |
|---|---|
| Default | ink, no underline |
| Hover | accent, underline 1 px, offset 6 px |
| Focus-visible | standard focus ring |
| Current page (`aria-current="page"`) | ink, underline 1 px `--color-accent`, offset 6 px |

On a film detail page, "Films" is the current item.

### 8.3 Language switcher

- Two items, "FR" and "EN", `label` style, separated by a `/` in muted.
- The current language is plain text in ink with `aria-current="true"`; the
  other is a link in muted (hover: accent, underline) pointing to the same
  page in the other language, with `lang` and `hreflang` attributes.
- Accessible name (WCAG 2.5.3 Label in Name): no `aria-label`. The link
  contains the visible text followed by visually hidden text, so its name
  starts with what is on screen: "EN" + hidden " – English version", or "FR"
  + hidden " – version française". The current-language item likewise has
  hidden text: " – langue actuelle" / " – current language".
- Wrapped in `<nav aria-label="Langue / Language">`.
- Each item has a 44 px tall hit area.

### 8.4 Mobile menu (below lg)

- **Menu button:** text button "Menu" in `label` style, ink, 44 px tall,
  padding 0 4 px, `aria-expanded`, `aria-controls`. When open the label
  becomes "Fermer" / "Close".
- **Panel:** full-viewport overlay, background paper, `role="dialog"`,
  `aria-modal="true"`, `aria-label` "Menu". The header row (wordmark, switcher,
  Fermer) stays at the top of the panel.
- **Links:** the four nav items stacked, `display-l` (Fraunces 400), ink,
  each row 64 px minimum height, separated by hairlines, left-aligned at the
  side margin, starting 32 px under the header row.
- **Footer of panel:** email in `body`, with a muted label above it, pinned
  32 px from the bottom. No phone number.
- **Implementation:** a native `<dialog>` opened with `showModal()`, which
  provides the focus trap, `Esc` and focus return. Two things the browser
  does not guarantee and that must be handled: the Fermer button is the
  initially focused element (`autofocus`), and page scroll is locked while
  open (`overflow: hidden` on the root). The dialog's default padding, border,
  max-width and max-height are reset so it fills the viewport, and its
  `::backdrop` is transparent.
- **Behaviour:** opening moves focus to the Fermer button; focus is trapped
  in the panel; `Esc` closes; closing returns focus to the Menu button; body
  scroll is locked while open; choosing a link closes the panel.
- Open/close: opacity 0 to 1 in 200 ms; instant under reduced motion.

### 8.5 Footer (the only dark band)

Background ink, text dark-text. Padding: 64 px top and 32 px bottom (base),
96 px and 48 px (lg).

Content, in order:
1. `label` in dark-muted: "Contact".
2. Invitation line, `display-l`, dark-text (draft copy: "Un projet, une
   idée ? Parlons-en." / "A project, an idea? Let's talk.").
3. Email as a link, `h2` size in Fraunces 400, dark-text with 1 px underline
   in dark-accent, offset 8 px. Hover: text dark-accent.
4. Hairline `--color-dark-rule`, 48 px above and 24 px below.
5. Bottom row, `small`, three groups:
   - Copyright, dark-muted: "© {year} Sara Grimaldi".
   - Legal links, in a `<nav aria-label="Informations légales / Legal
     information">`: "Mentions légales" and "Confidentialité" (EN "Legal
     notice" and "Privacy"), dark-text, underline on hover (hover colour
     dark-accent), gap 24 px, internal links in the current language.
   - Social links as **text** ("Instagram", "Vimeo"), dark-text, underline on
     hover, gap 24 px, each opening in a new tab with
     `rel="noopener noreferrer"` and visually hidden text "(nouvelle
     fenêtre)" / "(new window)".
   Every link in this row has a 44 px tall hit area.

The phone number does not appear in the footer; it is on the Contact page
only (9.6).

Gaps: label to invitation 16 px; invitation to the email 32 px at base and
48 px at md, where they are stacked.

Layout: base and md, everything stacked and left-aligned; in the bottom row
the order is social links, legal links, copyright, 8 px apart. lg: items 1
to 2 in cols 1–7, the email in cols 8–12, aligned to the top of item 2; the
bottom row spans 12 columns as one line: copyright at the left, then legal
links 48 px after it, and social links pushed to the right edge.

The footer is identical on every page. On the Contact page the invitation
line (item 2) is omitted to avoid repetition.

### 8.6 Text link (inside running text)

| State | Style |
|---|---|
| Default | accent, underline 1 px, offset 3 px |
| Hover | accent-hover, underline 2 px |
| Focus-visible | standard focus ring |
| Visited | same as default |

External links in body text open in the same tab. External links in lists of
references (press, socials, watch links) open in a new tab and carry a
trailing `↗` (`aria-hidden`) plus the visually hidden "(nouvelle fenêtre)".

### 8.7 Arrow link (calls to action that navigate)

Text in `nav` style (Inter 500, 16 px) followed by ` →`. Ink, with a 1 px
underline in accent, offset 6 px. Minimum height 44 px.

| State | Style |
|---|---|
| Default | ink text, accent underline |
| Hover | accent text; the arrow shifts 4 px right (no shift under reduced motion) |
| Focus-visible | standard focus ring |

Used for: "Voir le film", "Tous les films", "Toute la presse", "En savoir
plus".

### 8.8 Buttons

Height 48 px, padding 0 24 px, `nav` type style, radius 0, inline-flex,
centred.

| Variant | Default | Hover | Active | Focus-visible | Disabled |
|---|---|---|---|---|---|
| Primary | bg accent, text on-accent | bg accent-hover | bg accent-hover | standard ring | not used |
| Secondary | bg transparent, 1 px border `--color-border`, text ink | border ink, text accent | same as hover | standard ring | not used |

Primary is used at most once per page (the main watch or contact action).
There are no disabled buttons on this site.

### 8.9 Section label

`label` style, muted, with no dash, bullet or other mark before it. Margin
bottom 16 px. When it titles a section it is the section's
heading element (`h2`) styled as a label, unless a visible `h2` follows.

### 8.10 Family list (home hero)

A list of three links, one per family, each row:

- Left: family name in `h3` (Fraunces 500), ink.
- Right: film count in `label`, muted, e.g. "2 films" / "1 film".
- Row height 56 px minimum, hairline above each row and below the last.
- Whole row is the link, to `/{lang}/films#{family}`.

| State | Style |
|---|---|
| Hover | name in accent; count unchanged |
| Focus-visible | standard ring around the row |

Counts are computed from published films. A family with zero published films
is not shown.

### 8.11 Family navigation (films index)

A horizontal list of anchor links to the three family sections on the same
page: "Fiction", "Documentaire", "Campagnes à impact" (EN "Fiction",
"Documentary", "Impact campaigns"), `nav` style, gap 24 px, each 44 px tall,
wrapped in `<nav aria-label="Familles de films / Film families">`. Hairline
above and below the row; row padding 8 px vertical. If the row overflows at
360 px it wraps to a second line (no horizontal scrolling).

States: as header nav links, without a "current" state (these are in-page
anchors, not filters). No JavaScript state.

### 8.12 Film card (films index)

Structure, top to bottom, whole card is one link to the film page (the link
wraps the image and the title; the meta line is outside the link):

1. Still, 16:9.
2. 16 px gap.
3. Title: `h3` size, Fraunces italic 400, ink.
4. 4 px gap.
5. Meta line: `small`, muted: `{year} · {duration} · {role}`, e.g.
   "2024 · 9 min · Réalisation, scénario".
6. Optional proof line, 8 px above it: `small`, ink, e.g. "17 sélections,
   13 prix".

| State | Style |
|---|---|
| Hover | image opacity 0.88; title in accent |
| Focus-visible | standard ring around image and title |

### 8.13 Film feature (home)

A larger presentation of a featured film.

- Image: still 16:9, links to the film page (`aria-hidden` link duplicate is
  not allowed: the image link has `tabindex="-1"` and the title link is the
  accessible one).
- Text block, in order: section label showing the family name; title `h2`
  size in Fraunces italic 400; meta line (`small`, muted); pull quote from the
  director statement (`h3` size, Fraunces italic 400, ink, max 180
  characters, in quotation marks of the language); optional proof line
  (`small`, ink); arrow link "Voir le film" / "View the film".
- Gaps inside the text block: 12 px after label, 8 px after title, 24 px
  after meta, 16 px after quote, 24 px before the arrow link.

Layout:
- base and md: image, 24 px gap, text block. Stacked, full container width.
- lg: two columns, vertically centred. Odd features: image cols 1–7, text
  cols 9–12. Even features: text cols 1–4, image cols 6–12.

States: image hover opacity 0.88; arrow link states per 8.7.

### 8.14 Pull quote (film page)

`<blockquote>` with a 2 px left border in accent, padding-left 24 px (base)
and 32 px (lg). Text in `quote` style, ink, with quotation marks of the
language. Attribution under it, 12 px gap, `label`, muted: "Sara Grimaldi".
Maximum width: cols 1–10 at lg.

### 8.15 Data line (film page, under the title)

One line, wrapping allowed, `label` style, muted, items separated by ` · `:
family, year, duration, role. Example: "DOCUMENTAIRE · 2020 · 52 MIN ·
RÉALISATION, SCÉNARIO, IMAGE".

### 8.16 Data table (film page aside)

A `<dl>`. Each pair is a row with a hairline above (and below the last row),
padding 12 px vertical.

- `<dt>`: `label`, muted.
- `<dd>`: `small`, ink.
- Base and md: `dt` above `dd`, 4 px gap. Rows in 2 columns from md
  (gap 24 px).
- lg (in the aside, cols 9–12): `dt` above `dd`, single column.

Rows, shown only when the content exists, in this order: Année, Durée,
Genre, Pays, Langue(s), Format, Production, Avec le soutien de, Diffusion.

### 8.17 Credits list

Heading `h2` ("Générique" / "Credits"). Then one or more groups, each with an
`h3` in `label` style, muted ("Équipe", "Distribution", "Équipe technique").
Each credit is a row: role in `small` muted, name in `small` ink.

- Base: role above name, 2 px gap, 12 px between credits.
- md and lg: two-column grid inside the list, role left (40%) and name right
  (60%) on one line, 8 px between rows; at lg the whole list flows in 2
  columns with a 32 px gap.

### 8.18 Selections and awards list

Heading `h2` ("Sélections et prix" / "Selections and awards"). Summary line
directly under it in `lead`, ink, e.g. "17 sélections, 13 prix". Then a
`<ul>` without bullets: each item `small`, ink, festival name, then ` · `
and country or year in muted; if there is an award, it follows on the same
item in Inter 600: " — Mention d'honneur". Hairline between items, 10 px
vertical padding. From md the list flows in 2 columns, gap 32 px. If more
than 12 items, items beyond the 12th sit in a native `<details>` with summary
"Voir toutes les sélections ({n})" / "Show all selections ({n})" styled as an
arrow link without the arrow.

### 8.19 Video facade

- Container 16:9, still as background image element, `--color-surface`
  placeholder.
- A real `<button>` covering the container, with `aria-label` equal to the
  watch label plus the film title.
- Play control centred: circle 72 px (base) or 96 px (lg), background paper,
  1 px border `--color-border`, containing a solid ink triangle 20 px (base)
  or 26 px (lg), optically centred (2 px to the right).
- Under the container, 12 px gap: watch label in `label`, muted, plus
  duration if known.

| State | Style |
|---|---|
| Hover | circle background accent, triangle on-accent, border accent |
| Focus-visible | standard ring on the whole container (offset -6 px so it stays visible) |
| Activated | still and button replaced by the iframe; focus moves to the iframe |

### 8.20 Press row

A row in a list, hairline between rows, padding 20 px vertical.

- Line 1: publication name, `h3` (Fraunces 500), ink.
- Line 2: description, `body`, ink (e.g. "Article sur le documentaire
  *Immunity*", film title in Fraunces italic). Nothing is appended to it.
- Line 3 (meta): `label`, muted, `white-space: nowrap`: `{year} · {country}`,
  e.g. "2024 · FRANCE". When the article is in a language other than the
  page's, its two-letter code is added as a third item: "2019 · ITALIE · IT"
  on a French page, "2025 · FRANCE · FR" on an English page. The code is
  followed by visually hidden text in the page language (" – article en
  italien" / " – article in French"). When the article language matches the
  page language, no code is shown. The language is data in the meta column,
  not a phrase repeated at the end of each description.
- Whole row links to the external article (new tab, `↗`) or to the scan
  image. A row with neither link is plain text.

Layout at lg: publication in cols 1–4, description in cols 5–9, meta in
cols 10–12 right-aligned (264 px, enough for the longest case,
"2015 · SWITZERLAND · FR", on one line). The three cells are aligned on their
first baseline (`align-items: baseline`); a publication name or description
may wrap to a second line, the meta never does. Base and md: stacked, 4 px
gaps.

| State | Style |
|---|---|
| Hover (linked rows) | publication name in accent |
| Focus-visible | standard ring around the row |

### 8.21 Collaboration list

Two forms.

- **Compact (home):** a single paragraph of names in `h3` size, Fraunces
  400, ink, separated by ` · `, wrapping freely, max width cols 1–10 at lg.
  Marked up as a `<ul>` displayed inline.
- **Detailed (About):** rows like the data table: name in `h3` (Fraunces
  500) on the left (cols 1–4 at lg), role and description in `body` on the
  right (cols 5–12), hairline between rows, 16 px vertical padding. Stacked
  below lg.

### 8.22 In-development item

Row: title in `h3` Fraunces italic 400; next line `small` muted: format and
status (e.g. "Long métrage · scénario" / "Feature · screenplay"); optional
one-sentence description in `body`. Hairline between items, 16 px vertical
padding. No links.

### 8.23 Prose block

Used for synopsis, statement, biography. `body` style, max width `68ch`.
First paragraph of a biography or synopsis may be set in `lead`. Headings
inside prose: `h2` with 48 px above and 16 px below.

### 8.24 Previous / next film (film page end)

Two links in a row, hairline above, padding 32 px vertical. Each: `label`
muted ("Film précédent" / "Film suivant"), then the title in `h3` Fraunces
italic. Previous is left-aligned, next is right-aligned. Order follows the
films index order; first and last wrap around. Base: stacked, both
left-aligned, 24 px apart. Hover: title in accent.

### 8.25 Not found

Centred in the container, padding 96 px vertical. `label` muted "404";
`display-l` "Cette page n'existe pas." / "This page does not exist."; arrow
link "Retour à l'accueil" / "Back to home".

### 8.26 Privacy notice (the "cookie banner")

What it is today: an honest information notice, not a consent request. The
site sets no cookies, uses no analytics and makes no third-party requests, so
there is nothing to consent to. The notice says so, links to the privacy
policy and can be closed.

**Content (all from the content files, both languages):** `enabled`
(boolean, the single on/off switch), `version` (string), `text`, `linkLabel`,
`dismissLabel`, `regionLabel`. Draft copy:

- FR: "Ce site n'utilise ni cookies ni outil de suivi." Link:
  "Confidentialité". Button: "J'ai compris". Region label: "Cookies et
  confidentialité".
- EN: "This site uses no cookies and no tracking tools." Link: "Privacy".
  Button: "Got it". Region label: "Cookies and privacy".

One sentence only. The fact that closing the notice is remembered in the
browser is explained in the privacy policy (section "Cookies et stockage
local"), which the link opens; it is not repeated in the notice.

The text must stay true: if the site ever sets a cookie or loads a third
party without a click, the text and `version` change in the same commit.

**Structure:** `<aside aria-label="{regionLabel}">` containing one paragraph,
one text link (8.6) to the privacy policy page in the current language, and
one secondary button (8.8). Not a dialog: no `role="dialog"`, no
`aria-modal`, no focus trap, no focus moved to it on appearance, no
`aria-live`, no backdrop, page scroll and interaction unaffected.

**DOM position:** directly after the skip link and before the header, so
keyboard and screen-reader users meet it early and the skip link still comes
first. Its visual position is independent of this.

**Visual position:** `position: fixed`, bottom of the viewport. Base: 12 px
from the left, right and bottom edges. md and lg: bottom-left, 24 px from the
left and bottom edges, width 420 px. It never touches the top of the
viewport, so it cannot cover the skip link, the header or the navigation.
Above page content in stacking order; the mobile menu dialog (top layer)
covers it.

**Style:** background paper, 1 px solid border ink, radius 0, no shadow,
padding 16 px (base) or 20 px (md and lg). Text `small`, ink (15.4:1). Link
in accent (5.7:1), underlined. Below the text, 12 px gap, a row with the link
at the left and the button at the right (wraps at narrow widths, 12 px gap).
The button is the secondary button with height 44 px in this component.
Limits, checked at 360 px in both languages: the notice is at most 160 px
tall, the text at most two lines, and the link and button sit on one row
(304 px inner width). Copy that breaks these limits must be shortened, not
the limits raised.

**So that it hides nothing from keyboard users** (focus not obscured): while
the notice is visible, the root element gets `scroll-padding-bottom` equal to
the notice height plus 24 px, and the footer gets the same value as extra
bottom padding so its last row can be scrolled clear of the notice.

**States:**

| State | Behaviour |
|---|---|
| Hidden by switch | `enabled` false: the component is not rendered at all and nothing is read from or written to storage |
| Visible | Rendered once the stored value has been read and does not match `version` |
| Dismissed | Removed from the DOM; `version` is stored; if focus was inside the notice it moves to the page `h1`; the extra scroll and footer padding are removed |
| Button hover, focus | As secondary button (8.8); standard focus ring |
| Link hover, focus | As text link (8.6) |

**Remembering dismissal:** `localStorage`, key `sg-privacy-notice`, value =
the `version` string. Nothing else is stored: no identifier, no date. When
`version` changes in content, the notice is shown again to everyone. If
storage is unavailable or throws (private browsing, blocked storage), the
dismissal is kept in memory for the current visit only and no error is
shown. This single entry is a strictly necessary preference and is disclosed
in the privacy policy (legal-copy.md, section "Cookies et stockage local").

**No flash:** the notice is rendered only in the browser, after the stored
value has been read. It must not appear and then vanish for returning
visitors, and it is not part of any prerendered HTML.

**Motion:** it appears and disappears without animation.

**Print:** hidden.

**Without JavaScript:** the pages are prerendered and fully readable without
JavaScript. The notice is not shown in that case, which is acceptable: a
page without JavaScript stores nothing, and the privacy policy stays
reachable from the footer. The only document that shows nothing without
JavaScript is the deep-link fallback (`404.html`); it alone carries a
`<noscript>` block with: the name "Sara Grimaldi", one sentence saying this
page needs JavaScript to be displayed (both languages), a link to the home
page, and the contact email as a `mailto:` link. Styled inline: paper
background, ink text, system serif, 20 px padding. No `<noscript>` message
on the prerendered pages, where the sentence would be false.

**When video embeds arrive:** the embeds are click-to-load (7.3), so the
recommended consent point is the video itself: a line under the facade
stating that playing the video loads the provider's player, which may set
cookies. The notice text then changes to mention this and `version` is
incremented. A site-wide accept/refuse choice would only be needed if
something third-party were loaded without a click; it is not designed here
and must come back to the designer before being built.

### 8.27 Legal prose (legal notice and privacy policy pages)

A variant of the prose block (8.23) for long structured text.

- Section heading: an `h2` element in the `h3` type token (Fraunces 500),
  ink, 48 px above, 12 px below. The first heading has no margin of its own
  above it: the 48 px gap under the page head (9.8) is the only space there. Each has an `id` so it
  can be linked.
- Paragraphs: `body`, max width `68ch`, 16 px apart.
- Lists: `<ul>`, `body`, `list-style: disc`, marker colour muted,
  padding-left 20 px, 8 px between items, 16 px above and below.
- Order inside a section: paragraphs, then the list, then optional closing
  paragraphs (`after`), then the link list. Closing paragraphs are styled as
  paragraphs.
- No inline code style. A technical name such as a storage key is set in the
  quotation marks of the language (« … » in French, “ … ” in English).
- Link list (optional, after a section's text): each link on its own line as
  a text link (8.6); external ones open in a new tab with `↗` and the hidden
  "(nouvelle fenêtre)" / "(new window)".
- Placeholders: marked as in section 3.2.
- No pull quotes, no images, no `lead` paragraph.

---

## 9. Page layouts

Every page: skip link, privacy notice (8.26, when enabled and not
dismissed), header (8.2), `<main>`, footer (8.5). Section order is
identical on mobile and desktop; only the arrangement changes. "Container"
means the grid of section 4.2. Vertical gaps between numbered sections are
`--section-gap` unless stated.

Copy quoted below is draft placeholder for the content files, not final.

### 9.1 Home (`/fr`, `/en`)

**1. Hero (statement)**
- Padding top: 48 px base, 72 px md, 96 px lg.
- Role labels: one line in `label`, muted: "Réalisatrice · Scénariste ·
  Productrice" (EN "Director · Screenwriter · Producer"). The line may wrap
  at 360 px. Each separator is bound to the word before it with a
  non-breaking space (`Réalisatrice&nbsp;· Scénariste&nbsp;· Productrice`),
  so a line never starts with a separator. The component adds the separators;
  content holds only the list of roles. The same rule applies to every `·`
  separated line on the site (meta lines, data line, compact collaborations).
- 24 px gap.
- `h1` statement in `display-xl`, ink. Draft: "Je travaille l'émotion, quel
  que soit le format." / "I work with emotion, whatever the format." One
  phrase of the statement, set in content, is in Fraunces italic 400 at the
  same size and colour: "l'émotion" in French, "emotion" in English (draft,
  like the statement). Mark it up with `<em>`. At most one emphasised phrase;
  if the content field is empty, no italic.
- 32 px gap (48 px at lg).
- Introduction: 2 to 3 sentences in `lead`, ink, saying who she is, where
  (Paris), and what she makes (fiction, documentary, impact campaigns).
- Family list (8.10).
- Base and md: all stacked, full width; family list 32 px under the intro.
- lg: role labels and statement in cols 1–11; below, intro in cols 1–6 and
  family list in cols 8–12, tops aligned.

**2. Featured films**
- Section label: "Films choisis" / "Selected films".
- Up to 3 film features (8.13), in the order set in content. Gap between
  features: 64 px base, 96 px md, 128 px lg.
- After the last, 48 px gap, arrow link "Tous les films" / "All films",
  left-aligned.

**3. Collaborations** (band on `--color-surface`, full viewport width,
padding 64 px vertical base, 96 px lg; content in the container)
- Section label: "Collaborations".
- Compact collaboration list (8.21).
- 24 px gap, `small` muted sentence giving context (draft: "Films, portraits
  et campagnes pour des marques, des médias, des associations et des
  fondations.").
- 24 px gap, arrow link "En savoir plus" / "More about Sara" to About.

**4. Press**
- Section label: "Presse" / "Press".
- The 3 most recent press rows (8.20).
- 32 px gap, arrow link "Toute la presse" / "All press".

**5. In development** (shown only if at least one item is flagged for home)
- Section label: "En développement" / "In development".
- In-development items (8.22). lg: list in cols 1–8.

**6. Footer.**

### 9.2 Films index (`/fr/films`, `/en/films`)

**1. Page head**
- `h1` "Films" in `display-l`.
- 16 px gap; one sentence in `lead`, max width cols 1–8 at lg.
- 32 px gap; family navigation (8.11).

**2 to 4. One section per family**, in the order Fiction, Documentaire,
Campagnes à impact. Each section has `id` `fiction`, `documentaire`, `impact`
(same ids in both languages).
- `h2` family name in `h2` style; on the same line at md and lg,
  right-aligned, the count in `label` muted. Hairline under the heading, 32 px
  gap.
- Film cards (8.12), newest first.
  - Base: 1 column, 48 px between cards.
  - md and lg: 2 columns, column gap = gutter, row gap 64 px.
  - A family with a single film at md and lg: the card occupies the left
    column only.
- Gap between family sections: `--section-gap`.

**5. Footer.**

Unpublished films (flag off) never appear.

### 9.3 Film page (`/fr/films/:slug`, `/en/films/:slug`)

**1. Film head**
- Back link: arrow link in reverse, "← Films", `nav` style, 24 px above the
  title.
- `h1` film title in `display-l`, Fraunces italic 400. The title carries the
  `lang` attribute of its original language (`fr`, `it`).
- 16 px gap; data line (8.15).
- lg: cols 1–10.

**2. Pull quote** (8.14), only if the film has a statement quote.
48 px above and below (not `--section-gap`).

**3. Lead media**
- Video facade (8.19) or still, full container width at every breakpoint.
- For mode `external` or a combined mode: the external button (secondary
  button, 8.8) sits 16 px under the media, left-aligned.

**4. Body**
- Left: synopsis (`h2` "Synopsis", prose block), then director statement
  (`h2` "Note d'intention" / "Director's statement", prose block).
- Right: data table (8.16); under it, optional poster (2:3, max width 240 px).
- Base and md: synopsis, statement, data table, poster, stacked, 48 px
  apart.
- lg: left in cols 1–7, right in cols 9–12; the right column is not sticky.

**5. Stills** (only if the film has 2 or more extra stills)
- `h2` "Images" in `label` style.
- Base: 1 column, 16 px apart. md and lg: 2 columns, gap = gutter. An odd
  last image spans both columns.
- No lightbox. Images are not links.

**6. Selections and awards** (8.18), if any.

**7. Credits** (8.17), if any.

**8. Press about this film** (if any): `h2` "Presse" / "Press", press rows
(8.20) filtered to this film.

**9. Previous / next** (8.24).

**10. Footer.**

### 9.4 Press (`/fr/presse`, `/en/press`)

**1. Page head:** `h1` "Presse" / "Press" in `display-l`; optional sentence
in `lead`.

**2. List:** press rows (8.20), newest first, grouped by year: each year is
an `h2` in `label` style, muted, with 48 px above and 8 px below. Full
container width.

**3. Footer.**

### 9.5 About (`/fr/a-propos`, `/en/about`)

**1. Intro**
- `h1` "À propos" / "About" in `label` style (visually a label; it is still
  the `h1`).
- 16 px gap; opening sentence of the biography in `display-l` (maximum 140
  characters).
- Portrait 4:5.
- Biography: prose block, 150 to 200 words, third person, first paragraph in
  `lead`.
- Base: opening sentence, portrait (full width), biography.
- md: same order; portrait limited to 5 of 8 columns.
- lg: opening sentence in cols 1–10; below it, portrait in cols 1–5 and
  biography in cols 7–12, tops aligned.

**2. Roles and career** (`h2` "Parcours" / "Career")
- A data table (8.16) used as a timeline, 3 to 5 rows: `dt` = period (e.g.
  "Depuis 2002"), `dd` = one sentence. lg: cols 1–8, `dt` and `dd` side by
  side (cols 1–2 and 3–8).

**3. Collaborations** (`h2` "Collaborations")
- Detailed collaboration list (8.21). Rows come from the content files
  (name, then role and description), in the order set there.

**4. In development** (`h2` "En développement" / "In development")
- In-development items (8.22), from the content files. The section is not
  rendered when there are none.

**5. Call to action:** arrow link "Voir les films" / "View the films" and
arrow link "Contact", side by side with 32 px gap (stacked at base).

**6. Footer.**

### 9.6 Contact (`/fr/contact`, `/en/contact`)

**1. Page head**
- `h1` "Contact" in `label` style.
- 16 px gap; invitation in `display-l` (same draft copy as the footer line).
- 16 px gap; one sentence in `lead` naming what she can be contacted for
  (films, campagnes à impact, collaborations, projections).

**2. Contact details** (48 px under the head)
- Email: `label` muted "E-mail", then the address as a link in `h2` size,
  Fraunces 400, ink, 1 px accent underline, offset 8 px (hover: accent). At
  360 px the address must not overflow: allow `overflow-wrap: anywhere`.
- Phone: `label` muted "Téléphone" / "Phone", then the number as a `tel:`
  link in `h2` size, same style, directly under the email group. Displayed
  in international format with spaces (pattern "+33 6 00 00 00 00"); `href`
  in E.164 form. This is the only place on the site where the phone number
  appears. The group is not rendered when the content field is empty. Until
  the real number is supplied the content holds an obviously fictional
  placeholder.
- Location: `label` muted "Basée à" / "Based in", then "Paris, France" in
  `h3`.
- Social: `label` muted "Réseaux" / "Social", then "Instagram" and "Vimeo" as
  text links in `h3` size (new tab, `↗`).
- Optional secondary contact (rendered only when its content flag is on;
  off by default): a `label` muted heading from content, then a name and an
  email link in `body`.
- Base: stacked, 32 px between groups.
- md and lg: 2 columns (email and phone left, cols 1–7 at lg; location,
  social and secondary contact right, cols 9–12 at lg).

**3. Footer** without its invitation line (see 8.5).

No form.

### 9.7 Not found

Component 8.25 between header and footer, in the language of the URL prefix
(French if none).

### 9.8 Legal pages

| Page | FR route | EN route |
|---|---|---|
| Legal notice | `/fr/mentions-legales` | `/en/legal-notice` |
| Privacy policy | `/fr/confidentialite` | `/en/privacy` |

Both pages use the same layout. They are linked from the footer (8.5) on
every page and from each other; the privacy policy is also linked from the
privacy notice (8.26). They are not in the header navigation or the mobile
menu. The language switcher maps each page to its counterpart.

**1. Page head**
- `h1` in `display-l`: "Mentions légales" / "Legal notice";
  "Politique de confidentialité" / "Privacy policy".
- 16 px gap; `label`, muted: "Dernière mise à jour : {date}" / "Last
  updated: {date}", the date written out in the page language from an ISO
  date in content.
- Optional introduction, one paragraph in `body` (not `lead`), 24 px under
  the date.

**2. Body** (48 px under the head)
- Sections in legal prose (8.27), in the order of the content file.
- Base and md: full container width, text limited to `68ch`.
- lg: cols 1–8. No table of contents, no aside.

**3. Cross-link** (48 px under the last section, hairline above, 24 px
padding-top): one arrow link (8.7) to the other legal page.

**4. Footer.**

Section headings, in order. The draft text for each, in both languages, with
placeholders for every unknown fact, is in `legal-copy.md`.

Legal notice:
1. Éditeur du site / Publisher
2. Directrice de la publication / Director of publication
3. Hébergement / Hosting
4. Propriété intellectuelle / Intellectual property
5. Crédits / Credits
6. Liens externes / External links
7. Signaler un contenu / Reporting content

Privacy policy:
1. Responsable du traitement / Data controller
2. En bref / In short
3. Données liées à l'hébergement / Hosting data
4. Quand vous m'écrivez ou m'appelez / When you write or call
5. Cookies et stockage local / Cookies and local storage
6. Vidéos / Videos (kept in content but not rendered until embeds are live:
   a `published` flag per section, off for this one)
7. Liens vers d'autres sites / Links to other sites
8. Personnes citées sur ce site / People named on this site
9. Vos droits / Your rights
10. Modifications / Changes

Both pages carry `<meta name="robots" content="noindex">`.

---

## 10. Accessibility requirements (WCAG 2.1 AA)

- `<html lang>` follows the current language. Film titles and any quoted
  text in another language carry their own `lang`.
- Landmarks: `header`, `nav` (labelled), `main`, `footer`. One `h1` per page.
- On route change: focus moves to the `h1` (`tabindex="-1"`), the page title
  updates, and scroll returns to top (except for in-page anchors). The
  programmatically focused `h1` shows **no outline** (`outline: none` on
  `h1[tabindex="-1"]:focus`): it is not interactive and cannot be reached with
  Tab. This is the only exception to the focus rule of section 6. On first
  page load, focus is not moved.
- All functionality works with keyboard only; visible focus everywhere
  (section 6).
- Hover never reveals information that is not available otherwise.
- Colour is never the only indicator: current nav item has an underline;
  links in text are underlined.
- Text can be zoomed to 200% without loss; layout reflows at 320 px width.
- Touch targets 44 × 44 px minimum (section 6).
- Alt text required for every image in both languages; the build should fail
  or warn when it is missing.
- Video: iframe titles as in 7.3. Captions are the responsibility of the
  hosted video; note in content whether a film has subtitles.
- Links that open a new tab announce it (8.6).
- Reduced motion honoured (section 6).

---

## 11. SEO and sharing

| Page | `<title>` | Meta description |
|---|---|---|
| Home | "Sara Grimaldi – Réalisatrice et scénariste" / "Sara Grimaldi – Director and screenwriter" | From content, 140 to 160 characters |
| Films | "Films – Sara Grimaldi" | From content |
| Film | "{Titre} ({année}) – Sara Grimaldi" | Film logline, max 160 characters |
| Press | "Presse – Sara Grimaldi" / "Press – Sara Grimaldi" | From content |
| About | "À propos – Sara Grimaldi" / "About – Sara Grimaldi" | From content |
| Contact | "Contact – Sara Grimaldi" | From content |
| Legal notice | "Mentions légales – Sara Grimaldi" / "Legal notice – Sara Grimaldi" | From content; page is `noindex` |
| Privacy policy | "Confidentialité – Sara Grimaldi" / "Privacy – Sara Grimaldi" | From content; page is `noindex` |

- Open Graph and Twitter card on every page: `og:title`, `og:description`,
  `og:image` (1200 × 630; film still for film pages, default image
  elsewhere), `og:locale` (`fr_FR` or `en_GB`), `og:type` (`website`;
  `video.movie` for films).
- `link rel="alternate" hreflang="fr" | "en" | "x-default"` (x-default to
  French) and a canonical URL on every page, built from a single configurable
  base URL so the site stays portable to a custom domain.
- Theme colour: `#F6F1E8`.
- **Default Open Graph image:** a still from *Immunity*, cropped to
  1200 × 630, JPEG, under 300 KB, with no text overlaid. Its alt text
  (`og:image:alt`) names the film in both languages. Until that file
  exists the `og:image` tag is omitted on pages without their own image (the
  content field stays). Film pages use their lead still cropped to 1200 × 630
  as soon as stills are supplied.
- **Favicon:** the initials "SG", ink on paper, in the system serif. A
  favicon cannot load the site's web font, and no Fraunces outlines are
  available, so the system serif is the specified final rendering, not a
  stopgap. One SVG file, exactly:

  ```svg
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <rect width="32" height="32" fill="#F6F1E8"/>
    <text x="16" y="22" text-anchor="middle"
          font-family="Georgia, 'Times New Roman', serif"
          font-size="17" font-weight="700" letter-spacing="-0.5"
          fill="#1C1A17">SG</text>
  </svg>
  ```

  Referenced with `<link rel="icon" type="image/svg+xml">`. The 180 px PNG
  (`apple-touch-icon`) is the same artwork rasterised at 180 × 180; it is
  omitted until someone exports it, since producing it must not add a build
  dependency. No dark-mode variant.

---

## 12. Content model implied by the design

For the developer's content service. Every text field is bilingual
(`fr`, `en`). Names are suggestions; the fields are requirements.

**Site:** name; role labels (list); statement; statement emphasis; intro;
email; phone (Contact page only; may be empty); location; socials (label,
URL); secondary contact (heading, name, email, `show` flag, default off);
footer invitation; footer legal link labels; default meta description;
default OG image; navigation labels; UI strings (skip link, menu, close, new
window, watch labels, section labels, last-updated label, 404, `noscript`
sentence).

**Privacy notice:** `enabled`; `version`; `text`; `linkLabel`;
`dismissLabel`; `regionLabel` (8.26).

**Legal page** (one per page: legal notice, privacy policy): title; meta
description; `updated` (ISO date); introduction (optional); sections, each
with `id`, heading, paragraphs (list of plain strings, with the conventions
of section 3.2), list items (optional), `after` (optional: paragraphs that
follow the list), links (optional: label, URL),
`published` (boolean, default true); label of the cross-link to the other
legal page.

**Film:** slug; title; title language; family (`fiction` | `documentaire` |
`impact`); year; duration (display string); roles (list); logline; synopsis;
statement; statement quote (max 180 characters); proof line; data rows
(genre, country, languages, format, production, support, broadcast); credits
groups (group title, role, name); selections (festival, place or year,
award); selections summary; `watch` (mode, provider, id, external label,
external URL); lead still (file, alt); stills (file, alt); poster (file,
alt); `published` (boolean); order.

**Home:** featured films as an ordered list of film references (up to 3);
the list order is the display order of 9.1. There is no `featured` flag on
films.

The values for each film (family, year, duration, watch mode, published)
live in the content files, which are the reference; this document
does not list them.

**Press item:** publication; description; year; country; article language;
URL or scan image (file, alt); related film slug (optional).

**Collaboration:** name(s); role and description; order; `home` flag.

**In-development item:** title; format and status; description (optional);
`home` flag.

**About:** opening sentence; biography (list of paragraphs, plain strings
with the `*title*` convention of section 3.2); portrait (file, alt);
career rows (period, text).

---

## 13. Dependencies

None required by this design. No UI framework, no icon set (the only glyphs
are `→`, `←`, `↗`, `·` as text and one CSS triangle), no animation library,
no carousel, no lightbox, no video SDK, no font package. Font files are
static assets.

---

## 14. Defaults for missing content (nothing here blocks the build)

| When this is missing | Use |
|---|---|
| Final wording of any text, in either language | Draft copy, marked as draft in content |
| A film's watch link | Watch mode `none` ("available on request") |
| A selections summary number | The list alone, no summary line |
| Stills, portrait, posters | Placeholders on `--color-surface` at the specified ratios |
| Default Open Graph image | No `og:image` tag |
| Phone number | Fictional placeholder in content, or empty (group not rendered) |
| Any legal fact (publisher identity, address, registration numbers, retention periods) | A visible placeholder marker (3.2); never an invented value |
| Optional blocks (secondary contact, in-development list) | Not rendered |

## Change log

- 1.0 (2026-11-14): first version, direction B.
- 1.1 (2026-11-14): no outline on the route-change `h1` (section 10); default
  Open Graph image and favicon specified (section 11); statement emphasis
  fixed (9.1); mobile menu as native `<dialog>` (8.4).
- 1.3 (2026-11-14), after the home page review: press row meta moved to
  cols 10–12 without the article language (8.20); footer and collaborations
  gaps written in (8.5, 9.1); Fraunces italic preloaded (3.1); language
  switcher name without `aria-label` (8.3); separators bound with
  non-breaking spaces (9.1); `*title*` convention for inline film titles
  (3.2, 12). Inter kept as text face.
- 1.2 (2026-11-14): default Open Graph image is a still from *Immunity*
  (section 11).
- 1.4 (2026-11-14): phone number on the Contact page only, removed from the
  footer and the mobile menu (8.4, 8.5, 9.6); legal notice and privacy policy
  pages, footer legal links (8.5, 8.27, 9.8, 11, 12); privacy notice
  component (8.26); placeholder marking (3.2); press row language shown as a
  code in the meta (8.20); document made self-sufficient and reviewed for
  publication in a public repository (header, 9.5, 9.6, 12, 14).
- 1.5 (2026-11-14): privacy notice copy shortened to one sentence, limits
  set at 160 px and one action row at 360 px, `<noscript>` block on the
  deep-link fallback only (8.26); `after` paragraphs and no inline code in
  legal prose (8.27, 12).
- 1.6 (2026-11-14): first legal section starts 48 px under the page head,
  with no extra margin (8.27); featured films are an ordered list on the
  home content, not a flag on films (12).
