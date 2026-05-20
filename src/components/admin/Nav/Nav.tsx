'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { useConfig } from '@payloadcms/ui';
import Link from 'next/link';
import {
  ChevronDown,
  ChevronRight,
  BookOpen,
  Users,
  Settings,
  Home,
  GraduationCap,
  Database
} from 'lucide-react';
import './Nav.scss';

const Nav: React.FC = () => {
  const pathname = usePathname();
  const { config } = useConfig();
  const [openSemesters, setOpenSemesters] = useState<Record<number, boolean>>({});
  const [programData, setProgramData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const disciplineMatch = pathname.match(/\/admin\/collections\/disciplines\/([^/]+)/);
  const programMatch = pathname.match(/\/admin\/collections\/educational-programs\/([^/]+)/);

  const currentDisciplineId = disciplineMatch ? disciplineMatch[1] : null;
  const currentProgramId = programMatch ? programMatch[1] : null;

  useEffect(() => {
    async function fetchProgramContext() {
      let targetProgramId = currentProgramId;

      if (currentDisciplineId && !targetProgramId) {
        try {
          const res = await fetch(`/api/disciplines/${currentDisciplineId}?depth=1`);
          const data = await res.json();
          if (data.programs && data.programs.length > 0) {
            targetProgramId = typeof data.programs[0] === 'object' ? data.programs[0].id : data.programs[0];
          }
        } catch (e) {
          console.error('Failed to fetch discipline program context', e);
        }
      }

      if (targetProgramId) {
        setLoading(true);
        try {
          const res = await fetch(`/api/educational-programs/${targetProgramId}?depth=2`);
          const data = await res.json();

          const instancesRes = await fetch(`/api/discipline-instances?where[program][equals]=${targetProgramId}&limit=100&depth=1`);
          const instancesData = await instancesRes.json();

          setProgramData({
            ...data,
            instances: instancesData.docs
          });

          if (currentDisciplineId) {
            const currentInstance = instancesData.docs.find((i: any) =>
              (typeof i.discipline === 'object' ? i.discipline.id : i.discipline) === currentDisciplineId
            );
            if (currentInstance) {
              setOpenSemesters(prev => ({ ...prev, [currentInstance.semester]: true }));
            }
          }
        } catch (e) {
          console.error('Failed to fetch program context', e);
        } finally {
          setLoading(false);
        }
      } else {
        setProgramData(null);
      }
    }

    fetchProgramContext();
  }, [currentDisciplineId, currentProgramId]);

  const semesterGroups = useMemo(() => {
    if (!programData?.instances) return {};
    const groups: Record<number, any[]> = {};
    programData.instances.forEach((inst: any) => {
      const s = inst.semester || 1;
      if (!groups[s]) groups[s] = [];
      groups[s].push(inst);
    });
    return groups;
  }, [programData]);

  const toggleSemester = (s: number) => {
    setOpenSemesters(prev => ({ ...prev, [s]: !prev[s] }));
  };

  const collections = useMemo(() => config.collections.filter(c => !(c.admin as any)?.hidden), [config]);

  const groupedCollections = useMemo(() => {
    const groups: Record<string, any[]> = {};
    collections.forEach(c => {
      const groupName = (c.admin as any)?.group || 'Інше';
      const label = typeof groupName === 'object' ? groupName.uk || groupName.en || 'Інше' : groupName;
      if (!groups[label]) groups[label] = [];
      groups[label].push(c);
    });
    return groups;
  }, [collections]);

  return (
    <nav className="custom-nav">
      <div className="nav-header">
        <GraduationCap size={24} className="logo-icon" />
        <span className="logo-text">ВНАУ</span>
      </div>

      <div className="nav-section">
        <Link href="/admin" className={`nav-link ${pathname === '/admin' ? 'active' : ''}`}>
          <Home size={18} />
          <span>Панель керування</span>
        </Link>
      </div>

      {programData && (
        <div className="curriculum-section">
          <div className="section-title">Навчальний план</div>
          <Link
            href={`/admin/collections/educational-programs/${programData.id}`}
            className={`program-root-link ${currentProgramId === programData.id ? 'active' : ''}`}
          >
            <BookOpen size={16} />
            <span title={programData.fullTitle}>{programData.title} ({programData.year})</span>
          </Link>

          <div className="semesters-list">
            {Object.keys(semesterGroups).sort((a, b) => Number(a) - Number(b)).map(sKey => {
              const sNum = Number(sKey);
              const isOpen = openSemesters[sNum];
              return (
                <div key={sNum} className="semester-item">
                  <div className="semester-header" onClick={() => toggleSemester(sNum)}>
                    {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    <span>Семестр {sNum}</span>
                  </div>
                  {isOpen && (
                    <div className="semester-disciplines">
                      {semesterGroups[sNum].map((inst: any) => {
                        const d = inst.discipline;
                        const isCurrent = currentDisciplineId === (typeof d === 'object' ? d.id : d);
                        return (
                          <Link
                            key={typeof d === 'object' ? d.id : d}
                            href={`/admin/collections/disciplines/${typeof d === 'object' ? d.id : d}`}
                            className={`discipline-link ${isCurrent ? 'active' : ''}`}
                          >
                            <div className={`type-indicator ${inst.discipline?.type || 'required'}`} />
                            <span title={typeof d === 'object' ? d.name : d}>
                              {typeof d === 'object' ? d.name : d}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="nav-divider" />

      {Object.entries(groupedCollections).map(([group, colls]) => (
        <div key={group} className="nav-group">
          <div className="group-title">{group}</div>
          {colls.map(c => (
            <Link
              key={c.slug}
              href={`/admin/collections/${c.slug}`}
              className={`nav-link ${pathname.includes(`/admin/collections/${c.slug}`) ? 'active' : ''}`}
            >
              {c.slug === 'users' ? <Users size={18} /> :
                c.slug === 'disciplines' ? <BookOpen size={18} /> :
                  c.slug === 'educational-programs' ? <GraduationCap size={18} /> :
                    <Database size={18} />}
              <span>{typeof c.labels.plural === 'object' ? c.labels.plural.uk || c.labels.plural.en : c.labels.plural}</span>
            </Link>
          ))}
        </div>
      ))}

      <div className="nav-footer">
        <Link href="/admin/account" className="nav-link">
          <Settings size={18} />
          <span>Налаштування</span>
        </Link>
      </div>
    </nav>
  );
};

export default Nav;
