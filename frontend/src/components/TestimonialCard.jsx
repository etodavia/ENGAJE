import React from 'react';
import { Quote } from 'lucide-react';

export default function TestimonialCard({ quote, author, roleAndCompany }) {
  return (
    <article className="testimonial-card">
      <div>
        <Quote
          size={26}
          style={{ color: 'var(--color-gold)', marginBottom: '0.85rem', opacity: 0.85 }}
          aria-hidden="true"
        />
        <blockquote className="testimonial-quote">“{quote}”</blockquote>
      </div>
      <footer className="testimonial-author">
        <strong>{author}</strong>
        <span>{roleAndCompany}</span>
      </footer>
    </article>
  );
}
