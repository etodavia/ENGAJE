import React from 'react';

export default function SolutionCard({ icon: Icon, title, description, index }) {
  return (
    <article className="solution-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="solution-icon-box" aria-hidden="true">
          <Icon size={22} strokeWidth={1.8} />
        </div>
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'var(--color-gold)',
            letterSpacing: '0.1em'
          }}
        >
          0{index}
        </span>
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  );
}
