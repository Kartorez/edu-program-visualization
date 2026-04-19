import './LearningOutcomesMatrixView.scss';

export default function LearningOutcomesMatrixView({
  disciplines,
  outcomes,
}: {
  disciplines: any[];
  outcomes: any[];
}) {
  return (
    <div className="matrix-page">
      <div className="matrix-page__header">
        <div className="matrix-page__header-left">
          <div className="matrix-page__code">ОПП · Комп'ютерні науки · Бакалавр</div>
          <h1 className="matrix-page__title">Матриця результатів навчання</h1>
          <p className="matrix-page__subtitle">
            Відображає які програмні результати навчання (РН) забезпечує кожна дисципліна програми.
          </p>
        </div>

        <div className="matrix-page__header-right">
          <div className="matrix-page__stat">
            <span className="matrix-page__stat-label">Дисциплін</span>
            <span className="matrix-page__stat-value matrix-page__stat-value--accent">
              {disciplines.length}
            </span>
          </div>
          <div className="matrix-page__stat">
            <span className="matrix-page__stat-label">РН</span>
            <span className="matrix-page__stat-value">{outcomes.length}</span>
          </div>
        </div>
      </div>

      <div className="matrix-wrap">
        <table className="matrix">
          <thead>
            <tr>
              <th className="matrix__discipline-column">Дисципліна</th>
              {outcomes.map((o) => (
                <th key={o.id}>{o.code}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {disciplines.map((d) => {
              const disciplineOutcomes = d.learningOutcomes || [];

              return (
                <tr key={d.id}>
                  <td className="matrix__discipline-name">
                    {d.code} {d.shortName}
                  </td>
                  {outcomes.map((o) => {
                    const has = disciplineOutcomes.some((do_: any) =>
                      typeof do_ === 'string' ? do_ === o.id : do_.id === o.id
                    );
                    return (
                      <td key={o.id} className="matrix__cell">
                        {has && <span className="dot-rn" />}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
