import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { competitions } from '../data/competitions';

import {
  createRegistration,
  createRazorpayOrder,
  loadRazorpayScript,
  verifyRazorpayPayment,
} from '../api/client';

const AMOUNT_PAISE = {
  2: 50000,
  3: 150000,
  5: 75000,
  8: 100000,
};

function Registration() {
  const navigate = useNavigate();
  const location = useLocation();

  const preSelectedId = location.state?.competitionId;

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    bloodgroup: '',
    age: '',
    identityProof: null,
    candidatePhoto: null,
    competitionId: preSelectedId || competitions[0].id,
  });

  const selectedCompetition = competitions.find(
    (c) => c.id === Number(formData.competitionId)
  );

  useEffect(() => {
    loadRazorpayScript();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.files[0],
    });
  };

  // -----------------------------
  // RAZORPAY CHECKOUT
  // -----------------------------
  const openRazorpayCheckout = async (registration, competition) => {
    const loaded = await loadRazorpayScript();

    if (!loaded || !window.Razorpay) {
      throw new Error('Razorpay failed to load');
    }

    const order = await createRazorpayOrder(
      registration.registration_id,
      AMOUNT_PAISE[competition.id] / 100
    );

    return new Promise((resolve, reject) => {
      const options = {
        key: order.key_id,
        amount: order.amount,
        currency: order.currency,
        name: 'Competition Hub',
        description: competition.title,
        order_id: order.order_id,

        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },

        theme: { color: '#7c3aed' },

        handler: async (response) => {
          try {
            await verifyRazorpayPayment({
              registration_id: registration.registration_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount: order.amount / 100,
            });

            resolve(response);
          } catch (err) {
            reject(err);
          }
        },

        modal: {
          ondismiss: () => reject(new Error('Payment cancelled')),
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on('payment.failed', (resp) => {
        reject(new Error(resp.error?.description || 'Payment failed'));
      });

      rzp.open();
    });
  };

  // -----------------------------
  // SUBMIT HANDLER (FIXED FLOW)
  // -----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      // =========================
      // STEP 1: REGISTER USER
      // =========================
      const fd = new FormData();

      fd.append("name", formData.name);
      fd.append("email", formData.email);
      fd.append("phone", formData.phone);
      fd.append("city", formData.city);
      fd.append("bloodgroup", formData.bloodgroup);
      fd.append("age", formData.age);
      fd.append("competition_id", formData.competitionId);

      fd.append("identity_proof_file", formData.identityProof);
      fd.append("candidate_photo_file", formData.candidatePhoto);

      const reg = await createRegistration(fd);

      console.log("REGISTERED:", reg);

      if (!reg.registration_id) {
        throw new Error("Registration failed");
      }

      // =========================
      // STEP 2: CREATE ORDER
      // =========================
      const order = await createRazorpayOrder(
        reg.registration_id,
        AMOUNT_PAISE[formData.competitionId] / 100
      );

      // =========================
      // STEP 3: OPEN RAZORPAY
      // =========================
      await loadRazorpayScript();

      const options = {
        key: order.key_id,
        amount: order.amount,
        currency: order.currency,
        order_id: order.order_id,
        name: "Competition App",

        handler: async function (response) {
          // =========================
          // STEP 4: VERIFY PAYMENT
          // =========================
          await verifyRazorpayPayment({
            registration_id: reg.registration_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            amount: order.amount / 100,
          });

          // =========================
          // STEP 5: SUCCESS PAGE
          // =========================
          navigate("/success", {
            state: { registrationId: reg.registration_id },
          });
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      setError(err.message);
      alert(err.message);
    }

    setSubmitting(false);
  };
  return (
    <div className="registration-wrapper">

      <form onSubmit={handleSubmit} className="registration-form">

        <div className="form-group">
          <label>Select Competition</label>
          <select
            name="competitionId"
            value={formData.competitionId}
            onChange={handleChange}
            required
          >
            {competitions.map((comp) => (
              <option key={comp.id} value={comp.id}>
                {comp.title}
              </option>
            ))}
          </select>
        </div>

        <input name="name" placeholder="Full Name" onChange={handleChange} required />
        <input name="email" placeholder="Email" onChange={handleChange} required />
        <input name="phone" placeholder="Phone" onChange={handleChange} required />
        <input name="city" placeholder="City" onChange={handleChange} required />
        <input name="bloodgroup" placeholder="Blood Group" onChange={handleChange} required />
        <input type="number" name="age" placeholder="Age" onChange={handleChange} required />

        <input type="file" name="identityProof" onChange={handleFileChange} required />
        <input type="file" name="candidatePhoto" onChange={handleFileChange} required />

        <button type="submit" disabled={submitting}>
          {submitting ? 'Processing...' : 'Register & Pay'}
        </button>

        {error && <p style={{ color: 'red' }}>{error}</p>}

      </form>

    </div>
  );
}

export default Registration;