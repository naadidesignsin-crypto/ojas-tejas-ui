import React from 'react';
import { floatingEmojis } from '../data/siteData.js';

function FloatingDecorations() {
  return (
    <div className="floating-layer" aria-hidden="true">
      {floatingEmojis.map((emoji) => (
        <span key={`${emoji.value}-${emoji.className}`} className={emoji.className}>
          {emoji.value}
        </span>
      ))}
    </div>
  );
}

export default FloatingDecorations;
