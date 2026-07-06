import React, { useEffect, useMemo, useState } from "react";
import {
  getAdminAttendance,
  saveAdminAttendance
} from "../api/attendanceApi";
import "../styles/admin-attendance.css";

function AdminAttendance({ authToken, bookings }) {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [selectedBookingId, setSelectedBookingId] = useState("");
  const [classDate, setClassDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [status, setStatus] = useState("PRESENT");
  const [note, setNote] = useState("");

  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const selectedBooking = useMemo(() => {
    return bookings.find(
      (booking) => String(booking.id) === String(selectedBookingId)
    );
  }, [bookings, selectedBookingId]);

  const filteredRecords = useMemo(() => {
    const value = searchText.trim().toLowerCase();

    return attendanceRecords.filter((record) => {
      const searchableText = [
        record.bookingId,
        record.parentName,
        record.childName,
        record.email,
        record.phone,
        record.classTitle,
        record.status,
        record.note
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = !value || searchableText.includes(value);

      const matchesStatus =
        statusFilter === "ALL" || record.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [attendanceRecords, searchText, statusFilter]);

  const loadAttendance = async () => {
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const data = await getAdminAttendance(authToken);
      setAttendanceRecords(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Unable to load attendance records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authToken) {
      loadAttendance();
    }
  }, [authToken]);

  const handleSaveAttendance = async (event) => {
    event.preventDefault();

    if (!selectedBookingId) {
      setError("Please select a student booking.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccessMessage("");

    try {
      await saveAdminAttendance(authToken, {
        bookingId: Number(selectedBookingId),
        classDate,
        status,
        note
      });

      setSuccessMessage("Attendance saved successfully.");
      setNote("");

      await loadAttendance();
    } catch (err) {
      setError(err.message || "Unable to save attendance.");
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (value) => {
    if (!value) {
      return "-";
    }

    return new Date(value).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  const getStatusClass = (value) => {
    return (value || "PRESENT").toLowerCase();
  };

  return (
    <section className="admin-attendance-section">
      <div className="admin-panel-title">
        <div>
          <h2>🗓️ Attendance Tracking</h2>
          <p>
            Mark student attendance for live classes. One record is maintained
            per student and class date.
          </p>
        </div>

        <span>{attendanceRecords.length} records</span>
      </div>

      <form className="attendance-mark-card" onSubmit={handleSaveAttendance}>
        <div className="attendance-form-grid">
          <label>
            <span>Student booking</span>
            <select
              value={selectedBookingId}
              onChange={(event) => setSelectedBookingId(event.target.value)}
              required
            >
              <option value="">Select student</option>

              {bookings.map((booking) => (
                <option value={booking.id} key={booking.id}>
                  #{booking.id} - {booking.childName} / {booking.parentName}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Class date</span>
            <input
              type="date"
              value={classDate}
              onChange={(event) => setClassDate(event.target.value)}
              required
            />
          </label>

          <label>
            <span>Status</span>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option value="PRESENT">PRESENT</option>
              <option value="ABSENT">ABSENT</option>
              <option value="LATE">LATE</option>
            </select>
          </label>
        </div>

        {selectedBooking && (
          <div className="attendance-selected-student">
            <strong>{selectedBooking.childName}</strong>
            <span>{selectedBooking.preferredClass}</span>
            <small>
              {selectedBooking.email} | {selectedBooking.phone}
            </small>
          </div>
        )}

        <textarea
          placeholder="Attendance note optional"
          value={note}
          onChange={(event) => setNote(event.target.value)}
          rows="3"
        />

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Attendance"}
        </button>
      </form>

      {error && <p className="admin-error">{error}</p>}

      {successMessage && <p className="admin-success">{successMessage}</p>}

      <div className="attendance-toolbar">
        <input
          type="text"
          placeholder="Search attendance by student, parent, email, phone, class"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          <option value="ALL">All status</option>
          <option value="PRESENT">Present</option>
          <option value="ABSENT">Absent</option>
          <option value="LATE">Late</option>
        </select>

        <button onClick={loadAttendance} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-attendance-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Booking</th>
              <th>Student</th>
              <th>Parent</th>
              <th>Class</th>
              <th>Date</th>
              <th>Status</th>
              <th>Note</th>
              <th>Email</th>
              <th>Phone</th>
            </tr>
          </thead>

          <tbody>
            {filteredRecords.length === 0 && !loading && (
              <tr>
                <td colSpan="10" className="empty-bookings">
                  No attendance records found.
                </td>
              </tr>
            )}

            {filteredRecords.map((record) => (
              <tr key={record.id}>
                <td>{record.id}</td>
                <td>#{record.bookingId}</td>
                <td>{record.childName}</td>
                <td>{record.parentName}</td>
                <td>{record.classTitle}</td>
                <td>{formatDate(record.classDate)}</td>
                <td>
                  <span
                    className={`attendance-status ${getStatusClass(
                      record.status
                    )}`}
                  >
                    {record.status}
                  </span>
                </td>
                <td>{record.note || "-"}</td>
                <td>{record.email}</td>
                <td>{record.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default AdminAttendance;