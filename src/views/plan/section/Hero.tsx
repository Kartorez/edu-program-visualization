import ProgramSelector, { type ProgramOption } from '@/features/program-selection/components/ProgramSelector';
import { ScrollReveal } from '@/shared/ui';
import styles from './Hero.module.scss';

type HeroProps = {
    countDiscipline: number;
    countSemester: number;
    countCredits: number;
    countElective: number;
    title?: string;
    subtitle?: string;
    currentProgram?: string;
    programOptions?: ProgramOption[];
};

export default function Hero({
    countDiscipline,
    countSemester,
    countCredits,
    countElective,
    title = 'Освітня програма',
    subtitle = 'кафедри КН',
    currentProgram = 'Оберіть програму',
    programOptions = [],
}: HeroProps) {
    const stats = [
        { value: countDiscipline, label: 'дисципліни' },
        { value: countSemester, label: 'семестрів' },
        { value: countCredits, label: 'кредитів' },
        { value: countElective, label: 'вибіркових' },
    ];

    const getSemesterWord = (count: number) => {
        switch (count) {
            case 2: return 'другого';
            case 3: return 'третього';
            case 4: return 'четвертого';
            case 5: return 'пʼятого';
            case 6: return 'шостого';
            case 7: return 'сьомого';
            case 8: return 'восьмого';
            default: return `${count}-го`;
        }
    };

    return (
        <section className={styles.hero}>
            <div className={styles.hero__grid} />

            <div className={styles.hero__inner}>
                <ScrollReveal delay={0} className={styles.hero__selectorReveal}>
                    <ProgramSelector currentLabel={currentProgram} options={programOptions} />
                </ScrollReveal>

                <ScrollReveal delay={200}>
                    <h1 className={styles.hero__title}>
                        {title}
                        <br />
                        <em>{subtitle}</em>
                    </h1>
                </ScrollReveal>

                <ScrollReveal delay={400}>
                    <p className={styles.hero__subtitle}>
                        Інтерактивна візуалізація навчального плану — дисципліни, звязки між предметами та шлях
                        від першого до {getSemesterWord(countSemester)} семестру.
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