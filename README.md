# Playground

A small React + Vite app built with TypeScript.

## About

This project is a Vite-powered React app. It includes a simple frontend and can be run locally with npm commands.

## Getting Started

Install dependencies:

```bash
npm install
```

Run locally:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Run tests:

```bash
npm test
```

## GitHub Upload

1. Create a GitHub repository.
2. In this folder, add the repository remote:

```bash
git remote add origin https://github.com/<your-username>/<repo-name>.git
```

3. Push the local commits:

```bash
git push -u origin main
```

If your default branch is `master`, replace `main` with `master`.

## Deployment

This repository includes a GitHub Actions workflow to deploy the built app to GitHub Pages automatically after pushing to `main` or `master`.

After the first successful push:

1. Open the repository on GitHub.
2. Go to `Settings` > `Pages`.
3. Choose the `gh-pages` branch and `/ (root)` folder.
4. Save.

Your site URL will look like:

- `https://<your-username>.github.io/<repo-name>/`

> Note: If you deploy to a project page, you may need to set a `base` path in `vite.config.ts` after you know your repository name.

## Workflow

The workflow builds the app and deploys the `dist` output to the `gh-pages` branch using GitHub Pages.
