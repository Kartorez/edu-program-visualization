import Button from '@/components/ui/Button';

const year = new Date().getFullYear();
export default function Hero() {
  return (
    <section className="hero">
      <div className="hero__content">
        <div className="hero__badge">
          <span className="hero__badge-dot">{`Комп'ютерні науки · Бакалавр · ${year}`}</span>
        </div>
        <h1 className="hero__title">
          Освітня програма
          <br />
          <em>кафедри КН</em>
        </h1>
        <p className="hero__sub">
          {`Інтерактивна візуалізація навчального плану — дисципліни, зв'язки між предметами та шлях від першого до восьмого семестру.`}
        </p>
        <div className="hero__actions">
          <Button>Переглянути план</Button>
          <Button>Як це працює</Button>
        </div>
      </div>
    </section>
  );
}
