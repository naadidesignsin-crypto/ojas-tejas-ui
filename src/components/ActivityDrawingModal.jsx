import React, { useEffect, useRef, useState } from "react";
import { submitActivityDrawing } from "../api/activityApi";
import "../styles/activity-modal.css";

function ActivityDrawingModal({ onClose }) {
  const canvasRef = useRef(null);

  const [studentName, setStudentName] = useState("");
  const [activityTitle, setActivityTitle] = useState("Fun Drawing Activity");
  const [color, setColor] = useState("#1378c9");
  const [brushSize, setBrushSize] = useState(6);
  const [isDrawing, setIsDrawing] = useState(false);
  const [mode, setMode] = useState("draw");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const getPosition = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    if (event.touches && event.touches.length > 0) {
      return {
        x: event.touches[0].clientX - rect.left,
        y: event.touches[0].clientY - rect.top
      };
    }

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  };

  const startDrawing = (event) => {
    event.preventDefault();

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const position = getPosition(event);

    ctx.beginPath();
    ctx.moveTo(position.x, position.y);

    setIsDrawing(true);
  };

  const draw = (event) => {
    if (!isDrawing) {
      return;
    }

    event.preventDefault();

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const position = getPosition(event);

    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = mode === "erase" ? "#ffffff" : color;

    ctx.lineTo(position.x, position.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const handleSubmit = async () => {
    if (!studentName.trim()) {
      setError("Please enter student name");
      return;
    }

    const canvas = canvasRef.current;
    const imageData = canvas.toDataURL("image/png");

    setLoading(true);
    setMessage("");
    setError("");

    try {
      await submitActivityDrawing({
        studentName,
        activityTitle,
        imageData
      });

      setMessage("Activity submitted successfully. Admin will review and post it to gallery.");
      setStudentName("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="activity-modal-backdrop">
      <div className="activity-modal">
        <div className="activity-modal-header">
          <div>
            <span className="activity-tag">🎨 Student Activity</span>
            <h2>Draw on the board and submit your artwork</h2>
          </div>

          <button className="activity-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="activity-note">
          <strong>📝 Activity Note:</strong> Draw a colorful house, happy sun,
          clouds, tree, or anything creative. Admin will review and publish good
          drawings in the gallery.
        </div>

        <div className="activity-form-row">
          <input
            type="text"
            placeholder="Student name"
            value={studentName}
            onChange={(event) => setStudentName(event.target.value)}
          />

          <input
            type="text"
            placeholder="Activity title"
            value={activityTitle}
            onChange={(event) => setActivityTitle(event.target.value)}
          />
        </div>

        <div className="activity-toolbar">
          <label>
            🎨 Color
            <input
              type="color"
              value={color}
              onChange={(event) => {
                setColor(event.target.value);
                setMode("draw");
              }}
            />
          </label>

          <label>
            🖌️ Size
            <input
              type="range"
              min="2"
              max="28"
              value={brushSize}
              onChange={(event) => setBrushSize(Number(event.target.value))}
            />
            <span>{brushSize}px</span>
          </label>

          <button
            className={mode === "draw" ? "tool-active" : ""}
            onClick={() => setMode("draw")}
          >
            ✏️ Draw
          </button>

          <button
            className={mode === "erase" ? "tool-active" : ""}
            onClick={() => setMode("erase")}
          >
            🧽 Eraser
          </button>

          <button onClick={clearCanvas}>🗑️ Clear</button>
        </div>

        <div className="activity-canvas-frame">
          <canvas
            ref={canvasRef}
            className="activity-canvas"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
        </div>

        {message && <p className="activity-success">{message}</p>}
        {error && <p className="activity-error">{error}</p>}

        <div className="activity-actions">
          <button onClick={onClose} className="cancel-btn">
            Close
          </button>

          <button onClick={handleSubmit} disabled={loading} className="submit-btn">
            {loading ? "Submitting..." : "Submit Artwork 🚀"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ActivityDrawingModal;