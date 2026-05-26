const API_BASE =
  import.meta.env.VITE_API_URL ||
  'https://aiproject-hee3.onrender.com/api';

async function parseResponse(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      typeof data === 'object' && data !== null
        ? Object.entries(data)
          .map(
            ([key, value]) =>
              `${key}: ${Array.isArray(value)
                ? value.join(', ')
                : value
              }`
          )
          .join('\n')
        : 'Request failed';

    throw new Error(message || `HTTP ${response.status}`);
  }

  return data;
}

// Fetch competitions
export async function fetchCompetitions() {
  const response = await fetch(
    `${API_BASE}/registrations/competitions/`
  );

  return parseResponse(response);
}

// Fetch all registrations
export async function fetchAllRegistrations() {
  const response = await fetch(
    `${API_BASE}/registrations/`
  );

  return parseResponse(response);
}

// Create registration
export async function createRegistration(formData) {
  const response = await fetch(
    `${API_BASE}/register/`,
    {
      method: 'POST',
      body: formData,
    }
  );

  return parseResponse(response);
}

// Create Razorpay order
export async function createRazorpayOrder(
  registrationId,
  amount
) {
  const response = await fetch(
    `${API_BASE}/payment/create-order/`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        registration_id: registrationId,
        amount: amount,
      }),
    }
  );

  return parseResponse(response);
}

// Verify Razorpay payment
export async function verifyRazorpayPayment(payload) {
  const response = await fetch(
    `${API_BASE}/payment/verify/`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }
  );

  return parseResponse(response);
}

// Load Razorpay Script
export function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');

    script.src =
      'https://checkout.razorpay.com/v1/checkout.js';

    script.onload = () => resolve(true);

    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
}