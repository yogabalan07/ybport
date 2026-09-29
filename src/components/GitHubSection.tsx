import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { GITHUB_STATS } from '../data/portfolioData';
import { WashiTape, HandDrawnArrow } from './doodles/DoodleIcons';
import { Github, GitFork, Star, ExternalLink, Calendar, Code, ArrowUpRight } from 'lucide-react';

export const GitHubSection: React.FC = () => {
  const [liveStats, setLiveStats] = useState({
    publicRepos: GITHUB_STATS.publicRepos,
    followers: GITHUB_STATS.followers,
    hasLive: false,
  });

  useEffect(() => {
    fetch(`https://api.github.com/users/${GITHUB_STATS.username}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && typeof data.public_repos === 'number') {
          setLiveStats({
            publicRepos: data.public_repos,
            followers: typeof data.followers === 'number' ? data.followers : GITHUB_STATS.followers,
            hasLive: true,
          });
        }
      })
      .catch(() => {
        // graceful offline / rate-limit fallback to verified static counts
      });
  }, []);

  // Decorative 52-week pattern (visual only — not real contribution history)
  const weeks = 52;
  const daysPerWeek = 7;
  
  const getPatternLevel = (w: number, d: number) => {
    const val = (Math.sin(w * 0.4 + d * 0.9) * 10000) % 1;
    const absVal = Math.abs(val);
    if (absVal > 0.82) return 4;
    if (absVal > 0.65) return 3;
    if (absVal > 0.45) return 2;
    if (absVal > 0.25) return 1;
    return 0;
  };

  const getCellColor = (level: number) => {
    switch (level) {
      case 4: return 'bg-[#0E4429] border-[#0E4429]'; // Dark green
      case 3: return 'bg-[#006D32] border-[#006D32]';
      case 2: return 'bg-[#26A641] border-[#26A641]';
      case 1: return 'bg-[#39D353]/70 border-[#39D353]';
      default: return 'bg-[#EAE6DC] border-[#141517]/10'; // Inactive paper cell
    }
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

          <a
            href={GITHUB_STATS.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 sm:mt-0 flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#141517] rounded-lg shadow-[2px_2px_0px_#1D4ED8] hover:shadow-[3px_3px_0px_#1D4ED8] hover:-translate-y-0.5 transition-all self-start sm:self-auto cursor-pointer"
          >
            <Github className="w-4 h-4" />
            <span>github.com/{GITHUB_STATS.username}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Notebook Contribution Ledger Card */}
        <div className="bg-[#FFFFFF] border-2 border-[#141517] rounded-2xl p-6 sm:p-8 shadow-[6px_7px_0px_#141517] relative">
          
          {/* Top Washi Tape */}
          <div className="absolute -top-3 left-12">
            <WashiTape className="w-24 h-5" color="rgba(254, 240, 138, 0.9)" angle="-2deg" />
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pb-6 border-b border-[#141517]/15">
            <div className="p-3 bg-[#FCFBF8] border border-[#141517]/15 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#575961] block">
                  Public Repositories
                </span>
                {liveStats.hasLive && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Live Synced with GitHub API" />
                )}
              </div>
              <span className="text-2xl font-black text-[#1D4ED8] mt-0.5 block tabular-nums">
                {liveStats.publicRepos}
              </span>
            </div>

            <div className="p-3 bg-[#FCFBF8] border border-[#141517]/15 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#575961] block">
                  Followers
                </span>
                {liveStats.hasLive && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Live Synced with GitHub API" />
                )}
              </div>
              <span className="text-2xl font-black text-[#141517] mt-0.5 block tabular-nums">
                {liveStats.followers}
              </span>
            </div>

            <div className="p-3 bg-[#FCFBF8] border border-[#141517]/15 rounded-xl col-span-2 sm:col-span-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#575961] block">
                Primary Core Focus
              </span>
              <span className="text-base font-bold text-[#141517] mt-1.5 block truncate">
                C++ &amp; TypeScript
              </span>
            </div>
          </div>

          {/* Contribution Activity Visualization (decorative) */}
          <div className="pt-6">
            <div className="flex flex-wrap items-center justify-between mb-3 gap-2">
              <span className="text-xs font-mono font-bold text-[#141517] flex items-center gap-1.5 uppercase">
                <Calendar className="w-4 h-4 text-[#1D4ED8]" />
                Contribution Activity Visualization
              </span>

              <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#575961]">
                <span>Light</span>
                <span className="w-2.5 h-2.5 rounded-xs bg-[#EAE6DC] border border-[#141517]/10" />
                <span className="w-2.5 h-2.5 rounded-xs bg-[#39D353]/70" />
                <span className="w-2.5 h-2.5 rounded-xs bg-[#26A641]" />
                <span className="w-2.5 h-2.5 rounded-xs bg-[#006D32]" />
                <span className="w-2.5 h-2.5 rounded-xs bg-[#0E4429]" />
                <span>Dense</span>
              </div>
            </div>

            <p className="text-[11px] font-mono text-[#575961] mb-3">
              Decorative notebook pattern — not real GitHub contribution history.
            </p>

            {/* Scrollable Heatmap Grid */}
            <div className="overflow-x-auto pb-2">
              <div className="min-w-[680px]">
                <div className="grid grid-flow-col grid-rows-7 gap-1">
                  {[...Array(weeks)].map((_, w) =>
                    [...Array(daysPerWeek)].map((_, d) => {
                      const level = getPatternLevel(w, d);
                      return (
                        <div
                          key={`${w}-${d}`}
                          className={`w-3 h-3 rounded-xs border transition-transform hover:scale-130 ${getCellColor(
                            level
                          )}`}
                          title="Decorative pattern cell (not real contribution data)"
                        />
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Handwritten note under heatmap */}
            <div className="mt-3 flex items-center gap-2">
              <HandDrawnArrow direction="right" className="w-8 h-4 text-[#1D4ED8] shrink-0" />
              <span className="font-hand text-base text-[#141517] font-semibold">
                Continuous development across embedded firmware, Arduino libraries &amp; React frontends
              </span>
            </div>
          </div>

          {/* Featured Repositories Grid */}
          <div className="mt-8 pt-6 border-t border-[#141517]/15">
            <span className="text-xs font-mono font-bold text-[#141517] uppercase block mb-4">
              Selected Featured Repositories
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {GITHUB_STATS.featuredRepos.map((repo) => (
                <motion.a
                  key={repo.name}
                  href={`https://github.com/${GITHUB_STATS.username}/${repo.name}`}
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
                    <span className="flex items-center gap-1 text-[#141517] font-semibold">
                      <span className="w-2 h-2 rounded-full bg-[#1D4ED8]" />
                      {repo.lang}
                    </span>

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
