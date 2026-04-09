import React, { createContext, useContext, useState, useEffect } from 'react';

export interface SettingsState {
  // Appearance
  theme: 'dark' | 'light';
  accentColor: string;
  showAnimations: boolean;
  dataDensity: 'compact' | 'default' | 'comfortable';
  glassMorphism: boolean;

  // Data & Performance
  autoRefresh: boolean;
  refreshInterval: number; // seconds
  pollingRate: number; // milliseconds
  units: 'metric' | 'imperial';
  predictiveAnalytics: boolean;

  // Navigation
  defaultPage: string;
  desktopNavPosition: 'top' | 'side';

  // Notifications
  yellowFlagAlerts: boolean;
  sessionStartAlerts: boolean;
  teamRadioAlerts: boolean;

  // Profile
  displayName: string;
  email: string;
}

const SETTINGS_KEY = 'f1app_settings';

export const defaultSettings: SettingsState = {
  theme: 'dark',
  accentColor: '#E10600',
  showAnimations: true,
  dataDensity: 'default',
  glassMorphism: true,

  autoRefresh: true,
  refreshInterval: 300,
  pollingRate: 500,
  units: 'metric',
  predictiveAnalytics: false,

  defaultPage: '/',
  desktopNavPosition: 'side',

  yellowFlagAlerts: true,
  sessionStartAlerts: true,
  teamRadioAlerts: false,

  displayName: 'F1 Fan',
  email: '',
};

interface SettingsContextType {
  settings: SettingsState;
  updateSetting: <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => void;
  resetSettings: () => void;
  saveSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

function getStoredSettings(): SettingsState {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) return { ...defaultSettings, ...JSON.parse(stored) };
  } catch { /* ignore */ }
  return defaultSettings;
}

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SettingsState>(getStoredSettings);

  // Apply accent color to document root
  useEffect(() => {
    document.documentElement.style.setProperty('--theme-accent', settings.accentColor);
  }, [settings.accentColor]);

  // Apply glassmorphism class to document root for global CSS scoping
  useEffect(() => {
    const root = document.documentElement;
    if (settings.glassMorphism) {
      root.classList.add('glass-enabled');
      root.classList.remove('glass-disabled');
    } else {
      root.classList.add('glass-disabled');
      root.classList.remove('glass-enabled');
    }
  }, [settings.glassMorphism]);

  // Auto-save settings to localStorage on every change
  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  const updateSetting = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const saveSettings = () => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(defaultSettings));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSetting, resetSettings, saveSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
