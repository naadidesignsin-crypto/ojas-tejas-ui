import React, { useEffect, useState } from "react";
import { getPublishedWorkshops } from "../api/workshopApi";

function WorkshopDatesModal({ onClose, onBookDemo }) {
  const [workshops, setWorkshops] = useState([]);
  const [selectedWorkshopId, setSelectedWorkshopId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadWorkshops();
  }, []);

  const loadWorkshops = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getPublishedWorkshops();
      setWorkshops(data);

      if (data.length > 0) {
        setSelectedWorkshopId(data[0].id);
      }
    } catch (err) {
      setError(err.message || "Unable to load workshops");
    } finally {
      setLoading(false);
    }
  };

  const selectedWorkshop = workshops.find(
    (workshop) => workshop.id === selectedWorkshopId
  );

  const formatDate = (value) => {
    if (!value) {
      return "";
    }

    return new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  const formatTime = (value) => {
    if (!value) {
      return "";
    }

    return value.slice(0, 5);
  };

  return (
    <div className="workshop-modal-backdrop">
      <div className="workshop-modal">
        <div className="workshop-modal-header">
          <div>
            <span>🎨 Ojas Workshops</span>
            <h2>Choose your creative workshop</h2>
            <p>Select a workshop and view available dates.</p>
          </div>

          <button onClick={onClose}>✕</button>
        </div>

        {loading && <p className="workshop-modal-info">Loading workshops...</p>}
        {error && <p className="workshop-modal-error">{error}</p>}

        {!loading && workshops.length === 0 && (
          <div className="workshop-empty-state">
            <h3>No workshops published yet</h3>
            <p>Please check again soon. New creative workshops will be added by admin.</p>
          </div>
        )}

        {workshops.length > 0 && (
          <div className="workshop-modal-layout">
            <aside className="workshop-list-panel">
              {workshops.map((workshop) => (
                <button
                  key={workshop.id}
                  className={
                    selectedWorkshopId === workshop.id ? "active-workshop" : ""
                  }
                  onClick={() => setSelectedWorkshopId(workshop.id)}
                >
                  {workshop.imageData ? (
                    <img src={workshop.imageData} alt={workshop.title} />
                  ) : (
                    <span>🎨</span>
                  )}

                  <strong>{workshop.title}</strong>
                </button>
              ))}
            </aside>

            {selectedWorkshop && (
              <section className="workshop-detail-panel">
                <div className="workshop-detail-hero">
                  <div className="workshop-detail-image">
                    {selectedWorkshop.imageData ? (
                      <img
                        src={selectedWorkshop.imageData}
                        alt={selectedWorkshop.title}
                      />
                    ) : (
                      <span>🎨</span>
                    )}
                  </div>

                  <div>
                    <h3>{selectedWorkshop.title}</h3>
                    <p>{selectedWorkshop.description}</p>

                    <div className="workshop-public-meta">
                      {selectedWorkshop.ageGroup && (
                        <span>Age: {selectedWorkshop.ageGroup}</span>
                      )}

                      {selectedWorkshop.level && (
                        <span>Level: {selectedWorkshop.level}</span>
                      )}

                      {selectedWorkshop.priceLabel && (
                        <span>{selectedWorkshop.priceLabel}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="workshop-date-public-list">
                  <h4>Available dates</h4>

                  {selectedWorkshop.dates?.length > 0 ? (
                    selectedWorkshop.dates.map((date) => (
                      <article key={date.id} className="workshop-date-public-card">
                        <div>
                          <strong>{formatDate(date.workshopDate)}</strong>
                          <span>
                            {formatTime(date.startTime)} - {formatTime(date.endTime)}
                          </span>
                        </div>

                        <div>
                          <strong>{date.mode || "Online"}</strong>
                          <span>{date.seats} seats available</span>
                        </div>

                        <button onClick={onBookDemo}>Book Demo</button>
                      </article>
                    ))
                  ) : (
                    <p className="workshop-modal-info">
                      Dates will be announced soon.
                    </p>
                  )}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default WorkshopDatesModal;