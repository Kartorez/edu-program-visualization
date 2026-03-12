'use client';

import Link from 'next/link';
import './Button.scss';

type ButtonProps = {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
};

export default function Button({ href, onClick, children, className, disabled }: ButtonProps) {
  const cn = `button ${className ?? ''}`.trim();

  if (href) {
    return (
      <Link href={href} className={cn}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={cn} disabled={disabled}>
      {children}
    </button>
  );
}
