import { useScroll, useTransform, MotionValue } from 'motion/react';
import { useReducedMotionPreference } from './useReducedMotionPreference';

export function useParallax(distance: number = 100): MotionValue<number> {
  const { scrollY } = useScroll();
  const prefersReducedMotion = useReducedMotionPreference();
  
  const y = useTransform(scrollY, [0, 1000], [0, distance]);
  
  // Return a static value if reduced motion is preferred
  return prefersReducedMotion ? useTransform(scrollY, () => 0) : y;
}
