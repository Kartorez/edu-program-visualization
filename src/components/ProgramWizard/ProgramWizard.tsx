'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import styles from './ProgramWizard.module.scss';

type Specialty = {
  id: number;
  code: string;
  title: string;
  department?: { title: string } | number;
};

type Program = {
  id: number;
  title: string;
  degree: 'bachelor' | 'master';
  specialty: { id: number } | number;
};

type Version = {
  id: number;
  year: number;
  isActive: boolean;
  program: { id: number } | number;
};

interface ProgramWizardProps {
  specialties: Specialty[];
  programs: Program[];
  versions: Version[];
  departmentTitle: string;
  stats: {
    countDiscipline: number;
    countElective: number;
    countSemester: number;
    countCredits: number;
  };
}

type Step = 'specialties' | 'programs';

const degreeLabel: Record<string, string> = {
  bachelor: 'Бакалавр',
  master: 'Магістр',
};

const degreeDuration: Record<string, string> = {
  bachelor: '4 роки навчання',
  master: '2 роки навчання',
};

function getProgramId(v: Version) {
  return typeof v.program === 'number' ? v.program : v.program?.id;
}

function getSpecialtyId(p: Program) {
  return typeof p.specialty === 'number' ? p.specialty : p.specialty?.id;
}

export default function ProgramWizard({
  specialties,
  programs,
  versions,
  departmentTitle,
  stats,
}: ProgramWizardProps) {
  const [step, setStep] = useState<Step>('specialties');
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<Version | null>(null);
  const [animDir, setAnimDir] = useState<'forward' | 'back'>('forward');

  const goTo = (next: Step, dir: 'forward' | 'back' = 'forward') => {
    setAnimDir(dir);
    setStep(next);
  };

  const handleSelectSpecialty = (s: Specialty) => {
    setSelectedSpecialty(s);
    goTo('programs', 'forward');
  };

  const handleSelectVersion = (v: Version) => {
    setSelectedVersion(v);
  };

  const handleBack = () => {
    if (step === 'programs') {
      goTo('specialties', 'back');
    }
  };

  const filteredPrograms = selectedSpecialty
    ? programs.filter((p) => getSpecialtyId(p) === selectedSpecialty.id)
    : [];

  const grouped = (['bachelor', 'master'] as const)
    .map((degree) => {
      const degreeProg = filteredPrograms.filter((p) => p.degree === degree);
      const degreVersions = degreeProg.flatMap((prog) =>
        versions
          .filter((v) => getProgramId(v) === prog.id)
          .map((v) => ({ ...v, programTitle: prog.title }))
      );
      degreVersions.sort((a, b) => b.year - a.year);
      return { degree, programs: degreeProg, versions: degreVersions };
    })
    .filter((g) => g.versions.length > 0);

  const selectedProgram = selectedVersion
    ? programs.find((p) => p.id === getProgramId(selectedVersion))
    : null;

  const specialtiesWithCount = specialties.map((s) => ({
    ...s,
    programCount: programs.filter((p) => getSpecialtyId(p) === s.id).length,
  }));

  return (
    <div className={styles.page}>
      <div className={styles.grid} />

      <div
        className={`${styles.panel} ${styles[animDir]}`}
        key={step}
      >
        {step === 'specialties' && (
          <>
            {departmentTitle && (
              <span className={styles.badge}>
                <span className={styles.badgeDot} />
                {departmentTitle}
              </span>
            )}

            <h1 className={styles.title}>
              Освітні програми
              <br />
              <em>кафедри КН</em>
            </h1>

            <p className={styles.subtitle}>
              Оберіть спеціальність щоб переглянути навчальний план та матриці компетентностей
            </p>

            <div className={styles.list}>
              {specialtiesWithCount.map((s, i) => (
                <button
                  key={s.id}
                  className={styles.card}
                  style={{ animationDelay: `${i * 60}ms` }}
                  onClick={() => handleSelectSpecialty(s)}
                >
                  <span className={styles.cardCode}>{s.code}</span>
                  <div className={styles.cardBody}>
                    <span className={styles.cardTitle}>{s.title}</span>
                    <span className={styles.cardMeta}>
                      {departmentTitle || 'Кафедра'} · {s.programCount}{' '}
                      {s.programCount === 1
                        ? 'програма'
                        : s.programCount < 5
                          ? 'програми'
                          : 'програм'}
                    </span>
                  </div>
                  <span className={styles.cardArrow}>
                    <ArrowRight size={20} strokeWidth={2.5} />
                  </span>
                </button>
              ))}
            </div>
          </>
        )}

        {step === 'programs' && selectedSpecialty && (
          <>
            <button className={styles.backBtn} onClick={handleBack}>
              <ArrowLeft size={16} strokeWidth={2.5} />
              Всі спеціальності
            </button>

            <span className={styles.badge}>
              <span className={styles.badgeDot} />
              {selectedSpecialty.code} · {selectedSpecialty.title}
            </span>

            <h1 className={styles.title}>
              Оберіть програму
              <br />
              <em>та рік набору</em>
            </h1>

            <div className={styles.sections}>
              {grouped.map((group) => (
                <div key={group.degree} className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <span className={styles.sectionTitle}>
                      {degreeLabel[group.degree]}
                    </span>
                    <span className={styles.sectionMeta}>
                      {degreeDuration[group.degree]}
                    </span>
                  </div>

                  <div className={styles.versionList}>
                    {group.versions.map((v, i) => (
                      <Link
                        href="/plan"
                        key={v.id}
                        className={styles.versionCard}
                        style={{ animationDelay: `${i * 50}ms`, textDecoration: 'none' }}
                        onClick={() => handleSelectVersion(v)}
                      >
                        <span
                          className={`${styles.versionYear} ${v.isActive ? styles.versionYearActive : ''}`}
                        >
                          {v.year}
                        </span>
                        <span className={styles.versionTitle}>{v.programTitle}</span>
                        <span
                          className={`${styles.versionStatus} ${v.isActive ? styles.versionStatusActive : ''}`}
                        >
                          {v.isActive ? 'Актуальна' : 'Архів'}
                        </span>
                        <span className={styles.cardArrow}>
                          <ArrowRight size={18} strokeWidth={2.5} />
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
