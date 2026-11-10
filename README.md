# Expense Tracker PWA

A lightweight, installable mobile web app to track your expenses. It works offline, stores data on your phone, and exports an Excel (`.xlsx`) file on demand. No server, no login, no running costs.

## Features

- Add expenses with amount, category, date, and an optional note
- Prebuilt categories (Food, Groceries, Transport, Shopping, Bills, Health, Entertainment, Rent, Travel, Other)
- Expense list grouped by month with per-month totals
- Edit or delete any expense
- Summary view: total this month, all-time total, and a per-category breakdown
- One-tap export to Excel (`expenses.xlsx`)
- Installable PWA that works fully offline ("Add to Home Screen")

## Tech stack

- Vite + React + TypeScript
- Tailwind CSS
- SheetJS (`xlsx`) for Excel export
- `vite-plugin-pwa` for offline support and installability
- Data persisted in the browser via `localStorage`

## Run locally

```bash
npm install
npm run dev
```

Open the printed `localhost` URL. To test on your phone while developing, run the dev server and visit your computer's LAN IP (e.g. `http://192.168.1.x:5173`) from the phone on the same Wi-Fi.

Build the production bundle:

```bash
npm run build
npm run preview   # serve the build locally to verify
```

## Deploy free on Vercel

1. Push this project to a GitHub repository.
2. Go to [vercel.com](https://vercel.com), "Add New Project", and import the repo.
3. Vercel auto-detects Vite. Defaults are fine:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Deploy. You get an HTTPS URL (HTTPS is required for PWA install).
5. Open that URL on your phone and choose "Add to Home Screen".

Alternative (also free, static hosting): Netlify, or GitHub Pages (see below).

## Deploy free on GitHub Pages

GitHub Pages serves your site from a subpath (`https://<username>.github.io/<repo>/`), so you must tell Vite that base path first, otherwise the assets and service worker won't load.

1. Set the base path in [vite.config.ts](vite.config.ts) to your repo name (keep the leading and trailing slash):

   ```ts
   export default defineConfig({
     base: '/<repo-name>/',
     plugins: [
       // ...existing react() and VitePWA() config
     ],
   });
   ```

   `vite-plugin-pwa` automatically uses this base for the manifest `start_url` and `scope`, so the installable PWA keeps working on the subpath.

2. Push this project to a GitHub repository.
3. Add a deploy workflow at `.github/workflows/deploy.yml`:

   ```yaml
   name: Deploy to GitHub Pages

   on:
     push:
       branches: [main]

   permissions:
     contents: read
     pages: write
     id-token: write

   jobs:
     build:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-node@v4
           with:
             node-version: 20
         - run: npm ci
         - run: npm run build
         - uses: actions/upload-pages-artifact@v3
           with:
             path: dist
     deploy:
       needs: build
       runs-on: ubuntu-latest
       environment:
         name: github-pages
         url: ${{ steps.deployment.outputs.page_url }}
       steps:
         - id: deployment
           uses: actions/deploy-pages@v4
   ```

4. In the repo on GitHub, go to Settings -> Pages -> "Build and deployment" -> Source -> select "GitHub Actions".
5. Push to `main`. The workflow builds and publishes automatically.
6. Your app is live at `https://<username>.github.io/<repo>/` over HTTPS (required for PWA install). Open it on your phone and choose "Add to Home Screen".

Tip: GitHub Pages only serves static files, which is all this app needs. If you ever rename the repo, update `base` in `vite.config.ts` to match.

## Install on your phone

- iOS (Safari): Share button -> "Add to Home Screen".
- Android (Chrome): menu -> "Install app" / "Add to Home Screen".

After installing, the app launches full-screen and works offline.

## Data and backup

- Your expenses live in the browser storage on that device. Clearing site data or uninstalling removes them.
- Use the Excel export regularly as your backup.

## Customizing

- Currency symbol: change `CURRENCY` in [src/types.ts](src/types.ts).
- Categories: edit the `CATEGORIES` array in [src/types.ts](src/types.ts).

## Possible future add-ons

- Google Sheets sync (Google Identity + Sheets API)
- Charts, monthly budgets/limits, recurring expenses, multi-currency, CSV import
