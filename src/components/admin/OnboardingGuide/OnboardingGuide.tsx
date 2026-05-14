import React from 'react';
import Link from 'next/link';
import './OnboardingGuide.scss';

const steps = [
  {
    number: 1,
    title: 'Кафедри (Departments)',
    slug: 'departments',
    description: 'Почніть зі створення кафедри. Вона є обов’язковою для кожної освітньої програми.',
  },
  {
    number: 2,
    title: 'Дисципліни (Disciplines)',
    slug: 'disciplines',
    description: 'Додайте дисципліни до бази. Ви можете використовувати кнопку "📄 Завантажити силабус" для автоматичного заповнення даних з PDF.',
  },
  {
    number: 3,
    title: 'Освітні програми (Educational Programs)',
    slug: 'educational-programs',
    description: 'Створіть версію програми за певним роком. На вкладці "Навчальний план" виберіть дисципліни, які входять до цієї програми.',
  },
  {
    number: 4,
    title: 'Компетентності та Зв’язки',
    slug: 'disciplines',
    description: 'Переконайтеся, що дисципліни мають прив’язані компетентності та налаштовані пререквізити для побудови графа.',
  },
];

export default function OnboardingGuide() {
  return (
    <div className="onboarding">
      <div className="onboarding__header">
        <h2>Посібник з наповнення (Onboarding)</h2>
        <p>
          Дотримуйтесь цього порядку, щоб правильно налаштувати візуалізацію освітньої програми.
        </p>
      </div>

      <div className="onboarding__grid">
        {steps.map((step) => (
          <div key={step.number + step.title} className="onboarding__card">
            <div className="onboarding__number">{step.number}</div>

            <div style={{ marginTop: '0.5rem' }}>
              <h3 className="onboarding__title">{step.title}</h3>
              <p className="onboarding__desc">{step.description}</p>
            </div>

            <Link href={`/admin/collections/${step.slug}`} className="onboarding__link">
              Перейти до розділу
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
