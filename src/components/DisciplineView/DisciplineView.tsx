import Badge from '@/components/ui/Badge';
import './DisciplineView.scss';

export default function DisciplineView() {
  return (
    <div className="discipline">
      <div className="discipline__header card">
        <div className="discipline__header-left">
          <div className="discipline__code">ОК 19 · Обовязкова</div>
          <h1 className="discipline__title">Обєктно-орієнтоване програмування</h1>
          <p className="discipline__description">
            Парадигми ООП, проєктування класів та обєктів, принципи SOLID...
          </p>
        </div>
        <div className="discipline__header-right">
          <div className="discipline__stat">
            <span className="discipline__stat-label">Кредити</span>
            <span className="discipline__stat-value discipline__stat-value--accent">7 ЄКТС</span>
          </div>
          <div className="discipline__stat">
            <span className="discipline__stat-label">Семестр</span>
            <span className="discipline__stat-value">4 з 8</span>
          </div>
          <div className="discipline__stat">
            <span className="discipline__stat-label">Контроль</span>
            <span className="discipline__stat-value">Залік / Екз</span>
          </div>
          <div className="discipline__stat">
            <span className="discipline__stat-label">Компетентності</span>
            <span className="discipline__stat-value">10</span>
          </div>
        </div>
      </div>
      <div className="discipline__content">
        <div className="discipline__topics card">
          <div className="discipline__topics-title title">Теми курсу</div>
          <ol className="discipline__topics-list">
            <li className="discipline__topics-item">Основи ООП: класи, обєкти, методи</li>
            <li className="discipline__topics-item">Інкапсуляція та модифікатори доступу</li>
            <li className="discipline__topics-item">Успадкування та поліморфізм </li>
            <li className="discipline__topics-item">Абстрактні класи та інтерфейси</li>
            <li className="discipline__topics-item">Принципи SOLID</li>
            <li className="discipline__topics-item">Патерни проєктування (GoF)</li>
            <li className="discipline__topics-item">Обробка виключень</li>
            <li className="discipline__topics-item">Узагальнене програмування (Generics)</li>
          </ol>
        </div>
        <div className="discipline__competency card">
          <h3 className="discipline__competency-title title">Компетентності</h3>
          <div className="competency__tags">
            <Badge variant="zk">ЗК1</Badge>
            <Badge variant="zk">ЗК2</Badge>
            <Badge variant="zk">ЗК3</Badge>
            <Badge variant="zk">ЗК7</Badge>
            <Badge variant="sk">СК3</Badge>
            <Badge variant="sk">СК8</Badge>
            <Badge variant="sk">СК9</Badge>
            <Badge variant="sk">СК10</Badge>
            <Badge variant="sk">СК15</Badge>
            <Badge variant="sk">СК16</Badge>
          </div>
        </div>
        <div className="discipline__requisites card">
          <h3 className="discipline__requisites-title title">Пререквізити та Постреквізити</h3>

          <div className="requisites">
            <div className="requisites__section">
              <span className="requisites__label">Пререквізити</span>
              <div className="requisites__row">
                <Badge variant="previous">ОК 8 Програмування</Badge>
                <span className="requisites__arrow">→</span>
                <Badge variant="code">ОК 19</Badge>
              </div>
            </div>

            <div className="requisites__divider" />

            <div className="requisites__section">
              <span className="requisites__label">Постреквізити</span>
              <div className="requisites__row">
                <Badge variant="code">ОК 19</Badge>
                <span className="requisites__arrow">→</span>
                <Badge variant="next">ОК 23 Контроль якості</Badge>
              </div>
              <div className="requisites__row">
                <Badge variant="code">ОК 19</Badge>
                <span className="requisites__arrow">→</span>
                <Badge variant="next">ОК 31 Технологія ПЗ</Badge>
              </div>
            </div>
          </div>
        </div>
        <div className="discipline__results card">
          <h3 className="discipline__results-title title">Результати навчання</h3>

          <ul className="results__list">
            <li className="results__item">
              <Badge variant="rn">РН5</Badge>
              <p className="results__text">
                Проектувати, розробляти та аналізувати алгоритми розвязання задач, оцінювати
                ефективність та складність алгоритмів на основі формальних моделей.
              </p>
            </li>
            <li className="results__item">
              <Badge variant="rn">РН9</Badge>
              <p className="results__text">
                Розробляти програмні моделі предметних середовищ, вибирати парадигму програмування з
                позицій зручності та якості застосування.
              </p>
            </li>
            <li className="results__item">
              <Badge variant="rn">РН11</Badge>
              <p className="results__text">
                Володіти навичками управління життєвим циклом програмного забезпечення відповідно до
                вимог і обмежень замовника.
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
