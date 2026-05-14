'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import { useDisciplines } from '@/context/DisciplinesContext';
import { sortByCode } from '@/utils/sortByCode';
import { ChevronUp, ChevronDown, BookOpen, Network, Target, Award, Layers } from 'lucide-react';

const SECTIONS = [
  { href: '/plan', label: 'Про програму', icon: <BookOpen size={16} /> },
  { href: '/plan/graph', label: 'Навчальний план', icon: <Network size={16} /> },
  { href: '/plan/competencies', label: 'Матриця комп.', icon: <Target size={16} /> },
  { href: '/plan/results', label: 'Результати навч.', icon: <Award size={16} /> },
];

export function MainSidebar() {
  const pathname = usePathname();
  const disciplines = useDisciplines();
  
  const isDisciplinePage = pathname.startsWith('/plan/disciplines/');
  const currentDisciplineCode = isDisciplinePage ? decodeURIComponent(pathname.split('/').pop() ?? '') : null;
  const currentDiscipline = useMemo(() => 
    disciplines.find(d => d.code === currentDisciplineCode), 
    [disciplines, currentDisciplineCode]
  );

  const disciplineSemester = currentDiscipline?.semesters?.[0]?.semester;

  const [openSemester, setOpenSemester] = useState<number | null>(null);

  useEffect(() => {
    if (disciplineSemester) {
      setOpenSemester(disciplineSemester);
    }
  }, [disciplineSemester]);

  const semesters = useMemo(() => [
    ...new Set(
      disciplines.flatMap(
        (d) => d.semesters?.map((s) => s.semester).filter((s): s is number => s != null) ?? []
      )
    ),
  ].sort((a, b) => a - b), [disciplines]);

  const disciplinesBySemester = (sem: number) =>
    sortByCode(disciplines.filter((d) => d.semesters?.some((s) => s.semester === sem)));

  return (
    <nav className="sidebar__nav">
      <div className="sidebar__section-label">Навігація</div>
      <div className="sidebar__menu">
        {SECTIONS.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className={`sidebar__item ${pathname === s.href ? 'sidebar__item--active' : ''}`}
          >
            {s.icon}
            <span>{s.label}</span>
          </Link>
        ))}
      </div>

      <div className="sidebar__divider" />
      <div className="sidebar__section-label">Навчальний план</div>

      <div className="sidebar__semesters">
        {semesters.map((n) => {
          const items = disciplinesBySemester(n);
          const isOpen = openSemester === n;
          const hasActiveDiscipline = items.some(d => d.code === currentDisciplineCode);

          return (
            <div key={n} className={`sidebar__semester-group ${hasActiveDiscipline ? 'sidebar__semester-group--active' : ''}`}>
              <button
                className={`sidebar__semester ${isOpen ? 'sidebar__semester--active' : ''} ${hasActiveDiscipline ? 'sidebar__semester--highlight' : ''}`}
                onClick={() => setOpenSemester(isOpen ? null : n)}
              >
                <div className="sidebar__semester-info">
                  <span className="sidebar__semester-number">{n}</span>
                  <span className="sidebar__semester-label">Семестр {n}</span>
                </div>
                <div className="sidebar__semester-meta">
                  <span className="sidebar__semester-count">{items.length}</span>
                  <span className={`sidebar__semester-chevron ${isOpen ? 'sidebar__semester-chevron--open' : ''}`}>
                    <ChevronDown size={14} />
                  </span>
                </div>
              </button>

              <div className={`sidebar__semester-content ${isOpen ? 'sidebar__semester-content--open' : ''}`}>
                <div className="sidebar__semester-items">
                  {items.map((d) => {
                    const isActive = d.code === currentDisciplineCode;
                    return (
                      <Link
                        key={d.id}
                        href={`/plan/disciplines/${encodeURIComponent(d.code)}`}
                        className={`sidebar__subject-item ${isActive ? 'sidebar__subject-item--active' : ''}`}
                      >
                        <div className={`sidebar__subject-indicator ${d.type || 'required'}`} />
                        <span className="sidebar__subject-code">{d.code}</span>
                        <span className="sidebar__subject-name" title={d.name}>
                          {d.shortName ?? d.name}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
