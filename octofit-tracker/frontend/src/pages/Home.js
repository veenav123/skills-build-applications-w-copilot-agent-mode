import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <div className="bg-primary text-white py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-3 fw-bold mb-4">Welcome to OctoFit Tracker</h1>
              <p className="lead mb-4">
                Track your fitness journey, compete with teams, and achieve your health goals with OctoFit Tracker.
              </p>
              <div className="d-flex gap-3">
                <Link to="/login" className="btn btn-light btn-lg">
                  Login
                </Link>
                <Link to="/register" className="btn btn-outline-light btn-lg">
                  Register
                </Link>
              </div>
            </div>
            <div className="col-lg-6 text-center mt-4 mt-lg-0">
              <img 
                src="/octofitapp-small.png" 
                alt="OctoFit Logo" 
                className="img-fluid"
                style={{ maxHeight: '300px' }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container my-5">
        <h2 className="text-center mb-5">Key Features</h2>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card h-100 text-center">
              <div className="card-body">
                <div className="mb-3">
                  <i className="bi bi-activity" style={{ fontSize: '3rem', color: '#0d6efd' }}></i>
                </div>
                <h5 className="card-title">Activity Tracking</h5>
                <p className="card-text">
                  Log your workouts, track duration, distance, and earn points for every activity you complete.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 text-center">
              <div className="card-body">
                <div className="mb-3">
                  <i className="bi bi-people" style={{ fontSize: '3rem', color: '#198754' }}></i>
                </div>
                <h5 className="card-title">Team Competition</h5>
                <p className="card-text">
                  Create or join teams, collaborate with friends, and compete against other teams for the top spot.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 text-center">
              <div className="card-body">
                <div className="mb-3">
                  <i className="bi bi-trophy" style={{ fontSize: '3rem', color: '#ffc107' }}></i>
                </div>
                <h5 className="card-title">Leaderboards</h5>
                <p className="card-text">
                  Track your progress and see how you rank against other users and teams on our competitive leaderboards.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 text-center">
              <div className="card-body">
                <div className="mb-3">
                  <i className="bi bi-calendar-check" style={{ fontSize: '3rem', color: '#dc3545' }}></i>
                </div>
                <h5 className="card-title">Workout Suggestions</h5>
                <p className="card-text">
                  Get personalized workout recommendations based on your fitness level and goals.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 text-center">
              <div className="card-body">
                <div className="mb-3">
                  <i className="bi bi-graph-up" style={{ fontSize: '3rem', color: '#0dcaf0' }}></i>
                </div>
                <h5 className="card-title">Progress Analytics</h5>
                <p className="card-text">
                  View detailed statistics about your activities, including total points, duration, and distance.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 text-center">
              <div className="card-body">
                <div className="mb-3">
                  <i className="bi bi-person-circle" style={{ fontSize: '3rem', color: '#6c757d' }}></i>
                </div>
                <h5 className="card-title">User Profiles</h5>
                <p className="card-text">
                  Customize your profile with fitness goals, preferences, and track your personal achievements.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-light py-5 mt-5">
        <div className="container text-center">
          <h2 className="mb-4">Ready to Start Your Fitness Journey?</h2>
          <p className="lead mb-4">
            Join thousands of users tracking their fitness and achieving their goals with OctoFit Tracker.
          </p>
          <Link to="/register" className="btn btn-primary btn-lg">
            Get Started Now
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
