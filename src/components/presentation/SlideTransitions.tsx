import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';

export type TransitionType = 'fade' | 'slide' | 'zoom' | 'flip' | 'cube';

interface SlideTransitionsProps {
  children: ReactNode;
  transitionType: TransitionType;
  direction?: 'left' | 'right';
}

const transitions = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slide: {
    initial: (direction: 'left' | 'right') => ({
      x: direction === 'right' ? 100 : -100,
      opacity: 0,
    }),
    animate: { x: 0, opacity: 1 },
    exit: (direction: 'left' | 'right') => ({
      x: direction === 'right' ? -100 : 100,
      opacity: 0,
    }),
  },
  zoom: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.8, opacity: 0 },
  },
  flip: {
    initial: { rotateY: 90, opacity: 0 },
    animate: { rotateY: 0, opacity: 1 },
    exit: { rotateY: -90, opacity: 0 },
  },
  cube: {
    initial: { rotateY: -90, opacity: 0, transformPerspective: 1200 },
    animate: { rotateY: 0, opacity: 1, transformPerspective: 1200 },
    exit: { rotateY: 90, opacity: 0, transformPerspective: 1200 },
  },
};

export const SlideTransitions = ({
  children,
  transitionType,
  direction = 'right',
}: SlideTransitionsProps) => {
  const transition = transitions[transitionType];
  const duration = transitionType === 'cube' ? 0.7 : 0.5;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={typeof transition.initial === 'function' ? transition.initial(direction) : transition.initial}
        animate={transition.animate}
        exit={typeof transition.exit === 'function' ? transition.exit(direction) : transition.exit}
        transition={{ duration, ease: 'easeInOut' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
