import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

export default function FaqAccordion({ items }) {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleItem = (idx) => {
    setOpenIndex((prev) => (prev === idx ? -1 : idx));
  };

  return (
    <div className="faq-list">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const answerId = `faq-answer-${index}`;
        const buttonId = `faq-btn-${index}`;

        return (
          <div key={item.question} className="faq-item">
            <h3>
              <button
                id={buttonId}
                type="button"
                className="faq-question"
                aria-expanded={isOpen}
                aria-controls={answerId}
                onClick={() => toggleItem(index)}
              >
                <span>{item.question}</span>
                <span
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    backgroundColor: isOpen ? 'var(--color-green-primary)' : 'var(--color-green-light)',
                    color: isOpen ? 'var(--color-cream-bg)' : 'var(--color-green-primary)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                  aria-hidden="true"
                >
                  {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                </span>
              </button>
            </h3>
            {isOpen && (
              <div
                id={answerId}
                role="region"
                aria-labelledby={buttonId}
                className="faq-answer"
              >
                <p>{item.answer}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
