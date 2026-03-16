import Badge from '@/components/ui/Badge';
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
        <Badge shape="pill" className="hero__badge">
          <span className="hero__badge-dot" />
          {'Комп`ютерні науки · Бакалавр · 2024'}
        </Badge>

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
