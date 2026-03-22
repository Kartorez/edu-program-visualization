'use client';
import { useState } from 'react';
import Badge, { BadgeVariant } from '@/components/ui/Badge';
import './Accordion.scss';

type AccordionItem = {
  badge: string;
  text: string;
  variant?: BadgeVariant;
};

type AccordionProps = {
  title: string;
  variant: BadgeVariant;
  items: AccordionItem[];
};
export default function Accordion({ title, variant, items }: AccordionProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="accordion">
      <button className="accordion__trigger" onClick={() => setOpen(!open)}>
        <span className="accordion__title">{title}</span>
        <svg
          className={`accordion__chevron${open ? ' accordion__chevron--open' : ''}`}
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
      {!open && (
        <div className="accordion__preview">
          {items.map((item) => (
            <Badge key={item.badge} variant={item.variant ?? variant} shape="rect">
              {item.badge}
            </Badge>
          ))}
        </div>
      )}
      <div className={`accordion__body${open ? ' accordion__body--open' : ''}`}>
        <div className="accordion__body-inner">
          <ul className={`accordion__list ${open ? 'opened' : 'close'}`} key={String(open)}>
            {items.map((item) => (
              <li key={item.badge} className="accordion__item">
                <Badge variant={item.variant ?? variant} shape="rect">
                  {item.badge}
                </Badge>
                <p className="accordion__text">{item.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
