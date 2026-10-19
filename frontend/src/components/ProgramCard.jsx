import React from 'react';
import { Check, ArrowUpRight } from 'lucide-react';

export default function ProgramCard({
  tag,
  title,
  description,
  items,
  featured = false,
  onSelectProgram
}) {
  return (
    <article className={`program-card ${featured ? 'featured' : ''}`}>
      <div>
        <div className="program-tag">{tag}</div>
        <h3>{title}</h3>
        <p className="program-desc">{description}</p>
        <ul className="program-items">
          {items.map((item) => (
            <li key={item}>
              <span className="check-bullet" aria-hidden="true">
                <Check size={13} strokeWidth={2.5} />
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <a
        href="#contato"
        onClick={() => onSelectProgram && onSelectProgram(title)}
        className={`btn ${featured ? 'btn-primary' : 'btn-outline'}`}
        style={{ width: '100%' }}
      >
        Solicitar proposta para {title}
        <ArrowUpRight size={16} aria-hidden="true" />
      </a>
    </article>
  );
}
