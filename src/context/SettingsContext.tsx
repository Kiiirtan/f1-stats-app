import React, { createContext, useContext, useState, useEffect } from 'react';

export interface SettingsState {
  theme: 'dark' | 'light';
  accentColor: string;
  showAnimations: boolean;
  dataDensity: 'compact' | 'default' | 'comfortable';
  autoRefresh: boolean;
  refreshInterval: number; // seconds
  units: 'metric' | 'imperial';
  defaultPage: string;
}

const SETTINGS_KEY = 'f1app_settings';

export const defaultSettings: SettingsState = {
  theme: 'dark',
  accentColor: `var(--theme-accent)`,
  showAnimations: true,
  dataDensity: 'default',
  autoRefresh: true,
  refreshInterval: 300,
  units: 'metric',
  defaultPage: '/',
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
