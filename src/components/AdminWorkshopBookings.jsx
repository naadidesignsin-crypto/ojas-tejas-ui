import React, { useEffect, useState } from "react";
import {
  getAdminWorkshopBookings,
  updateWorkshopBookingStatus
} from "../api/workshopBookingApi";
import "../styles/workshop-booking.css";

function AdminWorkshopBookings({ authToken }) {
  const [bookings, setBookings] = useState([]);
  const [statusMap, setStatusMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const prepareStatusMap = (bookingList) => {
    const nextStatusMap = {};

    bookingList.forEach((booking) => {
      nextStatusMap[booking.id] = booking.status || "NEW";
    });

    setStatusMap(nextStatusMap);
  };

  const loadBookings = async () => {
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const data = await getAdminWorkshopBookings(authToken);
      const bookingList = Array.isArray(data) ? data : [];

      setBookings(bookingList);
      prepareStatusMap(bookingList);
    } catch (err) {
      setError(err.message || "Unable to load workshop bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authToken) {
      loadBookings();
    }
  }, [authToken]);

  const handleStatusUpdate = async (bookingId) => {
    const status = statusMap[bookingId] || "NEW";

    setUpdatingId(bookingId);
    setError("");
    setSuccessMessage("");

    try {
      await updateWorkshopBookingStatus(authToken, bookingId, status);

      setSuccessMessage("Workshop booking status updated.");
      await loadBookings();
    } catch (err) {
      setError(err.message || "Unable to update status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDateTime = (value) => {
    if (!value) {
      return "-";
    }

    return new Date(value).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <section className="admin-workshop-bookings">
      <div className="admin-panel-title">
        <div>
          <h2>🧑‍🎨 Workshop Bookings</h2>
          <p>
            View workshop booking requests and update status for each student.
          </p>
        </div>

        <span>{bookings.length} bookings</span>
      </div>

      <div className="admin-workshop-booking-actions">
        <button onClick={loadBookings} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh Bookings"}
        </button>
      </div>

      {error && <p className="admin-error">{error}</p>}

      {successMessage && <p className="admin-success">{successMessage}</p>}

      <div className="admin-table-wrapper">
        <table className="admin-workshop-bookings-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Workshop</th>
              <th>Date</th>
              <th>Parent</th>
              <th>Child</th>
              <th>Age</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Message</th>
              <th>Created</th>
              <th>Status</th>
              <th>Update</th>
            </tr>
          </thead>

          <tbody>
            {bookings.length === 0 && !loading && (
              <tr>
                <td colSpan="12" className="empty-bookings">
                  No workshop bookings found.
                </td>
              </tr>
            )}

            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.id}</td>
                <td>{booking.workshopTitle}</td>
                <td>{booking.selectedDateLabel}</td>
                <td>{booking.parentName}</td>
                <td>{booking.childName}</td>
                <td>{booking.childAge}</td>
                <td>{booking.phone}</td>
                <td>{booking.email}</td>
                <td>{booking.message || "-"}</td>
                <td>{formatDateTime(booking.createdAt)}</td>

                <td>
                  <select
                    className="admin-workshop-status-select"
                    value={statusMap[booking.id] || "NEW"}
                    onChange={(event) =>
                      setStatusMap((previous) => ({
                        ...previous,
                        [booking.id]: event.target.value
                      }))
                    }
                  >
                    <option value="NEW">NEW</option>
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="CANCELLED">CANCELLED</option>
                    <option value="COMPLETED">COMPLETED</option>
                  </select>
                </td>

                <td>
                  <button
                    className="admin-workshop-update-btn"
                    onClick={() => handleStatusUpdate(booking.id)}
                    disabled={updatingId === booking.id}
                  >
                    {updatingId === booking.id ? "Updating..." : "Update"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default AdminWorkshopBookings;