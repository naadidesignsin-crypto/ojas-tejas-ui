import React from 'react';
import { footerLinks } from '../data/siteData.js';

function Footer() {
  return (
    <footer className="footer section-anchor" id="contact">
      <div className="page-container footer-grid">
        <div className="footer-brand">
          <h3>Ojas by Tejas</h3>
          <p>Unleash the Artist in You ♡</p>
        </div>
        <div>
          <h4>Quick Links</h4>
          <ul>
            {footerLinks.map((link) => <li key={link}>{link}</li>)}
          </ul>
        </div>
        <div>
          <h4>Contact Us</h4>
          <p>📞 (201) 555-0123</p>
          <p>✉️ hello@ojasbytejas.com</p>
          <p>📍 123 Art Studio Lane,<br />Creative City, CA 90210</p>
        </div>
        <div>
          <h4>Follow Us</h4>
          <div className="social-row" aria-label="Social links">
            <span>◎</span>
            <span>f</span>
            <span>▶</span>
          </div>
        </div>
      </div>
      <div className="footer-bottom">© 2024 Ojas by Tejas. All rights reserved.</div>
    </footer>
  );
}

export default Footer;
