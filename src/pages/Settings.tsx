import { useState } from 'react';
import { useSettings, type SettingsState } from '../context/SettingsContext';

const ACCENT_COLORS = [
  { label: 'Ferrari Red', value: '#E10600' },
  { label: 'McLaren Papaya', value: '#FF8000' },
  { label: 'Mercedes Teal', value: '#27F4D2' },
  { label: 'Red Bull Blue', value: '#3671C6' },
  { label: 'Aston Green', value: '#229971' },
  { label: 'Alpine Blue', value: '#2293D1' },
];

const DEFAULT_PAGES = [
  { label: 'Dashboard', value: '/' },
  { label: 'Drivers', value: '/drivers' },
  { label: 'Races', value: '/races' },
  { label: 'Results', value: '/results' },
  { label: 'Constructors', value: '/constructors' },
];

export default function Settings() {
  const { settings, updateSetting, resetSettings, saveSettings } = useSettings();
  const [saved, setSaved] = useState(false);

  const handleUpdate = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
    updateSetting(key, value);
    setSaved(false);
  };

  const handleSave = () => {
    saveSettings();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    resetSettings();
    setSaved(false);
  };

  return (
    <div className="pt-24 pb-20 px-6 md:px-12 max-w-[1100px] mx-auto w-full">
      {/* Header */}
      <header className="mb-16">
        <div className="flex items-center gap-4 mb-4">
          <span className="material-symbols-outlined text-[var(--theme-accent)] text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>settings</span>
          <h1 className="font-headline font-black italic uppercase text-5xl md:text-7xl text-white tracking-tighter leading-none">
            SETTINGS
          </h1>
        </div>
        <p className="text-on-surface-variant text-sm font-body uppercase tracking-widest">
          Customize your F1 Stats experience
        </p>
      </header>

      <div className="space-y-2">
        {/* Appearance Section */}
        <section className="bg-surface-container-low border border-white/5 overflow-hidden">
          <div className="px-6 md:px-8 py-5 border-b border-white/5 flex items-center gap-3">
            <span className="material-symbols-outlined text-[var(--theme-accent)] text-lg">palette</span>
            <h2 className="font-headline font-bold uppercase text-sm tracking-widest text-white">Appearance</h2>
          </div>
          <div className="divide-y divide-white/5">
            {/* Accent Color */}
            <div className="px-6 md:px-8 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-white font-bold text-sm">Accent Color</h3>
                <p className="text-white/40 text-xs mt-1">Primary color used throughout the interface</p>
              </div>
              <div className="flex flex-wrap gap-3 sm:gap-2">
                {ACCENT_COLORS.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => handleUpdate('accentColor', color.value)}
                    className={`w-10 h-10 sm:w-8 sm:h-8 transition-all duration-200 ${
                      settings.accentColor === color.value
                        ? 'ring-2 ring-white ring-offset-2 ring-offset-[#13131b] scale-110'
                        : 'opacity-60 hover:opacity-100 hover:scale-105'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.label}
                    aria-label={color.label}
                  />
                ))}
              </div>
            </div>

            {/* Animations */}
            <div className="px-6 md:px-8 py-6 flex items-center justify-between">
              <div>
                <h3 className="text-white font-bold text-sm">Animations</h3>
                <p className="text-white/40 text-xs mt-1">Enable smooth transitions and hover effects</p>
              </div>
              <button
                onClick={() => handleUpdate('showAnimations', !settings.showAnimations)}
                className={`relative w-14 h-8 rounded-full transition-colors duration-200 ${
                  settings.showAnimations ? 'bg-[var(--theme-accent)]' : 'bg-white/10'
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-200 ${
                    settings.showAnimations ? 'translate-x-6' : ''
                  }`}
                />
              </button>
            </div>

            {/* Data Density */}
            <div className="px-6 md:px-8 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-white font-bold text-sm">Data Density</h3>
                <p className="text-white/40 text-xs mt-1">Adjust the spacing and size of data elements</p>
              </div>
              <div className="flex flex-wrap gap-0 bg-[#13131b] border border-white/10 w-full sm:w-auto">
                {(['compact', 'default', 'comfortable'] as const).map((density) => (
                  <button
                    key={density}
                    onClick={() => handleUpdate('dataDensity', density)}
                    className={`px-4 py-2 text-xs font-['Space_Grotesk'] font-bold uppercase tracking-wider transition-all ${
                      settings.dataDensity === density
                        ? 'bg-[var(--theme-accent)] text-white'
                        : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                    }`}
                  >
                    {density}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Data & Performance Section */}
        <section className="bg-surface-container-low border border-white/5 overflow-hidden">
          <div className="px-6 md:px-8 py-5 border-b border-white/5 flex items-center gap-3">
            <span className="material-symbols-outlined text-[var(--theme-accent)] text-lg">speed</span>
            <h2 className="font-headline font-bold uppercase text-sm tracking-widest text-white">Data & Performance</h2>
          </div>
          <div className="divide-y divide-white/5">
            {/* Auto Refresh */}
            <div className="px-6 md:px-8 py-6 flex items-center justify-between">
              <div>
                <h3 className="text-white font-bold text-sm">Auto Refresh</h3>
                <p className="text-white/40 text-xs mt-1">Automatically fetch new data at regular intervals</p>
              </div>
              <button
                onClick={() => handleUpdate('autoRefresh', !settings.autoRefresh)}
                className={`relative w-14 h-8 rounded-full transition-colors duration-200 ${
                  settings.autoRefresh ? 'bg-[var(--theme-accent)]' : 'bg-white/10'
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-200 ${
                    settings.autoRefresh ? 'translate-x-6' : ''
                  }`}
                />
              </button>
            </div>

            {/* Refresh Interval */}
            {settings.autoRefresh && (
              <div className="px-6 md:px-8 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-white font-bold text-sm">Refresh Interval</h3>
                  <p className="text-white/40 text-xs mt-1">How often to fetch updated data</p>
                </div>
                <div className="flex w-full sm:w-auto flex-wrap gap-0 bg-[#13131b] border border-white/10">
                  {[
                    { label: '1 MIN', value: 60 },
                    { label: '5 MIN', value: 300 },
                    { label: '15 MIN', value: 900 },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleUpdate('refreshInterval', opt.value)}
                      className={`px-4 py-2 text-xs font-['Space_Grotesk'] font-bold uppercase tracking-wider transition-all ${
                        settings.refreshInterval === opt.value
                          ? 'bg-[var(--theme-accent)] text-white'
                          : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Units */}
            <div className="px-6 md:px-8 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-white font-bold text-sm">Units</h3>
                <p className="text-white/40 text-xs mt-1">Speed, distance, and temperature units</p>
              </div>
              <div className="flex flex-wrap w-full sm:w-auto gap-0 bg-[#13131b] border border-white/10">
                {(['metric', 'imperial'] as const).map((unit) => (
                  <button
                    key={unit}
                    onClick={() => handleUpdate('units', unit)}
                    className={`px-5 py-2 text-xs font-['Space_Grotesk'] font-bold uppercase tracking-wider transition-all ${
                      settings.units === unit
                        ? 'bg-[var(--theme-accent)] text-white'
                        : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                    }`}
                  >
                    {unit}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Navigation Section */}
        <section className="bg-surface-container-low border border-white/5 overflow-hidden">
          <div className="px-6 md:px-8 py-5 border-b border-white/5 flex items-center gap-3">
            <span className="material-symbols-outlined text-[var(--theme-accent)] text-lg">navigation</span>
            <h2 className="font-headline font-bold uppercase text-sm tracking-widest text-white">Navigation</h2>
          </div>
          <div className="divide-y divide-white/5">
            {/* Default Page */}
            <div className="px-6 md:px-8 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-white font-bold text-sm">Default Page</h3>
                <p className="text-white/40 text-xs mt-1">Page to show when opening the app</p>
              </div>
              <select
                value={settings.defaultPage}
                onChange={(e) => handleUpdate('defaultPage', e.target.value)}
                className="bg-[#13131b] border border-white/10 text-white px-4 py-3 sm:py-2 w-full sm:w-auto text-xs font-['Space_Grotesk'] font-bold uppercase tracking-wider outline-none focus:border-[var(--theme-accent)] transition-colors cursor-pointer"
              >
                {DEFAULT_PAGES.map((page) => (
                  <option key={page.value} value={page.value}>{page.label}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="bg-surface-container-low border border-white/5 overflow-hidden">
          <div className="px-6 md:px-8 py-5 border-b border-white/5 flex items-center gap-3">
            <span className="material-symbols-outlined text-[var(--theme-accent)] text-lg">info</span>
            <h2 className="font-headline font-bold uppercase text-sm tracking-widest text-white">About</h2>
          </div>
          <div className="px-6 md:px-8 py-6 space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="border-l-2 border-[var(--theme-accent)]/30 pl-4">
                <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">Version</p>
                <p className="text-white font-headline font-bold text-lg mt-1">1.0.0</p>
              </div>
              <div className="border-l-2 border-[var(--theme-accent)]/30 pl-4">
                <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">API Source</p>
                <p className="text-white font-headline font-bold text-lg mt-1">Jolpica</p>
              </div>
              <div className="border-l-2 border-[var(--theme-accent)]/30 pl-4">
                <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">Season</p>
                <p className="text-white font-headline font-bold text-lg mt-1">2026</p>
              </div>
              <div className="border-l-2 border-[var(--theme-accent)]/30 pl-4">
                <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">Cache TTL</p>
                <p className="text-white font-headline font-bold text-lg mt-1">5 min</p>
              </div>
            </div>
            <p className="text-white/30 text-xs leading-relaxed mt-4">
              F1 Stats provides real-time Formula 1 standings, race results, and driver analytics. 
              Data is sourced from the Jolpica F1 API (open-source Ergast successor). 
              Not affiliated with Formula 1, FIA, or any racing team.
            </p>
          </div>
        </section>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4 items-start">
        <button
          onClick={handleSave}
          className={`px-10 py-4 font-headline font-bold italic uppercase text-sm tracking-wider transition-all duration-200 active:scale-95 ${
            saved
              ? 'bg-green-600 text-white'
              : 'bg-[var(--theme-accent)] text-white hover:brightness-110'
          }`}
        >
          {saved ? '✓ SAVED' : 'SAVE PREFERENCES'}
        </button>
        <button
          onClick={handleReset}
          className="px-10 py-4 border border-white/10 text-white/50 font-headline font-bold italic uppercase text-sm tracking-wider hover:border-[var(--theme-accent)]/50 hover:text-[var(--theme-accent)] transition-all duration-200 active:scale-95"
        >
          RESET DEFAULTS
        </button>
      </div>

      {/* Keyboard Shortcuts Reference */}
      <section className="mt-16 border-t border-white/5 pt-12">
        <h3 className="font-headline font-bold uppercase text-xs tracking-[0.3em] text-white/30 mb-6 flex items-center gap-3">
          <span className="material-symbols-outlined text-sm">keyboard</span>
          Keyboard Shortcuts
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { keys: '⌘ K', description: 'Open Search' },
            { keys: 'ESC', description: 'Close Modal / Go Back' },
            { keys: '↑ ↓', description: 'Navigate Results' },
            { keys: 'ENTER', description: 'Select Result' },
          ].map((shortcut) => (
            <div key={shortcut.keys} className="flex items-center justify-between bg-[#13131b] px-5 py-3 border border-white/5">
              <span className="text-white/50 text-xs">{shortcut.description}</span>
              <kbd className="px-2 py-1 bg-white/5 border border-white/10 text-white/60 text-[10px] font-mono tracking-wider">
                {shortcut.keys}
              </kbd>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
