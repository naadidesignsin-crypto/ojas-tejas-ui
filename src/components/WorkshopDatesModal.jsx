import React, { useEffect, useState } from "react";
import { getPublishedWorkshops } from "../api/workshopApi";
import WorkshopBookingModal from "./WorkshopBookingModal.jsx";
import "../styles/workshop-booking.css";

function WorkshopDatesModal({ onClose, onBookDemo }) {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDateLabel, setSelectedDateLabel] = useState("");
  const [bookingSuccessMessage, setBookingSuccessMessage] = useState("");

  const loadWorkshops = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getPublishedWorkshops();
      setWorkshops(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Unable to load workshops.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkshops();
  }, []);

  const getWorkshopTitle = (workshop) => {
    return (
      workshop.title ||
      workshop.workshopTitle ||
      workshop.name ||
      "Art Workshop"
    );
  };

  const getWorkshopDescription = (workshop) => {
    return (
      workshop.description ||
      workshop.shortDescription ||
      "Creative art workshop for young artists."
    );
  };

  const getWorkshopDates = (workshop) => {
    if (Array.isArray(workshop.dates)) {
      return workshop.dates;
    }

    if (Array.isArray(workshop.workshopDates)) {
      return workshop.workshopDates;
    }

    if (Array.isArray(workshop.availableDates)) {
      return workshop.availableDates;
    }

    return [];
  };

  const formatDateTime = (value) => {
    if (!value) {
      return "";
    }

    return new Date(value).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getDateLabel = (date) => {
    if (!date) {
      return "Workshop date";
    }

    if (date.dateLabel) {
      return date.dateLabel;
    }

    if (date.label) {
      return date.label;
    }

    if (date.title) {
      return date.title;
    }

    if (date.startDateTime) {
      return formatDateTime(date.startDateTime);
    }

    if (date.workshopDate) {
      return date.workshopDate;
    }

    if (date.date) {
      return date.date;
    }

    return "Workshop date";
  };

  const handleBookWorkshop = (workshop, date) => {
    setSelectedWorkshop(workshop);
    setSelectedDate(date);
    setSelectedDateLabel(getDateLabel(date));
    setBookingSuccessMessage("");
  };

  const closeBookingModal = () => {
    setSelectedWorkshop(null);
    setSelectedDate(null);
    setSelectedDateLabel("");
  };

  return (
    <div className="workshop-dates-backdrop">
      <div className="workshop-dates-card">
        <button className="workshop-dates-close" onClick={onClose}>
          ✕
        </button>

        <span className="workshop-dates-badge">🧑‍🎨 Ojas Workshops</span>

        <h2>Upcoming Art Workshops</h2>

        <p className="workshop-dates-subtitle">
          Select a workshop date and book your child&apos;s seat.
        </p>

        {loading && (
          <div className="workshop-dates-status">
            <p>Loading workshops...</p>
          </div>
        )}

        {error && (
          <div className="workshop-dates-status workshop-dates-error">
            <p>{error}</p>
            <button onClick={loadWorkshops}>Try Again</button>
          </div>
        )}

        {bookingSuccessMessage && (
          <p className="workshop-dates-success">{bookingSuccessMessage}</p>
        )}

        {!loading && !error && workshops.length === 0 && (
          <div className="workshop-dates-empty">
            <h3>No workshops published yet</h3>

            <p>
              New workshop dates will appear here once admin publishes them.
            </p>

            {onBookDemo && (
              <button onClick={onBookDemo}>Book Free Demo</button>
            )}
          </div>
        )}

        {!loading && !error && workshops.length > 0 && (
          <div className="workshop-list">
            {workshops.map((workshop) => {
              const dates = getWorkshopDates(workshop);

              return (
                <article className="workshop-item" key={workshop.id}>
                  <div className="workshop-item-main">
                    <h3>{getWorkshopTitle(workshop)}</h3>

                    <p>{getWorkshopDescription(workshop)}</p>

                    {workshop.price && (
                      <span className="workshop-price">
                        Fee: {workshop.price}
                      </span>
                    )}
                  </div>

                  {dates.length === 0 ? (
                    <div className="workshop-no-dates">
                      Dates will be announced soon.
                    </div>
                  ) : (
                    <div className="workshop-date-list">
                      {dates.map((date) => (
                        <div className="workshop-date-row" key={date.id}>
                          <div>
                            <strong>{getDateLabel(date)}</strong>

                            {date.seats && (
                              <small>{date.seats} seats available</small>
                            )}

                            {date.availableSeats && (
                              <small>
                                {date.availableSeats} seats available
                              </small>
                            )}
                          </div>

                          <button
                            onClick={() => handleBookWorkshop(workshop, date)}
                          >
                            Book Workshop
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>

      {selectedWorkshop && selectedDate && (
        <WorkshopBookingModal
          workshop={selectedWorkshop}
          selectedDate={selectedDate}
          selectedDateLabel={selectedDateLabel}
          onClose={closeBookingModal}
          onSuccess={(result) => {
            setBookingSuccessMessage(
              `Workshop booking completed. Booking ID: ${result.id}`
            );
            closeBookingModal();
          }}
        />
      )}
    </div>
  );
}

export default WorkshopDatesModal;