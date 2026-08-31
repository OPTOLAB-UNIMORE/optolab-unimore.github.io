# OptoLAB institutional website

Quarto source for the public website of OptoLAB at the University of Modena and Reggio Emilia.

> The laboratory's extended title and institutional content are provisional. Review `CONTENT-TODO.md` before treating the site as final.

## Prerequisites

- Git
- GitHub CLI (`gh`) for repository administration
- Quarto CLI

Check the tools:

```powershell
git --version
gh --version
quarto --version
gh auth status
```

## Repository structure

- `_quarto.yml`: website, navigation, SEO and output configuration
- `index.qmd`: homepage, including the "Latest news" listing (2 most recent entries from `news/items/`)
- `research.qmd`: research areas, facilities and capabilities (no separate `facilities.qmd`)
- `team.qmd`: team roster and contact information (no separate `contact.qmd`; contact details live in the `#contact` section of this page)
- `publications.qmd`: publication index, hand-maintained as a flat, year-grouped Markdown list in IEEE style (there is no `publications.bib` — entries are added directly as Markdown)
- `datasets.qmd`: public dataset index
- `join-us.qmd`: opportunities for students and collaborators (thesis, internships, PhD) — currently a template pending real open positions
- `news/index.qmd`: full news archive (filterable listing)
- `news/items/`: one Quarto file per news entry (conference participations, awards, updates)
- `software.qmd`: verified public repositories and resources — **not linked from the site navigation**, kept as a direct-URL page pending a content review
- `projects/index.qmd` and `projects/items/`: filterable project listing — **not linked from the site navigation**, kept as a direct-URL page pending a content review
- `assets/`: brand, image and icon assets
- `styles.scss`: visual system and responsive rules
- `.github/workflows/publish.yml`: automated GitHub Pages deployment

`software.qmd` and `projects/` are intentionally excluded from the navbar in `_quarto.yml` — this is a deliberate editorial choice (pending a content pass), not an oversight. Re-add them to the `navbar.left`/`navbar.right` lists in `_quarto.yml` once their content is ready to publish.

## Local preview and rendering

```powershell
quarto preview
quarto render
```

Rendered output is written to `_site/` and is intentionally excluded from Git.

## Adding a project

1. Copy one file from `projects/items/`.
2. Give it a short lowercase filename.
3. Replace the title, description, date and categories in the YAML front matter.
4. Use only reviewed claims and authorized media.
5. Remove the demonstrative-content warning only after approval.
6. Run `quarto render` and inspect the Projects listing and project page.

## Adding a publication

1. Obtain a verified record from the publisher or DOI metadata.
2. Check authors, title, venue, year and DOI.
3. Add a new Markdown list item under the correct year heading in `publications.qmd`, formatted in IEEE style with a DOI link, matching the existing entries.
4. Update the summary counts at the top of `publications.qmd` (`pub-stats`) if the new entry changes the totals.
5. Render the site and check capitalization, links and author order.

Do not infer OptoLAB authorship or affiliations.

## Adding a news item

1. Copy `news/items/example-conference-participation.qmd` to a new file with a short, lowercase, hyphenated filename.
2. Replace the title, description and date in the YAML front matter, and set `categories` (e.g. `Conference`, `Award`, `Publication`, `Seminar`).
3. If you have a photo, place it in `assets/images/`, uncomment the `image:` field and point it to that file — it becomes the card thumbnail on the Home page and the News archive.
4. Replace the body with a short paragraph (2–4 sentences), linking to a related record where relevant.
5. Run `quarto render` and check the "Latest news" section on the Home page and the full archive at `news/index.qmd`.

The Home page always shows the 2 most recent news entries by date; older entries remain available in the archive.

## Replacing images

Place reviewed images in `assets/images/`, optimize them for the web and add meaningful alternative text at every use. Record copyright, licence or written authorization. Do not replace the provisional abstract mark with a UNIMORE or departmental logo until its use is authorized.

## Updating team members

Replace placeholder cards in `team.qmd` only after collecting the fields listed in `CONTENT-TODO.md`: name, academic role, short bio, research interests, institutional profile, ORCID, Google Scholar, GitHub and an authorized photo.

## Publishing

The standard automated path is:

1. Push reviewed source changes to `main`.
2. The GitHub Actions workflow renders the site.
3. The workflow publishes the rendered output to the `gh-pages` branch.
4. GitHub Pages serves the root of `gh-pages`.

Manual publishing is also available:

```powershell
quarto publish gh-pages --no-browser
```

The repository's Pages source must be `gh-pages` at `/`.

## Future UNIMORE domain

After institutional approval:

1. Obtain the final hostname and DNS instructions from UNIMORE IT.
2. Add a `CNAME` file containing only the approved hostname.
3. Configure the custom domain in Repository Settings → Pages.
4. Enable HTTPS after DNS verification.
5. Update `site-url`, the canonical URL and Open Graph URLs in `_quarto.yml`.
6. Test old and new URLs, then document ownership and renewal responsibilities.

## Rollback

For a source rollback, identify the last known-good commit and create a new reverting commit:

```powershell
git log --oneline
git revert <commit-sha>
git push origin main
```

The workflow will redeploy the reverted source. For an urgent Pages-only rollback, redeploy a known-good source commit with Quarto, then reconcile `main` immediately. Avoid force-pushing shared branches.

