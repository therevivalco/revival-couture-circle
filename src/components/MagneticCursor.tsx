import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const MagneticCursor = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const cursorDotX = useMotionValue(-100);
  const cursorDotY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 200 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);
  const dotXSpring = useSpring(cursorDotX, { damping: 30, stiffness: 300 });
  const dotYSpring = useSpring(cursorDotY, { damping: 30, stiffness: 300 });

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 20);
      cursorY.set(e.clientY - 20);
      cursorDotX.set(e.clientX - 4);
      cursorDotY.set(e.clientY - 4);
    };

    window.addEventListener('mousemove', moveCursor);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
    };
  }, [cursorX, cursorY, cursorDotX, cursorDotY]);

  return (
    <>
      <motion.div
        className="fixed w-10 h-10 border border-primary/30 rounded-full pointer-events-none z-[9999] hidden md:block mix-blend-difference"
        style={{
          left: cursorXSpring,
          top: cursorYSpring,
        }}
      />
      <motion.div
        className="fixed w-2 h-2 bg-primary rounded-full pointer-events-none z-[9999] hidden md:block mix-blend-difference"
        style={{
          left: dotXSpring,
          top: dotYSpring,
        }}
      />
    </>
  );
};

export default MagneticCursor;
