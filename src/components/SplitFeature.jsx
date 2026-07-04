import React from 'react';
import HeroContent from './HeroContent.jsx';
import SectionTitle from './SectionTitle.jsx';
import VideoFrame from './VideoFrame.jsx';

function SplitFeature({ id, title, layout }) {
  const video = <VideoFrame variant="small" />;
  const content = <HeroContent compact />;
  const isVideoLeft = layout === 'video-left';

  return (
    <section className="split-section section-anchor" id={id}>
      <div className="page-container">
        <SectionTitle>{title}</SectionTitle>
        <div className={isVideoLeft ? 'split-grid' : 'split-grid reverse'}>
          <div>{isVideoLeft ? video : content}</div>
          <div>{isVideoLeft ? content : video}</div>
        </div>
      </div>
    </section>
  );
}

export default SplitFeature;
