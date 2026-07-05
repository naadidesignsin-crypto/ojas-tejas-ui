import React, { useMemo, useState } from "react";
import "../styles/admin-students.css";

function AdminStudents({ bookings }) {
  const [searchText, setSearchText] = useState("");
  const [linkFilter, setLinkFilter] = useState("ALL");

  const filteredStudents = useMemo(() => {
    const searchValue = searchText.trim().toLowerCase();

    return bookings.filter((booking) => {
      const searchableText = [
        booking.parentName,
        booking.childName,
        booking.email,
        booking.phone,
        booking.preferredClass
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !searchValue || searchableText.includes(searchValue);

      const matchesFilter =
        linkFilter === "ALL" ||
        (linkFilter === "SENT" && booking.liveLinkSent) ||
        (linkFilter === "NOT_SENT" && !booking.liveLinkSent);

      return matchesSearch && matchesFilter;
    });
  }, [bookings, searchText, linkFilter]);

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

  const openLiveLink = (link) => {
    if (link) {
      window.open(link, "_blank", "noopener,noreferrer");
    }
  };

  const escapeCsvValue = (value) => {
    if (value === null || value === undefined) {
      return "";
    }

    return `"${String(value).replaceAll('"', '""')}"`;
  };

  const exportStudentsCsv = () => {
    const headers = [
      "Booking ID",
      "Parent Name",
      "Student Name",
      "Age",
      "Phone",
      "Email",
      "Class",
      "Live Link Sent",
      "Live Link",
      "Note",
      "Created At"
    ];

    const rows = filteredStudents.map((student) => [
      student.id,
      student.parentName,
      student.childName,
      student.childAge,
      student.phone,
      student.email,
      student.preferredClass,
      student.liveLinkSent ? "YES" : "NO",
      student.liveLink || "",
      student.liveLinkNote || "",
      student.createdAt || ""
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map(escapeCsvValue).join(","))
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "ojas-students.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  const totalStudents = bookings.length;
  const linkSentCount = bookings.filter((booking) => booking.liveLinkSent).length;
  const linkPendingCount = bookings.filter(
    (booking) => !booking.liveLinkSent
  ).length;

  return (
    <section className="admin-students-section">
      <div className="admin-panel-title">
        <div>
          <h2>👧 Student Management</h2>
          <p>
            View registered students, parent details, class selection, and live
            link status.
          </p>
        </div>

        <span>{filteredStudents.length} shown</span>
      </div>

      <div className="admin-students-summary">
        <article>
          <span>👧</span>
          <strong>{totalStudents}</strong>
          <p>Total students</p>
        </article>

        <article>
          <span>🔗</span>
          <strong>{linkSentCount}</strong>
          <p>Links sent</p>
        </article>

        <article>
          <span>⏳</span>
          <strong>{linkPendingCount}</strong>
          <p>Links pending</p>
        </article>
      </div>

      <div className="admin-students-toolbar">
        <input
          type="text"
          placeholder="Search by student, parent, email, phone, or class"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
        />

        <select
          value={linkFilter}
          onChange={(event) => setLinkFilter(event.target.value)}
        >
          <option value="ALL">All students</option>
          <option value="SENT">Live link sent</option>
          <option value="NOT_SENT">Live link not sent</option>
        </select>

        <button onClick={exportStudentsCsv} disabled={filteredStudents.length === 0}>
          Export CSV
        </button>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-students-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Student</th>
              <th>Parent</th>
              <th>Age</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Class</th>
              <th>Live Link</th>
              <th>Created</th>
              <th>Open</th>
            </tr>
          </thead>

          <tbody>
            {filteredStudents.length === 0 && (
              <tr>
                <td colSpan="10" className="empty-bookings">
                  No students found.
                </td>
              </tr>
            )}

            {filteredStudents.map((student) => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>
                  <strong>{student.childName}</strong>
                </td>
                <td>{student.parentName}</td>
                <td>{student.childAge}</td>
                <td>{student.phone}</td>
                <td>{student.email}</td>
                <td>{student.preferredClass}</td>

                <td>
                  {student.liveLinkSent ? (
                    <span className="student-link-status sent">Sent</span>
                  ) : (
                    <span className="student-link-status pending">Pending</span>
                  )}
                </td>

                <td>{formatDateTime(student.createdAt)}</td>

                <td>
                  <button
                    className="student-open-link-btn"
                    onClick={() => openLiveLink(student.liveLink)}
                    disabled={!student.liveLink}
                  >
                    Open Link
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

export default AdminStudents;