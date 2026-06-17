'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import styles from './ProgramWizard.module.scss';

export type EducationalProgram = {
  id: string;
  title: string;
  specialtyCode: string;
  degree: 'bachelor' | 'master';
  year: number;
  isActive: boolean;
};

interface ProgramWizardProps {
  programs: EducationalProgram[];
  departmentTitle: string;
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

export default function ProgramWizard({
  programs,
  departmentTitle,
}: ProgramWizardProps) {
  const [step, setStep] = useState<Step>('specialties');
  const [selectedSpecialtyCode, setSelectedSpecialtyCode] = useState<string | null>(null);
  const [animDir, setAnimDir] = useState<'forward' | 'back'>('forward');

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('force-select') === 'true') return;

    const saved = localStorage.getItem('programVersionId');
    if (saved) {
      router.replace(`/plan/${saved}/graph`);
    }
  }, [router, searchParams]);

  const goTo = (next: Step, dir: 'forward' | 'back' = 'forward') => {
    setAnimDir(dir);
    setStep(next);
  };

  const handleSelectSpecialty = (code: string) => {
    setSelectedSpecialtyCode(code);
    goTo('programs', 'forward');
  };

  const handleSelectVersion = (id: string) => {
    localStorage.setItem('programVersionId', id);
    router.push(`/plan/${id}/graph`);
  };

  const handleBack = () => {
    if (step === 'programs') {
      goTo('specialties', 'back');
    }
  };

  const specialtyMap = new Map<string, { code: string; title: string; count: number }>();
  programs.forEach((p) => {
    if (!specialtyMap.has(p.specialtyCode)) {
      specialtyMap.set(p.specialtyCode, { code: p.specialtyCode, title: p.title, count: 0 });
    }
    specialtyMap.get(p.specialtyCode)!.count += 1;
  });
  const specialtiesWithCount = Array.from(specialtyMap.values());

  const selectedSpecialty = selectedSpecialtyCode ? specialtyMap.get(selectedSpecialtyCode) : null;
  const filteredPrograms = selectedSpecialtyCode
    ? programs.filter((p) => p.specialtyCode === selectedSpecialtyCode)
    : [];

  const grouped = (['bachelor', 'master'] as const)
    .map((degree) => {
      const degreeProg = filteredPrograms.filter((p) => p.degree === degree);
      degreeProg.sort((a, b) => b.year - a.year);
      return { degree, versions: degreeProg };
    })
    .filter((g) => g.versions.length > 0);

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
                  key={s.code}
                  className={styles.card}
                  style={{ animationDelay: `${i * 60}ms` }}
                  onClick={() => handleSelectSpecialty(s.code)}
                >
                  <span className={styles.cardCode}>{s.code}</span>
                  <div className={styles.cardBody}>
                    <span className={styles.cardTitle}>{s.title}</span>
                    <span className={styles.cardMeta}>
                      {departmentTitle || 'Кафедра'} · {s.count}{' '}
                      {s.count === 1
                        ? 'програма'
                        : s.count < 5
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
                      <button
                        key={v.id}
                        className={styles.versionCard}
                        style={{ animationDelay: `${i * 50}ms`, border: 'none', background: 'none', textAlign: 'left', width: '100%', cursor: 'pointer' }}
                        onClick={() => handleSelectVersion(v.id)}
                      >
                        <span
                          className={`${styles.versionYear} ${v.isActive ? styles.versionYearActive : ''}`}
                        >
                          {v.year}
                        </span>
                        <span className={styles.versionTitle}>{v.title}</span>
                        <span
                          className={`${styles.versionStatus} ${v.isActive ? styles.versionStatusActive : ''}`}
                        >
                          {v.isActive ? 'Актуальна' : 'Архів'}
                        </span>
                        <span className={styles.cardArrow}>
                          <ArrowRight size={18} strokeWidth={2.5} />
                        </span>
                      </button>
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
