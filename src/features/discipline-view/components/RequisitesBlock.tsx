import Link from 'next/link';
import { Badge } from '@/shared/ui';

type Props = {
  discipline: any;
  prerequisites: any[];
  postrequisites: any[];
};

export default function RequisitesBlock({ discipline, prerequisites, postrequisites }: Props) {
  const thesisDiscipline =
    discipline.thesisDiscipline && typeof discipline.thesisDiscipline === 'object'
      ? discipline.thesisDiscipline
      : null;

  return (
    <div className="discipline-view__card">
      <div className="discipline-view__section-title">Звʼязки</div>
      <div className="discipline-view__requisites">

        
        {thesisDiscipline && (
          <>
            <div className="discipline-view__requisites-section">
              <span className="discipline-view__requisites-label">Базова дисципліна</span>
              <div className="discipline-view__requisites-row">
                <Link
                  href={`/plan/disciplines/${thesisDiscipline.id}`}
                  className="discipline-view__link"
                >
                  <Badge variant="previous">
                    {thesisDiscipline.code} {thesisDiscipline.shortName ?? thesisDiscipline.name}
                  </Badge>
                </Link>
              </div>
            </div>
            <div className="discipline-view__requisites-divider" />
          </>
        )}

        <div className="discipline-view__requisites-section">
          <span className="discipline-view__requisites-label">Пререквізити</span>
          <div className="discipline-view__requisites-row">
            {prerequisites.map((p: any) => (
              <Link key={p.id} href={`/plan/disciplines/${p.id}`} className="discipline-view__link">
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
              <Link key={p.id} href={`/plan/disciplines/${p.id}`} className="discipline-view__link">
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
  );
}
