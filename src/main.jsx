import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles/global.css';
import './styles/header.css';
import './styles/hero.css';
import './styles/video-frame.css';
import './styles/quick-menu.css';
import './styles/sections.css';
import './styles/gallery.css';
import './styles/about.css';
import './styles/why-choose.css';
import './styles/testimonials.css';
import './styles/subscribe.css';
import './styles/footer.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
