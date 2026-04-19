import './CompetenciesMatrixView.scss';

export default function CompetencyMatrixView({
  disciplines,
  competencies,
}: {
  disciplines: any[];
  competencies: any[];
}) {
  const zkList = competencies.filter((c) => c.type === 'zk');
  const skList = competencies.filter((c) => c.type === 'sk');

  const zkCount = zkList.length;
  const skCount = skList.length;

  return (
    <div className="matrix-page">
      <div className="matrix-page__header">
        <div className="matrix-page__header-left">
          <div className="matrix-page__code">ОПП · Компютерні науки · Бакалавр</div>
          <h1 className="matrix-page__title">Матриця компетентностей</h1>
          <p className="matrix-page__subtitle">
            Відображає які загальні (ЗК) та спеціальні (СК) компетентності формує кожна дисципліна
            програми.
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
            <span className="matrix-page__stat-label">ЗК</span>
            <span className="matrix-page__stat-value">{zkCount}</span>
          </div>

          <div className="matrix-page__stat">
            <span className="matrix-page__stat-label">СК</span>
            <span className="matrix-page__stat-value">{skCount}</span>
          </div>
        </div>
      </div>

      <div className="matrix-wrap">
        <table className="matrix">
          <thead>
            <tr>
              <th className="matrix__discipline-column">Дисципліна</th>

              {zkList.map((c) => (
                <th key={c.id}>{c.code}</th>
              ))}

              {skList.map((c) => (
                <th key={c.id}>{c.code}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {disciplines.map((d) => {
              const disciplineComps = d.competencies || [];

              return (
                <tr key={d.id}>
                  <td className="matrix__discipline-name">
                    {d.code} {d.shortName}
                  </td>

                  {zkList.map((c) => {
                    const has = disciplineComps.some((dc: any) =>
                      typeof dc === 'string' ? dc === c.id : dc.id === c.id
                    );

                    return (
                      <td key={`zk-${c.id}`} className="matrix__cell">
                        {has && <span className="dot-zk" />}
                      </td>
                    );
                  })}

                  {skList.map((c) => {
                    const has = disciplineComps.some((dc: any) =>
                      typeof dc === 'string' ? dc === c.id : dc.id === c.id
                    );

                    return (
                      <td key={`sk-${c.id}`} className="matrix__cell">
                        {has && <span className="dot-sk" />}
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
