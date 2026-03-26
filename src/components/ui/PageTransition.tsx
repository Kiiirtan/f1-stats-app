import { useEffect, useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';

interface Props {
  children: ReactNode;
}

export default function PageTransition({ children }: Props) {
  const { settings } = useSettings();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [displayLocation, setDisplayLocation] = useState(location);

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      if (!settings.showAnimations) {
        setDisplayLocation(location);
        window.scrollTo(0, 0);
        return;
      }
      setIsVisible(false);
      const timer = setTimeout(() => {
        setDisplayLocation(location);
        setIsVisible(true);
        window.scrollTo(0, 0);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [location, displayLocation, settings.showAnimations]);

  if (!settings.showAnimations) {
    return <>{children}</>;
  }

  return (
    <div
      className={`transition-all duration-200 ease-in-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }`}
    >
      {children}
    </div>
  );
}
