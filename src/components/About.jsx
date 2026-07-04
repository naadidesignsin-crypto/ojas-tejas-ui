import React from 'react';
import aboutArt from '../assets/about-art.png';

function About() {
  const scrollToDemo = () => {
    document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="about-section section-anchor" id="about">
      <div className="page-container about-grid">
        <div className="about-copy">
          <h2>About Me</h2>
          <p>
            Creative art classes that inspire, build skills and bring out the artist in every child.
          </p>
          <button className="primary-btn small-btn" type="button" onClick={scrollToDemo}>
            Book Your Demo Class
          </button>
          <small>Let&apos;s create something beautiful together! 💙</small>
        </div>
        <div className="about-image-card">
          <img src={aboutArt} alt="Art brushes and painting table" />
        </div>
      </div>
    </section>
  );
}

export default About;
