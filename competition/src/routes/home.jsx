import React from 'react';
import { Link } from 'react-router-dom';
import { competitions } from '../data/competitions';
import heroImg from '../assets/art.jpg';

const womensCategories = ['Acting', 'Cooking', 'Fashion', 'Styling', 'Jewellery', 'Makeup', 'Craft'];

function Home() {
  const displayedCompetitions = competitions.filter(comp => womensCategories.includes(comp.category));
  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Empowering Women Through Creativity</h1>
          <p className="hero-subtitle">
            Join the ultimate platform dedicated to celebrating women's talents in art, fashion, culinary skills, and craftsmanship. 
            Compete, learn, and showcase your skills to the world.
          </p>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">25,000+</span>
              <span className="stat-label">Participants</span>
            </div>
            <div className="stat">
              <span className="stat-number">₹10L+</span>
              <span className="stat-label">Prize Pool</span>
            </div>
            <div className="stat">
              <span className="stat-number">100+</span>
              <span className="stat-label">Competitions</span>
            </div>
          </div>
        </div>
        <div className="hero-image">
          <img src={heroImg} alt="Women's Empowerment" />
        </div>
      </section>

      <section className="competitions-section">
        <header className="page-header">
          <h2 className="page-title">Upcoming Competitions</h2>
          <p className="page-subtitle">
            Discover categories where you can shine. From traditional arts to modern fashion, find your stage here.
          </p>
        </header>

        <div className="competitions-grid">
          {displayedCompetitions.map((comp) => (
            <div key={comp.id} className="competition-card">
              <div className="card-image">
                <img src={comp.image} alt={comp.title} />
              </div>
              <div className="card-header">
                <div className="title-group">
                  <h2 className="card-title">{comp.title}</h2>
                  <span className="category-tag">{comp.category}</span>
                </div>
                <span className={`badge ${comp.type}`}>
                  {comp.type === 'free' ? 'Free' : 'Premium'}
                </span>
              </div>
              
              <p className="card-description">{comp.description}</p>
              
              <div className="card-details">
                <div className="detail-item">
                  <span className="detail-label">Prize Pool</span>
                  <span className="detail-value">{comp.prize}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Deadline</span>
                  <span className="detail-value">{comp.deadline}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Participants</span>
                  <span className="detail-value">{comp.participants}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">{comp.type === 'paid' ? 'Entry Fee' : 'Cost'}</span>
                  <span className="detail-value" style={{ color: comp.type === 'paid' ? 'var(--accent-gold)' : 'var(--accent-green)' }}>
                    {comp.type === 'paid' ? comp.price : 'Free'}
                  </span>
                </div>
              </div>

              <Link 
                to="/registration" 
                state={{ competitionId: comp.id }}
                className="card-action"
              >
                {comp.type === 'free' ? 'Register Now' : 'Join & Proceed'}
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;