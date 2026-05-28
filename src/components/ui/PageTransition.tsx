import { motion, Variants } from 'framer-motion';
import { useSettings } from '../../context/SettingsContext';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const transitionVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 24,
    scale: 0.985,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: { 
      type: 'spring',
      stiffness: 260,
      damping: 30,
      mass: 0.8,
    },
  },
  exit: { 
    opacity: 0, 
    y: -12,
    scale: 0.99,
    transition: { 
      duration: 0.18, 
      ease: [0.4, 0, 1, 1],
    },
  },
};

export default function PageTransition({ children }: Props) {
  const { settings } = useSettings();

  if (!settings.showAnimations) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={transitionVariants}
      style={{ willChange: 'opacity, transform' }}
    >
      {children}
    </motion.div>
  );
}
