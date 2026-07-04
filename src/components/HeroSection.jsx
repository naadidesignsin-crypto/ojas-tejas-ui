import React from 'react';
import HeroContent from './HeroContent.jsx';
import VideoFrame from './VideoFrame.jsx';

function HeroSection() {
  return (
    <section className="hero-section section-anchor" id="home">
      <div className="page-container hero-grid">
        <HeroContent />
        <div className="hero-video-wrap">
          <VideoFrame variant="large" />
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
