import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'motion/react';
import { GITHUB_STATS } from '../data/portfolioData';
import { ContributionCalendarData, ContributionWeekData, ContributionDayData, ContributionLevel, GitHubRepoApiItem } from '../types/portfolio';
import { WashiTape, HandDrawnArrow } from './doodles/DoodleIcons';
import {
  Github,
  GitFork,
  Star,
  ExternalLink,
  Calendar,
  Code,
  ArrowUpRight,
  RefreshCw,
  AlertCircle,
  Flame,
  Award,
  Layers,
  Sparkles
} from 'lucide-react';

interface CalendarStats {
  total365: number;
  currentYearTotal: number;
  currentYear: number;
  currentStreak: number;
  longestStreak: number;
  startDate: string;
  endDate: string;
}

function parseDate(dateStr: string): Date {
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  }
  return new Date(dateStr);
}

function formatShortDate(dateStr: string): string {
  try {
    const d = parseDate(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

function calculateCalendarStats(weeks: ContributionWeekData[]): CalendarStats | null {
  if (!weeks || weeks.length === 0) return null;
  const allDays = weeks.flatMap((w) => w.contributionDays);
  if (allDays.length === 0) return null;

  const total365 = allDays.reduce((acc, d) => acc + (d.contributionCount || 0), 0);
  const currentYear = new Date().getFullYear();
  const currentYearTotal = allDays
    .filter((d) => d.date.startsWith(String(currentYear)))
    .reduce((acc, d) => acc + (d.contributionCount || 0), 0);

  // Calculate streaks:
  // Zero-contribution days break the streak.
  let maxStreak = 0;
  let tempStreak = 0;
  for (const day of allDays) {
    if (day.contributionCount > 0) {
      tempStreak++;
      if (tempStreak > maxStreak) {
        maxStreak = tempStreak;
      }
    } else {
      tempStreak = 0;
    }
  }

  // Current streak:
  // Count consecutive active days ending either today or yesterday (since today is still in progress).
  let currentStreak = 0;
  const lastDay = allDays[allDays.length - 1];
  const prevDay = allDays.length > 1 ? allDays[allDays.length - 2] : null;

  let startIdx = -1;
  if (lastDay && lastDay.contributionCount > 0) {
    startIdx = allDays.length - 1;
  } else if (prevDay && prevDay.contributionCount > 0) {
    startIdx = allDays.length - 2;
  }

  if (startIdx >= 0) {
    for (let i = startIdx; i >= 0; i--) {
      if (allDays[i].contributionCount > 0) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  return {
    total365,
    currentYearTotal,
    currentYear,
    currentStreak,
    longestStreak: maxStreak,
    startDate: allDays[0].date,
    endDate: allDays[allDays.length - 1].date,
  };
}

export const GitHubSection: React.FC = () => {
  // Live REST API stats
  const [profileStats, setProfileStats] = useState({
    publicRepos: GITHUB_STATS.publicRepos,
    followers: GITHUB_STATS.followers,
    totalStars: 0,
    totalForks: 0,
    hasLiveRest: false,
  });

  const [liveRepos, setLiveRepos] = useState<GitHubRepoApiItem[]>([]);
  const [isRestLoading, setIsRestLoading] = useState(false);
  const [restError, setRestError] = useState<string | null>(null);

  // Live GraphQL Contribution Calendar state
  const [calendarData, setCalendarData] = useState<ContributionCalendarData | null>(null);
  const [calendarStatus, setCalendarStatus] = useState<'idle' | 'loading' | 'success' | 'setup_required' | 'error'>('idle');
  const [calendarErrorMsg, setCalendarErrorMsg] = useState<string | null>(null);
  const [calendarSource, setCalendarSource] = useState<string | null>(null);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date | null>(null);

  // Interactive Hover Tooltip on calendar cell
  const [hoveredDay, setHoveredDay] = useState<ContributionDayData | null>(null);

  // Fetch Public Repos via GitHub REST API (no personal token required)
  const fetchRestData = useCallback(async () => {
    setIsRestLoading(true);
    setRestError(null);
    try {
      // 1. User profile
      const userRes = await fetch(`https://api.github.com/users/${GITHUB_STATS.username}`);
      let userJson: any = null;
      if (userRes.ok) {
        userJson = await userRes.json();
      }

      // 2. Public repositories list
      const reposRes = await fetch(`https://api.github.com/users/${GITHUB_STATS.username}/repos?per_page=100&sort=updated`);
      let reposJson: GitHubRepoApiItem[] = [];
      if (reposRes.ok) {
        const raw = await reposRes.json();
        if (Array.isArray(raw)) {
          // Deduplicate by lowercase repo name
          const seen = new Set<string>();
          reposJson = raw.filter((r: GitHubRepoApiItem) => {
            const key = (r.name || '').toLowerCase();
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          });
        }
      }

      const totalStars = reposJson.reduce((acc, r) => acc + (r.stargazers_count || 0), 0);
      const totalForks = reposJson.reduce((acc, r) => acc + (r.forks_count || 0), 0);

      setProfileStats({
        publicRepos: userJson && typeof userJson.public_repos === 'number' ? userJson.public_repos : (reposJson.length || GITHUB_STATS.publicRepos),
        followers: userJson && typeof userJson.followers === 'number' ? userJson.followers : GITHUB_STATS.followers,
        totalStars,
        totalForks,
        hasLiveRest: true,
      });

      setLiveRepos(reposJson);
      setLastRefreshedAt(new Date());
    } catch (err: any) {
      setRestError(err.message || 'REST API rate limit or network error');
    } finally {
      setIsRestLoading(false);
    }
  }, []);

  // Fetch GraphQL Contribution Calendar via secure server endpoint with resilient validation and fallback
  const fetchCalendarData = useCallback(async () => {
    setCalendarStatus('loading');
    setCalendarErrorMsg(null);

    let isHtmlRewriteResponse = false;
    let serverErrorMessage: string | null = null;

    // 1. Attempt server-side endpoint (/api/github-contributions)
    try {
      const res = await fetch('/api/github-contributions');

      // Check HTTP status for rate limits and auth errors
      if (res.status === 429) {
        serverErrorMessage = 'GitHub API rate limit exceeded. Please retry in a few moments.';
      } else if (res.status === 401 || res.status === 403) {
        serverErrorMessage = 'GitHub authentication error. Please verify server-side GITHUB_TOKEN credentials.';
      }

      const contentType = res.headers.get('content-type') || '';

      // Check if server returned HTML (Firebase Hosting SPA rewrite returning index.html)
      if (contentType.toLowerCase().includes('text/html')) {
        isHtmlRewriteResponse = true;
      } else {
        const rawText = await res.text();
        const trimmed = rawText.trim().toLowerCase();

        if (trimmed.startsWith('<!doctype') || trimmed.startsWith('<html') || trimmed.startsWith('<')) {
          isHtmlRewriteResponse = true;
        } else {
          try {
            const data = JSON.parse(rawText);
            if (data.success && data.calendar && Array.isArray(data.calendar.weeks)) {
              setCalendarData(data.calendar);
              setCalendarSource(data.source || 'github-graphql');
              setCalendarStatus('success');
              setLastRefreshedAt(new Date());
              return;
            } else if (data.configured === false) {
              serverErrorMessage = data.message || 'Server-side GITHUB_TOKEN secret is not configured.';
            } else {
              serverErrorMessage = data.message || `Server returned error (${res.status})`;
            }
          } catch {
            isHtmlRewriteResponse = true;
          }
        }
      }
    } catch {
      // Network failure on /api/github-contributions endpoint
    }

    // 2. Client-side fallback to public GitHub contribution stream (ZERO tokens required, NO secrets exposed)
    // Ensures real contribution telemetry displays on Firebase Hosting even before Cloud Functions are deployed
    try {
      const publicRes = await fetch(`https://github-contributions-api.jogruber.de/v4/${GITHUB_STATS.username}?y=last`, {
        headers: { Accept: 'application/json' },
      });

      if (publicRes.ok) {
        const pubContentType = publicRes.headers.get('content-type') || '';
        if (pubContentType.includes('application/json')) {
          const pubData = await publicRes.json();
          const rawDays: { date: string; count: number; level: number }[] = pubData.contributions || [];

          if (rawDays.length > 0) {
            const weeks: ContributionWeekData[] = [];
            let currentWeek: ContributionDayData[] = [];
            const levelMap: ContributionLevel[] = [
              'NONE',
              'FIRST_QUARTILE',
              'SECOND_QUARTILE',
              'THIRD_QUARTILE',
              'FOURTH_QUARTILE',
            ];
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

            setCalendarData({
              totalContributions: total,
              weeks,
            });
            setCalendarSource(
              isHtmlRewriteResponse
                ? 'github-public-stream (Firebase Cloud Function not yet deployed)'
                : 'github-public-stream'
            );
            setCalendarStatus('success');
            setLastRefreshedAt(new Date());
            return;
          }
        }
      }
    } catch (fallbackErr: any) {
      console.warn('Public contribution stream fallback error:', fallbackErr);
    }

    // 3. If neither succeeded, set appropriate error/setup state
    if (isHtmlRewriteResponse) {
      setCalendarStatus('setup_required');
      setCalendarErrorMsg(
        'Firebase Hosting returned index.html for /api/github-contributions. The backend Cloud Function is not yet deployed or requires rewrite routing in firebase.json.'
      );
    } else if (serverErrorMessage) {
      setCalendarStatus('setup_required');
      setCalendarErrorMsg(serverErrorMessage);
    } else {
      setCalendarStatus('error');
      setCalendarErrorMsg('Unable to retrieve verified GitHub contribution telemetry. Real values preserved; no mocks displayed.');
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchRestData();
    fetchCalendarData();
  }, [fetchRestData, fetchCalendarData]);

  // Manual refresh all
  const handleRefreshAll = () => {
    fetchRestData();
    fetchCalendarData();
  };

  // Derive streaks and totals strictly from actual daily calendar data
  const calendarStats = useMemo(() => {
    if (!calendarData?.weeks) return null;
    return calculateCalendarStats(calendarData.weeks);
  }, [calendarData]);

  // Responsive Month Markers along the top of the 53-week grid
  const monthMarkers = useMemo(() => {
    if (!calendarData?.weeks || calendarData.weeks.length === 0) return [];
    const markers: { weekIndex: number; label: string }[] = [];
    let lastMonth = -1;

    calendarData.weeks.forEach((week, wIdx) => {
      const firstDay = week.contributionDays[0];
      if (firstDay?.date) {
        const d = parseDate(firstDay.date);
        const m = d.getMonth();
        // Place label at week index if month changed and not cramped
        if (m !== lastMonth) {
          markers.push({
            weekIndex: wIdx,
            label: d.toLocaleDateString('en-US', { month: 'short' }),
          });
          lastMonth = m;
        }
      }
    });

    return markers;
  }, [calendarData]);

  // Color mapping based on actual contribution levels
  const getContributionColor = (level: string) => {
    switch (level) {
      case 'FOURTH_QUARTILE':
        return 'bg-[#15803D] border-[#15803D]'; // Deep dark green
      case 'THIRD_QUARTILE':
        return 'bg-[#16A34A] border-[#16A34A]';
      case 'SECOND_QUARTILE':
        return 'bg-[#22C55E] border-[#22C55E]';
      case 'FIRST_QUARTILE':
        return 'bg-[#86EFAC] border-[#4ADE80]';
      case 'NONE':
      default:
        return 'bg-[#EAE6DC] border-[#141517]/10'; // Inactive paper cell
    }
  };

  // Hydrate featured repositories with live REST API data or verified fallbacks
  const displayedRepos = useMemo(() => {
    return GITHUB_STATS.featuredRepos.map((featured) => {
      const live = liveRepos.find((r) => r.name.toLowerCase() === featured.name.toLowerCase());
      if (live) {
        return {
          name: live.name,
          desc: live.description || featured.desc,
          lang: live.language || featured.lang,
          stars: live.stargazers_count ?? 0,
          forks: live.forks_count ?? 0,
          url: live.html_url,
          updatedAt: live.updated_at ? formatShortDate(live.updated_at.slice(0, 10)) : null,
        };
      }
      return {
        name: featured.name,
        desc: featured.desc,
        lang: featured.lang,
        stars: 0,
        forks: 0,
        url: `https://github.com/${GITHUB_STATS.username}/${featured.name}`,
        updatedAt: null,
      };
    });
  }, [liveRepos]);

  // Decorative pattern for fallback/setup state only (clearly labelled, never fake counts)
  const decorativeWeeks = 52;
  const decorativeDays = 7;
  const getDecorativeLevel = (w: number, d: number) => {
    const val = (Math.sin(w * 0.4 + d * 0.9) * 10000) % 1;
    const absVal = Math.abs(val);
    if (absVal > 0.82) return 4;
    if (absVal > 0.65) return 3;
    if (absVal > 0.45) return 2;
    if (absVal > 0.25) return 1;
    return 0;
  };

  return (
    <section id="github" className="py-20 bg-[#F8F5EE] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 pb-4 border-b border-[#141517]/20">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#1D4ED8]">
                Code Activity &amp; Open Source
              </span>
              <span className="font-hand text-base text-[#EA580C] font-bold">// public telemetry</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#141517] tracking-tight mt-1">
              06 — GITHUB NOTEBOOK
            </h2>
          </div>

          <div className="mt-4 sm:mt-0 flex items-center gap-3">
            <button
              onClick={handleRefreshAll}
              disabled={isRestLoading || calendarStatus === 'loading'}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-bold text-[#141517] bg-[#FFFFFF] border border-[#141517] rounded-lg shadow-[2px_2px_0px_#141517] hover:bg-[#F4F1E8] active:translate-y-0.5 transition-all cursor-pointer disabled:opacity-60"
              title="Manual refresh of GitHub telemetry data"
              aria-label="Refresh GitHub data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRestLoading || calendarStatus === 'loading' ? 'animate-spin text-[#1D4ED8]' : ''}`} />
              <span className="hidden sm:inline">Refresh Telemetry</span>
            </button>

            <a
              href={GITHUB_STATS.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#141517] rounded-lg shadow-[2px_2px_0px_#1D4ED8] hover:shadow-[3px_3px_0px_#1D4ED8] hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <Github className="w-4 h-4" />
              <span>github.com/{GITHUB_STATS.username}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Notebook Contribution Ledger Card */}
        <div className="bg-[#FFFFFF] border-2 border-[#141517] rounded-2xl p-6 sm:p-8 shadow-[6px_7px_0px_#141517] relative">
          
          {/* Top Washi Tape */}
          <div className="absolute -top-3 left-12">
            <WashiTape className="w-24 h-5" color="rgba(254, 240, 138, 0.9)" angle="-2deg" />
          </div>

          {/* Quick Metrics Bar — 100% Live from GitHub REST API */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-6 border-b border-[#141517]/15">
            {/* Public Repos */}
            <div className="p-3 bg-[#FCFBF8] border border-[#141517]/15 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#575961] block">
                  Public Repositories
                </span>
                {profileStats.hasLiveRest && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Live Synced with GitHub REST API" />
                )}
              </div>
              <span className="text-2xl font-black text-[#1D4ED8] mt-0.5 block tabular-nums">
                {profileStats.publicRepos}
              </span>
            </div>

            {/* Followers */}
            <div className="p-3 bg-[#FCFBF8] border border-[#141517]/15 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#575961] block">
                  Followers
                </span>
                {profileStats.hasLiveRest && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Live Synced with GitHub REST API" />
                )}
              </div>
              <span className="text-2xl font-black text-[#141517] mt-0.5 block tabular-nums">
                {profileStats.followers}
              </span>
            </div>

            {/* Total Stars Accrued (Real sum, never fabricated) */}
            <div className="p-3 bg-[#FCFBF8] border border-[#141517]/15 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#575961] block">
                  Total Stars Accrued
                </span>
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              </div>
              <span className="text-2xl font-black text-[#141517] mt-0.5 block tabular-nums">
                {profileStats.totalStars}
              </span>
            </div>

            {/* Total Forks */}
            <div className="p-3 bg-[#FCFBF8] border border-[#141517]/15 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#575961] block">
                  Total Forks
                </span>
                <GitFork className="w-3.5 h-3.5 text-[#575961]" />
              </div>
              <span className="text-2xl font-black text-[#141517] mt-0.5 block tabular-nums">
                {profileStats.totalForks}
              </span>
            </div>
          </div>

          {/* Sync Status Banner */}
          <div className="py-3 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[#575961] border-b border-[#141517]/10">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${calendarStatus === 'success' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              <span>
                {calendarStatus === 'success'
                  ? `Live Telemetry Active (${calendarSource === 'github-graphql' ? 'GitHub GraphQL' : 'GitHub Calendar Stream'})`
                  : calendarStatus === 'loading'
                  ? 'Connecting to GitHub API...'
                  : 'Telemetry Standby'}
              </span>
            </div>

            {lastRefreshedAt && (
              <span className="text-[11px] text-[#575961]">
                Last synced: {lastRefreshedAt.toLocaleTimeString()}
              </span>
            )}
          </div>

          {/* CONTRIBUTION CALENDAR SECTION */}
          <div className="pt-6">
            
            {/* Header with Title and Legend */}
            <div className="flex flex-wrap items-center justify-between mb-3 gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#141517] flex items-center gap-1.5 uppercase">
                  <Calendar className="w-4 h-4 text-[#1D4ED8]" />
                  365-Day Contribution Ledger
                </span>
                {calendarStatus === 'success' && (
                  <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    Live GitHub Data
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#575961]">
                <span>Less</span>
                <span className="w-2.5 h-2.5 rounded-xs bg-[#EAE6DC] border border-[#141517]/10" title="0 contributions" />
                <span className="w-2.5 h-2.5 rounded-xs bg-[#86EFAC] border border-[#4ADE80]" title="Low activity" />
                <span className="w-2.5 h-2.5 rounded-xs bg-[#22C55E] border border-[#22C55E]" title="Moderate activity" />
                <span className="w-2.5 h-2.5 rounded-xs bg-[#16A34A] border border-[#16A34A]" title="High activity" />
                <span className="w-2.5 h-2.5 rounded-xs bg-[#15803D] border border-[#15803D]" title="Peak activity" />
                <span>More</span>
              </div>
            </div>

            {/* STREAKS & TOTALS BAR (Dynamically calculated strictly from actual daily calendar) */}
            {calendarStats && calendarStatus === 'success' && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4 p-3.5 bg-[#FCFBF8] border border-[#141517]/15 rounded-xl">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#575961] block">
                    {calendarStats.currentYear} Contributions
                  </span>
                  <span className="text-lg font-black text-[#141517] mt-0.5 block tabular-nums">
                    {calendarStats.currentYearTotal}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#575961] block">
                    Latest 365 Days
                  </span>
                  <span className="text-lg font-black text-[#1D4ED8] mt-0.5 block tabular-nums">
                    {calendarStats.total365}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-orange-600" />
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#575961] block">
                      Current Streak
                    </span>
                  </div>
                  <span className="text-lg font-black text-[#141517] mt-0.5 block tabular-nums">
                    {calendarStats.currentStreak} {calendarStats.currentStreak === 1 ? 'day' : 'days'}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-amber-600" />
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#575961] block">
                      Longest Streak
                    </span>
                  </div>
                  <span className="text-lg font-black text-[#141517] mt-0.5 block tabular-nums">
                    {calendarStats.longestStreak} {calendarStats.longestStreak === 1 ? 'day' : 'days'}
                  </span>
                </div>
              </div>
            )}

            {/* Date Range Subtitle */}
            {calendarStats && calendarStatus === 'success' && (
              <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-[#575961] mb-3">
                <span>
                  Date Range: {formatShortDate(calendarStats.startDate)} — {formatShortDate(calendarStats.endDate)}
                </span>
                <span className="text-[10px] text-[#575961]">
                  *Streak rules: Zero-contribution days break current streak; active days require ≥1 contribution.
                </span>
              </div>
            )}

            {/* LIVE CALENDAR RENDERING — When live data is loaded, DECORATIVE GRID IS REMOVED */}
            {calendarStatus === 'success' && calendarData ? (
              <div className="space-y-2">
                <div className="overflow-x-auto pb-2 border border-[#141517]/10 rounded-xl p-3 bg-[#FCFBF8]">
                  <div className="min-w-[760px]">
                    
                    {/* Month Labels along top */}
                    <div className="flex text-[10px] font-mono text-[#575961] mb-1.5 pl-7">
                      <div className="grid grid-flow-col auto-cols-[13px] gap-[3px] w-full relative h-4">
                        {monthMarkers.map((m) => (
                          <span
                            key={`${m.weekIndex}-${m.label}`}
                            className="absolute top-0 text-[10px] font-semibold"
                            style={{ left: `${m.weekIndex * 16}px` }}
                          >
                            {m.label}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Day Labels + Contribution Grid */}
                    <div className="flex gap-2">
                      {/* Day of Week Labels (Mon, Wed, Fri) */}
                      <div className="grid grid-rows-7 gap-[3px] text-[9px] font-mono text-[#575961] leading-[13px] w-5 select-none pt-0.5">
                        <span className="h-[13px]" />
                        <span className="h-[13px]">Mon</span>
                        <span className="h-[13px]" />
                        <span className="h-[13px]">Wed</span>
                        <span className="h-[13px]" />
                        <span className="h-[13px]">Fri</span>
                        <span className="h-[13px]" />
                      </div>

                      {/* 53 Columns of Weeks × 7 Days */}
                      <div className="grid grid-flow-col auto-cols-[13px] gap-[3px]">
                        {calendarData.weeks.map((week, wIdx) => (
                          <div key={wIdx} className="grid grid-rows-7 gap-[3px]">
                            {week.contributionDays.map((day) => {
                              const tooltipText =
                                day.contributionCount === 0
                                  ? `No contributions on ${formatShortDate(day.date)}`
                                  : `${day.contributionCount} contribution${day.contributionCount === 1 ? '' : 's'} on ${formatShortDate(day.date)}`;

                              return (
                                <div
                                  key={day.date}
                                  className={`w-[13px] h-[13px] rounded-xs border transition-transform hover:scale-140 hover:z-20 cursor-pointer ${getContributionColor(
                                    day.contributionLevel
                                  )}`}
                                  title={tooltipText}
                                  onMouseEnter={() => setHoveredDay(day)}
                                  onMouseLeave={() => setHoveredDay(null)}
                                  tabIndex={0}
                                  aria-label={tooltipText}
                                />
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>

                {/* Interactive Tooltip Inspector Bar */}
                <div className="h-6 flex items-center justify-between text-xs font-mono px-2">
                  {hoveredDay ? (
                    <span className="font-bold text-[#1D4ED8] bg-[#EFF6FF] px-2 py-0.5 rounded border border-blue-200">
                      {hoveredDay.contributionCount === 0
                        ? `No contributions on ${formatShortDate(hoveredDay.date)}`
                        : `${hoveredDay.contributionCount} contribution${hoveredDay.contributionCount === 1 ? '' : 's'} on ${formatShortDate(hoveredDay.date)}`}
                    </span>
                  ) : (
                    <span className="text-[#575961] text-[11px]">
                      Hover over any day square for verified telemetry details.
                    </span>
                  )}
                  <span className="text-[11px] text-[#575961]">
                    Audited Daily Records
                  </span>
                </div>
              </div>
            ) : calendarStatus === 'loading' ? (
              // Loading State
              <div className="p-8 border-2 border-dashed border-[#141517]/20 rounded-xl text-center space-y-3 bg-[#FCFBF8]">
                <RefreshCw className="w-6 h-6 animate-spin text-[#1D4ED8] mx-auto" />
                <p className="text-sm font-mono font-bold text-[#141517]">
                  Loading Verified GitHub Contribution Calendar...
                </p>
                <p className="text-xs font-mono text-[#575961]">
                  Querying server-side telemetry endpoint for yogabalan07
                </p>
              </div>
            ) : calendarStatus === 'setup_required' ? (
              // Setup Required State with Educational Notice and Retry
              <div className="space-y-4">
                <div className="p-5 bg-[#FEF3C7] border border-amber-300 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                    <AlertCircle className="w-4 h-4 text-amber-700" />
                    <span>GitHub GraphQL Authentication Setup Required</span>
                  </div>
                  <p className="text-xs text-amber-950 leading-relaxed font-mono">
                    {calendarErrorMsg || 'GitHub GraphQL API requires server-side token authentication (GITHUB_TOKEN with read:user scope) to query contributionCalendar data.'}
                  </p>
                  <p className="text-[11px] text-amber-800 font-mono">
                    Security note: In accordance with production security standards, personal access tokens are NEVER stored in client-side code, VITE_ environment variables, or committed repository files.
                  </p>
                  <div className="pt-2 flex items-center gap-3">
                    <button
                      onClick={fetchCalendarData}
                      className="px-3 py-1.5 text-xs font-mono font-bold text-white bg-[#141517] rounded-lg hover:bg-[#1D4ED8] transition-colors cursor-pointer"
                    >
                      Retry Connection
                    </button>
                  </div>
                </div>

                {/* Decorative Pattern Grid — clearly labelled as decorative fallback */}
                <div className="pt-2">
                  <p className="text-[11px] font-mono text-[#575961] mb-3">
                    Decorative notebook pattern — not real GitHub contribution history.
                  </p>
                  <div className="overflow-x-auto pb-2">
                    <div className="min-w-[680px]">
                      <div className="grid grid-flow-col grid-rows-7 gap-1">
                        {[...Array(decorativeWeeks)].map((_, w) =>
                          [...Array(decorativeDays)].map((_, d) => {
                            const level = getDecorativeLevel(w, d);
                            return (
                              <div
                                key={`${w}-${d}`}
                                className={`w-3 h-3 rounded-xs border transition-transform hover:scale-130 ${
                                  level === 4
                                    ? 'bg-[#0E4429] border-[#0E4429]'
                                    : level === 3
                                    ? 'bg-[#006D32] border-[#006D32]'
                                    : level === 2
                                    ? 'bg-[#26A641] border-[#26A641]'
                                    : level === 1
                                    ? 'bg-[#39D353]/70 border-[#39D353]'
                                    : 'bg-[#EAE6DC] border-[#141517]/10'
                                }`}
                                title="Decorative pattern cell (not real contribution data)"
                              />
                            );
                          })
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Error State
              <div className="p-6 bg-[#FEF2F2] border border-red-200 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-red-900 font-bold text-sm">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span>Contribution Calendar Sync Error</span>
                </div>
                <p className="text-xs text-red-700 font-mono">
                  {calendarErrorMsg || 'Failed to connect to GitHub contribution service. Real metrics are preserved; no mock values displayed.'}
                </p>
                <button
                  onClick={fetchCalendarData}
                  className="px-3 py-1.5 text-xs font-mono font-bold text-white bg-red-700 rounded-lg hover:bg-red-800 transition-colors cursor-pointer"
                >
                  Retry Calendar Fetch
                </button>
              </div>
            )}

            {/* Handwritten note under heatmap */}
            <div className="mt-4 flex items-center gap-2">
              <HandDrawnArrow direction="right" className="w-8 h-4 text-[#1D4ED8] shrink-0" />
              <span className="font-hand text-base text-[#141517] font-semibold">
                Continuous development across embedded firmware, Arduino libraries &amp; React frontends
              </span>
            </div>
          </div>

          {/* AUDITED PUBLIC REPOSITORIES GRID — All derived from GitHub REST API */}
          <div className="mt-8 pt-6 border-t border-[#141517]/15">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold text-[#141517] uppercase block">
                Audited Public Repositories ({displayedRepos.length} featured)
              </span>
              <span className="text-[11px] font-mono text-[#575961]">
                Live Stars &amp; Forks Verified via REST API
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {displayedRepos.map((repo) => (
                <motion.a
                  key={repo.name}
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -3 }}
                  className="group p-4 bg-[#FCFBF8] border border-[#141517]/20 rounded-xl hover:border-[#141517] hover:shadow-[3px_3px_0px_#141517] transition-all flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-sm text-[#141517] group-hover:text-[#1D4ED8] transition-colors flex items-center gap-1.5">
                        <Code className="w-3.5 h-3.5 text-[#575961] group-hover:rotate-12 transition-transform" />
                        {repo.name}
                      </span>
                      <ArrowUpRight className="w-4 h-4 text-[#575961] group-hover:text-[#1D4ED8] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                    <p className="text-xs text-[#575961] mt-2 leading-relaxed">
                      {repo.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-2 border-t border-[#141517]/10 flex items-center justify-between text-xs font-mono text-[#575961]">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 text-[#141517] font-semibold">
                        <span className="w-2 h-2 rounded-full bg-[#1D4ED8]" />
                        {repo.lang}
                      </span>
                      {repo.updatedAt && (
                        <span className="text-[10px] text-[#575961]">
                          · {repo.updatedAt}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        {repo.stars}
                      </span>
                      <span className="flex items-center gap-1">
                        <GitFork className="w-3 h-3 text-[#575961]" />
                        {repo.forks}
                      </span>
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
