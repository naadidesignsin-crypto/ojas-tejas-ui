import React, { useEffect, useState } from "react";
import { galleryItems } from "../data/siteData";
import { getApprovedActivityGallery } from "../api/activityApi";
import "../styles/gallery.css";

function Gallery() {
  const [approvedActivities, setApprovedActivities] = useState([]);
  const [galleryError, setGalleryError] = useState("");

  useEffect(() => {
    const loadApprovedActivities = async () => {
      try {
        const data = await getApprovedActivityGallery();
        setApprovedActivities(data);
      } catch {
        setGalleryError("Unable to load student artworks right now.");
      }
    };

    loadApprovedActivities();
  }, []);

  return (
    <section className="section gallery-section" id="gallery">
      <div className="section-heading">
        <h2>Gallery</h2>
        <span></span>
      </div>

      <div className="gallery-grid">
        {galleryItems.map((item) => (
          <div className="gallery-card" key={item.id}>
            <img src={item.image} alt={item.title} />
          </div>
        ))}
      </div>

      <div className="section-heading student-gallery-heading">
        <h2>Student Artworks</h2>
        <span></span>
      </div>

      {galleryError && <p className="gallery-error">{galleryError}</p>}

      {approvedActivities.length === 0 && !galleryError && (
        <p className="gallery-empty">
          No student artworks posted yet. Approved drawings will appear here.
        </p>
      )}

      {approvedActivities.length > 0 && (
        <div className="student-gallery-grid">
          {approvedActivities.map((activity) => (
            <div className="student-gallery-card" key={activity.id}>
              <img src={activity.imageData} alt={activity.activityTitle} />

              <div className="student-gallery-info">
                <h3>{activity.activityTitle}</h3>
                <p>By {activity.studentName}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Gallery;