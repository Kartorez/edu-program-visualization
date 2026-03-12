import Button from '@/components/ui/Button/Button';
import './Hero.scss';

type HeroProps = {
  countDiscipline: number;
  countSemester: number;
  countCredits: number;
  countElective: number;
};

export default function Hero({
  countDiscipline,
  countSemester,
  countCredits,
  countElective,
}: HeroProps) {
  const stats = [
    { value: countDiscipline, label: 'дисципліни' },
    { value: countSemester, label: 'семестрів' },
    { value: countCredits, label: 'кредитів' },
    { value: countElective, label: 'вибіркових' },
  ];

  return (
    <section className="hero">
      <div className="hero__grid" />

      <div className="hero__inner">
        <div className="hero__badge">
          <span className="hero__badge-dot" />
          Компютерні науки · Бакалавр · 2024
        </div>

        <h1 className="hero__title">
          Освітня програма
          <br />
          <em>кафедри КН</em>
        </h1>

        <p className="hero__subtitle">
          Інтерактивна візуалізація навчального плану — дисципліни, звязки між предметами та шлях
          від першого до восьмого семестру.
        </p>

        <div className="hero__stats">
          {stats.map((stat) => (
            <div key={stat.label} className="stat">
              <div className="stat__num">{stat.value}</div>
              <div className="stat__label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
