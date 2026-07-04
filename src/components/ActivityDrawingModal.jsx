import React, { useEffect, useRef, useState } from "react";
import { submitActivityDrawing } from "../api/activityApi";
import "../styles/activity-drawing.css";

const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 560;

const stickers = ["⭐", "🌈", "🎨", "🖌️", "💙", "✨", "🦋", "🌸"];

function ActivityDrawingModal({ onClose }) {
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const [studentName, setStudentName] = useState("");
  const [activityTitle, setActivityTitle] = useState("My Creative Artwork");
  const [brushColor, setBrushColor] = useState("#ff3b30");
  const [brushSize, setBrushSize] = useState(8);
  const [tool, setTool] = useState("brush");
  const [selectedSticker, setSelectedSticker] = useState("⭐");

  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [history, setHistory] = useState([]);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    prepareCanvas();

    const handlePaste = (event) => {
      const items = event.clipboardData?.items || [];

      for (const item of items) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) {
            saveCanvasState();
            drawImageFile(file);
            setMessage("Image pasted on the art board. Start coloring!");
            setError("");
          }
        }
      }
    };

    window.addEventListener("paste", handlePaste);

    return () => {
      window.removeEventListener("paste", handlePaste);
    };
  }, []);

  const prepareCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    context.lineCap = "round";
    context.lineJoin = "round";
  };

  const saveCanvasState = () => {
    const canvas = canvasRef.current;
    const imageData = canvas.toDataURL("image/png");

    setHistory((previous) => {
      const updated = [...previous, imageData];
      return updated.slice(-10);
    });
  };

  const undoLastAction = () => {
    if (history.length === 0) {
      return;
    }

    const previousImage = history[history.length - 1];
    const image = new Image();

    image.onload = () => {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      context.drawImage(image, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      setHistory((previous) => previous.slice(0, -1));
    };

    image.src = previousImage;
  };

  const getCanvasPoint = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    const clientY = event.touches ? event.touches[0].clientY : event.clientY;

    return {
      x: ((clientX - rect.left) / rect.width) * CANVAS_WIDTH,
      y: ((clientY - rect.top) / rect.height) * CANVAS_HEIGHT
    };
  };

  const drawSticker = (point) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    context.font = `${brushSize * 5}px serif`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(selectedSticker, point.x, point.y);
  };

  const startDrawing = (event) => {
    event.preventDefault();

    const point = getCanvasPoint(event);
    saveCanvasState();

    if (tool === "sticker") {
      drawSticker(point);
      return;
    }

    setIsDrawing(true);
    setLastPoint(point);
  };

  const draw = (event) => {
    if (!isDrawing || !lastPoint || tool === "sticker") {
      return;
    }

    event.preventDefault();

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const currentPoint = getCanvasPoint(event);

    context.beginPath();
    context.moveTo(lastPoint.x, lastPoint.y);
    context.lineTo(currentPoint.x, currentPoint.y);

    if (tool === "eraser") {
      context.strokeStyle = "#ffffff";
      context.lineWidth = brushSize * 2;
    } else {
      context.strokeStyle = brushColor;
      context.lineWidth = brushSize;
    }

    context.stroke();
    setLastPoint(currentPoint);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    setLastPoint(null);
  };

  const drawImageFile = (file) => {
    if (!file.type.startsWith("image/")) {
      setError("Please use only image files.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const image = new Image();

      image.onload = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        const imageRatio = image.width / image.height;
        const canvasRatio = CANVAS_WIDTH / CANVAS_HEIGHT;

        let drawWidth = CANVAS_WIDTH;
        let drawHeight = CANVAS_HEIGHT;
        let offsetX = 0;
        let offsetY = 0;

        if (imageRatio > canvasRatio) {
          drawWidth = CANVAS_WIDTH;
          drawHeight = CANVAS_WIDTH / imageRatio;
          offsetY = (CANVAS_HEIGHT - drawHeight) / 2;
        } else {
          drawHeight = CANVAS_HEIGHT;
          drawWidth = CANVAS_HEIGHT * imageRatio;
          offsetX = (CANVAS_WIDTH - drawWidth) / 2;
        }

        context.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
        setError("");
      };

      image.src = reader.result;
    };

    reader.readAsDataURL(file);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    saveCanvasState();
    drawImageFile(file);
    setMessage("Photo added. Now color or draw on it!");
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);

    const file = event.dataTransfer.files[0];

    if (!file) {
      return;
    }

    saveCanvasState();
    drawImageFile(file);
    setMessage("Image dropped on the board. Start coloring!");
  };

  const clearBoard = () => {
    saveCanvasState();
    prepareCanvas();

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setMessage("");
    setError("");
  };

  const fillBackground = (color) => {
    saveCanvasState();

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    context.globalCompositeOperation = "destination-over";
    context.fillStyle = color;
    context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    context.globalCompositeOperation = "source-over";
  };

  const submitArtwork = async () => {
    if (!studentName.trim()) {
      setError("Please enter student name.");
      return;
    }

    if (!activityTitle.trim()) {
      setError("Please enter artwork title.");
      return;
    }

    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      const canvas = canvasRef.current;
      const imageData = canvas.toDataURL("image/png");

      await submitActivityDrawing({
        studentName: studentName.trim(),
        activityTitle: activityTitle.trim(),
        imageData
      });

      setMessage(
        "Artwork submitted successfully. Admin will review and post it to gallery."
      );

      setStudentName("");
      setActivityTitle("My Creative Artwork");
      setHistory([]);
      prepareCanvas();

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      setError(err.message || "Unable to submit artwork.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="activity-modal-backdrop">
      <div className="activity-modal">
        <div className="activity-modal-header">
          <div>
            <span className="activity-eyebrow">🎨 Fun Creative Board</span>
            <h2>Draw, color, upload or paste your picture</h2>
            <p>
              Drag an image here, paste with Ctrl + V, upload a photo, then make
              it colorful.
            </p>
          </div>

          <button className="activity-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="activity-layout">
          <aside className="activity-side-panel">
            <input
              type="text"
              placeholder="Student name"
              value={studentName}
              onChange={(event) => setStudentName(event.target.value)}
            />

            <input
              type="text"
              placeholder="Artwork title"
              value={activityTitle}
              onChange={(event) => setActivityTitle(event.target.value)}
            />

            <label className="upload-art-btn">
              📷 Upload Photo
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </label>

            <div className="tool-group">
              <button
                className={tool === "brush" ? "tool-active" : ""}
                onClick={() => setTool("brush")}
              >
                🖌️ Brush
              </button>

              <button
                className={tool === "eraser" ? "tool-active" : ""}
                onClick={() => setTool("eraser")}
              >
                🧽 Eraser
              </button>

              <button
                className={tool === "sticker" ? "tool-active" : ""}
                onClick={() => setTool("sticker")}
              >
                ✨ Sticker
              </button>
            </div>

            <div className="color-size-row">
              <label>
                Color
                <input
                  type="color"
                  value={brushColor}
                  onChange={(event) => setBrushColor(event.target.value)}
                />
              </label>

              <label>
                Size
                <select
                  value={brushSize}
                  onChange={(event) => setBrushSize(Number(event.target.value))}
                >
                  <option value="4">Small</option>
                  <option value="8">Medium</option>
                  <option value="14">Large</option>
                  <option value="22">Extra Large</option>
                </select>
              </label>
            </div>

            <div className="sticker-row">
              {stickers.map((sticker) => (
                <button
                  key={sticker}
                  className={selectedSticker === sticker ? "sticker-active" : ""}
                  onClick={() => {
                    setSelectedSticker(sticker);
                    setTool("sticker");
                  }}
                >
                  {sticker}
                </button>
              ))}
            </div>

            <div className="background-row">
              <button onClick={() => fillBackground("#fff6c7")}>Cream BG</button>
              <button onClick={() => fillBackground("#dff3ff")}>Blue BG</button>
            </div>

            <div className="board-actions-mini">
              <button onClick={undoLastAction}>↩ Undo</button>
              <button onClick={clearBoard}>🧹 Clear</button>
            </div>
          </aside>

          <section
            className={
              dragActive
                ? "activity-canvas-stage drag-active"
                : "activity-canvas-stage"
            }
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="activity-board-top">
              <span>Drop image here or paste with Ctrl + V</span>
            </div>

            <div className="activity-canvas-wrap">
              <canvas
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
            </div>

            {dragActive && (
              <div className="drop-overlay">
                <div>
                  <strong>Drop your image here</strong>
                  <span>Then color and decorate it 🎨</span>
                </div>
              </div>
            )}
          </section>
        </div>

        {message && <p className="activity-success">{message}</p>}
        {error && <p className="activity-error">{error}</p>}

        <div className="activity-actions">
          <button className="activity-cancel-btn" onClick={onClose}>
            Cancel
          </button>

          <button
            className="activity-submit-btn"
            onClick={submitArtwork}
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Artwork"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ActivityDrawingModal;