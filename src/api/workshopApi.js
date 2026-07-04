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

export async function getPublishedWorkshops() {
  const response = await fetch(`${API_BASE_URL}/api/workshops`, {
    method: "GET"
  });

  const data = await readResponse(response);

  if (!response.ok) {
    throw new Error(buildError(data, "Unable to load workshops"));
  }

  return data;
}

export async function getPublishedWorkshop(workshopId) {
  const response = await fetch(`${API_BASE_URL}/api/workshops/${workshopId}`, {
    method: "GET"
  });

  const data = await readResponse(response);

  if (!response.ok) {
    throw new Error(buildError(data, "Unable to load workshop"));
  }

  return data;
}

export async function getAdminWorkshops(authToken) {
  const response = await fetch(`${API_BASE_URL}/api/admin/workshops`, {
    method: "GET",
    headers: {
      Authorization: authToken
    }
  });

  const data = await readResponse(response);

  if (!response.ok) {
    throw new Error(buildError(data, "Unable to load admin workshops"));
  }

  return data;
}

export async function createWorkshop(authToken, payload) {
  const response = await fetch(`${API_BASE_URL}/api/admin/workshops`, {
    method: "POST",
    headers: {
      Authorization: authToken,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const data = await readResponse(response);

  if (!response.ok) {
    throw new Error(buildError(data, "Unable to create workshop"));
  }

  return data;
}

export async function updateWorkshop(authToken, workshopId, payload) {
  const response = await fetch(`${API_BASE_URL}/api/admin/workshops/${workshopId}`, {
    method: "PUT",
    headers: {
      Authorization: authToken,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const data = await readResponse(response);

  if (!response.ok) {
    throw new Error(buildError(data, "Unable to update workshop"));
  }

  return data;
}

export async function publishWorkshop(authToken, workshopId) {
  const response = await fetch(
    `${API_BASE_URL}/api/admin/workshops/${workshopId}/publish`,
    {
      method: "PATCH",
      headers: {
        Authorization: authToken
      }
    }
  );

  const data = await readResponse(response);

  if (!response.ok) {
    throw new Error(buildError(data, "Unable to publish workshop"));
  }

  return data;
}

export async function unpublishWorkshop(authToken, workshopId) {
  const response = await fetch(
    `${API_BASE_URL}/api/admin/workshops/${workshopId}/unpublish`,
    {
      method: "PATCH",
      headers: {
        Authorization: authToken
      }
    }
  );

  const data = await readResponse(response);

  if (!response.ok) {
    throw new Error(buildError(data, "Unable to unpublish workshop"));
  }

  return data;
}

export async function addWorkshopDate(authToken, workshopId, payload) {
  const response = await fetch(
    `${API_BASE_URL}/api/admin/workshops/${workshopId}/dates`,
    {
      method: "POST",
      headers: {
        Authorization: authToken,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    }
  );

  const data = await readResponse(response);

  if (!response.ok) {
    throw new Error(buildError(data, "Unable to add workshop date"));
  }

  return data;
}

export async function deleteWorkshopDate(authToken, dateId) {
  const response = await fetch(`${API_BASE_URL}/api/admin/workshops/dates/${dateId}`, {
    method: "DELETE",
    headers: {
      Authorization: authToken
    }
  });

  const data = await readResponse(response);

  if (!response.ok) {
    throw new Error(buildError(data, "Unable to delete workshop date"));
  }

  return data;
}