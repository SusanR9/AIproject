import React from 'react';
import { Link } from 'react-router-dom';

function ThankYou() {
  return (
    <div className="thankyou-container">
      <div className="thankyou-content">
        <div className="success-icon">
          ✅
        </div>
        <h1 className="thankyou-title">Thank You!</h1>
        <p className="thankyou-message">
          Your registration has been successfully completed. Welcome to the competition!
        </p>

        <div className="thankyou-details">
          <h3>What happens next?</h3>
          <ul>
            <li>You will receive a confirmation email with competition details</li>
            <li>Join our Discord community for updates and networking</li>
            <li>Competition materials will be shared 48 hours before the event</li>
            <li>Check your email for important announcements</li>
          </ul>
        </div>

        <div className="thankyou-actions">
          <Link to="/" className="btn-primary">
            Back to Home
          </Link>
          <Link to="/registration" className="btn-secondary">
            Register for Another Competition
          </Link>
        </div>

        <div className="contact-info">
          <p>Need help? Contact us at <a href="mailto:support@competitionhub.com">support@competitionhub.com</a></p>
          <p>Phone: +91 98765 43210</p>
        </div>
      </div>
    </div>
  );
}

export default ThankYou;