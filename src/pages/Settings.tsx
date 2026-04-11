import { useState } from 'react';
import { useSettings, defaultSettings, type SettingsState } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import AuthModal from '../components/features/AuthModal';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

/* ─── Constants ─── */

const ACCENT_COLORS = [
  { label: 'Ferrari Red', value: '#E10600' },
  { label: 'Teal', value: '#29DEC9' },
  { label: 'Blue', value: '#3B82F6' },
  { label: 'Amber', value: '#FACC15' },
  { label: 'Purple', value: '#A855F7' },
  { label: 'McLaren Papaya', value: '#FF8000' },
];

const DEFAULT_PAGES = [
  { label: 'Dashboard', value: '/' },
  { label: 'Drivers', value: '/drivers' },
  { label: 'Races', value: '/races' },
  { label: 'Results', value: '/results' },
  { label: 'Constructors', value: '/constructors' },
  { label: 'News', value: '/news' },
  { label: 'Calendar', value: '/calendar' },
  { label: 'Circuits', value: '/circuits' },
];

type SettingsTab = 'ACCOUNT' | 'TELEMETRY' | 'THEME' | 'ALERTS';

// Dynamic glass style helper
const getGlassStyle = (isGlass: boolean): React.CSSProperties => {
  if (!isGlass) return { backgroundColor: '#1d2023', border: '1px solid rgba(255,255,255,0.05)' };
  return {
    background: 'rgba(29, 32, 35, 0.4)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  };
};

/* ─── Reusable Toggle ─── */

function Toggle({ checked, onChange, id }: { checked: boolean; onChange: () => void; id?: string }) {
  return (
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${
        checked ? 'bg-[#29DEC9]' : 'bg-[#323538]'
      }`}
    >
      <div
        className={`absolute top-[2px] left-[2px] w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

/* ─── Segmented Button Group ─── */

function SegmentedControl<T extends string | number>({
  options,
  value,
  onChange,
  isGlass = false,
}: {
  options: { label: string; value: T }[];
  value: T;
  onChange: (v: T) => void;
  isGlass?: boolean;
}) {
  return (
    <div className={`grid p-1 rounded-xl ${isGlass ? 'bg-black/20 backdrop-blur-md border border-white/5' : 'bg-[#191c1f]'}`} style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}>
      {options.map((opt) => (
        <button
          key={String(opt.value)}
          onClick={() => onChange(opt.value)}
          className={`py-2.5 text-[10px] font-headline font-bold tracking-widest rounded-lg transition-all duration-200 ${
            value === opt.value
              ? 'bg-[#323538] text-white shadow-sm'
              : 'text-[#8b8d92] hover:text-white'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

/* ─── Settings Row ─── */

function SettingsRow({
  icon,
  iconColor,
  title,
  description,
  children,
}: {
  icon: string;
  iconColor?: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between p-3 sm:p-4 rounded-xl hover:bg-white/5 transition-colors gap-4">
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <div
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${iconColor || 'var(--theme-accent)'}15` }}
        >
          <span className="material-symbols-outlined text-lg sm:text-xl" style={{ color: iconColor || 'var(--theme-accent)' }}>
            {icon}
          </span>
        </div>
        <div className="min-w-0">
          <p className="font-headline font-bold text-xs sm:text-sm tracking-tight truncate">{title}</p>
          <p className="text-[10px] sm:text-xs text-[#8b8d92] font-body truncate">{description}</p>
        </div>
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

/* ─── Main Component ─── */

export default function Settings() {
  useDocumentMeta('Settings', 'Configure F1 Stats application preferences, appearance, and notifications.');
  const { settings, updateSetting, resetSettings, saveSettings } = useSettings();
  const { user, isAuthenticated, signOut, updateProfile } = useAuth();
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<SettingsTab>('ACCOUNT');
  const [hasChanges, setHasChanges] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [editName, setEditName] = useState('');

  const handleUpdate = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
    updateSetting(key, value);
    setSaved(false);
    setHasChanges(true);
  };

  const handleSave = () => {
    saveSettings();
    setSaved(true);
    setHasChanges(false);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    if (!showResetConfirm) {
      setShowResetConfirm(true);
      setTimeout(() => setShowResetConfirm(false), 3000);
      return;
    }
    resetSettings();
    setSaved(false);
    setHasChanges(false);
    setShowResetConfirm(false);
  };

  const tabs: { key: SettingsTab; icon: string; label: string; shortLabel: string }[] = [
    { key: 'ACCOUNT', icon: 'person', label: 'ACCOUNT', shortLabel: 'Profile' },
    { key: 'TELEMETRY', icon: 'monitoring', label: 'TELEMETRY', shortLabel: 'Data' },
    { key: 'THEME', icon: 'palette', label: 'THEME', shortLabel: 'Theme' },
    { key: 'ALERTS', icon: 'notifications', label: 'ALERTS', shortLabel: 'Alerts' },
  ];

  // Count of changed settings for badge
  const changedCount = (Object.keys(defaultSettings) as (keyof SettingsState)[]).filter(
    (k) => settings[k] !== defaultSettings[k]
  ).length;

  return (
    <div className="pt-20 min-h-screen relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 right-0 w-[600px] md:w-[800px] h-[600px] md:h-[800px] bg-[#ffb4a8]/5 blur-[150px] -z-10 rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-[#29DEC9]/5 blur-[120px] -z-10 rounded-full -translate-x-1/4 translate-y-1/4 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-12">

        {/* Header */}
        <header className="mb-6 sm:mb-8 md:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-headline font-bold tracking-tighter mb-1 sm:mb-2">
            SYSTEM_PREFERENCES
          </h1>
          <p className="text-[#8b8d92] font-body text-sm sm:text-base">
            Configure your cockpit telemetry and interface behavior.
          </p>
          {hasChanges && (
            <div className="mt-3 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-amber-400 text-[10px] font-headline font-bold tracking-widest uppercase">
                UNSAVED CHANGES
              </span>
            </div>
          )}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 md:gap-8">

          {/* ═══════════════════ Left Column ═══════════════════ */}
          <div className="lg:col-span-3 space-y-4">

            {/* Desktop Tab Nav */}
            <div className="hidden lg:block p-4 rounded-xl space-y-1" style={getGlassStyle(settings.glassMorphism)}>
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-headline text-sm font-bold tracking-tight transition-all duration-200 ${
                    activeTab === tab.key
                      ? 'bg-[var(--theme-accent)]/15 text-[var(--theme-accent)]'
                      : 'text-[#9ca3af] hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span
                    className="material-symbols-outlined text-lg"
                    style={activeTab === tab.key ? { fontVariationSettings: "'FILL' 1" } : {}}
                  >
                    {tab.icon}
                  </span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Mobile Tab Bar — horizontal scroll */}
            <div className="lg:hidden flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-none flex items-center gap-2 px-4 py-2.5 rounded-xl font-headline text-xs font-bold tracking-tight transition-all duration-200 whitespace-nowrap ${
                    activeTab === tab.key
                      ? 'bg-[var(--theme-accent)]/15 text-[var(--theme-accent)] border border-[var(--theme-accent)]/20'
                      : `text-[#9ca3af] ${settings.glassMorphism ? 'bg-black/20 backdrop-blur-md' : 'bg-[#1d2023]/60'} border border-white/5 hover:bg-white/5`
                  }`}
                >
                  <span
                    className="material-symbols-outlined text-base"
                    style={activeTab === tab.key ? { fontVariationSettings: "'FILL' 1" } : {}}
                  >
                    {tab.icon}
                  </span>
                  {tab.shortLabel}
                </button>
              ))}
            </div>

            {/* Pro Card — desktop only */}
            <div className={`hidden lg:block p-6 rounded-xl relative overflow-hidden group cursor-pointer ${settings.glassMorphism ? 'bg-black/20 backdrop-blur-md border border-white/10' : 'bg-[#272a2e]'}`}>
              <img
                className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:scale-110 transition-transform duration-700"
                alt="F1 steering wheel"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOHtK9lW8AOL4DTkMSDembLmi7Cet69HjOLi-pgaS1O2IXruDjZBOCYjQKXKuj2gOJR1XcOWx8LqVmDzirQV18STQB_h3dwSkKxqPQO6BA4z-HTSbfTaby7_JV-D3Saufojp006St-9YmW2BOiJAFTIE0FKCh7vVQbBuUFZE9jgnL0emPxXBOiIeMqikvp4qbs3MjTKj7WtBN5EFxjjEHTJYkWC6-DkV8TroeNf4q8mokW5iD-Ez1JQ9FeXN52eoVLXZDUTBgaJFWH"
              />
              <div className="relative z-10">
                <p className="text-[#29DEC9] text-[10px] font-headline font-bold tracking-widest mb-1">PRO STATUS</p>
                <h3 className="font-headline font-bold text-lg leading-tight mb-4 text-white">
                  OPTIMIZE YOUR<br />ENGINE.
                </h3>
                <button className="px-4 py-2 bg-gradient-to-br from-[var(--theme-accent)] to-[#E10600] rounded-lg text-white font-headline text-xs font-black tracking-widest hover:scale-105 active:scale-95 transition-transform shadow-lg">
                  UPGRADE
                </button>
              </div>
            </div>

            {/* Settings summary — desktop only */}
            <div className="hidden lg:block p-4 rounded-xl space-y-3" style={getGlassStyle(settings.glassMorphism)}>
              <p className="text-[10px] font-headline font-bold text-[#8b8d92] tracking-widest">QUICK STATS</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#8b8d92]">Custom Settings</span>
                  <span className="text-xs font-headline font-bold text-white">{changedCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#8b8d92]">Accent</span>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: settings.accentColor }} />
                    <span className="text-xs font-mono text-white/60">{settings.accentColor}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#8b8d92]">Density</span>
                  <span className="text-xs font-headline font-bold text-white capitalize">{settings.dataDensity}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ═══════════════════ Main Content ═══════════════════ */}
          <div className="lg:col-span-9 space-y-4 sm:space-y-6 md:space-y-8">

            {/* ══ TAB: ACCOUNT ══ */}
            {activeTab === 'ACCOUNT' && (
              <>
                {/* Profile Card */}
                <section className="rounded-2xl p-5 sm:p-6 md:p-8" style={getGlassStyle(settings.glassMorphism)}>
                  <h3 className="font-headline font-bold text-base sm:text-lg mb-6 sm:mb-8 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[var(--theme-accent)]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      badge
                    </span>
                    PROFILE_CARD
                  </h3>

                  {isAuthenticated && user ? (
                    <>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-8 mb-8 sm:mb-10">
                        <div className="relative">
                          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden ring-4 ring-[var(--theme-accent)]/20 bg-gradient-to-br from-[var(--theme-accent)] to-[#E10600] flex items-center justify-center">
                            <span className="text-white font-headline font-black text-3xl sm:text-4xl">
                              {user.displayName?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || '?'}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <h2 className="text-xl sm:text-2xl font-headline font-bold mb-1 break-all">
                            {user.displayName || 'F1 Fan'}
                          </h2>
                          <p className="text-[#8b8d92] text-xs sm:text-sm font-body mb-3">{user.email}</p>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-[#29DEC9]/10 rounded text-[10px] font-headline font-bold text-[#29DEC9] tracking-widest border border-[#29DEC9]/20">
                              VERIFIED
                            </span>
                            <span className="px-3 py-1 bg-[#323538] rounded text-[10px] font-headline font-bold text-[#d1d5db] tracking-widest">
                              F1_ENTHUSIAST
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Edit profile */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-headline font-bold text-[#8b8d92] tracking-widest block">
                            DISPLAY NAME
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={editName || user.displayName || ''}
                              onChange={(e) => setEditName(e.target.value)}
                              className="flex-1 bg-[#191c1f] border border-[#5e3f3a]/30 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[var(--theme-accent)]/50 transition-colors font-body placeholder:text-[#8b8d92]/40"
                              placeholder="Your Name"
                            />
                            <button
                              onClick={async () => {
                                if (!editName.trim()) return;
                                setProfileSaving(true);
                                await updateProfile({ displayName: editName.trim() });
                                setProfileSaving(false);
                                setEditName('');
                              }}
                              disabled={profileSaving || !editName.trim()}
                              className="px-4 py-3 bg-[var(--theme-accent)]/20 text-[var(--theme-accent)] rounded-xl font-headline font-bold text-xs tracking-wider hover:bg-[var(--theme-accent)]/30 transition-colors disabled:opacity-30"
                            >
                              {profileSaving ? '...' : 'SAVE'}
                            </button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-headline font-bold text-[#8b8d92] tracking-widest block">
                            EMAIL ADDRESS
                          </label>
                          <input
                            type="email"
                            value={user.email}
                            disabled
                            className="w-full bg-[#191c1f] border border-[#5e3f3a]/30 rounded-xl px-4 py-3 text-sm text-white/50 font-body cursor-not-allowed"
                          />
                        </div>
                      </div>

                      {/* Sign out */}
                      <button
                        onClick={signOut}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-headline font-bold text-xs tracking-wider hover:bg-red-500/20 transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">logout</span>
                        SIGN OUT
                      </button>
                    </>
                  ) : (
                    /* Not authenticated — sign in CTA */
                    <div className="text-center py-8">
                      <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/[0.04] border border-white/10 mb-6">
                        <span className="material-symbols-outlined text-white/30" style={{ fontSize: '40px' }}>person_off</span>
                      </div>
                      <h3 className="font-headline font-bold text-xl text-white mb-2">NOT SIGNED IN</h3>
                      <p className="text-[#8b8d92] text-sm font-body mb-6 max-w-sm mx-auto">
                        Sign in to save your preferences to the cloud, personalize your profile, and get the full cockpit experience.
                      </p>
                      <button
                        onClick={() => setAuthModalOpen(true)}
                        className="px-8 py-3 rounded-xl font-headline font-black text-xs tracking-widest uppercase bg-gradient-to-br from-[var(--theme-accent)] to-[#E10600] text-white hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[var(--theme-accent)]/20 flex items-center gap-2 mx-auto"
                      >
                        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>login</span>
                        SIGN IN
                      </button>
                    </div>
                  )}
                </section>

                {/* Navigation Preferences */}
                <section className="rounded-2xl p-5 sm:p-6 md:p-8" style={getGlassStyle(settings.glassMorphism)}>
                  <h3 className="font-headline font-bold text-base sm:text-lg mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[var(--theme-accent)]">navigation</span>
                    NAVIGATION
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-headline font-bold text-[#8b8d92] tracking-widest block">
                        DEFAULT PAGE
                      </label>
                      <select
                        value={settings.defaultPage}
                        onChange={(e) => handleUpdate('defaultPage', e.target.value)}
                        className="w-full bg-[#191c1f] border border-[#5e3f3a]/30 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[var(--theme-accent)]/50 transition-colors font-body cursor-pointer appearance-none"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.75rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.25em 1.25em', paddingRight: '2.5rem' }}
                      >
                        {DEFAULT_PAGES.map((page) => (
                          <option key={page.value} value={page.value}>{page.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-headline font-bold text-[#8b8d92] tracking-widest block">
                        UNITS SYSTEM
                      </label>
                      <SegmentedControl
                        options={[
                          { label: 'METRIC', value: 'metric' as const },
                          { label: 'IMPERIAL', value: 'imperial' as const },
                        ]}
                        value={settings.units}
                        onChange={(v) => handleUpdate('units', v)}
                        isGlass={settings.glassMorphism}
                      />
                    </div>
                  </div>
                </section>

                {/* System Info */}
                <section className="rounded-2xl p-5 sm:p-6 md:p-8" style={getGlassStyle(settings.glassMorphism)}>
                  <h3 className="font-headline font-bold text-base sm:text-lg mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[var(--theme-accent)]">info</span>
                    SYSTEM_INFO
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                    {[
                      { label: 'VERSION', value: '2.0.1.0' },
                      { label: 'API SOURCE', value: 'Jolpica' },
                      { label: 'SEASON', value: '2026' },
                      { label: 'CACHE TTL', value: '5 min' },
                    ].map((item) => (
                      <div key={item.label} className="border-l-2 border-[var(--theme-accent)]/30 pl-3 sm:pl-4">
                        <p className="text-[10px] font-headline font-bold text-[#8b8d92] tracking-widest">{item.label}</p>
                        <p className="text-white font-headline font-bold text-base sm:text-lg mt-1">{item.value}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-[#8b8d92]/50 text-[10px] sm:text-xs leading-relaxed mt-4 sm:mt-6">
                    F1 Stats provides real-time Formula 1 standings, race results, and driver analytics.
                    Data sourced from Jolpica F1 API. Not affiliated with Formula 1, FIA, or any racing team.
                  </p>
                </section>
              </>
            )}

            {/* ══ TAB: TELEMETRY ══ */}
            {activeTab === 'TELEMETRY' && (
              <>
                {/* Data Telemetry */}
                <section className="rounded-2xl p-5 sm:p-6 md:p-8" style={getGlassStyle(settings.glassMorphism)}>
                  <h3 className="font-headline font-bold text-base sm:text-lg mb-6 sm:mb-8 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[var(--theme-accent)]">monitoring</span>
                    DATA_TELEMETRY
                  </h3>
                  <div className="space-y-2">
                    <SettingsRow
                      icon="sync"
                      iconColor="#29DEC9"
                      title="REAL-TIME UPDATES"
                      description="Auto-refresh data at regular intervals."
                    >
                      <Toggle
                        id="toggle-autorefresh"
                        checked={settings.autoRefresh}
                        onChange={() => handleUpdate('autoRefresh', !settings.autoRefresh)}
                      />
                    </SettingsRow>

                    {settings.autoRefresh && (
                      <div className="px-3 sm:px-4 py-3 rounded-xl bg-white/[0.02]">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <p className="font-headline font-bold text-xs sm:text-sm tracking-tight">REFRESH_INTERVAL</p>
                          </div>
                          <SegmentedControl
                            options={[
                              { label: '1 MIN', value: 60 },
                              { label: '5 MIN', value: 300 },
                              { label: '15 MIN', value: 900 },
                            ]}
                            value={settings.refreshInterval}
                            onChange={(v) => handleUpdate('refreshInterval', v)}
                            isGlass={settings.glassMorphism}
                          />
                        </div>
                      </div>
                    )}

                    <div className="px-3 sm:px-4 py-4 rounded-xl hover:bg-white/5 transition-colors">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#3B82F6]/10 flex items-center justify-center flex-shrink-0">
                              <span className="material-symbols-outlined text-lg sm:text-xl text-[#3B82F6]">speed</span>
                            </div>
                            <div>
                              <p className="font-headline font-bold text-xs sm:text-sm tracking-tight">POLLING RATE</p>
                              <p className="text-[10px] sm:text-xs text-[#8b8d92] font-body">Data fetch frequency.</p>
                            </div>
                          </div>
                          <span className="text-xs font-headline font-bold text-[#29DEC9]">{settings.pollingRate}ms</span>
                        </div>
                        <input
                          type="range"
                          min={100}
                          max={2000}
                          step={100}
                          value={settings.pollingRate}
                          onChange={(e) => handleUpdate('pollingRate', parseInt(e.target.value))}
                          className="w-full h-1.5 bg-[#323538] rounded-lg appearance-none cursor-pointer accent-[#29DEC9]"
                        />
                        <div className="flex justify-between text-[10px] text-[#8b8d92]/50 font-mono">
                          <span>100ms</span>
                          <span>2000ms</span>
                        </div>
                      </div>
                    </div>

                    <SettingsRow
                      icon="psychology"
                      iconColor="#A855F7"
                      title="PREDICTIVE ANALYTICS"
                      description="AI-driven race strategy forecasting."
                    >
                      <Toggle
                        id="toggle-predictive"
                        checked={settings.predictiveAnalytics}
                        onChange={() => handleUpdate('predictiveAnalytics', !settings.predictiveAnalytics)}
                      />
                    </SettingsRow>
                  </div>
                </section>

                {/* Performance Stats — read-only ephemeral */}
                <section className="rounded-2xl p-5 sm:p-6 md:p-8" style={getGlassStyle(settings.glassMorphism)}>
                  <h3 className="font-headline font-bold text-base sm:text-lg mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[var(--theme-accent)]">analytics</span>
                    CURRENT_CONFIG
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    {[
                      { label: 'POLLING', value: `${settings.pollingRate}ms`, active: true },
                      { label: 'AUTO REFRESH', value: settings.autoRefresh ? 'ACTIVE' : 'OFF', active: settings.autoRefresh },
                      { label: 'INTERVAL', value: settings.autoRefresh ? `${settings.refreshInterval / 60}m` : '—', active: settings.autoRefresh },
                      { label: 'AI PREDICT', value: settings.predictiveAnalytics ? 'ON' : 'OFF', active: settings.predictiveAnalytics },
                    ].map((stat) => (
                      <div key={stat.label} className="p-3 sm:p-4 rounded-xl bg-[#191c1f] border border-white/5">
                        <p className="text-[10px] font-headline font-bold text-[#8b8d92] tracking-widest mb-1">{stat.label}</p>
                        <p className={`font-headline font-bold text-base sm:text-lg ${stat.active ? 'text-[#29DEC9]' : 'text-[#8b8d92]/40'}`}>
                          {stat.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}

            {/* ══ TAB: THEME ══ */}
            {activeTab === 'THEME' && (
              <>
                {/* Interface Core */}
                <section className="rounded-2xl p-5 sm:p-6 md:p-8" style={getGlassStyle(settings.glassMorphism)}>
                  <h3 className="font-headline font-bold text-base sm:text-lg mb-6 sm:mb-8 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[var(--theme-accent)]">brush</span>
                    INTERFACE_CORE
                  </h3>
                  <div className="space-y-6 sm:space-y-8">
                    {/* Color Accent */}
                    <div className="space-y-3">
                      <p className="font-headline font-bold text-xs sm:text-sm tracking-tight">COLOR ACCENT</p>
                      <p className="text-[10px] sm:text-xs text-[#8b8d92] font-body -mt-1">Primary color used throughout the interface.</p>
                      <div className="flex gap-3 flex-wrap">
                        {ACCENT_COLORS.map((color) => (
                          <button
                            key={color.value}
                            onClick={() => handleUpdate('accentColor', color.value)}
                            className={`w-10 h-10 sm:w-9 sm:h-9 rounded-full transition-all duration-200 ${
                              settings.accentColor === color.value
                                ? 'ring-2 ring-offset-2 ring-offset-[#111417] scale-110 shadow-lg'
                                : 'hover:scale-110 opacity-70 hover:opacity-100'
                            }`}
                            style={{
                              backgroundColor: color.value,
                              ...(settings.accentColor === color.value
                                ? { boxShadow: `0 0 20px ${color.value}40` }
                                : {}),
                            }}
                            title={color.label}
                            aria-label={`Set accent color to ${color.label}`}
                          />
                        ))}
                      </div>
                      <p className="text-[10px] text-[#8b8d92]/50 font-mono mt-1">
                        Active: {ACCENT_COLORS.find((c) => c.value === settings.accentColor)?.label || settings.accentColor}
                      </p>
                    </div>

                    {/* Visual Density */}
                    <div className="space-y-3">
                      <p className="font-headline font-bold text-xs sm:text-sm tracking-tight">VISUAL DENSITY</p>
                      <p className="text-[10px] sm:text-xs text-[#8b8d92] font-body -mt-1">Adjust spacing and element sizing.</p>
                      <SegmentedControl
                        options={[
                          { label: 'COMPACT', value: 'compact' as const },
                          { label: 'BALANCED', value: 'default' as const },
                          { label: 'RELAXED', value: 'comfortable' as const },
                        ]}
                        value={settings.dataDensity}
                        onChange={(v) => handleUpdate('dataDensity', v)}
                        isGlass={settings.glassMorphism}
                      />
                    </div>
                  </div>
                </section>

                {/* Visual Effects */}
                <section className="rounded-2xl p-5 sm:p-6 md:p-8" style={getGlassStyle(settings.glassMorphism)}>
                  <h3 className="font-headline font-bold text-base sm:text-lg mb-6 sm:mb-8 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[var(--theme-accent)]">auto_awesome</span>
                    VISUAL_EFFECTS
                  </h3>
                  <div className="space-y-2">
                    <SettingsRow
                      icon="animation"
                      iconColor="#FACC15"
                      title="ANIMATIONS"
                      description="Smooth transitions and micro-effects."
                    >
                      <Toggle
                        id="toggle-animations"
                        checked={settings.showAnimations}
                        onChange={() => handleUpdate('showAnimations', !settings.showAnimations)}
                      />
                    </SettingsRow>

                    <SettingsRow
                      icon="blur_on"
                      iconColor="#29DEC9"
                      title="GLASS_MORPHISM"
                      description="Enable frosted transparency effects."
                    >
                      <Toggle
                        id="toggle-glass"
                        checked={settings.glassMorphism}
                        onChange={() => handleUpdate('glassMorphism', !settings.glassMorphism)}
                      />
                    </SettingsRow>
                  </div>
                </section>

                {/* Keyboard Shortcuts */}
                <section className="rounded-2xl p-5 sm:p-6 md:p-8" style={getGlassStyle(settings.glassMorphism)}>
                  <h3 className="font-headline font-bold text-xs sm:text-sm mb-4 sm:mb-6 flex items-center gap-3 text-[#8b8d92]/60 tracking-widest">
                    <span className="material-symbols-outlined text-sm">keyboard</span>
                    KEYBOARD_SHORTCUTS
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    {[
                      { keys: '⌘ K', description: 'Open Search' },
                      { keys: 'ESC', description: 'Close Modal / Go Back' },
                      { keys: '↑ ↓', description: 'Navigate Results' },
                      { keys: 'ENTER', description: 'Select Result' },
                    ].map((shortcut) => (
                      <div
                        key={shortcut.keys}
                        className="flex items-center justify-between bg-[#111417] px-4 sm:px-5 py-2.5 sm:py-3 border border-white/5 rounded-xl"
                      >
                        <span className="text-[#8b8d92] text-[10px] sm:text-xs">{shortcut.description}</span>
                        <kbd className="px-2 py-1 bg-white/5 border border-white/10 text-[#8b8d92] text-[10px] font-mono tracking-wider rounded">
                          {shortcut.keys}
                        </kbd>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}

            {/* ══ TAB: ALERTS ══ */}
            {activeTab === 'ALERTS' && (
              <>
                <section className="rounded-2xl p-5 sm:p-6 md:p-8" style={getGlassStyle(settings.glassMorphism)}>
                  <h3 className="font-headline font-bold text-base sm:text-lg mb-6 sm:mb-8 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[var(--theme-accent)]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      notifications_active
                    </span>
                    RACE_NOTIFICATIONS
                  </h3>
                  <div className="space-y-2">
                    <SettingsRow
                      icon="warning"
                      iconColor="#EAB308"
                      title="YELLOW FLAG ALERTS"
                      description="Immediate alerts for track sector hazards."
                    >
                      <Toggle
                        id="toggle-yellowflag"
                        checked={settings.yellowFlagAlerts}
                        onChange={() => handleUpdate('yellowFlagAlerts', !settings.yellowFlagAlerts)}
                      />
                    </SettingsRow>

                    <SettingsRow
                      icon="flag"
                      iconColor="var(--theme-accent)"
                      title="SESSION START"
                      description="15-minute warnings before FP, Quali, and Race."
                    >
                      <Toggle
                        id="toggle-session"
                        checked={settings.sessionStartAlerts}
                        onChange={() => handleUpdate('sessionStartAlerts', !settings.sessionStartAlerts)}
                      />
                    </SettingsRow>

                    <SettingsRow
                      icon="chat"
                      iconColor="#29DEC9"
                      title="TEAM RADIO TRANSCRIPTS"
                      description="Push notifications for key driver messages."
                    >
                      <Toggle
                        id="toggle-teamradio"
                        checked={settings.teamRadioAlerts}
                        onChange={() => handleUpdate('teamRadioAlerts', !settings.teamRadioAlerts)}
                      />
                    </SettingsRow>
                  </div>
                </section>

                {/* Notification Summary */}
                <section className="rounded-2xl p-5 sm:p-6 md:p-8" style={getGlassStyle(settings.glassMorphism)}>
                  <h3 className="font-headline font-bold text-base sm:text-lg mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[var(--theme-accent)]">checklist</span>
                    ALERT_SUMMARY
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    {[
                      { label: 'Yellow Flags', active: settings.yellowFlagAlerts, icon: '⚠️' },
                      { label: 'Session Start', active: settings.sessionStartAlerts, icon: '🏁' },
                      { label: 'Team Radio', active: settings.teamRadioAlerts, icon: '📻' },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className={`p-4 rounded-xl border transition-colors ${
                          item.active
                            ? 'border-[#29DEC9]/30 bg-[#29DEC9]/5'
                            : 'border-white/5 bg-[#191c1f]'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-lg">{item.icon}</span>
                          <span className={`text-xs font-headline font-bold tracking-widest ${item.active ? 'text-[#29DEC9]' : 'text-[#8b8d92]/40'}`}>
                            {item.active ? 'ENABLED' : 'DISABLED'}
                          </span>
                        </div>
                        <p className="text-xs text-[#8b8d92]">{item.label}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Privacy note */}
                <section className="rounded-2xl p-5 sm:p-6 md:p-8" style={getGlassStyle(settings.glassMorphism)}>
                  <h3 className="font-headline font-bold text-base sm:text-lg mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[var(--theme-accent)]">security</span>
                    DATA_PRIVACY
                  </h3>
                  <p className="text-xs sm:text-sm text-[#8b8d92] leading-relaxed mb-4">
                    All settings are stored locally in your browser. No personal data is transmitted to external servers.
                    Notification preferences are UI-only and do not connect to push notification services in this version.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      to="/privacy"
                      className="text-[10px] font-headline font-bold tracking-widest text-[var(--theme-accent)] hover:underline flex items-center gap-1"
                    >
                      PRIVACY POLICY <span className="material-symbols-outlined text-xs">arrow_forward</span>
                    </Link>
                    <Link
                      to="/terms"
                      className="text-[10px] font-headline font-bold tracking-widest text-[#8b8d92] hover:text-white hover:underline flex items-center gap-1"
                    >
                      TERMS OF SERVICE <span className="material-symbols-outlined text-xs">arrow_forward</span>
                    </Link>
                    <Link
                      to="/cookies"
                      className="text-[10px] font-headline font-bold tracking-widest text-[#8b8d92] hover:text-white hover:underline flex items-center gap-1"
                    >
                      COOKIE PREFERENCES <span className="material-symbols-outlined text-xs">arrow_forward</span>
                    </Link>
                    <Link
                      to="/credits"
                      className="text-[10px] font-headline font-bold tracking-widest text-[#8b8d92] hover:text-white hover:underline flex items-center gap-1"
                    >
                      CREDITS <span className="material-symbols-outlined text-xs">arrow_forward</span>
                    </Link>
                  </div>
                </section>
              </>
            )}

            {/* ═══════════════════ Action Buttons (Always visible) ═══════════════════ */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 pb-10 sm:pb-16 md:pb-20 pt-2">
              <button
                onClick={handleReset}
                className={`px-6 sm:px-8 py-3 rounded-xl font-headline font-bold tracking-widest text-xs transition-all duration-200 active:scale-95 ${
                  showResetConfirm
                    ? 'bg-red-600/20 text-red-400 border border-red-500/40'
                    : 'bg-[#323538] text-[#d1d5db] hover:bg-[#3a3d41]'
                }`}
              >
                {showResetConfirm ? '⚠ TAP AGAIN TO CONFIRM' : 'RESET_DEFAULTS'}
              </button>
              <button
                onClick={handleSave}
                className={`px-8 sm:px-10 py-3 rounded-xl font-headline font-black tracking-widest text-xs transition-all duration-200 shadow-lg active:scale-95 ${
                  saved
                    ? 'bg-[#29DEC9] text-[#003731] shadow-[#29DEC9]/20'
                    : 'bg-gradient-to-br from-[var(--theme-accent)] to-[#E10600] text-white hover:scale-105 hover:shadow-xl'
                }`}
              >
                {saved ? '✓ CONFIG_SAVED' : 'SAVE_CONFIG'}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
}
