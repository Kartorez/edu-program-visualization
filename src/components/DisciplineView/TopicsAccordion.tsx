'use client';

import { useState } from 'react';
import './TopicsAccordion.scss';

type Topic = { title: string; semester?: string | number };

type Props = {
  topics: Topic[];
  semesters: (string | number)[];
};

export default function TopicsAccordion({ topics, semesters }: Props) {
  const grouped = topics.reduce<Record<string, Topic[]>>((acc, t) => {
    const s = String(t.semester || 'Загальні');
    if (!acc[s]) acc[s] = [];
    acc[s].push(t);
    return acc;
  }, {});

  const semKeys = Object.keys(grouped).sort((a, b) =>
    a === 'Загальні' ? 1 : b === 'Загальні' ? -1 : Number(a) - Number(b)
  );

  if (semKeys.length <= 1) {
    const items = semKeys.length === 1 ? grouped[semKeys[0]] : [];
    return (
      <ol className="topics-accordion__list">
        {items.map((t, i) => (
          <li key={i} className="topics-accordion__item">{t.title}</li>
        ))}
      </ol>
    );
  }

  return <TopicsSemesterList semKeys={semKeys} grouped={grouped} semesters={semesters} />;
}

function TopicsSemesterList({
  semKeys,
  grouped,
  semesters,
}: {
  semKeys: string[];
  grouped: Record<string, Topic[]>;
  semesters: (string | number)[];
}) {

  const [openSem, setOpenSem] = useState<string | null>(semKeys[0] ?? null);

  return (
    <div className="topics-accordion">
      {semKeys.map((sem) => {
        const isOpen = openSem === sem;
        const items = grouped[sem];
        const label = sem === 'Загальні' ? 'Загальні теми' : `Семестр ${sem}`;

        return (
          <div key={sem} className="topics-accordion__group">
            <button
              className={`topics-accordion__trigger ${isOpen ? 'topics-accordion__trigger--open' : ''}`}
              onClick={() => setOpenSem(isOpen ? null : sem)}
            >
              <span className="topics-accordion__sem-label">{label}</span>
              <span className="topics-accordion__count">{items.length} тем</span>
              <svg
                className={`topics-accordion__chevron ${isOpen ? 'topics-accordion__chevron--open' : ''}`}
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M4 6l4 4 4-4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <div className={`topics-accordion__body ${isOpen ? 'topics-accordion__body--open' : ''}`}>
              <div className="topics-accordion__body-inner">
                <ol className="topics-accordion__list">
                  {items.map((t, i) => (
                    <li key={i} className="topics-accordion__item">{t.title}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
