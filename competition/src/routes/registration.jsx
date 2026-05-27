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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.files[0] });
  };

  const openRazorpayCheckout = async (registration, competition) => {
    const loaded = await loadRazorpayScript();
    if (!loaded || !window.Razorpay) {
      throw new Error('Razorpay failed to load. Check your internet connection.');
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
              amount: order.amount / 100
            });
            resolve(response);
          } catch (err) {
            reject(err);
          }
        },
        modal: {
          ondismiss: () => reject(new Error('Payment cancelled.')),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (resp) => {
        reject(new Error(resp.error?.description || 'Payment failed.'));
      });
      rzp.open();
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const fd = new FormData();

      // normal fields
      fd.append("name", formData.name);
      fd.append("email", formData.email);
      fd.append("phone", formData.phone);
      fd.append("city", formData.city);
      fd.append("bloodgroup", formData.bloodgroup);
      fd.append("age", formData.age);
      fd.append("competition_id", formData.competitionId);

      // file fields (VERY IMPORTANT)
      fd.append("identity_proof_file", formData.identityProof);
      fd.append("candidate_photo_file", formData.candidatePhoto);

      const res = await createRegistration(fd);

      console.log("Registration Response:", res);

      if (!res.registration_id) {
        throw new Error("No registration_id received");
      }

      // OPTIONAL BUT CORRECT FLOW:
      await openRazorpayCheckout(res, selectedCompetition);

      navigate("/success", {
        state: {
          registrationId: res.registration_id,
        },
      });

    } catch (err) {
      console.error("ERROR:", err);
      setError(err.message);
      alert(err.message);
    }

    setSubmitting(false);
  };

  <form onSubmit={handleSubmit} className="registration-form">
    <div className="form-group">
      <label htmlFor="competitionId">Select Competition</label>
      <select
        id="competitionId"
        name="competitionId"
        value={formData.competitionId}
        onChange={handleChange}
        required
      >
        {competitions.map((comp) => (
          <option key={comp.id} value={comp.id}>
            {comp.title} ({comp.type === 'free' ? 'Free' : `Paid - ${comp.price}`})
          </option>
        ))}
      </select>
    </div>

    <div className="form-group">
      <label htmlFor="name">Full Name</label>
      <input
        type="text"
        id="name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="First and last name"
        required
      />
    </div>

    <div className="form-group">
      <label htmlFor="email">Email Address</label>
      <input
        type="email"
        id="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
      />
    </div>

    <div className="form-group">
      <label htmlFor="phone">Phone Number</label>
      <input
        type="tel"
        id="phone"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        maxLength={12}
        required
      />
    </div>

    <div className="form-group">
      <label htmlFor="city">City / Address</label>
      <input
        type="text"
        id="city"
        name="city"
        value={formData.city}
        onChange={handleChange}
        required
      />
    </div>

    <div className="form-group">
      <label htmlFor="bloodgroup">Blood Group</label>
      <input
        type="text"
        id="bloodgroup"
        name="bloodgroup"
        value={formData.bloodgroup}
        onChange={handleChange}
        placeholder="e.g. O+, B+"
        required
      />
    </div>

    <div className="form-group">
      <label htmlFor="age">Age</label>
      <input
        type="number"
        id="age"
        name="age"
        value={formData.age}
        onChange={handleChange}
        min={1}
        max={120}
        required
      />
    </div>

    <div className="form-group">
      <label htmlFor="identityProof">Identity Proof (Image)</label>
      <input
        type="file"
        id="identityProof"
        name="identityProof"
        accept="image/*"
        onChange={handleFileChange}
        required
      />
    </div>

    <div className="form-group">
      <label htmlFor="candidatePhoto">Candidate Photo</label>
      <input
        type="file"
        id="candidatePhoto"
        name="candidatePhoto"
        accept="image/*"
        onChange={handleFileChange}
        required
      />
    </div>

    {selectedCompetition?.type === 'paid' && (
      <p className="razorpay-note">
        You will pay securely with Razorpay (test mode) after submitting this form.
      </p>
    )}

    <button type="submit" className="submit-btn" disabled={submitting}>
      {submitting ? 'Please wait...' : feeLabel}
    </button>
  </form>
      </div >
    </div >
  );
}

export default Registration;
