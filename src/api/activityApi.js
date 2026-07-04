const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function submitActivityDrawing(payload) {
  const response = await fetch(`${API_BASE_URL}/api/activities/submissions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json();

  if (!response.ok) {
    const validationErrors = data.validationErrors
      ? Object.values(data.validationErrors).join(", ")
      : data.message;

    throw new Error(validationErrors || "Unable to submit activity");
  }

  return data;
}

export async function getApprovedActivityGallery() {
  const response = await fetch(`${API_BASE_URL}/api/gallery/activities`);

  if (!response.ok) {
    throw new Error("Unable to load approved activity gallery");
  }

  return response.json();

}