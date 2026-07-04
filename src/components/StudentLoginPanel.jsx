import React, { useState } from "react";
import { studentLogin } from "../api/studentApi";
import "../styles/student-portal.css";

function StudentLoginPanel({ onBookDemo }) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleStudentLogin = async (event) => {
    event.preventDefault();

    if (!email.trim() || !phone.trim()) {
      setError("Please enter registered email and phone.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await studentLogin(email.trim(), phone.trim());
      setStudentData(data);
    } catch (err) {
      setStudentData(null);
      setError(err.message || "Unable to login.");
    } finally {
      setLoading(false);
    }
  };

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

  if (studentData) {
    return (
      <div className="student-portal-panel">
        <div className="student-portal-welcome">
          <span>🎨 Student Portal</span>

          <h3>Hello {studentData.childName}</h3>

          <p>
            Registered under {studentData.parentName}. You can see only the live
            classes enabled for your account.
          </p>
        </div>

        <div className="student-portal-stats">
          <article>
            <strong>{studentData.registeredBookings}</strong>
            <span>Registered bookings</span>
          </article>

          <article>
            <strong>{studentData.enabledLiveClasses}</strong>
            <span>Live classes enabled</span>
          </article>
        </div>

        {studentData.liveClasses.length === 0 ? (
          <div className="student-empty-live">
            <h4>No live class enabled yet</h4>
            <p>
              Your registration is found, but admin has not enabled a live class
              link yet. Please check again later.
            </p>

            <button onClick={onBookDemo}>Book another demo</button>
          </div>
        ) : (
          <div className="student-live-list">
            {studentData.liveClasses.map((liveClass) => (
              <article className="student-live-card" key={liveClass.bookingId}>
                <div>
                  <span className="student-live-badge">Live Class</span>
                  <h4>{liveClass.preferredClass}</h4>

                  <p>
                    Student: {liveClass.childName} | Age:{" "}
                    {liveClass.childAge || "-"}
                  </p>

                  {liveClass.note && (
                    <p className="student-live-note">Note: {liveClass.note}</p>
                  )}

                  <small>Enabled on {formatDateTime(liveClass.sentAt)}</small>
                </div>

                <button onClick={() => openLiveClass(liveClass.liveLink)}>
                  Join Class
                </button>
              </article>
            ))}
          </div>
        )}

        <button
          className="student-login-again-btn"
          onClick={() => {
            setStudentData(null);
            setEmail("");
            setPhone("");
            setError("");
          }}
        >
          Login with another student
        </button>
      </div>
    );
  }

  return (
    <div className="student-login-panel">
      <h3>Student Login</h3>

      <p>
        Enter the same email and phone used during demo registration. You will
        see only your enabled live classes.
      </p>

      <form onSubmit={handleStudentLogin}>
        <input
          type="email"
          placeholder="Registered email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <input
          type="tel"
          placeholder="Registered phone"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Checking..." : "View My Classes"}
        </button>
      </form>

      {error && <p className="student-login-error">{error}</p>}
    </div>
  );
}

export default StudentLoginPanel;