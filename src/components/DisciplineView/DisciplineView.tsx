import Badge from '@/components/ui/Badge';
import Accordion from './Accordion';
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
            <li className="discipline__topics-item">Успадкування та поліморфізм</li>
            <li className="discipline__topics-item">Абстрактні класи та інтерфейси</li>
            <li className="discipline__topics-item">Принципи SOLID</li>
            <li className="discipline__topics-item">Патерни проєктування (GoF)</li>
            <li className="discipline__topics-item">Обробка виключень</li>
            <li className="discipline__topics-item">Узагальнене програмування (Generics)</li>
          </ol>
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
        <div className="discipline__competency card">
          <Accordion
            title="Компетентності"
            variant="zk"
            items={[
              { badge: 'ЗК1', text: 'Здатність до абстрактного мислення, аналізу та синтезу' },
              { badge: 'ЗК2', text: 'Здатність застосовувати знання у практичних ситуаціях' },
              {
                badge: 'ЗК3',
                text: 'Знання та розуміння предметної області та професійної діяльності',
              },
              {
                badge: 'ЗК7',
                text: 'Здатність до пошуку, оброблення та аналізу інформації з різних джерел',
              },
              {
                badge: 'СК3',
                variant: 'sk',
                text: 'Здатність до логічного мислення, побудови логічних висновків',
              },
              {
                badge: 'СК8',
                variant: 'sk',
                text: 'Здатність проектувати та розробляти програмне забезпечення',
              },
              {
                badge: 'СК9',
                variant: 'sk',
                text: 'Здатність реалізувати багаторівневу обчислювальну модель',
              },
              {
                badge: 'СК10',
                variant: 'sk',

                text: 'Здатність застосовувати методології управління життєвим циклом ПЗ',
              },
              {
                badge: 'СК15',
                variant: 'sk',

                text: 'Здатність до аналізу та функціонального моделювання бізнес-процесів',
              },
              {
                badge: 'СК16',
                variant: 'sk',
                text: 'Здатність реалізовувати високопродуктивні обчислення',
              },
            ]}
          />
        </div>
        <div className="discipline__results card">
          <Accordion
            title="Результати навчання"
            variant="rn"
            items={[
              {
                badge: 'РН5',
                text: 'Проектувати, розробляти та аналізувати алгоритми розвязання задач, оцінювати ефективність та складність алгоритмів на основі формальних моделей.',
              },
              {
                badge: 'РН9',
                text: 'Розробляти програмні моделі предметних середовищ, вибирати парадигму програмування з позицій зручності та якості застосування.',
              },
              {
                badge: 'РН11',
                text: 'Володіти навичками управління життєвим циклом програмного забезпечення відповідно до вимог і обмежень замовника.',
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
