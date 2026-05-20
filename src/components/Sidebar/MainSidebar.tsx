'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import { useDisciplines } from '@/context/DisciplinesContext';
import { sortByCode } from '@/utils/sortByCode';
import { ChevronUp, ChevronDown, BookOpen, Network, Target, Award, Layers, ChevronRight } from 'lucide-react';

const SECTIONS = [
  { href: '/plan', label: 'Про програму', icon: <BookOpen size={16} /> },
  { href: '/plan/graph', label: 'Навчальний план', icon: <Network size={16} /> },
  { href: '/plan/competencies', label: 'Матриця комп.', icon: <Target size={16} /> },
  { href: '/plan/results', label: 'Результати навч.', icon: <Award size={16} /> },
];

export function MainSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const semesterParam = searchParams.get('semester');
  const disciplines = useDisciplines();

  const isDisciplinePage = pathname.startsWith('/plan/disciplines/');
  const currentDisciplineCode = isDisciplinePage ? decodeURIComponent(pathname.split('/').pop() ?? '') : null;

  const currentDiscipline = useMemo(() => {
    if (!currentDisciplineCode) return null;
    if (semesterParam) {
      const sem = parseInt(semesterParam, 10);
      const found = disciplines.find((d: any) => d.code === currentDisciplineCode && d.currentSemester === sem);
      if (found) return found;
    }
    return disciplines.find((d: any) => d.code === currentDisciplineCode);
  }, [disciplines, currentDisciplineCode, semesterParam]);

  const disciplineSemester = (currentDiscipline as any)?.currentSemester as number | undefined;

  const [openSemester, setOpenSemester] = useState<number | null>(null);
  const [openElectiveGroups, setOpenElectiveGroups] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (disciplineSemester) {
      setOpenSemester(disciplineSemester);
      if (currentDisciplineCode) {
        const groupMatch = currentDisciplineCode.match(/^(ВК\s*\d+)/);
        if (groupMatch) {
          const gKey = groupMatch[1].replace(/\s+/, ' ');
          setOpenElectiveGroups(prev => ({ ...prev, [`${disciplineSemester}-${gKey}`]: true }));
        }
      }
    }
  }, [disciplineSemester, currentDisciplineCode]);

  const toggleElectiveGroup = (key: string) =>
    setOpenElectiveGroups(prev => ({ ...prev, [key]: !prev[key] }));

  const splitDisciplines = (items: any[]) => {
    const required: any[] = [];
    const electiveGroups: Record<string, any[]> = {};
    items.forEach((d: any) => {
      const groupMatch = (d.code as string)?.match(/^(ВК\s*\d+)/);
      if (groupMatch) {
        const gKey = groupMatch[1].replace(/\s+/, ' ');
        if (!electiveGroups[gKey]) electiveGroups[gKey] = [];
        electiveGroups[gKey].push(d);
      } else {
        required.push(d);
      }
    });
    return { required, electiveGroups };
  };

  const semesters = useMemo(() => [
    ...new Set(
      (disciplines as any[]).map((d) => d.currentSemester as number).filter((s) => s > 0)
    ),
  ].sort((a, b) => a - b), [disciplines]);

  const disciplinesBySemester = (sem: number) =>
    sortByCode(disciplines.filter((d: any) => d.currentSemester === sem));

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
          const { required, electiveGroups } = splitDisciplines(items);
          const electiveGroupKeys = Object.keys(electiveGroups).sort();
          const displayCount = required.length + electiveGroupKeys.length;
          const isOpen = openSemester === n;
          const hasActiveDiscipline = currentDisciplineCode !== null && disciplineSemester === n;

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
                  <span className="sidebar__semester-count">{displayCount}</span>
                  <span className={`sidebar__semester-chevron ${isOpen ? 'sidebar__semester-chevron--open' : ''}`}>
                    <ChevronDown size={14} />
                  </span>
                </div>
              </button>

              <div className={`sidebar__semester-content ${isOpen ? 'sidebar__semester-content--open' : ''}`}>
                <div className="sidebar__semester-items">
                  {required.map((d: any) => {
                    const isActive = d.code === currentDisciplineCode;
                    return (
                      <Link
                        key={d.code}
                        href={`/plan/disciplines/${encodeURIComponent(d.code)}?semester=${n}`}
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

                  {electiveGroupKeys.map((gKey) => {
                    const groupItemKey = `${n}-${gKey}`;
                    const isGroupOpen = openElectiveGroups[groupItemKey];
                    const variants = electiveGroups[gKey];
                    const hasActiveVariant = variants.some((d: any) => d.code === currentDisciplineCode);
                    return (
                      <div key={gKey} className="sidebar__elective-group">
                        <button
                          className={`sidebar__elective-header ${hasActiveVariant ? 'sidebar__elective-header--active' : ''}`}
                          onClick={() => toggleElectiveGroup(groupItemKey)}
                        >
                          <div className="sidebar__subject-indicator elective" />
                          <span className="sidebar__elective-label">{gKey}</span>
                          <span className={`sidebar__elective-chevron ${isGroupOpen ? 'sidebar__elective-chevron--open' : ''}`}>
                            <ChevronDown size={12} />
                          </span>
                        </button>
                        <div className={`sidebar__elective-content ${isGroupOpen ? 'sidebar__elective-content--open' : ''}`}>
                          <div className="sidebar__elective-items">
                            {variants.map((d: any) => {
                              const isActive = d.code === currentDisciplineCode;
                              return (
                                <Link
                                  key={d.code}
                                  href={`/plan/disciplines/${encodeURIComponent(d.code)}?semester=${n}`}
                                  className={`sidebar__subject-item sidebar__subject-item--elective-variant ${isActive ? 'sidebar__subject-item--active' : ''}`}
                                >
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
              </div>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
