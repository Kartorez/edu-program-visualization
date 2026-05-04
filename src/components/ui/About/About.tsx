import ScrollReveal from '@/components/ui/ScrollReveal/ScrollReveal';
import './About.scss';
import '@/components/DisciplineNode/DisciplineNode.scss';
import ReqList from '@/components/DisciplineNode/ReqList';
import type { Discipline } from '@/payload-types';

export default function About({ disciplines }: { disciplines: Discipline[] }) {
  const mid = disciplines.find(
    (d) => (d.prerequisites?.length ?? 0) > 0 && (d.postrequisites?.length ?? 0) > 0
  );

  const countDisciplines = disciplines.filter((d) => d.code?.startsWith('ОК')).length;

  const electiveTags = disciplines
    .filter((d) => d.code?.match(/^ВК \d+\.1$/))
    .map((d) => d.shortName ?? d.name);

  const allSemesters = [
    ...new Set(disciplines.flatMap((d) => d.semesters?.map((s) => s.semester ?? 0) ?? [])),
  ].sort((a, b) => a - b);

  const semesterLabels = allSemesters.map((sem) => {
    const seenGroups = new Set<string>();
    let count = 0;

    disciplines
      .filter((d) => d.semesters?.some((s) => s.semester === sem))
      .forEach((d) => {
        const group = d.code?.match(/^ВК\s*\d+/)?.[0];
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

  const midPrereqs =
    mid?.prerequisites?.map((p) => (typeof p === 'object' ? p.code : String(p))) ?? [];

  const midPostreqs =
    mid?.postrequisites?.map((p) => (typeof p === 'object' ? p.code : String(p))) ?? [];

  return (
    <section className="about-section" id="about">
      <ScrollReveal>
        <div className="about-section__eyebrow">Як це працює</div>
        <h2 className="about-section__title">Зрозумій структуру свого навчання</h2>
      </ScrollReveal>

      <div className="bento">
        <ScrollReveal className="card card--7" delay={100} direction="right">
          <div className="card__eyebrow">Звязки між предметами</div>
          <div className="card__title">Передумови та наступники</div>
          <div className="card__body">
            Кожна дисципліна може мати предмети які треба пройти перед нею — і відкривати шлях до
            наступних.
          </div>

          {mid && (
            <div className="flow">
              <div className="flow__node-wrap">
                <span className="flow__label flow__label--pre">Постреквізити</span>
                <div className="node discipline">
                  {midPrereqs.length > 0 && (
                    <div className="node__prereqs">
                      <ReqList codes={midPrereqs} />
                    </div>
                  )}
                  <div className="node__text">
                    <div className="node__code">{mid.code}</div>
                    <div className="node__title">{mid.shortName ?? mid.name}</div>
                  </div>
                  {midPostreqs.length > 0 && (
                    <div className="node__postreqs">
                      <ReqList codes={midPostreqs} />
                    </div>
                  )}
                </div>
                <span className="flow__label flow__label--post">Пререквізити</span>
              </div>
            </div>
          )}
        </ScrollReveal>

        <ScrollReveal className="card card--5" delay={200} direction="left">
          <div className="card__eyebrow">Обовязкові дисципліни</div>
          <div className="big-num">{countDisciplines}</div>
          <div className="card__body">предмети формують базу знань фахівця з комп'ютерних наук</div>
        </ScrollReveal>

        <ScrollReveal className="card card--4" delay={300} direction="right">
          <div className="card__eyebrow">Семестри</div>
          <div className="sem-list">
            {semesterLabels.map(({ sem, count }) => (
              <div key={sem} className="sem-item">
                <span className="sem-dot" />
                Семестр {sem} · {count} дисциплін
              </div>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal className="card card--8" delay={400} direction="left">
          <div className="card__eyebrow">Вибіркові дисципліни</div>
          <div className="card__title">Обери свій напрямок</div>
          <div className="card__body">
            {electiveTags.length} вибіркових дисциплін дозволяють спеціалізуватись у напрямках які
            цікавлять саме тебе.
          </div>
          <div className="tag-list">
            {electiveTags.map((label, i) => (
              <span key={i} className="tag">
                {label}
              </span>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
