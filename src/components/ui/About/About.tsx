import './About.scss';
import '@/components/DisciplineNode/DisciplineNode.scss';
import { disciplines } from '@/data/node';
import ReqList from '@/components/DisciplineNode/ReqList';

const mid = disciplines.find((d) => d.prerequisites.length > 0 && d.postrequisites.length > 0)!;

const electiveTags = disciplines
  .filter((d) => d.code.match(/^ВК \d+\.1$/))
  .map((d) => d.shortName ?? d.name);

export default function AboutSection({ countSemester }: { countSemester: number }) {
  const semesterLabels = Array.from({ length: countSemester }, (_, i) => {
    const sem = i + 1;
    const count = disciplines.filter((d) => d.semesters.includes(sem)).length;
    return { sem, count };
  });

  return (
    <section className="about-section" id="about">
      <div className="about-section__eyebrow">Як це працює</div>
      <h2 className="about-section__title">Зрозумій структуру свого навчання</h2>

      <div className="bento">
        <div className="card card--7">
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
                  {mid.prerequisites.length > 0 && (
                    <div className="node__prereqs">
                      <ReqList ids={mid.prerequisites} />
                    </div>
                  )}
                  <div className="node__text">
                    <div className="node__code">{mid.code}</div>
                    <div className="node__title">{mid.shortName ?? mid.name}</div>
                  </div>
                  {mid.postrequisites.length > 0 && (
                    <div className="node__postreqs">
                      <ReqList ids={mid.postrequisites} />
                    </div>
                  )}
                </div>
                <span className="flow__label flow__label--post">Пререквізити</span>
              </div>
            </div>
          )}
        </div>
        <div className="card card--5">
          <div className="card__eyebrow">Обовязкові дисципліни</div>
          <div className="big-num">40</div>
          <div className="card__body">предмети формують базу знань компютерного інженера</div>
        </div>
        <div className="card card--4">
          <div className="card__eyebrow">Семестри</div>
          <div className="sem-list">
            {semesterLabels.map(({ sem, count }) => (
              <div key={sem} className="sem-item">
                <span className="sem-dot" />
                Семестр {sem} · {count} дисциплін
              </div>
            ))}
          </div>
        </div>
        <div className="card card--8">
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
        </div>
      </div>
    </section>
  );
}
