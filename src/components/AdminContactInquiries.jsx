import React, { useEffect, useState } from "react";
import {
  getAdminContactInquiries,
  updateContactInquiryStatus
} from "../api/contactInquiryApi";
import "../styles/contact-inquiry.css";

function AdminContactInquiries({ authToken }) {
  const [inquiries, setInquiries] = useState([]);
  const [statusMap, setStatusMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const prepareStatusMap = (inquiryList) => {
    const nextStatusMap = {};

    inquiryList.forEach((inquiry) => {
      nextStatusMap[inquiry.id] = inquiry.status || "NEW";
    });

    setStatusMap(nextStatusMap);
  };

  const loadInquiries = async () => {
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const data = await getAdminContactInquiries(authToken);
      const inquiryList = Array.isArray(data) ? data : [];

      setInquiries(inquiryList);
      prepareStatusMap(inquiryList);
    } catch (err) {
      setError(err.message || "Unable to load contact inquiries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authToken) {
      loadInquiries();
    }
  }, [authToken]);

  const handleStatusUpdate = async (inquiryId) => {
    const status = statusMap[inquiryId] || "NEW";

    setUpdatingId(inquiryId);
    setError("");
    setSuccessMessage("");

    try {
      await updateContactInquiryStatus(authToken, inquiryId, status);

      setSuccessMessage("Contact inquiry status updated.");
      await loadInquiries();
    } catch (err) {
      setError(err.message || "Unable to update inquiry status.");
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
    <section className="admin-contact-inquiries">
      <div className="admin-panel-title">
        <div>
          <h2>📩 Contact Inquiries</h2>
          <p>
            View parent messages and update inquiry status after contacting
            them.
          </p>
        </div>

        <span>{inquiries.length} inquiries</span>
      </div>

      <div className="admin-contact-actions">
        <button onClick={loadInquiries} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh Inquiries"}
        </button>
      </div>

      {error && <p className="admin-error">{error}</p>}

      {successMessage && <p className="admin-success">{successMessage}</p>}

      <div className="admin-table-wrapper">
        <table className="admin-contact-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Parent</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Message</th>
              <th>Created</th>
              <th>Status</th>
              <th>Update</th>
            </tr>
          </thead>

          <tbody>
            {inquiries.length === 0 && !loading && (
              <tr>
                <td colSpan="8" className="empty-bookings">
                  No contact inquiries found.
                </td>
              </tr>
            )}

            {inquiries.map((inquiry) => (
              <tr key={inquiry.id}>
                <td>{inquiry.id}</td>
                <td>{inquiry.parentName}</td>
                <td>{inquiry.email}</td>
                <td>{inquiry.phone}</td>
                <td>{inquiry.message}</td>
                <td>{formatDateTime(inquiry.createdAt)}</td>

                <td>
                  <select
                    className="admin-contact-status-select"
                    value={statusMap[inquiry.id] || "NEW"}
                    onChange={(event) =>
                      setStatusMap((previous) => ({
                        ...previous,
                        [inquiry.id]: event.target.value
                      }))
                    }
                  >
                    <option value="NEW">NEW</option>
                    <option value="CONTACTED">CONTACTED</option>
                    <option value="CLOSED">CLOSED</option>
                  </select>
                </td>

                <td>
                  <button
                    className="admin-contact-update-btn"
                    onClick={() => handleStatusUpdate(inquiry.id)}
                    disabled={updatingId === inquiry.id}
                  >
                    {updatingId === inquiry.id ? "Updating..." : "Update"}
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

export default AdminContactInquiries;