'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDisciplines } from '@/context/DisciplinesContext';
import Button from '@/components/ui/Button/Button';
import { useSidebar } from '@/context/SidebarContext';

function useBreadcrumbs() {
  const pathname = usePathname();
  const disciplines = useDisciplines();

  const crumbs = [{ href: '/', label: 'Головна' }];

  if (pathname.startsWith('/plan/competencies')) {
    crumbs.push({ href: '/plan', label: 'Навчальний план' });
    crumbs.push({ href: '/plan/competencies', label: 'Матриця компетентностей' });
  } else if (pathname.startsWith('/plan/results')) {
    crumbs.push({ href: '/plan', label: 'Навчальний план' });
    crumbs.push({ href: '/plan/results', label: 'Результати навчання' });
  } else if (pathname.startsWith('/plan/disciplines/')) {
    const code = decodeURIComponent(pathname.split('/').pop() ?? '');
    const discipline = disciplines.find((d) => d.code === code);
    crumbs.push({ href: '/plan', label: 'Навчальний план' });
    crumbs.push({
      href: pathname,
      label: discipline?.shortName ?? discipline?.name ?? code,
    });
  } else if (pathname.startsWith('/plan')) {
    crumbs.push({ href: '/plan', label: 'Навчальний план' });
  }

  return crumbs;
}

export function Topbar() {
  const pathname = usePathname();
  const { open, toggle } = useSidebar();
  const crumbs = useBreadcrumbs();

  const isLanding = pathname === '/';

  return (
    <header className="topbar">
      <div className="topbar__left">
        <button
          onClick={toggle}
          className={`burger ${open ? 'burger--open' : ''}`}
          aria-label="Меню"
        >
          <span className="burger__line" />
          <span className="burger__line" />
          <span className="burger__line" />
        </button>

        <Link href="/" className="logo">
          КН · <em>ВНАУ</em>
        </Link>

        {!isLanding && (
          <nav className="breadcrumb">
            {crumbs.map((crumb, i) => (
              <span key={crumb.href} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {i > 0 && <span>/</span>}
                {i === crumbs.length - 1 ? (
                  <span className="breadcrumb__current">{crumb.label}</span>
                ) : (
                  <Link href={crumb.href}>{crumb.label}</Link>
                )}
              </span>
            ))}
          </nav>
        )}
      </div>

      <div className="topbar__right">
        {isLanding && <Button href="/plan"> Навчальний план →</Button>}
      </div>
    </header>
  );
}
