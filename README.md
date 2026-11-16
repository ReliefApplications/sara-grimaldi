# Sara Grimaldi — website

The public website of Sara Grimaldi, director and screenwriter. It is a small
Angular application with no server: all texts and image references are plain
files in the `content/` folder, and the site is published on GitHub Pages as
static pages.

- Repository: https://github.com/ReliefApplications/sara-grimaldi
- Live site: https://saragrimaldi.com/

The site exists in French (main language) and English. Every page has both.

## Change a text or an image

You never need to touch the code to change wording. Everything is in
`content/`:

| What                                            | File                                       |
| ----------------------------------------------- | ------------------------------------------ |
| Name, roles, menu, e-mail, socials, footer      | `content/site.json`                        |
| Home, Films, Press, About, Contact, "not found" | `content/pages/<page>.json`                |
| Legal notice, privacy policy                    | `content/pages/legal.json`, `privacy.json` |
| The small privacy notice ("cookie banner")      | `privacyNotice` in `content/site.json`     |
| One film                                        | `content/films/<film>.json`                |
| One press item                                  | `content/press/<year>-<outlet>.json`       |
| One project in development                      | `content/in-development/<name>.json`       |
| One client or medium, with its logo             | `content/organisations/<name>.json`        |
| Images                                          | `content/images/`                          |

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
- **Organisations** (clients and media): each file has a `"name"`, a
  `"kind"` (`client` or `press`), an `"order"`, and `"home": true` to show
  it in the grid of the home page. `"role"` says what Sara did for it; the
  About page lists the organisations that have one. When a logo exists,
  `"logo"` gives its file in `content/images/logos/`, its pixel `"size"` and
  its description (the name). `"scale"` (between 0.7 and 1.3) makes a logo
  look a little smaller or larger beside the others. Without a logo the name
  is shown in type. A press item shows the logo of the organisation with the
  same name; list other spellings under `"aliases"` (for example
  `"France 3"` for france.tv). The current logos come from Sara's own site
  and are small.
- **Projects in development**: `"order"` sets the position; `"format"` is a
  list such as `["Long métrage", "scénario"]`.
- **Visual Stories projects** (`"work"` in `content/pages/visual-stories.json`):
  to send visitors to a video or an article on another site, add
  `"link": { "label": { "fr": "Voir le reportage", "en": "Watch the report" }, "url": "https://…" }`
  to the project. The link opens in a new window; remove the block to show
  none. `"published": false` keeps a project off the site.
- **Credential badge** on the About page: `"badge"` in
  `content/pages/about.json` (a logo file, its `"size"` and description);
  remove the block to show none.
- **Second contact** on the Contact page (for example an agent):
  `"secondaryContact": { "show": true, … }` in `content/pages/contact.json`, with its
  heading, name and e-mail. The name and e-mail are empty for now: fill them
  in before switching `"show"` to `true`. While `"show"` is `false` nothing
  from this block is published anywhere on the website.
- **Phone number**: shown on the Contact page only, and stored only in that
  page's file: `"phone"` in `content/pages/contact.json`, with `"number"`
  (digits only, starting with `+33`) and `"display"` (as it should read).
  The current value is a placeholder from a range reserved for fiction, not
  a real number; leave both empty (`""`) to show no phone at all.
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
  again. The text must stay true: today the site itself sets no cookies and
  uses no tracking tool, and the only thing loaded from another service is
  the home page video, served by Vimeo, which sets technical cookies of its
  own. If that changes, change the notice and `privacy.json` too.
- A required text left empty, a missing French version, or an asterisk in
  the wrong place stops the build with a message naming the file and the
  field.
- Page titles and descriptions shown by Google and social networks are the
  `seo` block at the top of each page file.

Images (`content/images/`):

- Each photograph is exported by hand as WebP (quality about 78) in several
  widths, named with the width at the end. A film image used in tiles needs
  480, 768 and 1152 pixels: `immunity-480.webp`, `immunity-768.webp`,
  `immunity-1152.webp`.
- In the content file, reference the set once, without the width:
  `"still": { "src": "images/films/immunity.webp", "width": 1474, "height": 1080, "alt": { "fr": "…", "en": "…" } }`.
  `width` and `height` are those of the largest file. The site picks the
  right file for each screen.
