# ghspain.github.io

This repository contains the public website for the GitHub Spain community. It is the landing page people reach first to discover the community, upcoming events, and the organizing team.

## What the site includes

- Community landing page and core calls to action.
- Organizer profiles loaded from static data.
- Event timeline rendered from the current event dataset.

## Local development

```bash
npm install
npm start
```

## Validation

```bash
CI=true npm test -- --watchAll=false
npm run build
```

## Deployment

- Every push to `main` triggers [deploy-pages.yml](.github/workflows/deploy-pages.yml) and publishes the React build.
- Updates to `public/data/issues.json` also trigger a new Pages deploy so event changes reach the live site.
- [sync-issues.yml](.github/workflows/sync-issues.yml) only keeps `public/data/issues.json` in sync on `main`.
- Local `gh-pages` publishing is no longer part of the release flow.

## Pages configuration

The repository Pages source must be set to `GitHub Actions`.

## Repository structure

- [src](src) contains the React application.
- [public/data](public/data) contains the static datasets consumed by the site.
- [scripts](scripts) contains the current event sync helpers.
- [.github/workflows](.github/workflows) contains deployment and maintenance workflows.

## Contributing

Development workflow, review expectations, and deployment notes live in [CONTRIBUTING.md](CONTRIBUTING.md).

## Manual build

```bash
npm run build
```
