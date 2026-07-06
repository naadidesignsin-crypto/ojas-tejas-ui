import React, { useRef, useState } from "react";
import logo from "../assets/ojas-logo-header.png";
import logoFooter from "../assets/ojas-logo-footer.png";
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
import { studentLogin } from "../api/studentApi";
import ActivityDrawingModal from "./ActivityDrawingModal.jsx";
import WorkshopDatesModal from "./WorkshopDatesModal.jsx";
import StudentGallery from "./StudentGallery.jsx";
import TestimonialsFaq from "./TestimonialsFaq.jsx";
import WhatsAppFloatingButton from "./WhatsAppFloatingButton.jsx";
import ContactInquiryForm from "./ContactInquiryForm.jsx";
import "../styles/sketch-home.css";
import "../styles/student-portal.css";

const initialForm = {
  parentName: "",
  childName: "",
  childAge: "",
  phone: "",
  email: "",
  preferredClass: "Free Trial Session",
  message: ""
};

const getSavedStudentName = () => {
  const savedStudentData = sessionStorage.getItem("studentPortalData");

  if (!savedStudentData) {
    return "";
  }

  try {
    const parsedData = JSON.parse(savedStudentData);
    return parsedData.childName || parsedData.parentName || "Student";
  } catch {
    return "";
  }
};

const quickMenuItems = [
  {
    icon: "📘",
    label: "About Us",
    target: "different"
  },
  {
    icon: "🎨",
    label: "Courses",
    target: "programs"
  },
  {
    icon: "🖥️",
    label: "Live Classes",
    target: "classes"
  },
  {
    icon: "✂️",
    label: "Workshops",
    action: "workshops"
  },
  {
    icon: "🖼️",
    label: "Gallery",
    target: "student-gallery"
  },
  {
    icon: "🧑‍🎨",
    label: "Activities",
    action: "activity"
  },
  {
    icon: "⭐",
    label: "Why Us",
    target: "different"
  },
  {
    icon: "🧒",
    label: "For Kids",
    target: "trial"
  },
  {
    icon: "📞",
    label: "Contact Us",
    target: "contact"
  }
];

