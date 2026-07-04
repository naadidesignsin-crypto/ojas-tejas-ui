import React, { useState } from "react";
import { createDemoBooking } from "../api/demoBookingApi";
import "../styles/demo-booking.css";

const initialForm = {
  parentName: "",
  childName: "",
  childAge: "",
  phone: "",
  email: "",
  preferredClass: "",
  message: ""
};

function DemoBookingForm() {
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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
    setErrorMessage("");

    try {
      const payload = {
        ...formData,
        childAge: Number(formData.childAge)
      };

      const result = await createDemoBooking(payload);

      setSuccessMessage(
        `Demo booking created successfully. Booking ID: ${result.id}`
      );

      setFormData(initialForm);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="demo-booking-section" id="book-demo">
      <div className="demo-booking-card">
        <div className="demo-booking-content">
          <span className="demo-tag">🎨 Book Demo Class</span>

          <h2>Start Your Child&apos;s Creative Art Journey</h2>

          <p>
            Fill this form to book a sample art class. The data will be saved
            through Spring Boot backend.
          </p>

          <div className="demo-points">
            <span>🖌️ Drawing</span>
            <span>🎨 Painting</span>
            <span>🌈 Creative Learning</span>
          </div>
        </div>

        <form className="demo-booking-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <input
              type="text"
              name="parentName"
              placeholder="Parent Name"
              value={formData.parentName}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="childName"
              placeholder="Child Name"
              value={formData.childName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <input
              type="number"
              name="childAge"
              placeholder="Child Age"
              min="3"
              max="18"
              value={formData.childAge}
              onChange={handleChange}
              required
            />

            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <select
            name="preferredClass"
            value={formData.preferredClass}
            onChange={handleChange}
            required
          >
            <option value="">Select Preferred Class</option>
            <option value="Drawing Basics">Drawing Basics</option>
            <option value="Watercolor Painting">Watercolor Painting</option>
            <option value="Acrylic Painting">Acrylic Painting</option>
            <option value="Craft Activities">Craft Activities</option>
          </select>

          <textarea
            name="message"
            placeholder="Message"
            rows="4"
            value={formData.message}
            onChange={handleChange}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Booking..." : "Book Demo Class 🚀"}
          </button>

          {successMessage && (
            <p className="form-success">{successMessage}</p>
          )}

          {errorMessage && (
            <p className="form-error">{errorMessage}</p>
          )}
        </form>
      </div>
    </section>
  );
}

export default DemoBookingForm;