// Firebase Cloud Function (2nd gen, Node 20) backing GET /api/github-contributions
// on Firebase Hosting via the rewrite in firebase.json.
//
// Security model:
//   - GITHUB_TOKEN is injected from Google Secret Manager at runtime (defineSecret).
//     It is NEVER present in the frontend bundle, VITE_ vars, or the repo.
//   - Without a token the function still returns genuine contribution data via the
//     public GitHub contribution stream; the token only upgrades the source to the
//     official GraphQL contributionCalendar API.
//   - Responses are cached in-memory for a short window to cut cold-start latency
//     and upstream rate-limit pressure. No mock data is ever produced.

import { onRequest } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import { buildContributionsPayload } from './contributions.js';

const githubToken = defineSecret('GITHUB_TOKEN');

const CACHE_TTL_MS = 5 * 60 * 1000;
let cache = { payload: null, fetchedAt: 0 };

export const githubContributions = onRequest(
  {
    region: 'us-central1',
    memory: '256MiB',
    timeoutSeconds: 30,
    secrets: [githubToken],
    cors: false,
  },
  async (req, res) => {
    if (req.method !== 'GET') {
      res.status(405).set('Content-Type', 'application/json').send(
        JSON.stringify({ success: false, message: 'Method not allowed. Use GET.' })
      );
      return;
    }

    const now = Date.now();
    if (cache.payload && now - cache.fetchedAt < CACHE_TTL_MS) {
      res.set('Cache-Control', 'public, max-age=300');
      res.status(200).send(JSON.stringify(cache.payload));
      return;
    }

    try {
      const payload = await buildContributionsPayload(githubToken.value() || '');
      cache = { payload, fetchedAt: now };
      res.set('Content-Type', 'application/json');
      res.set('Cache-Control', 'public, max-age=300');
      res.status(200).send(JSON.stringify(payload));
    } catch (err) {
      console.error('github-contributions fetch failed', err);
      res.status(502).set('Content-Type', 'application/json').send(
        JSON.stringify({
          success: false,
          message: 'Upstream GitHub contribution fetch failed. Retry shortly.',
        })
      );
    }
  }
);
