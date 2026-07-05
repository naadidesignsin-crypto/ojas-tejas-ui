import React, { useEffect, useState } from "react";
import logo from "../assets/ojas-logo-header.png";
import "../styles/student-dashboard.css";

function StudentPortalPage() {
  const [studentData, setStudentData] = useState(null);

  useEffect(() => {
    const savedData = sessionStorage.getItem("studentPortalData");

    if (savedData) {
      setStudentData(JSON.parse(savedData));
    }
  }, []);

  const formatDateTime = (value) => {
    if (!value) {
      return "Recently updated";
    }

    return new Date(value).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const openLiveClass = (link) => {
    window.open(link, "_blank", "noopener,noreferrer");
  };

  const handleLogout = () => {
    sessionStorage.removeItem("studentPortalData");
    window.location.href = "/";
  };

  if (!studentData) {
    return (
      <main className="student-dashboard-page">
        <section className="student-dashboard-empty">
          <img src={logo} alt="Ojas by Tejas" />

          <h1>Student Portal</h1>

          <p>Please login from the home page to view your live classes.</p>

          <button onClick={() => (window.location.href = "/")}>
            Go to Home Page
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="student-dashboard-page">
      <header className="student-dashboard-header">
        <button
          className="student-dashboard-logo"
          onClick={() => (window.location.href = "/")}
        >
          <img src={logo} alt="Ojas by Tejas" />
        </button>

        <div>
          <span>Student Portal</span>
          <h1>Hello {studentData.childName}</h1>
          <p>
            Registered under {studentData.parentName}. You can see only the live
            classes enabled for your account.
          </p>
        </div>

        <button className="student-dashboard-logout" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <section className="student-dashboard-summary">
        <article>
          <span>📚</span>
          <strong>{studentData.registeredBookings}</strong>
          <p>Registered bookings</p>
        </article>

        <article>
          <span>🔴</span>
          <strong>{studentData.enabledLiveClasses}</strong>
          <p>Live classes enabled</p>
        </article>

        <article>
          <span>🎨</span>
          <strong>{studentData.childName}</strong>
          <p>Student name</p>
        </article>
      </section>

      <section className="student-dashboard-panel">
        <div className="student-dashboard-title">
          <div>
            <h2>My Live Classes</h2>
            <p>Join your enabled live class from here.</p>
          </div>

          <span>{studentData.enabledLiveClasses} enabled</span>
        </div>

        {studentData.liveClasses.length === 0 ? (
          <div className="student-dashboard-no-class">
            <h3>No live class enabled yet</h3>

            <p>
              Your registration is found, but admin has not enabled a live class
              link yet. Please check again later.
            </p>

            <button onClick={() => (window.location.href = "/#trial")}>
              Book another demo
            </button>
          </div>
        ) : (
          <div className="student-dashboard-live-grid">
            {studentData.liveClasses.map((liveClass) => (
              <article
                className="student-dashboard-live-card"
                key={liveClass.bookingId}
              >
                <div className="student-live-top">
                  <span>Live Class</span>
                  <small>Booking #{liveClass.bookingId}</small>
                </div>

                <h3>{liveClass.preferredClass}</h3>

                <p>
                  Student: {liveClass.childName} | Age:{" "}
                  {liveClass.childAge || "-"}
                </p>

                {liveClass.note && (
                  <div className="student-dashboard-note">
                    <strong>Teacher Note</strong>
                    <p>{liveClass.note}</p>
                  </div>
                )}

                <small className="student-dashboard-time">
                  Enabled on {formatDateTime(liveClass.sentAt)}
                </small>

                <button onClick={() => openLiveClass(liveClass.liveLink)}>
                  Join Class
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default StudentPortalPage;