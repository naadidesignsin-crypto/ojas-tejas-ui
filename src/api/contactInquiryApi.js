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

export async function createContactInquiry(payload) {
  const response = await fetch(`${API_BASE_URL}/api/contact-inquiries`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const data = await readResponse(response);

  if (!response.ok) {
    throw new Error(buildError(data, "Unable to submit contact inquiry."));
  }

  return data;
}

export async function getAdminContactInquiries(authToken) {
  const response = await fetch(`${API_BASE_URL}/api/admin/contact-inquiries`, {
    method: "GET",
    headers: {
      Authorization: authToken
    }
  });

  const data = await readResponse(response);

  if (!response.ok) {
    throw new Error(buildError(data, "Unable to load contact inquiries."));
  }

  return data;
}

export async function updateContactInquiryStatus(authToken, inquiryId, status) {
  const response = await fetch(
    `${API_BASE_URL}/api/admin/contact-inquiries/${inquiryId}/status?status=${status}`,
    {
      method: "PATCH",
      headers: {
        Authorization: authToken
      }
    }
  );

  const data = await readResponse(response);

  if (!response.ok) {
    throw new Error(buildError(data, "Unable to update inquiry status."));
  }

  return data;
}