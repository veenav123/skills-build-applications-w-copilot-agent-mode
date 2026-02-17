import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyProfile, getMyStats, getRecentActivities } from '../services/api';

function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [profileRes, statsRes, activitiesRes] = await Promise.all([
        getMyProfile(),
        getMyStats(),
        getRecentActivities(7),
      ]);
      setProfile(profileRes.data);
      setStats(statsRes.data);
      setRecentActivities(activitiesRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Welcome, {profile?.username}!</h1>

      <div className="row">
        <div className="col-md-3 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Total Points</h5>
              <h2 className="text-primary">{profile?.total_points || 0}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Total Activities</h5>
              <h2 className="text-success">{stats?.total_activities || 0}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Total Duration</h5>
              <h2 className="text-info">{stats?.total_duration_minutes || 0}</h2>
              <p className="text-muted">minutes</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Total Distance</h5>
              <h2 className="text-warning">{stats?.total_distance_km || 0}</h2>
              <p className="text-muted">km</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title mb-0">Recent Activities</h5>
                <Link to="/activities" className="btn btn-primary btn-sm">
                  View All
                </Link>
              </div>
              {recentActivities.length === 0 ? (
                <p className="text-muted">No recent activities. Start logging your workouts!</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>Duration</th>
                        <th>Points</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentActivities.slice(0, 5).map((activity) => (
                        <tr key={activity._id}>
                          <td className="text-capitalize">{activity.activity_type.replace('_', ' ')}</td>
                          <td>{activity.duration_minutes} min</td>
                          <td>{activity.points_earned} pts</td>
                          <td>{new Date(activity.date).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-md-12">
          <div className="card bg-light">
            <div className="card-body">
              <h5 className="card-title">Quick Actions</h5>
              <div className="d-flex gap-2 flex-wrap">
                <Link to="/activities" className="btn btn-primary">
                  Log Activity
                </Link>
                <Link to="/teams" className="btn btn-success">
                  View Teams
                </Link>
                <Link to="/leaderboard" className="btn btn-info">
                  Leaderboard
                </Link>
                <Link to="/workouts" className="btn btn-warning">
                  Workout Suggestions
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
