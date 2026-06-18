'use client';

import Link from 'next/link';
import { usePathname, useSearchParams, useParams } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import { useDisciplines, SidebarDiscipline } from '@/shared/lib/DisciplinesContext';
import { sortByCode } from '@/shared/lib/sortByCode';
import { ChevronDown } from 'lucide-react';

export type SidebarSection = {
  href: string;
  label: string;
  icon?: React.ReactNode;
};

type MainSidebarProps = {
  /** Navigation links at the top of the sidebar. */
  sections?: SidebarSection[];
  /** Label above the navigation links block. */
  sectionsLabel?: string;
  /** Label above the disciplines list. If omitted the disciplines block is hidden. */
  disciplinesLabel?: string;
  /** Override disciplines from context (useful when passing from server component). */
  disciplines?: SidebarDiscipline[];
};

export function MainSidebar({
  sections = [],
  sectionsLabel = 'Навігація',
  disciplinesLabel = 'Навчальний план',
  disciplines: disciplinesProp,
}: MainSidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useParams();
  const programId = params?.programId as string | undefined;
  const semesterParam = searchParams.get('semester');

  // Allow overriding disciplines from context via prop
  const contextDisciplines = useDisciplines();
  const disciplines = disciplinesProp ?? contextDisciplines;

  const isDisciplinePage = pathname.includes('/disciplines/');
  const currentDisciplineCode = isDisciplinePage
    ? decodeURIComponent(pathname.split('/').pop() ?? '')
    : null;

  const currentDiscipline = useMemo(() => {
    if (!currentDisciplineCode) return null;
    if (semesterParam) {
      const sem = parseInt(semesterParam, 10);
      const found = disciplines.find(
        (d) => d.code === currentDisciplineCode && d.currentSemester === sem,
      );
      if (found) return found;
    }
    return disciplines.find((d) => d.code === currentDisciplineCode);
  }, [disciplines, currentDisciplineCode, semesterParam]);

  const disciplineSemester = currentDiscipline?.currentSemester;

  const [openSemester, setOpenSemester] = useState<number | null>(null);
  const [openElectiveGroups, setOpenElectiveGroups] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (disciplineSemester) {
      setOpenSemester(disciplineSemester);
      if (currentDisciplineCode) {
        const groupMatch = currentDisciplineCode.match(/^(ВК\s*\d+)/);
        if (groupMatch) {
          const gKey = groupMatch[1].replace(/\s+/, ' ');
          setOpenElectiveGroups((prev) => ({ ...prev, [`${disciplineSemester}-${gKey}`]: true }));
        }
      }
    }
  }, [disciplineSemester, currentDisciplineCode]);

  const toggleElectiveGroup = (key: string) =>
    setOpenElectiveGroups((prev) => ({ ...prev, [key]: !prev[key] }));

  const splitDisciplines = (items: SidebarDiscipline[]) => {
    const required: SidebarDiscipline[] = [];
    const electiveGroups: Record<string, SidebarDiscipline[]> = {};
    items.forEach((d) => {
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

  const semesters = useMemo(
    () =>
      [
        ...new Set(
          disciplines.map((d) => d.currentSemester ?? 0).filter((s) => s > 0),
        ),
      ].sort((a, b) => a - b),
    [disciplines],
  );

  const disciplinesBySemester = (sem: number) =>
    sortByCode(disciplines.filter((d) => d.currentSemester === sem));

  const showDisciplines = disciplines.length > 0 && semesters.length > 0;

  return (
    <nav className="sidebar__nav">
      {sections.length > 0 && (
        <>
          <div className="sidebar__section-label">{sectionsLabel}</div>
          <div className="sidebar__menu">
            {sections.map((s) => (
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
        </>
      )}

      {showDisciplines && (
        <>
          <div className="sidebar__divider" />
          <div className="sidebar__section-label">{disciplinesLabel}</div>

          <div className="sidebar__semesters">
            {semesters.map((n) => {
              const items = disciplinesBySemester(n);
              const { required, electiveGroups } = splitDisciplines(items);
              const electiveGroupKeys = Object.keys(electiveGroups).sort();
              const displayCount = required.length + electiveGroupKeys.length;
              const isOpen = openSemester === n;
              const hasActiveDiscipline =
                currentDisciplineCode !== null && disciplineSemester === n;

              return (
                <div
                  key={n}
                  className={`sidebar__semester-group ${hasActiveDiscipline ? 'sidebar__semester-group--active' : ''}`}
                >
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
                      <span
                        className={`sidebar__semester-chevron ${isOpen ? 'sidebar__semester-chevron--open' : ''}`}
                      >
                        <ChevronDown size={14} />
                      </span>
                    </div>
                  </button>

                  <div
                    className={`sidebar__semester-content ${isOpen ? 'sidebar__semester-content--open' : ''}`}
                  >
                    <div className="sidebar__semester-items">
                      {required.map((d) => {
                        const isActive = d.code === currentDisciplineCode;
                        return (
                          <Link
                            key={d.code}
                            href={programId ? `/plan/${programId}/disciplines/${d.id}?semester=${n}` : `/plan/disciplines/${d.id}?semester=${n}`}
                            className={`sidebar__subject-item ${isActive ? 'sidebar__subject-item--active' : ''}`}
                          >
                            <div
                              className={`sidebar__subject-indicator ${d.type ?? 'required'}`}
                            />
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
                        const hasActiveVariant = variants.some(
                          (d) => d.code === currentDisciplineCode,
                        );
                        return (
                          <div key={gKey} className="sidebar__elective-group">
                            <button
                              className={`sidebar__elective-header ${hasActiveVariant ? 'sidebar__elective-header--active' : ''}`}
                              onClick={() => toggleElectiveGroup(groupItemKey)}
                            >
                              <div className="sidebar__subject-indicator elective" />
                              <span className="sidebar__elective-label">{gKey}</span>
                              <span
                                className={`sidebar__elective-chevron ${isGroupOpen ? 'sidebar__elective-chevron--open' : ''}`}
                              >
                                <ChevronDown size={12} />
                              </span>
                            </button>
                            <div
                              className={`sidebar__elective-content ${isGroupOpen ? 'sidebar__elective-content--open' : ''}`}
                            >
                              <div className="sidebar__elective-items">
                                {variants.map((d) => {
                                  const isActive = d.code === currentDisciplineCode;
                                  return (
                                    <Link
                                      key={d.code}
                                      href={programId ? `/plan/${programId}/disciplines/${d.id}?semester=${n}` : `/plan/disciplines/${d.id}?semester=${n}`}
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
        </>
      )}
    </nav>
  );
}
