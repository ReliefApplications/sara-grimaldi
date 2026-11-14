# Sara Grimaldi — website

The public website of Sara Grimaldi, director and screenwriter. It is a small
Angular application with no server: all texts and image references are plain
files in the `content/` folder, and the site is published on GitHub Pages as
static pages.

- Repository: https://github.com/ReliefApplications/sara-grimaldi
- Live site: https://reliefapplications.github.io/sara-grimaldi/

The site exists in French (main language) and English. Every page has both.

## Change a text or an image

You never need to touch the code to change wording. Everything is in
`content/`:

| What                                              | File                                       |
| ------------------------------------------------- | ------------------------------------------ |
| Name, roles, menu, e-mail, phone, socials, footer | `content/site.json`                        |
| Home, Films, Press, About, Contact, "not found"   | `content/pages/<page>.json`                |
| Legal notice, privacy policy                      | `content/pages/legal.json`, `privacy.json` |
| The small privacy notice ("cookie banner")        | `privacyNotice` in `content/site.json`     |
| One film                                          | `content/films/<film>.json`                |
| One press item                                    | `content/press/<year>-<outlet>.json`       |
| One collaboration (brand, media…)                 | `content/collaborations/<name>.json`       |
| One project in development                        | `content/in-development/<name>.json`       |
| Images                                            | `content/images/`                          |

What visitors can and cannot see: only a prepared copy of these files is
published. Films and sections with `"published": false`, blocks and list
items with `"show": false`, `"_note"` lines, and the images only they use
are removed from that copy, so they are not on the website at all, not even
hidden in the page code. They do remain readable in this
GitHub repository for anyone who has access to it.

Rules of thumb:

- A text that changes with the language is written once per language:
  `"heading": { "fr": "À propos", "en": "About" }`. If the English is left
  empty (`""`), the French is shown instead.
- Long texts are lists of paragraphs: `"fr": ["First paragraph.", "Second."]`.
- Keep the quotes, commas and brackets exactly as they are. If a file is
  broken, the build stops and names the file.
- Use real typographic characters in the texts: `’`, `« »` in French, `“ ”`
  in English, `–` for ranges.
- To show a film or work title in italics inside a sentence, put it between
  asterisks: `"Article sur le documentaire *Immunity*"`. This is the only
  formatting available.
- A fact that is not known yet is written as a marker in square brackets
  starting with `[à compléter` (French) or `[to be completed` (English),
  for example `[à compléter : adresse professionnelle]`. The site shows it
  highlighted, and every build prints how many are left. Replace each one
  with the real information before launch.
- Lines such as "2024 · 9 min" are written as lists (`["Long métrage",
"scénario"]`); the site adds the dots.
- Files marked `"_note": "Draft copy…"` hold draft wording to be validated.

Films (`content/films/`):

- **Add a film**: copy an existing file, rename it (for example
  `my-new-film.json`) and edit it. The file name becomes the page address
  (`/fr/films/my-new-film`).
- `"family"` is `fiction`, `documentaire` or `impact`.
- `"published": false` keeps a film off the website entirely (no page, no
  mention, nothing in the published files) without deleting its file.
- The films shown on the home page, and their order, are the list
  `"featured": { "films": [...] }` in `content/pages/home.json` (file names
  without `.json`; the first three are shown).
- Films are listed most recent first; for two films of the same year, add
  `"order": 1`, `"order": 2` to choose.
- `"watch"` says how the film can be seen: `"mode"` is `full`, `trailer`,
  `external` or `none` ("available on request"); `"provider"` (`vimeo` or
  `youtube`) and `"id"` identify the video; `"externalLabel"` and
  `"externalUrl"` add a link to another site.
- `"statementQuote"` is the short quote shown on the home page (180
  characters at most, with its quotation marks).

Other content:

- **Press item**: `"articleLang"` is the language of the article (`fr`,
  `it`, `en`); when it differs from the language of the page, the site adds
  its code to the line under the description ("2019 · ITALIE · IT"). To
  allow another language, add it to `"articleLanguages"` in
  `content/site.json`. `"relatedFilm"` (the file
  name of the film it talks about) and `"url"` (the link to the article) are
  optional. Items are listed most recent year first; for two items of the
  same year, add `"order": 1`, `"order": 2` to choose.
- **Collaborations** and **projects in development**: `"order"` sets the
  position, `"home": true` shows the entry on the home page.
- **Second contact** on the Contact page (for example an agent):
  `"secondaryContact": { "show": true, … }` in `content/site.json`, with its
  heading, name and e-mail. The name and e-mail are empty for now: fill them
  in before switching `"show"` to `true`. While `"show"` is `false` nothing
  from this block is published anywhere on the website.
- **Phone number**: shown on the Contact page only. `"phone"` (digits only,
  starting with `+33`) and `"phoneDisplay"` (as it should read) under
  `"contact"` in `content/site.json`. The current value is a placeholder
  from a range reserved for fiction, not a real number; leave both empty
  (`""`) to show no phone at all.
- **Legal notice and privacy policy** (`content/pages/legal.json` and
  `privacy.json`): a list of sections, each with a heading, paragraphs, an
  optional list, optional paragraphs after the list (`"after"`) and optional
  links. `"published": false` hides a section. `"updated"` is the date of
  the last change, written `"2026-11-14"`; while it is empty the page shows
  a marker instead. The current text is a draft with many markers: it must
  be completed and validated before launch.
