import { motion, Variants } from 'framer-motion';
import { useSettings } from '../../context/SettingsContext';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

const transitionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { duration: 0.4, ease: 'easeInOut' }
  },
  exit: { 
    opacity: 0, 
    transition: { duration: 0.2, ease: 'easeInOut' }
  }
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
    >
      {children}
    </motion.div>
  );
}
