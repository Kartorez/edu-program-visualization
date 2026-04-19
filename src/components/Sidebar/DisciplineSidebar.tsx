'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useDisciplines } from '@/context/DisciplinesContext';

export function DisciplineSidebar() {
  const pathname = usePathname();
  const disciplines = useDisciplines();
  const code = decodeURIComponent(pathname.split('/').pop() ?? '');

  const current = disciplines.find((d) => d.code === code);
  const currentSemester = current?.semesters?.[0]?.semester ?? 1;

  const [openSemester, setOpenSemester] = useState<number>(currentSemester);

  const disciplinesBySemester = (sem: number) =>
    disciplines.filter((d) => d.semesters?.some((s) => s.semester === sem));

  return (
    <nav className="sidebar__nav">
      <Link href="/plan" className="sidebar__back">
        ← Навчальний план
      </Link>

      <div className="sidebar__section-label">Семестри</div>

      {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => {
        const items = disciplinesBySemester(sem);
        const isOpen = openSemester === sem;

        return (
          <div key={sem}>
            <button className="sidebar__semester" onClick={() => setOpenSemester(isOpen ? 0 : sem)}>
              <span className="sidebar__semester-number">{sem}</span>
              <span className="sidebar__semester-label">Семестр {sem}</span>
              <span className="sidebar__semester-count">{items.length}</span>
            </button>

            {isOpen && (
              <div className="sidebar__semester-items">
                {items.map((d) => (
                  <Link
                    key={d.id}
                    href={`/plan/disciplines/${encodeURIComponent(d.code)}`}
                    className={`sidebar__subject-item ${d.code === code ? 'sidebar__subject-item--active' : ''}`}
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
