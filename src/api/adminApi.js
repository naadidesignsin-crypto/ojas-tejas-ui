const API_BASE_URL = "http://localhost:8080";

export function createBasicAuthToken(username, password) {
  return "Basic " + btoa(`${username}:${password}`);
}

export async function getAdminBookings(authToken) {
  const response = await fetch(`${API_BASE_URL}/api/admin/demo-bookings`, {
    method: "GET",
    headers: {
      Authorization: authToken
    }
  });

  if (!response.ok) {
    throw new Error("Invalid admin login or access denied");
  }

  return response.json();
}

export async function sendLiveLink(authToken, bookingId, liveLink, note) {
  const response = await fetch(
    `${API_BASE_URL}/api/admin/demo-bookings/${bookingId}/send-live-link`,
    {
      method: "POST",
      headers: {
        Authorization: authToken,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        liveLink,
        note
      })
    }
  );

  const contentType = response.headers.get("content-type");

  let data;

  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
  } else {
    data = {
      message: await response.text()
    };
  }

  if (!response.ok) {
    const validationErrors = data.validationErrors
      ? Object.values(data.validationErrors).join(", ")
      : data.message;

    throw new Error(validationErrors || "Unable to send live link");
  }

  return data;
}

export async function getPendingActivitySubmissions(authToken) {
  const response = await fetch(
    `${API_BASE_URL}/api/admin/activity-submissions`,
    {
      method: "GET",
      headers: {
        Authorization: authToken
      }
    }
  );

  if (!response.ok) {
    throw new Error("Unable to load activity submissions");
  }

  return response.json();
}

export async function approveActivitySubmission(authToken, submissionId) {
  const response = await fetch(
    `${API_BASE_URL}/api/admin/activity-submissions/${submissionId}/approve`,
    {
      method: "PATCH",
      headers: {
        Authorization: authToken
      }
    }
  );

  if (!response.ok) {
    throw new Error("Unable to approve activity submission");
  }

  return response.json();
}