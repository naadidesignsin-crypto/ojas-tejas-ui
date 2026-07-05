import React, { useState } from "react";
import { createContactInquiry } from "../api/contactInquiryApi";
import "../styles/contact-inquiry.css";

const initialContactForm = {
  parentName: "",
  email: "",
  phone: "",
  message: ""
};

function ContactInquiryForm({ onBookDemo }) {
  const [formData, setFormData] = useState(initialContactForm);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setSuccessMessage("");
    setError("");

    try {
      const result = await createContactInquiry({
        parentName: formData.parentName,
        email: formData.email,
        phone: formData.phone,
        message: formData.message
      });

      setSuccessMessage(
        `Thank you. Your message is received. Inquiry ID: ${result.id}`
      );

      setFormData(initialContactForm);
    } catch (err) {
      setError(err.message || "Unable to submit message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="contact-inquiry-section" id="contact">
      <div className="contact-inquiry-shell">
        <div className="contact-inquiry-content">
          <span>📩 Contact Ojas</span>

          <h2>Have questions about art classes?</h2>

          <p>
            Send your question and our team will get back to you. You can ask
            about free trial, live online classes, workshops, age groups, or
            timings.
          </p>

          <div className="contact-info-cards">
            <article>
              <strong>📞 Phone</strong>
              <p>(201) 555-0123</p>
            </article>

            <article>
              <strong>✉️ Email</strong>
              <p>hello@ojasbytejas.com</p>
            </article>

            <article>
              <strong>🎨 Classes</strong>
              <p>Live online art classes for kids</p>
            </article>
          </div>

          <button type="button" onClick={onBookDemo}>
            Book Free Demo
          </button>
        </div>

        <div className="contact-inquiry-card">
          <h3>Send a Message</h3>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="parentName"
              placeholder="Parent full name"
              value={formData.parentName}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              type="tel"
              name="phone"
              placeholder="Phone number"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            <textarea
              name="message"
              placeholder="Your message"
              value={formData.message}
              onChange={handleChange}
              rows="5"
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>

          {successMessage && (
            <p className="contact-inquiry-success">{successMessage}</p>
          )}

          {error && <p className="contact-inquiry-error">{error}</p>}
        </div>
      </div>
    </section>
  );
}

export default ContactInquiryForm;