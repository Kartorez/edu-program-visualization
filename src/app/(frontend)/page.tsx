import { getPayload } from 'payload';
import config from '@payload-config';
import { sortByCode } from '@/utils/sortByCode';
import Hero from '@/components/ui/Hero/Hero';
import Marquee from '@/components/ui/Marquee/Marquee';
import About from '@/components/ui/About/About';

export default async function Home() {
  const payload = await getPayload({ config });

  const { docs: disciplines } = await payload.find({
    collection: 'disciplines',
    limit: 1000,
    depth: 1,
  });

  const sorted = sortByCode(disciplines);

  const countDiscipline = sorted.filter((d) => d.code?.startsWith('ОК')).length;
  const countElective = sorted.filter((d) => d.code?.startsWith('ВК')).length / 3;
  const countSemester = Math.max(
    ...sorted.flatMap((d) => d.semesters?.map((s) => s.semester ?? 0) ?? [])
  );

  return (
    <>
      <Hero
        countDiscipline={countDiscipline}
        countElective={countElective}
        countSemester={countSemester}
        countCredits={240}
      />
      <Marquee disciplines={sorted} />
      <About disciplines={sorted} />
    </>
  );
}
