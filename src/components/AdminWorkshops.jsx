import React, { useEffect, useState } from "react";
import {
  addWorkshopDate,
  createWorkshop,
  deleteWorkshopDate,
  getAdminWorkshops,
  publishWorkshop,
  unpublishWorkshop,
  updateWorkshop
} from "../api/workshopApi";
import "../styles/admin-workshops.css";

const emptyWorkshopForm = {
  title: "",
  description: "",
  ageGroup: "",
  level: "",
  priceLabel: "",
  imageData: ""
};

const emptyDateForm = {
  workshopDate: "",
  startTime: "",
  endTime: "",
  seats: 20,
  mode: "Online",
  meetingLink: ""
};

function AdminWorkshops({ authToken }) {
  const [workshops, setWorkshops] = useState([]);
  const [workshopForm, setWorkshopForm] = useState(emptyWorkshopForm);
  const [dateForm, setDateForm] = useState(emptyDateForm);
  const [selectedWorkshopId, setSelectedWorkshopId] = useState("");
  const [editingWorkshopId, setEditingWorkshopId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [savingWorkshop, setSavingWorkshop] = useState(false);
  const [savingDate, setSavingDate] = useState(false);
  const [actionId, setActionId] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadWorkshops();
  }, []);

  const loadWorkshops = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getAdminWorkshops(authToken);
      setWorkshops(data);

      if (!selectedWorkshopId && data.length > 0) {
        setSelectedWorkshopId(String(data[0].id));
      }
    } catch (err) {
      setError(err.message || "Unable to load workshops");
    } finally {
      setLoading(false);
    }
  };

  const handleWorkshopChange = (event) => {
    const { name, value } = event.target;

    setWorkshopForm((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  const handleDateChange = (event) => {
    const { name, value } = event.target;

    setDateForm((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      if (!file) {
        resolve("");
        return;
      }

      if (!file.type.startsWith("image/")) {
        reject(new Error("Please upload only image files"));
        return;
      }

      const reader = new FileReader();

      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("Unable to read image"));

      reader.readAsDataURL(file);
    });
  };

  const handleWorkshopImage = async (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    try {
      const imageData = await convertImageToBase64(file);

      setWorkshopForm((previous) => ({
        ...previous,
        imageData
      }));

      setMessage("Workshop image added");
      setError("");
    } catch (err) {
      setError(err.message || "Unable to upload image");
    }
  };

  const saveWorkshop = async (event) => {
    event.preventDefault();

    setSavingWorkshop(true);
    setMessage("");
    setError("");

    try {
      if (editingWorkshopId) {
        await updateWorkshop(authToken, editingWorkshopId, workshopForm);
        setMessage("Workshop updated successfully");
      } else {
        await createWorkshop(authToken, workshopForm);
        setMessage("Workshop created successfully");
      }

      setWorkshopForm(emptyWorkshopForm);
      setEditingWorkshopId(null);
      await loadWorkshops();
    } catch (err) {
      setError(err.message || "Unable to save workshop");
    } finally {
      setSavingWorkshop(false);
    }
  };

  const startEditing = (workshop) => {
    setEditingWorkshopId(workshop.id);
    setWorkshopForm({
      title: workshop.title || "",
      description: workshop.description || "",
      ageGroup: workshop.ageGroup || "",
      level: workshop.level || "",
      priceLabel: workshop.priceLabel || "",
      imageData: workshop.imageData || ""
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const cancelEditing = () => {
    setEditingWorkshopId(null);
    setWorkshopForm(emptyWorkshopForm);
  };

  const saveWorkshopDate = async (event) => {
    event.preventDefault();

    if (!selectedWorkshopId) {
      setError("Please select workshop");
      return;
    }

    setSavingDate(true);
    setMessage("");
    setError("");

    try {
      await addWorkshopDate(authToken, selectedWorkshopId, {
        ...dateForm,
        seats: Number(dateForm.seats)
      });

      setDateForm(emptyDateForm);
      setMessage("Workshop date added successfully");
      await loadWorkshops();
    } catch (err) {
      setError(err.message || "Unable to add workshop date");
    } finally {
      setSavingDate(false);
    }
  };

  const handlePublish = async (workshop) => {
    setActionId(workshop.id);
    setMessage("");
    setError("");

    try {
      if (workshop.published) {
        await unpublishWorkshop(authToken, workshop.id);
        setMessage("Workshop unpublished");
      } else {
        await publishWorkshop(authToken, workshop.id);
        setMessage("Workshop published");
      }

      await loadWorkshops();
    } catch (err) {
      setError(err.message || "Unable to update publish status");
    } finally {
      setActionId(null);
    }
  };

  const handleDeleteDate = async (dateId) => {
    const confirmDelete = window.confirm("Delete this workshop date?");

    if (!confirmDelete) {
      return;
    }

    setActionId(dateId);
    setMessage("");
    setError("");

    try {
      await deleteWorkshopDate(authToken, dateId);
      setMessage("Workshop date deleted");
      await loadWorkshops();
    } catch (err) {
      setError(err.message || "Unable to delete date");
    } finally {
      setActionId(null);
    }
  };

  return (
    <section className="admin-workshops-section">
      <div className="admin-workshops-header">
        <div>
          <span>🎨 Workshop Control</span>
          <h2>Manage workshops</h2>
          <p>
            Create workshops, add available dates, publish them, and show them
            on the public website.
          </p>
        </div>

        <button className="admin-refresh-btn" onClick={loadWorkshops}>
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {message && <p className="admin-workshop-success">{message}</p>}
      {error && <p className="admin-workshop-error">{error}</p>}

      <div className="admin-workshop-dashboard">
        <article>
          <strong>{workshops.length}</strong>
          <span>Total workshops</span>
        </article>

        <article>
          <strong>{workshops.filter((workshop) => workshop.published).length}</strong>
          <span>Published</span>
        </article>

        <article>
          <strong>
            {workshops.reduce(
              (total, workshop) => total + (workshop.dates?.length || 0),
              0
            )}
          </strong>
          <span>Total dates</span>
        </article>
      </div>

      <div className="admin-workshop-layout">
        <form className="admin-workshop-card" onSubmit={saveWorkshop}>
          <div className="admin-card-title">
            <h3>{editingWorkshopId ? "Edit workshop" : "Create workshop"}</h3>
            {editingWorkshopId && (
              <button type="button" onClick={cancelEditing}>
                Cancel Edit
              </button>
            )}
          </div>

          <input
            type="text"
            name="title"
            placeholder="Workshop title"
            value={workshopForm.title}
            onChange={handleWorkshopChange}
            required
          />

          <textarea
            name="description"
            placeholder="Workshop description"
            value={workshopForm.description}
            onChange={handleWorkshopChange}
            required
          />

          <div className="admin-workshop-two-col">
            <input
              type="text"
              name="ageGroup"
              placeholder="Age group, example: 6 to 12 years"
              value={workshopForm.ageGroup}
              onChange={handleWorkshopChange}
            />

            <input
              type="text"
              name="level"
              placeholder="Level, example: Beginner"
              value={workshopForm.level}
              onChange={handleWorkshopChange}
            />
          </div>

          <input
            type="text"
            name="priceLabel"
            placeholder="Price label, example: Free Trial / ₹499"
            value={workshopForm.priceLabel}
            onChange={handleWorkshopChange}
          />

          <label className="admin-workshop-upload">
            Upload workshop image
            <input type="file" accept="image/*" onChange={handleWorkshopImage} />
          </label>

          {workshopForm.imageData && (
            <div className="admin-workshop-preview">
              <img src={workshopForm.imageData} alt="Workshop preview" />
            </div>
          )}

          <button className="admin-primary-action" type="submit" disabled={savingWorkshop}>
            {savingWorkshop
              ? "Saving..."
              : editingWorkshopId
              ? "Update Workshop"
              : "Create Workshop"}
          </button>
        </form>

        <form className="admin-workshop-card" onSubmit={saveWorkshopDate}>
          <h3>Add workshop date</h3>

          <select
            value={selectedWorkshopId}
            onChange={(event) => setSelectedWorkshopId(event.target.value)}
            required
          >
            <option value="">Select workshop</option>
            {workshops.map((workshop) => (
              <option key={workshop.id} value={workshop.id}>
                {workshop.title}
              </option>
            ))}
          </select>

          <div className="admin-workshop-two-col">
            <input
              type="date"
              name="workshopDate"
              value={dateForm.workshopDate}
              onChange={handleDateChange}
              required
            />

            <input
              type="number"
              name="seats"
              placeholder="Seats"
              min="1"
              value={dateForm.seats}
              onChange={handleDateChange}
              required
            />
          </div>

          <div className="admin-workshop-two-col">
            <input
              type="time"
              name="startTime"
              value={dateForm.startTime}
              onChange={handleDateChange}
              required
            />

            <input
              type="time"
              name="endTime"
              value={dateForm.endTime}
              onChange={handleDateChange}
              required
            />
          </div>

          <input
            type="text"
            name="mode"
            placeholder="Mode, example: Online / Offline"
            value={dateForm.mode}
            onChange={handleDateChange}
          />

          <input
            type="text"
            name="meetingLink"
            placeholder="Meeting link, optional"
            value={dateForm.meetingLink}
            onChange={handleDateChange}
          />

          <button className="admin-primary-action" type="submit" disabled={savingDate}>
            {savingDate ? "Adding..." : "Add Date"}
          </button>
        </form>
      </div>

      <div className="admin-workshop-list">
        <h3>Workshop list</h3>

        {workshops.length === 0 && !loading && (
          <p className="admin-empty-workshops">No workshops created yet.</p>
        )}

        {workshops.map((workshop) => (
          <article className="admin-workshop-item" key={workshop.id}>
            <div className="admin-workshop-image">
              {workshop.imageData ? (
                <img src={workshop.imageData} alt={workshop.title} />
              ) : (
                <span>🎨</span>
              )}
            </div>

            <div className="admin-workshop-content">
              <div className="admin-workshop-title-row">
                <div>
                  <h4>{workshop.title}</h4>
                  <p>{workshop.description}</p>
                </div>

                <span
                  className={
                    workshop.published
                      ? "admin-status published"
                      : "admin-status draft"
                  }
                >
                  {workshop.published ? "Published" : "Draft"}
                </span>
              </div>

              <div className="admin-workshop-meta">
                {workshop.ageGroup && <span>Age: {workshop.ageGroup}</span>}
                {workshop.level && <span>Level: {workshop.level}</span>}
                {workshop.priceLabel && <span>Price: {workshop.priceLabel}</span>}
              </div>

              <div className="admin-workshop-dates">
                <strong>Dates</strong>

                {workshop.dates?.length > 0 ? (
                  workshop.dates.map((date) => (
                    <div className="admin-workshop-date-row" key={date.id}>
                      <span>
                        {date.workshopDate} | {date.startTime} - {date.endTime}
                      </span>
                      <span>{date.seats} seats</span>
                      <span>{date.mode}</span>

                      <button
                        type="button"
                        onClick={() => handleDeleteDate(date.id)}
                        disabled={actionId === date.id}
                      >
                        Delete
                      </button>
                    </div>
                  ))
                ) : (
                  <p>No dates added yet.</p>
                )}
              </div>

              <div className="admin-workshop-actions">
                <button type="button" onClick={() => startEditing(workshop)}>
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => handlePublish(workshop)}
                  disabled={actionId === workshop.id}
                >
                  {workshop.published ? "Unpublish" : "Publish"}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default AdminWorkshops;