const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://aiproject-hee3.onrender.com/api";

export async function fetchAllRegistrations() {

  const response = await fetch(
    `${API_BASE}/registrations/`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch registrations");
  }

  return response.json();
}

export async function fetchCompetitions() {

  const response = await fetch(
    `${API_BASE}/competitions/`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch competitions");
  }

  return response.json();
}

export async function createRegistration(formData) {

  const response = await fetch(
    `${API_BASE}/register/`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || "Failed to create registration"
    );
  }

  return data;
}

export async function createRazorpayOrder(
  registrationId,
  amount
) {

  const response = await fetch(
    `${API_BASE}/payment/create-order/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        registration_id: registrationId,
        amount,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || "Failed to create order"
    );
  }

  return data;
}

export async function verifyRazorpayPayment(
  payload
) {

  const response = await fetch(
    `${API_BASE}/payment/verify/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || "Payment verification failed"
    );
  }

  return data;
}

export function loadRazorpayScript() {

  return new Promise((resolve) => {

    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");

    script.src =
      "https://checkout.razorpay.com/v1/checkout.js";

    script.onload = () => resolve(true);

    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
}