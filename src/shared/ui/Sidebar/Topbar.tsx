'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDisciplines } from '@/shared/lib/DisciplinesContext';
import { useSidebar } from '@/shared/lib/SidebarContext';
import Button from '@/shared/ui/Button/Button';
import { ArrowRight } from 'lucide-react';

type Crumb = { href: string; label: string };

export type TopbarNavLink = {
  match: string;
  label: string;
};

type TopbarProps = {
  logoHref?: string;
  logoLabel?: string;
  logoAccent?: string;
  navLinks?: TopbarNavLink[];
  ctaHref?: string;
  ctaLabel?: string;
};

const DEFAULT_NAV: TopbarNavLink[] = [
  { match: '/plan/graph', label: 'Навчальний план' },
  { match: '/plan/competencies', label: 'Матриця компетентностей' },
  { match: '/plan/results', label: 'Результати навчання' },
  { match: '/', label: 'Освітня програма' },
];

function useBreadcrumbs(navLinks: TopbarNavLink[], logoHref: string, logoLabel: string): Crumb[] {
  const pathname = usePathname();
  const disciplines = useDisciplines();

  const base: Crumb[] = [{ href: logoHref, label: logoLabel }];

  if (pathname === logoHref) return [];

  if (pathname.startsWith('/plan/disciplines/')) {
    const code = decodeURIComponent(pathname.split('/').pop() ?? '');
    const discipline = disciplines.find((d) => d.code === code);
    return [
      ...base,
      { href: pathname, label: discipline?.shortName ?? discipline?.name ?? code },
    ];
  }

  const matched = navLinks.find((r) => pathname.startsWith(r.match));
  if (!matched || matched.match === logoHref) return base;

  return [...base, { href: matched.match, label: matched.label }];
}

function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav className="breadcrumb">
      {crumbs.map((crumb, i) => (
        <span key={crumb.href + i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {i > 0 && <span>/</span>}
          {i === crumbs.length - 1
            ? <span className="breadcrumb__current">{crumb.label}</span>
            : <Link href={crumb.href}>{crumb.label}</Link>
          }
        </span>
      ))}
    </nav>
  );
}

export function Topbar({
  logoHref = '/',
  logoLabel = 'Освітня програма',
  logoAccent = 'ВНАУ',
}: TopbarProps) {
  const pathname = usePathname();
  const { open, toggle } = useSidebar();

  const match = pathname.match(/^\/plan\/([^\/]+)/);
  const programId = match ? match[1] : null;

  const dynamicNavLinks = programId ? [
    { match: `/plan/${programId}/graph`, label: 'Навчальний план' },
    { match: `/plan/${programId}/competencies`, label: 'Матриця компетентностей' },
    { match: `/plan/${programId}/results`, label: 'Результати навчання' },
    { match: `/plan/${programId}`, label: 'Освітня програма' },
  ] : [];

  const crumbs = useBreadcrumbs(dynamicNavLinks, logoHref, logoLabel);

  const isLanding = pathname === logoHref;

  const [hasProgram, setHasProgram] = useState<string | null>(null);
  useEffect(() => {
    // get from localStorage
    const saved = localStorage.getItem('programVersionId');
    if (saved) setHasProgram(saved);
  }, [pathname]);

  const ctaHref = hasProgram ? `/plan/${hasProgram}/graph` : undefined;
  const ctaLabel = 'Навчальний план';

  // Split logo label into base + accent
  const logoParts = `КН · ${logoAccent}`;

  return (
    <header className="topbar">
      <div className="topbar__left">
        <button
          onClick={toggle}
          className={`burger burger--desktop ${open ? 'burger--open' : ''}`}
          aria-label="Меню"
        >
          <span className="burger__line" />
          <span className="burger__line" />
          <span className="burger__line" />
        </button>

        <Link href={logoHref} className="logo">
          КН · <em>{logoAccent}</em>
        </Link>

        {!isLanding && <Breadcrumbs crumbs={crumbs} />}
      </div>

      <div className="topbar__right">
        {isLanding && hasProgram && ctaHref && (
          <Button href={ctaHref} className="topbar__btn">
            <span className="topbar__btn-text">{ctaLabel}</span>
            <ArrowRight size={16} />
          </Button>
        )}
        <button
          onClick={toggle}
          className={`burger burger--mobile ${open ? 'burger--open' : ''}`}
          aria-label="Меню"
        >
          <span className="burger__line" />
          <span className="burger__line" />
          <span className="burger__line" />
        </button>
      </div>
    </header>
  );
}
