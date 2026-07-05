import React, { useState } from "react";
import { createWorkshopBooking } from "../api/workshopBookingApi";
import "../styles/workshop-booking.css";

const initialBookingForm = {
  parentName: "",
  childName: "",
  childAge: "",
  phone: "",
  email: "",
  message: ""
};

function WorkshopBookingModal({
  workshop,
  selectedDate,
  selectedDateLabel,
  onClose,
  onSuccess
}) {
  const [formData, setFormData] = useState(initialBookingForm);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  const workshopTitle =
    workshop?.title ||
    workshop?.workshopTitle ||
    workshop?.name ||
    "Workshop";

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
      const payload = {
        workshopId: workshop?.id,
        workshopDateId: selectedDate?.id || null,
        workshopTitle,
        selectedDateLabel,
        parentName: formData.parentName,
        childName: formData.childName,
        childAge: Number(formData.childAge),
        phone: formData.phone,
        email: formData.email,
        message: formData.message || "Workshop booking request"
      };

      const result = await createWorkshopBooking(payload);

      setSuccessMessage(
        `Workshop booked successfully. Booking ID: ${result.id}`
      );

      setFormData(initialBookingForm);

      if (onSuccess) {
        onSuccess(result);
      }
    } catch (err) {
      setError(err.message || "Unable to book workshop.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="workshop-booking-backdrop">
      <div className="workshop-booking-card">
        <button className="workshop-booking-close" onClick={onClose}>
          ✕
        </button>

        <span className="workshop-booking-badge">🧑‍🎨 Workshop Booking</span>

        <h2>Book Workshop</h2>

        <div className="workshop-booking-selected">
          <h3>{workshopTitle}</h3>
          <p>{selectedDateLabel}</p>
        </div>

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
            type="text"
            name="childName"
            placeholder="Student name"
            value={formData.childName}
            onChange={handleChange}
            required
          />

          <div className="workshop-booking-row">
            <input
              type="number"
              name="childAge"
              placeholder="Age"
              min="3"
              max="18"
              value={formData.childAge}
              onChange={handleChange}
              required
            />

            <input
              type="tel"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <textarea
            name="message"
            placeholder="Message optional"
            value={formData.message}
            onChange={handleChange}
            rows="3"
          />

          <button type="submit" disabled={loading}>
            {loading ? "Booking..." : "Confirm Booking"}
          </button>
        </form>

        {successMessage && (
          <p className="workshop-booking-success">{successMessage}</p>
        )}

        {error && <p className="workshop-booking-error">{error}</p>}
      </div>
    </div>
  );
}

export default WorkshopBookingModal;