- **Privacy notice**: `"privacyNotice"` in `content/site.json`.
  `"enabled": false` removes it entirely. If its text changes, also change
  `"version"` (for example `"1"` to `"2"`): everyone then sees the notice
  again. The text must stay true: today the site sets no cookies and loads
  nothing from other services.
- A required text left empty, a missing French version, or an asterisk in
  the wrong place stops the build with a message naming the file and the
  field.
- Page titles and descriptions shown by Google and social networks are the
  `seo` block at the top of each page file.

Images (`content/images/`):

- Each still is exported by hand as WebP (quality about 78), 16:9, in four
  widths: 480, 768, 1152 and 1600 pixels, named with the width at the end:
  `immunity-480.webp`, `immunity-768.webp`, `immunity-1152.webp`,
  `immunity-1600.webp`.
- In the content file, reference the set once, without the width:
  `"still": { "src": "images/immunity.webp", "width": 1600, "height": 900, "alt": { "fr": "…", "en": "…" } }`.
  `width` and `height` are those of the largest file. The site picks the
  right file for each screen.
- A portrait (4:5) uses the widths 480, 768 and 960: add
  `"widths": [480, 768, 960]` to its reference.
- The sharing image (shown by social networks) is a single JPEG of
  1200 × 630 pixels under 300 KB, referenced with its full name under
  `"seo"` in `content/site.json`:
  `"image": { "src": "images/share.jpg", "alt": { "fr": "…", "en": "…" } }`.
  A film can have its own as `"shareImage"`.
- The build stops if a description (`alt`) or one of the files is missing.

Once the change is pushed to the `main` branch on GitHub, the site is rebuilt
and published automatically within a few minutes.

## Run the site on your computer

You need [Node.js](https://nodejs.org) 24 or newer.

```bash
npm install     # once
npm start       # then open http://localhost:4200
```

Changes in `content/` show up in the browser on save, including new or
removed files.

Other commands:

```bash
npm test -- --watch=false   # run the tests once
npm run format              # tidy the formatting of code and content files
SITE_URL=http://localhost:4300 npm run build   # production build in dist/sara-grimaldi/browser
```

## How deployment works

`.github/workflows/deploy.yml` runs on every push to `main`: it installs,
tests, builds and publishes the site to GitHub Pages.

One-time setup in the GitHub repository: **Settings → Pages → Build and
deployment → Source: GitHub Actions**.

- **Static pages.** At build time every page, in both languages, and every
  published film is written as a real HTML file (prerendering), with its own
  title, description and sharing tags. There is no server to run.
- **Address of the site.** The site currently lives under
  `https://reliefapplications.github.io/sara-grimaldi/`. The workflow asks
  GitHub Pages for that address and passes it to the build (`--base-href` for
  the path, `SITE_URL` for the full address used in canonical and sharing
  links), so it is not written anywhere in the code.
- **Custom domain later.** Set the domain in Settings → Pages. GitHub then
  reports the new address and the same workflow builds the site for it.
  Nothing to change in the project.
- **Search engines.** Until launch the site asks search engines not to list
  it: the line `SITE_NOINDEX: 'true'` in `.github/workflows/deploy.yml` puts
  a "noindex" tag on every page. On launch day, change it to `'false'`.
- **Safety check.** After each build `tools/check-dist.mjs` scans the files
  about to be published and stops the deployment if it finds anything from
  an unpublished film or a hidden block, a `_note`, a file that should not
  be there, or a page without title, description or language links.
- **Unknown addresses.** GitHub Pages serves `404.html` for anything that is
  not a real file. The build publishes the application shell under that name
  (`tools/spa-fallback.mjs`), so the site shows its own "page not found" in
  the right language.

To reproduce the deployed build locally (`SITE_URL` is required for any
production build: it is the address written into canonical and sharing
links):

```bash
SITE_URL=https://reliefapplications.github.io/sara-grimaldi SITE_NOINDEX=true npm run build -- --base-href /sara-grimaldi/
```

## For developers

- Angular 22, standalone components, strict TypeScript, SCSS. The only
  additions to the CLI scaffold are `@angular/ssr` and its peer
  `@angular/platform-server`, used at build time only for prerendering
  (`outputMode: "static"`, no server entry).
- Design: `docs/design/design-system.md` is the source of truth. Its tokens
  are CSS custom properties defined once in `src/styles/_tokens.scss`; the
  type scale is in `src/styles/_type.scss`. The home page, header, footer,
  legal pages, privacy notice and not-found page are built to it; the other
  pages are still plain.
- Fonts: Fraunces and Inter (SIL Open Font License), self-hosted in
  `public/fonts/` as Latin subsets of the official releases, declared and
  preloaded in `src/index.html`.
- `src/app/core/content.service.ts` is the only place that loads content.
  It returns signals already resolved to the current language. The shape of
  every content file is typed in `src/app/core/content.models.ts`; update it
  when a field is added.
- `src/app/core/site-routes.ts` holds the routes and the URL of each page per
  language (`PAGE_PATHS`); `src/app/app.routes.server.ts` lists what is
  prerendered.
- `tools/build-content.mjs` validates `content/` and writes the public copy
  to `.generated/content/` (collections bundled, unpublished and hidden
  parts removed, only the images that public content uses, site address and
  noindex switch in `build.json`). It runs before start, build and test;
  `tools/start.mjs` re-runs it on change. Only `.generated/content/` is
  published.
- `src/app/core/content-rules.ts` is the one list of allowed values, key
  names and required fields. The app builds its types from it and the tool
  imports it directly (Node runs the TypeScript file as is), so it must
  contain constants only.
- No component contains copy: add new wording to a content file.
