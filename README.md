# Yogabalan B R — Portfolio

Personal portfolio site: embedded systems, IoT, and full-stack projects, rendered as an engineering sketchbook.

**Stack:** React 19 · TypeScript 7 · Vite 8 · Tailwind CSS 4 · Motion · lucide-react

## Run Locally

**Prerequisites:** Node.js 20.19+ (tested on Node 22) and npm

1. Install dependencies:

   ```
   npm install
   ```

2. Start the dev server (http://localhost:3000):

   ```
   npm run dev
   ```

3. Type-check:

   ```
   npm run lint
   ```

4. Production build (outputs `dist/`):

   ```
   npm run build
   ```

5. Preview the production build:

   ```
   npm run preview
   ```

No environment variables are required — the site is fully static and client-side.

## Notes

- This repo originally shipped a `bun.lock`; npm is the documented and tested package manager (`package-lock.json`).
- Contact form opens the visitor's own email client via `mailto:` — there is no backend.
- GitHub stats are fetched live from the public GitHub API with verified static fallbacks.
