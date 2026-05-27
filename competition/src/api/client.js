const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://aiproject-hee3.onrender.com/api";


// =========================
// LOAD RAZORPAY
// =========================
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";

    script.onload = () => resolve(true);

    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
};


// =========================
// FETCH COMPETITIONS
// =========================
export const fetchCompetitions = async () => {

  const response = await fetch(
    `${API_BASE}/competitions/`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error || "Failed to fetch competitions"
    );
  }

  return data;
};

// =========================
// FETCH ALL REGISTRATIONS
// =========================
export const fetchAllRegistrations = async () => {
  const response = await fetch(
    `${API_BASE}/registrations/`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error || "Failed to fetch registrations"
    );
  }

  return data;
};


// =========================
// CREATE REGISTRATION
// =========================
export const createRegistration = async (formData) => {

  const response = await fetch(
    `${API_BASE}/register/`,
    {
      method: "POST",
      body: formData,
    }
  );

  let data;

  try {
    data = await response.json();
  } catch (err) {
    throw new Error("Invalid server response");
  }

  if (!response.ok) {
    throw new Error(
      data?.error ||
      data?.message ||
      "Registration failed"
    );
  }

  return data;
};


// =========================
// CREATE RAZORPAY ORDER
// =========================
export const createRazorpayOrder = async (
  registrationId,
  amount
) => {

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
      data?.error ||
      "Failed to create Razorpay order"
    );
  }

  return data;
};


// =========================
// VERIFY PAYMENT
// =========================
export const verifyRazorpayPayment = async (
  paymentData
) => {

  const response = await fetch(
    `${API_BASE}/payment/verify/`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(paymentData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error ||
      "Payment verification failed"
    );
  }

  return data;
};