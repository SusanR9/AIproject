const API_BASE = "https://aiproject-hee3.onrender.com/api";

// FETCH ALL REGISTRATIONS
export async function fetchAllRegistrations() {
  const response = await fetch(`${API_BASE}/registrations/`);

  if (!response.ok) {
    throw new Error("Failed to fetch registrations");
  }

  return await response.json();
}

// FETCH COMPETITIONS
export async function fetchCompetitions() {
  const response = await fetch(`${API_BASE}/competitions/`);

  if (!response.ok) {
    throw new Error("Failed to fetch competitions");
  }

  return await response.json();
}

// CREATE REGISTRATION
export async function createRegistration(data) {
  const response = await fetch(`${API_BASE}/registrations/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create registration");
  }

  return await response.json();
}

// CREATE RAZORPAY ORDER
export async function createRazorpayOrder(data) {
  const response = await fetch(`${API_BASE}/create-order/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create Razorpay order");
  }

  return await response.json();
}

// VERIFY PAYMENT
export async function verifyRazorpayPayment(data) {
  const response = await fetch(`${API_BASE}/verify-payment/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Payment verification failed");
  }

  return await response.json();
}

// LOAD RAZORPAY SCRIPT
export function loadRazorpayScript() {
  return new Promise((resolve) => {
    const script = document.createElement("script");

    script.src = "https://checkout.razorpay.com/v1/checkout.js";

    script.onload = () => {
      resolve(true);
    };

    script.onerror = () => {
      resolve(false);
    };

    document.body.appendChild(script);
  });
}