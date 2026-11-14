# Sara Grimaldi website

## Project facts
- Client: Sara Grimaldi, director / producer (réalisatrice). Confirm her
  exact title and positioning from her current site.
- Her current website: https://saragrimaldi.com/work (study the whole site,
  not only this page)
- Inspiration site 1: https://monicamedellin.com (a person whose work and
  site Sara takes inspiration from)
- Inspiration site 2: https://www.wavesmadestudios.com (the studio that
  same person founded this year)
- What Sara said about them: the positioning of those sites is extremely
  targeted; she wants hers to be a bit broader, but in the same spirit.
- Site languages: French (primary) and English. Every page exists in both,
  with a language switcher; content files hold both languages.
- Screenshots of the reference sites, if any, are in docs/design/references/

## Goal
A new, unique public website for her. The two inspiration sites are
references for mood, structure and quality level only. Never copy their
layout one-to-one, and never reuse their text, images, logos or font files.
Content from her current site may be used as placeholder content.

## Stack
- Latest stable Angular, standalone components, TypeScript strict, SCSS.
- No backend. No UI framework unless the designer justifies it.
- Keep it simple: prefer the smallest solution that works. Ask before
  adding any dependency.

## Content (simple CMS)
- All editable text and image references live in /content as JSON or
  Markdown files, loaded by the app through one typed content service.
- No hard-coded copy in components.
- The structure must stay compatible with adding a Git-based CMS later.

## Hosting
- GitHub Pages for now, deployed by a GitHub Actions workflow on push to main.
- Handle the base href for a project page and the SPA refresh / deep-link
  fallback.
- Keep it portable to a custom domain later.
- Repository: https://github.com/ReliefApplications/sara-grimaldi
- Live URL: https://reliefapplications.github.io/sara-grimaldi/ (base href
  `/sara-grimaldi/` until the custom domain)

## Quality bar
- Mobile-first and responsive (check 360, 768 and 1280 px).
- WCAG AA accessibility.
- Fast: optimised images, lazy loading, small bundle.
- Basic SEO: page titles, meta descriptions, Open Graph tags.

## File ownership
- designer: docs/design/
- developer: src/, content/, config files, .github/, README.md
- reviewer (review and QA): edits nothing
- security-privacy (audit before going public): edits nothing

## Team lead rules
- You coordinate; you do not implement. Never write application code or
  design specs yourself. Delegate to the designer or the developer.
- Break work into small tasks with one owner each and no shared files.
- Wait for teammates to finish before summarising or moving on.
- Stop and ask the user before: choosing a creative direction, adding a
  dependency, committing, or pushing to GitHub.
- After each phase, give a short status: done, in progress, blocked, and
  decisions needed from the user.
- Send every finished page to the reviewer, and route its findings back to
  the right teammate.
- Before the first public deployment, and again before any launch on a
  custom domain, run the security-privacy agent and show the user its report.
