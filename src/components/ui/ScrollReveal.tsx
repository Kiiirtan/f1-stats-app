import { type ReactNode } from 'react';
import useInView from '../../hooks/useInView';
import { useSettings } from '../../context/SettingsContext';

interface Props {
  children: ReactNode;
  className?: string;
  direction?: 'up' | 'left' | 'right' | 'down';
  delay?: number;
  duration?: number;
  distance?: number;
}

export default function ScrollReveal({
  children,
  className = '',
  direction = 'up',
  delay = 0,
  duration = 600,
  distance = 40,
}: Props) {
  const { settings } = useSettings();
  const { ref, inView } = useInView({ threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  if (!settings.showAnimations) {
    return <div className={className}>{children}</div>;
  }

  const transforms: Record<string, string> = {
    up: `translateY(${distance}px)`,
    down: `translateY(-${distance}px)`,
    left: `translateX(${distance}px)`,
    right: `translateX(-${distance}px)`,
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translate(0, 0)' : transforms[direction],
        transition: `opacity ${duration}ms ease-out ${delay}ms, transform ${duration}ms ease-out ${delay}ms`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
}
