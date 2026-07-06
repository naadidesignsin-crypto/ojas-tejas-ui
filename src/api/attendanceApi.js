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

export async function getAdminAttendance(authToken) {
  const response = await fetch(`${API_BASE_URL}/api/admin/attendance`, {
    method: "GET",
    headers: {
      Authorization: authToken
    }
  });

  const data = await readResponse(response);

  if (!response.ok) {
    throw new Error(buildError(data, "Unable to load attendance records."));
  }

  return data;
}

export async function saveAdminAttendance(authToken, payload) {
  const response = await fetch(`${API_BASE_URL}/api/admin/attendance`, {
    method: "POST",
    headers: {
      Authorization: authToken,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const data = await readResponse(response);

  if (!response.ok) {
    throw new Error(buildError(data, "Unable to save attendance."));
  }

  return data;
}

export async function getStudentAttendance(email, phone) {
  const response = await fetch(`${API_BASE_URL}/api/student/attendance`, {
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
    throw new Error(buildError(data, "Unable to load attendance."));
  }

  return data;
}