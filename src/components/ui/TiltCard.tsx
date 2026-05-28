import { useRef, type ReactNode } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface Props {
  children: ReactNode;
  className?: string;
  intensity?: number;
}

const springConfig = { stiffness: 300, damping: 25, mass: 0.5 };

export default function TiltCard({ children, className = '', intensity = 15 }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Motion values for mouse position (0-1 normalized)
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  // Spring-smoothed rotation
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [intensity, -intensity]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-intensity, intensity]), springConfig);

  // Spring-smoothed scale
  const rawScale = useMotionValue(1);
  const scale = useSpring(rawScale, springConfig);

  // Shine gradient position
  const shineX = useTransform(mouseX, (v) => `${v * 100}%`);
  const shineY = useTransform(mouseY, (v) => `${v * 100}%`);
  const shineBackground = useTransform(
    [shineX, shineY],
    ([sx, sy]) => `radial-gradient(circle at ${sx} ${sy}, rgba(102,252,241,0.12) 0%, transparent 60%)`
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  const handleMouseEnter = () => {
    rawScale.set(1.02);
  };

  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
    rawScale.set(1);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative ${className}`}
      style={{
        transformStyle: 'preserve-3d',
        perspective: 800,
        rotateX,
        rotateY,
        scale,
        willChange: 'transform',
      }}
    >
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-sm z-10"
        style={{ background: shineBackground }}
      />
      {children}
    </motion.div>
  );
}
