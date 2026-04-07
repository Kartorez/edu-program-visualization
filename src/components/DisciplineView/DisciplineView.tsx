import Badge from '@/components/ui/Badge';
import Accordion from './Accordion';
import './DisciplineView.scss';

export default function DisciplineView({ discipline }: { discipline: any }) {
  const competencies = discipline.competencies || [];
  const prerequisites = discipline.prerequisites || [];
  const postrequisites = discipline.postrequisites || [];
  const topics = discipline.topics || [];

  const zk = competencies.filter((c: any) => c.type === 'zk');
  const sk = competencies.filter((c: any) => c.type === 'sk');

  return (
    <div className="discipline">
      <div className="discipline__header card">
        <div className="discipline__header-left">
          <div className="discipline__code">
            {discipline.code} · {discipline.type === 'elective' ? 'Вибіркова' : 'Обовʼязкова'}
          </div>

          <h1 className="discipline__title">{discipline.name}</h1>

          <p className="discipline__description">{discipline.shortName}</p>
        </div>

        <div className="discipline__header-right">
          <div className="discipline__stat">
            <span className="discipline__stat-label">Кредити</span>
            <span className="discipline__stat-value discipline__stat-value--accent">
              {discipline.credits} ЄКТС
            </span>
          </div>

          <div className="discipline__stat">
            <span className="discipline__stat-label">Семестри</span>
            <span className="discipline__stat-value">
              {(discipline.semesters || []).map((s: any) => s.semester).join(', ')}
            </span>
          </div>

          <div className="discipline__stat">
            <span className="discipline__stat-label">Компетентності</span>
            <span className="discipline__stat-value">{competencies.length}</span>
          </div>
        </div>
      </div>

      <div className="discipline__topics card">
        <div className="title">Теми курсу</div>

        <ol className="discipline__topics-list">
          {topics.map((t: any, i: number) => (
            <li key={i} className="discipline__topics-item">
              {t.title}
            </li>
          ))}
        </ol>
      </div>

      <div className="discipline__requisites card">
        <h3 className="title">Пререквізити та Постреквізити</h3>

        <div className="requisites">
          <div className="requisites__section">
            <span className="requisites__label">Пререквізити</span>

            <div className="requisites__row">
              {prerequisites.map((p: any) => (
                <Badge key={p.id} variant="previous">
                  {p.code} {p.name}
                </Badge>
              ))}
            </div>
          </div>

          <div className="requisites__divider" />

          <div className="requisites__section">
            <span className="requisites__label">Постреквізити</span>

            <div className="requisites__row">
              {postrequisites.map((p: any) => (
                <Badge key={p.id} variant="next">
                  {p.code} {p.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="discipline__competency card">
        <Accordion
          title="Загальні компетентності"
          variant="zk"
          items={zk.map((c: any) => ({
            badge: c.code,
            text: c.description,
          }))}
        />

        <Accordion
          title="Фахові компетентності"
          variant="sk"
          items={sk.map((c: any) => ({
            badge: c.code,
            text: c.description,
          }))}
        />
      </div>
    </div>
  );
}
