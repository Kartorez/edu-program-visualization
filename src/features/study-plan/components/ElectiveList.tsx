import Link from 'next/link';
import { useParams } from 'next/navigation';
import type { SidebarDiscipline } from '@/shared/lib/DisciplinesContext';

export default function ElectiveList({
  variants,
}: {
  variants: { id?: string | number | null; code?: string | null; name?: string | null }[];
}) {
  const params = useParams();
  const programId = params?.programId as string | undefined;

  return (
    <div className="elective-variants">
      <p className="elective-variants__title">Дисципліни на вибір</p>
      <ul className="elective-variants__list">
        {variants.map((v) => (
          <li key={v.code} className="elective-variants__item">
            <Link
              href={programId ? `/plan/${programId}/disciplines/${v.id}` : `/plan/disciplines/${v.id}`}
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
