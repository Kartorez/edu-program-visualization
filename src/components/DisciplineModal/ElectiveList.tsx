import { Disciplines } from '@/schemas/discipline.schema';

export default function ElectiveList({ variants }: { variants: Disciplines }) {
  return (
    <div className="elective-variants">
      <p className="elective-variants__title">Дисципліни на вибір</p>
      <ul className="elective-variants__list">
        {variants.map((v) => (
          <li key={v.code} className="elective-variants__item">
            <span className="elective-variants__code">{v.code}</span>
            <span className="elective-variants__name">{v.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
