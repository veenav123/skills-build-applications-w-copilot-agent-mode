import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../octofitapp-small.png';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 text-center">
          <img src={logo} alt="OctoFit Tracker" style={{ maxWidth: '300px' }} className="mb-4" />
          <h1 className="display-4">Welcome to OctoFit Tracker</h1>
          <p className="lead">
            Track your fitness journey at Mergington High School
          </p>
          <p className="text-muted">
            A fitness tracking app designed for students and gym teachers to monitor 
            activities, set goals, and stay motivated together.
          </p>
          
          <div className="mt-5">
            <button 
              className="btn btn-primary btn-lg me-3"
              onClick={() => navigate('/register')}
            >
              Get Started
            </button>
            <button 
              className="btn btn-outline-primary btn-lg"
              onClick={() => navigate('/login')}
            >
              Login
            </button>
          </div>

          <div className="mt-5 row">
            <div className="col-md-4 mb-3">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">📊 Track Activities</h5>
                  <p className="card-text">
                    Log your workouts and monitor your progress over time.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">👥 Team Challenges</h5>
                  <p className="card-text">
                    Join teams and compete in friendly fitness challenges.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">🎯 Personal Goals</h5>
                  <p className="card-text">
                    Set and achieve personalized fitness goals.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
