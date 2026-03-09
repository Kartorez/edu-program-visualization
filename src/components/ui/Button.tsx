'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import './Button.scss';

const MotionLink = motion.create(Link);

type ButtonProps = {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
};

export default function Button({ href, onClick, children, className }: ButtonProps) {
  const cn = `button ${className ?? ''}`.trim();

  const motionProps = {
    whileHover: { scale: 1.04 },
    whileTap: { scale: 0.96 },
    transition: { type: 'spring' as const, stiffness: 400, damping: 20 },
    className: cn,
  };

  if (href) {
    return (
      <MotionLink href={href} {...motionProps}>
        {children}
      </MotionLink>
    );
  }

  return (
    <motion.button onClick={onClick} {...motionProps}>
      {children}
    </motion.button>
  );
}
