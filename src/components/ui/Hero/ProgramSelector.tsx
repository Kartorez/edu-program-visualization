'use client';
import { useState, useRef, useEffect } from 'react';
import styles from './Hero.module.scss';
import { useRouter } from 'next/navigation';
import { ChevronDown, ArrowLeft, Check } from 'lucide-react';

export type ProgramOption = {
  id: string | number;
  label: string;
  year: number;
  degree: string;
  isCurrent?: boolean;
};

interface ProgramSelectorProps {
  currentLabel: string;
  options: ProgramOption[];
}

export default function ProgramSelector({ currentLabel, options }: ProgramSelectorProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (id: string | number) => {
    document.cookie = `programVersionId=${id}; path=/; max-age=31536000`;
    setOpen(false);
    window.location.reload();
  };

  const handleBackToWizard = (e: React.MouseEvent) => {
    e.preventDefault();
    document.cookie = 'programVersionId=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    setOpen(false);
    window.location.href = '/';
  };

  return (
    <div ref={ref} className={styles.selector}>
      <button
        className={`${styles.selector__trigger} ${open ? styles['selector__trigger--open'] : ''}`}
        onClick={() => setOpen(!open)}
      >
        <span className={styles.selector__dot} />
        <span className={styles.selector__text}>{currentLabel}</span>
        <ChevronDown
          size={18}
          strokeWidth={2.5}
          className={`${styles.selector__chevron} ${open ? styles['selector__chevron--open'] : ''}`}
        />
      </button>

      {open && (
        <div className={styles.selector__dropdown}>
          {options.length > 0 && (
            <div className={styles.selector__list}>
              <div className={styles.selector__label}>Доступні програми</div>
              {options.map((opt, i) => (
                <button
                  key={i}
                  className={`${styles.selector__option} ${opt.isCurrent ? styles['selector__option--active'] : ''}`}
                  onClick={() => handleSelect(opt.id)}
                >
                  <span
                    className={`${styles.selector__optDot} ${opt.isCurrent ? styles['selector__optDot--active'] : ''}`}
                  />
                  <span>{opt.label}</span>
                  {opt.isCurrent && <Check size={16} strokeWidth={2.5} className={styles.selector__check} />}
                </button>
              ))}
            </div>
          )}
          {options.length > 0 && <div className={styles.selector__divider} />}
          <a href="/" className={styles.selector__back} onClick={handleBackToWizard}>
            <ArrowLeft size={16} strokeWidth={2.5} />
            Змінити спеціальність
          </a>
        </div>
      )}
    </div>
  );
}
