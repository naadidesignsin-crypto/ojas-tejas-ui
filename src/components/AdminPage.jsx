import React, { useEffect, useState } from "react";
import {
  createBasicAuthToken,
  getAdminBookings,
  sendLiveLink,
  getPendingActivitySubmissions,
  approveActivitySubmission
} from "../api/adminApi";
import AdminWorkshops from "./AdminWorkshops.jsx";
import "../styles/admin.css";

function AdminPage() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");

  const [bookings, setBookings] = useState([]);
  const [activitySubmissions, setActivitySubmissions] = useState([]);

  const [authToken, setAuthToken] = useState(
    localStorage.getItem("adminToken") || ""
  );

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [bookingLinks, setBookingLinks] = useState({});
  const [bookingNotes, setBookingNotes] = useState({});
  const [sendingId, setSendingId] = useState(null);

  const [approvingId, setApprovingId] = useState(null);

  const prepareBookingLinkState = (bookingList) => {
    const links = {};
    const notes = {};

    bookingList.forEach((booking) => {
      links[booking.id] = booking.liveLink || "";
      notes[booking.id] = booking.liveLinkNote || "";
    });

    setBookingLinks(links);
    setBookingNotes(notes);
  };

  const loadActivitySubmissions = async (token) => {
    const data = await getPendingActivitySubmissions(token);
    setActivitySubmissions(data);
  };

  const loadBookings = async (token) => {
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const bookingData = await getAdminBookings(token);

      setBookings(bookingData);
      prepareBookingLinkState(bookingData);

      await loadActivitySubmissions(token);

      setAuthToken(token);
      localStorage.setItem("adminToken", token);
    } catch (err) {
      setError(err.message || "Unable to load admin data");
      localStorage.removeItem("adminToken");
      setAuthToken("");
      setBookings([]);
      setActivitySubmissions([]);
      setBookingLinks({});
      setBookingNotes({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authToken) {
      loadBookings(authToken);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    const token = createBasicAuthToken(username, password);
    await loadBookings(token);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");

    setAuthToken("");
    setBookings([]);
    setActivitySubmissions([]);
    setBookingLinks({});
    setBookingNotes({});
    setPassword("");
    setError("");
    setSuccessMessage("");
  };

  const handleSendLink = async (booking) => {
    const liveLink = bookingLinks[booking.id] || "";
    const note = bookingNotes[booking.id] || "";

    if (!liveLink.trim()) {
      setError("Please enter live class link for this booking.");
      return;
    }

    setSendingId(booking.id);
    setError("");
    setSuccessMessage("");

    try {
      await sendLiveLink(
        authToken,
        booking.id,
        liveLink.trim(),
        note.trim()
      );

      setSuccessMessage(
        booking.liveLinkSent
          ? `Live link updated and sent to ${booking.parentName} at ${booking.email}`
          : `Live link sent successfully to ${booking.parentName} at ${booking.email}`
      );

      await loadBookings(authToken);
    } catch (err) {
      setError(err.message || "Unable to send live class link.");
    } finally {
      setSendingId(null);
    }
  };

  const handleApproveActivity = async (submissionId) => {
    setApprovingId(submissionId);
    setError("");
    setSuccessMessage("");

    try {
      await approveActivitySubmission(authToken, submissionId);

      setSuccessMessage("Artwork approved and posted to gallery.");

      await loadActivitySubmissions(authToken);
    } catch (err) {
      setError(err.message || "Unable to approve artwork");
    } finally {
      setApprovingId(null);
    }
  };

  const handleRefresh = async () => {
    if (authToken) {
      await loadBookings(authToken);
    }
  };

  if (!authToken) {
    return (
      <main className="admin-page">
        <div className="admin-login-card">
          <h1>🎨 Ojas Admin Login</h1>
          <p>Login to view demo bookings, artworks, and workshops.</p>

          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Admin username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />

            <input
              type="password"
              placeholder="Admin password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />

            <button type="submit" disabled={loading}>
              {loading ? "Checking..." : "Login"}
            </button>

            {error && <p className="admin-error">{error}</p>}
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <div className="admin-dashboard">
        <div className="admin-header">
          <div>
            <h1>📋 Ojas Admin Dashboard</h1>
            <p>
              Demo bookings: {bookings.length} | Pending artworks:{" "}
              {activitySubmissions.length}
            </p>
          </div>

          <div className="admin-header-actions">
            <button onClick={handleRefresh} disabled={loading}>
              {loading ? "Refreshing..." : "Refresh"}
            </button>

            <button onClick={handleLogout}>Logout</button>
          </div>
        </div>

        {loading && <p>Loading admin data...</p>}

        {error && <p className="admin-error">{error}</p>}

        {successMessage && <p className="admin-success">{successMessage}</p>}

        <div className="admin-activity-section">
          <div className="admin-section-title">
            <div>
              <h2>🎨 Student Activity Submissions</h2>
              <p>Review student drawings and post selected ones to gallery.</p>
            </div>

            <span>{activitySubmissions.length} pending</span>
          </div>

          {activitySubmissions.length === 0 && (
            <p className="empty-activity">No pending activity submissions.</p>
          )}

          <div className="activity-review-grid">
            {activitySubmissions.map((submission) => (
              <div className="activity-review-card" key={submission.id}>
                <img
                  src={submission.imageData}
                  alt={submission.activityTitle}
                />

                <div className="activity-review-content">
                  <h3>{submission.activityTitle}</h3>
                  <p>Student: {submission.studentName}</p>

                  <button
                    onClick={() => handleApproveActivity(submission.id)}
                    disabled={approvingId === submission.id}
                  >
                    {approvingId === submission.id
                      ? "Posting..."
                      : "Approve & Post to Gallery"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <AdminWorkshops authToken={authToken} />

        <div className="send-link-panel">
          <h2>📨 Demo Bookings & Live Class Links</h2>

          <p className="send-link-help">
            Add the Meet / Zoom / YouTube link for each booking. Once sent, the
            same booking row will be updated. Duplicate bookings are not created.
          </p>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-bookings-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Parent</th>
                <th>Child</th>
                <th>Age</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Class</th>
                <th>Message</th>
                <th>Live Link</th>
                <th>Note</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {bookings.length === 0 && !loading && (
                <tr>
                  <td colSpan="12" className="empty-bookings">
                    No demo bookings found.
                  </td>
                </tr>
              )}

              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.id}</td>
                  <td>{booking.parentName}</td>
                  <td>{booking.childName}</td>
                  <td>{booking.childAge}</td>
                  <td>{booking.phone}</td>
                  <td>{booking.email}</td>
                  <td>{booking.preferredClass}</td>
                  <td>{booking.message || "-"}</td>

                  <td>
                    <input
                      className="admin-row-link-input"
                      type="url"
                      placeholder="Paste Meet / Zoom link"
                      value={bookingLinks[booking.id] || ""}
                      onChange={(event) =>
                        setBookingLinks((previous) => ({
                          ...previous,
                          [booking.id]: event.target.value
                        }))
                      }
                    />
                  </td>

                  <td>
                    <input
                      className="admin-row-note-input"
                      type="text"
                      placeholder="Optional note"
                      value={bookingNotes[booking.id] || ""}
                      onChange={(event) =>
                        setBookingNotes((previous) => ({
                          ...previous,
                          [booking.id]: event.target.value
                        }))
                      }
                    />
                  </td>

                  <td>
                    {booking.liveLinkSent ? (
                      <span className="admin-link-status sent">
                        Sent
                      </span>
                    ) : (
                      <span className="admin-link-status not-sent">
                        Not sent
                      </span>
                    )}
                  </td>

                  <td>
                    <button
                      className="admin-send-row-btn"
                      onClick={() => handleSendLink(booking)}
                      disabled={sendingId === booking.id}
                    >
                      {sendingId === booking.id
                        ? "Sending..."
                        : booking.liveLinkSent
                        ? "Update Link"
                        : "Send Link"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

export default AdminPage;