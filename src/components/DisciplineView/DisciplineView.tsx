import Badge from '@/components/ui/Badge';
import Accordion from './Accordion';
import './DisciplineView.scss';

export default function DisciplineView({ discipline }: { discipline: any }) {
  const competencies = discipline.competencies || [];
  const prerequisites = discipline.prerequisites || [];
  const postrequisites = discipline.postrequisites || [];
  const topics = discipline.topics || [];
  const results = discipline.learningOutcomes || [];

  const zk = competencies.filter((c: any) => c.type === 'zk');
  const sk = competencies.filter((c: any) => c.type === 'sk');

  return (
    <div className="discipline-view">
      <div className="discipline-view__card discipline-view__header">
        <div className="discipline-view__header-left">
          <div className="discipline-view__code">
            {discipline.code} · {discipline.type === 'elective' ? 'Вибіркова' : 'Обовʼязкова'}
          </div>
          <h1 className="discipline-view__name">{discipline.name}</h1>
          <p className="discipline-view__description">{discipline.description}</p>
        </div>
        <div className="discipline-view__header-right">
          <div className="discipline-view__stat">
            <span className="discipline-view__stat-label">Кредити</span>
            <span className="discipline-view__stat-value discipline-view__stat-value--accent">
              {discipline.credits} ЄКТС
            </span>
          </div>
          <div className="discipline-view__stat">
            <span className="discipline-view__stat-label">Семестр</span>
            <span className="discipline-view__stat-value">
              {(discipline.semesters || []).map((s: any) => s.semester).join(', ')} з 8
            </span>
          </div>
          {discipline.control && (
            <div className="discipline-view__stat">
              <span className="discipline-view__stat-label">Контроль</span>
              <span className="discipline-view__stat-value">{discipline.control}</span>
            </div>
          )}
          <div className="discipline-view__stat">
            <span className="discipline-view__stat-label">Компетентності</span>
            <span className="discipline-view__stat-value">{competencies.length}</span>
          </div>
        </div>
      </div>

      <div className="discipline-view__grid">
        <div className="discipline-view__card">
          <div className="discipline-view__section-title">Теми курсу</div>
          <ol className="discipline-view__topics-list">
            {topics.map((t: any, i: number) => (
              <li key={i} className="discipline-view__topics-item">
                {t.title}
              </li>
            ))}
          </ol>
        </div>

        <div className="discipline-view__card">
          <div className="discipline-view__section-title">Пререквізити та Постреквізити</div>
          <div className="discipline-view__requisites">
            <div className="discipline-view__requisites-section">
              <span className="discipline-view__requisites-label">Пререквізити</span>
              <div className="discipline-view__requisites-row">
                {prerequisites.map((p: any) => (
                  <Badge key={p.id} variant="previous">
                    {p.code} {p.shortName ?? p.name}
                  </Badge>
                ))}
                {prerequisites.length === 0 && <span className="discipline-view__empty">—</span>}
              </div>
            </div>
            <div className="discipline-view__requisites-divider" />
            <div className="discipline-view__requisites-section">
              <span className="discipline-view__requisites-label">Постреквізити</span>
              <div className="discipline-view__requisites-row">
                {postrequisites.map((p: any) => (
                  <Badge key={p.id} variant="next">
                    {p.code} {p.shortName ?? p.name}
                  </Badge>
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
            ...zk.map((c: any) => ({ badge: c.code, text: c.description, badgeVariant: 'zk' })),
            ...sk.map((c: any) => ({ badge: c.code, text: c.description, badgeVariant: 'sk' })),
          ]}
        />
      </div>

      <div className="discipline-view__card">
        <Accordion
          title="Результати навчання"
          variant="rn"
          items={results.map((r: any) => ({ badge: r.code, text: r.description }))}
        />
      </div>
    </div>
  );
}
