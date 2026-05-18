# Contributing

This repository contains the public website for the GitHub Spain community.

## Before you start

- Keep changes focused. Separate content updates, deployment changes, and feature work whenever possible.
- Coordinate with maintainers before changing event ingestion scripts or workflows. That part of the site is under active stabilization.
- Do not treat `public/data/issues.json` as hand-edited content unless you are doing maintenance on the current sync pipeline.

## Local development

```bash
npm install
npm start
```

The app runs with Create React App and serves the static assets from `public/`.

## Validation

Run these commands before opening a pull request:

```bash
CI=true npm test -- --watchAll=false
npm run build
```

The repository also runs the same checks in [validate.yml](.github/workflows/validate.yml).

## Pull requests

- Rebase on `main` before requesting review.
- Describe the user-facing impact of the change.
- Include screenshots when the change affects layout, copy, or images.
- Keep deployment and workflow changes explicit in the PR description.

## Content and data changes

### Organizers

- Update [public/data/organizers.json](public/data/organizers.json) and the related image files in the same PR.
- Keep image filenames stable when possible to avoid unnecessary content churn.

### Events

- The timeline currently reads generated data from [public/data/issues.json](public/data/issues.json).
- The event source model is being revised. Until that work is complete, avoid building new features that depend on the current issue-sync behavior without maintainer alignment.

## Deployment notes

- Pushes to `main` deploy the site through [deploy-pages.yml](.github/workflows/deploy-pages.yml).
- Changes to `public/data/issues.json` also trigger a Pages deploy so event updates are reflected on the live site.
- The Pages source for the repository must remain configured as `GitHub Actions`.
- Do not add back local `gh-pages` publish scripts unless the deployment model is intentionally changed again.
