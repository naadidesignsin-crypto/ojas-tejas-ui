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

const getLoggedStudentData = () => {
  const savedStudentData = sessionStorage.getItem("studentPortalData");

  if (!savedStudentData) {
    return null;
  }

  try {
    return JSON.parse(savedStudentData);
  } catch {
    return null;
  }
};

function WorkshopBookingModal({
  workshop,
  selectedDate,
  selectedDateLabel,
  onClose,
  onSuccess
}) {
  const loggedStudentData = getLoggedStudentData();

  const [formData, setFormData] = useState(initialBookingForm);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  const workshopTitle =
    workshop?.title ||
    workshop?.workshopTitle ||
    workshop?.name ||
    "Workshop";

  const getLoggedStudentAge = () => {
    if (loggedStudentData?.childAge) {
      return Number(loggedStudentData.childAge);
    }

    if (
      Array.isArray(loggedStudentData?.liveClasses) &&
      loggedStudentData.liveClasses.length > 0 &&
      loggedStudentData.liveClasses[0]?.childAge
    ) {
      return Number(loggedStudentData.liveClasses[0].childAge);
    }

    return null;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const buildLoggedStudentPayload = () => {
    return {
      workshopId: workshop?.id,
      workshopDateId: selectedDate?.id || null,
      workshopTitle,
      selectedDateLabel,
      parentName: loggedStudentData?.parentName || "Parent",
      childName: loggedStudentData?.childName || "Student",
      childAge: getLoggedStudentAge(),
      phone: loggedStudentData?.phone,
      email: loggedStudentData?.email,
      message: message || "Workshop booking request"
    };
  };

  const buildGuestPayload = () => {
    return {
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
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setSuccessMessage("");
    setError("");

    try {
      const payload = loggedStudentData
        ? buildLoggedStudentPayload()
        : buildGuestPayload();

      const result = await createWorkshopBooking(payload);

      if (result.alreadyBooked) {
        setSuccessMessage(
          `You are already registered for this workshop. Booking ID: ${result.id}`
        );
      } else {
        const remainingSeatText =
          result.remainingSeats !== null &&
          result.remainingSeats !== undefined
            ? ` Remaining seats: ${result.remainingSeats}`
            : "";

        setSuccessMessage(
          `Workshop booked successfully. Booking ID: ${result.id}.${remainingSeatText}`
        );
      }

      setFormData(initialBookingForm);
      setMessage("");

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

        {loggedStudentData ? (
          <form onSubmit={handleSubmit}>
            <div className="workshop-student-account-card">
              <span>✅ Logged in booking</span>

              <h3>Booking as {loggedStudentData.childName || "Student"}</h3>

              <p>
                Parent: <strong>{loggedStudentData.parentName || "-"}</strong>
              </p>

              <p>
                Email: <strong>{loggedStudentData.email || "-"}</strong>
              </p>

              <p>
                Phone: <strong>{loggedStudentData.phone || "-"}</strong>
              </p>
            </div>

            <textarea
              name="message"
              placeholder="Message optional"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              rows="3"
            />

            <button type="submit" disabled={loading}>
              {loading
                ? "Booking..."
                : `Book as ${loggedStudentData.childName || "Student"}`}
            </button>
          </form>
        ) : (
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
        )}

        {successMessage && (
          <p className="workshop-booking-success">{successMessage}</p>
        )}

        {error && <p className="workshop-booking-error">{error}</p>}
      </div>
    </div>
  );
}

export default WorkshopBookingModal;