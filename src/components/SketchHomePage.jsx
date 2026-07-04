import React, { useRef, useState } from "react";
import logo from "../assets/ojas-logo-header.png";
import boardImage from "../assets/board-transparent.png";
import colorImage from "../assets/color-transparent.png";
import storyLedTeaching from "../assets/different/story-led-teaching.png";
import smallGroups from "../assets/different/small-groups.png";
import conceptCreateColor from "../assets/different/concept-create.png";
import artTrainedEducator from "../assets/different/art-trained-educator.png";
import liveOnlineArtClasses from "../assets/programs/live-online-art-classes.png";
import summerArtCamp from "../assets/programs/summer-art-camp.png";
import artWorkshops from "../assets/programs/art-workshops.png";
import ojasKaladaan from "../assets/programs/ojas-kaladaan.png";
import artGallery from "../assets/programs/art-gallery.png";
import creativeCourses from "../assets/programs/creative-courses.png";
import { createDemoBooking } from "../api/demoBookingApi";
import { createBasicAuthToken, getAdminBookings } from "../api/adminApi";
import ActivityDrawingModal from "./ActivityDrawingModal.jsx";
import WorkshopDatesModal from "./WorkshopDatesModal.jsx";
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
  const [showWorkshopModal, setShowWorkshopModal] = useState(false);
  const [videoStarted, setVideoStarted] = useState(false);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [adminUsername, setAdminUsername] = useState("admin");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminLoginError, setAdminLoginError] = useState("");
  const [adminLoginLoading, setAdminLoginLoading] = useState(false);

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

  const openLogin = () => {
    const savedToken = localStorage.getItem("adminToken");

    if (savedToken) {
      window.location.href = "/admin";
      return;
    }

    setShowLoginModal(true);
    setAdminLoginError("");
  };

  const closeLogin = () => {
    setShowLoginModal(false);
    setAdminPassword("");
    setAdminLoginError("");
    setAdminLoginLoading(false);
  };

  const handleAdminLogin = async (event) => {
    event.preventDefault();

    if (!adminUsername.trim() || !adminPassword.trim()) {
      setAdminLoginError("Please enter admin username and password.");
      return;
    }

    setAdminLoginLoading(true);
    setAdminLoginError("");

    try {
      const token = createBasicAuthToken(
        adminUsername.trim(),
        adminPassword.trim()
      );

      await getAdminBookings(token);

      localStorage.setItem("adminToken", token);
      window.location.href = "/admin";
    } catch (error) {
      localStorage.removeItem("adminToken");
      setAdminLoginError("Invalid admin credentials. You are still on Home Page.");
    } finally {
      setAdminLoginLoading(false);
    }
  };

  return (
    <div className="sketch-page">
      <div className="sketch-top-strip">
        <span>🎨 Trunkful of Colors, Brushful of Dreams</span>

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

          <button onClick={() => scrollTo("student-gallery")}>
            Gallery
          </button>

          <button onClick={() => scrollTo("different")}>About</button>

          <button onClick={() => scrollTo("contact")}>Contact</button>

          <button className="admin-nav-btn" onClick={openLogin}>
            Login
          </button>
        </nav>
      </header>

      <main>
        <section className="sketch-hero" id="home">
          <div className="trial-card" id="trial">
            <div className="hero-title-wrap">
              <h1>
                <span>Book a free Trial Session</span>
              </h1>

              <div className="hero-art-burst" aria-hidden="true">
                <span className="art-float art-float-1">🎨</span>
                <span className="art-float art-float-2">🖌️</span>
                <span className="art-float art-float-3">⭐</span>
                <span className="art-float art-float-4">💙</span>
                <span className="art-float art-float-5">✨</span>
              </div>
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
          <div className="section-title-wrap client-different-title">
            <h2>What makes Ojasbytejas different from?</h2>
          </div>

          <div className="client-different-grid">
            <article className="client-difference-card">
              <img src={storyLedTeaching} alt="Story-led teaching" />
              <h3>Story-led teaching</h3>
            </article>

            <article className="client-difference-card">
              <img src={smallGroups} alt="Small groups" />
              <h3>small groups</h3>
            </article>

            <article className="client-difference-card">
              <img src={conceptCreateColor} alt="Concept create color" />
              <h3>Concept. create. Color</h3>
            </article>

            <article className="client-difference-card">
              <img src={artTrainedEducator} alt="Art trained educator" />
              <h3>Art trained educator</h3>
            </article>
          </div>
        </section>

        <section
          className="programs-section client-programs-section"
          id="programs"
        >
          <h2>Our programs</h2>

          <div className="client-programs-grid">
            <article className="client-program-card" id="classes">
              <img src={liveOnlineArtClasses} alt="Live online art classes" />
              <h3>Live online art classes</h3>
              <p>Fun, weekly, hour-long creative classes.</p>

              <button onClick={() => scrollTo("trial")}>
                Explore Classes
              </button>
            </article>

            <article className="client-program-card">
              <img src={summerArtCamp} alt="Summer art camp" />
              <h3>Summer art camp</h3>
              <p>Inspiring, creative classes during break.</p>

              <button onClick={() => scrollTo("trial")}>
                View Summer Camp
              </button>
            </article>

            <article className="client-program-card">
              <img src={artWorkshops} alt="Art workshops" />
              <h3>Art workshops</h3>
              <p>Exciting themed workshops for kids.</p>

              <button onClick={() => setShowWorkshopModal(true)}>
                See Workshop
              </button>
            </article>

            <article className="client-program-card">
              <img src={ojasKaladaan} alt="Ojas Kaladaan" />
              <h3>Ojas Kaladaan</h3>
              <p>Creative giving through art activities.</p>

              <button onClick={() => setShowActivityModal(true)}>
                Open Activity
              </button>
            </article>

            <article className="client-program-card">
              <img src={artGallery} alt="Art gallery" />
              <h3>Art gallery</h3>
              <p>Student artworks approved by admin.</p>

              <button onClick={() => scrollTo("student-gallery")}>
                View Gallery
              </button>
            </article>

            <article className="client-program-card">
              <img src={creativeCourses} alt="Creative courses" />
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

      {showWorkshopModal && (
        <WorkshopDatesModal
          onClose={() => setShowWorkshopModal(false)}
          onBookDemo={() => {
            setShowWorkshopModal(false);
            scrollTo("trial");
          }}
        />
      )}

      {showLoginModal && (
        <div className="landing-login-backdrop">
          <div className="landing-login-card">
            <button className="landing-login-close" onClick={closeLogin}>
              ✕
            </button>

            <span className="landing-login-badge">🔐 Admin Access</span>

            <h2>Login</h2>

            <p>
              Enter admin credentials to open the Admin Portal. Invalid users
              will remain on the Home Page.
            </p>

            <form onSubmit={handleAdminLogin}>
              <input
                type="text"
                placeholder="Admin username"
                value={adminUsername}
                onChange={(event) => setAdminUsername(event.target.value)}
              />

              <input
                type="password"
                placeholder="Admin password"
                value={adminPassword}
                onChange={(event) => setAdminPassword(event.target.value)}
              />

              <button type="submit" disabled={adminLoginLoading}>
                {adminLoginLoading ? "Checking..." : "Login"}
              </button>
            </form>

            {adminLoginError && (
              <p className="landing-login-error">{adminLoginError}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SketchHomePage;