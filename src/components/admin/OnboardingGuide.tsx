import React from 'react';
import Link from 'next/link';
import './OnboardingGuide.scss';

const steps = [
  {
    number: 1,
    title: 'Кафедри (Departments)',
    slug: 'departments',
    description: 'Почніть зі створення кафедр вашого навчального закладу.',
  },
  {
    number: 2,
    title: 'Спеціальності (Specialties)',
    slug: 'specialties',
    description: 'Додайте спеціальності та закріпіть їх за кафедрами.',
  },
  {
    number: 3,
    title: 'Освітні програми (Educational Programs)',
    slug: 'educational-programs',
    description: 'Визначте рівень освіти (Бакалавр/Магістр) для кожної спеціальності.',
  },
  {
    number: 4,
    title: 'Версії програм (Program Versions)',
    slug: 'program-versions',
    description: 'Створіть версію програми по року набору (наприклад, 2024).',
  },
  {
    number: 5,
    title: 'Дисципліни (Disciplines)',
    slug: 'disciplines',
    description: 'Опишіть паспорт дисципліни (назва, кредити, компетентності).',
  },
  {
    number: 6,
    title: 'Примірники дисциплін (Discipline Instances)',
    slug: 'discipline-instances',
    description: 'Закріпіть конкретну дисципліну за версією програми та семестром.',
  },
];

export default function OnboardingGuide() {
  return (
    <div className="onboarding">
      <div className="onboarding__header">
        <h2>Посібник з наповнення (Onboarding)</h2>
        <p>
          Дотримуйтесь цього порядку заповнення бази даних, щоб забезпечити цілісність усіх зв'язків.
        </p>
      </div>

      <div className="onboarding__grid">
        {steps.map((step) => (
          <div key={step.number} className="onboarding__card">
            <div className="onboarding__number">{step.number}</div>

            <div style={{ marginTop: '0.5rem' }}>
              <h3 className="onboarding__title">{step.title}</h3>
              <p className="onboarding__desc">{step.description}</p>
            </div>

            <Link href={`/admin/collections/${step.slug}/create`} className="onboarding__link">
              Створити запис
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
