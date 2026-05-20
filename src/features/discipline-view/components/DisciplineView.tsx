import { Badge, PageHeader, Stat } from '@/shared/ui';
import Accordion, { type BadgeItem } from './Accordion';
import { sortByCode } from '@/shared/lib/sortByCode';
import styles from './DisciplineView.module.scss';
import type { BadgeVariant } from '@/shared/ui';

import Link from 'next/link';

export default function DisciplineView({ discipline }: { discipline: any }) {
  const competencies = discipline.competencies || [];
  const topics = discipline.topics || [];
  const results = discipline.learningOutcomes || [];

  const prerequisites = sortByCode(
    (discipline.prerequisites || [])
      .filter((d: any) => d && typeof d === 'object' && !d.code?.startsWith('ВК'))
  );

  const postrequisites = sortByCode(
    (discipline.postrequisites || [])
      .filter((d: any) => d && typeof d === 'object' && !d.code?.startsWith('ВК'))
  );

  const zk = competencies.filter((c: any) => c.type === 'zk');
  const sk = competencies.filter((c: any) => c.type === 'sk');

  return (
    <div className={styles['discipline-view']}>
      <PageHeader
        code={`${discipline.code} · ${discipline.type === 'elective' ? 'Вибіркова' : 'Обовʼязкова'}`}
        title={discipline.name}
        description={discipline.description}
        stats={
          <>
            <Stat label="Кредити" value={`${discipline.credits} ЄКТС`} variant="card" isAccent />
            <Stat label="Семестр" value={`${(discipline.semesters || []).join(', ')} з 8`} variant="card" />
            {discipline.assessment && (
              <Stat label="Контроль" value={discipline.assessment === 'exam' ? 'Іспит' : discipline.assessment === 'credit' ? 'Залік' : 'Іспит/Залік'} variant="card" />
            )}
            <Stat label="Компетентності" value={competencies.length} variant="card" />
          </>
        }
      />

      <div className={styles['discipline-view__grid']}>
        <div className={styles['discipline-view__card']}>
          <div className={styles['discipline-view__section-title']}>
            {discipline.category === 'practice' ? 'Організація практики' :
              discipline.category === 'thesis' ? 'Виконання роботи' :
                'Теми курсу'}
          </div>

          {(discipline.category === 'practice' || discipline.category === 'thesis') ? (
            <div className={styles['discipline-view__custom-info']}>
              {discipline.description ? (
                <div className={styles['discipline-view__description-full']}>{discipline.description}</div>
              ) : (
                <span className={styles['discipline-view__empty']}>
                  Детальна інформація міститься у відповідних методичних вказівках кафедри.
                </span>
              )}
            </div>
          ) : topics.length > 0 ? (
            <Accordion variant="topics" topics={topics} semesters={discipline.semesters || []} />
          ) : (
            <span className={styles['discipline-view__empty']}>Теми не вказані</span>
          )}
        </div>

        <div className={styles['discipline-view__card']}>
          <div className={styles['discipline-view__section-title']}>Пререквізити та Постреквізити</div>
          <div className={styles['discipline-view__requisites']}>
            <div className={styles['discipline-view__requisites-section']}>
              <span className={styles['discipline-view__requisites-label']}>Пререквізити</span>
              <div className={styles['discipline-view__requisites-row']}>
                {prerequisites.map((p: any) => (
                  <Link key={p.id} href={`/plan/disciplines/${encodeURIComponent(p.code)}`} className={styles['discipline-view__link']}>
                    <Badge variant="previous">
                      {p.code} {p.shortName ?? p.name}
                    </Badge>
                  </Link>
                ))}
                {prerequisites.length === 0 && <span className={styles['discipline-view__empty']}>—</span>}
              </div>
            </div>
            <div className={styles['discipline-view__requisites-divider']} />
            <div className={styles['discipline-view__requisites-section']}>
              <span className={styles['discipline-view__requisites-label']}>Постреквізити</span>
              <div className={styles['discipline-view__requisites-row']}>
                {postrequisites.map((p: any) => (
                  <Link key={p.id} href={`/plan/disciplines/${encodeURIComponent(p.code)}`} className={styles['discipline-view__link']}>
                    <Badge variant="next">
                      {p.code} {p.shortName ?? p.name}
                    </Badge>
                  </Link>
                ))}
                {postrequisites.length === 0 && <span className={styles['discipline-view__empty']}>—</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles['discipline-view__card']}>
        <Accordion
          variant="badge-list"
          title="Компетентності"
          badgeVariant="zk"
          items={[
            ...zk.map((c: any): BadgeItem => ({
              badge: c.code,
              text: c.description,
              variant: 'zk' as BadgeVariant,
              link: `/plan/competencies#comp-${c.code}`,
            })),
            ...sk.map((c: any): BadgeItem => ({
              badge: c.code,
              text: c.description,
              variant: 'sk' as BadgeVariant,
              link: `/plan/competencies#comp-${c.code}`,
            })),
          ]}
        />
      </div>

      <div className={styles['discipline-view__card']}>
        <Accordion
          variant="badge-list"
          title="Результати навчання"
          badgeVariant="rn"
          items={results.map((r: any): BadgeItem => ({
            badge: r.code,
            text: r.description,
            link: `/plan/results#res-${r.code}`,
          }))}
        />
      </div>
    </div>
  );
}
