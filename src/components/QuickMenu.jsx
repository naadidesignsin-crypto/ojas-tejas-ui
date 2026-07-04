import React from 'react';
import { quickMenu } from '../data/siteData.js';

function QuickMenu() {
  const handleClick = (target) => {
    document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="quick-menu-section" aria-label="Quick menu">
      <div className="page-container">
        <div className="quick-menu-card">
          {quickMenu.map((item) => (
            <button
              type="button"
              className={`quick-menu-item ${item.color}`}
              key={item.title}
              onClick={() => handleClick(item.target)}
            >
              <span>{item.icon}</span>
              <strong>{item.title}</strong>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default QuickMenu;
