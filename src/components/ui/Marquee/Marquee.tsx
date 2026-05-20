import './Marquee.scss';
import type { Discipline } from '@/payload-types';

const splitIntoRows = (items: Discipline[], rows: number): Discipline[][] => {
  const result: Discipline[][] = Array.from({ length: rows }, () => []);
  items.forEach((item, i) => result[i % rows].push(item));
  return result;
};

const ROWS = 2;
const TRACK_MOD = ['--left', '--right'] as const;

export default function Marquee({ disciplines }: { disciplines: Discipline[] }) {
  const rows = splitIntoRows(disciplines, ROWS);

  return (
    <div className="marquee-section">
      {rows.map((row, ri) => {
        const doubled = [...row, ...row];
        const mod = TRACK_MOD[ri] ?? '--left';
        return (
          <div key={ri} className="marquee-row">
            <div className={`marquee-track marquee-track${mod}`}>
              {doubled.map((item, ii) => (
                <span key={ii} className="marquee-item">
                  <span className={`chip-code--${item.code?.startsWith('ВК') ? 'vk' : 'ok'}`}>
                    {item.code}
                  </span>
                  <span className="chip-name">— {item.shortName ?? item.name}</span>
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
