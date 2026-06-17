type Partner = { id?: string; name: string; spots?: number | null; note?: string | null };

type Props = {
  discipline: any;
};

export default function PracticeBlock({ discipline }: Props) {
  const partners: Partner[] = discipline.practicePartners || [];

  return (
    <>
      
      {(discipline.practiceBase || discipline.practiceSupervisor) && (
        <div className="discipline-view__card">
          <div className="discipline-view__section-title">Організація практики</div>
          <dl className="discipline-view__info-list">
            {discipline.practiceBase && (
              <>
                <dt className="discipline-view__info-term">База практики</dt>
                <dd className="discipline-view__info-desc">{discipline.practiceBase}</dd>
              </>
            )}
            {discipline.practiceSupervisor && (
              <>
                <dt className="discipline-view__info-term">Куратор від кафедри</dt>
                <dd className="discipline-view__info-desc">{discipline.practiceSupervisor}</dd>
              </>
            )}
          </dl>
        </div>
      )}

      
      {partners.length > 0 && (
        <div className="discipline-view__card">
          <div className="discipline-view__section-title">Підприємства-партнери</div>
          <ul className="discipline-view__partners-list">
            {partners.map((p, i) => (
              <li key={p.id ?? i} className="discipline-view__partner-item">
                <span className="discipline-view__partner-name">{p.name}</span>
                {p.spots != null && (
                  <span className="discipline-view__partner-spots">{p.spots} місць</span>
                )}
                {p.note && (
                  <span className="discipline-view__partner-note">{p.note}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
