import { PageHeader, Stat, Accordion, type BadgeVariant } from '@/shared/ui';
import { sortByCode } from '@/shared/lib/sortByCode';
import './DisciplineView.scss';

import StandardBlock from './StandardBlock';
import PracticeBlock from './PracticeBlock';
import ThesisBlock from './ThesisBlock';
import RequisitesBlock from './RequisitesBlock';

const ASSESSMENT_LABEL: Record<string, string> = {
  exam: 'Іспит',
  credit: 'Залік',
  exam_credit: 'Іспит/Залік',
};

export default function DisciplineView({ discipline }: { discipline: any }) {
  const category: 'standard' | 'practice' | 'thesis' = discipline.category ?? 'standard';
  const competencies = discipline.competencies || [];
  const results = sortByCode(discipline.learningOutcomes || []);
  const reports = discipline.practiceReports || [];

  const prerequisites = sortByCode(
    (discipline.prerequisites || [])
      .filter((d: any) => d && typeof d === 'object' && !d.code?.startsWith('ВК'))
  );

  const postrequisites = sortByCode(
    (discipline.postrequisites || [])
      .filter((d: any) => d && typeof d === 'object' && !d.code?.startsWith('ВК'))
  );

  const zk = sortByCode(competencies.filter((c: any) => c.type === 'zk'));
  const sk = sortByCode(competencies.filter((c: any) => c.type === 'sk'));

  const typeLabel = discipline.type === 'elective' ? 'Вибіркова' : 'Обовʼязкова';
  const assessmentLabel = ASSESSMENT_LABEL[discipline.assessment] ?? discipline.assessment ?? '';

  return (
    <div className="discipline-view">
      
      <PageHeader
        code={`${discipline.code} · ${typeLabel}`}
        title={discipline.name}
        description={discipline.description}
        stats={
          <>
            <Stat label="Кредити" value={`${discipline.credits} ЄКТС`} variant="card" isAccent />
            <Stat label="Семестр" value={`${(discipline.semesters || []).join(', ')} з 8`} variant="card" />
            {assessmentLabel && (
              <Stat label="Контроль" value={assessmentLabel} variant="card" />
            )}
            <Stat label="Компетентності" value={competencies.length} variant="card" />
          </>
        }
      />

      
      <div className="discipline-view__grid">

        
        <div className="discipline-view__side">
          {category === 'practice' && (
            <PracticeBlock discipline={discipline} />
          )}
          {category === 'thesis' && (
            <ThesisBlock discipline={discipline} />
          )}
          {category === 'standard' && (
            <StandardBlock discipline={discipline} />
          )}
        </div>

        
        <div className="discipline-view__side">
          <RequisitesBlock
            discipline={discipline}
            prerequisites={prerequisites}
            postrequisites={postrequisites}
          />

          
          {category === 'practice' && reports.length > 0 && (
            <div className="discipline-view__card">
              <div className="discipline-view__section-title">Звітні матеріали</div>
              <ul className="discipline-view__reports-list">
                {reports.map((r: any, i: number) => (
                  <li key={r.id ?? i} className="discipline-view__report-item">
                    <span className="discipline-view__report-name">{r.name}</span>
                    {r.description && (
                      <span className="discipline-view__report-desc">{r.description}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      
      <div className="discipline-view__card">
        <Accordion
          title="Компетентності"
          variant="badge-list"
          badgeVariant="zk"
          items={[
            ...zk.map((c: any) => ({
              badge: c.code,
              text: c.description,
              variant: 'zk' as BadgeVariant,
              link: `/plan/competencies#comp-${c.code}`,
            })),
            ...sk.map((c: any) => ({
              badge: c.code,
              text: c.description,
              variant: 'sk' as BadgeVariant,
              link: `/plan/competencies#comp-${c.code}`,
            })),
          ]}
        />
      </div>

      <div className="discipline-view__card">
        <Accordion
          title="Результати навчання"
          variant="badge-list"
          badgeVariant="rn"
          items={results.map((r: any) => ({
            badge: r.code,
            text: r.description,
            link: `/plan/results#res-${r.code}`,
          }))}
        />
      </div>
    </div>
  );
}
