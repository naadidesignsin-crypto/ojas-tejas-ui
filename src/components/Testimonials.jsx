import React from 'react';
import { testimonials } from '../data/siteData.js';
import SectionTitle from './SectionTitle.jsx';

function Testimonials() {
  return (
    <section className="testimonials-section section-anchor" id="programs">
      <div className="page-container">
        <SectionTitle>Our Popular Programs</SectionTitle>
        <div className="testimonial-grid">
          {testimonials.map((item) => (
            <article className="testimonial-card" key={item.name}>
              <div className="testimonial-top">
                <span className="avatar" aria-hidden="true">{item.avatar}</span>
                <span className="stars" aria-label="Five star rating">{item.stars}</span>
              </div>
              <p>{item.text}</p>
              <strong>– {item.name}</strong>
              <span className="heart" aria-hidden="true">♡</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
