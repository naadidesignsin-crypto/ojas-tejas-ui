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

export async function createWorkshopBooking(payload) {
  const response = await fetch(`${API_BASE_URL}/api/workshop-bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const data = await readResponse(response);

  if (!response.ok) {
    throw new Error(buildError(data, "Unable to book workshop."));
  }

  return data;
}

export async function getAdminWorkshopBookings(authToken) {
  const response = await fetch(`${API_BASE_URL}/api/admin/workshop-bookings`, {
    method: "GET",
    headers: {
      Authorization: authToken
    }
  });

  const data = await readResponse(response);

  if (!response.ok) {
    throw new Error(buildError(data, "Unable to load workshop bookings."));
  }

  return data;
}

export async function updateWorkshopBookingStatus(authToken, bookingId, status) {
  const response = await fetch(
    `${API_BASE_URL}/api/admin/workshop-bookings/${bookingId}/status?status=${status}`,
    {
      method: "PATCH",
      headers: {
        Authorization: authToken
      }
    }
  );

  const data = await readResponse(response);

  if (!response.ok) {
    throw new Error(buildError(data, "Unable to update booking status."));
  }

  return data;
}