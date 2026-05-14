import Badge from '@/components/ui/Badge';
import PageHeader from '@/components/ui/PageHeader';
import Stat from '@/components/ui/Stat';
import Accordion from './Accordion';
import './DisciplineView.scss';
import type { BadgeVariant } from '@/components/ui/Badge';

import Link from 'next/link';

export default function DisciplineView({ discipline }: { discipline: any }) {
  const competencies = discipline.competencies || [];
  const topics = discipline.topics || [];
  const results = discipline.learningOutcomes || [];

  const prerequisites = (discipline.prerequisites || [])
    .map((r: any) => r.dependsOn)
    .filter((d: any) => d && typeof d === 'object');

  const postrequisites = (discipline.postrequisites || [])
    .map((r: any) => r.subject)
    .filter((d: any) => d && typeof d === 'object');

  const zk = competencies.filter((c: any) => c.type === 'zk');
  const sk = competencies.filter((c: any) => c.type === 'sk');

  return (
    <div className="discipline-view">
      <PageHeader
        code={`${discipline.code} · ${discipline.type === 'elective' ? 'Вибіркова' : 'Обовʼязкова'}`}
        title={discipline.name}
        description={discipline.description}
        stats={
          <>
            <Stat label="Кредити" value={`${discipline.credits} ЄКТС`} variant="card" isAccent />
            <Stat label="Семестр" value={`${(discipline.semesters || []).map((s: any) => s.semester).join(', ')} з 8`} variant="card" />
            {discipline.assessment && (
              <Stat label="Контроль" value={discipline.assessment === 'exam' ? 'Іспит' : discipline.assessment === 'credit' ? 'Залік' : 'Іспит/Залік'} variant="card" />
            )}
            <Stat label="Компетентності" value={competencies.length} variant="card" />
          </>
        }
      />

      <div className="discipline-view__grid">
        <div className="discipline-view__card">
          <div className="discipline-view__section-title">Теми курсу</div>
          {Object.keys(
            topics.reduce((acc: any, t: any) => {
              const s = t.semester || 'Загальні';
              if (!acc[s]) acc[s] = [];
              acc[s].push(t);
              return acc;
            }, {})
          ).length > 0 ? (
            Object.entries(
              topics.reduce((acc: any, t: any) => {
                const s = t.semester || 'Загальні';
                if (!acc[s]) acc[s] = [];
                acc[s].push(t);
                return acc;
              }, {})
            )
              .sort(([a], [b]) => (a === 'Загальні' ? 1 : b === 'Загальні' ? -1 : Number(a) - Number(b)))
              .map(([sem, semTopics]: [string, any]) => (
                <div key={sem} className="discipline-view__semester-group">
                  {sem !== 'Загальні' && <div className="discipline-view__semester-label">Семестр {sem}</div>}
                  <ol className="discipline-view__topics-list">
                    {semTopics.map((t: any, i: number) => (
                      <li key={i} className="discipline-view__topics-item">
                        {t.title}
                      </li>
                    ))}
                  </ol>
                </div>
              ))
          ) : (
            <span className="discipline-view__empty">Теми не вказані</span>
          )}
        </div>

        <div className="discipline-view__card">
          <div className="discipline-view__section-title">Пререквізити та Постреквізити</div>
          <div className="discipline-view__requisites">
            <div className="discipline-view__requisites-section">
              <span className="discipline-view__requisites-label">Пререквізити</span>
              <div className="discipline-view__requisites-row">
                {prerequisites.map((p: any) => (
                  <Link key={p.id} href={`/plan/disciplines/${encodeURIComponent(p.code)}`} className="discipline-view__link">
                    <Badge variant="previous">
                      {p.code} {p.shortName ?? p.name}
                    </Badge>
                  </Link>
                ))}
                {prerequisites.length === 0 && <span className="discipline-view__empty">—</span>}
              </div>
            </div>
            <div className="discipline-view__requisites-divider" />
            <div className="discipline-view__requisites-section">
              <span className="discipline-view__requisites-label">Постреквізити</span>
              <div className="discipline-view__requisites-row">
                {postrequisites.map((p: any) => (
                  <Link key={p.id} href={`/plan/disciplines/${encodeURIComponent(p.code)}`} className="discipline-view__link">
                    <Badge variant="next">
                      {p.code} {p.shortName ?? p.name}
                    </Badge>
                  </Link>
                ))}
                {postrequisites.length === 0 && <span className="discipline-view__empty">—</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="discipline-view__card">
        <Accordion
          title="Компетентності"
          variant="zk"
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
          variant="rn"
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
