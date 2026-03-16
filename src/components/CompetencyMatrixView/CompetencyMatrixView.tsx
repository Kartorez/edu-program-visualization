import { Competency } from '@/data/competency';
import './CompetencyMatrixView.scss';

const zkCount = Math.max(...Competency.flatMap((item) => item.zk));
const skCount = Math.max(...Competency.flatMap((item) => item.sk));

export default function CompetencyMatrixView() {
  return (
    <div className="matrix-page">
      <div className="matrix-page__header">
        <div className="matrix-page__header-left">
          <div className="matrix-page__code">ОПП · Компютерні науки · Бакалавр</div>
          <h1 className="matrix-page__title">Матриця компетентностей</h1>
          <p className="matrix-page__subtitle">
            Відповідність навчальних дисциплін загальним і фаховим компетентностям
            освітньо-професійної програми.
          </p>
        </div>

        <div className="matrix-page__header-right">
          <div className="matrix-page__stat">
            <span className="matrix-page__stat-label">Дисциплін</span>
            <span className="matrix-page__stat-value matrix-page__stat-value--accent">
              {Competency.length}
            </span>
          </div>
          <div className="matrix-page__stat">
            <span className="matrix-page__stat-label">Загальних ЗК</span>
            <span className="matrix-page__stat-value">{zkCount}</span>
          </div>
          <div className="matrix-page__stat">
            <span className="matrix-page__stat-label">Фахових СК</span>
            <span className="matrix-page__stat-value">{skCount}</span>
          </div>
        </div>
      </div>

      <div className="legend">
        <div className="legend__item">
          <span className="dot-zk" />
          Загальні (ЗК)
        </div>
        <div className="legend__item">
          <span className="dot-sk" />
          Фахові (СК)
        </div>
      </div>

      <div className="matrix-wrap">
        <table className="matrix">
          <thead>
            <tr>
              <th className="matrix__discipline-column">Дисципліна</th>
              {Array.from({ length: zkCount }, (_, i) => (
                <th key={`zk-h-${i}`}>ЗК{i + 1}</th>
              ))}
              {Array.from({ length: skCount }, (_, i) => (
                <th key={`sk-h-${i}`}>СК{i + 1}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Competency.map((item) => (
              <tr key={item.id}>
                <td className="matrix__discipline-name">
                  {item.id} {item.shortName}
                </td>
                {Array.from({ length: zkCount }, (_, i) => (
                  <td key={`zk-${i}`} className="matrix__cell">
                    {item.zk.includes(i + 1) && <span className="dot-zk" />}
                  </td>
                ))}
                {Array.from({ length: skCount }, (_, i) => (
                  <td key={`sk-${i}`} className="matrix__cell">
                    {item.sk.includes(i + 1) && <span className="dot-sk" />}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
