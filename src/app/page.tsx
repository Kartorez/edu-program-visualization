import Navbar from '@/components/ui/Navbar/Navbar';
import Hero from '@/components/ui/Hero/Hero';
import Marquee from '@/components/ui/Marquee/Marquee';
import { disciplines } from '@/data/node';
import About from '../components/ui/About/About';

const countDiscipline = disciplines.filter((d) => d.code.startsWith('ОК')).length;
const countElective = disciplines.filter((d) => d.code.startsWith('ВК')).length / 3;
const countSemester = Math.max(...disciplines.flatMap((d) => d.semesters));
export default function Home() {
  return (
    <>
      <Navbar />
      <Hero
        countDiscipline={countDiscipline}
        countElective={countElective}
        countSemester={countSemester}
        countCredits={240}
      />
      <Marquee />
      <About countSemester={countSemester} />
    </>
  );
}
