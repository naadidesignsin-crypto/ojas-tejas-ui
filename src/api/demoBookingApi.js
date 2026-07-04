const API_BASE_URL = "http://localhost:8080";

export async function createDemoBooking(formData) {
  const response = await fetch(`${API_BASE_URL}/api/demo-bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(formData)
  });

  const data = await response.json();

  if (!response.ok) {
    const validationErrors = data.validationErrors
      ? Object.values(data.validationErrors).join(", ")
      : data.message;

    throw new Error(validationErrors || "Demo booking failed");
  }

  return data;
}