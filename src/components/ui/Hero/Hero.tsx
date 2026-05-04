import Badge from '@/components/ui/Badge';
import ScrollReveal from '@/components/ui/ScrollReveal';
import styles from './Hero.module.scss';

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
    <section className={styles.hero}>
      <div className={styles.hero__grid} />

      <div className={styles.hero__inner}>
        <ScrollReveal delay={0}>
          <Badge shape="pill" className={styles.hero__badge}>
            <span className={styles.hero__badge_dot} />
            {'Комп`ютерні науки · Бакалавр · 2024'}
          </Badge>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <h1 className={styles.hero__title}>
            Освітня програма
            <br />
            <em>кафедри КН</em>
          </h1>
        </ScrollReveal>

        <ScrollReveal delay={400}>
          <p className={styles.hero__subtitle}>
            Інтерактивна візуалізація навчального плану — дисципліни, звязки між предметами та шлях
            від першого до восьмого семестру.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={600} direction="up" threshold={0}>
          <div className={styles.hero__stats}>
            {stats.map((stat) => (
              <div key={stat.label} className={styles.stat}>
                <div className={styles.stat__num}>{stat.value}</div>
                <div className={styles.stat__label}>{stat.label}</div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
