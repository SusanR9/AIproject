import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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

  const openRazorpayCheckout = async (
    registration,
    competition
  ) => {

    const loaded = await loadRazorpayScript();

    if (!loaded || !window.Razorpay) {

      throw new Error(
        'Razorpay SDK failed to load'
      );
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

        theme: {
          color: '#7c3aed',
        },

        handler: async function (response) {

          try {

            await verifyRazorpayPayment({

              registration_id:
                registration.registration_id,

              razorpay_order_id:
                response.razorpay_order_id,

              razorpay_payment_id:
                response.razorpay_payment_id,

              razorpay_signature:
                response.razorpay_signature,

              amount: order.amount / 100,
            });

            resolve(response);

          } catch (err) {

            reject(err);
          }
        },

        modal: {

          ondismiss: function () {

            reject(
              new Error('Payment cancelled')
            );
          },
        },
      };

      const razorpayObject =
        new window.Razorpay(options);

      razorpayObject.on(
        'payment.failed',
        function (response) {

          reject(
            new Error(
              response.error?.description ||
              'Payment failed'
            )
          );
        }
      );

      razorpayObject.open();
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    setSubmitting(true);

    setError('');

    try {

      const payload = new FormData();

      payload.append('name', formData.name);

      payload.append('email', formData.email);

      payload.append('phone', formData.phone);

      payload.append('city', formData.city);

      payload.append(
        'bloodgroup',
        formData.bloodgroup
      );

      payload.append('age', formData.age);

      payload.append(
        'competition_id',
        String(formData.competitionId)
      );

      if (formData.identityProof) {

        payload.append(
          'identity_proof_file',
          formData.identityProof
        );
      }

      if (formData.candidatePhoto) {

        payload.append(
          'candidate_photo_file',
          formData.candidatePhoto
        );
      }

      console.log('Submitting registration...');

      const registration =
        await createRegistration(payload);

      console.log(
        'Registration response:',
        registration
      );

      if (
        !registration ||
        !registration.registration_id
      ) {

        throw new Error(
          registration?.error ||
          'Registration failed'
        );
      }

      // Paid competitions
      if (
        selectedCompetition &&
        selectedCompetition.type === 'paid'
      ) {

        await openRazorpayCheckout(
          registration,
          selectedCompetition
        );
      }

      alert('Registration Successful');

      window.location.href = '/';

    } catch (err) {

      console.error(err);

      setError(
        err.message ||
        'Registration failed. Please try again.'
      );

    } finally {

      setSubmitting(false);
    }
  };

  const feeLabel =
    selectedCompetition?.type === 'paid'
      ? `Pay ₹${(AMOUNT_PAISE[selectedCompetition.id] || 0) / 100
      }`
      : 'Complete Registration';

  return (
    <div className="registration-container">

      <div className="registration-form-container">

        <h1 className="form-title">
          Join the Competition
        </h1>

        <p className="form-subtitle">
          Register with secure Razorpay payment integration
        </p>

        {error && (
          <p
            className="form-error"
            style={{
              color: 'red',
              marginBottom: '15px',
            }}
          >
            {error}
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          className="registration-form"
        >

          <div className="form-group">

            <label>Select Competition</label>

            <select
              name="competitionId"
              value={formData.competitionId}
              onChange={handleChange}
              required
            >

              {competitions.map((comp) => (

                <option
                  key={comp.id}
                  value={comp.id}
                >

                  {comp.title} (
                  {comp.type === 'free'
                    ? 'Free'
                    : `Paid - ${comp.price}`})

                </option>
              ))}
            </select>
          </div>

          <div className="form-group">

            <label>Full Name</label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">

            <label>Email</label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">

            <label>Phone</label>

            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">

            <label>City</label>

            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">

            <label>Blood Group</label>

            <input
              type="text"
              name="bloodgroup"
              value={formData.bloodgroup}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">

            <label>Age</label>

            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">

            <label>Identity Proof</label>

            <input
              type="file"
              name="identityProof"
              accept="image/*"
              onChange={handleFileChange}
              required
            />
          </div>

          <div className="form-group">

            <label>Candidate Photo</label>

            <input
              type="file"
              name="candidatePhoto"
              accept="image/*"
              onChange={handleFileChange}
              required
            />
          </div>

          {selectedCompetition?.type === 'paid' && (

            <p className="razorpay-note">

              Secure Razorpay payment will open
              after registration.

            </p>
          )}

          <button
            type="submit"
            className="submit-btn"
            disabled={submitting}
          >

            {submitting
              ? 'Please wait...'
              : feeLabel}

          </button>
        </form>
      </div>
    </div>
  );
}

export default Registration;