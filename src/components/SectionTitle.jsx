import React from 'react';

function SectionTitle({ children }) {
  return (
    <div className="section-title">
      <h2>{children}</h2>
      <span aria-hidden="true" />
    </div>
  );
}

export default SectionTitle;
