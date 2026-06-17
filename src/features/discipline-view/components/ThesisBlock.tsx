type StructureItem = { id?: string; num?: string | null; title: string };
type DeadlineItem = { id?: string; month: string; event: string; note?: string | null };

type Props = {
  discipline: any;
};

export default function ThesisBlock({ discipline }: Props) {
  const structure: StructureItem[] = discipline.thesisStructure || [];
  const deadlines: DeadlineItem[] = discipline.thesisDeadlines || [];

  return (
    <>

      
      {structure.length > 0 && (
        <div className="discipline-view__card">
          <div className="discipline-view__section-title">Структура роботи</div>
          <ol className="discipline-view__structure-list">
            {structure.map((s, i) => (
              <li key={s.id ?? i} className="discipline-view__structure-item">
                {s.num && (
                  <span className="discipline-view__structure-num">{s.num}</span>
                )}
                <span className="discipline-view__structure-title">{s.title}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      
      {deadlines.length > 0 && (
        <div className="discipline-view__card">
          <div className="discipline-view__section-title">Ключові дедлайни</div>
          <ol className="discipline-view__deadlines-list">
            {deadlines.map((d, i) => (
              <li key={d.id ?? i} className="discipline-view__deadline-item">
                <span className="discipline-view__deadline-month">{d.month}</span>
                <div className="discipline-view__deadline-body">
                  <span className="discipline-view__deadline-event">{d.event}</span>
                  {d.note && (
                    <span className="discipline-view__deadline-note">{d.note}</span>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}
    </>
  );
}