- When the set has other widths, list them: `"widths": [480, 768, 1280, 1920]`
  for the image of the first screen (`"hero"` in `content/pages/home.json`),
  a larger last width for a film's main image, `[480, 768, 1000]` for the
  portrait.
- `"focus"` says which point stays visible when the image is cropped to fit
  its frame, as two percentages from the left and from the top:
  `"focus": "35% 60%"`. Without it the centre is kept.
- `"fit": "poster"` shows the whole image on a black field instead of
  cropping it. Use it for posters and any picture with a title printed on it.
- `"_source"` notes where a picture came from. It is for the team only and is
  never published. The current pictures are placeholders taken from Sara's
  own site and Vimeo channel, for her to replace or refuse.
- Logos and the sharing image are single files, referenced with their full
  name. The sharing image (shown by social networks) is a JPEG of
  1200 × 630 pixels under 300 KB, under `"seo"` in `content/site.json`:
  `"image": { "src": "images/share.jpg", "alt": { "fr": "…", "en": "…" } }`.
  A film can have its own as `"shareImage"`.
- The build stops if a description (`alt`) or one of the files is missing.
- Only pictures used by published content are put online.

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
- **Address of the site.** The site lives at `https://saragrimaldi.com/`.
  The workflow asks GitHub Pages for that address and passes it to the build
  (`--base-href` for the path, `SITE_URL` for the full address used in
  canonical and sharing links), so it is not written anywhere in the code.
- **Custom domain.** The domain is set in the GitHub repository, not in the
  project: **Settings → Pages → Custom domain: `saragrimaldi.com`**, with
  **Enforce HTTPS** ticked (otherwise GitHub reports the address with
  `http://` and the safety check below stops the deployment). The domain's DNS records must point to GitHub Pages. After
  changing either setting, run the workflow again (Actions → Deploy to
  GitHub Pages → Run workflow) so the site is rebuilt for the new address.
  Until the domain is set there, the workflow keeps building for
  `https://reliefapplications.github.io/sara-grimaldi/`; once it is set,
  that old address redirects to the domain.
- **Search engines.** The site is launched, so search engines may list it:
  the line `SITE_NOINDEX: 'false'` in `.github/workflows/deploy.yml`. The
  legal notice, the privacy policy and the "page not found" page still ask
  not to be listed. To hide the whole site again (for example during a
  redesign), change that line to `'true'`: every page then carries a
  "noindex" tag.
- **Safety check.** After each build `tools/check-dist.mjs` scans the files
  about to be published and stops the deployment if it finds anything from
  an unpublished film or a hidden block, a `_note`, a file that should not
  be there, a page without title, description or language links, or a site
  address in `http://` instead of `https://`.
- **Unknown addresses.** GitHub Pages serves `404.html` for anything that is
  not a real file. The build publishes the application shell under that name
  (`tools/spa-fallback.mjs`), so the site shows its own "page not found" in
  the right language.

To reproduce the deployed build locally (`SITE_URL` is required for any
production build: it is the address written into canonical and sharing
links):

```bash
SITE_URL=https://saragrimaldi.com SITE_NOINDEX=false npm run build -- --base-href /
```

## For developers

- Angular 22, standalone components, strict TypeScript, SCSS. The only
  additions to the CLI scaffold are `@angular/ssr` and its peer
  `@angular/platform-server`, used at build time only for prerendering
  (`outputMode: "static"`, no server entry).
- Design: `docs/design/design-system.md` (v2) is the source of truth. Its
  tokens are CSS custom properties defined once in `src/styles/_tokens.scss`;
  the type styles are in `src/styles/_type.scss` and the three surfaces
  (ground, ink, accent) in `src/styles/_layout.scss`. The shell (header,
  menu, footer, privacy notice) and the home page are built to it; the other
  pages are being rebuilt and are plain meanwhile.
- Fonts: Archivo (variable width and weight) and Fraunces italic, both under
  the SIL Open Font License, self-hosted in `public/fonts/` as Latin subsets
  of the official files, declared and preloaded in `src/index.html`.
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
