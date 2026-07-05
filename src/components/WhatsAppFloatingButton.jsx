import React from "react";
import "../styles/whatsapp-floating.css";

function WhatsAppFloatingButton() {
  const whatsappNumber = "12015550123";

  const message =
    "Hi, I want to know more about Ojas by Tejas art classes.";

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <a
      className="whatsapp-floating-btn"
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Ojas by Tejas on WhatsApp"
    >
      <span className="whatsapp-icon">💬</span>

      <span className="whatsapp-text">
        <strong>Chat</strong>
        <small>WhatsApp</small>
      </span>
    </a>
  );
}

export default WhatsAppFloatingButton;