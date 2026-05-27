const API_BASE =
  (import.meta.env.VITE_API_URL ||
    'https://aiproject-hee3.onrender.com/api'
  ).replace(/\/$/, '');

// -------------------- Fetch with timeout --------------------
function fetchWithTimeout(url, options, timeout = 15000) {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), timeout)
    ),
  ]);
}

// -------------------- Response Parser --------------------
async function parseResponse(response) {
  let data = {};

  try {
    data = await response.json();
  } catch (e) {
    const text = await response.text().catch(() => '');
    throw new Error(text || 'Invalid JSON response from server');
  }

  if (!response.ok) {
    const message =
      typeof data === 'object' && data !== null
        ? Object.entries(data)
          .map(([key, value]) =>
            `${key}: ${Array.isArray(value) ? value.join(', ') : value}`
          )
          .join('\n')
        : 'Request failed';

    throw new Error(message || `HTTP ${response.status}`);
  }

  return data;
}

// -------------------- API CALLS --------------------
export async function fetchCompetitions() {
  const response = await fetchWithTimeout(
    `${API_BASE}/registrations/competitions/`
  );
  return parseResponse(response);
}

export async function fetchAllRegistrations() {
  const response = await fetchWithTimeout(
    `${API_BASE}/registrations/`
  );
  return parseResponse(response);
}

export async function createRegistration(formData) {
  const response = await fetchWithTimeout(
    `${API_BASE}/register/`,
    {
      method: 'POST',
      body: formData,
    }
  );

  return parseResponse(response);
}

export async function createRazorpayOrder(registrationId, amount) {
  const response = await fetchWithTimeout(
    `${API_BASE}/payment/create-order/`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        registration_id: registrationId,
        amount,
      }),
    }
  );

  return parseResponse(response);
}

export async function verifyRazorpayPayment(payload) {
  const response = await fetchWithTimeout(
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

export function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';

    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
}