import React, { useState } from 'react';

function Subscribe() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const submitForm = (event) => {
    event.preventDefault();
    setMessage(email.trim() ? 'Thanks! We will share new class updates soon. 🎨' : 'Please enter your email.');
  };

  return (
    <section className="subscribe-section">
      <div className="page-container">
        <div className="subscribe-card">
          <div className="subscribe-copy">
            <span aria-hidden="true">☆</span>
            <h2>Let&apos;s stay creative together!</h2>
            <p>Get updates on new classes, workshops & exciting offers.</p>
          </div>
          <form className="subscribe-form" onSubmit={submitForm}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              aria-label="Email address"
            />
            <button type="submit">Subscribe</button>
            {message && <small>{message}</small>}
          </form>
          <div className="kid-art" aria-hidden="true">👦🏻🎨</div>
        </div>
      </div>
    </section>
  );
}

export default Subscribe;
