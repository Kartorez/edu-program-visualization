import { Accordion } from '@/shared/ui';

type Props = {
  discipline: any;
};

export default function StandardBlock({ discipline }: Props) {
  const topics = discipline.topics || [];

  return (
    <div className="discipline-view__card">
      <div className="discipline-view__section-title">Теми курсу</div>
      {topics.length > 0 ? (
        <Accordion variant="topics" topics={topics} semesters={discipline.semesters || []} />
      ) : (
        <span className="discipline-view__empty">Теми не вказані</span>
      )}
    </div>
  );
}
