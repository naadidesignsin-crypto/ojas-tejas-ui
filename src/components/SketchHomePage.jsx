import React, { useRef, useState } from "react";
import logo from "../assets/ojas-logo-header.png";
import boardImage from "../assets/board-transparent.png";
import colorImage from "../assets/color-transparent.png";
import { createDemoBooking } from "../api/demoBookingApi";
import ActivityDrawingModal from "./ActivityDrawingModal.jsx";
import "../styles/sketch-home.css";

const initialForm = {
  parentName: "",
  childName: "",
  childAge: "",
  phone: "",
  email: "",
  preferredClass: "Free Trial Session",
  message: ""
};

function SketchHomePage() {
  const videoRef = useRef(null);

  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [formMessage, setFormMessage] = useState("");
  const [formError, setFormError] = useState("");
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [videoStarted, setVideoStarted] = useState(false);

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
    setFormMessage("");
    setFormError("");

    try {
      const payload = {
        ...formData,
        childAge: Number(formData.childAge),
        message: formData.message || "Free trial session request"
      };

      const result = await createDemoBooking(payload);

      setFormMessage(
        `Trial session booked successfully. Booking ID: ${result.id}`
      );

      setFormData(initialForm);
    } catch (error) {
      setFormError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const scrollTo = (id) => {
    const section = document.getElementById(id);

    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const playIntroVideo = async () => {
    if (videoRef.current) {
      await videoRef.current.play();
      setVideoStarted(true);
    }
  };

  return (
    <div className="sketch-page">
      <div className="sketch-top-strip">

        <div>
          <span>●</span>
          <span>●</span>
          <span>●</span>
        </div>
      </div>

      <header className="sketch-header">
        <button className="sketch-logo" onClick={() => scrollTo("home")}>
          <img src={logo} alt="Ojas by Tejas" />
        </button>

        <nav className="sketch-nav">
          <button onClick={() => scrollTo("home")}>Home</button>
          <button onClick={() => scrollTo("classes")}>
            Live online classes
          </button>
          <button onClick={() => scrollTo("trial")}>Free Demo</button>
          <button onClick={() => scrollTo("student-gallery")}>Gallery</button>
          <button onClick={() => scrollTo("different")}>About</button>
          <button onClick={() => scrollTo("contact")}>Contact</button>
        </nav>
      </header>

      <main>
        <section className="sketch-hero" id="home">
          <div className="trial-card" id="trial">
            <h1>Book a free Trial Session</h1>

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

              <div className="trial-row">
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

              <select
                name="preferredClass"
                value={formData.preferredClass}
                onChange={handleChange}
              >
                <option value="Free Trial Session">Free Trial Session</option>
                <option value="Live Online Art Classes">
                  Live Online Art Classes
                </option>
                <option value="Summer Art Camp">Summer Art Camp</option>
                <option value="Art Workshops">Art Workshops</option>
              </select>

              <button type="submit" disabled={loading}>
                {loading ? "Registering..." : "Register now"}
              </button>

              {formMessage && <p className="trial-success">{formMessage}</p>}
              {formError && <p className="trial-error">{formError}</p>}
            </form>

            <div className="paint-tools realistic-tools">
              <img src={colorImage} alt="Color palette and brush" />
            </div>
          </div>

          <div className="video-easel realistic-video-easel">
            <div className="real-board-wrap">
              <img
                src={boardImage}
                alt="Art board"
                className="real-board-image"
              />

              <div className="real-video-screen">
                <video
                  ref={videoRef}
                  src="/videos/client-demo.mp4"
                  className="intro-video"
                  controls={videoStarted}
                  onPlay={() => setVideoStarted(true)}
                  onPause={() => setVideoStarted(false)}
                  onEnded={() => setVideoStarted(false)}
                />

                {!videoStarted && (
                  <div className="video-overlay-real">
                    <div className="video-ribbon-real">
                      🎥 Ojas Art Class Preview
                    </div>

                    <button
                      type="button"
                      className="intro-play-button-real"
                      onClick={playIntroVideo}
                      aria-label="Play intro video"
                    >
                      ▶
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="different-section" id="different">
          <div className="section-title-wrap">
            <span>✨ Why kids love us</span>
            <h2>What makes Ojas by Tejas different?</h2>
            <p>
              We make every class playful, personal, and full of imagination.
            </p>
          </div>

          <div className="different-grid">
            <article className="difference-card">
              <div className="difference-number">01</div>
              <div className="sketch-illustration">📚 👧 🎨</div>
              <h3>Story-led teaching</h3>
              <p>
                Every drawing starts with a fun story so kids feel connected.
              </p>
            </article>

            <article className="difference-card">
              <div className="difference-number">02</div>
              <div className="sketch-illustration">👩‍🎨 🧒</div>
              <h3>Small groups</h3>
              <p>
                Personal attention helps every child learn with confidence.
              </p>
            </article>

            <article className="difference-card">
              <div className="difference-number">03</div>
              <div className="sketch-illustration">💡 🌈</div>
              <h3>Concept + creativity</h3>
              <p>
                Children learn basic concepts and then explore their own ideas.
              </p>
            </article>

            <article className="difference-card">
              <div className="difference-number">04</div>
              <div className="sketch-illustration">🎓 🖌️</div>
              <h3>Art-trained educators</h3>
              <p>
                Friendly teachers guide kids with patience and encouragement.
              </p>
            </article>
          </div>
        </section>

        <section className="programs-section" id="programs">
          <h2>Our programs</h2>

          <div className="programs-grid">
            <article className="program-card" id="classes">
              <div className="program-art">💻 🎨 🐘</div>
              <h3>Live online art classes</h3>
              <p>Fun, weekly, hour-long creative classes.</p>
              <button onClick={() => scrollTo("trial")}>
                Explore Classes
              </button>
            </article>

            <article className="program-card">
              <div className="program-art">👧 🌈 🖌️</div>
              <h3>Summer art camp</h3>
              <p>Inspiring, creative classes during break.</p>
              <button onClick={() => scrollTo("trial")}>
                View Summer Camp
              </button>
            </article>

            <article className="program-card">
              <div className="program-art">🧒 🎨 🖼️</div>
              <h3>Art workshops</h3>
              <p>Exciting themed workshops for kids.</p>
              <button onClick={() => scrollTo("trial")}>See Workshop</button>
            </article>

            <article className="program-card">
              <div className="program-art">🤝 🎨</div>
              <h3>Ojas Kaladaan</h3>
              <p>Creative giving through art activities.</p>
              <button onClick={() => setShowActivityModal(true)}>
                Open Activity
              </button>
            </article>

            <article className="program-card">
              <div className="program-art">🖼️ ⭐</div>
              <h3>Art gallery</h3>
              <p>Student artworks approved by admin.</p>
              <button onClick={() => scrollTo("student-gallery")}>
                View Gallery
              </button>
            </article>

            <article className="program-card">
              <div className="program-art">✂️ 🖍️ 📚</div>
              <h3>Creative courses</h3>
              <p>Drawing, coloring, craft, and imagination.</p>
              <button onClick={() => scrollTo("trial")}>
                Start Learning
              </button>
            </article>
          </div>
        </section>

        <section className="student-gallery-placeholder" id="student-gallery">
          <h2>Student Art Gallery</h2>
          <p>
            Drawings submitted through activities will appear here after admin
            approval.
          </p>
        </section>
      </main>

      <footer className="sketch-footer" id="contact">
        <div>
          <img src={logo} alt="Ojas by Tejas" />
          <p>Trunkful of Colors, Brushful of Dreams</p>
        </div>

        <div>
          <h4>Contact</h4>
          <p>📞 (201) 555-0123</p>
          <p>✉️ hello@ojasbytejas.com</p>
        </div>

        <div>
          <h4>Follow Us</h4>
          <p>Instagram • Facebook • YouTube</p>
        </div>
      </footer>

      {showActivityModal && (
        <ActivityDrawingModal onClose={() => setShowActivityModal(false)} />
      )}
    </div>
  );
}

export default SketchHomePage;