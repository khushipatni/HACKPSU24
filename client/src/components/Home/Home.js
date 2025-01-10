import React, {useEffect} from 'react';
import './Home.css'
import logo from './Roadmap.png';
import expert from './expert.png';
import progress from './prog2.png';
import roadmap from './roadmap copy.png';
import { Button } from 'react-bootstrap';

const theme = {
    pageBgColor: '#f5f7fa', // Light gray-blue for the page background
    cardBgColor: '#ffffff', // White for the cards
    primaryAccentColor: '#f5f7fa', // Blue for key elements
    secondaryAccentColor: '#000', // Red for highlights
    tertiary: '#000', // Red for highlights
    textColor: '#333333', // Dark gray for primary text
    mutedTextColor: '#6c757d', // Muted gray for secondary text
  };

const Home = () => {
    
    const handleLogin = () => {
        window.location.href = 'http://localhost:5001/auth/google';
    };

    return (
        <div className="landing-page" style={{ backgroundColor: theme.pageBgColor, color: theme.textColor }}>
          <section className="hero" style={{ textAlign: 'center', padding: '5rem 1rem', color: 'white', backgroundColor: theme.primaryAccentColor }}>
            <h1>Your Career Journey Starts Here</h1>
            <p>Navigate your professional path with confidence</p>
          </section>
          
          <section className="features" style={{ display: 'flex', justifyContent: 'space-around', padding: '2rem 1rem' }}>
            <div className="feature">
              <img src={roadmap} alt="Personalized Roadmap" />
              <h2>Personalized Roadmap</h2>
              <p>Get a tailored career plan based on your skills and goals</p>
            </div>
            <div className="feature">
              <img src={expert} alt="Expert Guidance" />
              <h2>Expert Guidance</h2>
              <p>Access advice from industry professionals and professors through virtual connects</p>
            </div>
            <div className="feature">
              <img src={progress} alt="Progress Tracking" />
              <h2>Progress Tracking</h2>
              <p>Monitor your career growth and achievements to stay on track</p>
            </div>
          </section>

          <section className="cta" style={{ textAlign: 'center' }}>
            <h2>Ready to accelerate your career?</h2>
            <Button onClick={handleLogin} variant="outline-success" style={{ padding: '15px 30px', fontSize: '1.2rem', borderRadius: '5px', cursor: 'pointer' }}>
              Get Started
            </Button>
          </section>
          
          <footer style={{ textAlign: 'center', padding: '1rem', backgroundColor: theme.secondaryAccentColor, color: 'white' }}>
            <p>&copy; 2024 Major Decisions. All rights reserved.</p>
          </footer>
        </div>
      );
};

export default Home;