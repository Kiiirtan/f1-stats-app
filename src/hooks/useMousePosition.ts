import { useState, useEffect, useRef } from 'react';

interface MousePosition {
  x: number;
  y: number;
  normalX: number;
  normalY: number;
}

export default function useMousePosition(): MousePosition {
  const [pos, setPos] = useState<MousePosition>({ x: 0, y: 0, normalX: 0.5, normalY: 0.5 });
  const raf = useRef(0);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => {
        setPos({
          x: e.clientX,
          y: e.clientY,
          normalX: e.clientX / window.innerWidth,
          normalY: e.clientY / window.innerHeight,
        });
      });
    };
    window.addEventListener('mousemove', handler);
    return () => {
      window.removeEventListener('mousemove', handler);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return pos;
}
