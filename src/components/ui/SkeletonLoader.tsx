import React from 'react';

/* ═══════════════════════════════════════════════════════════════════════════════
   SKELETON PRIMITIVES — building blocks for page-specific skeleton screens.
   All shapes inherit the shimmer animation from `skeleton-pulse` in index.css.
   ═══════════════════════════════════════════════════════════════════════════════ */

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

/** A single rectangular shimmer block. */
export function Bone({ className = '', style }: SkeletonProps) {
  return (
    <div
      className={`skeleton-bone ${className}`}
      style={style}
    />
  );
}

/** Circular shimmer (avatar / logo). */
export function BoneCircle({ className = '', style }: SkeletonProps) {
  return (
    <div
      className={`skeleton-bone rounded-full ${className}`}
      style={style}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   PAGE-LEVEL SKELETON SCREENS
   Each matches the real layout of a specific page for a seamless transition.
   ═══════════════════════════════════════════════════════════════════════════════ */

/* ─── Dashboard ────────────────────────────────────────────────────────────── */
export function DashboardSkeleton() {
  return (
    <div className="flex flex-col relative w-full h-screen overflow-hidden">
      <div className="relative z-10 w-full h-full overflow-y-auto pb-24">
        <div className="max-w-5xl mx-auto space-y-10 px-4 md:px-8 py-8 md:py-12">
          {/* Hero */}
          <div className="skeleton-glass w-full rounded-[2rem] p-8 md:p-12" style={{ minHeight: 440 }}>
            <Bone className="w-40 h-5 rounded-full mb-6" />
            <Bone className="w-3/4 h-12 rounded-xl mb-3" />
            <Bone className="w-2/3 h-12 rounded-xl mb-3" />
            <Bone className="w-1/2 h-12 rounded-xl mb-16" />
            <div className="flex justify-between items-end">
              <Bone className="w-48 h-12 rounded-xl" />
              <div className="text-right">
                <Bone className="w-32 h-8 rounded-lg mb-2 ml-auto" />
                <Bone className="w-48 h-4 rounded-md ml-auto" />
              </div>
            </div>
          </div>

          {/* Driver Standings */}
          <div className="skeleton-glass w-full rounded-[2rem] p-6 lg:p-8">
            <div className="flex justify-between items-center mb-8 bg-white/5 p-4 rounded-2xl">
              <Bone className="w-48 h-6 rounded-lg" />
              <BoneCircle className="w-8 h-8" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[0, 1, 2].map(i => (
                <div key={i} className="rounded-3xl border border-white/10 bg-white/[0.02] h-[380px] relative overflow-hidden">
                  <Bone className="absolute top-5 left-6 w-12 h-10 rounded-lg" />
                  <BoneCircle className="absolute bottom-24 left-1/2 -translate-x-1/2 w-40 h-48 rounded-none !rounded-t-full opacity-[0.06]" />
                  <div className="absolute bottom-[4.5rem] left-0 w-full px-6">
                    <Bone className="w-20 h-3 rounded-md mb-1" />
                    <Bone className="w-36 h-6 rounded-lg" />
                  </div>
                  <div className="absolute bottom-0 left-0 w-full h-[4rem] border-t border-white/10 bg-white/[0.02] flex justify-between items-center px-6">
                    <Bone className="w-24 h-4 rounded-md" />
                    <Bone className="w-16 h-5 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Calendar */}
          <div className="skeleton-glass w-full rounded-[2rem] p-6 lg:p-8">
            <div className="flex justify-between items-center mb-8 bg-white/5 p-4 rounded-2xl">
              <Bone className="w-44 h-6 rounded-lg" />
              <BoneCircle className="w-8 h-8" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[0, 1, 2].map(i => (
                <div key={i} className="bg-white/[0.02] rounded-[1.5rem] p-6 lg:p-8 border border-white/10 h-[200px] flex flex-col justify-between">
                  <div>
                    <Bone className="w-16 h-3 rounded-md mb-2" />
                    <Bone className="w-full h-8 rounded-lg mb-2" />
                    <Bone className="w-20 h-3 rounded-md" />
                  </div>
                  <Bone className="w-28 h-3 rounded-md" />
                </div>
              ))}
            </div>
          </div>

          {/* Race Results */}
          <div className="skeleton-glass w-full rounded-[2rem] p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-8 bg-white/5 p-4 rounded-2xl">
              <Bone className="w-56 h-6 rounded-lg" />
              <Bone className="w-6 h-6 rounded-md" />
            </div>
            <div className="flex flex-col space-y-3">
              {[0, 1, 2, 3].map(i => (
                <div key={i} className="flex items-center justify-between p-4 px-6 rounded-xl bg-white/[0.02] border border-white/10">
                  <div className="flex items-center gap-4">
                    <Bone className="w-6 h-6 rounded-md" />
                    <Bone className="w-1 h-4 rounded-full" />
                    <Bone className="w-32 h-4 rounded-md" />
                    <Bone className="w-24 h-3 rounded-md hidden sm:block" />
                  </div>
                  <div className="flex items-center gap-6">
                    <Bone className="w-16 h-3 rounded-md hidden md:block" />
                    <Bone className="w-20 h-4 rounded-md" />
                    <Bone className="w-12 h-3 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
            <Bone className="w-full h-12 rounded-xl mt-8" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Drivers / Standings (rows only — header/toggle already visible) ──── */
export function DriversSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="flex items-center px-4 md:px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/10" style={{ animationDelay: `${i * 60}ms` }}>
          <Bone className="w-10 h-8 rounded-lg mr-4" />
          <BoneCircle className="w-10 h-10 md:w-12 md:h-12 mr-4 flex-shrink-0" />
          <div className="flex-1 min-w-0 mr-4">
            <Bone className="w-16 h-3 rounded-md mb-1" />
            <Bone className="w-28 h-5 rounded-md" />
          </div>
          <Bone className="w-28 h-4 rounded-md mr-4 hidden md:block" />
          <Bone className="w-14 h-6 rounded-md mr-4" />
          <Bone className="w-20 h-6 rounded-md hidden md:block" />
        </div>
      ))}
    </div>
  );
}

/* ─── Constructors (card list only — header already visible) ──────────── */
export function ConstructorsSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 relative overflow-hidden" style={{ animationDelay: `${i * 80}ms` }}>
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <Bone className="w-12 h-12 rounded-lg" />
              <Bone className="w-48 h-8 rounded-xl" />
            </div>
            <BoneCircle className="w-8 h-8" />
          </div>
          {/* Middle */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
            <Bone className="w-full max-w-sm h-24 rounded-xl" />
            <div className="flex items-center gap-6 md:gap-10">
              {[0, 1].map(j => (
                <div key={j} className="flex flex-col items-center">
                  <BoneCircle className="w-20 h-20 md:w-28 md:h-28 mb-3" />
                  <Bone className="w-14 h-3 rounded-md mb-1" />
                  <Bone className="w-20 h-5 rounded-md" />
                </div>
              ))}
            </div>
          </div>
          {/* Divider */}
          <Bone className="w-full h-px mb-6" />
          {/* Specs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[0, 1, 2].map(j => (
              <div key={j}>
                <Bone className="w-16 h-3 rounded-md mb-2" />
                <Bone className="w-28 h-4 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

/* ─── Season Calendar ──────────────────────────────────────────────────────── */
export function CalendarSkeleton() {
  return (
    <div className="pt-20 pb-20 px-4 md:px-8 lg:px-12 max-w-[1400px] mx-auto w-full">
      <div className="mb-8">
        <Bone className="w-64 h-10 rounded-xl mb-3" />
        <div className="flex gap-3 flex-wrap">
          <Bone className="w-32 h-5 rounded-md" />
          <Bone className="w-28 h-5 rounded-md" />
          <Bone className="w-36 h-5 rounded-md" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden" style={{ animationDelay: `${i * 50}ms` }}>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06] bg-white/[0.02]">
              <Bone className="w-48 h-4 rounded-md" />
              <Bone className="w-4 h-4 rounded-sm" />
            </div>
            {/* Body */}
            <div className="flex items-center gap-4 p-4">
              <Bone className="w-[150px] h-[120px] rounded-xl flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <Bone className="w-6 h-6 rounded-md mb-2" />
                <Bone className="w-3/4 h-8 rounded-lg mb-2" />
                <Bone className="w-1/2 h-3 rounded-md mb-1" />
                <Bone className="w-1/3 h-3 rounded-md mb-3" />
                <Bone className="w-28 h-6 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Circuits ──────────────────────────────────────────────────────────────── */
export function CircuitsSkeleton() {
  return (
    <div className="pt-20 pb-20 px-6 md:px-12 max-w-[1600px] mx-auto w-full">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-4">
          <Bone className="w-2 h-8 rounded-sm" />
          <Bone className="w-40 h-4 rounded-md" />
        </div>
        <Bone className="w-2/3 h-16 rounded-xl mb-4" />
        <Bone className="w-full max-w-2xl h-5 rounded-md mb-6" />
        <div className="flex items-center gap-4">
          <Bone className="w-28 h-8 rounded-md" />
          <Bone className="w-32 h-8 rounded-md" />
        </div>
      </div>
      {/* Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-10">
        <Bone className="flex-1 h-12 rounded-xl max-w-md" />
        <Bone className="h-12 w-[180px] rounded-xl" />
      </div>
      <Bone className="w-40 h-4 rounded-md mb-6" />
      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden" style={{ animationDelay: `${i * 40}ms` }}>
            <Bone className="w-full h-36" />
            <div className="p-5">
              <Bone className="w-3/4 h-5 rounded-md mb-2" />
              <Bone className="w-1/2 h-3 rounded-md mb-3" />
              <div className="flex items-center justify-between">
                <Bone className="w-20 h-3 rounded-md" />
                <Bone className="w-4 h-4 rounded-sm" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Races ─────────────────────────────────────────────────────────────────── */
export function RacesSkeleton() {
  return (
    <div className="pt-20 pb-20 px-6 md:px-12 max-w-[1600px] mx-auto w-full">
      {/* Header */}
      <div className="mb-16">
        <Bone className="w-2/3 h-16 rounded-xl mb-4" />
        <div className="flex items-center gap-4 flex-wrap">
          <Bone className="w-32 h-8 rounded-md" />
          <Bone className="w-28 h-8 rounded-md" />
          <Bone className="w-36 h-8 rounded-md" />
        </div>
      </div>
      {/* Next Race */}
      <div className="skeleton-glass w-full rounded-[2rem] mb-20 p-8 md:p-12 border border-white/10" style={{ minHeight: 400 }}>
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <Bone className="w-48 h-8 rounded-md" />
        </div>
        <Bone className="w-3/4 h-14 rounded-xl mb-3" />
        <Bone className="w-1/2 h-6 rounded-lg mt-4" />
        <div className="flex justify-between items-end mt-12">
          <div>
            <Bone className="w-32 h-3 rounded-md mb-2" />
            <Bone className="w-40 h-12 rounded-xl" />
          </div>
          <Bone className="w-48 h-14 rounded-md" />
        </div>
      </div>
      {/* Completed races grid */}
      <Bone className="w-40 h-6 rounded-lg mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-white/10 bg-white/[0.03] p-6 overflow-hidden" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="flex justify-between items-start mb-4">
              <Bone className="w-12 h-8 rounded-lg" />
              <Bone className="w-20 h-5 rounded-md" />
            </div>
            <Bone className="w-3/4 h-6 rounded-lg mb-1" />
            <Bone className="w-1/2 h-4 rounded-md mb-6" />
            <div className="flex items-center gap-3 bg-white/[0.03] p-3 rounded-lg border-l-4 border-white/10">
              <Bone className="w-5 h-5 rounded-sm" />
              <Bone className="w-36 h-4 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Results ──────────────────────────────────────────────────────────────── */
export function ResultsSkeleton() {
  return (
    <div className="max-w-[1600px] mx-auto px-6 pt-20 pb-12 w-full">
      {/* Header */}
      <div className="mb-12">
        <Bone className="w-24 h-3 rounded-md mb-2" />
        <Bone className="w-96 h-14 rounded-xl" />
      </div>
      {/* Tab selector */}
      <div className="flex gap-1 overflow-hidden mb-8 pb-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Bone key={i} className="w-24 h-12 rounded-xl flex-none" />
        ))}
      </div>
      {/* Results card */}
      <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] overflow-hidden">
        <div className="px-8 py-10 flex flex-col md:flex-row justify-between gap-6 bg-white/[0.02] border-l-4 border-white/10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Bone className="w-10 h-10 rounded-lg" />
              <Bone className="w-64 h-10 rounded-xl" />
            </div>
            <Bone className="w-80 h-4 rounded-md" />
          </div>
          <div className="flex gap-4">
            <Bone className="w-28 h-16 rounded-lg" />
            <Bone className="w-28 h-16 rounded-lg hidden md:block" />
          </div>
        </div>
        {/* Rows */}
        <div className="p-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex items-center py-4 px-4 border-b border-white/5" style={{ animationDelay: `${i * 40}ms` }}>
              <Bone className="w-10 h-6 rounded-md mr-6" />
              <BoneCircle className="w-8 h-8 mr-3" />
              <Bone className="w-32 h-4 rounded-md mr-auto" />
              <Bone className="w-20 h-3 rounded-md mx-4 hidden md:block" />
              <Bone className="w-10 h-4 rounded-md mx-4" />
              <Bone className="w-8 h-3 rounded-md mx-4 hidden md:block" />
              <Bone className="w-20 h-3 rounded-md mx-4" />
              <Bone className="w-8 h-5 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── News ──────────────────────────────────────────────────────────────────── */
export function NewsSkeleton() {
  return (
    <div className="pt-20 pb-20 px-6 max-w-[1600px] mx-auto w-full">
      {/* Header */}
      <div className="mb-12 flex items-center justify-between">
        <Bone className="w-48 h-10 rounded-xl" />
        <Bone className="w-44 h-8 rounded-md" />
      </div>
      {/* Featured */}
      <div className="rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden mb-16" style={{ minHeight: 500 }}>
        <Bone className="w-full h-[300px] md:h-[400px]" />
        <div className="p-8 md:p-16">
          <div className="flex items-center gap-4 mb-6">
            <Bone className="w-20 h-6 rounded-sm" />
            <Bone className="w-32 h-4 rounded-md" />
          </div>
          <Bone className="w-3/4 h-12 rounded-xl mb-3" />
          <Bone className="w-1/2 h-12 rounded-xl mb-6" />
          <Bone className="w-full max-w-3xl h-5 rounded-md mb-2" />
          <Bone className="w-2/3 max-w-2xl h-5 rounded-md" />
        </div>
      </div>
      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden" style={{ animationDelay: `${i * 60}ms` }}>
            <Bone className="w-full h-64" />
            <div className="p-8">
              <div className="flex justify-between mb-4">
                <Bone className="w-24 h-3 rounded-md" />
                <Bone className="w-20 h-3 rounded-md" />
              </div>
              <Bone className="w-full h-6 rounded-lg mb-2" />
              <Bone className="w-3/4 h-6 rounded-lg mb-4" />
              <Bone className="w-full h-4 rounded-md mb-1" />
              <Bone className="w-2/3 h-4 rounded-md mb-6" />
              <div className="pt-6 border-t border-white/5 flex justify-between">
                <Bone className="w-28 h-3 rounded-md" />
                <Bone className="w-4 h-4 rounded-sm" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
