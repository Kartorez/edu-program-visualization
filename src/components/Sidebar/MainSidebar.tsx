'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useDisciplines } from '@/context/DisciplinesContext';
import { sortByCode } from '@/utils/sortByCode';

const SECTIONS = [
  { href: '/plan', label: 'Навчальний план' },
  { href: '/plan/competencies', label: 'Матриця компетентн.' },
  { href: '/plan/results', label: 'Результати навчання' },
];

export function MainSidebar() {
  const pathname = usePathname();
  const disciplines = useDisciplines();
  const [openSemester, setOpenSemester] = useState<number | null>(null);

  const semesters = [
    ...new Set(
      disciplines.flatMap(
        (d) => d.semesters?.map((s) => s.semester).filter((s): s is number => s != null) ?? []
      )
    ),
  ].sort((a, b) => a - b);

  const disciplinesBySemester = (sem: number) =>
    sortByCode(disciplines.filter((d) => d.semesters?.some((s) => s.semester === sem)));

  return (
    <nav className="sidebar__nav">
      <div className="sidebar__section-label">Розділи</div>
      {SECTIONS.map((s) => (
        <Link
          key={s.href}
          href={s.href}
          className={`sidebar__item ${pathname === s.href ? 'sidebar__item--active' : ''}`}
        >
          <span className="sidebar__dot" />
          {s.label}
        </Link>
      ))}

      <div className="sidebar__divider" />
      <div className="sidebar__section-label">Семестри</div>

      {semesters.map((n) => {
        const items = disciplinesBySemester(n);
        const isOpen = openSemester === n;

        return (
          <div key={n}>
            <button
              className={`sidebar__semester ${isOpen ? 'sidebar__semester--active' : ''}`}
              onClick={() => setOpenSemester(isOpen ? null : n)}
            >
              <span className="sidebar__semester-number">{n}</span>
              <span className="sidebar__semester-label">Семестр {n}</span>
              <span className="sidebar__semester-count">{items.length}</span>
              <span className="sidebar__semester-chevron">{isOpen ? '▴' : '▾'}</span>
            </button>

            {isOpen && (
              <div className="sidebar__semester-items">
                {items.map((d) => (
                  <Link
                    key={d.id}
                    href={`/plan/disciplines/${encodeURIComponent(d.code)}`}
                    className="sidebar__subject-item"
                  >
                    <span className="sidebar__dot" />
                    {d.code} · {d.shortName ?? d.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
