'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDisciplines } from '@/context/DisciplinesContext';
import Button from '@/components/ui/Button/Button';
import { useSidebar } from '@/context/SidebarContext';
import { ArrowRight } from 'lucide-react';

type Crumb = { href: string; label: string };

const ROUTE_MAP = [
  { match: '/plan/graph', label: 'Навчальний план' },
  { match: '/plan/competencies', label: 'Матриця компетентностей' },
  { match: '/plan/results', label: 'Результати навчання' },
  { match: '/', label: 'Освітня програма' },
];

function useBreadcrumbs(): Crumb[] {
  const pathname = usePathname();
  const disciplines = useDisciplines();

  const base: Crumb[] = [{ href: '/', label: 'Освітня програма' }];

  if (pathname === '/') return [];

  if (pathname.startsWith('/plan/disciplines/')) {
    const code = decodeURIComponent(pathname.split('/').pop() ?? '');
    const discipline = disciplines.find((d) => d.code === code);
    return [
      ...base,
      { href: pathname, label: discipline?.shortName ?? discipline?.name ?? code },
    ];
  }

  const matched = ROUTE_MAP.find((r) => pathname.startsWith(r.match));
  if (!matched || matched.match === '/') return base;

  return [
    ...base,
    { href: matched.match, label: matched.label }
  ];
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

export function Topbar() {
  const pathname = usePathname();
  const { open, toggle } = useSidebar();
  const crumbs = useBreadcrumbs();

  const isLanding = pathname === '/';

  const [hasProgram, setHasProgram] = useState(false);
  useEffect(() => {
    setHasProgram(document.cookie.includes('programVersionId='));
  }, [pathname]);

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

        <Link href="/" className="logo">
          КН · <em>ВНАУ</em>
        </Link>

        {!isLanding && <Breadcrumbs crumbs={crumbs} />}
      </div>

      <div className="topbar__right">
        {isLanding && hasProgram && (
          <Button href="/plan/graph" className="topbar__btn">
            <span className="topbar__btn-text">Навчальний план</span>
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