const differentItems = [
  {
    image: storyLedTeaching,
    title: "Story-led Teaching",
    text: "Every class begins with imagination, stories, and creative prompts."
  },
  {
    image: smallGroups,
    title: "Small Groups",
    text: "Personal attention helps every child feel confident and supported."
  },
  {
    image: conceptCreateColor,
    title: "Concept. Create. Color.",
    text: "Children understand ideas first, then create and color with purpose."
  },
  {
    image: artTrainedEducator,
    title: "Art-trained Educator",
    text: "Guided sessions by experienced art educators for young learners."
  },
  {
    image: liveOnlineArtClasses,
    title: "Live Online Classes",
    text: "Interactive classes that children can enjoy from home."
  },
  {
    image: artWorkshops,
    title: "Creative Workshops",
    text: "Themed art workshops for seasonal and special creative projects."
  }
];

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
  const [loginIdentity, setLoginIdentity] = useState("");
  const [loginSecret, setLoginSecret] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [studentLoggedIn, setStudentLoggedIn] = useState(
    () => !!sessionStorage.getItem("studentPortalData")
  );

  const [adminLoggedIn, setAdminLoggedIn] = useState(
    () => !!localStorage.getItem("adminToken")
  );

  const [loggedStudentName, setLoggedStudentName] = useState(
    () => getSavedStudentName()
  );

  const [portalMessage, setPortalMessage] = useState("");

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

  const handleQuickMenuClick = (item) => {
    if (item.action === "workshops") {
      setShowWorkshopModal(true);
      return;
    }

    if (item.action === "activity") {
      setShowActivityModal(true);
      return;
    }

    scrollTo(item.target);
  };

  const playIntroVideo = async () => {
    if (videoRef.current) {
      await videoRef.current.play();
      setVideoStarted(true);
    }
  };

  const openLogin = () => {
    const savedAdminToken = localStorage.getItem("adminToken");
    const savedStudentData = sessionStorage.getItem("studentPortalData");

    if (savedAdminToken) {
      window.location.href = "/admin";
      return;
    }

    if (savedStudentData) {
      window.location.href = "/student";
      return;
    }

    setShowLoginModal(true);
    setLoginError("");
  };

  const closeLogin = () => {
    setShowLoginModal(false);
    setLoginIdentity("");
    setLoginSecret("");
    setLoginError("");
    setLoginLoading(false);
  };

  const handlePortalLogout = () => {
    localStorage.removeItem("adminToken");
    sessionStorage.removeItem("studentPortalData");

    setStudentLoggedIn(false);
    setAdminLoggedIn(false);
    setLoggedStudentName("");
    setPortalMessage("Logged out successfully.");

    setShowLoginModal(false);
    setLoginIdentity("");
    setLoginSecret("");
    setLoginError("");
    setLoginLoading(false);
  };

  const handleUnifiedLogin = async (event) => {
    event.preventDefault();

    const identity = loginIdentity.trim();
    const secret = loginSecret.trim();

    if (!identity || !secret) {
      setLoginError("Please enter login details.");
      return;
    }

    setLoginLoading(true);
    setLoginError("");

    try {
      if (identity.includes("@")) {
        const data = await studentLogin(identity, secret);

        const studentName = data.childName || data.parentName || "Student";

        localStorage.removeItem("adminToken");
        sessionStorage.setItem("studentPortalData", JSON.stringify(data));

        setStudentLoggedIn(true);
        setAdminLoggedIn(false);
        setLoggedStudentName(studentName);
        setPortalMessage(
          `Login successful. Hi ${studentName}, click Dashboard to view your live classes.`
        );

        setShowLoginModal(false);
        setLoginIdentity("");
        setLoginSecret("");
        setLoginError("");

        return;
      }

      const token = createBasicAuthToken(identity, secret);

      await getAdminBookings(token);

      sessionStorage.removeItem("studentPortalData");
      localStorage.setItem("adminToken", token);

      setStudentLoggedIn(false);
      setAdminLoggedIn(true);
      setLoggedStudentName("");
      setPortalMessage("");

      window.location.href = "/admin";
    } catch (error) {
      localStorage.removeItem("adminToken");
      sessionStorage.removeItem("studentPortalData");

      setStudentLoggedIn(false);
      setAdminLoggedIn(false);
      setLoggedStudentName("");
      setPortalMessage("");

      setLoginError(
        "Login failed. Use registered student email with phone, or valid admin username with password."
      );
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <div className="sketch-page">
      <div className="sketch-top-strip">
        <span>🎨 Trunkful of Colors, Brushful of Dreams</span>

        <div className="sketch-top-right">
          {studentLoggedIn && loggedStudentName && (
            <span className="student-login-chip">
              Logged in as {loggedStudentName}
            </span>
          )}

          {adminLoggedIn && !studentLoggedIn && (
            <span className="student-login-chip">Logged in as Admin</span>
          )}

          {(studentLoggedIn || adminLoggedIn) && (
            <button
              type="button"
              className="top-logout-btn"
              onClick={handlePortalLogout}
            >
              Logout
            </button>
          )}
        </div>
      </div>

      <header className="sketch-header paper-header">
        <button className="sketch-logo" onClick={() => scrollTo("home")}>
          <img src={logo} alt="Ojas by Tejas" />
        </button>

        <nav className="sketch-nav">
          <button onClick={() => scrollTo("home")}>Home</button>

          <button onClick={() => scrollTo("classes")}>
            Live Online Classes
          </button>

          <button onClick={() => scrollTo("trial")}>Free Demo</button>

          <button onClick={() => scrollTo("student-gallery")}>Gallery</button>

          <button onClick={() => scrollTo("different")}>About</button>

          <button onClick={() => scrollTo("contact")}>Contact</button>

          {!studentLoggedIn && !adminLoggedIn && (
            <>
              <button
                className="demo-nav-btn"
                onClick={() => scrollTo("trial")}
              >
                Book Demo Class
              </button>

              <button className="admin-nav-btn" onClick={openLogin}>
                Login
              </button>
            </>
          )}
        </nav>
      </header>

      <main>
        <section className="sketch-hero paper-hero" id="home">
          <div className="trial-card paper-trial-card" id="trial">
            <div className="hero-title-wrap">
              <span className="hero-pencil-label">
                Creative Online Art Classes
              </span>

              <h1>
                <span>
                  {studentLoggedIn
                    ? "Student Dashboard Access"
                    : adminLoggedIn
                    ? "Admin Dashboard Access"
                    : "Where Imagination Meets Creation!"}
                </span>
              </h1>

              {!studentLoggedIn && !adminLoggedIn && (
                <p className="hero-sub-copy">
                  Creative art classes that inspire, build skills, and bring out
                  the artist in every child.
                </p>
              )}

              <div className="hero-art-burst" aria-hidden="true">
                <span className="art-float art-float-1">🎨</span>
                <span className="art-float art-float-2">🖌️</span>
                <span className="art-float art-float-3">⭐</span>
                <span className="art-float art-float-4">💙</span>
                <span className="art-float art-float-5">✨</span>
              </div>
            </div>

            {studentLoggedIn ? (
              <div className="student-logged-card">
                <span className="student-logged-badge">✅ Logged in</span>

                <h2>Hi {loggedStudentName || "Student"}</h2>

                <p>
                  You are already logged in. Open your dashboard to view live
                  classes, enabled links, and student details.
                </p>

                {portalMessage && (
                  <p className="trial-success">{portalMessage}</p>
                )}

                <div className="student-logged-actions">
                  <button
                    type="button"
                    onClick={() => (window.location.href = "/student")}
                  >
                    Open Dashboard
                  </button>

                  <button
                    type="button"
                    className="student-logout-inline"
                    onClick={handlePortalLogout}
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : adminLoggedIn ? (
              <div className="student-logged-card">
                <span className="student-logged-badge">
                  🔐 Admin logged in
                </span>

                <h2>Admin Portal</h2>

                <p>
                  You are logged in as admin. Open the dashboard to manage
                  students, workshops, bookings, artworks, and inquiries.
                </p>

                <div className="student-logged-actions">
                  <button
                    type="button"
                    onClick={() => (window.location.href = "/admin")}
                  >
                    Open Admin Dashboard
                  </button>

                  <button
                    type="button"
                    className="student-logout-inline"
                    onClick={handlePortalLogout}
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <>
                {portalMessage && (
                  <p className="trial-success">{portalMessage}</p>
                )}

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
                    <option value="Free Trial Session">
                      Free Trial Session
                    </option>

                    <option value="Live Online Art Classes">
                      Live Online Art Classes
                    </option>

                    <option value="Summer Art Camp">Summer Art Camp</option>

                    <option value="Art Workshops">Art Workshops</option>
                  </select>

                  <button type="submit" disabled={loading}>
                    {loading ? "Registering..." : "Book Your Demo Class"}
                  </button>

                  {formMessage && (
                    <p className="trial-success">{formMessage}</p>
                  )}
                  {formError && <p className="trial-error">{formError}</p>}
                </form>
              </>
            )}

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

        <section className="art-quick-menu-section">
          <div className="art-quick-menu">
            {quickMenuItems.map((item) => (
              <button
                type="button"
                className="art-quick-item"
                key={item.label}
                onClick={() => handleQuickMenuClick(item)}
              >
                <span>{item.icon}</span>
                <strong>{item.label}</strong>
              </button>
            ))}
          </div>
        </section>

        <section className="different-section why-tear-section" id="different">
          <div className="why-tear-panel">
            <div className="section-title-wrap client-different-title why-tear-title">
              <span className="section-pencil-label">Why Choose Us?</span>

              <h2>Why Choose Ojas by Tejas?</h2>

              <p>
                A playful, supportive, and skill-building art space for children.
              </p>
            </div>

            <div className="difference-marquee why-tear-marquee">
              <div className="difference-marquee-track why-tear-track">
                {[...differentItems, ...differentItems].map((item, index) => (
                  <article className="why-tear-card" key={index}>
                    <img src={item.image} alt={item.title} />

                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.text}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          className="programs-section client-programs-section paper-programs"
          id="programs"
        >
          <span className="section-pencil-label">Creative Learning Paths</span>

          <h2>Our Popular Programs</h2>

          <div className="client-programs-grid">
            <article className="client-program-card" id="classes">
              <img src={liveOnlineArtClasses} alt="Live online art classes" />
              <h3>Live Online Art Classes</h3>
              <p>Fun, weekly, hour-long creative classes.</p>

              <button onClick={() => scrollTo("trial")}>
                Explore Classes
              </button>
            </article>

            <article className="client-program-card">
              <img src={summerArtCamp} alt="Summer art camp" />
              <h3>Summer Art Camp</h3>
              <p>Inspiring, creative classes during break.</p>

              <button onClick={() => scrollTo("trial")}>
                View Summer Camp
              </button>
            </article>

            <article className="client-program-card">
              <img src={artWorkshops} alt="Art workshops" />
              <h3>Art Workshops</h3>
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
              <h3>Art Gallery</h3>
              <p>Student artworks approved by admin.</p>

              <button onClick={() => scrollTo("student-gallery")}>
                View Gallery
              </button>
            </article>

            <article className="client-program-card">
              <img src={creativeCourses} alt="Creative courses" />
              <h3>Creative Courses</h3>
              <p>Drawing, coloring, craft, and imagination.</p>

              <button onClick={() => scrollTo("trial")}>
                Start Learning
              </button>
            </article>
          </div>
        </section>

        <StudentGallery />

        <TestimonialsFaq onBookDemo={() => scrollTo("trial")} />

        <ContactInquiryForm onBookDemo={() => scrollTo("trial")} />
      </main>

      <footer className="sketch-footer paper-footer">
        <div>
          <img src={logoFooter} alt="Ojas by Tejas" />
          <p>Trunkful of Colors, Brushful of Dreams</p>
        </div>

        <div>
          <h4>Quick Links</h4>
          <p>Home • Live Online Classes • Free Demo</p>
          <p>Gallery • Workshops • Contact</p>
        </div>

        <div>
          <h4>Contact</h4>
          <p>📞 (201) 555-0123</p>
          <p>✉️ hello@ojasbytejas.com</p>
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
          <div className="landing-login-card landing-login-card-wide">
            <button className="landing-login-close" onClick={closeLogin}>
              ✕
            </button>

            <span className="landing-login-badge">🔐 Portal Access</span>

            <h2>Login</h2>

            <p>
              Students can login using registered email and phone. Admin can
              login using username and password.
            </p>

            <div className="unified-login-panel">
              <form
                onSubmit={handleUnifiedLogin}
                className="unified-login-form"
              >
                <input
                  type="text"
                  placeholder="Email or admin username"
                  value={loginIdentity}
                  onChange={(event) => setLoginIdentity(event.target.value)}
                />

                <input
                  type="password"
                  placeholder="Phone or password"
                  value={loginSecret}
                  onChange={(event) => setLoginSecret(event.target.value)}
                />

                <button type="submit" disabled={loginLoading}>
                  {loginLoading ? "Checking..." : "Login"}
                </button>
              </form>

              {loginError && (
                <p className="landing-login-error">{loginError}</p>
              )}
            </div>
          </div>
        </div>
      )}

      <WhatsAppFloatingButton />
    </div>
  );
}

export default SketchHomePage;