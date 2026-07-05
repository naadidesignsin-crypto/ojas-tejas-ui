import React, { useEffect, useState } from "react";
import { getApprovedActivityGallery } from "../api/activityApi";
import "../styles/student-gallery.css";

function StudentGallery() {
  const [artworks, setArtworks] = useState([]);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadGallery = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getApprovedActivityGallery();
      setArtworks(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Unable to load gallery");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGallery();
  }, []);

  const formatDate = (value) => {
    if (!value) {
      return "";
    }

    return new Date(value).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  return (
    <section className="real-student-gallery" id="student-gallery">
      <div className="gallery-title-wrap">
        <span>🎨 Student Creations</span>

        <h2>Student Art Gallery</h2>

        <p>
          Approved artworks submitted by our young artists through Ojas
          activities.
        </p>
      </div>

      {loading && (
        <div className="gallery-status-card">
          <p>Loading student artworks...</p>
        </div>
      )}

      {error && (
        <div className="gallery-status-card gallery-error-card">
          <p>{error}</p>
          <button onClick={loadGallery}>Try Again</button>
        </div>
      )}

      {!loading && !error && artworks.length === 0 && (
        <div className="gallery-empty-card">
          <div>🖼️</div>

          <h3>Gallery coming soon</h3>

          <p>
            Student artworks will appear here after admin approval. Try the Ojas
            Kaladaan activity and submit your drawing.
          </p>
        </div>
      )}

      {!loading && !error && artworks.length > 0 && (
        <div className="student-art-grid">
          {artworks.map((artwork) => (
            <article className="student-art-card" key={artwork.id}>
              <button
                className="student-art-image-btn"
                onClick={() => setSelectedArtwork(artwork)}
              >
                <img src={artwork.imageData} alt={artwork.activityTitle} />
              </button>

              <div className="student-art-content">
                <span>Approved Artwork</span>

                <h3>{artwork.activityTitle}</h3>

                <p>Artist: {artwork.studentName}</p>

                {(artwork.approvedAt || artwork.createdAt) && (
                  <small>
                    Posted on {formatDate(artwork.approvedAt || artwork.createdAt)}
                  </small>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      {selectedArtwork && (
        <div className="gallery-preview-backdrop">
          <div className="gallery-preview-card">
            <button
              className="gallery-preview-close"
              onClick={() => setSelectedArtwork(null)}
            >
              ✕
            </button>

            <img
              src={selectedArtwork.imageData}
              alt={selectedArtwork.activityTitle}
            />

            <div>
              <span>🎨 Student Artwork</span>
              <h3>{selectedArtwork.activityTitle}</h3>
              <p>Artist: {selectedArtwork.studentName}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default StudentGallery;