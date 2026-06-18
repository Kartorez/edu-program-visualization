import { ScrollReveal } from '@/shared/ui';
import Link from 'next/link';
import styles from './About.module.scss';
import ReqList from '@/shared/ui/CustomNodes/ReqList';
import nodeStyles from '@/shared/ui/CustomNodes/Node.module.scss';
import { getElectiveGroupCode } from '@/shared/lib/elective';

export default function About({ disciplines, programId }: { disciplines: any[], programId: string }) {
    const unique = Array.from(new Map((disciplines || []).map((d) => [String(d.id), d])).values());

    const okDisciplines = unique.filter((d: any) => !getElectiveGroupCode(d));

    const mid = unique.find(
        (d: any) => d.code?.startsWith('ОК') && (d.prerequisites?.length ?? 0) > 0 && (d.postrequisites?.length ?? 0) > 0
    ) || okDisciplines[5];

    const electiveGroupMap = new Map(
        unique
            .filter((d: any) => d.code?.match(/^ВК\s*\d+\.1/))
            .map((d: any) => [d.code?.match(/^ВК\s*\d+/)?.[0], { id: d.id, label: d.shortName ?? d.name }])
    );
    const electiveTags = [...electiveGroupMap.values()];

    const countDisciplines = okDisciplines.length;

    const allSemesters = [
        ...new Set(unique.map((d: any) => d.currentSemester).filter((s) => s > 0)),
    ].sort((a: number, b: number) => a - b);

    const semesterLabels = allSemesters.map((sem) => {
        const seenGroups = new Set<string>();
        let count = 0;

        unique
            .filter((d: any) => d.currentSemester === sem)
            .forEach((d: any) => {
                const group = getElectiveGroupCode(d);
                if (group) {
                    if (!seenGroups.has(group)) {
                        seenGroups.add(group);
                        count++;
                    }
                } else {
                    count++;
                }
            });

        return { sem, count };
    });

    const getCodes = (list: any[]) => (list || []).map(p => p.code).filter(c => c && !c.startsWith('ВК'));

    const midPrereqs = getCodes(mid?.prerequisites as any);
    const midPostreqs = getCodes(mid?.postrequisites as any);

    return (
        <section className={styles['about-section']} id="about">
            <ScrollReveal>
                <div className={styles['about-section__eyebrow']}>Як це працює</div>
                <h2 className={styles['about-section__title']}>Зрозумій структуру свого навчання</h2>
            </ScrollReveal>

            <div className={styles.bento}>
                <ScrollReveal className={`${styles.card} ${styles['card--7']}`} delay={100} direction="right">
                    <div className={styles['card__eyebrow']}>Звязки між предметами</div>
                    <div className={styles['card__title']}>Передумови та наступники</div>
                    <div className={styles['card__body']}>
                        Кожна дисципліна може мати предмети які треба пройти перед нею — і відкривати шлях до
                        наступних.
                    </div>

                    {mid && (
                        <div className={styles.flow}>
                            <div className={styles['flow__node-wrap']}>
                                <span className={`${styles['flow__label']} ${styles['flow__label--pre']}`}>Пререквізити</span>
                                <div className={`${nodeStyles.node} ${nodeStyles.discipline}`}>
                                    {midPrereqs.length > 0 && (
                                        <div className={nodeStyles.node__prereqs}>
                                            <ReqList codes={midPrereqs} />
                                        </div>
                                    )}
                                    <div className={nodeStyles.node__text}>
                                        <div className={nodeStyles.node__code}>{mid.code}</div>
                                        <div className={nodeStyles.node__title}>{mid.shortName ?? mid.name}</div>
                                    </div>
                                    {midPostreqs.length > 0 && (
                                        <div className={nodeStyles.node__postreqs}>
                                            <ReqList codes={midPostreqs} />
                                        </div>
                                    )}
                                </div>
                                <span className={`${styles['flow__label']} ${styles['flow__label--post']}`}>Постреквізити</span>
                            </div>
                        </div>
                    )}
                </ScrollReveal>

                <ScrollReveal className={`${styles.card} ${styles['card--5']}`} delay={200} direction="left">
                    <div className={styles['card__eyebrow']}>Обовязкові дисципліни</div>
                    <div className={styles['big-num']}>{countDisciplines}</div>
                    <div className={styles['card__body']}>предмети формують базу знань фахівця з комп'ютерних наук</div>
                </ScrollReveal>

                <ScrollReveal className={`${styles.card} ${styles['card--4']}`} delay={300} direction="right">
                    <div className={styles['card__eyebrow']}>Семестри</div>
                    <div className={styles['sem-list']}>
                        {semesterLabels.map(({ sem, count }) => (
                            <Link key={sem} href={`/plan/${programId}/graph?semester=${sem}`} className={`${styles['sem-item']} ${styles['sem-item--link']}`}>
                                <span className={styles['sem-dot']} />
                                Семестр {sem} · {count} дисциплін
                            </Link>
                        ))}
                    </div>
                </ScrollReveal>

                <ScrollReveal className={`${styles.card} ${styles['card--8']}`} delay={400} direction="left">
                    <div className={styles['card__eyebrow']}>Вибіркові дисципліни</div>
                    <div className={styles['card__title']}>Обери свій напрямок</div>
                    <div className={styles['card__body']}>
                        {electiveTags.length} вибіркових дисциплін дозволяють спеціалізуватись у напрямках які
                        цікавлять саме тебе.
                    </div>
                    <div className={styles['tag-list']}>
                        {electiveTags.map((tag: any, i) => (
                            <Link key={i} href={`/plan/${programId}/disciplines/${tag.id}`} className={styles.tag}>
                                {tag.label}
                            </Link>
                        ))}
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
}