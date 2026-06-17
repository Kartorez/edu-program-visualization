'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Badge, type BadgeVariant } from '@/shared/ui';
import styles from './Accordion.module.scss';


type ChevronIcon = React.FC<{ open: boolean }>;

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      className={`${styles.accordion__chevron} ${open ? styles['accordion__chevron--open'] : ''}`}
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
  );
}


export type BadgeItem = {
  badge: string;
  text: string;
  variant?: BadgeVariant;
  link?: string;
};

type BadgeAccordionProps = {
  variant: 'badge-list';
  title: string;
  badgeVariant: BadgeVariant;
  items: BadgeItem[];
};

function BadgeAccordion({ title, badgeVariant, items }: Omit<BadgeAccordionProps, 'variant'>) {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.accordion}>
      <button className={styles.accordion__trigger} onClick={() => setOpen(!open)}>
        <span className={styles.accordion__title}>{title}</span>
        <Chevron open={open} />
      </button>

      {!open && (
        <div className={styles.accordion__preview}>
          {items.map((item) =>
            item.link ? (
              <Link key={item.badge} href={item.link}>
                <Badge variant={item.variant ?? badgeVariant} shape="rect">
                  {item.badge}
                </Badge>
              </Link>
            ) : (
              <Badge key={item.badge} variant={item.variant ?? badgeVariant} shape="rect">
                {item.badge}
              </Badge>
            ),
          )}
        </div>
      )}

      <div className={`${styles.accordion__body} ${open ? styles['accordion__body--open'] : ''}`}>
        <div className={styles['accordion__body-inner']}>
          <ul
            className={`${styles.accordion__list} ${open ? styles.opened : styles.close}`}
            key={String(open)}
          >
            {items.map((item) => (
              <li key={item.badge} className={styles.accordion__item}>
                {item.link ? (
                  <Link href={item.link} className={styles['accordion__item-link']}>
                    <Badge variant={item.variant ?? badgeVariant} shape="rect">
                      {item.badge}
                    </Badge>
                    <p className={styles.accordion__text}>{item.text}</p>
                  </Link>
                ) : (
                  <div className={styles['accordion__item-content']}>
                    <Badge variant={item.variant ?? badgeVariant} shape="rect">
                      {item.badge}
                    </Badge>
                    <p className={styles.accordion__text}>{item.text}</p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ─── Variant: topics (теми курсу, згруповані по семестрах) ───────────────────

export type TopicItem = {
  title: string;
  semester?: string | number;
};

type TopicsAccordionProps = {
  variant: 'topics';
  topics: TopicItem[];
  semesters?: (string | number)[];
};

function TopicsAccordion({ topics, semesters }: Omit<TopicsAccordionProps, 'variant'>) {
  const grouped = topics.reduce<Record<string, TopicItem[]>>((acc, t) => {
    const s = String(t.semester || 'Загальні');
    if (!acc[s]) acc[s] = [];
    acc[s].push(t);
    return acc;
  }, {});

  const semKeys = Object.keys(grouped).sort((a, b) =>
    a === 'Загальні' ? 1 : b === 'Загальні' ? -1 : Number(a) - Number(b),
  );

  if (semKeys.length <= 1) {
    const items = semKeys.length === 1 ? grouped[semKeys[0]] : [];
    return (
      <ol className={styles['topics-list']}>
        {items.map((t, i) => (
          <li key={i} className={styles['topics-list__item']}>
            {t.title}
          </li>
        ))}
      </ol>
    );
  }

  return <TopicsSemesterList semKeys={semKeys} grouped={grouped} />;
}

function TopicsSemesterList({
  semKeys,
  grouped,
}: {
  semKeys: string[];
  grouped: Record<string, TopicItem[]>;
}) {
  const [openSem, setOpenSem] = useState<string | null>(semKeys[0] ?? null);

  return (
    <div className={styles['topics-accordion']}>
      {semKeys.map((sem) => {
        const isOpen = openSem === sem;
        const items = grouped[sem];
        const label = sem === 'Загальні' ? 'Загальні теми' : `Семестр ${sem}`;

        return (
          <div key={sem} className={styles['topics-accordion__group']}>
            <button
              className={`${styles['topics-accordion__trigger']} ${isOpen ? styles['topics-accordion__trigger--open'] : ''}`}
              onClick={() => setOpenSem(isOpen ? null : sem)}
            >
              <span className={styles['topics-accordion__label']}>{label}</span>
              <span className={styles['topics-accordion__count']}>{items.length} тем</span>
              <Chevron open={isOpen} />
            </button>

            <div
              className={`${styles['topics-accordion__body']} ${isOpen ? styles['topics-accordion__body--open'] : ''}`}
            >
              <div className={styles['topics-accordion__body-inner']}>
                <ol className={styles['topics-list']}>
                  {items.map((t, i) => (
                    <li key={i} className={styles['topics-list__item']}>
                      {t.title}
                    </li>
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

// ─── Unified export ──────────────────────────────────────────────────────────

export type AccordionProps = BadgeAccordionProps | TopicsAccordionProps;

export default function Accordion(props: AccordionProps) {
  if (props.variant === 'topics') {
    return <TopicsAccordion topics={props.topics} semesters={props.semesters} />;
  }
  return (
    <BadgeAccordion
      title={props.title}
      badgeVariant={props.badgeVariant}
      items={props.items}
    />
  );
}
