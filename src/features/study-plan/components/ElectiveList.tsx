import Link from 'next/link';
import type { SidebarDiscipline } from '@/shared/lib/DisciplinesContext';

export default function ElectiveList({
  variants,
}: {
  variants: SidebarDiscipline[];
}) {
  return (
    <div className="elective-variants">
      <p className="elective-variants__title">Дисципліни на вибір</p>
      <ul className="elective-variants__list">
        {variants.map((v) => (
          <li key={v.code} className="elective-variants__item">
            <Link
              href={`/plan/disciplines/${v.id}`}
              className="elective-variants__link"
            >
              <span className="elective-variants__code">{v.code}</span>
              <span className="elective-variants__name">{v.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
