const API_BASE =
  (import.meta.env.VITE_API_URL ||
    'https://aiproject-hee3.onrender.com/api'
  ).replace(/\/$/, '');

// -------------------- FETCH WITH TIMEOUT --------------------
function fetchWithTimeout(url, options = {}, timeout = 15000) {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), timeout)
    ),
  ]);
}

// -------------------- RESPONSE PARSER --------------------
async function parseResponse(response) {
  let data;

  try {
    data = await response.json();
  } catch {
    const text = await response.text();
    throw new Error(text || 'Server returned non-JSON response');
  }

  if (!response.ok) {
    const message =
      typeof data === 'object'
        ? Object.entries(data)
          .map(([k, v]) => `${k}: ${v}`)
          .join('\n')
        : 'Request failed';

    throw new Error(message || `HTTP ${response.status}`);
  }

  return data;
}

// =======================================================
// 1. REGISTER PARTICIPANT
// =======================================================
export async function createRegistration(formData) {
  const res = await fetchWithTimeout(`${API_BASE}/register/`, {
    method: 'POST',
    body: formData,
  });

  return parseResponse(res);
}

// =======================================================
// 2. CREATE RAZORPAY ORDER
// =======================================================
export async function createRazorpayOrder(registrationId, amount) {
  const res = await fetchWithTimeout(`${API_BASE}/payment/create-order/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      registration_id: registrationId,
      amount,
    }),
  });

  return parseResponse(res);
}

// =======================================================
// 3. VERIFY PAYMENT (IMPORTANT → DB UPDATE HAPPENS HERE)
// =======================================================
export async function verifyRazorpayPayment(payload) {
  const res = await fetchWithTimeout(`${API_BASE}/payment/verify/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return parseResponse(res);
}

// =======================================================
// 4. LOAD RAZORPAY SCRIPT
// =======================================================
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
// -------------------- GET ALL REGISTRATIONS --------------------
export async function fetchAllRegistrations() {
  const res = await fetchWithTimeout(`${API_BASE}/registrations/`);
  return parseResponse(res);
}

// -------------------- GET COMPETITIONS --------------------
export async function fetchCompetitions() {
  const res = await fetchWithTimeout(`${API_BASE}/registrations/competitions/`);
  return parseResponse(res);
}