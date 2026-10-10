import { onRequest } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';

const githubToken = defineSecret('GITHUB_TOKEN');

export const api = onRequest(
  { secrets: [githubToken], cors: true },
  async (req, res) => {
    // Enable CORS and validate method
    if (req.method === 'OPTIONS') {
      res.set('Access-Control-Allow-Origin', '*');
      res.set('Access-Control-Allow-Methods', 'GET');
      res.set('Access-Control-Allow-Headers', 'Content-Type');
      res.status(204).send('');
      return;
    }

    if (req.method !== 'GET') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    const username = 'yogabalan07';
    let token = '';
    try {
      token = process.env.GITHUB_TOKEN || (githubToken ? githubToken.value() : '');
    } catch {
      token = process.env.GITHUB_TOKEN || '';
    }

    // 1. If GITHUB_TOKEN is available, query official GitHub GraphQL API
    if (token) {
      try {
        const gqlRes = await fetch('https://api.github.com/graphql', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'User-Agent': 'ybport-portfolio',
          },
          body: JSON.stringify({
            query: `
              query($username: String!) {
                user(login: $username) {
                  contributionsCollection {
                    contributionCalendar {
                      totalContributions
                      weeks {
                        contributionDays {
                          contributionCount
                          date
                          color
                          contributionLevel
                        }
                      }
                    }
                  }
                }
              }
            `,
            variables: { username },
          }),
        });

        if (!gqlRes.ok) {
          res.status(gqlRes.status).json({
            success: false,
            configured: true,
            message: `GitHub GraphQL API returned status ${gqlRes.status}`,
          });
          return;
        }

        const gqlJson = await gqlRes.json();
        if (gqlJson.errors && gqlJson.errors.length > 0) {
          res.status(400).json({
            success: false,
            configured: true,
            message: gqlJson.errors[0].message,
          });
          return;
        }

        const calendar = gqlJson.data?.user?.contributionsCollection?.contributionCalendar;
        if (!calendar) {
          res.status(404).json({
            success: false,
            configured: true,
            message: 'User contribution calendar not found.',
          });
          return;
        }

        res.status(200).json({
          success: true,
          source: 'github-graphql',
          calendar,
        });
        return;
      } catch (err) {
        console.error('GraphQL call error:', err);
      }
    }

    // 2. Fallback to public GitHub contribution stream (no token needed)
    try {
      const pubRes = await fetch(
        `https://github-contributions-api.jogruber.de/v4/${username}?y=last`,
        { headers: { 'User-Agent': 'ybport-portfolio' } }
      );
      if (pubRes.ok) {
        const pubData = await pubRes.json();
        const rawDays = pubData.contributions || [];
        const weeks = [];
        let currentWeek = [];
        const levelMap = ['NONE', 'FIRST_QUARTILE', 'SECOND_QUARTILE', 'THIRD_QUARTILE', 'FOURTH_QUARTILE'];
        const colorMap = ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'];

        rawDays.forEach((day) => {
          currentWeek.push({
            contributionCount: day.count,
            date: day.date,
            color: colorMap[day.level] || '#ebedf0',
            contributionLevel: levelMap[day.level] || 'NONE',
          });
          if (currentWeek.length === 7) {
            weeks.push({ contributionDays: currentWeek });
            currentWeek = [];
          }
        });
        if (currentWeek.length > 0) {
          weeks.push({ contributionDays: currentWeek });
        }

        const total = rawDays.reduce((acc, c) => acc + c.count, 0);

        res.status(200).json({
          success: true,
          source: 'public-calendar',
          calendar: { totalContributions: total, weeks },
        });
        return;
      }
    } catch (err) {
      console.error('Public calendar fallback error:', err);
    }

    // 3. Setup required response
    res.status(200).json({
      success: false,
      configured: false,
      message: 'Server-side GITHUB_TOKEN not configured in Firebase Secret Manager.',
    });
  }
);
