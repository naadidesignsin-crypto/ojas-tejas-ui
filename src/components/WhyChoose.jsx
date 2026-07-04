import React from 'react';
import { whyChoose } from '../data/siteData.js';
import SectionTitle from './SectionTitle.jsx';

function WhyChoose() {
  return (
    <section className="why-section">
      <div className="page-container">
        <SectionTitle>Why Choose OjasbyTejas?</SectionTitle>
        <div className="why-grid">
          {whyChoose.map((item) => (
            <article className="why-card" key={item.title}>
              <span className={`why-icon ${item.color}`} aria-hidden="true">{item.icon}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyChoose;
