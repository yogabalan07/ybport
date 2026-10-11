// Shared GitHub contribution-calendar fetcher.
// Used by BOTH:
//   1. The deployed Firebase Cloud Function (functions/index.js)  -> production /api/github-contributions
//   2. The Vite dev/preview middleware (vite.config.ts)          -> local /api/github-contributions
// Token (if any) is only ever read from a server-side source (Secret Manager / process.env).
// It must NEVER be prefixed VITE_ or otherwise shipped to the browser.

const GITHUB_USERNAME = 'yogabalan07';
const PUBLIC_CALENDAR_API = 'https://github-contributions-api.jogruber.de/v4';
const UPSTREAM_TIMEOUT_MS = 12000;

const LEVEL_MAP = ['NONE', 'FIRST_QUARTILE', 'SECOND_QUARTILE', 'THIRD_QUARTILE', 'FOURTH_QUARTILE'];
const COLOR_MAP = ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'];

const GRAPHQL_QUERY = `
  query ($username: String!) {
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
`;

async function fetchCalendarViaGraphQL(username, token) {
  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'ybport-portfolio',
    },
    body: JSON.stringify({ query: GRAPHQL_QUERY, variables: { username } }),
    signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
  });
  if (!response.ok) return null;
  const payload = await response.json().catch(() => null);
  const calendar = payload?.data?.user?.contributionsCollection?.contributionCalendar;
  if (!calendar || !Array.isArray(calendar.weeks)) return null;
  return calendar;
}

async function fetchCalendarViaPublicApi(username) {
  const response = await fetch(
    `${PUBLIC_CALENDAR_API}/${encodeURIComponent(username)}?y=last`,
    {
      headers: { 'User-Agent': 'ybport-portfolio' },
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    }
  );
  if (!response.ok) return null;
  const payload = await response.json().catch(() => null);
  if (!Array.isArray(payload?.contributions) || payload.contributions.length === 0) return null;

  const days = [...payload.contributions].sort((a, b) => (a.date < b.date ? -1 : 1));
  const weeks = [];
  let currentWeek = [];
  for (const day of days) {
    const rawLevel = Number.isInteger(day.level) ? day.level : 0;
    const level = Math.min(Math.max(rawLevel, 0), 4);
    currentWeek.push({
      contributionCount: typeof day.count === 'number' && day.count >= 0 ? day.count : 0,
      date: day.date,
      color: COLOR_MAP[level],
      contributionLevel: LEVEL_MAP[level],
    });
    if (currentWeek.length === 7) {
      weeks.push({ contributionDays: currentWeek });
      currentWeek = [];
    }
  }
  if (currentWeek.length > 0) weeks.push({ contributionDays: currentWeek });

  const totalContributions = days.reduce(
    (acc, day) => acc + (typeof day.count === 'number' && day.count > 0 ? day.count : 0),
    0
  );

  return { totalContributions, weeks };
}

export async function buildContributionsPayload(token) {
  let calendar = null;
  let source = null;

  if (token) {
    try {
      calendar = await fetchCalendarViaGraphQL(GITHUB_USERNAME, token);
      if (calendar) source = 'github-graphql';
    } catch {
      calendar = null;
    }
  }

  if (!calendar) {
    try {
      calendar = await fetchCalendarViaPublicApi(GITHUB_USERNAME);
      if (calendar) source = 'public-calendar';
    } catch {
      calendar = null;
    }
  }

  if (calendar) {
    return { success: true, source, calendar };
  }

  return {
    success: false,
    configured: Boolean(token),
    message: token
      ? 'Unable to fetch the GitHub contribution calendar right now: both GitHub GraphQL and the public calendar fallback failed. Retry shortly.'
      : 'Unable to fetch the GitHub contribution calendar: no GITHUB_TOKEN is configured server-side and the public calendar fallback failed. Retry shortly.',
  };
}
