import useMousePosition from '../../hooks/useMousePosition';
import { useSettings } from '../../context/SettingsContext';

export default function CursorGlow() {
  const { settings } = useSettings();
  const { x, y } = useMousePosition();

  if (!settings.showAnimations) return null;

  return (
    <div
      className="pointer-events-none fixed z-[9999] w-96 h-96 rounded-full opacity-15 transition-transform duration-200 ease-out hidden md:block"
      style={{
        background: 'radial-gradient(circle, rgba(102,252,241,0.25) 0%, transparent 70%)',
        transform: `translate(${x - 192}px, ${y - 192}px)`,
        willChange: 'transform',
      }}
    />
  );
}
