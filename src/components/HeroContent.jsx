import React from 'react';

function HeroContent({ compact = false }) {
  const scrollToDemo = () => {
    document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className={compact ? 'hero-copy compact' : 'hero-copy'}>
      <span className="eyebrow">Unleash The Artist in You</span>
      <h1>
        Where Imagination <br />
        <span>Meets Creations!</span>
      </h1>
      <p>
        Creative art classes that inspire, build skills and bring out the
        <strong> artist in every child.</strong>
      </p>
      <button className="primary-btn" type="button" onClick={scrollToDemo}>
        <a href="#book-demo" className="primary-btn">
          Book Your Demo Class 🎨
        </a> <span aria-hidden="true">🖌️</span>
      </button>
      <small>Let&apos;s create something beautiful together!</small>
    </div>
  );
}

export default HeroContent;
