const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function readResponse(response) {
  const contentType = response.headers.get("content-type");

  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }

  return { message: await response.text() };
}

function buildError(data, fallbackMessage) {
  if (data?.validationErrors) {
    return Object.values(data.validationErrors).join(", ");
  }

  return data?.message || fallbackMessage;
}

export async function studentLogin(email, phone) {
  const response = await fetch(`${API_BASE_URL}/api/student/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email,
      phone
    })
  });

  const data = await readResponse(response);

  if (!response.ok) {
    throw new Error(
      buildError(data, "No registration found for this email and phone.")
    );
  }

  return data;
}