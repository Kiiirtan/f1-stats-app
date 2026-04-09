import { useEffect, useRef, useState } from 'react';

export function useScrollReveal(threshold = 0.1) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Only trigger once when scrolling down
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Stop observing once revealed to save memory
          observer.unobserve(el);
        }
      },
      { root: null, rootMargin: '0px', threshold }
    );

    observer.observe(el);

    return () => {
      observer.unobserve(el);
    };
  }, [threshold]);

  return { ref, isVisible };
}
