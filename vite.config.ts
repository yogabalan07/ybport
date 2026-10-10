import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';

function githubContributionsPlugin(): Plugin {
  const handler = async (req: any, res: any, next: any) => {
    const url = req.url?.split('?')[0];
    if (url === '/api/github-contributions') {
      const username = 'yogabalan07';
      const token = process.env.GITHUB_TOKEN;

      // 1. If server-only GITHUB_TOKEN is present, query official GitHub GraphQL API
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
          const gqlJson = await gqlRes.json();
          const calendar = gqlJson.data?.user?.contributionsCollection?.contributionCalendar;
          if (calendar) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, source: 'github-graphql', calendar }));
            return;
          }
        } catch {
          // Fall through to public fallback
        }
      }

      // 2. Fetch public contribution graph data for yogabalan07 (no client tokens needed)
      try {
        const pubRes = await fetch(
          `https://github-contributions-api.jogruber.de/v4/${username}?y=last`,
          {
            headers: { 'User-Agent': 'ybport-portfolio' },
          }
        );
        if (pubRes.ok) {
          const pubData: any = await pubRes.json();
          const rawDays: { date: string; count: number; level: number }[] =
            pubData.contributions || [];

          const weeks: any[] = [];
          let currentWeek: any[] = [];
          const levelMap = [
            'NONE',
            'FIRST_QUARTILE',
            'SECOND_QUARTILE',
            'THIRD_QUARTILE',
            'FOURTH_QUARTILE',
          ] as const;
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

          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(
            JSON.stringify({
              success: true,
              source: 'public-calendar',
              calendar: {
                totalContributions: total,
                weeks,
              },
            })
          );
          return;
        }
      } catch {
        // Fall through to error
      }

      // 3. Fallback error / setup required response
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          success: false,
          configured: !!token,
          message:
            'GitHub GraphQL contributions require server-side authentication (GITHUB_TOKEN with read:user scope). No client-side tokens are accepted.',
        })
      );
      return;
    }
    next();
  };

  return {
    name: 'github-contributions-plugin',
    configureServer(server) {
      server.middlewares.use(handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler);
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), githubContributionsPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      allowedHosts: true as const,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

